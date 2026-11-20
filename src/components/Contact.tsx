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
    <section className="section relative my-16 md:my-24 pt-8" id="contact">
      {/* React Bits Pro: Rising Lines Background - Seamless Upward Fade */}
      <div
        className="absolute -inset-x-8 sm:-inset-x-16 -bottom-16 top-0 pointer-events-none z-0 opacity-50 overflow-hidden"
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

      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between mb-5">
          <div>
            <TextEngine
              tag="h2"
              mode="once"
              letterOut={{ opacity: 0, scale: 0 }}
              letterIn={{ opacity: 1, scale: 1 }}
              letterConfig={{ tension: 426, friction: 17 }}
              letterStagger={27}
              className="section-heading !mb-0 !border-none !pb-0 text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm"
            >
              Get in Touch
            </TextEngine>
            <p className="text-sm sm:text-base text-[#cbd5e1] mt-1.5 font-mono">
              Direct telemetry & communication channels
            </p>
          </div>
          <span className="text-xs sm:text-sm font-mono text-[#cbd5e1] bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
            Available for Internships
          </span>
        </div>

        {/* Contact Content - Blended with Main Page */}
        <div className="w-full pt-2">
          <p className="text-lg sm:text-xl text-[#f1f5f9] leading-relaxed mb-7 font-normal drop-shadow-sm max-w-3xl">
            I'm actively seeking software engineering internships, hardware-software telemetry roles, and open-source collaborations. Feel free to reach out directly via email or message me on LinkedIn.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {/* Email Tile */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#44f0ff]/40 backdrop-blur-md transition-all shadow-sm">
              <div className="truncate mr-2">
                <div className="text-xs font-mono uppercase text-[#cbd5e1] font-semibold">Direct Email</div>
                <a href="mailto:sivodayan17@gmail.com" className="text-sm sm:text-base text-white hover:text-[#44f0ff] font-semibold truncate block transition-colors">
                  sivodayan17@gmail.com
                </a>
              </div>
              <button
                className="copy-pill flex-shrink-0 text-xs sm:text-sm font-mono font-bold"
                onClick={() => copyText('sivodayan17@gmail.com', 'Email copied')}
              >
                Copy
              </button>
            </div>

            {/* Phone Tile */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#44f0ff]/40 backdrop-blur-md transition-all shadow-sm">
              <div className="truncate mr-2">
                <div className="text-xs font-mono uppercase text-[#cbd5e1] font-semibold">Phone / WhatsApp</div>
                <a href="tel:+94705891710" className="text-sm sm:text-base text-white hover:text-[#44f0ff] font-semibold truncate block transition-colors">
                  +94 70 589 1710
                </a>
              </div>
              <button
                className="copy-pill flex-shrink-0 text-xs sm:text-sm font-mono font-bold"
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
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#38bdf8]/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="text-xs font-mono uppercase text-[#cbd5e1] font-semibold">LinkedIn Network</div>
                <div className="text-sm sm:text-base text-white group-hover:text-[#38bdf8] font-semibold transition-colors">
                  sivodayan-sujeevakumar ↗
                </div>
              </div>
            </a>

            {/* GitHub Tile */}
            <a
              href="https://github.com/Sivodayan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#44f0ff]/40 backdrop-blur-md transition-all shadow-sm group"
            >
              <div>
                <div className="text-xs font-mono uppercase text-[#cbd5e1] font-semibold">Codebase Repository</div>
                <div className="text-sm sm:text-base text-white group-hover:text-[#44f0ff] font-semibold transition-colors">
                  github.com/Sivodayan ↗
                </div>
              </div>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono text-[#cbd5e1] pt-3.5 border-t border-white/10">
            <span>📍 Department of Computer Science & Engineering, University of Moratuwa</span>
            <span>•</span>
            <span className="text-[#44f0ff] font-semibold">Fast Response Guaranteed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
