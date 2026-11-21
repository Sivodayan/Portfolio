import React, { useRef, useState, useEffect, useCallback } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ChromaCardProps
 * React Bits Pro Chroma Card component props interface
 * Docs: https://pro.reactbits.dev/docs/components/chroma-card
 */
export interface ChromaCardProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  children?: React.ReactNode;
  imageSrc?: string;
  imageAspectRatio?: number;
  cardWidth?: number;
  cardHeight?: number;
  zoomLevel?: number;
  rgbShiftAmount?: number;
  pixelDisplaceAmount?: number;
  hoverDuration?: number;
  rotationIntensity?: number;
  scaleIntensity?: number;
  positionIntensity?: number;
  interactionDuration?: number;
  opacity?: number;
  cameraFov?: number;
  cameraZ?: number;
  borderRadius?: number | string;
  triggerGlitch?: boolean;
}

/**
 * ChromaCard — Refined React Bits Pro Component (@reactbits-starter/chroma-card-tw)
 * Docs: https://pro.reactbits.dev/docs/components/chroma-card
 *
 * Features:
 * - Fluid 3D perspective tilt tracking cursor coordinates
 * - Zero-lag decoupled physics loop (zero React state re-renders during mouse tracking)
 * - Optical RGB chromatic aberration channel splitting (Red and Cyan/Blue channels)
 * - Authentic mouse ON and mouse OFF glitch burst transition (micro-slice jitter)
 * - Dynamic specular glare spotlight reflection
 * - Glass hairline border with theme support (Light & Dark)
 */
export const ChromaCard: React.FC<ChromaCardProps> = ({
  width = '100%',
  height = 'auto',
  className = '',
  children,
  imageSrc = '/assets/images/profile.jpg',
  zoomLevel = 0.04,
  rgbShiftAmount = 0.025,
  rotationIntensity = 0.75,
  scaleIntensity = 0.03,
  borderRadius = 26,
  triggerGlitch = false,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const redLayerRef = useRef<HTMLDivElement | null>(null);
  const cyanLayerRef = useRef<HTMLDivElement | null>(null);

  // Glitch transition state for mouse-on, mouse-off, and programmatic triggers
  const [glitchActive, setGlitchActive] = useState<boolean>(false);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Decoupled physics refs for zero-lag 60+ FPS motion without React state updates
  const isHoveredRef = useRef<boolean>(false);
  const targetTilt = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentTilt = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const glarePos = useRef<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const currentGlare = useRef<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const isRunningRef = useRef<boolean>(false);
  const animationFrameId = useRef<number | null>(null);

  // Trigger rapid chromatic glitch pulse (used on mouse enter, mouse leave, and intro)
  const triggerGlitchPulse = useCallback((duration = 240) => {
    setGlitchActive(true);
    startLoopIfNeeded();
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    glitchTimerRef.current = setTimeout(() => {
      setGlitchActive(false);
    }, duration);
  }, []);

  // Direct GPU update loop (runs during active tilt/settle; halts when at rest)
  const updatePhysics = useCallback(() => {
    const isHovered = isHoveredRef.current;
    const factor = isHovered ? 0.14 : 0.09;

    // Lerp tilt
    currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * factor;
    currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * factor;

    // Lerp glare
    currentGlare.current.x += (glarePos.current.x - currentGlare.current.x) * factor;
    currentGlare.current.y += (glarePos.current.y - currentGlare.current.y) * factor;
    currentGlare.current.opacity += (glarePos.current.opacity - currentGlare.current.opacity) * factor;

    const tiltX = currentTilt.current.x;
    const tiltY = currentTilt.current.y;
    const scale = isHovered ? 1 + scaleIntensity : 1;

    // 3D Card tilt transform
    if (innerRef.current) {
      innerRef.current.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`;
    }

    // Dynamic chromatic aberration displacement
    const baseShift = rgbShiftAmount * 32;
    if (redLayerRef.current) {
      const rx = -tiltY * 0.45 * baseShift;
      const ry = tiltX * 0.45 * baseShift;
      redLayerRef.current.style.transform = `scale(${isHovered ? 1 + zoomLevel : 1}) translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      redLayerRef.current.style.opacity = isHovered || glitchActive ? '0.85' : '0';
    }

    if (cyanLayerRef.current) {
      const cx = tiltY * 0.45 * baseShift;
      const cy = -tiltX * 0.45 * baseShift;
      cyanLayerRef.current.style.transform = `scale(${isHovered ? 1 + zoomLevel : 1}) translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      cyanLayerRef.current.style.opacity = isHovered || glitchActive ? '0.85' : '0';
    }

    // Specular Glare reflection update
    if (glareRef.current) {
      glareRef.current.style.opacity = currentGlare.current.opacity.toFixed(2);
      glareRef.current.style.background = `radial-gradient(circle 380px at ${currentGlare.current.x.toFixed(1)}% ${currentGlare.current.y.toFixed(1)}%, rgba(255, 255, 255, 0.42) 0%, rgba(56, 189, 248, 0.16) 35%, transparent 70%)`;
    }

    // Continue loop only while active or settling
    const tiltDiff = Math.abs(targetTilt.current.x - currentTilt.current.x) + Math.abs(targetTilt.current.y - currentTilt.current.y);
    const glareDiff = Math.abs(glarePos.current.opacity - currentGlare.current.opacity);

    if (isHovered || glitchActive || tiltDiff > 0.02 || glareDiff > 0.01) {
      animationFrameId.current = requestAnimationFrame(updatePhysics);
    } else {
      isRunningRef.current = false;
      animationFrameId.current = null;
    }
  }, [glitchActive, rgbShiftAmount, scaleIntensity, zoomLevel]);

  const startLoopIfNeeded = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      animationFrameId.current = requestAnimationFrame(updatePhysics);
    }
  }, [updatePhysics]);

  // Mouse Move: calculate normalized 3D tilt coordinates
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;

      const maxRot = 14 * rotationIntensity;
      targetTilt.current = {
        x: -normY * maxRot,
        y: normX * maxRot,
      };

      glarePos.current = {
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.6,
      };

      startLoopIfNeeded();
    },
    [rotationIntensity, startLoopIfNeeded]
  );

  // Mouse ON: Trigger glitch burst transition + start smooth tilt tracking
  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (imageWrapperRef.current) {
      imageWrapperRef.current.style.transform = `scale(${1 + zoomLevel})`;
    }
    triggerGlitchPulse(240);
  }, [triggerGlitchPulse, zoomLevel]);

  // Mouse OFF: Trigger glitch burst transition + return to resting position
  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    targetTilt.current = { x: 0, y: 0 };
    glarePos.current.opacity = 0;
    if (imageWrapperRef.current) {
      imageWrapperRef.current.style.transform = 'scale(1)';
    }
    triggerGlitchPulse(240);
  }, [triggerGlitchPulse]);

  // External glitch trigger prop (e.g. initial Hero entry sequence)
  useEffect(() => {
    if (triggerGlitch) {
      triggerGlitchPulse(320);
    }
  }, [triggerGlitch, triggerGlitchPulse]);

  useEffect(() => {
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, []);

  const resolvedWidth = typeof width === 'number' ? `${width}px` : width;
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <>
      {/* SVG Color Matrix Filters for Pure Optical RGB Channel Separation */}
      <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="chroma-channel-red" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="chroma-channel-cyan" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Main 3D Perspective Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'group relative cursor-pointer select-none max-w-full isolate',
          '[perspective:1200px]',
          className
        )}
        style={{
          width: resolvedWidth,
          height: resolvedHeight === 'auto' ? 'auto' : resolvedHeight,
          aspectRatio: '370 / 505',
          borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        }}
      >
        {/* Tilting Card Frame */}
        <div
          ref={innerRef}
          className="relative w-full h-full overflow-hidden will-change-transform bg-slate-950 transition-shadow duration-500 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.65)] group-hover:shadow-[0_25px_60px_-12px_rgba(56,189,248,0.25)]"
          style={{
            borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
            transformStyle: 'preserve-3d',
            transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          }}
        >
          {/* Elegant Glass Hairline Border */}
          <div
            className="absolute inset-0 rounded-[inherit] border border-white/15 [data-theme=light]:border-black/10 group-hover:border-[#38bdf8]/50 transition-colors duration-300 pointer-events-none z-30"
          />

          {/* Layer 0: Base Crystal Clear Image */}
          <div
            ref={imageWrapperRef}
            className="absolute inset-0 w-full h-full overflow-hidden rounded-[inherit] transition-transform duration-300 ease-out will-change-transform"
          >
            <img
              src={imageSrc}
              alt="Profile Portrait"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>

          {/* Layer 1: Red Chromatic Separation Layer */}
          <div
            ref={redLayerRef}
            className={cn(
              'absolute inset-0 w-full h-full overflow-hidden rounded-[inherit] pointer-events-none opacity-0 will-change-transform',
              glitchActive && 'chroma-glitch-red-active'
            )}
            style={{
              mixBlendMode: 'screen',
              filter: 'url(#chroma-channel-red)',
            }}
          >
            <img
              src={imageSrc}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover select-none"
            />
          </div>

          {/* Layer 2: Cyan Chromatic Separation Layer */}
          <div
            ref={cyanLayerRef}
            className={cn(
              'absolute inset-0 w-full h-full overflow-hidden rounded-[inherit] pointer-events-none opacity-0 will-change-transform',
              glitchActive && 'chroma-glitch-cyan-active'
            )}
            style={{
              mixBlendMode: 'screen',
              filter: 'url(#chroma-channel-cyan)',
            }}
          >
            <img
              src={imageSrc}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover select-none"
            />
          </div>

          {/* Layer 3: Mouse On & Mouse Off Glitch Slice Slices */}
          {glitchActive && (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-hidden rounded-[inherit]"
              style={{ mixBlendMode: 'screen' }}
            >
              <div
                className="absolute inset-0 w-full h-full bg-[#00f0ff]/25"
                style={{
                  clipPath: 'polygon(0 20%, 100% 20%, 100% 34%, 0 34%)',
                  transform: 'translateX(-6px)',
                }}
              />
              <div
                className="absolute inset-0 w-full h-full bg-[#ff0055]/25"
                style={{
                  clipPath: 'polygon(0 62%, 100% 62%, 100% 75%, 0 75%)',
                  transform: 'translateX(6px)',
                }}
              />
            </div>
          )}

          {/* Layer 4: Specular Glare Spotlight */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none z-20 opacity-0 will-change-transform"
            style={{
              mixBlendMode: 'overlay',
            }}
          />

          {/* Layer 5: Light Mode Gentle Contrast Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10 [data-theme=light]:opacity-15 opacity-0 bg-black transition-opacity duration-300"
          />

          {/* Optional Children Overlay */}
          {children && (
            <div className="pointer-events-none absolute inset-0 z-35 flex items-center justify-center">
              {children}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

ChromaCard.displayName = 'ChromaCard';

export default ChromaCard;
