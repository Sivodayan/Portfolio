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
  ExternalLink,
  Send,
  Copy,
  Check,
  ArrowUp,
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
      className="section relative w-full min-h-[100dvh] flex flex-col justify-between pt-12 sm:pt-16 pb-16 sm:pb-20 overflow-hidden"
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
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl mx-auto my-auto flex flex-col justify-center"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
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
           
          </div>

         
        </div>

        {/* Compact 4-Card Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
          {/* Email Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/45 hover:bg-black/70 light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-[#38bdf8]/40 light:border-slate-200 light:hover:border-[#0284c7]/40 backdrop-blur-md transition-all shadow-sm group">
            <div className="flex items-center gap-3 min-w-0">
              <span className="p-2.5 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] light:text-[#0284c7] shrink-0">
                <Mail className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-500 font-semibold">
                  Email
                </div>
                <a
                  href="mailto:sivodayan17@gmail.com"
                  className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 group-hover:text-[#38bdf8] light:group-hover:text-[#0284c7] transition-colors truncate block"
                  title="Send Email"
                >
                  sivodayan17@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <a
                href="mailto:sivodayan17@gmail.com"
                className="p-2 rounded-lg bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 light:bg-[#0284c7]/10 light:hover:bg-[#0284c7]/20 border border-white/10 light:border-slate-300 text-[#38bdf8] light:text-[#0284c7] transition-colors cursor-pointer"
                title="Send Mail"
                aria-label="Send Mail"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => handleCopy('sivodayan17@gmail.com', 'Email', 'email')}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-[#cbd5e1] light:text-slate-700 transition-colors cursor-pointer"
                title="Copy email address"
                aria-label="Copy email address"
              >
                {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* WhatsApp & Phone Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/45 hover:bg-black/70 light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-emerald-500/40 light:border-slate-200 light:hover:border-emerald-600/40 backdrop-blur-md transition-all shadow-sm group">
            <div className="flex items-center gap-3 min-w-0">
              <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 light:text-emerald-700 shrink-0">
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

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <a
                href="https://wa.me/94705891710"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 light:bg-emerald-600/10 light:hover:bg-emerald-600/20 border border-white/10 light:border-slate-300 text-emerald-400 light:text-emerald-700 transition-colors cursor-pointer"
                title="Chat on WhatsApp"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => handleCopy('+94 70 589 1710', 'Phone number', 'phone')}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-[#cbd5e1] light:text-slate-700 transition-colors cursor-pointer"
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
            className="flex items-center justify-between p-4 rounded-xl bg-black/45 hover:bg-black/70 light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-[#38bdf8]/40 light:border-slate-200 light:hover:border-[#0284c7]/40 backdrop-blur-md transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="p-2.5 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] light:text-[#0284c7] shrink-0">
                <Linkedin className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-500 font-semibold">
                  LinkedIn
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-white light:text-slate-900 group-hover:text-[#38bdf8] light:group-hover:text-[#0284c7] transition-colors truncate">
                  in/sivodayan-sujeevakumar
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#94a3b8] group-hover:text-[#38bdf8] light:group-hover:text-[#0284c7] transition-colors shrink-0 ml-2" />
          </a>

          {/* GitHub Card */}
          <a
            href="https://github.com/Sivodayan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl bg-black/45 hover:bg-black/70 light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-white/30 light:border-slate-200 light:hover:border-slate-400 backdrop-blur-md transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="p-2.5 rounded-lg bg-white/10 light:bg-slate-100 text-white light:text-slate-900 shrink-0">
                <Github className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-500 font-semibold">
                  GitHub
                </div>
                <div className="text-xs sm:text-[13px] font-semibold text-white light:text-slate-900 group-hover:text-[#38bdf8] light:group-hover:text-[#0284c7] transition-colors truncate">
                  github.com/Sivodayan
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#94a3b8] group-hover:text-white light:group-hover:text-slate-900 transition-colors shrink-0 ml-2" />
          </a>
        </div>
      </motion.div>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto pt-6 mb-6 sm:mb-10 border-t border-white/10 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#94a3b8] light:text-slate-500">
        <div>© {new Date().getFullYear()} Sivodayan Sujeevakumar</div>
        <div>Computer Science &amp; Engineering • University of Moratuwa</div>
      </footer>
    </section>
  );
};

export default Contact;
