import React from 'react';
import TextEngine from 'spring-text-engine';

export const Experience: React.FC = () => {
  return (
    <section className="section relative w-full min-h-[100dvh] flex flex-col justify-center" id="experience">
      <div className="w-full my-auto py-1">
        <div className="mb-2 sm:mb-3">
          <TextEngine
            tag="h2"
            mode="once"
            letterOut={{ opacity: 0, scale: 0 }}
            letterIn={{ opacity: 1, scale: 1 }}
            letterConfig={{ tension: 426, friction: 17 }}
            letterStagger={27}
            className="section-heading !mb-0 !border-none !pb-0 text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm"
          >
            Education &amp; Experience
          </TextEngine>
          <p className="text-xs text-[#cbd5e1] mt-0.5 font-mono">
            Academic milestones, technical volunteering &amp; leadership appointments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
          {/* University of Moratuwa Card */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#38bdf8]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold mb-2">
                Nov 2025 — Present
              </div>
              <TextEngine
                tag="h3"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className="text-sm sm:text-base font-bold text-white mb-0.5"
              >
                B.Sc. (Hons) in Engineering
              </TextEngine>
              <div className="text-xs text-[#38bdf8] font-mono mb-2 font-medium">
                University of Moratuwa • CSE
              </div>
              <ul className="text-xs text-[#f1f5f9] space-y-1.5 list-disc pl-4 font-normal">
                <li><strong className="text-white">Department Representative</strong> for CSE Department.</li>
                <li>Maintaining <strong className="text-white">CGPA 3.54</strong> across core algorithms and engineering.</li>
                <li>Member of <strong className="text-white">CXP Team in AIESEC</strong> &amp; <strong className="text-white">Mora Lenz Club</strong>.</li>
              </ul>
            </div>
          </div>

          {/* TRCSL IT Volunteer Card */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#44f0ff]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#44f0ff]/15 text-[#44f0ff] border border-[#44f0ff]/30 font-semibold mb-2">
                TRCSL Initiative
              </div>
              <TextEngine
                tag="h3"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className="text-sm sm:text-base font-bold text-white mb-0.5"
              >
                TRCSL IT Volunteer
              </TextEngine>
              <div className="text-xs text-[#44f0ff] font-mono mb-2 font-medium">
                J/Kopay Christian College
              </div>
              <ul className="text-xs text-[#f1f5f9] space-y-1.5 list-disc pl-4 font-normal">
                <li>Contributed to the <strong className="text-white">TRCSL</strong> school computer lab and IT development program.</li>
                <li>Assisted in workstation maintenance, network connectivity, and operating systems setup.</li>
                <li>Mentored students in <strong className="text-white">ICT literacy</strong> and fundamental digital skills.</li>
              </ul>
            </div>
          </div>

          {/* Jaffna Hindu College Card */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#38bdf8]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold mb-2">
                Jan 2016 — Apr 2025
              </div>
              <TextEngine
                tag="h3"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className="text-sm sm:text-base font-bold text-white mb-0.5"
              >
                Secondary Education
              </TextEngine>
              <div className="text-xs text-[#38bdf8] font-mono mb-2 font-medium">
                Jaffna Hindu College
              </div>
              <ul className="text-xs text-[#f1f5f9] space-y-1.5 list-disc pl-4 font-normal">
                <li>Member of the <strong className="text-white">Board of Prefects</strong>.</li>
                <li>President of the <strong className="text-white">Cycling Club</strong>.</li>
                <li>Leader in the <strong className="text-white">Eastern Band</strong> &amp; Secretary of <strong className="text-white">Red Cross</strong>.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
