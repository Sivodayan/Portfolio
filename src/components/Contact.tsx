import React from 'react';
import { motion } from 'framer-motion';
import TextEngine from 'spring-text-engine';
import {
  Mail,
  Phone,
  MessageCircle,
  Linkedin,
  Github,
  MapPin,
  Clock,
  FileText,
  Download,
  ExternalLink,
  Send,
  CheckCircle2,
} from 'lucide-react';
import RisingLines from './RisingLines';
import GlitchHeading from './GlitchHeading';

export interface ContactProps {
  onShowToast?: (msg: string) => void;
  theme?: 'dark' | 'light';
}

export const Contact: React.FC<ContactProps> = ({ theme = 'dark' }) => {
  return (
    <section
      className="section relative w-full min-h-[100dvh] flex flex-col justify-between pt-12 sm:pt-16 !pb-0"
      id="contact"
    >
      {/* React Bits Pro: Rising Lines Background - Seamless Upward Fade */}
      <div
        className={`absolute -inset-x-8 sm:-inset-x-16 -bottom-16 top-0 pointer-events-none z-0 ${
          theme === 'light' ? 'opacity-25' : 'opacity-40'
        } overflow-hidden`}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
        }}
      >
        <RisingLines
          colors={theme === 'light' ? ['#0284c7', '#0d9488'] : ['#44f0ff', '#ff087b']}
          color={theme === 'light' ? '#0284c7' : '#ff087b'}
          horizonColor={theme === 'light' ? '#bae6fd' : '#44f0ff'}
          haloColor={theme === 'light' ? '#0284c7' : '#38bdf8'}
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
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 sm:mb-6">
          <div>
            <GlitchHeading>
              <TextEngine
                tag="h2"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className="section-heading !mb-0 !border-none !pb-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-white [data-theme=light]:text-slate-900 drop-shadow-sm"
              >
                Get in Touch
              </TextEngine>
            </GlitchHeading>
            <p className="text-xs sm:text-[13px] font-mono text-[#cbd5e1] [data-theme=light]:text-slate-600 mt-1 max-w-xl">
              Direct communication channels, inquiries &amp; professional networks
            </p>
          </div>

          {/* Active Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 [data-theme=light]:text-emerald-700 text-xs font-mono font-medium self-start sm:self-auto backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open for Internships &amp; Roles</span>
          </div>
        </div>

        {/* Contact Details Grid - Responsive 6-Tile Layout */}
        <div className="w-full max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.07 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5"
          >
            {/* Tile 1: Direct Email */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex flex-col justify-between p-4 sm:p-4.5 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-[#44f0ff]/40 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-[#0284c7]/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="p-2 rounded-lg bg-[#44f0ff]/10 text-[#44f0ff] [data-theme=light]:text-[#0284c7]">
                    <Mail className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    Primary Email
                  </span>
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-[#44f0ff] [data-theme=light]:group-hover:text-[#0284c7] transition-colors truncate">
                  sivodayan17@gmail.com
                </div>
                <p className="text-[11px] text-[#94a3b8] [data-theme=light]:text-slate-500 mt-0.5">
                  Direct personal &amp; academic inbox
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/10 [data-theme=light]:border-slate-200">
                <a
                  href="mailto:sivodayan17@gmail.com"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#44f0ff]/15 hover:bg-[#44f0ff]/25 [data-theme=light]:bg-[#0284c7]/10 [data-theme=light]:hover:bg-[#0284c7]/20 text-[#44f0ff] [data-theme=light]:text-[#0284c7] font-mono text-xs font-semibold transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Direct Email</span>
                </a>
              </div>
            </motion.div>

            {/* Tile 2: WhatsApp & Direct Phone */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex flex-col justify-between p-4 sm:p-4.5 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-[#34d399]/40 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-emerald-600/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="p-2 rounded-lg bg-[#34d399]/10 text-[#34d399] [data-theme=light]:text-emerald-700">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    Phone &amp; WhatsApp
                  </span>
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-[#34d399] [data-theme=light]:group-hover:text-emerald-700 transition-colors">
                  +94 70 589 1710
                </div>
                <p className="text-[11px] text-[#94a3b8] [data-theme=light]:text-slate-500 mt-0.5">
                  Voice calls &amp; WhatsApp messaging
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/10 [data-theme=light]:border-slate-200 grid grid-cols-2 gap-2">
                <a
                  href="https://wa.me/94705891710"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-[#34d399]/15 hover:bg-[#34d399]/25 [data-theme=light]:bg-emerald-600/10 [data-theme=light]:hover:bg-emerald-600/20 text-[#34d399] [data-theme=light]:text-emerald-700 font-mono text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+94705891710"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 [data-theme=light]:bg-slate-200 [data-theme=light]:hover:bg-slate-300 text-white [data-theme=light]:text-slate-900 font-mono text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            </motion.div>

            {/* Tile 3: LinkedIn Network */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex flex-col justify-between p-4 sm:p-4.5 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-[#38bdf8]/40 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-[#0284c7]/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="p-2 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] [data-theme=light]:text-[#0284c7]">
                    <Linkedin className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    Professional Network
                  </span>
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-[#38bdf8] [data-theme=light]:group-hover:text-[#0284c7] transition-colors truncate">
                  sivodayan-sujeevakumar
                </div>
                <p className="text-[11px] text-[#94a3b8] [data-theme=light]:text-slate-500 mt-0.5">
                  LinkedIn profile &amp; connections
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/10 [data-theme=light]:border-slate-200">
                <a
                  href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 [data-theme=light]:bg-[#0284c7]/10 [data-theme=light]:hover:bg-[#0284c7]/20 text-[#38bdf8] [data-theme=light]:text-[#0284c7] font-mono text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Connect on LinkedIn</span>
                </a>
              </div>
            </motion.div>

            {/* Tile 4: GitHub Codebase */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex flex-col justify-between p-4 sm:p-4.5 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-white/30 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-slate-500/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="p-2 rounded-lg bg-white/10 [data-theme=light]:bg-slate-200 text-white [data-theme=light]:text-slate-900">
                    <Github className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    Code &amp; Repositories
                  </span>
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-white transition-colors truncate">
                  github.com/Sivodayan
                </div>
                <p className="text-[11px] text-[#94a3b8] [data-theme=light]:text-slate-500 mt-0.5">
                  Open source &amp; engineering projects
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/10 [data-theme=light]:border-slate-200">
                <a
                  href="https://github.com/Sivodayan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 [data-theme=light]:bg-slate-200 [data-theme=light]:hover:bg-slate-300 text-white [data-theme=light]:text-slate-900 font-mono text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Visit GitHub Profile</span>
                </a>
              </div>
            </motion.div>

            {/* Tile 5: Location & Availability */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex flex-col justify-between p-4 sm:p-4.5 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-amber-400/40 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-amber-600/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="p-2 rounded-lg bg-amber-400/10 text-amber-400 [data-theme=light]:text-amber-600">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    Location &amp; Base
                  </span>
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-amber-400 [data-theme=light]:group-hover:text-amber-600 transition-colors">
                  Moratuwa &amp; Jaffna, Sri Lanka
                </div>
                <p className="text-[11px] text-[#94a3b8] [data-theme=light]:text-slate-500 mt-0.5">
                  University of Moratuwa CSE Dept.
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/10 [data-theme=light]:border-slate-200 flex items-center justify-between text-[11px] font-mono text-[#cbd5e1] [data-theme=light]:text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400 [data-theme=light]:text-amber-600" />
                  <span>UTC+5:30 (SLST)</span>
                </span>
                <span className="text-emerald-400 [data-theme=light]:text-emerald-700 font-medium">On-Site / Remote</span>
              </div>
            </motion.div>

            {/* Tile 6: Official Resume / CV */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex flex-col justify-between p-4 sm:p-4.5 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-purple-400/40 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-purple-600/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="p-2 rounded-lg bg-purple-400/10 text-purple-400 [data-theme=light]:text-purple-600">
                    <FileText className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    Curriculum Vitae
                  </span>
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-purple-400 [data-theme=light]:group-hover:text-purple-600 transition-colors truncate">
                  Sivodayan_Sujeevakumar_CV.pdf
                </div>
                <p className="text-[11px] text-[#94a3b8] [data-theme=light]:text-slate-500 mt-0.5">
                  Comprehensive academic &amp; project record
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/10 [data-theme=light]:border-slate-200 grid grid-cols-2 gap-2">
                <a
                  href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 [data-theme=light]:bg-purple-600/10 [data-theme=light]:hover:bg-purple-600/20 text-purple-400 [data-theme=light]:text-purple-700 font-mono text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View CV</span>
                </a>
                <a
                  href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                  download="Sivodayan_Sujeevakumar_CV.pdf"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 [data-theme=light]:bg-slate-200 [data-theme=light]:hover:bg-slate-300 text-white [data-theme=light]:text-slate-900 font-mono text-xs font-semibold transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-[#cbd5e1] [data-theme=light]:text-slate-600 pt-3 border-t border-white/10 [data-theme=light]:border-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Department Representative, Computer Science &amp; Engineering, University of Moratuwa</span>
            </span>
            <span className="text-[#94a3b8] [data-theme=light]:text-slate-500">
              Response time: &lt; 24 hours
            </span>
          </div>
        </div>
      </motion.div>

      {/* Embedded Single-Screen Clean Footer */}
      <footer className="relative z-10 w-full pt-2.5 pb-2 sm:pb-2.5 border-t border-white/10 [data-theme=light]:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[11px] text-center sm:text-left font-mono text-[#94a3b8] [data-theme=light]:text-slate-600">
        <div>© {new Date().getFullYear()} Sujeevakumar Sivodayan</div>
        <div>Computer Science &amp; Engineering • University of Moratuwa</div>
      </footer>
    </section>
  );
};

export default Contact;
