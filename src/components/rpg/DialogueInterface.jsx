import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const DialogueInterface = ({ npcName, dialogue, onClose }) => (
  <AnimatePresence>
    {dialogue && (
      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto px-4 z-40"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="dialog-box text-white p-6 rounded-lg shadow-xl">
          {npcName && <p className="font-bold text-lg text-green-400 mb-2">{npcName}:</p>}
          <p className="text-lg mb-4 leading-relaxed typewriter">{dialogue}</p>
          <Button
            onClick={onClose}
            className="retro-button text-white font-bold px-6 py-2 text-base"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default DialogueInterface;