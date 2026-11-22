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

    // Basic validation
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

    // Prepare mailto link with pre-filled content
    const subjectLine = subject || `Portfolio Message from ${name}`;
    const bodyContent = `Hi Sivodayan,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`;
    const mailtoUrl = `mailto:sivodayan17@gmail.com?subject=${encodeURIComponent(
      subjectLine
    )}&body=${encodeURIComponent(bodyContent)}`;

    setTimeout(() => {
      // 1. Copy message to clipboard for safety
      navigator.clipboard.writeText(bodyContent).catch(() => {});

      // 2. Open email client via link trigger (preserves page state & animations)
      const mailLink = document.createElement('a');
      mailLink.href = mailtoUrl;
      document.body.appendChild(mailLink);
      mailLink.click();
      mailLink.remove();

      setFormStatus('success');
      onShowToast?.('Message drafted in your email client! (Copied to clipboard)');
    }, 600);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setFormStatus('idle');
    setFormError(null);
  };

  return (
    <section
      className="section relative w-full min-h-screen flex flex-col justify-between pt-2 sm:pt-4 pb-8 sm:pb-12 overflow-hidden"
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
              Have an idea, feelancing opportunity, project collaboration, or engineering role? Feel free to reach out directly through any of these below.
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
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] light:bg-white/90 light:hover:bg-white border border-white/10 hover:border-[#e5a93c]/40 light:border-slate-200 light:hover:border-[#b45309]/30 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)] light:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
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

        {/* Workable Contact Form */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] light:bg-white/95 light:hover:bg-white border border-white/10 hover:border-[#e5a93c]/40 light:border-slate-200/90 light:hover:border-amber-500/40 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)] light:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-all duration-300">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-[#e5a93c]/15 text-[#e5a93c] light:bg-amber-100 light:text-[#b45309] border border-[#e5a93c]/30 light:border-amber-300 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white light:text-slate-900 tracking-tight">
                  Send a Direct Message
                </h3>
                <p className="text-[11px] sm:text-xs font-mono text-[#94a3b8] light:text-slate-500">
                  Fill in your details below to dispatch a message directly to my inbox.
                </p>
              </div>
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
                className="py-6 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white light:text-slate-900 mb-1">
                    Message Prepared &amp; Email Client Opened!
                  </h4>
                  <p className="text-xs font-mono text-[#94a3b8] light:text-slate-600 max-w-md mx-auto">
                    Your message draft has been generated in your email client. A full backup copy was also copied to your clipboard.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 light:bg-slate-200 light:hover:bg-slate-300 text-white light:text-slate-900 text-xs font-mono font-semibold transition-all cursor-pointer"
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
                className="space-y-3.5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="form-name"
                      className="block text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-600 font-semibold mb-1"
                    >
                      Your Name <span className="text-[#f60a0a]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="form-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Alex Smith"
                        required
                        className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs sm:text-[13px] text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-500 focus:ring-1 focus:ring-[#e5a93c]/50 transition-all"
                      />
                      <User className="w-4 h-4 text-white/40 light:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="form-email"
                      className="block text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-600 font-semibold mb-1"
                    >
                      Your Email <span className="text-[#f60a0a]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="form-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. alex@example.com"
                        required
                        className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs sm:text-[13px] text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-500 focus:ring-1 focus:ring-[#e5a93c]/50 transition-all"
                      />
                      <Mail className="w-4 h-4 text-white/40 light:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="form-subject"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-600 font-semibold mb-1"
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <input
                      id="form-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Engineering Opportunity / Project Inquiry"
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs sm:text-[13px] text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-500 focus:ring-1 focus:ring-[#e5a93c]/50 transition-all"
                    />
                    <Sparkles className="w-4 h-4 text-white/40 light:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="form-message"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] light:text-slate-600 font-semibold mb-1"
                  >
                    Message <span className="text-[#f60a0a]">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Hello Sivodayan, I wanted to reach out regarding..."
                    required
                    className="w-full p-3 rounded-xl bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs sm:text-[13px] text-white light:text-slate-900 placeholder-white/30 light:placeholder-slate-400 font-mono focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-500 focus:ring-1 focus:ring-[#e5a93c]/50 transition-all resize-y min-h-[96px]"
                  />
                </div>

                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e5a93c] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] disabled:opacity-70 text-black font-mono text-xs sm:text-sm font-bold shadow-md shadow-[#e5a93c]/20 hover:shadow-[#e5a93c]/35 transition-all duration-200 cursor-pointer focus:outline-none active:scale-[0.98]"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Copyright / Credits / Footer ("cc") */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto mt-10 sm:mt-14 pt-6 pb-2 border-t border-white/10 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs font-mono text-[#94a3b8] light:text-slate-500">
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
