import React from 'react';
import { motion } from 'framer-motion';
import SpectralTiles from './SpectralTiles';
import TextEngine from 'spring-text-engine';

interface SkillItem {
  name: string;
  icon: React.ReactNode;
}

export const SkillsShowcase: React.FC = () => {
  const skills: SkillItem[] = [
    {
      name: 'Python',
      icon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none">
          <path
            d="M11.9 2c-5.2 0-4.9 2.2-4.9 2.2l.1 2.3h4.9v.7H5.2S2 6.8 2 12s2.8 5 2.8 5h1.7v-2.3s-.1-2.8 2.8-2.8h4.7s2.7.1 2.7-2.7V4.7S17.1 2 11.9 2zm-2.7 1.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"
            fill="#38bdf8"
          />
          <path
            d="M12.1 22c5.2 0 4.9-2.2 4.9-2.2l-.1-2.3h-4.9v-.7h6.8s3.2.4 3.2-4.8-2.8-5-2.8-5h-1.7v2.3s.1 2.8-2.8 2.8H10s-2.7-.1-2.7 2.7v4.5s-.4 2.7 4.8 2.7zm2.7-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"
            fill="#facc15"
          />
        </svg>
      ),
    },
    {
      name: 'C / C++',
      icon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.9 3.8v7.9L12 19.8l-6.9-3.9V8.1L12 4.2z"
            fill="#0284c7"
          />
          <path
            d="M11 9.5a3 3 0 100 5 3 3 0 000-5zm4 1.5h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1zm4 0h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1z"
            fill="#38bdf8"
          />
        </svg>
      ),
    },
    {
      name: 'React 19',
      icon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none" stroke="#44f0ff" strokeWidth="1.6">
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.6" fill="#44f0ff" />
        </svg>
      ),
    },
    {
      name: 'TypeScript',
      icon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#3178C6" />
          <path
            d="M5 11h6v2.2H8.8V19H6.3v-5.8H5V11zm7.8 4.7c.6.4 1.3.6 2 .6.8 0 1.2-.3 1.2-.7 0-.5-.4-.7-1.4-1.1-1.3-.4-2.1-1.1-2.1-2.2 0-1.4 1.1-2.3 2.8-2.3 1 0 1.8.3 2.4.7l-.6 1.7c-.5-.3-1.1-.5-1.8-.5-.7 0-1.1.3-1.1.7 0 .4.4.6 1.3 1 1.4.5 2.2 1.1 2.2 2.3 0 1.5-1.2 2.4-3 2.4-1.1 0-2.1-.3-2.8-.8l.8-1.8z"
            fill="#ffffff"
          />
        </svg>
      ),
    },
    {
      name: 'JavaScript',
      icon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
          <path
            d="M7.5 18c-.8 0-1.4-.4-1.8-1l1.5-1c.2.3.5.5.8.5.5 0 .8-.3.8-.9V10h2.2v5.8c0 1.4-.9 2.2-2.5 2.2zm7.2 0c-1.8 0-2.9-1.1-2.9-2.6 0-1.6 1.1-2.6 2.7-2.6.9 0 1.6.3 2 .8l-1.3 1.1c-.3-.3-.5-.4-.8-.4-.4 0-.8.3-.8.9 0 .6.3.9.8.9.3 0 .6-.1.8-.4l1.3 1.1c-.5.7-1.2 1.2-2.6 1.2z"
            fill="#000000"
          />
        </svg>
      ),
    },
    {
      name: 'DSA & Algorithms',
      icon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.7">
          <circle cx="12" cy="5" r="3" />
          <circle cx="6" cy="19" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M10 7.5l-2.5 9m7-9l2.5 9" />
        </svg>
      ),
    },
    {
      name: 'ESP32 & IoT',
      icon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8">
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M2 9h3m-3 6h3m14-6h3m-3 6h3M9 2v3m6-3v3m-6 14v3m6-3v3" />
        </svg>
      ),
    },
    {
      name: 'Tailwind CSS',
      icon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6 1.2 1.2 2.6 2.6 5.5 2.6 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6-1.2-1.2-2.6-2.6-5.5-2.6zm-6 6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6 1.2 1.2 2.6 2.6 5.5 2.6 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6-1.2-1.2-2.6-2.6-5.5-2.6z"
            fill="#38bdf8"
          />
        </svg>
      ),
    },
    {
      name: 'Machine Learning',
      icon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="12" cy="18" r="3" />
          <path d="M8 8l3 7m2 0l3-7m-8 0h6" />
        </svg>
      ),
    },
    {
      name: 'Git & GitHub',
      icon: (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.47 2 2 6.47 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
            fill="#f4f4f5"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="section relative w-full min-h-[100dvh] flex flex-col justify-center py-12 sm:py-16" id="skills">
      <div className="w-full my-auto">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <TextEngine
              tag="h2"
              mode="once"
              letterOut={{ opacity: 0, scale: 0 }}
              letterIn={{ opacity: 1, scale: 1 }}
              letterConfig={{ tension: 426, friction: 17 }}
              letterStagger={27}
              className="section-heading !mb-0 !border-none !pb-0 text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm"
            >
              Skills &amp; Technologies
            </TextEngine>
            <p className="text-xs font-mono text-[#cbd5e1] mt-0.5">
              Core Technical Competencies &amp; Toolchain
            </p>
          </div>
        </div>

        {/* Spectral Tiles Background Container - Generously Spanning the Screen */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 55%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 55%, transparent 100%)',
          }}
        >
          <SpectralTiles
            color={"#2C7A78"}
            glowColor={"#DDF8F3"}
            tilt={36}
            zoom={1.2}
            lights={3}
            lightSize={1.1}
            style={{ minHeight: 'clamp(460px, 60vh, 560px)' }}
          >
            {/* Skill Tiles Overlaid on top of 3D Spectral Tiles */}
            <div className="relative z-10 p-4 sm:p-6 flex flex-col justify-center h-full bg-transparent">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4.5">
                {skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    whileHover={{ scale: 1.05, y: -3 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                    className="group relative p-4 sm:p-5 rounded-2xl bg-black/45 hover:bg-black/70 border border-white/10 hover:border-[#DDF8F3]/60 backdrop-blur-md transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(44,122,120,0.45)] flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3 cursor-default"
                  >
                    <div className="w-13 h-13 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-black/60 border border-white/10 group-hover:border-[#2C7A78] group-hover:scale-110 transition-all flex-shrink-0 shadow-sm">
                      {skill.icon}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-[#DDF8F3] transition-colors drop-shadow-sm">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </SpectralTiles>
        </div>
      </div>
    </section>
  );
};

export default SkillsShowcase;
