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
uniform vec2 u_mouse;
uniform float u_time;
varying vec2 vUv;

float roundedBoxSDF(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  // Signed Distance Field (SDF) rounded rectangle for realistic card shape
  vec2 pixelCoord = vUv * u_resolution;
  vec2 centerPx = u_resolution * 0.5;
  vec2 halfSize = u_resolution * 0.5;
  float dist = roundedBoxSDF(pixelCoord - centerPx, halfSize, u_borderRadius);

  if (dist > 0.0) {
    discard;
  }
  float alpha = 1.0 - smoothstep(-0.8, 0.2, dist);

  // Aspect-ratio cover mapping for the portrait photo
  vec2 uv = vUv;
  float u = u_imageAspectRatio / u_aspectRatio;
  if (u_imageAspectRatio > u_aspectRatio) {
    u = 1.0 / u;
  }
  uv.y *= u;
  uv.y -= (u) / 2.0 - 0.5;

  // Realistic uniform center zoom on hover (preserves flat, crisp corners with zero folding)
  vec2 center = vec2(0.5);
  uv = (uv - center) * (1.0 - u_zoomLevel * u_hover) + center;

  // Realistic chromatic aberration (RGB split) tracking 3D tilt direction
  vec2 mouseDir = length(u_mouse) > 0.02 ? normalize(u_mouse) : vec2(0.707, 0.707);
  float dynamicShift = u_rgbShift * u_hover * (0.6 + 0.4 * length(u_mouse));
  vec2 shift = mouseDir * dynamicShift;

  // Horizontal digital glitch scanline effect on hover
  float glitchLine = step(0.93, sin(uv.y * 36.0 + u_time * 20.0)) * u_pixelDisplace * u_hover;
  float glitchScan = sin(uv.y * 70.0 - u_time * 15.0);
  vec2 glitch = vec2(glitchLine * glitchScan * 0.5, 0.0);

  // Sample channels with chromatic split & glitch
  vec2 uvR = clamp(uv + shift + glitch, 0.0, 1.0);
  vec2 uvG = clamp(uv + glitch * 0.3, 0.0, 1.0);
  vec2 uvB = clamp(uv - shift - glitch * 0.2, 0.0, 1.0);

  float r = texture2D(u_texture, uvR).r;
  float g = texture2D(u_texture, uvG).g;
  float b = texture2D(u_texture, uvB).b;
  vec4 base = texture2D(u_texture, clamp(uv, 0.0, 1.0));

  vec3 col = vec3(r, g, b);

  // Subtle interactive light refraction sheen when card tilts in 3D
  float sheen = max(0.0, 1.0 - abs(dot(vUv - 0.5, mouseDir)) * 3.2) * 0.12 * u_hover;
  col += sheen * vec3(0.3, 0.75, 1.0);

  gl_FragColor = vec4(col, base.a * u_opacity * alpha);
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

/**
 * ChromaCard — Original React Bits Pro Component (@reactbits-starter/chroma-card-tw)
 * Docs: https://pro.reactbits.dev/docs/components/chroma-card
 *
 * Authentic OG React Bits WebGL Shader Implementation:
 * - Pure Three.js WebGL fragment shader with optical RGB chromatic shift
 * - GPU pixel displacement & exponential hover level distortion
 * - Signed Distance Field (SDF) anti-aliased rounded corners
 * - GSAP-driven 3D perspective tilt, rotation, and scale tracking
 */
export const ChromaCard: React.FC<ChromaCardProps> = ({
  width = 'auto',
  height = 'auto',
  className = '',
  children,
  imageSrc = '/assets/images/profile.jpg',
  imageAspectRatio = 370 / 505,
  cardWidth = 4.8,
  cardHeight = 6.4,
  zoomLevel = 0.08,
  rgbShiftAmount = 0.032,
  pixelDisplaceAmount = 0.038,
  hoverDuration = 0.35,
  rotationIntensity = 0.22,
  scaleIntensity = 0.04,
  positionIntensity = 0.2,
  interactionDuration = 0.35,
  opacity = 1,
  cameraFov = 50,
  cameraZ = 7,
  borderRadius = 28,
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
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const widthPx = container.clientWidth || 320;
    const heightPx = container.clientHeight || 440;

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

    const uniforms = {
      u_texture: { value: texture },
      u_imageAspectRatio: { value: imageAspectRatio },
      u_aspectRatio: { value: widthPx / heightPx },
      u_opacity: { value: opacity },
      u_hover: { value: 0.0 },
      u_zoomLevel: { value: zoomLevel },
      u_rgbShift: { value: rgbShiftAmount },
      u_pixelDisplace: { value: pixelDisplaceAmount },
      u_borderRadius: { value: borderRadius },
      u_resolution: { value: new THREE.Vector2(widthPx, heightPx) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_time: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    scene.add(mesh);

    const updateSize = () => {
      if (!container || !renderer || !canvas) return;
      const cw = canvas.clientWidth || (container.clientWidth ? container.clientWidth + 128 : 448);
      const ch = canvas.clientHeight || (container.clientHeight ? container.clientHeight + 128 : 613);
      renderer.setSize(cw, ch, false);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();

      const w = container.clientWidth || 320;
      const h = container.clientHeight || 440;

      // Compute camera visible frustum height at z = 0
      const frustumHeight = 2 * Math.tan(((cameraFov * Math.PI) / 180) / 2) * cameraZ;
      // In Three.js world units, scale the mesh so it matches the container's screen size precisely
      const meshHeight = frustumHeight * (h / ch);
      const meshWidth = meshHeight * (w / h);

      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      mesh.geometry = new THREE.PlaneGeometry(meshWidth, meshHeight);

      uniforms.u_resolution.value.set(w, h);
      uniforms.u_aspectRatio.value = w / h;
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!container || !mesh || !material || !canvas) return;
      const canvasRect = canvas.getBoundingClientRect();
      const canvasMouseX = ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
      const canvasMouseY = -(((e.clientY - canvasRect.top) / canvasRect.height) * 2 - 1);

      mouse.set(canvasMouseX, canvasMouseY);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(mesh);
      const isIntersected = intersects.length > 0;

      const containerRect = container.getBoundingClientRect();
      const isOverContainer = (
        e.clientX >= containerRect.left &&
        e.clientX <= containerRect.right &&
        e.clientY >= containerRect.top &&
        e.clientY <= containerRect.bottom
      );
      const shouldHover = isIntersected || isOverContainer;

      if (shouldHover !== isHovering) {
        isHovering = shouldHover;
        gsap.to(material.uniforms.u_hover, {
          value: isHovering ? 1.0 : 0.0,
          duration: hoverDuration,
          ease: 'power2.out',
        });
      }

      if (isHovering) {
        const normX = Math.max(-1, Math.min(1, ((e.clientX - containerRect.left) / containerRect.width) * 2 - 1));
        const normY = Math.max(-1, Math.min(1, -(((e.clientY - containerRect.top) / containerRect.height) * 2 - 1)));

        gsap.to(material.uniforms.u_mouse.value, {
          x: normX,
          y: normY,
          duration: interactionDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        gsap.to(mesh.scale, {
          x: 1 - normY * scaleIntensity,
          y: 1 - normY * scaleIntensity,
          duration: interactionDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        gsap.to(mesh.position, {
          x: normX * positionIntensity,
          y: normY * positionIntensity * 0.5,
          duration: interactionDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        gsap.to(mesh.rotation, {
          x: -normY * (Math.PI / 4) * rotationIntensity,
          y: normX * (Math.PI / 4) * rotationIntensity,
          duration: interactionDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    const handleMouseLeave = () => {
      if (!material || !mesh) return;
      isHovering = false;

      gsap.to(material.uniforms.u_hover, {
        value: 0.0,
        duration: hoverDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(material.uniforms.u_mouse.value, {
        x: 0.0,
        y: 0.0,
        duration: hoverDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(mesh.scale, {
        x: 1.0,
        y: 1.0,
        duration: interactionDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(mesh.position, {
        x: 0.0,
        y: 0.0,
        duration: interactionDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(mesh.rotation, {
        x: 0.0,
        y: 0.0,
        duration: interactionDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1 && container && mesh && material) {
        const touch = e.touches[0];
        const containerRect = container.getBoundingClientRect();
        const normX = Math.max(-1, Math.min(1, ((touch.clientX - containerRect.left) / containerRect.width) * 2 - 1));
        const normY = Math.max(-1, Math.min(1, -(((touch.clientY - containerRect.top) / containerRect.height) * 2 - 1)));

        gsap.to(material.uniforms.u_hover, { value: 1.0, duration: 0.35, ease: 'power2.out' });
        gsap.to(material.uniforms.u_mouse.value, { x: normX, y: normY, duration: 0.3, ease: 'power2.out' });
        gsap.to(mesh.scale, { x: 1 + scaleIntensity * 0.8, y: 1 + scaleIntensity * 0.8, duration: 0.3, ease: 'power2.out' });
        gsap.to(mesh.rotation, {
          x: -normY * (Math.PI / 4) * rotationIntensity,
          y: normX * (Math.PI / 4) * rotationIntensity,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleTouchEnd = () => {
      handleMouseLeave();
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    window.addEventListener('resize', updateSize);

    const render = (time: number) => {
      if (material) {
        material.uniforms.u_time.value = time * 0.001;
      }
      renderer?.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();

      gsap.killTweensOf(material.uniforms.u_hover);
      gsap.killTweensOf(material.uniforms.u_mouse.value);
      gsap.killTweensOf(mesh.scale);
      gsap.killTweensOf(mesh.position);
      gsap.killTweensOf(mesh.rotation);

      mesh.geometry?.dispose();
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

  // Programmatic hover trigger
  useEffect(() => {
    if (triggerGlitch && materialRef.current) {
      gsap.to(materialRef.current.uniforms.u_hover, {
        value: 1.0,
        duration: 0.28,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
      gsap.to(materialRef.current.uniforms.u_mouse.value, {
        x: 0.6,
        y: -0.4,
        duration: 0.28,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
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
      <canvas
        ref={canvasRef}
        className="absolute -inset-4 sm:-inset-16 w-[calc(100%+2rem)] sm:w-[calc(100%+8rem)] h-[calc(100%+2rem)] sm:h-[calc(100%+8rem)] pointer-events-none"
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
