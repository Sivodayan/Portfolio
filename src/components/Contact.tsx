import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TextEngine from 'spring-text-engine';
import {
  Mail,
  Phone,
  MessageCircle,
  Linkedin,
  Github,
  ExternalLink,
  Send,
  Copy,
  Check,
  Download,
  FileText,
} from 'lucide-react';
import GlitchHeading from './GlitchHeading';
import RisingLines from './RisingLines';

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
      className="section relative w-full min-h-screen flex flex-col justify-start pt-2 sm:pt-5 pb-24 sm:pb-44 overflow-hidden"
      id="contact"
    >
      <div
        className={`absolute inset-x-0 sm:-inset-x-16 -bottom-16 top-0 pointer-events-none z-0 ${
          theme === 'light' ? 'opacity-85' : 'opacity-40'
        } overflow-hidden`}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
        }}
      >
        <RisingLines
          colors={theme === 'light' ? ['#f59e0b', '#e11d48'] : ['#e5a93c', '#ff087b']}
          color={theme === 'light' ? '#e11d48' : '#ff087b'}
          horizonColor={theme === 'light' ? '#d97706' : '#f3ba63'}
          haloColor={theme === 'light' ? '#f59e0b' : '#e5a93c'}
          horizonHeight={-0.45}
          speed={0.6}
          density={theme === 'light' ? 1.3 : 1.1}
          lineWidth={theme === 'light' ? 1.6 : 1.2}
          lineLength={theme === 'light' ? 1.3 : 1.1}
          interactive={true}
          horizonGlow={theme === 'light' ? 0.6 : 1.2}
          particles={1}
          brightness={theme === 'light' ? 1.2 : 1.0}
          className="w-full h-full pointer-events-auto"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl mx-auto my-0 flex-1 flex flex-col justify-start"
      >
        {/* Header with status pill and subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-3 sm:mb-6">
          <div>
            <GlitchHeading>
              <TextEngine
                tag="h2"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className="section-heading !mb-0 !border-none !pb-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-white light:text-slate-900 drop-shadow-sm"
              >
                Get in Touch
              </TextEngine>
            </GlitchHeading>

            <p className="text-xs sm:text-sm font-mono text-[#94a3b8] light:text-slate-600 mt-2 max-w-xl">
              Have an idea, project collaboration, or engineering role? Feel free to reach out directly through any channel below.
            </p>
          </div>
        </div>

        {/* 4 Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-4">
          {/* Email Card */}
          <div
            role="button"
            tabIndex={0}
            data-cursor-target
            data-cursor-card
            onClick={() => {
              window.location.href = 'mailto:sivodayan17@gmail.com';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.location.href = 'mailto:sivodayan17@gmail.com';
              }
            }}
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-[#e5a93c]/50 light:border-slate-200 light:hover:border-[#b45309]/40 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] light:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer focus:outline-none focus:ring-0"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="p-2.5 rounded-lg bg-[#e5a93c]/10 text-[#e5a93c] light:bg-amber-50 light:text-[#b45309] border border-[#e5a93c]/20 light:border-amber-200/60 shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-500 font-semibold">
                  Email
                </div>
                <span
                  className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309] transition-colors truncate block"
                  title="Send Email"
                >
                  sivodayan17@gmail.com
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2 relative z-10" onClick={(e) => e.stopPropagation()}>
              <a
                href="mailto:sivodayan17@gmail.com"
                data-cursor-ignore
                className="p-2 rounded-lg bg-[#e5a93c]/15 hover:bg-[#e5a93c]/25 light:bg-[#b45309]/10 light:hover:bg-[#b45309]/20 border border-white/10 light:border-slate-300 text-[#e5a93c] light:text-[#b45309] transition-colors cursor-pointer focus:outline-none"
                title="Send Mail"
                aria-label="Send Mail"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                data-cursor-ignore
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy('sivodayan17@gmail.com', 'Email', 'email');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-[#cbd5e1] light:text-slate-700 transition-colors cursor-pointer focus:outline-none"
                title="Copy email address"
                aria-label="Copy email address"
              >
                {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* WhatsApp / Phone Card */}
          <div
            role="button"
            tabIndex={0}
            data-cursor-target
            data-cursor-card
            onClick={() => {
              window.open('https://wa.me/94705891710', '_blank', 'noopener,noreferrer');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.open('https://wa.me/94705891710', '_blank', 'noopener,noreferrer');
              }
            }}
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-emerald-500/50 light:border-slate-200 light:hover:border-emerald-600/40 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] light:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer focus:outline-none focus:ring-0"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 light:bg-emerald-50 light:text-emerald-700 border border-emerald-500/20 light:border-emerald-200/60 shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-500 font-semibold">
                  WhatsApp / Phone
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 group-hover:text-emerald-400 light:group-hover:text-emerald-700 transition-colors truncate">
                  +94 70 589 1710
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2 relative z-10" onClick={(e) => e.stopPropagation()}>
              <a
                href="https://wa.me/94705891710"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-ignore
                className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 light:bg-emerald-600/10 light:hover:bg-emerald-600/20 border border-white/10 light:border-slate-300 text-emerald-400 light:text-emerald-700 transition-colors cursor-pointer focus:outline-none"
                title="Chat on WhatsApp"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                data-cursor-ignore
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy('+94 70 589 1710', 'Phone number', 'phone');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-[#cbd5e1] light:text-slate-700 transition-colors cursor-pointer focus:outline-none"
                title="Copy phone number"
                aria-label="Copy phone number"
              >
                {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* LinkedIn Card */}
          <a
            href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-card
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-sky-500/50 light:border-slate-200 light:hover:border-sky-600/40 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] light:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-0.5 group focus:outline-none focus:ring-0"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 light:bg-sky-50 light:text-sky-700 border border-sky-500/20 light:border-sky-200/60 shrink-0 group-hover:scale-105 transition-transform">
                <Linkedin className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-500 font-semibold">
                  LinkedIn
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-white light:text-slate-900 group-hover:text-sky-400 light:group-hover:text-sky-700 transition-colors truncate">
                  in/sivodayan-sujeevakumar
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#94a3b8] group-hover:text-sky-400 light:group-hover:text-sky-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
          </a>

          {/* GitHub Card */}
          <a
            href="https://github.com/Sivodayan"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-card
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-purple-400/50 light:border-slate-200 light:hover:border-slate-400 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] light:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-0.5 group focus:outline-none focus:ring-0"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="p-2.5 rounded-lg bg-purple-500/10 light:bg-slate-100 text-purple-300 light:text-slate-900 border border-purple-500/20 light:border-slate-300 shrink-0 group-hover:scale-105 transition-transform">
                <Github className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-500 font-semibold">
                  GitHub
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-white light:text-slate-900 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309] transition-colors truncate">
                  github.com/Sivodayan
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#94a3b8] group-hover:text-white light:group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
          </a>
        </div>

        {/* CV / Resume Section Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-[#e5a93c]/40 light:border-slate-200 light:hover:border-[#b45309]/30 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)] light:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-[#e5a93c]/20 to-[#ff087b]/20 text-[#e5a93c] light:text-[#b45309] border border-[#e5a93c]/30 light:border-amber-300/60 shrink-0">
              <FileText className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white light:text-slate-900 tracking-tight">
                  Curriculum Vitae
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 light:bg-slate-200 text-white/80 light:text-slate-700 border border-white/10 light:border-slate-300">
                  PDF
                </span>
              </div>
              <p className="text-xs font-mono text-[#94a3b8] light:text-slate-500 mt-0.5 truncate">
                Computer Science &amp; Engineering resume • Sivodayan Sujeevakumar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
            <a
              href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 hover:border-white/20 light:border-slate-300 text-white light:text-slate-900 font-mono text-xs sm:text-[13px] font-semibold transition-all group cursor-pointer focus:outline-none"
              title="View Resume in Browser (PDF)"
            >
              <FileText className="w-4 h-4 text-[#e5a93c] light:text-[#b45309] group-hover:scale-110 transition-transform" />
              <span>View CV</span>
            </a>

            <a
              href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
              download="Sivodayan_Sujeevakumar_CV.pdf"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e5a93c] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-black font-mono text-xs sm:text-[13px] font-bold shadow-md shadow-[#e5a93c]/20 hover:shadow-[#e5a93c]/35 transition-all group cursor-pointer focus:outline-none"
              title="Download Resume (PDF)"
            >
              <Download className="w-4 h-4 text-black group-hover:translate-y-0.5 transition-transform" />
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Copyright / Credits / Footer ("cc") */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto mt-12 sm:mt-16 pt-6 pb-6 border-t border-white/10 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs font-mono text-[#94a3b8] light:text-slate-500">
        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5">
          <span>© {new Date().getFullYear()} Sivodayan Sujeevakumar</span>
          <span className="hidden sm:inline text-white/20 light:text-slate-300">•</span>
          <span className="text-white/60 light:text-slate-600 font-medium">Computer Science &amp; Engineering</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#94a3b8] light:text-slate-500">
          <span>University of Moratuwa</span>
          <span className="text-white/20 light:text-slate-300">•</span>
          <span>Colombo, LK</span>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
