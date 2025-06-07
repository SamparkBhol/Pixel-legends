import { initialGameData } from '@/components/rpg/gameData';

export const updatePlayerMovement = (keys, player, setPlayer, currentMapData, PLAYER_SIZE, canvasWidth, canvasHeight) => {
  if (!player) return;

  let { x, y, direction } = player;
  let isMoving = false;
  const speed = 3;

  let dx = 0;
  let dy = 0;

  if (keys['arrowup'] || keys['w']) {
    dy -= speed;
    direction = 'up';
  }
  if (keys['arrowdown'] || keys['s']) {
    dy += speed;
    direction = 'down';
  }
  if (keys['arrowleft'] || keys['a']) {
    dx -= speed;
    direction = 'left';
  }
  if (keys['arrowright'] || keys['d']) {
    dx += speed;
    direction = 'right';
  }
  
  isMoving = dx !== 0 || dy !== 0;

  let newX = x + dx;
  let newY = y + dy;

  let canMoveX = true;
  let canMoveY = true;

  if (currentMapData && currentMapData.obstacles) {
    for (const obstacle of currentMapData.obstacles) {
      const obsRect = {
        x: obstacle.x,
        y: obstacle.y,
        width: obstacle.width,
        height: obstacle.height,
      };

      if (
        newX < obsRect.x + obsRect.width &&
        newX + PLAYER_SIZE > obsRect.x &&
        y < obsRect.y + obsRect.height &&
        y + PLAYER_SIZE > obsRect.y
      ) {
        canMoveX = false;
      }

      if (
        x < obsRect.x + obsRect.width &&
        x + PLAYER_SIZE > obsRect.x &&
        newY < obsRect.y + obsRect.height &&
        newY + PLAYER_SIZE > obsRect.y
      ) {
        canMoveY = false;
      }
    }
  }
  
  if (!canMoveX) newX = x;
  if (!canMoveY) newY = y;

  newX = Math.max(0, Math.min(canvasWidth - PLAYER_SIZE, newX));
  newY = Math.max(0, Math.min(canvasHeight - PLAYER_SIZE, newY));

  setPlayer(prevPlayer => ({
    ...prevPlayer,
    x: newX,
    y: newY,
    direction,
    isMoving,
  }));
};

export const handleNpcInteractionLogic = (player, gameState, setGameState, PLAYER_SIZE) => {
  if (!player || !gameState || !gameState.npcs) return;

  for (const npc of gameState.npcs) {
    const distance = Math.sqrt(Math.pow(player.x - npc.x, 2) + Math.pow(player.y - npc.y, 2));
    if (distance < PLAYER_SIZE + (npc.width || PLAYER_SIZE) / 2 + 10) { // Interaction range
      setGameState(prev => ({
        ...prev,
        showDialogue: true,
        currentDialogueNpcName: npc.name,
        currentDialogue: npc.dialogue,
      }));
      return true; 
    }
  }
  return false;
};

export const handleItemCollectionLogic = (player, setPlayer, gameState, setGameState, toast, PLAYER_SIZE) => {
  if (!player || !gameState || !gameState.items) return false;

  let itemCollected = false;
  const remainingItems = gameState.items.filter(item => {
    const distance = Math.sqrt(Math.pow(player.x - item.x, 2) + Math.pow(player.y - item.y, 2));
    if (distance < PLAYER_SIZE / 2 + 10) { // Collection range
      setPlayer(prev => ({
        ...prev,
        inventory: [...(prev.inventory || []), item],
      }));
      toast({
        title: "Item Collected!",
        description: `You found a ${item.name}!`,
      });
      itemCollected = true;
      return false; // Remove item from world
    }
    return true; // Keep item
  });

  if (itemCollected) {
    setGameState(prev => ({
      ...prev,
      items: remainingItems,
    }));
  }
  return itemCollected;
};


export const checkEnemyEncounterLogic = (player, gameState, setCombatState, toast, PLAYER_SIZE) => {
  if (!player || !gameState || !gameState.enemies) return false;
  
  for (const enemy of gameState.enemies) {
      const distance = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2));
      if (distance < PLAYER_SIZE + (enemy.width || PLAYER_SIZE) / 2 + 20 ) { // Encounter trigger radius
          setCombatState({
              inCombat: true,
              enemy: { ...enemy }, // Store a copy of the enemy for combat
              playerTurn: true,
              log: [`Encountered a ${enemy.type}!`],
          });
          toast({
              title: "Combat Started!",
              description: `You encountered a ${enemy.type}!`,
          });
          return true; 
      }
  }
  return false;
};

export const processPlayerAttack = (player, setPlayer, combatState, setCombatState, gameState, setGameState, toast) => {
  if (!combatState.playerTurn || !combatState.enemy || !player) return;

  const playerDamage = Math.floor(Math.random() * (player.level * 5 + 10)) + 5; // Damage scales with level
  const updatedEnemyHealth = Math.max(0, combatState.enemy.health - playerDamage);

  const newCombatLog = [...(combatState.log || []), `Player attacks ${combatState.enemy.type} for ${playerDamage} damage.`];

  if (updatedEnemyHealth <= 0) {
    // Enemy defeated
    const expGained = combatState.enemy.experienceYield || 25;
    const newExp = player.experience + expGained;
    let newLevel = player.level;
    let levelUp = false;
    
    // Simple level up logic: 100 EXP per level
    if (newExp >= newLevel * 100) {
        newLevel++;
        levelUp = true;
    }
    
    setPlayer(prev => ({
      ...prev,
      experience: newExp,
      level: newLevel,
      // Potentially heal on level up or other bonuses
      health: levelUp ? prev.maxHealth : prev.health, 
    }));

    setGameState(prevGameState => ({
      ...prevGameState,
      enemies: prevGameState.enemies.filter(e => e.id !== combatState.enemy.id),
    }));

    setCombatState({
      inCombat: false,
      enemy: null,
      playerTurn: true,
      log: [...newCombatLog, `${combatState.enemy.type} defeated! Gained ${expGained} EXP.`],
    });

    toast({
      title: "Victory!",
      description: `You defeated the ${combatState.enemy.type} and gained ${expGained} EXP!`,
    });

    if (levelUp) {
      toast({
        title: "Level Up!",
        description: `You reached level ${newLevel}! Stats increased!`,
      });
    }
  } else {
    // Enemy survives
    setCombatState(prev => ({
      ...prev,
      enemy: { ...prev.enemy, health: updatedEnemyHealth },
      playerTurn: false, // Switch to enemy's turn
      log: newCombatLog,
    }));

    // Trigger enemy's counter-attack after a short delay
    setTimeout(() => {
      handleEnemyAttack(player, setPlayer, combatState.enemy, setCombatState, toast);
    }, 1000); 
  }
};

// This function is called when it's the enemy's turn to attack.
// It needs `player` and `setPlayer` to update player's health.
export const handleEnemyAttack = (player, setPlayer, enemyData, setCombatState, toast) => {
  if (!player || !enemyData) {
    // If player is somehow null (e.g., after defeat and before proper reset) or no enemy, abort.
    setCombatState(prev => ({ ...prev, playerTurn: true, log: [...(prev.log || []), "Enemy attack aborted (no target/attacker)."] }));
    return;
  }

  const enemyDamage = Math.floor(Math.random() * (enemyData.attackPower || 15)) + 5;
  const newPlayerHealth = Math.max(0, player.health - enemyDamage);

  setPlayer(prevPlayer => ({
    ...prevPlayer,
    health: newPlayerHealth,
  }));

  const newCombatLogEntry = `${enemyData.type} attacks Player for ${enemyDamage} damage.`;

  if (newPlayerHealth <= 0) {
    toast({ title: "Defeat!", description: "You have been defeated! Game Over or Respawn." });
    // Handle player defeat (e.g., show game over screen, navigate, or respawn)
    // For now, just log and end combat. Respawn logic would be more complex.
    setPlayer(prevPlayer => ({
      ...prevPlayer,
      health: 0, // Player is defeated
      // Consider resetting position or other states for a respawn mechanic
      // x: initialGameData.player.x, 
      // y: initialGameData.player.y,
      // health: prevPlayer.maxHealth, // For respawn
    }));
    setCombatState(prev => ({ 
      ...prev, 
      inCombat: false, 
      enemy: null, 
      playerTurn: true, 
      log: [...(prev.log || []), newCombatLogEntry, "Player has been defeated!"] 
    }));
    // Potentially navigate to a game over screen or trigger a game reset action
  } else {
    // Player survives, switch back to player's turn
    setCombatState(prev => ({
      ...prev,
      playerTurn: true,
      log: [...(prev.log || []), newCombatLogEntry, "Player's turn."],
    }));
  }
};

export const saveGameDataToLocalStorage = (gameName, playerData, gameState) => {
  const dataToSave = {
    player: {
      x: playerData.x,
      y: playerData.y,
      health: playerData.health,
      maxHealth: playerData.maxHealth,
      level: playerData.level,
      experience: playerData.experience,
      inventory: playerData.inventory,
      direction: playerData.direction,
    },
    gameState: { // Save only essential parts of gameState if needed
      currentMap: gameState.currentMap,
      // Potentially save NPC states, ongoing quests, defeated enemies if persistent
      // For simplicity, we are not saving enemy/item states here, they reset on load
    },
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(gameName, JSON.stringify(dataToSave));
};

export const loadGameDataFromLocalStorage = (gameName) => {
  const savedData = localStorage.getItem(gameName);
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.error("Failed to parse saved game data:", error);
      return null;
    }
  }
  return null;
};