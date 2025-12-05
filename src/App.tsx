import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import Bienvenue from './pages/bienv';
import SpinWheel from './pages/jeu';

function App() {
  const [currentPage, setCurrentPage] = useState<'bienv' | 'jeu'>('bienv');
  const [transitionData, setTransitionData] = useState<{
    isActive: boolean;
    x: number;
    y: number;
  }>({
    isActive: false,
    x: 0,
    y: 0,
  });

  const startTransition = (x: number, y: number, nextPage: 'bienv' | 'jeu') => {
    setTransitionData({ isActive: true, x, y });
    setTimeout(() => {
      setCurrentPage(nextPage);
      setTimeout(() => {
        setTransitionData(prev => ({ ...prev, isActive: false }));
      }, 100);
    }, 600);
  };

  const handleNavigateToGame = (x: number, y: number) => {
    startTransition(x, y, 'jeu');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Expanding Circle Transition with Gradient Background */}
      <AnimatePresence>
        {transitionData.isActive && (
          <motion.div
            className="fixed rounded-full pointer-events-none bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
            style={{
              left: transitionData.x,
              top: transitionData.y,
              zIndex: 9999,
            }}
            initial={{
              width: 0,
              height: 0,
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              width: '300vmax',
              height: '300vmax',
              x: '-50%',
              y: '-50%',
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        )}
      </AnimatePresence>

      {/* Pages with smooth fade */}
      <AnimatePresence mode="wait">
        {currentPage === 'bienv' && (
          <motion.div
            key="bienv"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
            className="w-full h-full"
          >
            <Bienvenue onNavigateToGame={handleNavigateToGame} />
          </motion.div>
        )}
        {currentPage === 'jeu' && (
          <motion.div
            key="jeu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
            className="w-full h-full"
          >
            <SpinWheel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;