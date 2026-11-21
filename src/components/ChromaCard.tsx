import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D u_texture;
uniform float u_imageAspectRatio;
uniform float u_aspectRatio;
uniform float u_opacity;
uniform float u_hover;
uniform float u_zoomLevel;
uniform float u_rgbShift;
uniform float u_pixelDisplace;
uniform float u_borderRadius;
uniform vec2 u_resolution;
varying vec2 vUv;

float exponentialInOut(float t) {
  return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
      ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

float roundedBoxSDF(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 uv = vUv;

  vec2 pixelCoord = vUv * u_resolution;
  vec2 center = u_resolution * 0.5;
  vec2 halfSize = u_resolution * 0.5;
  float dist = roundedBoxSDF(pixelCoord - center, halfSize, u_borderRadius);

  if (dist > 0.0) {
    discard;
  }

  float alpha = 1.0 - smoothstep(-1.0, 1.0, dist);

  float u = u_imageAspectRatio / u_aspectRatio;
  if(u_imageAspectRatio > u_aspectRatio) {
    u = 1. / u;
  }

  uv.y *= u;
  uv.y -= (u) / 2. - .5;

  float hoverLevel = exponentialInOut(min(1., (distance(vec2(.5), uv) * u_hover) + u_hover));
  uv *= 1. - u_zoomLevel * hoverLevel;
  uv += u_zoomLevel / 2. * hoverLevel;
  uv = clamp(uv, 0., 1.);
  vec4 color = texture2D(u_texture, uv);

  if(hoverLevel > 0.) {
    hoverLevel = 1. - abs(hoverLevel - .5) * 2.;
    uv.y += color.r * hoverLevel * u_pixelDisplace;
    color = texture2D(u_texture, uv);
    color.r = texture2D(u_texture, uv + (hoverLevel) * u_rgbShift).r;
    color.g = texture2D(u_texture, uv - (hoverLevel) * u_rgbShift).g;
  }

  gl_FragColor = vec4(color.rgb, color.a * u_opacity * alpha);
}
`;

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
  width = 380,
  height = 480,
  className = '',
  children,
  imageSrc = '/assets/images/profile.jpg',
  imageAspectRatio = 0.75,
  cardWidth = 4.8,
  cardHeight = 6.4,
  zoomLevel = 0.28,
  rgbShiftAmount = 0.025,
  pixelDisplaceAmount = 0.08,
  hoverDuration = 1.8,
  rotationIntensity = 0.22,
  scaleIntensity = 0.08,
  positionIntensity = 0.35,
  interactionDuration = 0.4,
  opacity = 1,
  cameraFov = 50,
  cameraZ = 7.7,
  borderRadius = 32,
  triggerGlitch = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const widthPx = container.clientWidth || 300;
    const heightPx = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(cameraFov, widthPx / heightPx, 0.1, 100);
    camera.position.set(0, 0, cameraZ);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageSrc, (tex) => {
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      if (material) {
        material.uniforms.u_texture.value = tex;
      }
    });

    const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const uniforms = {
      u_texture: { value: texture },
      u_imageAspectRatio: { value: imageAspectRatio },
      u_aspectRatio: { value: cardWidth / cardHeight },
      u_opacity: { value: opacity },
      u_hover: { value: 0.0 },
      u_zoomLevel: { value: zoomLevel },
      u_rgbShift: { value: rgbShiftAmount },
      u_pixelDisplace: { value: pixelDisplaceAmount },
      u_borderRadius: { value: borderRadius },
      u_resolution: { value: new THREE.Vector2(widthPx, heightPx) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const updateSize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 500;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.u_resolution.value.set(w, h);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    let isMobileActive = false;
    let lastTouchTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const resetToNeutral = () => {
      lastTouchTime = Date.now();
      if (!material || !mesh) return;
      isMobileActive = false;
      gsap.killTweensOf(material.uniforms.u_hover);
      gsap.killTweensOf(mesh.scale);
      gsap.killTweensOf(mesh.position);
      gsap.killTweensOf(mesh.rotation);

      gsap.to(material.uniforms.u_hover, {
        value: 0.0,
        duration: 0.15,
        ease: 'power2.out',
      });
      gsap.to(mesh.scale, {
        x: 1.0,
        y: 1.0,
        duration: interactionDuration,
        ease: 'power2.out',
      });
      gsap.to(mesh.position, {
        x: 0.0,
        y: 0.0,
        duration: interactionDuration,
        ease: 'power2.out',
      });
      gsap.to(mesh.rotation, {
        x: 0.0,
        y: 0.0,
        duration: interactionDuration,
        ease: 'power2.out',
      });
    };

    const activateMobileEffect = (clientX: number, clientY: number) => {
      lastTouchTime = Date.now();
      if (!container || !material || !mesh) return;
      isMobileActive = true;
      const rect = container.getBoundingClientRect();
      const tapX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const tapY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      const clampedX = Math.max(-1, Math.min(1, tapX));
      const clampedY = Math.max(-1, Math.min(1, tapY));

      gsap.killTweensOf(material.uniforms.u_hover);
      gsap.killTweensOf(mesh.scale);
      gsap.killTweensOf(mesh.position);
      gsap.killTweensOf(mesh.rotation);

      gsap.to(material.uniforms.u_hover, {
        value: 1.0,
        duration: hoverDuration,
        ease: 'power2.out',
      });
      gsap.to(mesh.scale, {
        x: 1 + scaleIntensity,
        y: 1 + scaleIntensity,
        duration: interactionDuration,
        ease: 'power2.out',
      });
      gsap.to(mesh.position, {
        x: clampedX * positionIntensity * 0.7,
        duration: interactionDuration,
        ease: 'power2.out',
      });
      gsap.to(mesh.rotation, {
        x: -clampedY * (Math.PI / 3) * rotationIntensity * 0.7,
        y: clampedX * (Math.PI / 3) * rotationIntensity * 0.7,
        duration: interactionDuration,
        ease: 'power2.out',
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Disallow mouse hover emulation on touchscreens / mobile devices
      if (!window.matchMedia('(hover: hover)').matches) return;
      if (Date.now() - lastTouchTime < 2000) return;
      if (!container || !mesh || !material) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(mesh);
      const isHovered = intersects.length > 0;

      gsap.to(material.uniforms.u_hover, {
        value: isHovered ? 1.0 : 0.0,
        duration: hoverDuration,
        ease: 'power2.out',
      });

      gsap.to(mesh.scale, {
        x: isHovered ? 1 - mouse.y * scaleIntensity : 1.0,
        y: isHovered ? 1 - mouse.y * scaleIntensity : 1.0,
        duration: interactionDuration,
        ease: 'power2.out',
      });

      gsap.to(mesh.position, {
        x: isHovered ? mouse.x * positionIntensity : 0.0,
        duration: interactionDuration,
        ease: 'power2.out',
      });

      gsap.to(mesh.rotation, {
        x: isHovered ? -mouse.y * (Math.PI / 3) * rotationIntensity : 0.0,
        y: isHovered ? mouse.x * (Math.PI / 3) * rotationIntensity : 0.0,
        duration: interactionDuration,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      if (!material || !mesh || isMobileActive) return;
      resetToNeutral();
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchTime = Date.now();
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      lastTouchTime = Date.now();
      if (!material || !mesh) return;
      if (e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      const dist = Math.hypot(dx, dy);

      // If dragged more than 12px, user was scrolling the page - ignore!
      if (dist > 12) return;

      if (isMobileActive) {
        resetToNeutral();
      } else {
        activateMobileEffect(touch.clientX, touch.clientY);
      }
    };

    const handleDocumentTouch = (e: TouchEvent) => {
      if (!isMobileActive || !container) return;
      if (e.target && container.contains(e.target as Node)) return;
      resetToNeutral();
    };

    const handleWindowScroll = () => {
      lastTouchTime = Date.now();
      if (isMobileActive) {
        resetToNeutral();
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    document.addEventListener('touchstart', handleDocumentTouch, { passive: true });
    window.addEventListener('resize', updateSize);

    let isIntersecting = true;
    const render = () => {
      if (!isIntersecting) {
        animationFrameId = 0;
        return;
      }
      renderer?.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && !animationFrameId) {
          render();
        } else if (!isIntersecting && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      },
      { rootMargin: '100px' }
    );
    visibilityObserver.observe(container);

    render();

    return () => {
      visibilityObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleWindowScroll);
      document.removeEventListener('touchstart', handleDocumentTouch);
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();

      gsap.killTweensOf(material.uniforms.u_hover);
      gsap.killTweensOf(mesh.scale);
      gsap.killTweensOf(mesh.position);
      gsap.killTweensOf(mesh.rotation);

      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer?.dispose();
    };
  }, [
    imageSrc,
    imageAspectRatio,
    cardWidth,
    cardHeight,
    zoomLevel,
    rgbShiftAmount,
    pixelDisplaceAmount,
    hoverDuration,
    rotationIntensity,
    scaleIntensity,
    positionIntensity,
    interactionDuration,
    opacity,
    cameraFov,
    cameraZ,
    borderRadius,
  ]);

  // Programmatic glitch trigger on intro completion
  useEffect(() => {
    if (triggerGlitch && materialRef.current) {
      gsap.killTweensOf(materialRef.current.uniforms.u_hover);
      gsap.fromTo(
        materialRef.current.uniforms.u_hover,
        { value: 0.0 },
        {
          value: 1.0,
          duration: 0.95,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        }
      );
    }
  }, [triggerGlitch]);

  const resolvedWidth = typeof width === 'number' ? `${width}px` : width;
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-visible cursor-pointer select-none touch-pan-y', className)}
      style={{
        width: resolvedWidth === 'auto' ? undefined : resolvedWidth,
        height: resolvedHeight === 'auto' ? undefined : resolvedHeight,
        touchAction: 'pan-y',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
      {children && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

ChromaCard.displayName = 'ChromaCard';

export default ChromaCard;
