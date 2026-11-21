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
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying vec2 vUv;

float exponentialInOut(float t) {
  return t <= 0.0 ? 0.0
    : t >= 1.0 ? 1.0
    : t < 0.5
      ? 0.5 * pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

void main() {
  vec2 uv = vUv;

  // Aspect ratio preservation (object-fit: cover)
  float u = u_imageAspectRatio / u_aspectRatio;
  if (u_imageAspectRatio > u_aspectRatio) {
    u = 1.0 / u;
    uv.x *= u;
    uv.x -= (u - 1.0) * 0.5;
  } else {
    uv.y *= u;
    uv.y -= (u - 1.0) * 0.5;
  }

  // Smooth hover transition factor
  float h = exponentialInOut(clamp(u_hover, 0.0, 1.0));

  // Fluid subtle zoom on hover centered on card
  vec2 center = vec2(0.5);
  uv = center + (uv - center) * (1.0 - u_zoomLevel * h);

  // Dampen effects near perimeter to prevent pixel folding or corner tearing
  float edgeDamp = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x) *
                   smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);

  // Base texture sample for luminance calculation
  vec4 baseSample = texture2D(u_texture, clamp(uv, 0.001, 0.999));
  float luma = dot(baseSample.rgb, vec3(0.299, 0.587, 0.114));

  // Directional mouse vector for chromatic refraction
  vec2 mouseDir = u_mouse;
  float mouseLen = length(mouseDir);
  vec2 dir = mouseLen > 0.02 ? (mouseDir / mouseLen) : vec2(0.707, 0.707);

  // Active chromatic RGB shift and liquid pixel displacement
  float activeShift = u_rgbShift * h * edgeDamp;
  float activeDisplace = u_pixelDisplace * h * edgeDamp * (0.5 + 0.5 * luma);

  vec2 displaceOffset = vec2(-dir.y, dir.x) * activeDisplace;
  vec2 centerUv = clamp(uv + displaceOffset, 0.001, 0.999);

  // RGB chromatic split
  vec2 rUv = clamp(centerUv + dir * activeShift, 0.001, 0.999);
  vec2 gUv = centerUv;
  vec2 bUv = clamp(centerUv - dir * activeShift, 0.001, 0.999);

  float r = texture2D(u_texture, rUv).r;
  float g = texture2D(u_texture, gUv).g;
  float b = texture2D(u_texture, bUv).b;

  vec3 col = vec3(r, g, b);

  // Interactive holographic sheen moving with cursor
  vec2 mouseUv = u_mouse * 0.5 + 0.5;
  float distToMouse = distance(uv, mouseUv);
  float sheen = pow(max(0.0, 1.0 - distToMouse * 1.3), 2.2) * h * 0.22;
  col += vec3(sheen * 0.25, sheen * 0.8, sheen * 1.0);

  gl_FragColor = vec4(col, u_opacity);
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
  width = '100%',
  height = '100%',
  className = '',
  children,
  imageSrc = 'assets/images/profile.jpg',
  imageAspectRatio = 0.7326,
  cardWidth = 5.2,
  cardHeight = 7.1,
  zoomLevel = 0.3,
  rgbShiftAmount = 0.02,
  pixelDisplaceAmount = 0.095,
  hoverDuration = 3,
  rotationIntensity = 0.2,
  scaleIntensity = 0.1,
  positionIntensity = 0.5,
  interactionDuration = 0.4,
  opacity = 1,
  cameraFov = 50,
  cameraZ = 7,
  borderRadius = 30,
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const widthPx = container.clientWidth || 300;
    const heightPx = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(cameraFov, widthPx / heightPx, 0.1, 100);
    camera.position.set(0, 0, cameraZ);

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
      u_mouse: { value: new THREE.Vector2(0, 0) },
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
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      material.uniforms.u_mouse.value.set(normX, normY);

      gsap.to(material.uniforms.u_hover, {
        value: 1.0,
        duration: 0.35,
        ease: 'power2.out',
      });

      gsap.to(mesh.scale, {
        x: 1.0 + scaleIntensity,
        y: 1.0 + scaleIntensity,
        duration: interactionDuration,
        ease: 'power2.out',
      });

      gsap.to(mesh.position, {
        x: normX * positionIntensity,
        y: normY * (positionIntensity * 0.7),
        duration: interactionDuration,
        ease: 'power2.out',
      });

      gsap.to(mesh.rotation, {
        x: -normY * (Math.PI / 7) * rotationIntensity,
        y: normX * (Math.PI / 7) * rotationIntensity,
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
        duration: interactionDuration * 1.6,
        ease: 'power2.out',
      });

      gsap.to(mesh.position, {
        x: 0.0,
        y: 0.0,
        duration: interactionDuration * 1.6,
        ease: 'power2.out',
      });

      gsap.to(mesh.rotation, {
        x: 0.0,
        y: 0.0,
        duration: interactionDuration * 1.6,
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
      materialRef.current = null;
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

  // Temporary Chromatic Aberration Glitch Entry Transition (fires once and settles)
  useEffect(() => {
    if (triggerGlitch && materialRef.current) {
      gsap.timeline()
        .to(materialRef.current.uniforms.u_hover, { value: 1.15, duration: 0.16, ease: 'power2.in' })
        .to(materialRef.current.uniforms.u_hover, { value: 0.0, duration: 0.6, ease: 'power3.out' });
    }
  }, [triggerGlitch]);

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
        height: resolvedHeight === 'auto' ? 'auto' : resolvedHeight,
        aspectRatio: '370 / 505',
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
