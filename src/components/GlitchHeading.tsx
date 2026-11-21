import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface GlitchHeadingProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GlitchHeading — Executes a high-tech chromatic glitch effect strictly as an entry transition.
 * Once the 600ms transition completes, the glitch animation is permanently deactivated.
 */
export const GlitchHeading: React.FC<GlitchHeadingProps> = ({ children, className = '' }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      onViewportEnter={() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 600);
      }}
      className={`${className} ${isGlitching ? 'glitch-transition' : ''}`}
    >
      {children}
    </motion.div>
  );
};

export default GlitchHeading;
