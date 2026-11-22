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

  const handleFormSubmit = (e: React.FormEvent) => {
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

    const subjectLine = subject || `Portfolio Message from ${name}`;
    const bodyContent = `Hi Sivodayan,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`;
    const mailtoUrl = `mailto:sivodayan17@gmail.com?subject=${encodeURIComponent(
      subjectLine
    )}&body=${encodeURIComponent(bodyContent)}`;

    setTimeout(() => {
      navigator.clipboard.writeText(bodyContent).catch(() => {});

      const mailLink = document.createElement('a');
      mailLink.href = mailtoUrl;
      document.body.appendChild(mailLink);
      mailLink.click();
      mailLink.remove();

      setFormStatus('success');
      onShowToast?.('Message drafted in email client! (Copied to clipboard)');
    }, 600);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setFormStatus('idle');
    setFormError(null);
  };

  return (
    <section
      className="section relative w-full min-h-screen lg:min-h-[calc(100vh-3.75rem)] lg:h-[calc(100vh-3.75rem)] flex flex-col justify-between pt-2 sm:pt-3 pb-3 sm:pb-4 overflow-hidden"
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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto my-0 flex-1 flex flex-col justify-between pt-1 sm:pt-2"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2.5 sm:mb-3">
          <div>
            <GlitchHeading>
              <TextEngine
                tag="h2"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className="section-heading !mb-0 !border-none !pb-0 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white light:text-slate-900 drop-shadow-sm"
              >
                Get in Touch
              </TextEngine>
            </GlitchHeading>
            <p className="text-[11px] sm:text-xs font-mono text-[#94a3b8] light:text-slate-600 mt-1">
              Have an idea, project collaboration, or engineering role? Reach out directly below.
            </p>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 light:text-emerald-700 text-[10px] font-mono font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>Available for opportunities</span>
          </div>
        </div>

        {/* 2-Column Desktop Grid / 1-Column Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-3.5 items-stretch">
          {/* Left Column: Direct Channels & CV */}
          <div className="lg:col-span-5 flex flex-col gap-2 sm:gap-2.5 justify-between">
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
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-[#e5a93c]/50 light:border-slate-200 light:hover:border-[#b45309]/40 backdrop-blur-xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] light:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05),inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="p-2 rounded-lg bg-[#e5a93c]/10 text-[#e5a93c] light:bg-amber-50 light:text-[#b45309] border border-[#e5a93c]/20 light:border-amber-200/60 shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-500 font-semibold">
                    Email
                  </div>
                  <span className="text-xs font-semibold text-white light:text-slate-900 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309] transition-colors truncate block">
                    sivodayan17@gmail.com
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                <a
                  href="mailto:sivodayan17@gmail.com"
                  data-cursor-ignore
                  className="p-1.5 rounded-lg bg-[#e5a93c]/15 hover:bg-[#e5a93c]/25 light:bg-[#b45309]/10 light:hover:bg-[#b45309]/20 border border-white/10 light:border-slate-300 text-[#e5a93c] light:text-[#b45309] transition-colors cursor-pointer"
                  title="Send Mail"
                  aria-label="Send Mail"
                >
                  <Send className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  data-cursor-ignore
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy('sivodayan17@gmail.com', 'Email', 'email');
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-[#cbd5e1] light:text-slate-700 transition-colors cursor-pointer"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedKey === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
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
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-emerald-500/50 light:border-slate-200 light:hover:border-emerald-600/40 backdrop-blur-xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] light:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05),inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 light:bg-emerald-50 light:text-emerald-700 border border-emerald-500/20 light:border-emerald-200/60 shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-500 font-semibold">
                    WhatsApp / Phone
                  </div>
                  <div className="text-xs font-semibold text-white light:text-slate-900 group-hover:text-emerald-400 light:group-hover:text-emerald-700 transition-colors truncate">
                    +94 70 589 1710
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                <a
                  href="https://wa.me/94705891710"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-ignore
                  className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 light:bg-emerald-600/10 light:hover:bg-emerald-600/20 border border-white/10 light:border-slate-300 text-emerald-400 light:text-emerald-700 transition-colors cursor-pointer"
                  title="Chat on WhatsApp"
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  data-cursor-ignore
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy('+94 70 589 1710', 'Phone number', 'phone');
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-[#cbd5e1] light:text-slate-700 transition-colors cursor-pointer"
                  title="Copy phone number"
                  aria-label="Copy phone number"
                >
                  {copiedKey === 'phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* LinkedIn & GitHub in Compact Row */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <a
                href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-card
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-sky-500/50 light:border-slate-200 light:hover:border-sky-600/40 backdrop-blur-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 group focus:outline-none"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 light:bg-sky-50 light:text-sky-700 border border-sky-500/20 shrink-0">
                    <Linkedin className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-semibold text-white light:text-slate-900 group-hover:text-sky-400 light:group-hover:text-sky-700 transition-colors truncate">
                    LinkedIn
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-[#94a3b8] group-hover:text-sky-400 transition-colors shrink-0 ml-1" />
              </a>

              <a
                href="https://github.com/Sivodayan"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-card
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-purple-400/50 light:border-slate-200 light:hover:border-slate-400 backdrop-blur-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 group focus:outline-none"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-300 light:bg-slate-100 light:text-slate-900 border border-purple-500/20 shrink-0">
                    <Github className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-semibold text-white light:text-slate-900 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309] transition-colors truncate">
                    GitHub
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-[#94a3b8] group-hover:text-white transition-colors shrink-0 ml-1" />
              </a>
            </div>

            {/* Curriculum Vitae (CV) Card */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-[#e5a93c]/40 light:border-slate-200 light:hover:border-[#b45309]/30 backdrop-blur-xl shadow-sm transition-all duration-200 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="p-2 rounded-lg bg-gradient-to-br from-[#e5a93c]/20 to-[#ff087b]/20 text-[#e5a93c] light:text-[#b45309] border border-[#e5a93c]/30 shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-white light:text-slate-900 tracking-tight">
                      Curriculum Vitae
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-white/10 light:bg-slate-200 text-white/80 light:text-slate-700">
                      PDF
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-[#94a3b8] light:text-slate-500 truncate">
                    Engineering resume
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 text-white light:text-slate-900 font-mono text-[11px] font-semibold transition-all group cursor-pointer"
                  title="View Resume in Browser (PDF)"
                >
                  <FileText className="w-3 h-3 text-[#e5a93c] light:text-[#b45309]" />
                  <span>View</span>
                </a>

                <a
                  href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                  download="Sivodayan_Sujeevakumar_CV.pdf"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#e5a93c] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-black font-mono text-[11px] font-bold shadow-sm transition-all group cursor-pointer"
                  title="Download Resume (PDF)"
                >
                  <Download className="w-3 h-3 text-black" />
                  <span>CV</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Workable Contact Form */}
          <div className="lg:col-span-7 p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] light:bg-white/95 light:hover:bg-white border border-white/10 hover:border-[#e5a93c]/40 light:border-slate-200/90 light:hover:border-amber-500/40 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] light:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#e5a93c]/15 text-[#e5a93c] light:bg-amber-100 light:text-[#b45309] border border-[#e5a93c]/30 shrink-0">
                  <MessageSquare className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white light:text-slate-900 tracking-tight">
                    Send a Direct Message
                  </h3>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 light:bg-slate-100 text-[10px] font-mono text-[#94a3b8] light:text-slate-600 border border-white/10">
                <Sparkles className="w-2.5 h-2.5 text-[#e5a93c] light:text-[#b45309]" />
                <span>Instant Dispatch</span>
              </span>
            </div>

            <AnimatePresence mode="wait">
              {formStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="py-5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col items-center gap-2.5 my-auto"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white light:text-slate-900 mb-0.5">
                      Message Prepared &amp; Email Client Opened!
                    </h4>
                    <p className="text-[11px] font-mono text-[#94a3b8] light:text-slate-600 max-w-sm mx-auto">
                      Your draft is open in your email client. A copy was also saved to your clipboard.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 light:bg-slate-200 text-white light:text-slate-900 text-xs font-mono font-semibold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
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
                  className="space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                          className="w-full px-3 py-1.5 pl-8 rounded-lg bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-500 transition-all"
                        />
                        <User className="w-3.5 h-3.5 text-white/40 light:text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
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
                          className="w-full px-3 py-1.5 pl-8 rounded-lg bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-500 transition-all"
                        />
                        <Mail className="w-3.5 h-3.5 text-white/40 light:text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
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
                      className="w-full px-3 py-1.5 pl-8 rounded-lg bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-500 transition-all"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-white/40 light:text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
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
                      className="w-full p-2.5 rounded-lg bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-500 transition-all resize-none min-h-[68px]"
                    />
                  </div>

                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formError}</span>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <p className="text-[10px] font-mono text-white/40 light:text-slate-500 truncate">
                      To <span className="text-white/70 light:text-slate-700 font-medium">sivodayan17@gmail.com</span>
                    </p>

                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#e5a93c] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] disabled:opacity-70 text-black font-mono text-xs font-bold shadow-sm transition-all cursor-pointer focus:outline-none active:scale-[0.98]"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
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

      {/* Copyright / Credits / Footer ("cc") */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto pt-2.5 sm:pt-3 pb-1 border-t border-white/10 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left text-[11px] font-mono text-[#94a3b8] light:text-slate-500">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <span>© {new Date().getFullYear()} Sivodayan Sujeevakumar</span>
          <span className="hidden sm:inline text-white/20 light:text-slate-300">•</span>
          <span className="text-white/60 light:text-slate-600 font-medium">Computer Science &amp; Engineering</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-[#94a3b8] light:text-slate-500">
          <span>University of Moratuwa</span>
          <span className="text-white/20 light:text-slate-300">•</span>
          <span>Colombo, LK</span>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
