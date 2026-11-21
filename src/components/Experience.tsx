import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import TextEngine from 'spring-text-engine';
import GlitchHeading from './GlitchHeading';

export const Experience: React.FC<{ theme?: 'dark' | 'light' }> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [maxScroll, setMaxScroll] = useState<number>(0);

  // Monitor vertical page scroll of this pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate dynamic horizontal distance based on rendered card track width
  useEffect(() => {
    const calculateDistance = () => {
      if (trackRef.current && wrapperRef.current) {
        const totalTrackWidth = trackRef.current.scrollWidth;
        const visibleWidth = wrapperRef.current.clientWidth;
        const padding = window.innerWidth < 640 ? 20 : 40;
        const distance = Math.max(0, totalTrackWidth - visibleWidth + padding);
        setMaxScroll(distance);
      }
    };

    calculateDistance();
    window.addEventListener('resize', calculateDistance);
    const ro = new ResizeObserver(calculateDistance);
    if (trackRef.current) ro.observe(trackRef.current);
    if (wrapperRef.current) ro.observe(wrapperRef.current);

    return () => {
      window.removeEventListener('resize', calculateDistance);
      ro.disconnect();
    };
  }, []);

  // Map vertical scroll progress [0, 1] to horizontal translation [0, -maxScroll]
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);
  const smoothX = useSpring(rawX, { damping: 25, stiffness: 120, mass: 0.15 });

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full h-[200vh] sm:h-[220vh]"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden py-8">
        
        {/* Section Heading */}
        <div className="mb-4 sm:mb-6">
          <GlitchHeading>
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
          </GlitchHeading>
        </div>

        {/* Horizontal Timeline Rail */}
        <div className="relative h-1 w-full bg-white/10 [data-theme=light]:bg-slate-200 rounded-full mb-6 overflow-hidden">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#44f0ff] origin-left"
          />
        </div>

        {/* Horizontal Sliding Cards Track */}
        <div ref={wrapperRef} className="w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x: smoothX }}
            className="flex gap-4 sm:gap-6 items-stretch pt-1 pb-3 will-change-transform"
          >
            {/* Jaffna Hindu College Card */}
            <div className="w-[300px] sm:w-[380px] md:w-[420px] shrink-0 p-4 sm:p-6 rounded-2xl bg-black/40 hover:bg-black/65 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white/95 border border-white/10 hover:border-[#38bdf8]/40 [data-theme=light]:border-black/10 [data-theme=light]:hover:border-[#0284c7]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between min-h-[320px] sm:min-h-[350px]">
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
                  className="text-base sm:text-lg font-bold text-white [data-theme=light]:text-slate-900 mb-1"
                >
                  Secondary Education
                </TextEngine>
                <div className="text-xs text-[#38bdf8] font-mono mb-3 font-medium">
                  Jaffna Hindu College
                </div>
                <ul className="text-xs sm:text-[13px] text-[#f1f5f9] [data-theme=light]:text-slate-700 space-y-2 list-disc pl-4 font-normal">
                  <li>Member of the <strong className="text-white [data-theme=light]:text-slate-900">Board of Prefects</strong>.</li>
                  <li>President of the <strong className="text-white [data-theme=light]:text-slate-900">Cycling Club</strong>.</li>
                  <li>Leader in the <strong className="text-white [data-theme=light]:text-slate-900">Eastern Band</strong> &amp; Secretary of <strong className="text-white [data-theme=light]:text-slate-900">Red Cross</strong>.</li>
                  <li>Active leadership across inter-school academic and cultural societies.</li>
                </ul>
              </div>
            </div>

            {/* University of Moratuwa Card */}
            <div className="w-[300px] sm:w-[380px] md:w-[420px] shrink-0 p-4 sm:p-6 rounded-2xl bg-black/40 hover:bg-black/65 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white/95 border border-white/10 hover:border-[#38bdf8]/40 [data-theme=light]:border-black/10 [data-theme=light]:hover:border-[#0284c7]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between min-h-[320px] sm:min-h-[350px]">
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
                  className="text-base sm:text-lg font-bold text-white [data-theme=light]:text-slate-900 mb-1"
                >
                  B.Sc. (Hons) in Engineering
                </TextEngine>
                <div className="text-xs text-[#38bdf8] font-mono mb-3 font-medium">
                  University of Moratuwa • CSE
                </div>
                <ul className="text-xs sm:text-[13px] text-[#f1f5f9] [data-theme=light]:text-slate-700 space-y-2 list-disc pl-4 font-normal">
                  <li><strong className="text-white [data-theme=light]:text-slate-900">Department Representative</strong> for CSE Department.</li>
                  <li>Maintaining <strong className="text-white [data-theme=light]:text-slate-900">CGPA 3.54</strong> across core algorithms and engineering.</li>
                  <li>Member of <strong className="text-white [data-theme=light]:text-slate-900">CXP Team in AIESEC</strong> &amp; <strong className="text-white [data-theme=light]:text-slate-900">Mora Lenz Club</strong>.</li>
                  <li>Coordinated university flagship tech events and freshers' induction programs.</li>
                </ul>
              </div>
            </div>

            {/* TRCSL IT Volunteer Card */}
            <div className="w-[300px] sm:w-[380px] md:w-[420px] shrink-0 p-4 sm:p-6 rounded-2xl bg-black/40 hover:bg-black/65 [data-theme=light]:bg-white/85 [data-theme=light]:hover:bg-white/95 border border-white/10 hover:border-[#44f0ff]/40 [data-theme=light]:border-black/10 [data-theme=light]:hover:border-[#0284c7]/40 backdrop-blur-md transition-all shadow-sm flex flex-col justify-between min-h-[320px] sm:min-h-[350px]">
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
                  className="text-base sm:text-lg font-bold text-white [data-theme=light]:text-slate-900 mb-1"
                >
                  TRCSL IT Volunteer
                </TextEngine>
                <div className="text-xs text-[#44f0ff] font-mono mb-3 font-medium">
                  J/Kopay Christian College
                </div>
                <ul className="text-xs sm:text-[13px] text-[#f1f5f9] [data-theme=light]:text-slate-700 space-y-2 list-disc pl-4 font-normal">
                  <li>Contributed to the <strong className="text-white [data-theme=light]:text-slate-900">TRCSL</strong> school computer lab and IT development program.</li>
                  <li>Assisted in workstation maintenance, local networking, and operating systems setup.</li>
                  <li>Mentored students in <strong className="text-white [data-theme=light]:text-slate-900">ICT literacy</strong> and fundamental digital skills.</li>
                  <li>Supported digital infrastructure complementing the official college web portal.</li>
                </ul>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
