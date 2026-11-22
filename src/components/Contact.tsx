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

  const formRef = React.useRef<HTMLFormElement>(null);

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
        onShowToast?.('Message dispatched directly!');
      }
    } catch (err: any) {
      setFormStatus('idle');
      setFormError(err?.message || 'Failed to dispatch message via SMTP API.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
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
      className="section relative w-full min-h-screen lg:min-h-[calc(100vh-3.75rem)] lg:h-[calc(100vh-3.75rem)] flex flex-col justify-between pt-4 sm:pt-6 lg:pt-6 pb-2 sm:pb-3 overflow-hidden px-4 sm:px-6 lg:px-8"
      id="contact"
      style={{
        minHeight: 'calc(100vh - 3.75rem)',
        justifyContent: 'space-between',
      }}
    >
      {/* Ambient Visual Atmosphere */}
      <div
        className={`absolute inset-x-0 sm:-inset-x-16 -bottom-16 top-0 pointer-events-none z-0 ${theme === 'light' ? 'opacity-85' : 'opacity-40'
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
        className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto flex flex-col justify-start my-auto"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 mb-4 sm:mb-5 lg:mb-5">
          <div>
            <GlitchHeading>
              <TextEngine
                tag="h2"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className="section-heading !mb-0 !border-none !pb-0 text-2xl sm:text-3xl font-bold tracking-tight text-white light:text-slate-900 drop-shadow-sm font-sans"
              >
                Get in Touch
              </TextEngine>
            </GlitchHeading>
            <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-1 max-w-xl font-normal leading-relaxed">
              Have an idea, project collaboration, or engineering role? Reach out directly below.
            </p>
          </div>


        </div>

        {/* Material Design 3 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          {/* Left Column: M3 Elevated Surface Container (Channels & CV) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-[28px] bg-[#1d1b20]/90 light:bg-[#f7f2fa]/95 border border-white/[0.08] light:border-[#79747e]/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)] light:shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col justify-between gap-3">
            {/* M3 Channel Tile 1: Email */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                window.location.href = 'mailto:sivodayan18@gmail.com';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.location.href = 'mailto:sivodayan18@gmail.com';
                }
              }}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white light:hover:bg-slate-50 border border-white/[0.06] light:border-[#79747e]/20 shadow-sm transition-all duration-150 flex items-center justify-between cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#382e1e] light:bg-[#ffdf99] text-[#e5a93c] light:text-[#785900] flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-medium text-slate-400 light:text-slate-500 uppercase tracking-wider">
                    Direct Email
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 truncate block mt-0.5">
                    sivodayan17@gmail.com
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                <a
                  href="mailto:sivodayan18@gmail.com"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 light:hover:bg-slate-200 text-[#e5a93c] light:text-[#785900] transition-colors"
                  title="Send Direct Email"
                >
                  <Send className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('sivodayan18@gmail.com', 'Email', 'email')}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 light:hover:bg-slate-200 text-slate-300 light:text-slate-700 transition-colors"
                  title="Copy email address"
                >
                  {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* M3 Channel Tile 2: Phone & WhatsApp */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                window.open('https://wa.me/94705891710', '_blank', 'noopener,noreferrer');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.open('https://wa.me/94705891710', '_blank', 'noopener,noreferrer');
                }
              }}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white light:hover:bg-slate-50 border border-white/[0.06] light:border-[#79747e]/20 shadow-sm transition-all duration-150 flex items-center justify-between cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#1b3724] light:bg-[#c4eed0] text-emerald-400 light:text-[#0b6b2e] flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-medium text-slate-400 light:text-slate-500 uppercase tracking-wider">
                    Phone &amp; WhatsApp
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 truncate block mt-0.5">
                    +94 70 589 1710
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                <a
                  href="https://wa.me/94705891710"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 light:hover:bg-slate-200 text-emerald-400 light:text-[#0b6b2e] transition-colors"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('+94 70 589 1710', 'Phone number', 'phone')}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 light:hover:bg-slate-200 text-slate-300 light:text-slate-700 transition-colors"
                  title="Copy phone number"
                >
                  {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* M3 Assist Chips Row: LinkedIn & GitHub */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white light:hover:bg-slate-50 border border-white/[0.06] light:border-[#79747e]/20 shadow-sm flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-sky-500/15 text-sky-400 light:text-sky-700 flex items-center justify-center shrink-0">
                    <Linkedin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white light:text-slate-900 group-hover:text-sky-400 light:group-hover:text-sky-700 transition-colors truncate">
                    LinkedIn
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400 transition-colors shrink-0" />
              </a>

              <a
                href="https://github.com/Sivodayan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white light:hover:bg-slate-50 border border-white/[0.06] light:border-[#79747e]/20 shadow-sm flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-purple-500/15 text-purple-300 light:text-slate-900 flex items-center justify-center shrink-0">
                    <Github className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white light:text-slate-900 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309] transition-colors truncate">
                    GitHub
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors shrink-0" />
              </a>
            </div>

            {/* M3 Channel Tile 4: CV Actions (Only View & Download Buttons) */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] light:bg-white light:hover:bg-slate-50 border border-white/[0.06] light:border-[#79747e]/20 shadow-sm flex items-center justify-center gap-2 group transition-all"
                title="View Resume in Browser (PDF)"
              >
                <FileText className="w-4 h-4 text-[#e5a93c] light:text-[#785900]" />
                <span className="text-xs font-semibold text-white light:text-slate-900 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309] transition-colors">
                  View CV
                </span>
              </a>

              <a
                href="/assets/documents/Sivodayan_Sujeevakumar_CV.pdf"
                download="Sivodayan_Sujeevakumar_CV.pdf"
                className="p-2.5 rounded-2xl bg-[#e5a93c] hover:bg-[#f59e0b] active:scale-[0.98] text-black shadow-sm flex items-center justify-center gap-2 font-bold transition-all"
                title="Download Resume (PDF)"
              >
                <Download className="w-4 h-4" />
                <span className="text-xs font-bold">
                  Download CV
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: M3 Elevated Form Container */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-[28px] bg-[#1d1b20]/90 light:bg-[#f7f2fa]/95 border border-white/[0.08] light:border-[#79747e]/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)] light:shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            {/* Header / Subhead */}
            <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-white/[0.06] light:border-slate-200/80">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white light:text-slate-900 tracking-tight">
                  Send a Message
                </h3>

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
                  className={`py-8 px-4 rounded-2xl ${activationNeeded
                      ? 'bg-amber-500/[0.08] border border-amber-500/25'
                      : 'bg-emerald-500/[0.08] border border-emerald-500/20'
                    } text-center flex flex-col items-center gap-3 my-auto`}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${activationNeeded
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
                        : 'Message Delivered Successfully!'}
                    </h4>
                    <p className="text-xs text-slate-400 light:text-slate-600 max-w-sm mx-auto leading-relaxed">
                      {activationNeeded ? (
                        <>
                          Activation Needed!
                        </>
                      ) : (
                        <>
                          You will recieve reply as soon as possible
                        </>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-1 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 light:bg-slate-200 text-white light:text-slate-900 text-xs font-semibold transition-all cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Send Another Message</span>
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleFormSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 flex flex-col justify-between"
                >
                  {/* M3 Outlined Text Fields */}
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
                          className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-black/30 light:bg-white border border-white/20 light:border-[#79747e]/40 text-xs sm:text-sm text-white light:text-slate-900 placeholder:text-white/30 light:placeholder:text-slate-400 focus:outline-none focus:border-[#e5a93c] light:focus:border-[#b45309] focus:ring-2 focus:ring-[#e5a93c]/20 transition-all"
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
                          className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-black/30 light:bg-white border border-white/20 light:border-[#79747e]/40 text-xs sm:text-sm text-white light:text-slate-900 placeholder:text-white/30 light:placeholder:text-slate-400 focus:outline-none focus:border-[#e5a93c] light:focus:border-[#b45309] focus:ring-2 focus:ring-[#e5a93c]/20 transition-all"
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
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-black/30 light:bg-white border border-white/20 light:border-[#79747e]/40 text-xs sm:text-sm text-white light:text-slate-900 placeholder:text-white/30 light:placeholder:text-slate-400 focus:outline-none focus:border-[#e5a93c] light:focus:border-[#b45309] focus:ring-2 focus:ring-[#e5a93c]/20 transition-all"
                    />
                    <Sparkles className="w-4 h-4 text-white/40 light:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>

                  <div>
                    <textarea
                      id="form-message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      rows={3}
                      placeholder="Write your message here"
                      required
                      className="w-full p-3 rounded-xl bg-black/30 light:bg-white border border-white/20 light:border-[#79747e]/40 text-xs sm:text-sm text-white light:text-slate-900 placeholder:text-white/30 light:placeholder:text-slate-400 focus:outline-none focus:border-[#e5a93c] light:focus:border-[#b45309] focus:ring-2 focus:ring-[#e5a93c]/20 transition-all resize-none min-h-[82px] sm:min-h-[92px]"
                    />
                  </div>

                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </motion.div>
                  )}

                  {/* Form Actions: Supporting Text + M3 Filled Button */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                  

                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#e5a93c] hover:bg-[#f59e0b] active:scale-[0.98] disabled:opacity-70 text-black text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer focus:outline-none"
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
      </motion.div>

      {/* Material 3 Bottom Footer ("cc") */}
      <footer className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto pt-3 pb-2 border-t border-white/[0.08] light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-400 light:text-slate-500 mt-auto">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <span>© {new Date().getFullYear()} Sivodayan Sujeevakumar</span>
          <span className="hidden sm:inline text-white/20 light:text-slate-300">-</span>
          <span className="text-white/70 light:text-slate-700 font-medium">Computer Science &amp; Engineering</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 light:text-slate-500">
          <span>University of Moratuwa</span>
          
          <span className="text-[#e5a93c] light:text-[#b45309] font-medium">Colombo, LK</span>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
