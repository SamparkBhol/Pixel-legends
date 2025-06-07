import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Gamepad2, Sword, Shield, Crown, Sparkles, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = ({ onNavigate }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setIsLoaded(true);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxOffset = {
    x: (mousePosition.x - window.innerWidth / 2) * 0.01,
    y: (mousePosition.y - window.innerHeight / 2) * 0.01,
  };

  return (
    <div className="relative min-h-screen overflow-hidden hero-gradient">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 pixel-grid opacity-20" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="text-center space-y-8"
          style={{
            transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Logo/Title */}
          <motion.div
            className="space-y-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-16 h-16 text-green-400" />
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-bold text-gradient">
                PIXEL
              </h1>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <Sword className="w-16 h-16 text-green-400" />
              </motion.div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gradient">
              LEGENDS
            </h2>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              Embark on an epic adventure in a world of pixels, magic, and endless possibilities
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <Button
              onClick={() => onNavigate('hub')}
              className="retro-button text-white font-bold text-lg px-8 py-4 flex items-center space-x-3 group"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>START ADVENTURE</span>
              <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </Button>
            
            <a
              href="https://github.com/SamparkBhol"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-lg font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-8 py-4 group"
            >
              <Github className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              <span>MY GITHUB</span>
            </a>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            {[
              {
                icon: Sword,
                title: "Epic Combat",
                description: "Master the art of battle with dynamic combat system"
              },
              {
                icon: Shield,
                title: "Rich Exploration",
                description: "Discover vast worlds filled with secrets and treasures"
              },
              {
                icon: Crown,
                title: "Legendary Quests",
                description: "Complete challenging quests and become a legend"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card-hover bg-black/30 backdrop-blur-sm border border-green-400/30 rounded-lg p-6 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <feature.icon className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Decoration */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      />
    </div>
  );
};

export default HomePage;