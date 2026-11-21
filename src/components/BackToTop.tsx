import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export interface BackToTopProps {
  threshold?: number;
  theme?: 'dark' | 'light';
}

/**
 * BackToTop — Smooth Floating Action Button
 *
 * Features:
 * - Fluid spring-driven circular scroll progress ring (via Framer Motion pathLength)
 * - Magnetic cursor attraction physics on hover
 * - Dual-arrow smooth kinetic launch cycle on hover
 * - Ambient backdrop blur with glowing radial aura
 * - Interactive scroll percentage tooltip pill
 * - Smooth cubic-bezier scroll-to-top transition
 */
export const BackToTop: React.FC<BackToTopProps> = ({ threshold = 350, theme = 'dark' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Framer Motion scroll progress tracking
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 28,
    stiffness: 220,
    mass: 0.08,
    restDelta: 0.001,
  });

  // Track scroll position for threshold visibility & percentage readout
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

  // Magnetic cursor attraction physics
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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
          {/* Smooth Tooltip Pill on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-14 px-3 py-1.5 rounded-full bg-black/85 [data-theme=light]:bg-white/95 text-white [data-theme=light]:text-slate-900 border border-white/15 [data-theme=light]:border-slate-300 text-xs font-mono font-semibold shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md whitespace-nowrap pointer-events-none flex items-center gap-1.5"
              >
                <span>Back to top</span>
                <span className="text-[#38bdf8] [data-theme=light]:text-[#0284c7]">•</span>
                <span className="text-[#38bdf8] [data-theme=light]:text-[#0284c7] font-bold">{scrollPercent}%</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Magnetic Interactive Button */}
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
            className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] touch-manipulation rounded-full bg-black/60 hover:bg-black/90 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white text-white [data-theme=light]:text-slate-900 border border-white/20 hover:border-[#38bdf8]/60 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-[#0284c7]/60 backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.45)] hover:shadow-[0_0_28px_rgba(56,189,248,0.38)] transition-colors duration-300 cursor-pointer"
          >
            {/* Ambient Aura Glow */}
            <div className="absolute inset-0 rounded-full bg-[#38bdf8]/25 [data-theme=light]:bg-[#0284c7]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 scale-125" />

            {/* SVG Circular Progress Track */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              {/* Subtle Track Background */}
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-white/10 [data-theme=light]:stroke-slate-200 fill-none"
                strokeWidth="2.5"
              />
              {/* Spring-Driven Progress Circle */}
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-[#38bdf8] [data-theme=light]:stroke-[#0284c7] fill-none"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  pathLength: smoothProgress,
                }}
              />
            </svg>

            {/* Dual Arrow Kinetic Slide Container */}
            <div className="relative w-5 h-5 overflow-hidden flex items-center justify-center">
              {/* Resting Arrow (slides out on hover) */}
              <ArrowUp className="absolute inset-0 w-5 h-5 text-white [data-theme=light]:text-slate-900 group-hover:-translate-y-5 group-hover:opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              {/* Incoming Arrow (slides in from below on hover) */}
              <ArrowUp className="absolute inset-0 w-5 h-5 text-[#38bdf8] [data-theme=light]:text-[#0284c7] translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
