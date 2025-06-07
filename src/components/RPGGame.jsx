import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Package, Map as MapIcon, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import Player from '@/components/rpg/Player';
import NPC from '@/components/rpg/NPC';
import Enemy from '@/components/rpg/Enemy';
import Item from '@/components/rpg/Item';
import GameControls from '@/components/rpg/GameControls';
import CombatInterface from '@/components/rpg/CombatInterface';
import DialogueInterface from '@/components/rpg/DialogueInterface';
import InventoryInterface from '@/components/rpg/InventoryInterface';
import MapInterface from '@/components/rpg/MapInterface';
import { initialGameData, mapsData, PLAYER_SIZE } from '@/components/rpg/gameData';
import { 
  updatePlayerMovement, 
  handleNpcInteractionLogic,
  handleItemCollectionLogic,
  checkEnemyEncounterLogic,
  saveGameDataToLocalStorage,
  loadGameDataFromLocalStorage
} from '@/components/rpg/gameLogic';

const RPGGame = ({ onNavigate, gameData: hubGameData, onGameDataUpdate: onHubGameDataUpdate }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const keysRef = useRef({});
  const [isLoaded, setIsLoaded] = useState(false);

  const [player, setPlayer] = useState(() => {
    const basePlayer = JSON.parse(JSON.stringify(initialGameData.player)); // Deep copy
    const hubPlayer = hubGameData && hubGameData.player ? JSON.parse(JSON.stringify(hubGameData.player)) : {};
    return {
        ...basePlayer,
        ...hubPlayer,
        playerName: hubGameData.playerName || basePlayer.playerName,
    };
  });

  const [gameState, setGameState] = useState(() => {
    const baseGameState = JSON.parse(JSON.stringify(initialGameData.gameState)); // Deep copy
    const hubGameState = hubGameData && hubGameData.gameState ? JSON.parse(JSON.stringify(hubGameData.gameState)) : {};
    return {
        ...baseGameState,
        ...hubGameState,
    };
  });
  
  const [combatState, setCombatState] = useState(JSON.parse(JSON.stringify(initialGameData.combatState)));
  
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });


  useEffect(() => {
    const gameSaveName = `pixelLegendsSave_${player.playerName || "default"}`;
    const loadedData = loadGameDataFromLocalStorage(gameSaveName);
    if (loadedData && loadedData.player && loadedData.gameState) {
      setPlayer(prev => ({ ...prev, ...loadedData.player }));
      setGameState(prev => ({ 
        ...prev, 
        currentMap: loadedData.gameState.currentMap || initialGameData.gameState.currentMap,
        npcs: loadedData.gameState.npcs || initialGameData.gameState.npcs,
        enemies: loadedData.gameState.enemies || initialGameData.gameState.enemies,
        items: loadedData.gameState.items || initialGameData.gameState.items,
       }));
      toast({ title: "Game Loaded", description: "Previously saved game data loaded."});
    }
    setIsLoaded(true);
  }, [player.playerName]);


  const currentMapData = mapsData[gameState.currentMap] || mapsData.forest; // Fallback to forest

  const gameTick = useCallback(() => {
    if (combatState.inCombat || !isLoaded || !player || !gameState) return;

    updatePlayerMovement(keysRef.current, player, setPlayer, currentMapData, PLAYER_SIZE, canvasSize.width, canvasSize.height);
    
    if (!combatState.inCombat) {
        checkEnemyEncounterLogic(player, gameState, setCombatState, toast, PLAYER_SIZE);
    }

  }, [player, gameState, combatState.inCombat, currentMapData, isLoaded, canvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded || !currentMapData || !player || !gameState || !gameState.items || !gameState.npcs || !gameState.enemies) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');

    const renderLoop = () => {
      if(!ctx || !currentMapData || !player || !gameState) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = currentMapData.background || '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (currentMapData.obstacles) {
        currentMapData.obstacles.forEach(obs => {
          ctx.fillStyle = obs.type === 'tree' ? '#1a4d1a' : obs.type === 'rock' ? '#666666' : '#8B4513';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
      }

      gameState.items.forEach(item => Item.render(ctx, item));
      gameState.npcs.forEach(npc => NPC.render(ctx, npc));
      gameState.enemies.forEach(enemy => Enemy.render(ctx, enemy));
      Player.render(ctx, player);
      
      gameLoopRef.current = requestAnimationFrame(renderLoop);
    };

    if (isLoaded) {
      renderLoop();
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [player, gameState, currentMapData, isLoaded, canvasSize]);


  useEffect(() => {
    if (!isLoaded) return;
    const intervalId = setInterval(gameTick, 1000 / 60); 
    return () => clearInterval(intervalId);
  }, [gameTick, isLoaded]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if(!player || !gameState) return;
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' && !combatState.inCombat && !gameState.showDialogue) {
        e.preventDefault();
        if(!handleNpcInteractionLogic(player, gameState, setGameState, PLAYER_SIZE)){
            handleItemCollectionLogic(player, setPlayer, gameState, setGameState, toast, PLAYER_SIZE);
        }
      }
      if (e.key.toLowerCase() === 'i') setGameState(prev => ({ ...prev, showInventory: !prev.showInventory }));
      if (e.key.toLowerCase() === 'm') setGameState(prev => ({ ...prev, showMap: !prev.showMap }));
    };
    const handleKeyUp = (e) => keysRef.current[e.key.toLowerCase()] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player, gameState, combatState.inCombat]);

  const handleSaveGame = () => {
    if(!player || !gameState) return;
    const gameSaveName = `pixelLegendsSave_${player.playerName || "default"}`;
    saveGameDataToLocalStorage(gameSaveName, player, gameState);
    onHubGameDataUpdate({ 
        ...hubGameData, 
        player: { ...player }, 
        gameState: { currentMap: gameState.currentMap, npcs: gameState.npcs, enemies: gameState.enemies, items: gameState.items } 
    });
    toast({ title: "Game Saved", description: "Your progress has been saved!" });
  };

  if (!isLoaded || !player || !gameState || !currentMapData) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-2xl">Loading Game...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-black/80 backdrop-blur-sm border-b border-green-400/30 p-3 mb-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => { handleSaveGame(); onNavigate('hub'); }}
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Hub
          </Button>
          <h1 className="text-xl font-bold text-white">{player.playerName} - {currentMapData.name}</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setGameState(prev => ({...prev, showInventory: !prev.showInventory}))} className="border-blue-400 text-blue-400"><Package className="w-4 h-4"/></Button>
            <Button variant="outline" onClick={() => setGameState(prev => ({...prev, showMap: !prev.showMap}))} className="border-purple-400 text-purple-400"><MapIcon className="w-4 h-4"/></Button>
            <Button variant="outline" onClick={handleSaveGame} className="border-yellow-400 text-yellow-400"><SettingsIcon className="w-4 h-4"/></Button>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="game-canvas pixel-art rounded-lg" />
      <GameControls />

      <AnimatePresence>
        {combatState.inCombat && combatState.enemy && (
          <CombatInterface
            player={player}
            setPlayer={setPlayer}
            combatState={combatState}
            setCombatState={setCombatState}
            gameState={gameState}
            setGameState={setGameState}
            toast={toast}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {gameState.showDialogue && (
          <DialogueInterface
            npcName={gameState.currentDialogueNpcName}
            dialogue={gameState.currentDialogue}
            onClose={() => setGameState(prev => ({ ...prev, showDialogue: false }))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState.showInventory && player && (
          <InventoryInterface
            inventory={player.inventory}
            onClose={() => setGameState(prev => ({ ...prev, showInventory: false }))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState.showMap && player && currentMapData && (
          <MapInterface
            currentMap={currentMapData}
            player={player}
            npcs={gameState.npcs}
            enemies={gameState.enemies}
            canvasSize={canvasSize}
            onClose={() => setGameState(prev => ({ ...prev, showMap: false }))}
            gameState={gameState}
            mapsData={mapsData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RPGGame;