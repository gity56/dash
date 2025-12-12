import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Prize {
  name: string;
  probability: number;
  color: string;
  rarity: string;
}

const prizes: Prize[] = [
  { name: 'Caprisun', probability: 85, color: '#FCD34D', rarity: '' },
  { name: 'Red Bull', probability: 2, color: '#EF4444', rarity: '' },
  { name: 'Tacos Market', probability: 0.7, color: '#F97316', rarity: '' },
  { name: 'Tacos Tenders', probability: 0.7, color: '#FB923C', rarity: '' },
  { name: 'Panini Nutella', probability: 2, color: '#A78BFA', rarity: '' },
  { name: 'Panini Spéculos', probability: 2, color: '#C084FC', rarity: '' },
  { name: 'Canette classique', probability: 2, color: '#60A5FA', rarity: '' },
  { name: 'Pizza junior', probability: 0.3, color: '#EC4899', rarity: '' },
  { name: 'Kinder Bueno', probability: 2, color: '#34D399', rarity: '' },
  { name: 'Tiramisu', probability: 0.7, color: '#FBBF24', rarity: '' },
  { name: 'Bonbon au choix', probability: 2, color: '#F472B6', rarity: '' },
  { name: 'Chewing-gum', probability: 2, color: '#2DD4BF', rarity: '' },
  { name: 'Franuit', probability: 0.3, color: '#818CF8', rarity: '' },
  { name: "Bon d'achat 5€", probability: 0.3, color: '#10B981', rarity: '' },
  { name: "Bon d'achat 50€", probability: 0, color: '#F59E0B', rarity: '' },
];

const SpinWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const selectPrize = () => {
    const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);
    const random = Math.random() * totalProbability;
    let cumulative = 0;
    
    for (let prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize;
      }
    }
    return prizes[0];
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);

    const selectedPrize = selectPrize();
    setWonPrize(selectedPrize);
    
    const prizeIndex = prizes.findIndex(p => p.name === selectedPrize.name);
    const segmentAngle = 360 / prizes.length;
    const segmentCenterAngle = prizeIndex * segmentAngle + (segmentAngle / 2);
    const targetAngle = -segmentCenterAngle;
    const baseSpins = selectedPrize.probability > 10 ? 5 : selectedPrize.probability > 2 ? 7 : 10;
    const extraRotation = baseSpins * 360;
    const finalRotation = rotation + extraRotation + targetAngle - (rotation % 360);
    
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setShowResult(true);
    }, 5000);
  };

  const closeResult = () => {
    setShowResult(false);
    setWonPrize(null);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: '#000',
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 7px, #0000 7px),
            radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 7px, #0000 7px),
            radial-gradient(circle at 50% 50%, #f00, #f000 60%),
            radial-gradient(circle at 50% 50%, #ff0, #ff00 60%),
            radial-gradient(circle at 50% 50%, #0f0, #0f00 60%),
            radial-gradient(ellipse at 50% 50%, #00f, #00f0 60%)
          `,
          backgroundSize: `
            12px 20.7846097px,
            12px 20.7846097px,
            200% 200%,
            200% 200%,
            200% 200%,
            200% 20.7846097px
          `,
          backgroundPosition: `
            0px 0px,
            6px 10.39230485px,
            300% 300%,
            -400% -400%,
            200% 200%,
            100% 41.5692194px
          `,
          animation: 'wee 40s linear infinite, filt 6s linear infinite'
        }}
      />

      <style>{`
        @keyframes filt {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        
        @keyframes wee {
          0% {
            background-position:
              0px 0px,
              6px 10.39230485px,
              300% 300%,
              -400% -400%,
              200% 200%,
              100% 41.5692194px;
          }
          100% {
            background-position:
              0px 0px,
              6px 10.39230485px,
              0% 0%,
              0% 0%,
              0% 0%,
              0% 0%;
          }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-4 px-2 sm:px-4">
        <div className="flex flex-col items-center justify-center">
          
          <motion.h1 
            className="text-3xl sm:text-6xl md:text-7xl font-bold text-white mb-6 sm:mb-12 text-center drop-shadow-lg px-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Roue de la Fortune
          </motion.h1>

          <div className="relative mb-6 sm:mb-12">
            {/* Pointer Arrow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 sm:-translate-y-8 z-20">
              <div className="w-0 h-0 border-l-[25px] sm:border-l-[35px] border-l-transparent border-r-[25px] sm:border-r-[35px] border-r-transparent border-t-[50px] sm:border-t-[70px] border-t-red-500 drop-shadow-2xl"></div>
            </div>

            {/* Clickable Wheel */}
            <div 
              ref={wheelRef}
              onClick={spinWheel}
              className={`relative w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] md:w-[650px] md:h-[650px] lg:w-[750px] lg:h-[750px] rounded-full shadow-2xl ${
                !isSpinning ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
              } transition-transform duration-300`}
              style={{
                transform: `rotate(${rotation}deg) ${!isSpinning ? 'scale(1)' : 'scale(1)'}`,
                transition: isSpinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'transform 0.3s ease'
              }}
            >
              <div className="absolute inset-0 rounded-full border-[8px] sm:border-[12px] border-yellow-400 shadow-2xl"></div>
              
              {prizes.map((prize, index) => {
                const segmentAngle = 360 / prizes.length;
                const angle = index * segmentAngle;
                
                return (
                  <div
                    key={index}
                    className="absolute inset-0"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.cos((segmentAngle * Math.PI) / 180)}%)`
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: prize.color }}
                    >
                      <div 
                        className="absolute top-8 sm:top-12 md:top-16 left-1/2 -translate-x-1/2 w-20 sm:w-28 md:w-32 text-center"
                        style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                      >
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg font-black text-gray-900 drop-shadow-sm leading-tight">
                          {prize.name}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Center Circle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-2xl flex items-center justify-center border-4 sm:border-6 md:border-8 border-white">
                  <span className="text-3xl sm:text-5xl md:text-6xl">🎰</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="text-center text-white text-lg sm:text-2xl font-semibold bg-black/50 px-6 py-3 rounded-full backdrop-blur-sm"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {isSpinning ? '🎲 En cours...' : '👆 Cliquez sur la roue pour tourner !'}
          </motion.div>
        </div>

        {/* Result Modal */}
        <AnimatePresence>
          {showResult && wonPrize && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-lg flex items-center justify-center z-30 p-4"
              onClick={closeResult}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  duration: 0.6
                }}
                className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 p-8 sm:p-12 md:p-16 rounded-3xl shadow-2xl text-center max-w-sm sm:max-w-2xl mx-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-3xl sm:text-5xl"
                    style={{
                      top: i < 4 ? '-1.5rem' : 'auto',
                      bottom: i >= 4 ? '-1.5rem' : 'auto',
                      left: i % 2 === 0 ? `${(i % 4) * 25}%` : 'auto',
                      right: i % 2 === 1 ? `${(i % 4) * 25}%` : 'auto',
                    }}
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  >
                    ✨
                  </motion.div>
                ))}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 drop-shadow-lg">
                    🎉 FÉLICITATIONS ! 🎉
                  </h2>
                  <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-inner">
                    <p className="text-xl sm:text-2xl md:text-3xl text-white mb-3 sm:mb-4 font-semibold">Vous avez gagné :</p>
                    <motion.p 
                      className="text-2xl sm:text-4xl md:text-6xl font-black text-white drop-shadow-lg"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {wonPrize.name}
                    </motion.p>
                  </div>
                  <motion.button
                    onClick={closeResult}
                    className="px-8 sm:px-12 py-3 sm:py-4 bg-white text-purple-600 font-bold text-lg sm:text-xl rounded-full shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    Fermer
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SpinWheel;