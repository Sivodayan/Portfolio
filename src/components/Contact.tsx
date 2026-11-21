import React from 'react';
import TextEngine from 'spring-text-engine';
import RisingLines from './RisingLines';

export interface ContactProps {
  onShowToast: (msg: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      onShowToast(label);
    }).catch(() => {
      onShowToast(text);
    });
  };

  return (
    <section className="section relative w-full min-h-[100dvh] flex flex-col justify-between pt-12 sm:pt-16 !pb-0" id="contact">
      {/* React Bits Pro: Rising Lines Background - Seamless Upward Fade */}
      <div
        className="absolute -inset-x-8 sm:-inset-x-16 -bottom-16 top-0 pointer-events-none z-0 opacity-40 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
        }}
      >
        <RisingLines
          colors={["#44f0ff", "#ff087b"]}
          color="#ff087b"
          horizonColor="#44f0ff"
          haloColor="#38bdf8"
          horizonHeight={-0.45}
          speed={0.6}
          density={1.1}
          lineWidth={1.2}
          lineLength={1.1}
          interactive={true}
          horizonGlow={1.2}
          particles={1}
          className="w-full h-full pointer-events-auto"
        />
      </div>

      <div className="relative z-10 w-full my-auto py-2">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <TextEngine
              tag="h2"
              mode="once"
              letterOut={{ opacity: 0, scale: 0 }}
              letterIn={{ opacity: 1, scale: 1 }}
              letterConfig={{ tension: 426, friction: 17 }}
              letterStagger={27}
              className="section-heading !mb-0 !border-none !pb-0 text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm"
            >
              Get in Touch
            </TextEngine>
            <p className="text-xs font-mono text-[#cbd5e1] mt-0.5">
              Direct communication channels, inquiries &amp; professional networks
            </p>
          </div>
        </div>

        {/* Contact Content - Spacious 2-Column Responsive Grid */}
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-4">
            {/* Email Tile */}
            <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#44f0ff]/40 backdrop-blur-md transition-all shadow-sm">
              <div className="truncate mr-3">
                <div className="text-[10px] font-mono uppercase text-[#cbd5e1] font-semibold mb-1">Direct Email</div>
                <a href="mailto:sivodayan17@gmail.com" className="text-xs sm:text-sm text-white hover:text-[#44f0ff] font-semibold truncate block transition-colors">
                  sivodayan17@gmail.com
                </a>
              </div>
              <button
                className="copy-pill flex-shrink-0 text-xs font-mono font-bold px-2.5 py-1"
                onClick={() => copyText('sivodayan17@gmail.com', 'Email copied')}
              >
                Copy
              </button>
            </div>

            {/* Phone Tile */}
            <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#44f0ff]/40 backdrop-blur-md transition-all shadow-sm">
              <div className="truncate mr-3">
                <div className="text-[10px] font-mono uppercase text-[#cbd5e1] font-semibold mb-1">Phone / WhatsApp</div>
                <a href="tel:+94705891710" className="text-xs sm:text-sm text-white hover:text-[#44f0ff] font-semibold truncate block transition-colors">
                  +94 70 589 1710
                </a>
              </div>
              <button
                className="copy-pill flex-shrink-0 text-xs font-mono font-bold px-2.5 py-1"
                onClick={() => copyText('+94 70 589 1710', 'Phone copied')}
              >
                Copy
              </button>
            </div>

            {/* LinkedIn Tile */}
            <a
              href="https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#38bdf8]/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="text-[10px] font-mono uppercase text-[#cbd5e1] font-semibold mb-1">LinkedIn Network</div>
                <div className="text-xs sm:text-sm text-white group-hover:text-[#38bdf8] font-semibold transition-colors">
                  sivodayan-sujeevakumar ↗
                </div>
              </div>
            </a>

            {/* GitHub Tile */}
            <a
              href="https://github.com/Sivodayan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#44f0ff]/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="text-[10px] font-mono uppercase text-[#cbd5e1] font-semibold mb-1">Codebase Repository</div>
                <div className="text-xs sm:text-sm text-white group-hover:text-[#44f0ff] font-semibold transition-colors">
                  github.com/Sivodayan ↗
                </div>
              </div>
            </a>
          </div>

          {/* Location & Status Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#cbd5e1] pt-3 border-t border-white/10">
            <span>📍 Department of Computer Science &amp; Engineering, University of Moratuwa</span>
            <span>•</span>
            <span>Open to Engineering Internships</span>
          </div>
        </div>
      </div>

      {/* Embedded Clean Single-Screen Footer */}
      <footer className="relative z-10 w-full pt-2.5 pb-2 sm:pb-2.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] font-mono text-[#94a3b8]">
        <div>© {new Date().getFullYear()} Sujeevakumar Sivodayan</div>
        <div>Computer Science &amp; Engineering - University of Moratuwa</div>
      </footer>
    </section>
  );
};

export default Contact;
