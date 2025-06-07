import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InventoryInterface = ({ inventory, onClose }) => (
  <AnimatePresence>
    {inventory && (
      <motion.div
        className="fixed top-20 right-4 bg-black/90 backdrop-blur-md border border-blue-400/50 rounded-xl p-6 w-80 z-40 shadow-2xl"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white z-50">
          &times;
        </button>
        <h3 className="text-xl font-bold text-white mb-4 tracking-wide">Inventory</h3>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 16 }).map((_, i) => {
            const item = inventory[i];
            return (
              <div
                key={i}
                title={item ? item.name : 'Empty Slot'}
                className={`inventory-slot w-14 h-14 flex items-center justify-center text-lg font-bold rounded-md transition-all duration-200
                  ${item ? 'text-white bg-green-600/30 border-green-500 hover:bg-green-500/40' : 'text-gray-500 bg-slate-700/50 border-slate-600'}`}
              >
                {item ? item.name.charAt(0).toUpperCase() : ''}
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-gray-300">
          Items: <span className="font-semibold text-white">{inventory.length}</span>/16
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default InventoryInterface;