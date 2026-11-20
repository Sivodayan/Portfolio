import React from 'react';
import TextEngine from 'spring-text-engine';

export const Experience: React.FC = () => {
  return (
    <section className="section relative w-full min-h-[100dvh] flex flex-col justify-center py-12 sm:py-16" id="experience">
      <div className="w-full my-auto">
        <div className="mb-3 sm:mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
          {/* University of Moratuwa Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#38bdf8]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between min-h-[340px] sm:min-h-[370px]">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold mb-3">
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
              <div className="text-xs text-[#38bdf8] font-mono mb-3 font-medium">
                University of Moratuwa • CSE
              </div>
              <ul className="text-xs sm:text-[13px] text-[#f1f5f9] space-y-2 list-disc pl-4 font-normal">
                <li><strong className="text-white">Department Representative</strong> for CSE Department.</li>
                <li>Maintaining <strong className="text-white">CGPA 3.54</strong> across core algorithms and engineering.</li>
                <li>Member of <strong className="text-white">CXP Team in AIESEC</strong> &amp; <strong className="text-white">Mora Lenz Club</strong>.</li>
                <li>Coordinated university flagship tech events and freshers' induction programs.</li>
              </ul>
            </div>
          </div>

          {/* TRCSL IT Volunteer Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#44f0ff]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between min-h-[340px] sm:min-h-[370px]">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#44f0ff]/15 text-[#44f0ff] border border-[#44f0ff]/30 font-semibold mb-3">
                TRCSL Initiative
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
                TRCSL IT Volunteer
              </TextEngine>
              <div className="text-xs text-[#44f0ff] font-mono mb-3 font-medium">
                J/Kopay Christian College
              </div>
              <ul className="text-xs sm:text-[13px] text-[#f1f5f9] space-y-2 list-disc pl-4 font-normal">
                <li>Contributed to the <strong className="text-white">TRCSL</strong> school computer lab and IT development program.</li>
                <li>Assisted in workstation maintenance, local networking, and operating systems setup.</li>
                <li>Mentored students in <strong className="text-white">ICT literacy</strong> and fundamental digital skills.</li>
                <li>Supported digital infrastructure complementing the official college web portal.</li>
              </ul>
            </div>
          </div>

          {/* Jaffna Hindu College Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#38bdf8]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between min-h-[340px] sm:min-h-[370px]">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold mb-3">
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
              <div className="text-xs text-[#38bdf8] font-mono mb-3 font-medium">
                Jaffna Hindu College
              </div>
              <ul className="text-xs sm:text-[13px] text-[#f1f5f9] space-y-2 list-disc pl-4 font-normal">
                <li>Member of the <strong className="text-white">Board of Prefects</strong>.</li>
                <li>President of the <strong className="text-white">Cycling Club</strong>.</li>
                <li>Leader in the <strong className="text-white">Eastern Band</strong> &amp; Secretary of <strong className="text-white">Red Cross</strong>.</li>
                <li>Active leadership across inter-school academic and cultural societies.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
