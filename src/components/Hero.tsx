import React from 'react';
import { motion } from 'framer-motion';
import TextEngine from 'spring-text-engine';
import { Download, FileText } from 'lucide-react';
import ChromaCard from './ChromaCard';

export interface HeroProps {
  isIntroDone?: boolean;
  theme?: 'dark' | 'light';
}

export const Hero: React.FC<HeroProps> = ({ isIntroDone = true, theme = 'dark' }) => {
  const [isGlitching, setIsGlitching] = React.useState(false);

  React.useEffect(() => {
    if (isIntroDone) {
      setIsGlitching(true);
      const timer = setTimeout(() => {
        setIsGlitching(false);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isIntroDone]);

  return (
    <section className="hero relative w-full min-h-[90vh] sm:min-h-[calc(100vh-4rem)] flex flex-col justify-center select-none pt-12 pb-4 sm:pt-14 sm:pb-6 overflow-hidden" id="about">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isIntroDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-14 my-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={isIntroDone ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 relative flex items-center justify-center select-none self-center overflow-visible"
        >
          <ChromaCard
            triggerGlitch={isGlitching}
            className="aspect-[370/505] h-[38vh] min-h-[260px] max-h-[330px] sm:h-[47vh] sm:min-h-[360px] sm:max-h-[450px] lg:h-[65vh] lg:min-h-[490px] lg:max-h-[580px] xl:h-[68vh] xl:max-h-[620px] w-auto max-w-[90vw]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 22 }}
          animate={isIntroDone ? { opacity: 1, x: 0 } : { opacity: 0, x: 22 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 max-w-xl lg:max-w-2xl text-left flex flex-col justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={isIntroDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-[13px] font-mono font-bold tracking-wider uppercase mb-2.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] light:drop-shadow-none"
          >
            <span className="block text-[#e5a93c] light:text-[#b45309]">Computer Science &amp; Engineering Undergraduate</span>
            <span className="block text-[#fde68a] light:text-slate-700 text-[11px] sm:text-xs font-semibold tracking-normal mt-0.5">University of Moratuwa </span>
          </motion.div>

          <div className={isGlitching ? 'glitch-transition' : ''}>
            <TextEngine
              key={isIntroDone ? `intro-done-${theme}` : 'intro-waiting'}
              tag="h1"
              mode="once"
              letterOut={{ opacity: 0, scale: 0 }}
              letterIn={{ opacity: 1, scale: 1 }}
              letterConfig={{ tension: 426, friction: 17 }}
              letterStagger={22}
              className="font-anton text-3xl min-[380px]:text-4xl sm:text-5xl lg:text-[3.8rem] tracking-wide text-white light:text-slate-950 mb-3.5 leading-[1.08] drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)] light:drop-shadow-none break-words"
            >
              Sivodayan Sujeevakumar
            </TextEngine>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isIntroDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.65, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-[15px] lg:text-base text-[#f1f5f9] light:text-slate-800 leading-relaxed mb-5 font-normal drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] light:drop-shadow-none max-w-xl"
          >
            Department Representative for Computer Science &amp; Engineering. I build full-stack web applications, embedded IoT telemetries, and performant developer software using React, TypeScript, Python, and C++.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isIntroDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 mb-4"
          >
            <div className="flex items-center gap-2 sm:gap-2.5">
              <a
                href="https://github.com/Sivodayan"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-target
                className="p-2.5 sm:p-3 rounded-xl bg-black/60 hover:bg-black/90 light:bg-white/85 light:hover:bg-white border border-white/20 hover:border-[#e5a93c] light:border-slate-300 light:hover:border-[#b45309] text-white hover:text-[#e5a93c] light:text-slate-900 light:hover:text-[#b45309] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)] cursor-pointer focus:outline-none"
                title="GitHub Profile"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-target
                className="p-2.5 sm:p-3 rounded-xl bg-black/60 hover:bg-black/90 light:bg-white/85 light:hover:bg-white border border-white/20 hover:border-[#e5a93c] light:border-slate-300 light:hover:border-[#b45309] text-white hover:text-[#e5a93c] light:text-slate-900 light:hover:text-[#b45309] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)] cursor-pointer focus:outline-none"
                title="LinkedIn Profile"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>

              <a
                href="mailto:sivodayan17@gmail.com"
                data-cursor-target
                className="p-2.5 sm:p-3 rounded-xl bg-black/60 hover:bg-black/90 light:bg-white/85 light:hover:bg-white border border-white/20 hover:border-[#e5a93c] light:border-slate-300 light:hover:border-[#b45309] text-white hover:text-[#e5a93c] light:text-slate-900 light:hover:text-[#b45309] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)] cursor-pointer focus:outline-none"
                title="Send Direct Email"
                aria-label="Send Direct Email"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <a
                href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                download="Sivodayan_Sujeevakumar_CV.pdf"
                className="px-3 sm:px-3.5 py-2 rounded-xl bg-[#e5a93c] hover:bg-[#d97706] text-[#07080b] hover:text-white light:bg-amber-600 light:hover:bg-amber-700 light:text-white font-mono text-xs sm:text-[13px] font-bold flex items-center gap-1.5 shadow-[0_0_16px_rgba(229,169,60,0.35)] hover:shadow-[0_0_22px_rgba(229,169,60,0.5)] transition-all cursor-pointer border border-[#e5a93c] hover:border-[#d97706] light:border-amber-600"
                title="Download Resume (PDF)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CV</span>
              </a>

              <a
                href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 sm:px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/90 light:bg-white/85 light:hover:bg-white border border-white/20 hover:border-[#e5a93c] light:border-slate-300 light:hover:border-[#b45309] text-white light:text-slate-900 light:hover:text-[#b45309] font-mono text-xs sm:text-[13px] font-semibold flex items-center gap-1.5 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.6)] cursor-pointer"
                title="View Resume in Browser (PDF)"
              >
                <FileText className="w-3.5 h-3.5 text-[#e5a93c] light:text-[#b45309]" />
                <span>View CV</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
