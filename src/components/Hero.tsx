import React from 'react';
import { motion } from 'framer-motion';
import TextEngine from 'spring-text-engine';
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




  return (
    <section className="hero relative w-full min-h-[100dvh] flex flex-col justify-center select-none" id="about">
      {/* Two-Column Arrangement: Left photo / Right text & bio */}
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-8 my-auto py-1">

        {/* Left Column: Pure ChromaCard Picture (No borders, No underlying cards) */}
        <div className="shrink-0 relative flex items-center justify-center select-none self-center">
          <ChromaCard
            width={365}
            height={495}
            className="rounded-[24px]"
          />
        </div>

        {/* Right Column: Kicker, Display Name, Bio, Links & Badges */}
        <div className="flex-1 max-w-2xl text-left">
          {/* Uppercase Kicker Tagline */}
          <div className="text-xs font-mono font-bold tracking-wider text-[#38bdf8] uppercase mb-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] flex-col items-center gap-2">
            <span>COMPUTER SCIENCE & ENGINEERING UNDERGRADUATE</span><br></br>
            <span>University of Moratuwa</span>
          </div>

          {/* Large Bold Display Heading with Pop Scale spring overshoot */}
          <TextEngine
            tag="h1"
            mode="once"
            letterOut={{ opacity: 0, scale: 0 }}
            letterIn={{ opacity: 1, scale: 1 }}
            letterConfig={{ tension: 426, friction: 17 }}
            letterStagger={27}
            className="font-anton text-4xl sm:text-5xl lg:text-[3.5rem] tracking-wide text-white mb-2 leading-[1.08] drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)]"
          >
            Sivodayan Sujeevakumar
          </TextEngine>

          {/* Bio Description */}
          <p className="text-sm sm:text-base text-[#f1f5f9] leading-relaxed mb-2.5 font-normal drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            I build full-stack web applications, embedded IoT systems, and practical software tools using React, TypeScript, Python, and C++.
          </p>

          {/* Social & Contact Icon Action Row */}
          <div className="flex items-center gap-2.5 mb-3">
            {/* Resume / Document Icon */}
            <a
              href="assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
              download
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#44f0ff] text-white hover:text-[#44f0ff] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              title="Download Resume (PDF)"
              aria-label="Resume"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </a>

            {/* GitHub Profile */}
            <a
              href="https://github.com/Sivodayan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#44f0ff] text-white hover:text-[#44f0ff] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              title="GitHub Profile"
              aria-label="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>

            {/* LinkedIn Profile */}
            <a
              href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#44f0ff] text-white hover:text-[#44f0ff] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              title="LinkedIn Profile"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>

            {/* Email Copy Button */}
            <button
              onClick={copyEmail}
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#44f0ff] text-white hover:text-[#44f0ff] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)] cursor-pointer"
              title="Copy Email Address"
              aria-label="Copy Email"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </button>
          </div>


        </div>

      </div>
    </section>
  );
};

export default Hero;
