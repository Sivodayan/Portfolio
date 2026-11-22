import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export interface BackToTopProps {
  threshold?: number;
}

/**
 * Floating viewport scroll progress ring with magnetic pointer snapping and Lenis scroll integration.
 */
export const BackToTop: React.FC<BackToTopProps> = ({ threshold = 350 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 28,
    stiffness: 220,
    mass: 0.08,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribeScroll = scrollY.on('change', (latest) => {
      setIsVisible(latest > threshold);
    });

    const unsubscribeProgress = scrollYProgress.on('change', (latest) => {
      setScrollPercent(Math.round(latest * 100));
    });

    return () => {
      unsubscribeScroll();
      unsubscribeProgress();
    };
  }, [scrollY, scrollYProgress, threshold]);

  // Pointer proximity displacement (magnetic snapping within bounding box)
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const smoothMagnetX = useSpring(magnetX, { damping: 20, stiffness: 280, mass: 0.1 });
  const smoothMagnetY = useSpring(magnetY, { damping: 20, stiffness: 280, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    magnetX.set(distanceX * 0.32);
    magnetY.set(distanceY * 0.32);
  };

  const handleMouseLeave = () => {
    magnetX.set(0);
    magnetY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const scrollToTop = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, {
        duration: 1.35,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-40 select-none flex items-center"
        >
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-14 px-3 py-1.5 rounded-full bg-black/85 light:bg-white/95 text-white light:text-slate-900 border border-white/15 light:border-slate-300 text-xs font-mono font-semibold shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md whitespace-nowrap pointer-events-none flex items-center gap-1.5"
              >
                <span>Back to top</span>
                <span className="text-[#e5a93c] light:text-[#b45309]">•</span>
                <span className="text-[#e5a93c] light:text-[#b45309] font-bold">{scrollPercent}%</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            ref={buttonRef}
            type="button"
            onClick={scrollToTop}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ x: smoothMagnetX, y: smoothMagnetY }}
            whileTap={{ scale: 0.92 }}
            aria-label={`Back to top, ${scrollPercent}% scrolled`}
            title="Back to top"
            className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] touch-manipulation rounded-full bg-black/60 hover:bg-black/90 light:bg-white/85 light:hover:bg-white text-white light:text-slate-900 border border-white/20 hover:border-[#e5a93c]/60 light:border-slate-300 light:hover:border-[#b45309]/60 backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.45)] hover:shadow-[0_0_28px_rgba(229,169,60,0.38)] transition-colors duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-[#e5a93c]/25 light:bg-[#b45309]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 scale-125" />

            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-white/10 light:stroke-slate-200 fill-none"
                strokeWidth="2.5"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-[#e5a93c] light:stroke-[#b45309] fill-none"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  pathLength: smoothProgress,
                }}
              />
            </svg>

            <div className="relative w-5 h-5 overflow-hidden flex items-center justify-center">
              <ArrowUp className="absolute inset-0 w-5 h-5 text-white light:text-slate-900 group-hover:-translate-y-5 group-hover:opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <ArrowUp className="absolute inset-0 w-5 h-5 text-[#e5a93c] light:text-[#b45309] translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
