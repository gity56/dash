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
  { name: 'Bon d\'achat 5€', probability: 0.3, color: '#10B981', rarity: '' },
  { name: 'Bon d\'achat 50€', probability: 0, color: '#F59E0B', rarity: '' },
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
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center">
      <div className="w-full h-full flex flex-col items-center justify-center py-4 px-2 sm:px-4">
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-red-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Restaurant Logo */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-30">
          <div className=" rounded-xl  p-3 sm:p-4">
            <img src="./market.png" className='w-24 -mt-4 -ml-4' alt="logo" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center">
          
          <motion.h1 
            className="text-2xl hh  sm:text-4xl md:text-5xl sm:font-bold text-white mb-6 sm:mb-8 text-center drop-shadow-lg px-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Tournez et Gagnez !
          </motion.h1>

          <div className="relative mb-6 sm:mb-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 sm:-translate-y-8 z-20">
              <div className="w-0 h-0 border-l-[25px] sm:border-l-[35px] border-l-transparent border-r-[25px] sm:border-r-[35px] border-r-transparent border-t-[50px] sm:border-t-[70px] border-t-red-500 drop-shadow-2xl"></div>
            </div>

            <div 
              ref={wheelRef}
              onClick={spinWheel}
              className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[550px] lg:h-[550px] rounded-full shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
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
                        className="absolute top-12 sm:top-20 left-1/2 -translate-x-1/2 w-24 sm:w-36 text-center"
                        style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                      >
                        <p className="text-sm sm:text-lg md:text-xl font-black text-gray-900 drop-shadow-sm leading-tight">
                          {prize.name}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-2xl flex items-center justify-center border-4 sm:border-8 border-white">
                  <span className="text-4xl sm:text-6xl md:text-7xl">🎰</span>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`px-8 sm:px-16 py-4 sm:py-5 text-lg sm:text-2xl md:text-3xl font-bold rounded-full shadow-2xl transform transition-all duration-300 ${
              isSpinning
                ? 'bg-gray-500 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
            } text-white`}
            whileHover={!isSpinning ? { scale: 1.05 } : {}}
            whileTap={!isSpinning ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {isSpinning ? 'En cours...' : 'TOURNER LA ROUE !'}
          </motion.button>
        </div>

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