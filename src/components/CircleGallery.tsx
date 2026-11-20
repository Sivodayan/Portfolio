import React, { useRef, useState, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

export interface CircleGalleryItemData {
  image: string;
  title?: string;
  tag?: string;
  desc?: string;
  tags?: string[];
  links?: { label: string; href: string }[];
  drawerDetails?: string;
  flowSteps?: string[];
}

export interface CircleGalleryProps {
  images?: string[];
  items?: CircleGalleryItemData[];
  radiusPercent?: number;
  itemWidth?: number;
  itemHeight?: number;
  itemScale?: number;
  borderRadius?: number;
  enableDrag?: boolean;
  throwResistance?: number;
  animationDuration?: number;
  showNumbers?: boolean;
  autoSpin?: number;
  className?: string;
  itemClassName?: string;
  onItemClick?: (index: number, imageOrItem: string | CircleGalleryItemData) => void;
}

const DEFAULT_PROJECT_ITEMS: CircleGalleryItemData[] = [
  {
    image: 'assets/images/projects/floodguard.png',
    title: 'IoT Flood Early Warning (FloodGuard)',
    tag: 'Special Term Project',
    desc: 'Multi-node early warning telemetry dashboard engineered by Team Void Warriors to monitor river water levels. Connects ultrasonic sensors to ESP32 & Arduino, streaming live hydrometric trends, threshold alerts, and automated SMS broadcasts over GSM.',
    tags: ['ESP32', 'FastAPI ML', 'Arduino', 'GSM SIM800L', 'MQTT', 'C++'],
    drawerDetails: 'Engineered for high-resilience riverbanks. Microcontrollers take periodic ultrasonic distance pings, trigger dual GSM modem broadcast pulses, and failover gracefully between cellular band and local telemetry.',
    flowSteps: ['Ultrasonic Ping', 'ESP32 Sampling', 'GSM SIM800L Alert', 'MQTT Broker', 'Dashboard'],
  },
  {
    image: 'assets/images/projects/kopay_college.jpg',
    title: 'J/Kopay Christian College Portal',
    tag: 'Web Application',
    desc: 'Performant modern web portal built with React 19 and Tailwind CSS for J/Kopay Christian College (est. 1852 in Jaffna), featuring school history, academic performance boards, faculty gallery, and event calendar.',
    tags: ['React 19', 'Tailwind CSS', 'Vite', 'TypeScript'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/Sivodayan/JHC_WEBSITE' },
      { label: 'Live Demo ↗', href: 'https://sivodayan.github.io/JHC_WEBSITE/' },
    ],
    drawerDetails: 'Engineered for accessibility across low-bandwidth mobile connections in Northern Sri Lanka. Eliminated layout shifts and optimized bundle sizes.',
    flowSteps: ['React 19 Components', 'Vite 6 Optimization', 'Tailwind Styling', 'Admissions & Curricula Hub'],
  },
  {
    image: 'assets/images/projects/uom_redesign.jpg',
    title: 'University of Moratuwa Redesign',
    tag: 'UI Concept',
    desc: 'Responsive concept redesign for the official University of Moratuwa website, addressing navigation clutter with a clean frosted-glass header, fluid faculty explorer, and seamless layout scaling from mobile to ultra-wide displays.',
    tags: ['HTML5', 'Modern CSS', 'JavaScript', 'UI/UX'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/Sivodayan/UoM-Redesign' },
      { label: 'Live Demo ↗', href: 'https://sivodayan.github.io/UoM-Redesign/' },
    ],
    drawerDetails: 'Eliminated layout shifts (CLS < 0.01) and reduced visual cognitive overload for prospective engineering students.',
    flowSteps: ['Frosted Glass Header', 'Faculty Explorer', 'CSS Grid Layout', 'GitHub Pages Deployment'],
  },
  {
    image: 'assets/images/projects/mora_travels.jpg',
    title: 'MORA Travels Expedition Portal',
    tag: 'Excursion Logs',
    desc: 'Interactive travel and expedition log interface designed for university student club trips, featuring visual itinerary cards, route checkpoints, and packing lists.',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/Sivodayan/MORA-Travels' },
    ],
  },
];

// Duplicate items to form a balanced 8-slot circular gallery
const DEFAULT_EXPANDED_ITEMS: CircleGalleryItemData[] = [
  ...DEFAULT_PROJECT_ITEMS,
  ...DEFAULT_PROJECT_ITEMS.map((item) => ({ ...item })),
];

export const CircleGallery: React.FC<CircleGalleryProps> = ({
  images = [],
  items,
  radiusPercent = 34,
  itemWidth = 280,
  itemHeight = 360,
  itemScale = 0.85,
  borderRadius = 16,
  enableDrag = true,
  throwResistance = 0.35,
  animationDuration = 0.9,
  showNumbers = true,
  autoSpin = 5,
  className,
  itemClassName,
  onItemClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const draggableRef = useRef<globalThis.Draggable[] | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Determine items list
  const resolvedItems: CircleGalleryItemData[] = items
    ? items
    : images.length > 0
    ? images.map((img, i) => ({
        image: img,
        title: DEFAULT_EXPANDED_ITEMS[i % DEFAULT_EXPANDED_ITEMS.length]?.title || `Project ${i + 1}`,
        tag: DEFAULT_EXPANDED_ITEMS[i % DEFAULT_EXPANDED_ITEMS.length]?.tag || 'Portfolio Item',
        desc: DEFAULT_EXPANDED_ITEMS[i % DEFAULT_EXPANDED_ITEMS.length]?.desc || '',
        tags: DEFAULT_EXPANDED_ITEMS[i % DEFAULT_EXPANDED_ITEMS.length]?.tags || [],
        links: DEFAULT_EXPANDED_ITEMS[i % DEFAULT_EXPANDED_ITEMS.length]?.links,
      }))
    : DEFAULT_EXPANDED_ITEMS;

  const totalItems = resolvedItems.length;

  const updateItemPositions = useCallback(
    (animate = false) => {
      if (!rotatorRef.current) return;
      const r = (radiusPercent / 100) * Math.min(window.innerWidth, window.innerHeight);
      const angleStep = (2 * Math.PI) / totalItems;
      const currentRot = gsap.getProperty(rotatorRef.current, 'rotation') || 0;
      const rotRad = (Math.PI / 180) * Number(currentRot);

      itemsRef.current.forEach((el, idx) => {
        if (!el) return;
        const angle = idx * angleStep + rotRad;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);

        if (animate) {
          gsap.to(el, {
            x,
            y,
            rotation: -Number(currentRot),
            duration: 0.4,
            ease: 'power2.out',
          });
        } else {
          gsap.set(el, {
            x,
            y,
            rotation: -Number(currentRot),
          });
        }
      });
    },
    [totalItems, radiusPercent]
  );

  const initDraggable = useCallback(() => {
    if (!rotatorRef.current || !enableDrag || selectedIndex !== null) return;
    if (draggableRef.current && draggableRef.current[0]) {
      draggableRef.current[0].kill();
    }

    const onRotate = function (this: { rotation: number }) {
      const rot = this.rotation || 0;
      itemsRef.current.forEach((el) => {
        if (el) gsap.set(el, { rotation: -Number(rot) });
      });
    };

    draggableRef.current = Draggable.create(rotatorRef.current, {
      type: 'rotation',
      inertia: true,
      throwResistance: throwResistance,
      onDrag: onRotate,
      onThrowUpdate: onRotate,
      onPress: () => {
        if (spinTweenRef.current) {
          spinTweenRef.current.kill();
          spinTweenRef.current = null;
        }
        isDraggingRef.current = false;
      },
      onDragStart: () => {
        isDraggingRef.current = true;
      },
      onDragEnd: () => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 50);
      },
      trigger: containerRef.current,
    });
  }, [enableDrag, throwResistance, selectedIndex]);

  const animateEntrance = useCallback(() => {
    if (!rotatorRef.current) return;
    const validItems = itemsRef.current.filter(Boolean) as HTMLDivElement[];
    const tl = gsap.timeline({
      onComplete: () => {
        setIsInitialized(true);
        initDraggable();
      },
    });

    for (let i = 0; i < totalItems; i++) {
      const el = validItems[i];
      if (!el) continue;
      const delay = (totalItems - 1 - i) * 0.1;
      tl.to(el, { opacity: 1, scale: itemScale, duration: 0.5, ease: 'power2.out' }, delay);
    }

    const pauseTime = (totalItems - 1) * 0.1 + 0.5;
    tl.to({}, { duration: 0.3 }, pauseTime);

    const r = (radiusPercent / 100) * Math.min(window.innerWidth, window.innerHeight);
    const angleStep = (2 * Math.PI) / totalItems;
    const fanTime = pauseTime + 0.3;

    for (let i = 0; i < totalItems; i++) {
      const el = validItems[i];
      if (!el) continue;
      const angle = i * angleStep;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      tl.to(
        el,
        {
          x,
          y,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          duration: animationDuration,
          ease: 'power2.inOut',
        },
        fanTime
      );
    }
  }, [totalItems, radiusPercent, itemScale, animationDuration, initDraggable]);

  // Window resize handler
  useEffect(() => {
    const onResize = () => {
      if (isInitialized) updateItemPositions(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isInitialized, updateItemPositions]);

  // Radius change handler
  useEffect(() => {
    if (isInitialized) updateItemPositions(true);
  }, [radiusPercent, isInitialized, updateItemPositions]);

  // Initial setup
  useEffect(() => {
    const validItems = itemsRef.current.filter(Boolean) as HTMLDivElement[];
    if (validItems.length > 0) {
      gsap.set(validItems, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0,
        opacity: 0,
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      });
    }
  }, []);

  // Run entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      animateEntrance();
    }, 50);
    return () => clearTimeout(timer);
  }, [animateEntrance]);

  // Manage draggable state based on selected item
  useEffect(() => {
    if (selectedIndex !== null && draggableRef.current) {
      draggableRef.current[0]?.kill();
      draggableRef.current = null;
    } else if (selectedIndex === null && isInitialized && enableDrag) {
      initDraggable();
    }
  }, [selectedIndex, isInitialized, enableDrag, initDraggable]);

  // Auto-spin animation
  useEffect(() => {
    if (!isInitialized || !rotatorRef.current || autoSpin === 0 || selectedIndex !== null) {
      if (spinTweenRef.current) {
        spinTweenRef.current.kill();
        spinTweenRef.current = null;
      }
      return;
    }

    const currentRot = gsap.getProperty(rotatorRef.current, 'rotation') || 0;
    spinTweenRef.current = gsap.to(rotatorRef.current, {
      rotation: Number(currentRot) + (autoSpin > 0 ? 360 : -360),
      duration: Math.abs(360 / autoSpin),
      ease: 'none',
      repeat: -1,
      onUpdate: function () {
        const rot = gsap.getProperty(rotatorRef.current, 'rotation') || 0;
        itemsRef.current.forEach((el) => {
          if (el) gsap.set(el, { rotation: -Number(rot) });
        });
      },
    });

    return () => {
      if (spinTweenRef.current) {
        spinTweenRef.current.kill();
        spinTweenRef.current = null;
      }
    };
  }, [isInitialized, autoSpin, selectedIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      draggableRef.current && draggableRef.current[0]?.kill();
      spinTweenRef.current && spinTweenRef.current.kill();
      if (rotatorRef.current) gsap.killTweensOf(rotatorRef.current);
      itemsRef.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, []);

  const handleCardClick = (index: number, item: CircleGalleryItemData) => {
    if (isDraggingRef.current) return;

    if (selectedIndex === index) {
      // Unzoom
      setSelectedIndex(null);
      const r = (radiusPercent / 100) * Math.min(window.innerWidth, window.innerHeight);
      const angleStep = (2 * Math.PI) / totalItems;
      const currentRot = gsap.getProperty(rotatorRef.current, 'rotation') || 0;
      const rotRad = (Math.PI / 180) * Number(currentRot);

      itemsRef.current.forEach((el, idx) => {
        if (el) {
          const angle = idx * angleStep + rotRad;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          gsap.to(el, {
            x,
            y,
            scale: itemScale,
            zIndex: 100 + idx,
            filter: 'blur(0px)',
            duration: 0.6,
            ease: 'power2.inOut',
          });
        }
      });
    } else {
      // Zoom clicked card into center
      setSelectedIndex(index);
      itemsRef.current.forEach((el, idx) => {
        if (el) {
          if (idx === index) {
            gsap.to(el, {
              x: 0,
              y: 0,
              scale: 1.45 * itemScale,
              zIndex: 1000,
              filter: 'blur(0px)',
              duration: 0.6,
              ease: 'power2.out',
            });
          } else {
            gsap.to(el, {
              scale: 0.75 * itemScale,
              filter: 'blur(6px)',
              duration: 0.6,
              ease: 'power2.inOut',
            });
          }
        }
      });
    }

    if (onItemClick) {
      onItemClick(index, item);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (selectedIndex !== null && e.target === containerRef.current) {
      setSelectedIndex(null);
      const r = (radiusPercent / 100) * Math.min(window.innerWidth, window.innerHeight);
      const angleStep = (2 * Math.PI) / totalItems;
      const currentRot = gsap.getProperty(rotatorRef.current, 'rotation') || 0;
      const rotRad = (Math.PI / 180) * Number(currentRot);

      itemsRef.current.forEach((el, idx) => {
        if (el) {
          const angle = idx * angleStep + rotRad;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          gsap.to(el, {
            x,
            y,
            scale: itemScale,
            zIndex: 100 + idx,
            filter: 'blur(0px)',
            duration: 0.6,
            ease: 'power2.inOut',
          });
        }
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-[580px] md:h-[660px] overflow-hidden flex items-center justify-center select-none',
        enableDrag && selectedIndex === null && 'cursor-grab active:cursor-grabbing',
        className
      )}
      style={{ perspective: '2200px' }}
      onClick={handleContainerClick}
    >
      {/* 3D Rotating Ring */}
      <div
        ref={rotatorRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ transformOrigin: 'center center' }}
      >
        {resolvedItems.map((item, idx) => (
          <div
            key={idx}
            ref={(el) => {
              itemsRef.current[idx] = el;
            }}
            className={cn(
              'absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden cursor-pointer select-none transition-all duration-300 group',
              selectedIndex === idx && 'ring-2 ring-[#44f0ff] shadow-[0_0_35px_rgba(68,240,255,0.4)]',
              itemClassName
            )}
            style={{
              width: `${itemWidth}px`,
              height: `${itemHeight}px`,
              borderRadius: `${borderRadius}px`,
              transformOrigin: 'center center',
              background: item.image.startsWith('linear-gradient') || item.image.startsWith('radial-gradient')
                ? item.image
                : `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => handleCardClick(idx, item)}
          >
            {/* Dark glass tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 group-hover:via-black/20 transition-all duration-300 pointer-events-none" />

            {/* Specular edge border */}
            <div className="absolute inset-0 rounded-[inherit] border border-white/20 group-hover:border-[#44f0ff]/50 transition-colors pointer-events-none" />

            {/* Card Index Tag */}
            {showNumbers && (
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[11px] font-mono font-bold z-10 drop-shadow-md">
                {String(idx + 1).padStart(2, '0')}
              </div>
            )}

            {/* Tag Badge */}
            {item.tag && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#44f0ff]/15 border border-[#44f0ff]/30 text-[#44f0ff] text-[10px] font-mono font-medium z-10 backdrop-blur-md">
                {item.tag}
              </div>
            )}

            {/* Bottom Card Title & Tech Info */}
            <div className="absolute bottom-0 inset-x-0 p-4 z-10 flex flex-col justify-end pointer-events-none">
              {item.title && (
                <h4 className="text-white font-semibold text-sm md:text-base leading-snug drop-shadow-md group-hover:text-[#44f0ff] transition-colors mb-1.5">
                  {item.title}
                </h4>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80 backdrop-blur-sm border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-white/5 text-white/60">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-2 text-[10px] text-[#44f0ff] font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <span>{selectedIndex === idx ? 'Click to unzoom ✕' : 'Click to inspect ↗'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Center Helper / Instruction */}
      {selectedIndex === null && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/70 shadow-lg flex items-center gap-2 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#44f0ff] animate-ping" />
          <span>Drag or flick to rotate 3D ring • Click tile to focus</span>
        </div>
      )}
    </div>
  );
};

// Aliased export as exact component `<d />` matching React Bits Pro snippet
export const d = CircleGallery;
export const D = CircleGallery;
export default CircleGallery;

// TypeScript JSX declaration so `<d />` can be written directly in TSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      d: React.ComponentProps<typeof CircleGallery>;
    }
  }
}

