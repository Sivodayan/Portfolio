import React from 'react';
import { motion } from 'framer-motion';
import StaggeredText from './StaggeredText';
import ChromaCard from './ChromaCard';

export interface HeroProps {
  onShowToast: (msg: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShowToast }) => {
  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('sivodayan17@gmail.com').then(() => {
      onShowToast('Email copied to clipboard: sivodayan17@gmail.com');
    }).catch(() => {
      onShowToast('sivodayan17@gmail.com');
    });
  };

  const badges = [
    { label: '🏛️ CSE Dept Rep' },
    { label: '⚡ Moratuwa 3.54 GPA' },
    { label: '🌊 Team Void Warriors' },
    { label: '📍 Sri Lanka' },
  ];

  return (
    <section className="hero relative w-full mb-16 pt-4 md:pt-10" id="about">
      {/* Two-Column Arrangement: Left text & bio / Right photo card stack */}
      <div className="w-full flex flex-col-reverse lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-14">
        
        {/* Left Column: Kicker, Display Name, Bio, Links & Badges */}
        <div className="flex-1 max-w-2xl text-left">
          {/* Uppercase Kicker Tagline */}
          <div className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#38bdf8] uppercase mb-3.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
            <span>SOFTWARE ENGINEER &amp; CSE UNDERGRAD • UNIVERSITY OF MORATUWA</span>
          </div>

          {/* Large Bold Display Heading */}
          <StaggeredText
            as="h1"
            text="Sujeevakumar Sivodayan"
            segmentBy="words"
            className="text-5xl sm:text-6xl lg:text-[4rem] font-extrabold tracking-tight text-white mb-6 leading-[1.08] drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)]"
            duration={0.55}
            delay={90}
            blur={true}
          />

          {/* Bio Description */}
          <p className="text-lg sm:text-xl text-[#f1f5f9] leading-relaxed mb-7 font-normal drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            I sweat the parts most people skip past: fast pages, edge cases that actually get handled, and interfaces that don't fight you. Engineering undergraduate at the <strong className="text-white font-semibold">University of Moratuwa</strong> (CGPA 3.54) and elected <strong className="text-white font-semibold">Department Representative</strong> for Computer Science &amp; Engineering. I build IoT telemetry hardware, write clean web applications with React, and actively coordinate campus initiatives.
          </p>

          {/* Action Link: More about me → */}
          <div className="mb-7 flex items-center gap-6">
            <a
              href="assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
              download
              className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-[#44f0ff] hover:text-[#a5f3fc] transition-colors group cursor-pointer drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
            >
              <span>More about me &amp; Resume</span>
              <span className="transform transition-transform group-hover:translate-x-2">→</span>
            </a>
          </div>

          {/* Social & Contact Icon Action Row */}
          <div className="flex items-center gap-3.5 mb-7">
            {/* Resume / Document Icon */}
            <a
              href="assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
              download
              className="p-3 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#44f0ff] text-white hover:text-[#44f0ff] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              title="Download Resume (PDF)"
              aria-label="Resume"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </a>

            {/* GitHub Profile */}
            <a
              href="https://github.com/Sivodayan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#44f0ff] text-white hover:text-[#44f0ff] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              title="GitHub Profile"
              aria-label="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>

            {/* LinkedIn Profile */}
            <a
              href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#44f0ff] text-white hover:text-[#44f0ff] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              title="LinkedIn Profile"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>

            {/* Email Copy Button */}
            <button
              onClick={copyEmail}
              className="p-3 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#44f0ff] text-white hover:text-[#44f0ff] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)] cursor-pointer"
              title="Copy Email Address"
              aria-label="Copy Email"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </button>
          </div>

          {/* Interactive Physics Badges */}
          <div className="flex flex-wrap gap-2.5 pt-1" title="Interactive: Drag and fling any badge!">
            {badges.map((b, i) => (
              <motion.div
                key={i}
                className="draggable-badge text-sm sm:text-base font-semibold px-3 py-1.5"
                drag
                dragSnapToOrigin
                whileDrag={{ scale: 1.1, rotate: (i % 2 === 0 ? 4 : -4), zIndex: 50, cursor: 'grabbing' }}
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {b.label}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Exact Reference Arrangement (Framed Card + Tilted Colored Backing Card) */}
        <div className="shrink-0 relative flex items-center justify-center p-4 self-center lg:self-start lg:mt-3 select-none">
          {/* Tilted Vibrant Magenta/Rose Accent Card (from reference image) */}
          <div
            className="absolute w-[230px] sm:w-[260px] h-[300px] sm:h-[340px] rounded-[32px] bg-gradient-to-tr from-[#e11d48] via-[#f43f5e] to-[#fb7185] rotate-6 shadow-[0_20px_45px_rgba(225,29,72,0.4)] transition-transform duration-300 hover:rotate-8"
            aria-hidden="true"
          />

          {/* Foreground Card with crisp border housing ChromaCard */}
          <div className="relative z-10 p-1 rounded-[28px] bg-black/90 border-2 border-white/90 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
            <ChromaCard
              width={230}
              height={300}
              className="rounded-[24px]"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
