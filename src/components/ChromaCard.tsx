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

float smootherstep(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
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

  float zoomProgress = smootherstep(u_hover);
  uv *= 1. - u_zoomLevel * zoomProgress;
  uv += u_zoomLevel / 2. * zoomProgress;
  uv = clamp(uv, 0., 1.);
  vec4 color = texture2D(u_texture, uv);

  float glitchWave = smootherstep(min(1., (distance(vec2(.5), uv) * u_hover) + u_hover));
  if(glitchWave > 0. && glitchWave < 1.) {
    float wave = 1. - abs(glitchWave - .5) * 2.;
    uv.y += color.r * wave * u_pixelDisplace;
    color = texture2D(u_texture, uv);
    color.r = texture2D(u_texture, uv + wave * u_rgbShift).r;
    color.g = texture2D(u_texture, uv - wave * u_rgbShift).g;
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
  overflowBleed?: number;
  zoomLevel?: number;
  rgbShiftAmount?: number;
  pixelDisplaceAmount?: number;
  hoverDuration?: number;
  zoomInDuration?: number;
  zoomOutDuration?: number;
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
  overflowBleed = 90,
  zoomLevel = 0.30,
  rgbShiftAmount = 0.020,
  pixelDisplaceAmount = 0.095,
  hoverDuration = 3.0,
  zoomInDuration = 0.75,
  zoomOutDuration = 0.85,
  rotationIntensity = 0.20,
  scaleIntensity = 0.10,
  positionIntensity = 0.5,
  interactionDuration = 0.4,
  opacity = 1.00,
  cameraFov = 60,
  cameraZ = 7.0,
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
      if (!container || !renderer || !canvas) return;
      const baseW = container.clientWidth || 380;
      const baseH = container.clientHeight || 480;
      const w = Math.round(baseW + overflowBleed * 2);
      const h = Math.round(baseH + overflowBleed * 2);

      renderer.setSize(w, h, false);
      camera.aspect = w / h;

      const scaleFactor = h / baseH;
      camera.position.z = cameraZ * scaleFactor;
      camera.updateProjectionMatrix();

      uniforms.u_resolution.value.set(baseW, baseH);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    const updateTiltAndZoom = (clientX: number, clientY: number) => {
      if (!container || !mesh || !material) return;
      const rect = container.getBoundingClientRect();

      const isWithinBounds =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      mouse.x = Math.max(-1.1, Math.min(1.1, ((clientX - rect.left) / rect.width) * 2 - 1));
      mouse.y = Math.max(-1.1, Math.min(1.1, -(((clientY - rect.top) / rect.height) * 2 - 1)));

      const canvas = canvasRef.current;
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasMouse = new THREE.Vector2(
          ((clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
          -(((clientY - canvasRect.top) / canvasRect.height) * 2 - 1)
        );
        raycaster.setFromCamera(canvasMouse, camera);
      } else {
        raycaster.setFromCamera(mouse, camera);
      }

      const intersects = raycaster.intersectObject(mesh);
      const isHovered = isWithinBounds || intersects.length > 0;

      if (isHovered) {
        gsap.to(material.uniforms.u_hover, {
          value: 1.0,
          duration: zoomInDuration,
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
          duration: interactionDuration,
          ease: 'power2.out',
        });

        gsap.to(mesh.rotation, {
          x: -mouse.y * (Math.PI / 3) * rotationIntensity,
          y: mouse.x * (Math.PI / 3) * rotationIntensity,
          duration: interactionDuration,
          ease: 'power2.out',
        });
      } else {
        resetTiltAndZoom();
      }
    };

    const resetTiltAndZoom = () => {
      if (!material || !mesh) return;
      gsap.to(material.uniforms.u_hover, {
        value: 0.0,
        duration: zoomOutDuration,
        ease: 'power2.out',
      });

      gsap.to(mesh.scale, {
        x: 1.0,
        y: 1.0,
        duration: zoomOutDuration,
        ease: 'power2.out',
      });

      gsap.to(mesh.position, {
        x: 0.0,
        y: 0.0,
        duration: zoomOutDuration,
        ease: 'power2.out',
      });

      gsap.to(mesh.rotation, {
        x: 0.0,
        y: 0.0,
        duration: zoomOutDuration,
        ease: 'power2.out',
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateTiltAndZoom(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      resetTiltAndZoom();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      updateTiltAndZoom(t.clientX, t.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      updateTiltAndZoom(t.clientX, t.clientY);
    };

    const handleTouchEnd = () => {
      resetTiltAndZoom();
    };

    const handleClick = () => {
      if (!material) return;
      gsap.killTweensOf(material.uniforms.u_hover);
      gsap.fromTo(
        material.uniforms.u_hover,
        { value: 0.0 },
        {
          value: 1.0,
          duration: 0.6,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        }
      );
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    container.addEventListener('click', handleClick);
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
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      container.removeEventListener('click', handleClick);
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
    overflowBleed,
    zoomLevel,
    rgbShiftAmount,
    pixelDisplaceAmount,
    hoverDuration,
    zoomInDuration,
    zoomOutDuration,
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
          duration: 0.65,
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
      data-cursor-ignore
      className={cn('relative overflow-visible cursor-pointer select-none', className)}
      style={{
        width: resolvedWidth === 'auto' ? undefined : resolvedWidth,
        height: resolvedHeight === 'auto' ? undefined : resolvedHeight,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute"
        style={{
          top: -overflowBleed,
          left: -overflowBleed,
          width: `calc(100% + ${overflowBleed * 2}px)`,
          height: `calc(100% + ${overflowBleed * 2}px)`,
        }}
      />
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
