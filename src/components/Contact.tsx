import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextEngine from 'spring-text-engine';
import {
  Mail,
  Phone,
  MessageCircle,
  Linkedin,
  Github,
  ArrowUpRight,
  Send,
  Copy,
  Check,
  Download,
  FileText,
  User,
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
  const [activationNeeded, setActivationNeeded] = useState<boolean>(false);

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
      setActivationNeeded(Boolean(result.activationNeeded));
      setFormStatus('success');

      if (result.activationNeeded) {
        onShowToast?.('Activation email sent! Please check your inbox.');
      } else {
        onShowToast?.('Message dispatched directly to sivodayan18@gmail.com!');
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
    setActivationNeeded(false);
  };

  return (
    <section
      className="section relative w-full min-h-screen lg:min-h-[calc(100vh-3.75rem)] flex flex-col justify-between pt-5 sm:pt-7 lg:pt-8 pb-3 sm:pb-4 overflow-hidden px-4 sm:px-6 lg:px-8"
      id="contact"
    >
      {/* Ambient Visual Atmosphere */}
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
                className="section-heading !mb-0 !border-none !pb-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-white light:text-slate-900 drop-shadow-sm font-sans"
              >
                Get in Touch
              </TextEngine>
            </GlitchHeading>
            <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-1 max-w-xl font-normal leading-relaxed">
              Have a project collaboration, technical role, or question? Connect directly below.
            </p>
          </div>

          <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 light:text-emerald-700 text-xs font-medium backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Available for opportunities</span>
          </div>
        </div>

        {/* =========================================================================
            THE SLEEK FLOATING MONOLITH
            A single, seamless architectural container uniting Direct Channels & Dispatch Portal
            ========================================================================= */}
        <div className="relative rounded-3xl bg-[#0b0c10]/85 hover:bg-[#0e0f14]/90 light:bg-white/90 light:hover:bg-white border border-white/[0.1] hover:border-[#e5a93c]/35 light:border-slate-200/90 light:hover:border-amber-500/30 shadow-[0_24px_70px_-12px_rgba(0,0,0,0.7),0_0_40px_rgba(229,169,60,0.05),inset_0_1px_0_0_rgba(255,255,255,0.12)] light:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.08),inset_0_1px_0_0_rgba(255,255,255,0.9)] backdrop-blur-2xl transition-all duration-300 overflow-hidden">
          {/* Subtle top perimeter light bar */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#e5a93c]/40 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] light:divide-slate-200/80">
            {/* Left Wing: Direct Channels & Identity */}
            <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 flex flex-col justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] light:bg-slate-100 text-[10px] font-semibold text-[#e5a93c] light:text-[#b45309] tracking-wider uppercase mb-2">
                  <span>Direct Channels</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white light:text-slate-900 tracking-tight leading-snug">
                  Let’s engineer something exceptional.
                </h3>
                <p className="text-xs text-slate-400 light:text-slate-600 mt-1 leading-relaxed">
                  Undergraduate at University of Moratuwa. Open for full-stack engineering, IoT telemetries, and software research.
                </p>
              </div>

              {/* Integrated Channel List (No separate boxy cards) */}
              <div className="space-y-2.5">
                {/* Channel 1: Email */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] light:bg-slate-50 light:hover:bg-slate-100/80 border border-white/[0.05] hover:border-[#e5a93c]/30 light:border-slate-200/60 transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-[#e5a93c] light:text-[#b45309] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-medium text-slate-400 light:text-slate-500 uppercase tracking-wider">
                        Email
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309] transition-colors truncate block">
                        sivodayan18@gmail.com
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <a
                      href="mailto:sivodayan18@gmail.com"
                      className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-[#e5a93c]/20 light:bg-white light:hover:bg-amber-100/70 text-[#e5a93c] light:text-[#b45309] transition-all"
                      title="Send Mail"
                      aria-label="Send Mail"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy('sivodayan18@gmail.com', 'Email', 'email')}
                      className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] light:bg-white light:hover:bg-slate-200 text-slate-300 light:text-slate-700 transition-all"
                      title="Copy email address"
                      aria-label="Copy email address"
                    >
                      {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Channel 2: Phone & WhatsApp */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] light:bg-slate-50 light:hover:bg-slate-100/80 border border-white/[0.05] hover:border-emerald-500/30 light:border-slate-200/60 transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 light:text-emerald-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-medium text-slate-400 light:text-slate-500 uppercase tracking-wider">
                        Phone &amp; WhatsApp
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 group-hover:text-emerald-400 light:group-hover:text-emerald-700 transition-colors truncate block">
                        +94 70 589 1710
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <a
                      href="https://wa.me/94705891710"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 light:bg-emerald-50 light:hover:bg-emerald-100 text-emerald-400 light:text-emerald-700 transition-all"
                      title="Chat on WhatsApp"
                      aria-label="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy('+94 70 589 1710', 'Phone number', 'phone')}
                      className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] light:bg-white light:hover:bg-slate-200 text-slate-300 light:text-slate-700 transition-all"
                      title="Copy phone number"
                      aria-label="Copy phone number"
                    >
                      {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Channel 3: Social Badges & CV Row */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <a
                    href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] light:bg-slate-50 light:hover:bg-slate-100/80 border border-white/[0.05] hover:border-sky-500/30 light:border-slate-200/60 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-400 light:text-sky-700 flex items-center justify-center shrink-0">
                        <Linkedin className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-semibold text-white light:text-slate-900 group-hover:text-sky-400 light:group-hover:text-sky-700 transition-colors truncate">
                        LinkedIn
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400 transition-all" />
                  </a>

                  <a
                    href="https://github.com/Sivodayan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] light:bg-slate-50 light:hover:bg-slate-100/80 border border-white/[0.05] hover:border-purple-400/30 light:border-slate-200/60 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-purple-500/15 text-purple-300 light:text-slate-900 flex items-center justify-center shrink-0">
                        <Github className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-semibold text-white light:text-slate-900 group-hover:text-purple-300 light:group-hover:text-slate-900 transition-colors truncate">
                        GitHub
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 transition-all" />
                  </a>
                </div>

                {/* Channel 4: Curriculum Vitae Action Strip */}
                <div className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] light:bg-slate-50 light:hover:bg-slate-100/80 border border-white/[0.05] light:border-slate-200/60 transition-all flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/15 text-[#e5a93c] light:text-[#b45309] flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-white light:text-slate-900 truncate block">
                        Curriculum Vitae
                      </span>
                      <span className="text-[10px] text-slate-400 light:text-slate-500 block -mt-0.5">
                        PDF · Updated Records
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] light:bg-white light:hover:bg-slate-200 text-white light:text-slate-900 text-[11px] font-medium transition-all"
                    >
                      View
                    </a>
                    <a
                      href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                      download="Sivodayan_Sujeevakumar_CV.pdf"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-[#e5a93c] to-[#f59e0b] hover:brightness-105 text-black text-[11px] font-bold shadow-sm transition-all"
                    >
                      <Download className="w-3 h-3" />
                      <span>CV</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Wing: Dispatch Portal */}
            <div className="lg:col-span-7 p-5 sm:p-6 lg:p-7 flex flex-col justify-between">
              {/* Portal Header */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/[0.06] light:border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white light:text-slate-900 tracking-tight">
                    Send a Message
                  </h3>
                  <p className="text-[11px] text-slate-400 light:text-slate-500 mt-0.5">
                    Delivered directly to my inbox with zero drafts
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-emerald-400 light:text-emerald-700 font-semibold">Direct Relay Active</span>
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
                    className={`py-8 px-4 rounded-2xl ${
                      activationNeeded
                        ? 'bg-amber-500/[0.06] border border-amber-500/25'
                        : 'bg-emerald-500/[0.06] border border-emerald-500/20'
                    } text-center flex flex-col items-center gap-3 my-auto`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full ${
                        activationNeeded
                          ? 'bg-amber-500/20 text-[#e5a93c]'
                          : 'bg-emerald-500/20 text-emerald-400'
                      } flex items-center justify-center shadow-inner`}
                    >
                      {activationNeeded ? (
                        <Mail className="w-6 h-6" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white light:text-slate-900 mb-1">
                        {activationNeeded
                          ? '1-Click Verification Sent to Your Inbox'
                          : 'Message Delivered Directly to Inbox'}
                      </h4>
                      <p className="text-xs text-slate-400 light:text-slate-600 max-w-sm mx-auto leading-relaxed">
                        {activationNeeded ? (
                          <>
                            A confirmation link has been sent to{' '}
                            <span className="text-[#e5a93c] light:text-[#b45309] font-semibold">
                              sivodayan18@gmail.com
                            </span>
                            . Please click <span className="underline">Activate Form</span> in that email once to authorize instant submissions!
                          </>
                        ) : (
                          <>
                            Message successfully transmitted directly to{' '}
                            <span className="text-emerald-400 light:text-emerald-700 font-semibold">
                              sivodayan18@gmail.com
                            </span>
                            .
                          </>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 light:bg-slate-200 text-white light:text-slate-900 text-xs font-semibold transition-all cursor-pointer active:translate-y-0.5"
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
                            className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-black/40 light:bg-slate-50 border border-white/[0.08] light:border-slate-200 text-xs sm:text-sm text-white light:text-slate-900 placeholder:text-white/30 light:placeholder:text-slate-400 focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-600 focus:ring-1 focus:ring-[#e5a93c]/30 transition-all"
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
                            className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-black/40 light:bg-slate-50 border border-white/[0.08] light:border-slate-200 text-xs sm:text-sm text-white light:text-slate-900 placeholder:text-white/30 light:placeholder:text-slate-400 focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-600 focus:ring-1 focus:ring-[#e5a93c]/30 transition-all"
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
                        className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-black/40 light:bg-slate-50 border border-white/[0.08] light:border-slate-200 text-xs sm:text-sm text-white light:text-slate-900 placeholder:text-white/30 light:placeholder:text-slate-400 focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-600 focus:ring-1 focus:ring-[#e5a93c]/30 transition-all"
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
                        className="w-full p-3 rounded-xl bg-black/40 light:bg-slate-50 border border-white/[0.08] light:border-slate-200 text-xs sm:text-sm text-white light:text-slate-900 placeholder:text-white/30 light:placeholder:text-slate-400 focus:outline-none focus:border-[#e5a93c] light:focus:border-amber-600 focus:ring-1 focus:ring-[#e5a93c]/30 transition-all resize-none min-h-[82px] sm:min-h-[92px]"
                      />
                    </div>

                    {formError && (
                      <motion.div
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <p className="text-[11px] text-slate-400 light:text-slate-500 truncate">
                        To <span className="text-white/80 light:text-slate-700 font-medium">sivodayan18@gmail.com</span>
                      </p>

                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e5a93c] via-[#f59e0b] to-[#d97706] hover:brightness-105 active:scale-[0.98] disabled:opacity-70 text-black text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(229,169,60,0.25)] hover:shadow-[0_6px_22px_rgba(229,169,60,0.35)] transition-all cursor-pointer focus:outline-none"
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending...</span>
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
        </div>
      </motion.div>

      {/* Sleek Minimalist Editorial Footer ("cc") */}
      <footer className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto pt-4 pb-2 border-t border-white/[0.08] light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-400 light:text-slate-500 mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <span>© {new Date().getFullYear()} Sivodayan Sujeevakumar</span>
          <span className="hidden sm:inline text-white/20 light:text-slate-300">·</span>
          <span className="text-white/70 light:text-slate-700 font-medium">Computer Science &amp; Engineering</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 light:text-slate-500">
          <span>University of Moratuwa</span>
          <span className="text-white/20 light:text-slate-300">·</span>
          <span className="text-[#e5a93c] light:text-[#b45309] font-medium">Colombo, LK</span>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
