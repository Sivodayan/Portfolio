import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import TextEngine from 'spring-text-engine';
import GlitchHeading from './GlitchHeading';
import {
  GraduationCap,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
  Users,
  Compass,
} from 'lucide-react';

export interface Milestone {
  id: string;
  index: string;
  year: string;
  period: string;
  type: string;
  title: string;
  org: string;
  location: string;
  icon: React.ReactNode;
  points: { bold: string; text: string }[];
  tags: string[];
  accentColor: string;
}

const MILESTONES_DATA: Milestone[] = [
  {
    id: 'jhc',
    index: '01',
    year: '2016 — 2025',
    period: 'Jan 2016 — Apr 2025',
    type: 'Secondary Education',
    title: 'Secondary Education & Leadership',
    org: 'Jaffna Hindu College',
    location: 'Jaffna, Sri Lanka',
    icon: <GraduationCap className="w-4 h-4 text-[#38bdf8]" />,
    accentColor: '#38bdf8',
    points: [
      { bold: 'Board of Prefects:', text: ' Appointed member upholding student representation, discipline, and major institutional ceremonies.' },
      { bold: 'Cycling Club President:', text: ' Led intra-school cycling meets and student endurance excursions across the peninsula.' },
      { bold: 'Eastern Band & Red Cross:', text: ' Student leader in the Eastern Band and Secretary of the Sri Lanka Red Cross youth wing.' },
      { bold: 'Academic & Cultural Leadership:', text: ' Active organizer across inter-school academic, cultural, and scientific summits.' },
    ],
    tags: ['Board of Prefects', 'Cycling Club President', 'Eastern Band', 'Red Cross'],
  },
  {
    id: 'trcsl',
    index: '02',
    year: '2024 — 2025',
    period: 'TRCSL Initiative • 2024 — 2025',
    type: 'Community Outreach',
    title: 'TRCSL IT Volunteer & Mentor',
    org: 'J/Kopay Christian College',
    location: 'Kopay, Jaffna',
    icon: <Users className="w-4 h-4 text-[#34d399]" />,
    accentColor: '#34d399',
    points: [
      { bold: 'TRCSL IT Lab Initiative:', text: ' Contributed directly to the school computer laboratory modernization and tech setup.' },
      { bold: 'Workstation & Networking:', text: ' Handled workstation assembly, local area networking (LAN), and OS deployment.' },
      { bold: 'ICT Literacy Mentorship:', text: ' Mentored secondary school students in ICT literacy, keyboard proficiency, and modern digital tools.' },
      { bold: 'Digital Infrastructure:', text: ' Supported digital equipment and infrastructure complementing the college web portal project.' },
    ],
    tags: ['TRCSL Initiative', 'Lab Infrastructure', 'Networking', 'ICT Mentorship'],
  },
  {
    id: 'uom',
    index: '03',
    year: '2025 — Present',
    period: 'Nov 2025 — Present',
    type: 'Higher Education',
    title: 'B.Sc. (Hons) in Engineering',
    org: 'University of Moratuwa • CSE',
    location: 'Katubedda, Sri Lanka',
    icon: <Building2 className="w-4 h-4 text-[#60a5fa]" />,
    accentColor: '#60a5fa',
    points: [
      { bold: 'CSE Department Representative:', text: ' Elected batch representative for the Department of Computer Science & Engineering.' },
      { bold: 'Academic Excellence:', text: ' Maintaining a high CGPA of 3.54 across algorithms, discrete structures, and computing systems.' },
      { bold: 'AIESEC & Mora Lenz:', text: ' Active team member of CXP Team in AIESEC in UoM and media designer with Mora Lenz Club.' },
      { bold: 'Events & Coordination:', text: ' Coordinated university flagship tech events, guest speaker symposiums, and freshers orientation.' },
    ],
    tags: ['CSE Dept Rep', 'CGPA 3.54', 'AIESEC CXP', 'Mora Lenz Club', 'Algorithms'],
  },
  {
    id: 'future',
    index: '04',
    year: 'Ongoing & Beyond',
    period: 'Present & Beyond',
    type: 'Vision & Systems',
    title: 'Distributed Systems & Edge AI',
    org: 'Engineering & Research',
    location: 'Global / Sri Lanka',
    icon: <Sparkles className="w-4 h-4 text-[#c084fc]" />,
    accentColor: '#c084fc',
    points: [
      { bold: 'IoT Sensor Networks:', text: ' Architecting telemetry mesh networks (e.g., FloodGuard river hydrometric monitoring system).' },
      { bold: 'Full-Stack Performance:', text: ' Building resilient, high-speed applications using React 19, TypeScript, and Three.js.' },
      { bold: 'Systems Research:', text: ' Deepening investigations into distributed consensus algorithms, embedded firmware, and edge ML.' },
      { bold: 'Open Collaboration:', text: ' Actively seeking high-impact software engineering internships and innovative tech collaborations.' },
    ],
    tags: ['Distributed Systems', 'Embedded IoT', 'Full-Stack', 'Edge AI'],
  },
];

export const Experience: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'dark' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [maxScroll, setMaxScroll] = useState<number>(800);
  const [activeMilestone, setActiveMilestone] = useState<number>(0);

  // Monitor vertical scroll of this pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate dynamic travel distance based on actual rendered card widths
  useEffect(() => {
    const calculateDistance = () => {
      if (trackRef.current && wrapperRef.current) {
        const totalTrackWidth = trackRef.current.scrollWidth;
        const visibleWidth = wrapperRef.current.clientWidth;
        // Keep a clean padding at the end so the final card rests comfortably
        const padding = window.innerWidth < 640 ? 24 : 48;
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

  // Map scroll progress to horizontal translation
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);
  const smoothX = useSpring(rawX, { damping: 25, stiffness: 120, mass: 0.15 });

  // Update active milestone index as user scrolls
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const step = 1 / MILESTONES_DATA.length;
    const idx = Math.min(MILESTONES_DATA.length - 1, Math.floor(latest / step));
    setActiveMilestone(idx);
  });

  // Jump smoothly to a specific milestone
  const scrollToMilestone = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    if (scrollableDistance > 0) {
      const fraction = index / (MILESTONES_DATA.length - 1);
      const targetY = scrollTop + fraction * scrollableDistance;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  // Convert horizontal mouse wheel / trackpad swiping to vertical scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) {
      window.scrollBy({ top: e.deltaX * 1.4, behavior: 'auto' });
    }
  };

  const isLight = theme === 'light';

  return (
    <section
      id="experience"
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full h-[260vh] sm:h-[300vh]"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden py-6 sm:py-8">
        
        {/* Section Top Bar: Title & Controls */}
        <div className="w-full mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#38bdf8] font-semibold">
                Chronological Journey
              </span>
            </div>
            <GlitchHeading>
              <TextEngine
                tag="h2"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className={`section-heading !mb-0 !border-none !pb-0 text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm ${
                  isLight ? '!text-slate-900' : 'text-white'
                }`}
              >
                Education &amp; Experience
              </TextEngine>
            </GlitchHeading>
          </div>

          {/* Milestone Navigator & Scroll Notice */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border backdrop-blur-md transition-colors ${
                isLight
                  ? 'bg-white/80 border-slate-200 text-slate-700'
                  : 'bg-black/40 border-white/10 text-white/70'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#38bdf8] animate-spin" style={{ animationDuration: '8s' }} />
              <span>Scroll page to advance</span>
            </div>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollToMilestone(Math.max(0, activeMilestone - 1))}
                disabled={activeMilestone === 0}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeMilestone === 0
                    ? 'opacity-30 cursor-not-allowed border-transparent'
                    : isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-sky-400'
                    : 'bg-black/40 hover:bg-black/80 border-white/10 text-white hover:border-[#38bdf8]/40'
                }`}
                aria-label="Previous milestone"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span
                className={`font-mono text-xs font-semibold px-2 min-w-[46px] text-center ${
                  isLight ? 'text-slate-700' : 'text-white/80'
                }`}
              >
                0{activeMilestone + 1} / 0{MILESTONES_DATA.length}
              </span>
              <button
                onClick={() => scrollToMilestone(Math.min(MILESTONES_DATA.length - 1, activeMilestone + 1))}
                disabled={activeMilestone === MILESTONES_DATA.length - 1}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeMilestone === MILESTONES_DATA.length - 1
                    ? 'opacity-30 cursor-not-allowed border-transparent'
                    : isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-sky-400'
                    : 'bg-black/40 hover:bg-black/80 border-white/10 text-white hover:border-[#38bdf8]/40'
                }`}
                aria-label="Next milestone"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Visual Timeline Rail Track */}
        <div className="relative w-full mb-4 sm:mb-6">
          {/* Base track background line */}
          <div
            className={`relative h-1 w-full rounded-full overflow-hidden ${
              isLight ? 'bg-slate-200' : 'bg-white/10'
            }`}
          >
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute top-0 left-0 bottom-0 w-full origin-left bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc]"
            />
          </div>

          {/* Interactive Milestone Nodes */}
          <div className="flex justify-between items-center mt-2.5 px-1 sm:px-2">
            {MILESTONES_DATA.map((item, idx) => {
              const isActive = activeMilestone === idx;
              const isPassed = activeMilestone >= idx;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToMilestone(idx)}
                  className="group flex flex-col items-center focus:outline-none transition-all cursor-pointer"
                  title={`Jump to ${item.title}`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                        isActive
                          ? 'border-[#38bdf8] bg-[#38bdf8] shadow-[0_0_14px_rgba(56,189,248,0.9)] scale-125'
                          : isPassed
                          ? 'border-[#818cf8] bg-[#818cf8]/80'
                          : isLight
                          ? 'border-slate-300 bg-white group-hover:border-slate-400'
                          : 'border-white/30 bg-black/60 group-hover:border-white/60'
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      )}
                    </span>
                    <span
                      className={`font-mono text-[10px] sm:text-xs font-semibold tracking-wider transition-colors ${
                        isActive
                          ? 'text-[#38bdf8]'
                          : isPassed
                          ? isLight ? 'text-slate-800' : 'text-white/80'
                          : isLight ? 'text-slate-400' : 'text-white/40'
                      }`}
                    >
                      {item.year}
                    </span>
                  </div>
                  <span
                    className={`hidden md:block text-[11px] mt-1 max-w-[140px] truncate text-center transition-colors ${
                      isActive
                        ? isLight ? 'text-slate-900 font-semibold' : 'text-white font-medium'
                        : isLight ? 'text-slate-500' : 'text-white/40'
                    }`}
                  >
                    {item.org.split('•')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Sliding Cards Track */}
        <div ref={wrapperRef} className="w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x: smoothX }}
            className="flex gap-4 sm:gap-6 items-stretch pt-1 pb-3 will-change-transform"
          >
            {MILESTONES_DATA.map((item, idx) => {
              const isCurrent = activeMilestone === idx;
              return (
                <div
                  key={item.id}
                  className={`w-[290px] xs:w-[330px] sm:w-[400px] md:w-[440px] lg:w-[460px] shrink-0 rounded-2xl p-4 sm:p-6 transition-all duration-300 flex flex-col justify-between border backdrop-blur-xl ${
                    isLight
                      ? isCurrent
                        ? 'bg-white/95 border-[#0284c7]/50 shadow-xl shadow-slate-200/80'
                        : 'bg-white/80 border-slate-200/80 shadow-md'
                      : isCurrent
                      ? 'bg-[#0d1017]/90 border-[#38bdf8]/50 shadow-2xl shadow-sky-950/20'
                      : 'bg-[#080a0f]/75 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Top Meta: Index & Badges */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs sm:text-sm font-black px-2 py-0.5 rounded-md ${
                            isLight
                              ? 'bg-slate-100 text-[#0284c7]'
                              : 'bg-white/10 text-[#38bdf8]'
                          }`}
                        >
                          {item.index}
                        </span>
                        <span
                          className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${
                            isLight ? 'text-slate-500' : 'text-white/50'
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>

                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold border"
                        style={{
                          backgroundColor: `${item.accentColor}18`,
                          color: item.accentColor,
                          borderColor: `${item.accentColor}35`,
                        }}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{item.period}</span>
                      </div>
                    </div>

                    {/* Role Title */}
                    <TextEngine
                      tag="h3"
                      mode="once"
                      letterOut={{ opacity: 0, scale: 0 }}
                      letterIn={{ opacity: 1, scale: 1 }}
                      letterConfig={{ tension: 426, friction: 17 }}
                      letterStagger={22}
                      className={`text-base sm:text-xl font-bold mb-1.5 ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </TextEngine>

                    {/* Institution & Location */}
                    <div className="flex items-center justify-between text-xs sm:text-[13px] font-medium mb-3.5 pb-2.5 border-b border-white/10 dark:border-white/10 [data-theme=light]:border-slate-200">
                      <div className="flex items-center gap-1.5 text-[#38bdf8] font-mono">
                        {item.icon}
                        <span>{item.org}</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-[11px] ${
                          isLight ? 'text-slate-500' : 'text-white/50'
                        }`}
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <ul className="space-y-2 text-xs sm:text-[13px] leading-relaxed">
                      {item.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: item.accentColor }}
                          />
                          <span className={isLight ? 'text-slate-700' : 'text-[#f1f5f9]'}>
                            <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'}>
                              {pt.bold}
                            </strong>
                            {pt.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Tags / Action */}
                  <div className="mt-4 pt-3 border-t border-white/10 dark:border-white/10 [data-theme=light]:border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                            isLight
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-white/[0.06] text-[#cbd5e1] border-white/10'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.id === 'future' && (
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#c084fc] hover:text-[#d8b4fe] transition-colors"
                      >
                        <span>Connect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Timeline Bottom Micro-Indicator */}
        <div className="mt-2 sm:mt-3 flex items-center justify-between text-[11px] font-mono text-white/50 [data-theme=light]:text-slate-500 px-1">
          <div className="flex items-center gap-2">
            <span>Scroll page to glide timeline</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Use arrows or milestone nodes to scrub</span>
          </div>
          <div>
            <span className="text-[#38bdf8] font-semibold">
              {Math.round(activeMilestone * 33.3 + 0.1)}%
            </span>{' '}
            explored
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
