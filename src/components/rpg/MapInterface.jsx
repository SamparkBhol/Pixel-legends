import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MapInterface = ({ currentMap, player, npcs, enemies, canvasSize, onClose, gameState, mapsData }) => (
  <AnimatePresence>
    {gameState.showMap && (
      <motion.div
        className="fixed top-20 left-4 bg-black/90 backdrop-blur-md border border-purple-400/50 rounded-xl p-6 w-80 z-40 shadow-2xl"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white z-50">
          &times;
        </button>
        <h3 className="text-xl font-bold text-white mb-4 tracking-wide">World Map</h3>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 aspect-square relative overflow-hidden">
          <div className="text-center text-green-400 font-bold mb-2 text-sm">
            {currentMap.name || mapsData[gameState.currentMap].name}
          </div>
          
          <div
            className="absolute w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-lg"
            style={{
              left: `${(player.x / (canvasSize?.width || 800)) * 100}%`,
              top: `${(player.y / (canvasSize?.height || 600)) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
            title="Your Position"
          />
          
          {npcs.map(npc => (
            <div
              key={`map-npc-${npc.id}`}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full border border-white/50"
              style={{
                left: `${(npc.x / (canvasSize?.width || 800)) * 100}%`,
                top: `${(npc.y / (canvasSize?.height || 600)) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={npc.name}
            />
          ))}
          
          {enemies.map(enemy => (
            <div
              key={`map-enemy-${enemy.id}`}
              className="absolute w-2 h-2 bg-red-500 rounded-full border border-white/50"
              style={{
                left: `${(enemy.x / (canvasSize?.width || 800)) * 100}%`,
                top: `${(enemy.y / (canvasSize?.height || 600)) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={enemy.type}
            />
          ))}
           {gameState.items.map(item => (
            <div
              key={`map-item-${item.id}`}
              className="absolute w-1.5 h-1.5 bg-teal-400 rounded-sm"
              style={{
                left: `${(item.x / (canvasSize?.width || 800)) * 100}%`,
                top: `${(item.y / (canvasSize?.height || 600)) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={item.name}
            />
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-300 space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full border border-white"></div>
            <span>Player</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full border border-white/50"></div>
            <span>NPCs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full border border-white/50"></div>
            <span>Enemies</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-teal-400 rounded-sm"></div>
            <span>Items</span>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default MapInterface;