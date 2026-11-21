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
  zoomLevel = 0.05,
  rgbShiftAmount = 0.03,
  rotationIntensity = 0.8,
  scaleIntensity = 0.04,
  borderRadius = 26,
  triggerGlitch = false,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Smooth 3D tilt tracking state
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [glitchActive, setGlitchActive] = useState<boolean>(false);

  // Internal lerp physics targets
  const targetTilt = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentTilt = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  // Smooth lerp loop for tactile inertia
  useEffect(() => {
    const loop = () => {
      // Lerp toward target
      const factor = isHovered ? 0.12 : 0.08;
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * factor;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * factor;

      setTilt({
        x: Number(currentTilt.current.x.toFixed(2)),
        y: Number(currentTilt.current.y.toFixed(2)),
      });

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isHovered]);

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
      const maxRot = 16 * rotationIntensity;
      targetTilt.current = {
        x: -normY * maxRot,
        y: normX * maxRot,
      };

      // Calculate holographic glare position (0% - 100%)
      setGlare({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.65,
      });
    },
    [rotationIntensity]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    // Micro-glitch pulse on enter
    setGlitchActive(true);
    const timer = setTimeout(() => setGlitchActive(false), 240);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    targetTilt.current = { x: 0, y: 0 };
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  // Trigger glitch when triggerGlitch prop updates (e.g. hero entry intro)
  useEffect(() => {
    if (triggerGlitch) {
      setGlitchActive(true);
      const timer = setTimeout(() => setGlitchActive(false), 380);
      return () => clearTimeout(timer);
    }
  }, [triggerGlitch]);

  // Calculate dynamic chromatic aberration offset based on current tilt & hover state
  const chromaticIntensity = (isHovered ? 1.0 : 0.0) + (glitchActive ? 2.2 : 0.0);
  const redShiftX = (-tilt.y * 0.45 * (rgbShiftAmount * 25) * chromaticIntensity);
  const redShiftY = (tilt.x * 0.45 * (rgbShiftAmount * 25) * chromaticIntensity);
  const cyanShiftX = (tilt.y * 0.45 * (rgbShiftAmount * 25) * chromaticIntensity);
  const cyanShiftY = (-tilt.x * 0.45 * (rgbShiftAmount * 25) * chromaticIntensity);

  const resolvedWidth = typeof width === 'number' ? `${width}px` : width;
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <>
      {/* Hidden SVG Filters for Chromatic Color Separation */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          {/* Pure Red Channel Filter */}
          <filter id="chroma-channel-red" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>

          {/* Pure Cyan Channel Filter (Green + Blue) */}
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
          className="relative w-full h-full overflow-hidden transition-all duration-300 ease-out will-change-transform"
          style={{
            borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${
              isHovered ? 1 + scaleIntensity : 1
            }, ${isHovered ? 1 + scaleIntensity : 1}, 1)`,
            transformStyle: 'preserve-3d',
            boxShadow: isHovered
              ? '0 30px 60px -12px rgba(0, 0, 0, 0.85), 0 0 25px rgba(56, 189, 248, 0.35)'
              : '0 20px 40px -10px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Cyber Glass Outer Border */}
          <div
            className={`absolute inset-0 rounded-[inherit] border transition-colors duration-300 pointer-events-none z-30 ${
              isHovered ? 'border-[#38bdf8]/70' : 'border-white/15 [data-theme=light]:border-black/10'
            }`}
          />

          {/* Layer 0: Base Crystal Clear Image */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden rounded-[inherit]"
            style={{
              transform: `scale(${isHovered ? 1 + zoomLevel : 1})`,
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <img
              src={imageSrc}
              alt="Profile Portrait"
              loading="eager"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>

          {/* Layer 1: Red Chromatic Separation Layer */}
          {chromaticIntensity > 0.05 && (
            <div
              className="absolute inset-0 w-full h-full overflow-hidden rounded-[inherit] pointer-events-none transition-opacity duration-200"
              style={{
                opacity: isHovered || glitchActive ? 0.85 : 0,
                transform: `scale(${isHovered ? 1 + zoomLevel : 1}) translate3d(${redShiftX}px, ${redShiftY}px, 0)`,
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
          )}

          {/* Layer 2: Cyan Chromatic Separation Layer */}
          {chromaticIntensity > 0.05 && (
            <div
              className="absolute inset-0 w-full h-full overflow-hidden rounded-[inherit] pointer-events-none transition-opacity duration-200"
              style={{
                opacity: isHovered || glitchActive ? 0.85 : 0,
                transform: `scale(${isHovered ? 1 + zoomLevel : 1}) translate3d(${cyanShiftX}px, ${cyanShiftY}px, 0)`,
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
          )}

          {/* Layer 3: Cyberpunk Horizontal Slices Glitch */}
          {glitchActive && (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden rounded-[inherit]"
              style={{ mixBlendMode: 'screen' }}
            >
              <div
                className="absolute inset-0 w-full h-full bg-[#00f0ff]/20"
                style={{
                  clipPath: 'polygon(0 15%, 100% 15%, 100% 32%, 0 32%)',
                  transform: 'translateX(-6px)',
                }}
              />
              <div
                className="absolute inset-0 w-full h-full bg-[#ff0055]/20"
                style={{
                  clipPath: 'polygon(0 58%, 100% 58%, 100% 74%, 0 74%)',
                  transform: 'translateX(6px)',
                }}
              />
            </div>
          )}

          {/* Layer 4: CRT Cyber Scanlines Grid */}
          <div
            className="absolute inset-0 pointer-events-none z-15 opacity-[0.14] group-hover:opacity-[0.22] transition-opacity duration-300"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)',
            }}
          />

          {/* Layer 5: Holographic Rainbow Foil Sheen */}
          <div
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.32 : 0.12,
              background: `linear-gradient(${115 + tilt.y * 3}deg, 
                rgba(255, 0, 128, 0.22) 0%, 
                rgba(0, 240, 255, 0.28) 25%, 
                rgba(255, 235, 59, 0.22) 50%, 
                rgba(168, 85, 247, 0.28) 75%, 
                rgba(52, 211, 153, 0.22) 100%)`,
              backgroundSize: '200% 200%',
              backgroundPosition: `${50 + tilt.y * 2}% ${50 + tilt.x * 2}%`,
              mixBlendMode: 'color-dodge',
            }}
          />

          {/* Layer 6: Dynamic Specular Spotlight / Glare */}
          <div
            className="absolute inset-0 pointer-events-none z-25 transition-opacity duration-200"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(56, 189, 248, 0.15) 35%, transparent 70%)`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Layer 7: Light Mode Dark Contrast Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 [data-theme=light]:opacity-20 opacity-0 bg-black"
          />

          {/* Layer 8: HUD Micro-Markers (Top Bar) */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
            {/* Top-Left Code Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/90 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
              <span className="font-semibold tracking-wider">CHROMA // 01</span>
            </div>

            {/* Top-Right Online Status */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-emerald-400 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-bold tracking-widest">ACTIVE</span>
            </div>
          </div>

          {/* Layer 9: HUD Bottom Bar */}
          <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/80 pointer-events-none shadow-sm">
            <span className="font-medium tracking-wide">SIVODAYAN • CSE</span>
            <span className="text-[#38bdf8] font-bold">
              {tilt.y > 0 ? `+${tilt.y.toFixed(0)}°` : `${tilt.y.toFixed(0)}°`} /{' '}
              {tilt.x > 0 ? `+${tilt.x.toFixed(0)}°` : `${tilt.x.toFixed(0)}°`}
            </span>
          </div>

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
