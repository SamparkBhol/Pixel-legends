import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sword, Shield, Heart } from 'lucide-react';
import { processPlayerAttack } from '@/components/rpg/gameLogic';

const CombatInterface = ({ player, setPlayer, combatState, setCombatState, gameState, setGameState, toast }) => {
  if (!combatState.inCombat || !combatState.enemy) return null;

  const handleAttack = () => {
    processPlayerAttack(player, setPlayer, combatState, setCombatState, gameState, setGameState, toast);
  };

  const handleFlee = () => {
    if (Math.random() > 0.5) { // 50% chance to flee
      toast({ title: "Fled!", description: "You successfully fled from combat." });
      setCombatState({ inCombat: false, enemy: null, playerTurn: true, log: [] });
    } else {
      toast({ title: "Failed to Flee!", description: `${combatState.enemy.type} blocked your escape!` });
      setCombatState(prev => ({ ...prev, playerTurn: false, log: [...(prev.log || []), "Failed to flee! Enemy's turn."] }));
      // Enemy gets a free attack if flee fails
      setTimeout(() => {
        // Simplified enemy attack, ideally call a shared logic function
        const enemyDamage = Math.floor(Math.random() * (combatState.enemy.attackPower || 15)) + 5;
        setPlayer(prevP => ({...prevP, health: Math.max(0, prevP.health - enemyDamage)}));
        setCombatState(prev => ({ ...prev, playerTurn: true, log: [...(prev.log || []), `${combatState.enemy.type} attacks! Player takes ${enemyDamage} damage.`] }));
        if(player.health - enemyDamage <= 0) {
            toast({title: "Defeated!", description: "You were defeated while trying to flee."});
             setCombatState({ inCombat: false, enemy: null, playerTurn: true, log: [] });
        }
      }, 1000);
    }
  };


  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-slate-800 border border-red-500 rounded-lg p-6 max-w-lg w-full shadow-2xl"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Combat with <span className="text-red-400 capitalize">{combatState.enemy.type}</span>!
        </h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Player Stats */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-400 mb-2">{player.playerName || "Player"}</h3>
            <div className="flex items-center justify-center text-white mb-1">
              <Heart className="w-5 h-5 text-red-400 mr-2" /> Health: {player.health}/{player.maxHealth}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-600">
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
              />
            </div>
            <p className="text-sm text-yellow-400 mt-1">Level: {player.level}</p>
          </div>

          {/* Enemy Stats */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-red-400 mb-2 capitalize">{combatState.enemy.type}</h3>
             <div className="flex items-center justify-center text-white mb-1">
              <Heart className="w-5 h-5 text-red-400 mr-2" /> Health: {combatState.enemy.health}/{combatState.enemy.maxHealth}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-600">
              <div 
                className="bg-red-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(combatState.enemy.health / combatState.enemy.maxHealth) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Combat Log */}
        {combatState.log && combatState.log.length > 0 && (
          <div className="mb-6 p-3 bg-slate-700/50 rounded-md max-h-24 overflow-y-auto text-sm text-gray-300 border border-slate-600">
            {combatState.log.map((entry, index) => (
              <p key={index} className="mb-1">{entry}</p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-around space-x-4">
          <Button
            onClick={handleAttack}
            disabled={!combatState.playerTurn}
            className="retro-button text-white font-bold flex-1 flex items-center justify-center space-x-2 py-3 px-6 text-lg"
          >
            <Sword className="w-5 h-5" />
            <span>Attack</span>
          </Button>
          
          <Button
            onClick={handleFlee}
            disabled={!combatState.playerTurn}
            variant="outline"
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black flex-1 flex items-center justify-center space-x-2 py-3 px-6 text-lg"
          >
            <Shield className="w-5 h-5" />
            <span>Flee</span>
          </Button>
        </div>

        {!combatState.playerTurn && combatState.inCombat && (
          <div className="text-center text-yellow-400 mt-4 animate-pulse">
            {combatState.enemy.type}'s turn...
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CombatInterface;