import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { motion } from 'framer-motion';

export interface StaggeredTextProps {
  text?: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  segmentBy?: 'words' | 'chars' | 'lines';
  separator?: string;
  delay?: number;
  duration?: number;
  easing?: ((t: number) => number) | string;
  threshold?: number;
  rootMargin?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  blur?: boolean;
  from?: Record<string, any>;
  to?: Record<string, any> | Array<Record<string, any>>;
  staggerDirection?: 'forward' | 'reverse' | 'center';
  respectReducedMotion?: boolean;
  exitOnScrollOut?: boolean;
  onAnimationComplete?: () => void;
  onExitComplete?: () => void;
  children?: React.ReactNode;
}

export interface StaggeredTextHandle {
  replay: () => void;
  exit: () => void;
}

export const easings: Record<string, (e: number) => number> = {
  linear: (e) => e,
  easeIn: (e) => e * e,
  easeOut: (e) => e * (2 - e),
  easeInOut: (e) => (e < 0.5 ? 2 * e * e : -1 + (4 - 2 * e) * e),
  elastic: (e) => {
    const t = (2 * Math.PI) / 3;
    return e === 0 ? 0 : e === 1 ? 1 : Math.pow(2, -10 * e) * Math.sin((10 * e - 0.75) * t) + 1;
  },
  bounce: (e) => {
    if (e < 1 / 2.75) return 7.5625 * e * e;
    if (e < 2 / 2.75) return 7.5625 * (e -= 1.5 / 2.75) * e + 0.75;
    if (e < 2.5 / 2.75) return 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375;
    return 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
  },
  anticipate: (e) => 2.70158 * e * e * e - 1.70158 * e * e,
};

export const StaggeredText = forwardRef<StaggeredTextHandle, StaggeredTextProps>(
  (
    {
      text = 'Build faster than ever',
      className = '',
      as = 'p',
      segmentBy = 'words',
      separator,
      delay = 80,
      duration = 0.6,
      easing = 'anticipate',
      threshold = 0.1,
      rootMargin = '0px',
      direction = 'top',
      blur = true,
      from,
      to,
      staggerDirection = 'forward',
      respectReducedMotion = true,
      exitOnScrollOut = false,
      onAnimationComplete,
      onExitComplete,
      children,
    },
    ref
  ) => {
    const contentText = typeof children === 'string' ? children : text;
    const containerRef = useRef<HTMLElement | null>(null);
    const [isInView, setIsInView] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    const resolvedEasing = typeof easing === 'string' ? easings[easing] || easings.anticipate : easing;

    useEffect(() => {
      if (!respectReducedMotion || typeof window === 'undefined') return;
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(media.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }, [respectReducedMotion]);

    useImperativeHandle(ref, () => ({
      replay: () => {
        setIsExiting(false);
        setIsInView(false);
        requestAnimationFrame(() => setIsInView(true));
      },
      exit: () => setIsExiting(true),
    }));

    useEffect(() => {
      if (!containerRef.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setIsExiting(false);
            if (!exitOnScrollOut && containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          } else if (exitOnScrollOut && isInView) {
            setIsExiting(true);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [threshold, rootMargin, exitOnScrollOut, isInView]);

    const defaultFrom = useMemo(() => {
      const initial: Record<string, any> = { opacity: 0 };
      if (direction === 'top' || direction === 'bottom') {
        initial.y = direction === 'top' ? -35 : 35;
      } else {
        initial.x = direction === 'left' ? -35 : 35;
      }
      if (blur) {
        initial.filter = 'blur(10px)';
      }
      return initial;
    }, [direction, blur]);

    const defaultTo = useMemo(() => {
      const prop = direction === 'left' || direction === 'right' ? 'x' : 'y';
      if (blur) {
        return [
          {
            opacity: 0.7,
            [prop]: direction === 'top' || direction === 'left' ? 4 : -4,
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            [prop]: 0,
            filter: 'blur(0px)',
          },
        ];
      }
      return [{ opacity: 1, [prop]: 0 }];
    }, [direction, blur]);

    const initialKeyframes = useMemo(() => from ?? defaultFrom, [from, defaultFrom]);
    const targetKeyframes = useMemo(
      () => (to ? (Array.isArray(to) ? to : [to]) : defaultTo),
      [to, defaultTo]
    );

    const stepCount = targetKeyframes.length + 1;
    const keyframeTimes = useMemo(
      () => Array.from({ length: stepCount }, (_, idx) => (stepCount === 1 ? 0 : idx / (stepCount - 1))),
      [stepCount]
    );

    const { rowsSegments, totalSegments } = useMemo(() => {
      if (!contentText) return { rowsSegments: [], totalSegments: 0 };
      const lines = (separator && separator.length > 0 ? contentText.split(separator) : contentText.split(/\r?\n/)).map((line) => {
        switch (segmentBy) {
          case 'chars':
            return line.split('');
          case 'lines':
            return [line];
          default:
            return line.split(' ');
        }
      });
      const count = lines.reduce((acc, row) => acc + row.length, 0);
      return { rowsSegments: lines, totalSegments: count };
    }, [contentText, segmentBy, separator]);

    if (!contentText) return null;

    const allKeys = new Set([
      ...Object.keys(initialKeyframes),
      ...targetKeyframes.flatMap((kf) => Object.keys(kf)),
    ]);
    const finalAnimatedState: Record<string, any[]> = {};
    allKeys.forEach((key) => {
      finalAnimatedState[key] = [initialKeyframes[key], ...targetKeyframes.map((kf) => kf[key])];
    });

    let globalIndex = 0;
    const isMultiLine = rowsSegments.length > 1;
    const Component = as as any;

    return (
      <Component
        ref={containerRef}
        className={`staggered-text ${isMultiLine || segmentBy === 'lines' ? 'block' : 'inline-flex flex-wrap'} whitespace-pre-wrap ${className}`}
      >
        {rowsSegments.map((row, rowIdx) => (
          <React.Fragment key={`row-${rowIdx}`}>
            {row.map((segment, segIdx) => {
              const currIdx = globalIndex++;
              const isLast = currIdx === totalSegments - 1;

              const calculateDelay = (idx: number, total: number) => {
                if (reducedMotion) return 0;
                switch (staggerDirection) {
                  case 'reverse':
                    return ((total - 1 - idx) * delay) / 1000;
                  case 'center':
                    return (Math.abs(idx - (total - 1) / 2) * delay) / 1000;
                  default:
                    return (idx * delay) / 1000;
                }
              };

              const transition = reducedMotion
                ? { duration: 0.01, delay: 0 }
                : {
                    duration,
                    times: keyframeTimes,
                    delay: calculateDelay(currIdx, totalSegments),
                    ease: resolvedEasing,
                  };

              return (
                <motion.span
                  key={`seg-${rowIdx}-${segIdx}`}
                  initial={initialKeyframes}
                  animate={isExiting ? initialKeyframes : isInView ? finalAnimatedState : initialKeyframes}
                  transition={transition}
                  onAnimationComplete={
                    isLast
                      ? () => {
                          if (isExiting) onExitComplete?.();
                          else onAnimationComplete?.();
                        }
                      : undefined
                  }
                  style={{
                    display: segmentBy === 'lines' ? 'block' : 'inline-block',
                    willChange: 'transform, filter, opacity',
                  }}
                >
                  {segmentBy === 'chars' && segment === ' ' ? '\u00A0' : segment}
                  {segmentBy === 'words' && segIdx < row.length - 1 && '\u00A0'}
                </motion.span>
              );
            })}
            {rowIdx < rowsSegments.length - 1 && segmentBy !== 'lines' && <br key={`br-${rowIdx}`} />}
          </React.Fragment>
        ))}
      </Component>
    );
  }
);

StaggeredText.displayName = 'StaggeredText';
export default StaggeredText;
