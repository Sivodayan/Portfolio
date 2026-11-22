import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, type Variants } from 'framer-motion';
import TextEngine from 'spring-text-engine';
import GlitchHeading from './GlitchHeading';

interface ExperienceCardProps {
  index: number;
  title: string;
  subtitle: string;
  subtitleColor?: string;
  items: React.ReactNode[];
  isSectionInView: boolean;
  theme: 'dark' | 'light';
  cardVariants: Variants;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  index,
  title,
  subtitle,
  subtitleColor,
  items,
  isSectionInView,
  theme,
  cardVariants,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shineRef = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -4;
    const rotY = ((x - centerX) / centerX) * 4;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      }
      if (shineRef.current) {
        shineRef.current.style.background =
          theme === 'light'
            ? `radial-gradient(320px circle at ${x}px ${y}px, rgba(217, 119, 6, 0.12), transparent 70%)`
            : `radial-gradient(320px circle at ${x}px ${y}px, rgba(229, 169, 60, 0.16), transparent 70%)`;
        shineRef.current.style.opacity = '1';
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }
    if (shineRef.current) {
      shineRef.current.style.opacity = '0';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isSectionInView ? 'visible' : 'hidden'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-target
      className={`group relative overflow-hidden w-[285px] min-[360px]:w-[325px] sm:w-[380px] md:w-[410px] shrink-0 p-4 min-[360px]:p-5 sm:p-6 rounded-2xl cursor-pointer ${
        theme === 'light'
          ? 'bg-white/95 border border-slate-300 hover:border-amber-500/60 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_35px_-12px_rgba(217,119,6,0.18)]'
          : 'bg-black border border-white/12 hover:border-[#e5a93c]/60 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_-12px_rgba(229,169,60,0.25)]'
      } transition-[border-color,box-shadow] duration-300 flex flex-col justify-between min-h-[300px] sm:min-h-[350px]`}
      style={{
        transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: 'transform 0.18s ease-out, border-color 0.25s, box-shadow 0.25s',
      }}
    >
      {/* Dynamic Cursor Spotlight / Shine Effect */}
      <div
        ref={shineRef}
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(320px circle at -999px -999px, rgba(229, 169, 60, 0.16), transparent 70%)',
          opacity: 0,
        }}
        aria-hidden="true"
      />

      {/* Subtle Top Accent Glow on Hover */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e5a93c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <h3 className="text-[15px] min-[360px]:text-base sm:text-lg font-bold text-white light:text-slate-900 mb-1 whitespace-nowrap transition-colors duration-200 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309]">
          {title}
        </h3>
        <div
          className={`text-xs ${
            subtitleColor || 'text-[#e5a93c] light:text-[#b45309]'
          } font-mono mb-3.5 font-medium flex items-center justify-between`}
        >
          <span>{subtitle}</span>
          <span className="text-[10px] text-white/30 light:text-slate-400 font-mono tracking-wider">
            0{index + 1}
          </span>
        </div>
        <ul className="text-xs sm:text-[13px] text-[#f1f5f9] light:text-slate-700 space-y-2 list-disc pl-4 font-normal leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx} className="transition-colors duration-150">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export const Experience: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'dark' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isSectionInView = useInView(containerRef, { once: true, amount: 0.12 });

  const cardVariants: Variants = {
    hidden: { opacity: 0, x: 180 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.82,
        delay: 0.08 + custom * 0.12,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const [maxScroll, setMaxScroll] = useState<number>(0);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Track section scroll progress to drive the horizontal pinned track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate horizontal translation delta based on actual card positions
  const calculateDistance = useCallback(() => {
    if (trackRef.current && wrapperRef.current) {
      const cards = trackRef.current.querySelectorAll('.rounded-2xl');
      const lastCard = cards[cards.length - 1] as HTMLElement | null;
      const visibleWidth = wrapperRef.current.clientWidth;

      if (lastCard && visibleWidth > 0) {
        const lastCardEnd = lastCard.offsetLeft + lastCard.offsetWidth;
        const padding = window.innerWidth < 640 ? 12 : 24;
        const distance = Math.max(0, lastCardEnd - visibleWidth + padding);

        if (distance > 20) {
          setIsOverflowing(true);
          setMaxScroll(distance);
        } else {
          setIsOverflowing(false);
          setMaxScroll(0);
        }
        return;
      }

      const totalTrackWidth = trackRef.current.scrollWidth;
      const distance = Math.max(0, totalTrackWidth - visibleWidth);
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

  // Update active milestone indicator based on normalized scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest < 0.38) {
        setActiveIndex(0);
      } else if (latest < 0.72) {
        setActiveIndex(1);
      } else {
        setActiveIndex(2);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Clamp mapping bounds to allow the first and last cards to rest before container unpins
  const rawX = useTransform(scrollYProgress, [0.03, 0.97], [0, -maxScroll], { clamp: true });
  const smoothX = useSpring(rawX, { damping: 36, stiffness: 280, mass: 0.08, restDelta: 0.001 });

  const scrollToMilestone = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const startY = scrollTop + rect.top;
    const totalScrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targets = [0.04, 0.5, 0.96];
    const targetY = startY + targets[index] * totalScrollableDistance;
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(targetY, {
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
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
      className={isOverflowing ? 'relative w-full h-[160vh] sm:h-[280vh]' : 'relative w-full pt-3 sm:pt-5 pb-8 sm:pb-12'}
    >
      <div className={isOverflowing ? 'sticky top-0 h-[460px] min-[360px]:h-[480px] sm:h-[100dvh] w-full flex flex-col justify-start pt-16 sm:pt-20 pb-2 sm:pb-4 overflow-hidden z-10' : 'w-full flex flex-col justify-start pt-3 sm:pt-5 pb-8'}>
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6"
        >
          <div className="min-w-0">
            <GlitchHeading className="whitespace-nowrap">
              <TextEngine
                tag="h2"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                style={{ whiteSpace: 'nowrap' }}
                wrapWordClassName="whitespace-nowrap"
                className="section-heading !mb-0 !border-none !pb-0 text-lg min-[360px]:text-xl sm:text-2xl font-bold tracking-tight text-white light:text-slate-900 drop-shadow-sm light:drop-shadow-none whitespace-nowrap"
              >
                Education &amp; Experience
              </TextEngine>
            </GlitchHeading>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {milestones.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => scrollToMilestone(m.id)}
                className={`px-3 py-1.5 min-h-[32px] rounded-full text-[11px] font-mono transition-all touch-manipulation active:scale-95 cursor-pointer border ${
                  activeIndex === m.id
                    ? theme === 'light'
                      ? 'border-amber-500/40 text-amber-600 bg-amber-500/10 font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-[#e5a93c]/20 border-[#e5a93c] text-[#e5a93c] font-bold shadow-[0_0_12px_rgba(229,169,60,0.3)]'
                    : theme === 'light'
                      ? 'bg-slate-200 border-slate-300 text-slate-600 hover:text-slate-900 active:bg-slate-300'
                      : 'bg-white/5 border-white/10 text-[#94a3b8] hover:text-white active:bg-white/10'
                }`}
                title={`Jump to ${m.label}`}
              >
                0{m.id + 1}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-1 w-full bg-white/10 light:bg-slate-200 rounded-full mb-6 overflow-hidden"
        >
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#e5a93c] via-[#f59e0b] to-[#fde68a] origin-left"
          />
        </motion.div>

        <div ref={wrapperRef} className="w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            style={isOverflowing ? { x: smoothX } : undefined}
            className={`flex gap-4 sm:gap-6 items-stretch pt-1 pb-3 will-change-transform ${
              !isOverflowing ? 'justify-center flex-wrap' : ''
            }`}
          >
            <ExperienceCard
              index={0}
              title="Secondary Education"
              subtitle="Jaffna Hindu College"
              isSectionInView={isSectionInView}
              theme={theme}
              cardVariants={cardVariants}
              items={[
                <>Cleared GCE A/L Examination with <strong className="text-white light:text-slate-900 font-semibold">3As</strong> and GCE O/L Examination with <strong className="text-white light:text-slate-900 font-semibold">9As</strong></>,
                <>Member of the <strong className="text-white light:text-slate-900 font-semibold">Board of Prefects</strong>.</>,
                <>President of the <strong className="text-white light:text-slate-900 font-semibold">Cycling Club</strong>.</>,
                <>Leader in the <strong className="text-white light:text-slate-900 font-semibold">Eastern Band</strong> &amp; Secretary of <strong className="text-white light:text-slate-900 font-semibold">Red Cross</strong>.</>,
                <>Active leadership across inter-school academic and cultural societies.</>,
              ]}
            />

            <ExperienceCard
              index={1}
              title="B.Sc. (Hons) in Engineering"
              subtitle="University of Moratuwa - CSE"
              isSectionInView={isSectionInView}
              theme={theme}
              cardVariants={cardVariants}
              items={[
                <><strong className="text-white light:text-slate-900 font-semibold">Department Representative</strong> for CSE Department.</>,
                <>Maintaining <strong className="text-white light:text-slate-900 font-semibold">CGPA 3.54</strong> across core algorithms and engineering.</>,
                <>Member of <strong className="text-white light:text-slate-900 font-semibold">CXP Team in AIESEC</strong> &amp; <strong className="text-white light:text-slate-900 font-semibold">Mora Lenz Club</strong>.</>,
                <>Coordinated university flagship tech events and freshers&apos; induction programs like <strong className="text-white light:text-slate-900 font-semibold">Wibhawi Prathiba.</strong></>,
              ]}
            />

            <ExperienceCard
              index={2}
              title="TRCSL IT Volunteer"
              subtitle="J/Kopay Christian College"
              subtitleColor="text-[#f3ba63] light:text-[#b45309]"
              isSectionInView={isSectionInView}
              theme={theme}
              cardVariants={cardVariants}
              items={[
                <>Conducted workshops on <strong className="text-white light:text-slate-900 font-semibold">AI and Digital Security</strong> for students and teachers.</>,
                <>Contributed to the <strong className="text-white light:text-slate-900 font-semibold">TRCSL</strong> school computer lab and IT development program.</>,
                <>Assisted in workstation maintenance, local networking, and operating systems setup.</>,
                <>Mentored students in <strong className="text-white light:text-slate-900 font-semibold">ICT literacy</strong> and fundamental digital skills.</>,
                <>Supported digital infrastructure complementing the official college web portal.</>,
              ]}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
