import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/components/HomePage';
import GameHub from '@/components/GameHub';
import RPGGame from '@/components/RPGGame';
import { initialPlayerState } from '@/components/rpg/gameData';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [gameData, setGameData] = useState({
    playerName: initialPlayerState.playerName,
    level: initialPlayerState.level,
    experience: initialPlayerState.experience,
    health: initialPlayerState.health,
    maxHealth: initialPlayerState.maxHealth,
    inventory: initialPlayerState.inventory,
    position: { x: initialPlayerState.x, y: initialPlayerState.y },
    questsCompleted: 0,
    player: initialPlayerState, 
    gameState: null 
  });

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleGameDataUpdate = (newData) => {
    setGameData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            className="flex-grow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <HomePage onNavigate={handleViewChange} />
          </motion.div>
        )}
        
        {currentView === 'hub' && (
          <motion.div
            key="hub"
            className="flex-grow"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <GameHub 
              onNavigate={handleViewChange} 
              gameData={gameData}
              onGameDataUpdate={handleGameDataUpdate}
            />
          </motion.div>
        )}
        
        {currentView === 'game' && (
          <motion.div
            key="game"
            className="flex-grow flex flex-col"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <RPGGame 
              onNavigate={handleViewChange}
              gameData={gameData}
              onGameDataUpdate={handleGameDataUpdate}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Toaster />
    </div>
  );
}

export default App;