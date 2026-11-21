import React, { useRef, useState, useEffect, useCallback } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  borderRadius?: number;
  triggerGlitch?: boolean;
}

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
  const foilRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const redLayerRef = useRef<HTMLDivElement | null>(null);
  const cyanLayerRef = useRef<HTMLDivElement | null>(null);
  const angleBadgeRef = useRef<HTMLSpanElement | null>(null);

  const [glitchActive, setGlitchActive] = useState<boolean>(false);

  // Non-rendering physics refs (100% decoupled from React state for 120fps performance)
  const isHoveredRef = useRef<boolean>(false);
  const targetTilt = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentTilt = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const glarePos = useRef<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const currentGlare = useRef<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const isRunningRef = useRef<boolean>(false);
  const animationFrameId = useRef<number | null>(null);

  // Direct GPU update loop (runs only when needed, never triggers React re-renders)
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

    // Direct DOM transform (zero VDOM reconciliation cost)
    if (innerRef.current) {
      innerRef.current.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`;
    }

    // Direct chromatic layer displacement
    const chromaticActive = isHovered || glitchActive;
    if (redLayerRef.current) {
      const rx = (-tiltY * 0.4 * (rgbShiftAmount * 25));
      const ry = (tiltX * 0.4 * (rgbShiftAmount * 25));
      redLayerRef.current.style.transform = `scale(${isHovered ? 1 + zoomLevel : 1}) translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      redLayerRef.current.style.opacity = chromaticActive ? '0.85' : '0';
    }

    if (cyanLayerRef.current) {
      const cx = (tiltY * 0.4 * (rgbShiftAmount * 25));
      const cy = (-tiltX * 0.4 * (rgbShiftAmount * 25));
      cyanLayerRef.current.style.transform = `scale(${isHovered ? 1 + zoomLevel : 1}) translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      cyanLayerRef.current.style.opacity = chromaticActive ? '0.85' : '0';
    }

    // Update holographic foil sheen
    if (foilRef.current) {
      foilRef.current.style.backgroundPosition = `${(50 + tiltY * 2).toFixed(1)}% ${(50 + tiltX * 2).toFixed(1)}%`;
      foilRef.current.style.opacity = isHovered ? '0.3' : '0.1';
    }

    // Update specular glare
    if (glareRef.current) {
      glareRef.current.style.opacity = currentGlare.current.opacity.toFixed(2);
      glareRef.current.style.background = `radial-gradient(circle 320px at ${currentGlare.current.x.toFixed(1)}% ${currentGlare.current.y.toFixed(1)}%, rgba(255, 255, 255, 0.45) 0%, rgba(56, 189, 248, 0.15) 35%, transparent 70%)`;
    }

    // Update readout badge
    if (angleBadgeRef.current) {
      angleBadgeRef.current.textContent = `${tiltY > 0 ? `+${tiltY.toFixed(0)}°` : `${tiltY.toFixed(0)}°`} / ${tiltX > 0 ? `+${tiltX.toFixed(0)}°` : `${tiltX.toFixed(0)}°`}`;
    }

    // Determine if loop should continue
    const tiltDiff = Math.abs(targetTilt.current.x - currentTilt.current.x) + Math.abs(targetTilt.current.y - currentTilt.current.y);
    const glareDiff = Math.abs(glarePos.current.opacity - currentGlare.current.opacity);

    if (isHovered || tiltDiff > 0.02 || glareDiff > 0.01) {
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

  // Handle Mouse Movement over Card
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized coordinates (-1 to 1) from card center
      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;

      // Calculate 3D tilt angles
      const maxRot = 14 * rotationIntensity;
      targetTilt.current = {
        x: -normY * maxRot,
        y: normX * maxRot,
      };

      // Calculate holographic glare position (0% - 100%)
      glarePos.current = {
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.65,
      };

      startLoopIfNeeded();
    },
    [rotationIntensity, startLoopIfNeeded]
  );

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (imageWrapperRef.current) {
      imageWrapperRef.current.style.transform = `scale(${1 + zoomLevel})`;
    }
    // Micro-glitch pulse on enter
    setGlitchActive(true);
    const timer = setTimeout(() => setGlitchActive(false), 200);
    startLoopIfNeeded();
    return () => clearTimeout(timer);
  }, [startLoopIfNeeded, zoomLevel]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    targetTilt.current = { x: 0, y: 0 };
    glarePos.current.opacity = 0;
    if (imageWrapperRef.current) {
      imageWrapperRef.current.style.transform = 'scale(1)';
    }
    startLoopIfNeeded();
  }, [startLoopIfNeeded]);

  // Trigger glitch when triggerGlitch prop updates
  useEffect(() => {
    if (triggerGlitch) {
      setGlitchActive(true);
      startLoopIfNeeded();
      const timer = setTimeout(() => {
        setGlitchActive(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [triggerGlitch, startLoopIfNeeded]);

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const resolvedWidth = typeof width === 'number' ? `${width}px` : width;
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <>
      {/* Hidden SVG Filters for Chromatic Color Separation */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
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
        {/* Tilting Card Wrapper */}
        <div
          ref={innerRef}
          className="relative w-full h-full overflow-hidden will-change-transform"
          style={{
            borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
            transformStyle: 'preserve-3d',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.65)',
            transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          }}
        >
          {/* Cyber Glass Outer Border */}
          <div
            className="absolute inset-0 rounded-[inherit] border border-white/15 [data-theme=light]:border-black/10 group-hover:border-[#38bdf8]/60 transition-colors duration-300 pointer-events-none z-30"
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
            className="absolute inset-0 w-full h-full overflow-hidden rounded-[inherit] pointer-events-none opacity-0 will-change-transform"
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
            className="absolute inset-0 w-full h-full overflow-hidden rounded-[inherit] pointer-events-none opacity-0 will-change-transform"
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

          {/* Layer 3: Cyberpunk Horizontal Slices Glitch */}
          {glitchActive && (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden rounded-[inherit]"
              style={{ mixBlendMode: 'screen' }}
            >
              <div
                className="absolute inset-0 w-full h-full bg-[#00f0ff]/20"
                style={{
                  clipPath: 'polygon(0 18%, 100% 18%, 100% 34%, 0 34%)',
                  transform: 'translateX(-5px)',
                }}
              />
              <div
                className="absolute inset-0 w-full h-full bg-[#ff0055]/20"
                style={{
                  clipPath: 'polygon(0 55%, 100% 55%, 100% 70%, 0 70%)',
                  transform: 'translateX(5px)',
                }}
              />
            </div>
          )}

          {/* Layer 4: CRT Cyber Scanlines Grid */}
          <div
            className="absolute inset-0 pointer-events-none z-15 opacity-[0.14] group-hover:opacity-[0.22] transition-opacity duration-300"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px)',
            }}
          />

          {/* Layer 5: Holographic Rainbow Foil Sheen */}
          <div
            ref={foilRef}
            className="absolute inset-0 pointer-events-none z-20 opacity-10 transition-opacity duration-300 will-change-transform"
            style={{
              background: `linear-gradient(115deg, 
                rgba(255, 0, 128, 0.22) 0%, 
                rgba(0, 240, 255, 0.28) 25%, 
                rgba(255, 235, 59, 0.22) 50%, 
                rgba(168, 85, 247, 0.28) 75%, 
                rgba(52, 211, 153, 0.22) 100%)`,
              backgroundSize: '200% 200%',
              backgroundPosition: '50% 50%',
              mixBlendMode: 'color-dodge',
            }}
          />

          {/* Layer 6: Dynamic Specular Spotlight / Glare */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none z-25 opacity-0 will-change-transform"
            style={{
              mixBlendMode: 'overlay',
            }}
          />

          {/* Layer 7: Light Mode Dark Contrast Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10 [data-theme=light]:opacity-20 opacity-0 bg-black transition-opacity duration-300"
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
