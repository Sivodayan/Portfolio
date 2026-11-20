import React from 'react';
import TextEngine from 'spring-text-engine';

export const Experience: React.FC = () => {
  return (
    <>
      {/* Education & Leadership Section */}
      <section className="section relative w-full min-h-[100dvh] flex flex-col justify-center" id="experience">
        <div className="w-full my-auto py-2">
          <div className="mb-3">
            <TextEngine
              tag="h2"
              mode="once"
              letterOut={{ opacity: 0, scale: 0 }}
              letterIn={{ opacity: 1, scale: 1 }}
              letterConfig={{ tension: 426, friction: 17 }}
              letterStagger={27}
              className="section-heading !mb-0 !border-none !pb-0 text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm"
            >
              Education &amp; Leadership
            </TextEngine>
            <p className="text-xs text-[#cbd5e1] mt-0.5 font-mono">
              Academic milestones, leadership appointments &amp; extracurricular impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* University of Moratuwa Card */}
            <div className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#38bdf8]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold mb-2">
                  Nov 2025 — Present
                </div>
                <TextEngine
                  tag="h3"
                  mode="once"
                  letterOut={{ opacity: 0, scale: 0 }}
                  letterIn={{ opacity: 1, scale: 1 }}
                  letterConfig={{ tension: 426, friction: 17 }}
                  letterStagger={27}
                  className="text-base sm:text-lg font-bold text-white mb-1"
                >
                  B.Sc. (Hons) in Engineering
                </TextEngine>
                <div className="text-xs text-[#38bdf8] font-mono mb-2.5 font-medium">
                  University of Moratuwa • Computer Science and Engineering
                </div>
                <ul className="text-xs sm:text-[13px] text-[#f1f5f9] space-y-1.5 list-disc pl-4 font-normal">
                  <li><strong className="text-white">Department Representative</strong> for CSE Department.</li>
                  <li>Maintaining <strong className="text-white">CGPA 3.54</strong> across core algorithms and engineering.</li>
                  <li>Member of <strong className="text-white">CXP Team in AIESEC</strong> &amp; <strong className="text-white">Mora Lenz Club</strong>.</li>
                  <li>Coordinated university freshers' induction flagship event.</li>
                </ul>
              </div>
            </div>

            {/* Jaffna Hindu College Card */}
            <div className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#38bdf8]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold mb-2">
                  Jan 2016 — Apr 2025
                </div>
                <TextEngine
                  tag="h3"
                  mode="once"
                  letterOut={{ opacity: 0, scale: 0 }}
                  letterIn={{ opacity: 1, scale: 1 }}
                  letterConfig={{ tension: 426, friction: 17 }}
                  letterStagger={27}
                  className="text-base sm:text-lg font-bold text-white mb-1"
                >
                  Secondary Education
                </TextEngine>
                <div className="text-xs text-[#38bdf8] font-mono mb-2.5 font-medium">
                  Jaffna Hindu College
                </div>
                <ul className="text-xs sm:text-[13px] text-[#f1f5f9] space-y-1.5 list-disc pl-4 font-normal">
                  <li>Member of the <strong className="text-white">Board of Prefects</strong>.</li>
                  <li>President of the <strong className="text-white">Cycling Club</strong>.</li>
                  <li>Leader in the <strong className="text-white">Eastern Band</strong>.</li>
                  <li>Secretary of the <strong className="text-white">Red Cross Society</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Experience;
