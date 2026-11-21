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
      className="section relative w-full min-h-[100dvh] flex flex-col justify-between pt-12 sm:pt-16 pb-6 !pb-4"
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
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-6xl mx-auto my-auto py-2"
      >
        {/* Section Header */}
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

          {/* Active Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 [data-theme=light]:text-emerald-700 text-xs font-mono font-medium self-start sm:self-auto backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open for Software Engineering Internships</span>
          </div>
        </div>

        {/* Master Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4.5 mb-5 sm:mb-6">
          
          {/* Left Column: Direct Communication Channels (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* Direct Email Tile */}
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

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="mailto:sivodayan17@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#44f0ff]/15 hover:bg-[#44f0ff]/25 [data-theme=light]:bg-[#0284c7]/10 [data-theme=light]:hover:bg-[#0284c7]/20 text-[#44f0ff] [data-theme=light]:text-[#0284c7] font-mono text-xs font-semibold transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Mail</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('sivodayan17@gmail.com', 'Email', 'email')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 [data-theme=light]:bg-slate-200 [data-theme=light]:hover:bg-slate-300 text-[#cbd5e1] [data-theme=light]:text-slate-700 transition-colors"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
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

            {/* Official Resume / CV Bar */}
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

          {/* Right Column: Academic, Location & Project Demos (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* University & Department Card */}
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/45 [data-theme=light]:bg-white/85 border border-white/10 [data-theme=light]:border-slate-300 backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] [data-theme=light]:text-[#0284c7]">
                    <GraduationCap className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    University &amp; Dept.
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#38bdf8] font-bold">
                  B.Sc. Eng (Hons)
                </span>
              </div>
              <div className="text-xs sm:text-[13px] font-bold text-white [data-theme=light]:text-slate-900">
                Department of Computer Science &amp; Engineering
              </div>
              <p className="text-[11px] text-[#94a3b8] [data-theme=light]:text-slate-600 mt-0.5">
                University of Moratuwa • Sri Lanka
              </p>

              <div className="mt-3 pt-2.5 border-t border-white/10 [data-theme=light]:border-slate-200 flex items-center gap-2 text-xs font-mono">
                <a
                  href="https://cse.uom.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#38bdf8] [data-theme=light]:text-[#0284c7] hover:underline"
                >
                  <Globe className="w-3 h-3" />
                  <span>CSE Portal ↗</span>
                </a>
                <span className="text-[#94a3b8]">•</span>
                <a
                  href="https://uom.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#cbd5e1] [data-theme=light]:text-slate-700 hover:underline"
                >
                  <span>uom.lk ↗</span>
                </a>
              </div>
            </div>

            {/* Location & Timezone Card */}
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/45 [data-theme=light]:bg-white/85 border border-white/10 [data-theme=light]:border-slate-300 backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 [data-theme=light]:text-amber-600">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                    Physical Base
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 [data-theme=light]:text-amber-600">
                  <Clock className="w-3 h-3" />
                  <span>UTC+5:30 (SLST)</span>
                </div>
              </div>
              <div className="text-xs sm:text-[13px] font-bold text-white [data-theme=light]:text-slate-900">
                Moratuwa &amp; Jaffna, Sri Lanka
              </div>
              <p className="text-[11px] text-[#94a3b8] [data-theme=light]:text-slate-600 mt-0.5">
                Katubedda Campus &amp; Northern Province
              </p>

              <div className="mt-3 pt-2.5 border-t border-white/10 [data-theme=light]:border-slate-200 flex items-center justify-between text-xs font-mono">
                <a
                  href="https://maps.google.com/?q=University+of+Moratuwa,+Katubedda,+Moratuwa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 [data-theme=light]:text-amber-600 hover:underline"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Open in Google Maps ↗</span>
                </a>
                <span className="text-emerald-400 [data-theme=light]:text-emerald-700 font-semibold">On-site &amp; Remote</span>
              </div>
            </div>

            {/* Quick Live Projects & Repositories Card */}
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/45 [data-theme=light]:bg-white/85 border border-white/10 [data-theme=light]:border-slate-300 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="p-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 [data-theme=light]:text-emerald-600">
                  <FolderGit2 className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] [data-theme=light]:text-slate-500 font-semibold">
                  Featured Repositories &amp; Demos
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <a
                  href="https://github.com/Sivodayan/Flood-Alert-System"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 [data-theme=light]:bg-slate-100 [data-theme=light]:hover:bg-slate-200 border border-white/5 [data-theme=light]:border-slate-300 text-white [data-theme=light]:text-slate-900 truncate hover:text-[#44f0ff] transition-colors flex items-center justify-between"
                  title="Flood Alert System (ESP32 + IoT)"
                >
                  <span className="truncate">Flood Alert</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                </a>
                <a
                  href="https://sivodayan.github.io/UoM-Redesign/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 [data-theme=light]:bg-slate-100 [data-theme=light]:hover:bg-slate-200 border border-white/5 [data-theme=light]:border-slate-300 text-white [data-theme=light]:text-slate-900 truncate hover:text-[#38bdf8] transition-colors flex items-center justify-between"
                  title="UoM Redesign Live Demo"
                >
                  <span className="truncate">UoM Live</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                </a>
                <a
                  href="https://sivodayan.github.io/MORA-Travels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 [data-theme=light]:bg-slate-100 [data-theme=light]:hover:bg-slate-200 border border-white/5 [data-theme=light]:border-slate-300 text-white [data-theme=light]:text-slate-900 truncate hover:text-[#34d399] transition-colors flex items-center justify-between"
                  title="MORA Travels Live Demo"
                >
                  <span className="truncate">MORA Travels</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                </a>
                <a
                  href="https://github.com/Sivodayan/KCC-Project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 [data-theme=light]:bg-slate-100 [data-theme=light]:hover:bg-slate-200 border border-white/5 [data-theme=light]:border-slate-300 text-white [data-theme=light]:text-slate-900 truncate hover:text-purple-400 transition-colors flex items-center justify-between"
                  title="KCC LMS Management Portal"
                >
                  <span className="truncate">KCC LMS</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Anchor Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#cbd5e1] [data-theme=light]:text-slate-600 pt-3.5 border-t border-white/10 [data-theme=light]:border-slate-300">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSE Department Representative • Typically responds within 24 hours</span>
          </div>

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

      {/* Embedded Clean Footer */}
      <footer className="relative z-10 w-full pt-3 pb-2 sm:pb-3 border-t border-white/10 [data-theme=light]:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[11px] text-center sm:text-left font-mono text-[#94a3b8] [data-theme=light]:text-slate-600">
        <div>© {new Date().getFullYear()} Sujeevakumar Sivodayan • Computer Science &amp; Engineering</div>
        <div>University of Moratuwa • Built with React 19, TypeScript &amp; Three.js</div>
      </footer>
    </section>
  );
};

export default Contact;
