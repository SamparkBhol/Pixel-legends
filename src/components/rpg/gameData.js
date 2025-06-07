export const initialPlayerState = {
  x: 400,
  y: 300,
  size: 20,
  direction: 'down',
  isMoving: false,
  health: 100,
  maxHealth: 100,
  level: 1,
  experience: 0,
  inventory: [],
  speed: 3, 
  playerName: "Hero"
};

export const initialGameState = {
  currentMap: 'forest',
  npcs: [
    { id: 1, x: 200, y: 200, name: 'Village Elder', dialogue: 'Welcome, brave adventurer! The forest holds many secrets. Use WASD or Arrow Keys to move, Space to interact, I for Inventory, and M for Map.' },
    { id: 2, x: 600, y: 400, name: 'Merchant', dialogue: 'I have rare items for sale! Come back when you have gold.' },
    { id: 3, x: 300, y: 500, name: 'Wise Sage', dialogue: 'Knowledge is the greatest treasure. Seek the ancient ruins to the north.' }
  ],
  enemies: [
    { id: 1, x: 500, y: 200, type: 'goblin', health: 30, maxHealth: 30, size: 20, attackPower: 10, experienceYield: 15 },
    { id: 2, x: 700, y: 300, type: 'orc', health: 50, maxHealth: 50, size: 20, attackPower: 18, experienceYield: 30 }
  ],
  items: [
    { id: 1, x: 150, y: 350, type: 'potion', name: 'Health Potion', size: 16 },
    { id: 2, x: 650, y: 150, type: 'sword', name: 'Iron Sword', size: 16 },
    { id: 3, x: 400, y: 600, type: 'key', name: 'Ancient Key', size: 16 }
  ],
  showDialogue: false,
  currentDialogue: '',
  currentDialogueNpcName: '',
  showInventory: false,
  showMap: false,
};

export const initialCombatState = {
  inCombat: false,
  enemy: null,
  playerTurn: true,
  log: [],
};

export const initialGameData = {
    player: initialPlayerState,
    gameState: initialGameState,
    combatState: initialCombatState,
};


export const mapsData = {
  forest: {
    name: 'Enchanted Forest',
    background: '#2d5016',
    obstacles: [
      { x: 100, y: 100, width: 80, height: 80, type: 'tree' },
      { x: 300, y: 150, width: 60, height: 60, type: 'rock' },
      { x: 500, y: 350, width: 100, height: 60, type: 'log' },
      { x: 200, y: 450, width: 80, height: 80, type: 'tree' },
      { x: 650, y: 500, width: 70, height: 90, type: 'tree' },
      { x: 50, y: 300, width: 50, height: 50, type: 'rock' },
    ],
    worldBounds: { minX: 0, minY: 0, maxX: 800, maxY: 600 } 
  },
  village: {
    name: 'Pixelwood Village',
    background: '#a08060',
    obstacles: [
        { x: 150, y: 150, width: 100, height: 80, type: 'house' },
        { x: 400, y: 200, width: 120, height: 100, type: 'house' },
        { x: 600, y: 450, width: 80, height: 60, type: 'well' },
    ],
    worldBounds: { minX: 0, minY: 0, maxX: 800, maxY: 600 }
  }
};

export const PLAYER_SIZE = 20;
export const TILE_SIZE = 40;