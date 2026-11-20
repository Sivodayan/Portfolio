import React from 'react';
import { motion } from 'framer-motion';
import SpectralTiles from './SpectralTiles';
import StaggeredText from './StaggeredText';

interface SkillItem {
  name: string;
  category: string;
  desc: string;
  icon: React.ReactNode;
}

export const SkillsShowcase: React.FC = () => {
  const skills: SkillItem[] = [
    {
      name: 'Python',
      category: 'Data & Telemetry',
      desc: 'Algorithms & Automation • Kaggle Certified',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
      category: 'Low-Level / Firmware',
      desc: 'Memory Management & OOP • Certified',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
      category: 'Frontend Engineering',
      desc: 'Hooks, Suspense, State & Modern SPA',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#44f0ff" strokeWidth="1.5">
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="#44f0ff" />
        </svg>
      ),
    },
    {
      name: 'TypeScript',
      category: 'Typed Systems',
      desc: 'Strict Contracts, Generics & DX',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
      category: 'Web Standards',
      desc: 'Async/Await, Promises & DOM APIs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
      category: 'Computer Science',
      desc: 'Trees, Graphs, Sorting & Complexity',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.6">
          <circle cx="12" cy="5" r="3" />
          <circle cx="6" cy="19" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M10 7.5l-2.5 9m7-9l2.5 9" />
        </svg>
      ),
    },
    {
      name: 'ESP32 & IoT',
      category: 'Hardware Telemetry',
      desc: 'WiFi/BLE, FreeRTOS & GPIO Pins',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.7">
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M2 9h3m-3 6h3m14-6h3m-3 6h3M9 2v3m6-3v3m-6 14v3m6-3v3" />
        </svg>
      ),
    },
    {
      name: 'Arduino',
      category: 'Microcontrollers',
      desc: 'Ultrasonic Sensors, I2C, SPI & Relays',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M17.5 7A5.5 5.5 0 0012 11.2 5.5 5.5 0 006.5 7 5.5 5.5 0 1012 12.8 5.5 5.5 0 0017.5 17a5.5 5.5 0 000-10zm-11 8a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm11 0a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"
            fill="#00979D"
          />
          <path d="M5 12h3M16 12h3m-1.5-1.5v3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'MQTT & WebSockets',
      category: 'Real-Time Telemetry',
      desc: 'Pub/Sub Brokerage & Live Streams',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.6">
          <circle cx="12" cy="12" r="3" fill="#a855f7" />
          <path d="M6.3 6.3a8 8 0 0111.4 0m-14.2-2.8a12 12 0 0117 0m-14.2 17a12 12 0 010-17" />
        </svg>
      ),
    },
    {
      name: 'Node.js & APIs',
      category: 'Backend Services',
      desc: 'REST Endpoints, Express & Microservices',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L3.5 7v10L12 22l8.5-5V7L12 2z"
            stroke="#22c55e"
            strokeWidth="1.6"
            fill="rgba(34, 197, 94, 0.15)"
          />
          <path d="M12 7v10m-4-7l8 4m-8 0l8-4" stroke="#22c55e" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      name: 'Tailwind CSS',
      category: 'UI Architecture',
      desc: 'Design Tokens, Flexbox & Responsive Grid',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6 1.2 1.2 2.6 2.6 5.5 2.6 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6-1.2-1.2-2.6-2.6-5.5-2.6zm-6 6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6 1.2 1.2 2.6 2.6 5.5 2.6 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6-1.2-1.2-2.6-2.6-5.5-2.6z"
            fill="#38bdf8"
          />
        </svg>
      ),
    },
    {
      name: 'Three.js & WebGL',
      category: 'Creative Engineering',
      desc: 'Custom Shader Pass, Canvas & 3D Math',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.6">
          <path d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z" />
          <circle cx="12" cy="14" r="2" fill="#ec4899" />
        </svg>
      ),
    },
    {
      name: 'PostgreSQL & SQL',
      category: 'Data Persistence',
      desc: 'Relational Schemas, Indexing & Queries',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.6">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
    },
    {
      name: 'Machine Learning',
      category: 'Data Science',
      desc: 'Pandas & Intro to ML • Kaggle Badged',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.6">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="12" cy="18" r="3" />
          <path d="M8 8l3 7m2 0l3-7m-8 0h6" />
        </svg>
      ),
    },
    {
      name: 'Git & GitHub',
      category: 'Collaboration',
      desc: 'Branches, PRs, CI/CD & Code Review',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.47 2 2 6.47 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
            fill="#f4f4f5"
          />
        </svg>
      ),
    },
    {
      name: 'Linux / POSIX',
      category: 'Systems & Tooling',
      desc: 'Bash, Systemd, SSH & Build Toolchains',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.6">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      ),
    },
  ];

  return (
    <section className="section relative my-16 md:my-24" id="skills">
      <div className="flex items-center justify-between mb-4">
        <div>
          <StaggeredText
            as="h2"
            text="Skills & Technologies"
            segmentBy="words"
            className="section-heading !mb-0 !border-none !pb-0 text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm"
            duration={0.5}
            delay={70}
          />
          <p className="text-sm sm:text-base text-[#cbd5e1] mt-1.5 font-mono">
            Interactive 3D Spectral Grid • 16 Core competencies from Moratuwa CSE & LinkedIn
          </p>
        </div>
        <span className="text-xs font-mono text-[#DDF8F3] bg-[#2C7A78]/20 border border-[#2C7A78]/40 px-3 py-1.5 rounded-full hidden sm:flex items-center gap-2 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#DDF8F3] animate-pulse"></span>
          Spectral Tiles
        </span>
      </div>

      {/* Spectral Tiles Background Container - Seamless Edge Blend */}
      <div
        className="relative my-2 overflow-hidden rounded-2xl"
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
          style={{ minHeight: '560px' }}
        >
          {/* Skill Tiles Overlaid on top of 3D Spectral Tiles */}
          <div className="relative z-10 p-3 sm:p-5 flex flex-col justify-between h-full bg-transparent">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-mono text-[#DDF8F3] tracking-wide uppercase drop-shadow-sm font-semibold">
                Interactive Grid • Hover tiles to bend 3D spectral planes
              </span>
              <span className="text-xs font-mono text-[#cbd5e1] hidden sm:inline-block">
                LinkedIn & Coursework Skills
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className="group relative p-3.5 rounded-xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#DDF8F3]/60 backdrop-blur-md transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(44,122,120,0.4)] flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-black/55 border border-white/10 group-hover:border-[#2C7A78] transition-colors flex-shrink-0">
                      {skill.icon}
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-[#DDF8F3] transition-colors line-clamp-1 drop-shadow-sm">
                        {skill.name}
                      </div>
                      <div className="text-xs text-[#5eead4] font-mono leading-tight line-clamp-1 font-semibold">
                        {skill.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs sm:text-[13px] text-[#e2e8f0] font-sans line-clamp-1 font-normal">
                    {skill.desc}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between text-xs sm:text-sm font-mono text-[#cbd5e1] pt-3 border-t border-white/10">
              <span>Moratuwa Computer Science & Engineering • Hardware & Full-Stack</span>
              <span className="text-[#DDF8F3] font-bold">16 Core Competencies</span>
            </div>
          </div>
        </SpectralTiles>
      </div>
    </section>
  );
};

export default SkillsShowcase;
