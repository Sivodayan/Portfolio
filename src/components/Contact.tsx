import React from 'react';
import { motion } from 'framer-motion';
import TextEngine from 'spring-text-engine';
import RisingLines from './RisingLines';
import GlitchHeading from './GlitchHeading';

export interface ContactProps {
  onShowToast?: (msg: string) => void;
  theme?: 'dark' | 'light';
}

export const Contact: React.FC<ContactProps> = ({ theme = 'dark' }) => {
  return (
    <section className="section relative w-full min-h-[100dvh] flex flex-col justify-between pt-12 sm:pt-16 !pb-0" id="contact">
      {/* React Bits Pro: Rising Lines Background - Seamless Upward Fade */}
      <div
        className={`absolute -inset-x-8 sm:-inset-x-16 -bottom-16 top-0 pointer-events-none z-0 ${theme === 'light' ? 'opacity-25' : 'opacity-40'} overflow-hidden`}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
        }}
      >
        <RisingLines
          colors={theme === 'light' ? ["#0284c7", "#0d9488"] : ["#44f0ff", "#ff087b"]}
          color={theme === 'light' ? "#0284c7" : "#ff087b"}
          horizonColor={theme === 'light' ? "#bae6fd" : "#44f0ff"}
          haloColor={theme === 'light' ? "#0284c7" : "#38bdf8"}
          horizonHeight={-0.45}
          speed={0.6}
          density={1.1}
          lineWidth={1.2}
          lineLength={1.1}
          interactive={true}
          horizonGlow={theme === 'light' ? 0.7 : 1.2}
          particles={1}
          className="w-full h-full pointer-events-auto"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full my-auto py-2"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <GlitchHeading>
              <TextEngine
                tag="h2"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className="section-heading !mb-0 !border-none !pb-0 text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm"
              >
                Get in Touch
              </TextEngine>
            </GlitchHeading>
            <p className="text-xs font-mono text-[#cbd5e1] mt-0.5">
              Direct communication channels, inquiries &amp; professional networks
            </p>
          </div>
        </div>

        {/* Contact Content - Spacious 2-Column Responsive Grid with staggered reveal */}
        <div className="w-full max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 mb-3 sm:mb-4"
          >
            {/* Direct Email Tile */}
            <motion.a
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              href="mailto:sivodayan17@gmail.com"
              className="flex items-center justify-between p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#44f0ff]/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div className="truncate mr-3">
                <div className="text-[10px] font-mono uppercase text-[#cbd5e1] font-semibold mb-1">Direct Email</div>
                <div className="text-xs sm:text-sm text-white group-hover:text-[#44f0ff] font-semibold truncate transition-colors">
                  sivodayan17@gmail.com
                </div>
              </div>
              <span className="copy-pill flex-shrink-0 text-xs font-mono font-bold px-2.5 py-1 text-[#44f0ff] group-hover:bg-[#44f0ff]/20 transition-colors">
                Send Email ↗
              </span>
            </motion.a>

            {/* Direct WhatsApp / Phone Tile */}
            <motion.a
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              href="https://wa.me/94705891710"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#34d399]/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div className="truncate mr-3">
                <div className="text-[10px] font-mono uppercase text-[#cbd5e1] font-semibold mb-1">WhatsApp / Phone</div>
                <div className="text-xs sm:text-sm text-white group-hover:text-[#34d399] font-semibold truncate transition-colors">
                  +94 70 589 1710
                </div>
              </div>
              <span className="copy-pill flex-shrink-0 text-xs font-mono font-bold px-2.5 py-1 text-[#34d399] group-hover:bg-[#34d399]/20 transition-colors">
                WhatsApp ↗
              </span>
            </motion.a>

            {/* LinkedIn Tile */}
            <motion.a
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#38bdf8]/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="text-[10px] font-mono uppercase text-[#cbd5e1] font-semibold mb-1">LinkedIn Network</div>
                <div className="text-xs sm:text-sm text-white group-hover:text-[#38bdf8] font-semibold transition-colors">
                  sivodayan-sujeevakumar ↗
                </div>
              </div>
            </motion.a>

            {/* GitHub Tile */}
            <motion.a
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              href="https://github.com/Sivodayan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#44f0ff]/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="text-[10px] font-mono uppercase text-[#cbd5e1] font-semibold mb-1">Codebase Repository</div>
                <div className="text-xs sm:text-sm text-white group-hover:text-[#44f0ff] font-semibold transition-colors">
                  github.com/Sivodayan ↗
                </div>
              </div>
            </motion.a>
          </motion.div>

          {/* Location & Status Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-[#cbd5e1] pt-3 border-t border-white/10">
            <span>📍 Department of Computer Science &amp; Engineering, University of Moratuwa</span>
            <span className="hidden sm:inline">•</span>
            <span>Open to Engineering Internships</span>
          </div>
        </div>
      </motion.div>

      {/* Embedded Clean Single-Screen Footer */}
      <footer className="relative z-10 w-full pt-2.5 pb-2 sm:pb-2.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[11px] text-center sm:text-left font-mono text-[#94a3b8]">
        <div>© {new Date().getFullYear()} Sujeevakumar Sivodayan</div>
        <div>Computer Science &amp; Engineering - University of Moratuwa</div>
      </footer>
    </section>
  );
};

export default Contact;
