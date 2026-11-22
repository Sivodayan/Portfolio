import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface GlitchHeadingProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Single-cycle entry glitch effect.
 * Applies chromatic aberration on viewport entry for 600ms, then permanently unmounts animation classes.
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
