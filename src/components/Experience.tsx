import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import TextEngine from 'spring-text-engine';
import GlitchHeading from './GlitchHeading';

export const Experience: React.FC<{ theme?: 'dark' | 'light' }> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [maxScroll, setMaxScroll] = useState<number>(0);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Monitor vertical page scroll of this pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate dynamic horizontal distance based on rendered card track width
  const calculateDistance = useCallback(() => {
    if (trackRef.current && wrapperRef.current) {
      const totalTrackWidth = trackRef.current.scrollWidth;
      const visibleWidth = wrapperRef.current.clientWidth;
      const padding = window.innerWidth < 640 ? 24 : 48;
      const distance = totalTrackWidth - visibleWidth + padding;

      if (distance > 20) {
        setIsOverflowing(true);
        setMaxScroll(distance);
      } else {
        setIsOverflowing(false);
        setMaxScroll(0);
      }
    }
  }, []);

  useEffect(() => {
    calculateDistance();
    window.addEventListener('resize', calculateDistance);
    const ro = new ResizeObserver(calculateDistance);
    if (trackRef.current) ro.observe(trackRef.current);
    if (wrapperRef.current) ro.observe(wrapperRef.current);

    return () => {
      window.removeEventListener('resize', calculateDistance);
      ro.disconnect();
    };
  }, [calculateDistance]);

  // Track active milestone index from scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest < 0.35) {
        setActiveIndex(0);
      } else if (latest < 0.7) {
        setActiveIndex(1);
      } else {
        setActiveIndex(2);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // High-fidelity spring: instant responsiveness without mushy lag or rubber-banding
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);
  const smoothX = useSpring(rawX, { damping: 38, stiffness: 260, mass: 0.08, restDelta: 0.001 });

  // Smooth jump to milestone when indicator is clicked
  const scrollToMilestone = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const startY = scrollTop + rect.top;
    const totalScrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = startY + (index / 2) * totalScrollableDistance;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const milestones = [
    { id: 0, label: 'Secondary Education', place: 'Jaffna Hindu College' },
    { id: 1, label: 'B.Sc. Engineering', place: 'University of Moratuwa' },
    { id: 2, label: 'TRCSL Volunteer', place: 'Kopay Christian College' },
  ];

  return (
    <section
      id="experience"
      ref={containerRef}
      className={isOverflowing ? 'relative w-full h-[160vh] sm:h-[180vh]' : 'relative w-full py-16 sm:py-20'}
    >
      {/* Sticky Viewport Container */}
      <div className={isOverflowing ? 'sticky top-0 min-h-[100dvh] sm:h-screen w-full flex flex-col justify-center overflow-hidden py-4 sm:py-8' : 'w-full flex flex-col justify-center'}>
        
        {/* Section Heading & Interactive Milestones Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6">
          <div>
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
            <p className="text-xs font-mono text-[#cbd5e1] [data-theme=light]:text-slate-600 mt-1">
              Academic milestones, departmental leadership &amp; volunteer initiatives
            </p>
          </div>

          {/* Interactive Milestone Indicator Buttons */}
          <div className="flex items-center gap-2">
            {milestones.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => scrollToMilestone(m.id)}
                className={`px-3 py-1.5 min-h-[32px] rounded-full text-[11px] font-mono transition-all touch-manipulation active:scale-95 cursor-pointer border ${
                  activeIndex === m.id
                    ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8] font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : 'bg-white/5 border-white/10 [data-theme=light]:bg-slate-200 [data-theme=light]:border-slate-300 text-[#94a3b8] [data-theme=light]:text-slate-600 hover:text-white [data-theme=light]:hover:text-slate-900 active:bg-white/10'
                }`}
                title={`Jump to ${m.label}`}
              >
                0{m.id + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Track Rail */}
        <div className="relative h-1 w-full bg-white/10 [data-theme=light]:bg-slate-200 rounded-full mb-6 overflow-hidden">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#44f0ff] origin-left"
          />
        </div>

        {/* Sliding Cards Track */}
        <div ref={wrapperRef} className="w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            style={isOverflowing ? { x: smoothX } : undefined}
            className={`flex gap-4 sm:gap-6 items-stretch pt-1 pb-3 will-change-transform ${
              !isOverflowing ? 'justify-center flex-wrap' : ''
            }`}
          >
            {/* Card 1: Jaffna Hindu College */}
            <div className="w-[275px] min-[360px]:w-[315px] sm:w-[380px] md:w-[410px] shrink-0 p-4 min-[360px]:p-5 sm:p-6 rounded-2xl bg-[#0c101a]/95 [data-theme=light]:bg-white/95 border border-white/12 hover:border-[#38bdf8]/45 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-[#0284c7]/45 transition-colors duration-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[300px] sm:min-h-[350px]">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold mb-3">
                  Jan 2016 — Apr 2025
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white [data-theme=light]:text-slate-900 mb-1">
                  Secondary Education
                </h3>
                <div className="text-xs text-[#38bdf8] font-mono mb-3.5 font-medium">
                  Jaffna Hindu College
                </div>
                <ul className="text-xs sm:text-[13px] text-[#f1f5f9] [data-theme=light]:text-slate-700 space-y-2 list-disc pl-4 font-normal leading-relaxed">
                  <li>Member of the <strong className="text-white [data-theme=light]:text-slate-900 font-semibold">Board of Prefects</strong>.</li>
                  <li>President of the <strong className="text-white [data-theme=light]:text-slate-900 font-semibold">Cycling Club</strong>.</li>
                  <li>Leader in the <strong className="text-white [data-theme=light]:text-slate-900 font-semibold">Eastern Band</strong> &amp; Secretary of <strong className="text-white [data-theme=light]:text-slate-900 font-semibold">Red Cross</strong>.</li>
                  <li>Active leadership across inter-school academic and cultural societies.</li>
                </ul>
              </div>
            </div>

            {/* Card 2: University of Moratuwa */}
            <div className="w-[275px] min-[360px]:w-[315px] sm:w-[380px] md:w-[410px] shrink-0 p-4 min-[360px]:p-5 sm:p-6 rounded-2xl bg-[#0c101a]/95 [data-theme=light]:bg-white/95 border border-white/12 hover:border-[#38bdf8]/45 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-[#0284c7]/45 transition-colors duration-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[300px] sm:min-h-[350px]">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold mb-3">
                  Nov 2025 — Present
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white [data-theme=light]:text-slate-900 mb-1">
                  B.Sc. (Hons) in Engineering
                </h3>
                <div className="text-xs text-[#38bdf8] font-mono mb-3.5 font-medium">
                  University of Moratuwa • CSE
                </div>
                <ul className="text-xs sm:text-[13px] text-[#f1f5f9] [data-theme=light]:text-slate-700 space-y-2 list-disc pl-4 font-normal leading-relaxed">
                  <li><strong className="text-white [data-theme=light]:text-slate-900 font-semibold">Department Representative</strong> for CSE Department.</li>
                  <li>Maintaining <strong className="text-white [data-theme=light]:text-slate-900 font-semibold">CGPA 3.54</strong> across core algorithms and engineering.</li>
                  <li>Member of <strong className="text-white [data-theme=light]:text-slate-900 font-semibold">CXP Team in AIESEC</strong> &amp; <strong className="text-white [data-theme=light]:text-slate-900 font-semibold">Mora Lenz Club</strong>.</li>
                  <li>Coordinated university flagship tech events and freshers&apos; induction programs.</li>
                </ul>
              </div>
            </div>

            {/* Card 3: TRCSL IT Volunteer */}
            <div className="w-[275px] min-[360px]:w-[315px] sm:w-[380px] md:w-[410px] shrink-0 p-4 min-[360px]:p-5 sm:p-6 rounded-2xl bg-[#0c101a]/95 [data-theme=light]:bg-white/95 border border-white/12 hover:border-[#44f0ff]/45 [data-theme=light]:border-slate-300 [data-theme=light]:hover:border-[#0284c7]/45 transition-colors duration-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[300px] sm:min-h-[350px]">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#44f0ff]/15 text-[#44f0ff] border border-[#44f0ff]/30 font-semibold mb-3">
                  TRCSL Initiative
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white [data-theme=light]:text-slate-900 mb-1">
                  TRCSL IT Volunteer
                </h3>
                <div className="text-xs text-[#44f0ff] font-mono mb-3.5 font-medium">
                  J/Kopay Christian College
                </div>
                <ul className="text-xs sm:text-[13px] text-[#f1f5f9] [data-theme=light]:text-slate-700 space-y-2 list-disc pl-4 font-normal leading-relaxed">
                  <li>Contributed to the <strong className="text-white [data-theme=light]:text-slate-900 font-semibold">TRCSL</strong> school computer lab and IT development program.</li>
                  <li>Assisted in workstation maintenance, local networking, and operating systems setup.</li>
                  <li>Mentored students in <strong className="text-white [data-theme=light]:text-slate-900 font-semibold">ICT literacy</strong> and fundamental digital skills.</li>
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
