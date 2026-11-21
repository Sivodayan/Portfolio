import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CircuitFlash from './CircuitFlash';

export interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // 2 seconds total cinematic loading time

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(current);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(onComplete, 300);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#07080b] overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
    >
      {/* React Bits Pro: Circuit Flash Component with exact requested config */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <CircuitFlash
          colors={["#44f0ff", "#ff087b"]}
        />
      </div>

      {/* Cybernetic HUD Center Card */}
      <motion.div
        className="relative z-20 flex flex-col items-center max-w-sm px-6 py-5 mx-4 rounded-xl bg-[#090b10]/85 border border-[#44f0ff]/30 shadow-[0_0_50px_rgba(68,240,255,0.18)] backdrop-blur-md"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="text-center mb-3">
          <div className="font-anton text-base tracking-wider text-white">
            Sivodayan Sujeevakumar
          </div>

        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-[#44f0ff] to-[#ff087b]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-48 text-[10px] font-mono text-[#71717a]">
          <span>STATUS: ONLINE</span>
          <span>{progress}%</span>
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="mt-4 px-3.5 py-1.5 min-h-[36px] text-xs font-mono text-[#a1a1aa] hover:text-white border border-white/10 hover:border-[#44f0ff]/40 rounded-lg transition-colors touch-manipulation cursor-pointer flex items-center justify-center"
        >
          Skip Intro
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
