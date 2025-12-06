import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Pattern from '../components/bg1';

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
    <>
      <Pattern />
      
      <div className="fixed inset-0 -mt-8 w-screen h-screen overflow-hidden flex items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center py-4 px-2 sm:px-4 relative">
          
          {/* Restaurant Logo */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:top-8 z-30">
            <div className="rounded-xl p-3 sm:p-4">
              <img src="./market.png" className='w-24' alt="logo" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            
            <motion.h1 
              className="text-2xl sm:text-4xl md:text-5xl sm:font-bold text-white mb-6 sm:mb-8 text-center drop-shadow-lg px-4"
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
                          className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 w-20 sm:w-28 text-center"
                          style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                        >
                          <p className="text-[10px] sm:text-sm md:text-base font-black text-gray-900 drop-shadow-sm leading-tight whitespace-pre-line">
                            {prize.name.split(' ').join('\n')}
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
        
        {/* Social Media Links */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-6 z-50">
          <a 
            href="https://www.tiktok.com/@mypizzalille59?_r=1&_t=ZS-91yXJ2tfCqW" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl border-2 border-white/30"
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>
          <a 
            href="https://www.instagram.com/marketpizzalille?igsh=bnp5OWN5Y2JyeDBx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl border-2 border-white/30"
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default SpinWheel;