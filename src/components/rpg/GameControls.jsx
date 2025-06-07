import React from 'react';
import { motion } from 'framer-motion';

const GameControls = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 text-white text-sm z-30"
  >
    <h3 className="font-bold mb-2 text-base">Controls:</h3>
    <div className="space-y-1">
      <div><span className="font-semibold text-green-400">WASD / Arrow Keys:</span> Move</div>
      <div><span className="font-semibold text-green-400">Space:</span> Interact</div>
      <div><span className="font-semibold text-green-400">I:</span> Inventory</div>
      <div><span className="font-semibold text-green-400">M:</span> Map</div>
    </div>
  </motion.div>
);

export default GameControls;