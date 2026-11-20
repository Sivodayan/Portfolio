import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from 'framer-motion';

export interface CustomCursorProps {
  circleSize?: number;
  dotSize?: number;
  circleColor?: string;
  dotColor?: string;
  circleStiffness?: number;
  circleDamping?: number;
  dotStiffness?: number;
  dotDamping?: number;
  circleBorderWidth?: number;
  className?: string;
  circleClassName?: string;
  dotClassName?: string;
  showOnTouch?: boolean;
  zIndex?: number;
  elastic?: boolean;
  targets?: string[];
  images?: string[];
  imageScale?: number;
  imageAnimationDuration?: number;
  imageClassName?: string;
  targetPadding?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  children?: React.ReactNode;
}

/**
 * CustomCursor — Refined React Bits Pro Component (@reactbits-starter/custom-cursor-tw)
 * Docs: https://pro.reactbits.dev/docs/components/custom-cursor
 *
 * Features:
 * - Fluid single-spring pointer physics (no double-spring lag)
 * - Intelligent magnetic highlighting of actual interactive elements (buttons, links, pills, badges)
 * - Exact bounding-box morphing with dynamic border-radius matching
 * - Smooth fade-out of inner dot when morphed over buttons to prevent text obstruction
 * - Touch-device safety and zero pointer interference (pointer-events-none)
 */
export const CustomCursor: React.FC<CustomCursorProps> = ({
  circleSize = 38,
  dotSize = 5,
  circleColor = 'rgba(244, 244, 245, 0.5)',
  dotColor = '#44f0ff',
  circleStiffness = 320,
  circleDamping = 24,
  dotStiffness = 500,
  dotDamping = 28,
  circleBorderWidth = 1.5,
  className = '',
  circleClassName = '',
  dotClassName = '',
  showOnTouch = false,
  zIndex = 9999,
  elastic = false,
  targets = [],
  images = [],
  imageScale = 0.9,
  imageAnimationDuration = 0.6,
  imageClassName = '',
  targetPadding = 6,
  mixBlendMode,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [activeEl, setActiveEl] = useState<HTMLElement | null>(null);
  const [activeTargetIdx, setActiveTargetIdx] = useState<number | null>(null);

  // Raw mouse coordinates
  const rawMouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const rawMouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  // Responsive laser dot spring (tracks mouse directly with high precision)
  const dotX = useSpring(rawMouseX, { stiffness: dotStiffness, damping: dotDamping, mass: 0.1 });
  const dotY = useSpring(rawMouseY, { stiffness: dotStiffness, damping: dotDamping, mass: 0.1 });

  // Unified spring targets for the outer ring (position & dimensions)
  const ringTargetX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const ringTargetY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const ringTargetW = useMotionValue(circleSize);
  const ringTargetH = useMotionValue(circleSize);
  const ringTargetRadius = useMotionValue(circleSize / 2);

  // Spring animations for outer ring
  const ringSpring = { stiffness: circleStiffness, damping: circleDamping, mass: 0.4 };
  const smoothX = useSpring(ringTargetX, ringSpring);
  const smoothY = useSpring(ringTargetY, ringSpring);
  const smoothW = useSpring(ringTargetW, ringSpring);
  const smoothH = useSpring(ringTargetH, ringSpring);
  const smoothRadius = useSpring(ringTargetRadius, ringSpring);

  // Velocity stretch for elastic mode
  const velX = useVelocity(rawMouseX);
  const velY = useVelocity(rawMouseY);
  const scaleX = useTransform(velX, [-1200, 0, 1200], [0.85, 1, 1.15]);
  const scaleY = useTransform(velY, [-1200, 0, 1200], [0.85, 1, 1.15]);

  // Ref to track hovered element for updates during scroll
  const currentElRef = useRef<HTMLElement | null>(null);

  // Update ring bounds to match target element or free mouse
  const updateRingToElement = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    // Do not morph if element is unreasonably large (e.g. whole card or container)
    if (rect.width > 380 || rect.height > 120) {
      // Just track mouse with slight scale up
      ringTargetW.set(circleSize * 1.35);
      ringTargetH.set(circleSize * 1.35);
      ringTargetRadius.set((circleSize * 1.35) / 2);
      ringTargetX.set(rawMouseX.get());
      ringTargetY.set(rawMouseY.get());
      return;
    }

    const pad = targetPadding;
    const w = rect.width + pad * 2;
    const h = rect.height + pad * 2;
    const computedR = parseFloat(window.getComputedStyle(el).borderRadius) || 8;
    const isCircle = Math.abs(rect.width - rect.height) < 4 && computedR >= rect.width / 2 - 2;

    ringTargetW.set(w);
    ringTargetH.set(h);
    ringTargetRadius.set(isCircle ? w / 2 : computedR + pad);
    ringTargetX.set(rect.left + rect.width / 2);
    ringTargetY.set(rect.top + rect.height / 2);
  }, [circleSize, targetPadding, rawMouseX, ringTargetW, ringTargetH, ringTargetRadius, ringTargetX, ringTargetY]);

  const resetRingToMouse = useCallback(() => {
    ringTargetW.set(circleSize);
    ringTargetH.set(circleSize);
    ringTargetRadius.set(circleSize / 2);
    ringTargetX.set(rawMouseX.get());
    ringTargetY.set(rawMouseY.get());
  }, [circleSize, rawMouseX, ringTargetW, ringTargetH, ringTargetRadius, ringTargetX, ringTargetY]);

  // Global mouse tracking and element detection
  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      Boolean((navigator as any).msMaxTouchPoints && (navigator as any).msMaxTouchPoints > 0);
    setIsTouchDevice(isTouch);

    if (isTouch && !showOnTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawMouseX.set(e.clientX);
      rawMouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) {
        if (currentElRef.current) {
          currentElRef.current = null;
          setActiveEl(null);
          setActiveTargetIdx(null);
          resetRingToMouse();
        }
        return;
      }

      // Check if target matches any explicit selector in `targets` prop
      let matchedTargetIdx: number | null = null;
      if (targets && targets.length > 0) {
        for (let i = 0; i < targets.length; i++) {
          if (target.closest(targets[i])) {
            matchedTargetIdx = i;
            break;
          }
        }
      }

      // Check if target is a clean interactive element
      // (buttons, links, pills, badges, tabs - NOT huge container cards)
      const interactiveEl = target.closest(
        'button, a, .copy-pill, .theme-toggle-btn, .draggable-badge, .nav-link, .action-link, [role="button"], input, select, textarea'
      ) as HTMLElement | null;

      const candidate = matchedTargetIdx !== null
        ? (target.closest(targets[matchedTargetIdx]) as HTMLElement | null)
        : interactiveEl;

      if (candidate) {
        if (candidate !== currentElRef.current) {
          currentElRef.current = candidate;
          setActiveEl(candidate);
          setActiveTargetIdx(matchedTargetIdx);
          updateRingToElement(candidate);
        }
      } else {
        if (currentElRef.current) {
          currentElRef.current = null;
          setActiveEl(null);
          setActiveTargetIdx(null);
          resetRingToMouse();
        } else {
          ringTargetX.set(e.clientX);
          ringTargetY.set(e.clientY);
        }
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => {
      setIsVisible(false);
      currentElRef.current = null;
      setActiveEl(null);
      setActiveTargetIdx(null);
    };

    let scrollRafId = 0;
    const handleScrollOrResize = () => {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        if (currentElRef.current) {
          updateRingToElement(currentElRef.current);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isVisible, showOnTouch, targets, rawMouseX, rawMouseY, updateRingToElement, resetRingToMouse]);

  if (isTouchDevice && !showOnTouch) {
    return null;
  }

  const isMorphed = Boolean(activeEl);

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
      style={{ zIndex }}
      aria-hidden="true"
    >
      {/* Outer Spring Follower / Highlight Frame */}
      <motion.div
        className={`absolute flex items-center justify-center ${circleClassName}`}
        animate={{
          scale: isMorphed ? 1 : isClicked ? 0.82 : 1,
          borderColor: isMorphed ? '#44f0ff' : circleColor,
          backgroundColor: isMorphed ? 'rgba(68, 240, 255, 0.05)' : 'transparent',
          boxShadow: isMorphed
            ? '0 0 20px rgba(68, 240, 255, 0.3), inset 0 0 10px rgba(68, 240, 255, 0.08)'
            : '0 0 0px transparent',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{
          width: smoothW,
          height: smoothH,
          borderRadius: smoothRadius,
          left: smoothX,
          top: smoothY,
          x: '-50%',
          y: '-50%',
          borderWidth: `${circleBorderWidth}px`,
          borderStyle: 'solid',
          opacity: isVisible ? 1 : 0,
          scaleX: elastic && !isMorphed ? scaleX : 1,
          scaleY: elastic && !isMorphed ? scaleY : 1,
          mixBlendMode,
          willChange: 'transform, width, height, border-radius',
        }}
      >
        {children}
      </motion.div>

      {/* Center Laser Dot (fades cleanly when morphed so text isn't obscured) */}
      <motion.div
        className={`absolute rounded-full pointer-events-none ${dotClassName}`}
        animate={{
          opacity: isVisible && !isMorphed ? 1 : 0,
          scale: isMorphed ? 0 : isClicked ? 1.5 : 1,
        }}
        transition={{ duration: 0.12 }}
        style={{
          width: dotSize,
          height: dotSize,
          left: dotX,
          top: dotY,
          x: '-50%',
          y: '-50%',
          backgroundColor: dotColor,
          mixBlendMode,
          boxShadow: `0 0 10px ${dotColor}`,
          willChange: 'transform, opacity',
        }}
      />

      {/* Target Image Preview (if image targets are provided) */}
      {targets.map((selector, idx) => {
        const isHovered = activeTargetIdx === idx;
        const imageUrl = images[idx];
        if (!isHovered || !imageUrl || !activeEl) return null;

        const rect = activeEl.getBoundingClientRect();
        const radius = parseFloat(window.getComputedStyle(activeEl).borderRadius) || 0;
        const isCircle = Math.abs(rect.width - rect.height) < 4 && radius >= rect.width / 2 - 2;
        const padWidth = rect.width + 2 * targetPadding;
        const cornerR = isCircle ? padWidth / 2 : radius + targetPadding;
        const innerR = isCircle ? (rect.width / 2) * imageScale : radius * imageScale;

        return (
          <AnimatePresence key={`${selector}-${idx}`}>
            {isHovered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: imageScale, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: imageAnimationDuration, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'fixed',
                  left: rect.left + rect.width / 2,
                  top: rect.top + rect.height / 2,
                  width: rect.width,
                  height: rect.height,
                  x: '-50%',
                  y: '-50%',
                  pointerEvents: 'none',
                  willChange: 'transform, opacity',
                  borderRadius: `${cornerR}px`,
                }}
              >
                <div
                  className={`w-full h-full bg-center bg-cover ${imageClassName}`}
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    borderRadius: `${innerR}px`,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
};

export default CustomCursor;
