import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  User,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import GlitchHeading from './GlitchHeading';
import RisingLines from './RisingLines';
import { sendContactMessage } from '../services/smtpService';

export interface ContactProps {
  onShowToast?: (msg: string) => void;
  theme?: 'dark' | 'light';
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast, theme = 'dark' }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [sendProvider, setSendProvider] = useState<string | null>(null);

  const handleCopy = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      onShowToast?.(`${label} copied to clipboard`);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(() => {
      onShowToast?.(text);
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();
    const subject = formData.subject.trim();

    if (!name || name.length < 2) {
      setFormError('Please enter your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!message || message.length < 8) {
      setFormError('Please enter a message (at least 8 characters).');
      return;
    }

    setFormStatus('submitting');
    setFormError(null);

    try {
      const result = await sendContactMessage({
        name,
        email,
        subject,
        message,
      });

      setSendProvider(result.provider);
      setFormStatus('success');

      if (result.provider === 'fallback-mailto') {
        onShowToast?.('Message drafted in your email client! (Copied to clipboard)');
      } else {
        onShowToast?.('Message dispatched successfully via SMTP API!');
      }
    } catch (err: any) {
      setFormStatus('idle');
      setFormError(err?.message || 'Failed to dispatch message via SMTP API.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setFormStatus('idle');
    setFormError(null);
    setSendProvider(null);
  };

  return (
    <section
      className="section relative w-full min-h-screen lg:min-h-[calc(100vh-3.75rem)] flex flex-col justify-between pt-5 sm:pt-7 lg:pt-8 pb-3 sm:pb-4 overflow-hidden px-4 sm:px-6 lg:px-8"
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
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto flex flex-col justify-start"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 mb-4 sm:mb-5 lg:mb-6">
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
            <p className="text-xs sm:text-sm font-mono text-[#94a3b8] light:text-slate-600 mt-1 max-w-xl">
              Have an idea, project collaboration, or engineering role? Reach out directly below.
            </p>
          </div>

          <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 light:text-emerald-700 text-[11px] font-mono font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Available for opportunities</span>
          </div>
        </div>

        {/* 2-Column Desktop Grid / 1-Column Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          {/* Left Column: Precision Instrument Channels & CV */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-3.5">
            {/* Channel 01: Email */}
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
              className="relative group p-4 rounded-2xl bg-[#0c0e14] hover:bg-[#11141c] light:bg-white light:hover:bg-slate-50 border border-white/[0.08] hover:border-[#e5a93c]/50 light:border-slate-200 light:hover:border-amber-600/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.6),0_1px_0_0_rgba(255,255,255,0.06)_inset] light:shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus:outline-none overflow-hidden"
            >
              {/* Corner accent registration tick */}
              <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
                <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-[#e5a93c] light:border-slate-300 light:group-hover:border-amber-600 transition-colors" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#161922] to-[#0e1017] light:from-slate-100 light:to-slate-50 border border-white/10 light:border-slate-200 text-[#e5a93c] light:text-[#b45309] shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono tracking-widest text-[#94a3b8] light:text-slate-500 font-medium flex items-center gap-1.5">
                      <span className="text-[#e5a93c] light:text-[#b45309]">01 //</span>
                      <span>DIRECT DISPATCH</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309] transition-colors truncate block mt-0.5">
                      sivodayan17@gmail.com
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                  <a
                    href="mailto:sivodayan17@gmail.com"
                    data-cursor-ignore
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-[#e5a93c]/20 light:bg-slate-100 light:hover:bg-amber-100/70 border border-white/10 hover:border-[#e5a93c]/40 light:border-slate-300 text-[#e5a93c] light:text-[#b45309] transition-all cursor-pointer active:translate-y-0.5"
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
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-[#cbd5e1] light:text-slate-700 transition-all cursor-pointer active:translate-y-0.5"
                    title="Copy email address"
                    aria-label="Copy email address"
                  >
                    {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Channel 02: WhatsApp / Phone */}
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
              className="relative group p-4 rounded-2xl bg-[#0c0e14] hover:bg-[#11141c] light:bg-white light:hover:bg-slate-50 border border-white/[0.08] hover:border-emerald-500/50 light:border-slate-200 light:hover:border-emerald-600/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.6),0_1px_0_0_rgba(255,255,255,0.06)_inset] light:shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus:outline-none overflow-hidden"
            >
              {/* Corner accent registration tick */}
              <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
                <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-emerald-400 light:border-slate-300 light:group-hover:border-emerald-600 transition-colors" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#161922] to-[#0e1017] light:from-slate-100 light:to-slate-50 border border-white/10 light:border-slate-200 text-emerald-400 light:text-emerald-700 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono tracking-widest text-[#94a3b8] light:text-slate-500 font-medium flex items-center gap-1.5">
                      <span className="text-emerald-400 light:text-emerald-700">02 //</span>
                      <span>SECURE CELL</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 group-hover:text-emerald-400 light:group-hover:text-emerald-700 transition-colors truncate mt-0.5">
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
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-emerald-500/20 light:bg-slate-100 light:hover:bg-emerald-100/70 border border-white/10 hover:border-emerald-500/40 light:border-slate-300 text-emerald-400 light:text-emerald-700 transition-all cursor-pointer active:translate-y-0.5"
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
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-[#cbd5e1] light:text-slate-700 transition-all cursor-pointer active:translate-y-0.5"
                    title="Copy phone number"
                    aria-label="Copy phone number"
                  >
                    {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Channel 03: LinkedIn & GitHub Dual Mod */}
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
              <a
                href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-card
                className="relative group p-3.5 rounded-2xl bg-[#0c0e14] hover:bg-[#11141c] light:bg-white light:hover:bg-slate-50 border border-white/[0.08] hover:border-sky-500/50 light:border-slate-200 light:hover:border-sky-600/40 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.5),0_1px_0_0_rgba(255,255,255,0.06)_inset] light:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between focus:outline-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="p-2 rounded-xl bg-gradient-to-b from-[#161922] to-[#0e1017] light:from-slate-100 light:to-slate-50 border border-white/10 light:border-slate-200 text-sky-400 light:text-sky-700 shrink-0">
                    <Linkedin className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[9px] font-mono tracking-wider text-[#94a3b8] light:text-slate-500">
                      // 03A
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 group-hover:text-sky-400 light:group-hover:text-sky-700 transition-colors truncate block">
                      LinkedIn
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </a>

              <a
                href="https://github.com/Sivodayan"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-card
                className="relative group p-3.5 rounded-2xl bg-[#0c0e14] hover:bg-[#11141c] light:bg-white light:hover:bg-slate-50 border border-white/[0.08] hover:border-purple-400/50 light:border-slate-200 light:hover:border-slate-400 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.5),0_1px_0_0_rgba(255,255,255,0.06)_inset] light:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between focus:outline-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="p-2 rounded-xl bg-gradient-to-b from-[#161922] to-[#0e1017] light:from-slate-100 light:to-slate-50 border border-white/10 light:border-slate-200 text-purple-300 light:text-slate-900 shrink-0">
                    <Github className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[9px] font-mono tracking-wider text-[#94a3b8] light:text-slate-500">
                      // 03B
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309] transition-colors truncate block">
                      GitHub
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </a>
            </div>

            {/* Channel 04: Curriculum Vitae (CV) */}
            <div className="relative group p-4 rounded-2xl bg-[#0c0e14] hover:bg-[#11141c] light:bg-white light:hover:bg-slate-50 border border-white/[0.08] hover:border-[#e5a93c]/40 light:border-slate-200 light:hover:border-amber-600/30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.6),0_1px_0_0_rgba(255,255,255,0.06)_inset] light:shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)] transition-all duration-200 flex items-center justify-between gap-2.5 overflow-hidden">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="p-2.5 rounded-xl bg-gradient-to-b from-[#1e1a14] to-[#120f0a] light:from-amber-50 light:to-amber-100/50 text-[#e5a93c] light:text-[#b45309] border border-[#e5a93c]/30 shrink-0 shadow-inner">
                  <FileText className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono tracking-widest text-[#94a3b8] light:text-slate-500 font-medium">
                      <span className="text-[#e5a93c] light:text-[#b45309]">04 //</span>
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white light:text-slate-900 tracking-tight">
                      Curriculum Vitae
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#1e2330] light:bg-slate-200 text-white/80 light:text-slate-700 border border-white/10">
                      PDF
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-mono text-[#94a3b8] light:text-slate-500 truncate mt-0.5">
                    Engineering resume &amp; academic records
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-white light:text-slate-900 font-mono text-xs font-semibold transition-all group cursor-pointer active:translate-y-0.5"
                  title="View Resume in Browser (PDF)"
                >
                  <FileText className="w-3.5 h-3.5 text-[#e5a93c] light:text-[#b45309]" />
                  <span>View</span>
                </a>

                <a
                  href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                  download="Sivodayan_Sujeevakumar_CV.pdf"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#e5a93c] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-black font-mono text-xs font-bold shadow-sm transition-all group cursor-pointer active:translate-y-0.5"
                  title="Download Resume (PDF)"
                >
                  <Download className="w-3.5 h-3.5 text-black" />
                  <span>CV</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Precision Dispatch Console */}
          <div className="lg:col-span-7 p-5 sm:p-6 lg:p-6 rounded-2xl bg-[#0c0e14] light:bg-white border border-white/[0.08] hover:border-[#e5a93c]/40 light:border-slate-200 light:hover:border-amber-600/30 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6),0_1px_0_0_rgba(255,255,255,0.06)_inset] light:shadow-[0_2px_16px_-2px_rgba(15,23,42,0.06)] transition-all duration-200 flex flex-col justify-between">
            {/* Console Header Bar */}
            <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-white/[0.06] light:border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-gradient-to-b from-[#1e1a14] to-[#120f0a] light:from-amber-50 light:to-amber-100/50 text-[#e5a93c] light:text-[#b45309] border border-[#e5a93c]/30 shrink-0 shadow-inner">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white light:text-slate-900 tracking-tight font-mono">
                    DISPATCH CONSOLE
                  </h3>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#06070a] light:bg-slate-100 border border-white/[0.08] light:border-slate-200 text-[10px] font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 light:text-emerald-700 font-semibold">SMTP RELAY ACTIVE</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {formStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="py-8 px-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-center flex flex-col items-center gap-3 my-auto"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white light:text-slate-900 mb-1 font-mono">
                      {sendProvider === 'fallback-mailto'
                        ? '[TRANSMISSION QUEUED IN CLIENT]'
                        : '[MESSAGE TRANSMITTED OVER SMTP]'}
                    </h4>
                    <p className="text-xs font-mono text-[#94a3b8] light:text-slate-600 max-w-sm mx-auto">
                      {sendProvider === 'fallback-mailto'
                        ? 'A mailto draft has been triggered and telemetry payload saved to your clipboard.'
                        : 'Payload successfully received by the mail server for delivery to sivodayan17@gmail.com.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 light:bg-slate-200 text-white light:text-slate-900 text-xs font-mono font-semibold transition-all cursor-pointer active:translate-y-0.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Send Another Message</span>
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleFormSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 flex flex-col justify-between"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="relative">
                        <input
                          id="form-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your Name *"
                          required
                          className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-[#06070a] light:bg-[#f8fafc] border border-white/[0.08] light:border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] light:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] text-xs text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-600 focus:ring-1 focus:ring-[#e5a93c]/30 transition-all"
                        />
                        <User className="w-4 h-4 text-white/40 light:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <input
                          id="form-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your Email *"
                          required
                          className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-[#06070a] light:bg-[#f8fafc] border border-white/[0.08] light:border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] light:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] text-xs text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-600 focus:ring-1 focus:ring-[#e5a93c]/30 transition-all"
                        />
                        <Mail className="w-4 h-4 text-white/40 light:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      id="form-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject (Optional)"
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-[#06070a] light:bg-[#f8fafc] border border-white/[0.08] light:border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] light:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] text-xs text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-600 focus:ring-1 focus:ring-[#e5a93c]/30 transition-all"
                    />
                    <Sparkles className="w-4 h-4 text-white/40 light:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>

                  <div>
                    <textarea
                      id="form-message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Write your message here..."
                      required
                      className="w-full p-3 rounded-xl bg-[#06070a] light:bg-[#f8fafc] border border-white/[0.08] light:border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] light:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] text-xs text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-600 focus:ring-1 focus:ring-[#e5a93c]/30 transition-all resize-none min-h-[82px] sm:min-h-[92px]"
                    />
                  </div>

                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1.5">
                    <p className="text-[10px] font-mono text-white/40 light:text-slate-500 truncate">
                      To <span className="text-white/70 light:text-slate-700 font-medium">sivodayan17@gmail.com</span>
                    </p>

                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#f59e0b] via-[#e5a93c] to-[#d97706] hover:brightness-105 active:translate-y-0.5 disabled:opacity-70 text-black font-mono text-xs sm:text-sm font-bold shadow-[0_3px_0_0_#92400e,0_6px_16px_rgba(229,169,60,0.25)] active:shadow-none transition-all cursor-pointer focus:outline-none"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching via SMTP...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Instant Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Precision Instrument Footer ("cc") */}
      <footer className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto pt-4 pb-2 border-t border-white/[0.08] light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs font-mono text-[#94a3b8] light:text-slate-500 mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <span>© {new Date().getFullYear()} SIVODAYAN SUJEEVAKUMAR</span>
          <span className="hidden sm:inline text-white/20 light:text-slate-300">/</span>
          <span className="text-white/70 light:text-slate-700 font-medium">COMPUTER SCIENCE &amp; ENGINEERING</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#94a3b8] light:text-slate-500">
          <span>UNIVERSITY OF MORATUWA</span>
          <span className="text-white/20 light:text-slate-300">/</span>
          <span className="text-[#e5a93c] light:text-[#b45309] font-semibold">COLOMBO, LK</span>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
