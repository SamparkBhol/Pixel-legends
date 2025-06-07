
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, User, Trophy, ArrowLeft, Save, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const GameHub = ({ onNavigate, gameData, onGameDataUpdate }) => {
  const [playerName, setPlayerName] = useState(gameData.playerName || '');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load saved game data from localStorage
    const savedData = localStorage.getItem('pixelLegendsGameData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      onGameDataUpdate(parsed);
      setPlayerName(parsed.playerName || '');
    }
  }, [onGameDataUpdate]);

  const handleStartGame = () => {
    if (!playerName.trim()) {
      toast({
        title: "Enter Your Name",
        description: "Please enter a hero name to begin your adventure!",
        variant: "destructive"
      });
      return;
    }

    const updatedData = { ...gameData, playerName: playerName.trim() };
    onGameDataUpdate(updatedData);
    localStorage.setItem('pixelLegendsGameData', JSON.stringify(updatedData));
    
    toast({
      title: "Adventure Begins!",
      description: `Welcome, ${playerName}! Your legend starts now.`
    });
    
    onNavigate('game');
  };

  const handleSaveGame = () => {
    const dataToSave = { ...gameData, playerName };
    localStorage.setItem('pixelLegendsGameData', JSON.stringify(dataToSave));
    toast({
      title: "Game Saved",
      description: "Your progress has been saved successfully!"
    });
  };

  const statsCards = [
    { label: 'Level', value: gameData.level, icon: '⭐' },
    { label: 'Experience', value: gameData.experience, icon: '💎' },
    { label: 'Health', value: `${gameData.health}/${gameData.maxHealth}`, icon: '❤️' },
    { label: 'Quests', value: gameData.questsCompleted, icon: '🏆' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pixel-grid opacity-10" />
      
      {/* Floating Elements */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-green-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="outline"
            onClick={() => onNavigate('home')}
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-bold text-gradient">Game Hub</h1>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Game Panel */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Game Preview */}
            <div className="bg-black/40 backdrop-blur-sm border border-green-400/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Play className="w-6 h-6 mr-2 text-green-400" />
                Pixel Legends RPG
              </h2>
              
              <div className="aspect-video bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg mb-4 flex items-center justify-center border-2 border-green-400/20">
                <img  alt="RPG game preview showing pixelated fantasy world" src="https://images.unsplash.com/photo-1564110032277-ef9e302d5fa2" />
              </div>
              
              <p className="text-gray-300 mb-6">
                Embark on an epic journey through mystical lands filled with dangerous creatures, 
                ancient treasures, and legendary quests. Master the art of combat, explore vast 
                dungeons, and become the hero of legend!
              </p>

              {/* Player Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hero Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your hero's name..."
                  className="w-full px-4 py-2 bg-black/50 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
                  maxLength={20}
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleStartGame}
                  className="retro-button text-white font-bold flex-1 flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>START GAME</span>
                </Button>
                
                <Button
                  onClick={handleSaveGame}
                  variant="outline"
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Game Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Open World",
                  description: "Explore vast landscapes and hidden secrets",
                  icon: "🗺️"
                },
                {
                  title: "Epic Combat",
                  description: "Master weapons and magical abilities",
                  icon: "⚔️"
                },
                {
                  title: "Rich Quests",
                  description: "Complete challenging missions and puzzles",
                  icon: "📜"
                },
                {
                  title: "Character Growth",
                  description: "Level up and customize your hero",
                  icon: "📈"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-black/30 backdrop-blur-sm border border-green-400/20 rounded-lg p-4 card-hover"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Player Stats */}
            <div className="bg-black/40 backdrop-blur-sm border border-green-400/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-400" />
                Player Stats
              </h3>
              
              <div className="space-y-4">
                {statsCards.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300 flex items-center">
                      <span className="mr-2">{stat.icon}</span>
                      {stat.label}
                    </span>
                    <span className="text-white font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Health Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Health</span>
                  <span>{gameData.health}/{gameData.maxHealth}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="health-bar h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(gameData.health / gameData.maxHealth) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-black/40 backdrop-blur-sm border border-green-400/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-green-400" />
                Achievements
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: "First Steps", completed: gameData.level >= 1, icon: "👣" },
                  { name: "Explorer", completed: gameData.questsCompleted >= 1, icon: "🗺️" },
                  { name: "Warrior", completed: gameData.level >= 5, icon: "⚔️" },
                  { name: "Legend", completed: gameData.level >= 10, icon: "👑" }
                ].map((achievement, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-2 rounded ${
                      achievement.completed ? 'bg-green-900/30' : 'bg-gray-800/30'
                    }`}
                  >
                    <span className="text-lg">{achievement.icon}</span>
                    <span className={`text-sm ${
                      achievement.completed ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </span>
                    {achievement.completed && (
                      <span className="text-green-400 text-xs">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black/40 backdrop-blur-sm border border-green-400/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                  onClick={() => {
                    const newData = {
                      playerName: '',
                      level: 1,
                      experience: 0,
                      health: 100,
                      maxHealth: 100,
                      inventory: [],
                      position: { x: 400, y: 300 },
                      questsCompleted: 0
                    };
                    onGameDataUpdate(newData);
                    setPlayerName('');
                    localStorage.removeItem('pixelLegendsGameData');
                    toast({
                      title: "Game Reset",
                      description: "Your progress has been reset. Start a new adventure!"
                    });
                  }}
                >
                  New Game
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
                  onClick={() => {
                    const savedData = localStorage.getItem('pixelLegendsGameData');
                    if (savedData) {
                      const parsed = JSON.parse(savedData);
                      onGameDataUpdate(parsed);
                      setPlayerName(parsed.playerName || '');
                      toast({
                        title: "Game Loaded",
                        description: "Your saved progress has been loaded!"
                      });
                    } else {
                      toast({
                        title: "No Save Found",
                        description: "No saved game data found.",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  Load Game
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GameHub;
