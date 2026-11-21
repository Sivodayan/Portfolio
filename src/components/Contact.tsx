import React, { useState } from 'react';
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
  Copy,
  Check,
  GraduationCap,
  FolderGit2,
  ArrowUp,
  Globe,
} from 'lucide-react';
import RisingLines from './RisingLines';
import GlitchHeading from './GlitchHeading';
import { footer } from 'framer-motion/client';

export interface ContactProps {
  onShowToast?: (msg: string) => void;
  theme?: 'dark' | 'light';
}

export const Contact: React.FC<ContactProps> = ({ onShowToast, theme = 'dark' }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      onShowToast?.(`${label} copied to clipboard`);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(() => {
      onShowToast?.(text);
    });
  };

  return (
    <section
      className="section relative w-full min-h-[100dvh] flex flex-col justify-between pt-12 sm:pt-16 pb-6 !pb-4 overflow-hidden"
      id="contact"
    >
      <div
        className={`absolute inset-x-0 sm:-inset-x-16 -bottom-16 top-0 pointer-events-none z-0 ${
          theme === 'light' ? 'opacity-25' : 'opacity-40'
        } overflow-hidden`}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
        }}
      >
        <RisingLines
          colors={theme === 'light' ? ['#0284c7', '#6366f1'] : ['#44f0ff', '#ff087b']}
          color={theme === 'light' ? '#0284c7' : '#ff087b'}
          horizonColor={theme === 'light' ? '#38bdf8' : '#44f0ff'}
          haloColor={theme === 'light' ? '#0ea5e9' : '#38bdf8'}
          horizonHeight={-0.45}
          speed={0.6}
          density={1.1}
          lineWidth={1.2}
          lineLength={1.1}
          interactive={true}
          horizonGlow={theme === 'light' ? 0.9 : 1.2}
          particles={1}
          className="w-full h-full pointer-events-auto"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-6xl mx-auto my-auto py-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-6">
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
            <p className="text-xs sm:text-[13px] font-mono text-[#cbd5e1] [data-theme=light]:text-slate-600 mt-1 max-w-2xl">
              Let&apos;s collaborate on full-stack systems, hardware telemetry, or software engineering internships.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4.5 mb-5 sm:mb-6">
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-[#44f0ff]/40 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-[#0284c7]/40 backdrop-blur-md transition-all shadow-sm group">
              <div className="flex items-center gap-3 min-w-0">
                <span className="p-2.5 rounded-xl bg-[#44f0ff]/10 text-[#44f0ff] [data-theme=light]:text-[#0284c7] shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    Primary Email
                  </div>
                  <a
                    href="mailto:sivodayan17@gmail.com"
                    className="text-xs sm:text-sm font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-[#44f0ff] [data-theme=light]:group-hover:text-[#0284c7] transition-colors truncate block"
                    title="Send Email"
                  >
                    sivodayan17@gmail.com
                  </a>
                </div>
              </div>

              
            </div>

            {/* Direct Phone & WhatsApp Tile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-[#34d399]/40 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-emerald-600/40 backdrop-blur-md transition-all shadow-sm group">
              <div className="flex items-center gap-3 min-w-0">
                <span className="p-2.5 rounded-xl bg-[#34d399]/10 text-[#34d399] [data-theme=light]:text-emerald-700 shrink-0">
                  <Phone className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    Phone &amp; WhatsApp
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-[#34d399] [data-theme=light]:group-hover:text-emerald-700 transition-colors">
                    +94 70 589 1710
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="https://wa.me/94705891710"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#34d399]/15 hover:bg-[#34d399]/25 [data-theme=light]:bg-emerald-600/10 [data-theme=light]:hover:bg-emerald-600/20 text-[#34d399] [data-theme=light]:text-emerald-700 font-mono text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+94705891710"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 [data-theme=light]:bg-slate-200 [data-theme=light]:hover:bg-slate-300 text-white [data-theme=light]:text-slate-900 font-mono text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('+94 70 589 1710', 'Phone number', 'phone')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 [data-theme=light]:bg-slate-200 [data-theme=light]:hover:bg-slate-300 text-[#cbd5e1] [data-theme=light]:text-slate-700 transition-colors"
                  title="Copy phone number"
                  aria-label="Copy phone number"
                >
                  {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Two-Column Social / Code Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* LinkedIn Network */}
              <a
                href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-[#38bdf8]/40 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-[#0284c7]/40 backdrop-blur-md transition-all shadow-sm group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="p-2 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] [data-theme=light]:text-[#0284c7] shrink-0">
                    <Linkedin className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                      LinkedIn
                    </div>
                    <div className="text-xs sm:text-[13px] font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-[#38bdf8] [data-theme=light]:group-hover:text-[#0284c7] transition-colors truncate">
                      sivodayan-sujeevakumar
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-[#38bdf8] transition-colors shrink-0" />
              </a>

              {/* GitHub Repository */}
              <a
                href="https://github.com/Sivodayan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-white/30 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-slate-500/40 backdrop-blur-md transition-all shadow-sm group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="p-2 rounded-lg bg-white/10 [data-theme=light]:bg-slate-200 text-white [data-theme=light]:text-slate-900 shrink-0">
                    <Github className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                      GitHub
                    </div>
                    <div className="text-xs sm:text-[13px] font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-white transition-colors truncate">
                      github.com/Sivodayan
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-white transition-colors shrink-0" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/45 hover:bg-black/70 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white border border-white/10 hover:border-purple-400/40 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-purple-600/40 backdrop-blur-md transition-all shadow-sm group">
              <div className="flex items-center gap-3 min-w-0">
                <span className="p-2.5 rounded-xl bg-purple-400/10 text-purple-400 [data-theme=light]:text-purple-600 shrink-0">
                  <FileText className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    Curriculum Vitae (PDF)
                  </div>
                  <div className="text-xs sm:text-[13px] font-semibold text-white [data-theme=light]:text-slate-900 group-hover:text-purple-400 [data-theme=light]:group-hover:text-purple-600 transition-colors truncate">
                    Sivodayan_Sujeevakumar_CV.pdf
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 [data-theme=light]:bg-purple-600/10 [data-theme=light]:hover:bg-purple-600/20 text-purple-400 [data-theme=light]:text-purple-700 font-mono text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View PDF</span>
                </a>
                <a
                  href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                  download="Sivodayan_Sujeevakumar_CV.pdf"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 [data-theme=light]:bg-slate-200 [data-theme=light]:hover:bg-slate-300 text-white [data-theme=light]:text-slate-900 font-mono text-xs font-semibold transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#cbd5e1] [data-theme=light]:text-slate-600 pt-3.5 border-t border-white/10 [data-theme=light]:border-slate-300">
          <nav className="flex items-center gap-3 text-[11px] sm:text-xs font-mono text-[#94a3b8]" aria-label="Page jump links">
            <a href="#about" className="hover:text-white [data-theme=light]:hover:text-slate-900 transition-colors">
              About
            </a>
            <span>•</span>
            <a href="#projects" className="hover:text-white [data-theme=light]:hover:text-slate-900 transition-colors">
              Projects
            </a>
            <span>•</span>
            <a href="#skills" className="hover:text-white [data-theme=light]:hover:text-slate-900 transition-colors">
              Skills
            </a>
            <span>•</span>
            <a href="#experience" className="hover:text-white [data-theme=light]:hover:text-slate-900 transition-colors">
              Experience
            </a>
            <span>•</span>
            <a
              href="#about"
              className="inline-flex items-center gap-1 text-[#44f0ff] [data-theme=light]:text-[#0284c7] hover:underline font-bold"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </a>
          </nav>
        </div>
      </motion.div>

      <footer className="relative z-10 w-full pt-3 pb-2 sm:pb-3 border-t border-white/10 [data-theme=light]:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[11px] text-center sm:text-left font-mono text-[#94a3b8] [data-theme=light]:text-slate-600">
        <div>© {new Date().getFullYear()} Sujeevakumar Sivodayan • Computer Science &amp; Engineering</div>
        <div>University of Moratuwa • Built with React 19, TypeScript &amp; Three.js</div>
      </footer>
    </section>
  );
};

export default Contact;
