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
uniform float u_imageOffsetY;
uniform float u_rgbShift;
uniform float u_pixelDisplace;
uniform vec2 u_resolution;
varying vec2 vUv;

float exponentialInOut(float t) {
  return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
      ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

void main() {
  vec2 uv = vUv;

  float u = u_imageAspectRatio / u_aspectRatio;
  if(u_imageAspectRatio > u_aspectRatio) {
    u = 1. / u;
  }

  uv.y *= u;
  uv.y -= (u) / 2. - .5;

  // Smooth hover transition
  float hoverLevel = exponentialInOut(min(1., (distance(vec2(.5), uv) * u_hover) + u_hover));
  
  // Safe zoom that stays firmly within viewport
  uv *= 1. - u_zoomLevel * hoverLevel;
  uv += (u_zoomLevel * 0.5) * hoverLevel;
  uv.y -= u_imageOffsetY;

  // Edge dampening mask: ensures displacement smoothly falls to 0 at the card perimeter
  // This completely eliminates corner pinching, pixel folding, and texture tearing
  float edgeMask = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x) *
                   smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);

  uv = clamp(uv, 0.001, 0.999);
  vec4 color = texture2D(u_texture, uv);

  if(hoverLevel > 0.) {
    float peak = (1. - abs(hoverLevel - .5) * 2.) * edgeMask;
    vec2 displaceUv = clamp(vec2(uv.x, uv.y + color.r * peak * u_pixelDisplace), 0.001, 0.999);
    color = texture2D(u_texture, displaceUv);
    
    vec2 rUv = clamp(displaceUv + (peak * u_rgbShift), 0.001, 0.999);
    vec2 gUv = clamp(displaceUv - (peak * u_rgbShift), 0.001, 0.999);
    color.r = texture2D(u_texture, rUv).r;
    color.g = texture2D(u_texture, gUv).g;
  }

  gl_FragColor = vec4(color.rgb, color.a * u_opacity);
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
  imageOffsetY?: number;
}

export const ChromaCard: React.FC<ChromaCardProps> = ({
  width = 460,
  height = 540,
  className = '',
  children,
  imageSrc = 'assets/images/profile.jpg',
  imageAspectRatio = 0.75,
  cardWidth = 6.8,
  cardHeight = 8.4,
  zoomLevel = 0.22,
  rgbShiftAmount = 0.016,
  pixelDisplaceAmount = 0.035,
  hoverDuration = 1.6,
  rotationIntensity = 0.15,
  scaleIntensity = 0.05,
  positionIntensity = 0.22,
  interactionDuration = 0.4,
  opacity = 1,
  cameraFov = 50,
  cameraZ = 7,
  borderRadius = 24,
  imageOffsetY = 0.8,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
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

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = imageOffsetY;
    scene.add(mesh);

    const updateSize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 400;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.u_resolution.value.set(w, h);
    };

    updateSize();

    const handleMouseMove = (e: MouseEvent) => {
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
        x: 1 - mouse.y * scaleIntensity,
        y: 1 - mouse.y * scaleIntensity,
        duration: interactionDuration,
        ease: 'power2.out',
      });

      gsap.to(mesh.position, {
        x: mouse.x * positionIntensity,
        y: imageOffsetY,
        duration: interactionDuration,
        ease: 'power2.out',
      });

      gsap.to(mesh.rotation, {
        x: -mouse.y * (Math.PI / 3) * rotationIntensity,
        y: mouse.x * (Math.PI / 3) * rotationIntensity,
        duration: interactionDuration,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      if (!material || !mesh) return;
      gsap.to(material.uniforms.u_hover, {
        value: 0.0,
        duration: hoverDuration,
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
        y: imageOffsetY,
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

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', updateSize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(container);
    }

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const render = () => {
      if (isVisible) {
        renderer?.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver?.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateSize);

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
    imageOffsetY,
    cameraFov,
    cameraZ,
    borderRadius,
  ]);

  const resolvedWidth = typeof width === 'number' ? `${width}px` : width;
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden cursor-pointer select-none max-w-full',
        'isolate [transform:translateZ(0)] [-webkit-mask-image:-webkit-radial-gradient(white,black)]',
        className
      )}
      style={{
        width: resolvedWidth,
        maxWidth: '100%',
        height: resolvedHeight,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none [transform:translateZ(0)]" />
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
