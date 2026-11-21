import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export interface BackToTopProps {
  threshold?: number;
  theme?: 'dark' | 'light';
}

export const BackToTop: React.FC<BackToTopProps> = ({ threshold = 350, theme = 'dark' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

      setScrollProgress(progress);
      setIsVisible(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 14 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 select-none"
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/85 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white text-white [data-theme=light]:text-slate-900 border border-white/20 hover:border-[#38bdf8] [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-[#0284c7] backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.45)] hover:shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all duration-300 cursor-pointer active:scale-95"
          >
            {/* SVG Circular Progress Track */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-white/10 [data-theme=light]:stroke-slate-200 fill-none"
                strokeWidth="2.5"
              />
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-[#38bdf8] [data-theme=light]:stroke-[#0284c7] fill-none transition-all duration-100"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Upward Arrow with hover lift animation */}
            <ArrowUp className="w-5 h-5 text-white [data-theme=light]:text-slate-900 group-hover:text-[#38bdf8] [data-theme=light]:group-hover:text-[#0284c7] group-hover:-translate-y-0.5 transition-all duration-200" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
