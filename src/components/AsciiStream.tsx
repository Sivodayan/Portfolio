// @ts-nocheck
import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle, useSyncExternalStore } from 'react';
import * as THREE from 'three';

export interface AsciiStreamProps {
  colors?: [string, string];
  backgroundColor?: string;
  shape?: 'funnel' | 'fan';
  characters?: string;
  text?: string;
  scramble?: number;
  shuffle?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  size?: number;
  spacing?: number;
  angle?: number;
  originX?: number;
  originY?: number;
  spread?: number;
  curve?: number;
  skew?: number;
  streams?: number;
  rows?: number;
  lines?: number;
  speed?: number;
  variance?: number;
  glyphs?: number;
  pulse?: number;
  pulseSpeed?: number;
  sheen?: number;
  beam?: number;
  flare?: number;
  glow?: number;
  grain?: number;
  intensity?: number;
  fade?: number;
  burstEvery?: number;
  intro?: boolean;
  interactive?: boolean;
  ignite?: number;
  burst?: number;
  seed?: number;
  paused?: boolean;
  quality?: number;
  reduced?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface AsciiStreamHandle {
  burst: (strength?: number) => void;
}

const s: any = {
  ...THREE,
  BKk: THREE.ShaderMaterial,
  GOR: THREE.CanvasTexture,
  GWd: THREE.RGBAFormat,
  GYF: THREE.DataTexture,
  I9Y: THREE.Vector2,
  IUQ: THREE.Vector4,
  OUM: THREE.UnsignedByteType,
  Pq0: THREE.Vector3,
  VT0: THREE.RedFormat,
  Wdf: THREE.GLSL3,
  XIg: THREE.NoBlending,
  Z58: THREE.Scene,
  bdM: THREE.PlaneGeometry,
  eaF: THREE.Mesh,
  hxR: THREE.NearestFilter,
  ix0: THREE.HalfFloatType,
  jf0: THREE.NoColorSpace,
  k6q: THREE.LinearFilter,
  nWS: THREE.WebGLRenderTarget,
  qUd: THREE.OrthographicCamera,
  $_I: THREE.LinearMipmapLinearFilter,
};

const u: any = THREE;
const c = { cn: (...classes: any[]) => classes.filter(Boolean).join(' ') };
const l: any = React;
const n = {
  jsx: (type: any, props: any) => {
    const { children, ...rest } = props || {};
    return React.createElement(type, rest, children);
  },
  jsxs: (type: any, props: any) => {
    const { children, ...rest } = props || {};
    return React.createElement(type, rest, ...(Array.isArray(children) ? children : [children]));
  }
};

let m=["#5227FF","#FF9FFC"],f="ABCEGKRSXZ0235689",h=Math.log(.16),d=Math.log(1.7)-h,p=2*Math.PI,v=Math.PI/180,g=(e,t,a,n,l,o,r=[],i=null,u=0,s=0,c=0,m=0)=>({side:e,at:t,level:a,thick:n,tone:l,hot:o,drift:.12,out:u,outLevel:s,outTone:l,inn:c,innLevel:m,band:i,glints:r}),x=[g(1,.56,1,1.05,.05,.1,[{at:.97,span:.3,amp:1.6,pace:1}],[.6,.78],.3,.36,.16,.5),g(-1,.7,1,1.05,.3,1,[{at:.93,span:.26,amp:1.25,pace:.9}],[.57,.81],.2,.3,.24,.36),g(-1,.3,.8,1.4,0,.05,[{at:.4,span:.32,amp:1,pace:.6}],[.33,.46],.16,.5,.08,.3),g(1,.83,.8,1,.45,1,[{at:.6,span:.24,amp:1.2,pace:1.15}],[.79,.94],.1,.24,.12,.24),g(1,.27,.7,1.4,0,.05,[{at:.55,span:.34,amp:.9,pace:.65}],[.3,.41],.14,.4,.1,.44),g(-1,.97,.75,1,.5,1,[{at:.66,span:.24,amp:1.15,pace:1.1}],[.9,1.06],.1,.2,.12,.2),g(1,1.24,.6,1,.35,.8,[{at:.45,span:.24,amp:.9,pace:1.25}],[1.16,1.32],.08,.18,.08,.18),g(-1,1.3,.55,1,.4,.9,[{at:.5,span:.24,amp:.85,pace:1.2}],[1.22,1.38],.08,.18,.08,.18)],w=[g(1,1,.7,.85,.05,.1,[{at:.72,span:.26,amp:.95,pace:1.3}]),g(-1,.15,.5,.9,.75,1,[{at:.9,span:.5,amp:.5,pace:.7}],null,.05,.16),g(1,.15,.3,.8,.4,.6,[{at:1.05,span:.5,amp:.3,pace:.6}]),g(-1,1.12,.22,.8,.4,.5,[],null,.12,.12),g(1,.68,.2,.75,.35,.5),g(-1,.5,.18,.75,.3,.5,[],null,0,0,.1,.1),g(1,.44,.16,.75,.2,.4),g(-1,1.23,.18,.75,.4,.5,[],null,.1,.1),g(1,.94,.15,.7,.4,.5),g(-1,.86,.17,.7,.45,.5),g(-1,1.42,.16,.75,.4,.5,[],null,.12,.1),g(1,1.12,.13,.7,.3,.4),g(-1,.21,.16,.75,.2,.4),g(-1,1.6,.12,.7,.4,.5),g(1,1.36,.1,.7,.35,.4),g(1,.38,.14,.75,.15,.3)],b=`
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,y=`
precision highp float;
precision highp int;

uniform vec2 uResolution;
uniform vec2 uOrigin;
uniform vec2 uAxis;
uniform float uLength;
uniform float uBack;
uniform float uPixel;
uniform float uUnit;
uniform float uThick;
uniform float uFunnel;
uniform vec2 uKappa;
uniform vec2 uWide;
uniform int uLineCount;
uniform vec4 uLineA[24];
uniform vec4 uLineB[24];
uniform vec4 uLineC[24];
uniform vec4 uGlintA[24];
uniform vec4 uGlintB[24];
uniform int uBandCount;
uniform vec4 uBandA[8];
uniform vec4 uBandB[8];
uniform float uRow;
uniform float uAspect;
uniform sampler2D uAtlas;
uniform vec4 uGrid;
uniform sampler2D uText;
uniform float uTextLength;
uniform float uScramble;
uniform float uShuffle;
uniform float uTime;
uniform float uFlow;
uniform float uVariance;
uniform float uGlyphs;
uniform float uPulse;
uniform float uSheen;
uniform float uBeam;
uniform float uFlare;
uniform float uFade;
uniform float uSeed;
uniform float uIntro;
uniform float uWhite;
uniform float uFlip;
uniform vec3 uLabA;
uniform vec3 uLabB;
uniform vec3 uHot;
uniform vec3 uAzure;
uniform vec3 uWarm;
uniform vec3 uCream;
uniform vec3 uBursts[4];

out vec4 fragColor;

uint pcg(uint v) {
  uint state = v * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

float rnd(float a, float b) {
  uint h = pcg(pcg(uint(int(a))) + uint(int(b)) * 2654435761u + uint(int(uSeed)));
  return float(h >> 8) * (1.0 / 16777216.0);
}

vec3 fromLab(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return max(
    vec3(
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    ),
    0.0
  );
}

vec3 ramp(float t) {
  return fromLab(mix(uLabA, uLabB, clamp(t, 0.0, 1.0)));
}

float letter(float along, float up, float read, float rid, float pitch, out float tone) {
  tone = 0.0;
  float k = floor(along);
  float fx = along - k;
  if (read < 0.0) {
    fx = 1.0 - fx;
    k = -k - 1.0;
    up = 1.0 - up;
  }
  vec2 cell = vec2((fx - 0.5) * uAspect / 0.69 + 0.5, (up - 0.5) / 1.15 + 0.5);
  if (cell.x <= 0.0 || cell.x >= 1.0 || cell.y <= 0.0 || cell.y >= 1.0) return 0.0;
  float n = rnd(rid + 31.0, k);
  float tick = floor(uTime * uShuffle + n * 9.0);
  float index = floor(rnd(rid + 61.0, k + tick * 131.0) * uGrid.z);
  if (uTextLength > 0.5 && rnd(rid + 53.0, k + tick * 17.0) >= uScramble) {
    float at = mod(k + floor(rnd(rid, 12.0) * 64.0), uTextLength + 3.0);
    if (at >= uTextLength) return 0.0;
    index = floor(texelFetch(uText, ivec2(int(at), 0), 0).r * 255.0 + 0.5);
    if (index > 254.5) return 0.0;
  }
  tone = n * n;
  vec2 slot = vec2(mod(index, uGrid.x), floor(index / uGrid.x));
  vec2 uv = vec2((slot.x + cell.x) / uGrid.x, 1.0 - (slot.y + 1.0 - cell.y) / uGrid.y);
  float lod = max(log2(uGrid.w / (1.15 * pitch)) - 0.35, 0.0);
  return 0.9 * textureLod(uAtlas, uv, lod).r + 0.7 * textureLod(uAtlas, uv, lod + 2.3).r;
}

float glint(vec4 a, vec4 b, float lt, float wide, float way) {
  float sum = uPulse * (a.z * exp(-pow((lt - a.x) / (a.y * wide), 2.0)) + b.z * exp(-pow((lt - b.x) / (b.y * wide), 2.0)));
  if (b.w * way > 0.0) sum += abs(b.w) * exp(-pow((lt - a.w) / (0.26 * wide), 2.0));
  return sum;
}

void main() {
  vec2 p = gl_FragCoord.xy - uOrigin;
  vec2 q = vec2(dot(p, uAxis), dot(p, vec2(-uAxis.y, uAxis.x)));
  float Ts = q.x / uLength;
  float T = uFunnel > 0.5 ? abs(Ts) : Ts;
  float inbound = uFunnel > 0.5 && Ts < 0.0 ? 1.0 : 0.0;
  float way = inbound > 0.5 ? -1.0 : 1.0;
  float d0 = abs(q.y);
  float sideways = q.y >= 0.0 ? 1.0 : -1.0;
  float boost = 0.0;
  for (int i = 0; i < 4; i++) {
    float gap = Ts - uBursts[i].x;
    boost += uBursts[i].y * (gap > 0.0 ? exp(-pow(gap / 0.035, 2.0)) : exp(gap / uBursts[i].z));
  }
  vec3 light = vec3(0.0);
  float ink = 0.0;
  if (T > 0.012) {
    float kappa = sideways > 0.0 ? uKappa.x : uKappa.y;
    float Y = d0 / uLength;
    float z = Y;
    if (kappa > 1e-4) {
      float A = Y / (2.0 * kappa);
      float D = sqrt(A * A + 1.0 / (27.0 * kappa * kappa * kappa));
      float c1 = pow(A + D, 1.0 / 3.0);
      float c2 = pow(max(D - A, 0.0), 1.0 / 3.0);
      z = 2.0 * A / (c1 * c1 + c1 * c2 + c2 * c2);
    }
    float w = z / T;
    float m = 1.0 + 3.0 * kappa * z * z;
    float slope = w * m;
    float c = inversesqrt(1.0 + slope * slope);
    float J = uLength * T * m * c;
    float lt = log(T);
    float emerge = smoothstep(0.03, 0.26, T);
    float inside = 1.0 - smoothstep(0.75, 1.5, w / (sideways > 0.0 ? uWide.x : uWide.y));
    light += ramp(0.45 + 0.3 * T) * (uSheen * 0.05 * T * T * inside * (0.7 + 0.3 * sin(w / (sideways > 0.0 ? uWide.x : uWide.y) * 9.0 + 1.3)));
    for (int i = 0; i < 24; i++) {
      if (i >= uLineCount) break;
      vec4 A = uLineA[i];
      if (A.x * sideways <= 0.0) continue;
      vec4 B = uLineB[i];
      float dw = w - abs(A.x);
      float d = dw * J;
      if (abs(d) > 46.0 * uPixel && (dw > B.x || -dw > B.z)) continue;
      vec4 C = uLineC[i];
      float g = glint(uGlintA[i], uGlintB[i], lt, 1.0, way);
      float far = smoothstep(0.1, 0.75, T);
      float tone = A.w * far + C.x * T;
      float rise = smoothstep(0.03, 0.26 + 0.3 * (1.0 - A.y), T);
      float sig = uPixel * max(0.62, A.z * uThick * (0.45 + 0.6 * T) * (1.0 + 0.45 * min(g, 1.7)));
      float core = exp(-d * d / (sig * sig));
      float halo = exp(-d * d / (sig * sig * 36.0));
      float flick = 0.74 + 0.26 * sin(lt * 5.0 + C.z - uTime * 0.45);
      float amp = A.y * rise * ((0.2 + 0.8 * T) * flick + 1.7 * g);
      vec3 col = ramp(tone);
      vec3 lit = ramp(mix(tone, C.w, clamp(g, 0.0, 1.0) * far));
      light += mix(lit, vec3(1.0), uWhite * clamp(g * 0.55 - 0.25, 0.0, 0.6) * core * core) * (amp * (1.15 * core + 0.16 * halo));
      float bloomy = uUnit * 26.0 * (0.35 + 0.65 * T) * A.z;
      light += lit * (A.y * rise * g * (0.34 * exp(-d * d / (bloomy * bloomy)) + 0.3 * exp(-abs(d) / (0.55 * bloomy))));
      ink += A.y * rise * core * (0.4 + g);
      float sheet = emerge * (0.3 + 0.7 * T) * (0.55 + 0.9 * g) * uSheen;
      if (dw > 0.0 && dw < B.x) {
        float s = 1.0 - dw / B.x;
        light += ramp(C.y * far + C.x * T) * (B.y * s * s * (0.6 + 0.4 * s) * sheet);
      }
      if (dw < 0.0 && -dw < B.z) {
        float s = 1.0 + dw / B.z;
        light += col * (B.w * s * s * (0.6 + 0.4 * s) * sheet);
      }
    }
    for (int b = 0; b < 8; b++) {
      if (b >= uBandCount) break;
      vec4 Ba = uBandA[b];
      if (Ba.x * sideways <= 0.0) continue;
      float w0 = abs(Ba.x);
      if (w < w0 || w >= Ba.y) continue;
      float dW = (Ba.y - w0) / Ba.z;
      float pitch = dW * J;
      float show = smoothstep(3.6 * uPixel, 7.5 * uPixel, pitch) * emerge * smoothstep(2.5 * uRow, 3.4 * uRow, d0);
      if (show <= 0.0) break;
      float rf = (w - w0) / dW;
      float r = min(floor(rf), Ba.z - 1.0);
      float fy = rf - r;
      float wc = w0 + (r + 0.5) * dW;
      float Tf = max(T + (w - wc) * J * slope * c / uLength, 1e-3);
      float mm = 3.0 * kappa * wc * wc;
      float sigma = ((1.0 + wc * wc) * log(Tf) - 0.5 * log(1.0 + mm * Tf * Tf) + 0.5 * wc * wc * mm * Tf * Tf) / (uAspect * dW);
      float rid = Ba.w + r;
      float pace = max(1.0 + uVariance * (rnd(rid, 11.0) * 2.0 - 1.0), 0.2);
      float along = sigma + (inbound > 0.5 ? 1.0 : -1.0) * uFlow * pace + floor(rnd(rid, 12.0) * 173.0);
      float tone;
      float cover = letter(along, sideways > 0.0 ? fy : 1.0 - fy, uFlip * (inbound > 0.5 ? -1.0 : 1.0), rid, pitch, tone);
      if (cover > 0.0) {
        vec4 Bb = uBandB[b];
        int li = int(Bb.w + 0.5);
        float g = glint(uGlintA[li], uGlintB[li], lt, 1.5, way);
        float lit = Bb.x * show * (0.3 + 0.7 * tone) * (0.16 + 0.3 * T + 0.8 * min(g, 1.2)) * (1.0 - smoothstep(Bb.y, Bb.y + 0.4, T));
        vec3 col = mix(ramp(0.05 + (0.5 + 0.4 * min(g, 1.0)) * smoothstep(0.1, 0.75, T) * Bb.z), vec3(1.0), uWhite * 0.16 * tone * tone * min(1.0, g));
        light += col * (uGlyphs * cover * lit);
        ink += uGlyphs * cover * lit * 1.3;
      }
      break;
    }
  }
  float source = uFunnel > 0.5 ? exp(-pow(T / 0.24, 2.0)) : 1.0 - smoothstep(-0.02, 0.34, Ts);
  float flare = uFlare * pow(smoothstep(0.42, 0.92, Ts), 1.15);
  float thin = uPixel * max(0.8, 1.2 * uUnit / uPixel);
  float wide = thin + uUnit * (5.0 * source * source + 9.0 * flare + 3.2 * boost);
  float core = exp(-pow(d0 / wide, 2.0));
  float heat = clamp(0.5 * source + 2.0 * flare + boost, 0.0, 1.0);
  light += mix(uHot, vec3(1.0), heat * uWhite) * (uBeam * core * (1.4 + 2.2 * source + 2.6 * flare + 3.0 * boost));
  ink += uBeam * exp(-pow(d0 / thin, 2.0)) * 0.7;
  vec3 cool = ramp(0.0);
  float tight = exp(-d0 / (uUnit * 5.0));
  light += cool * (uBeam * tight * (0.12 + 0.6 * boost));
  float aura = source * exp(-pow(d0 / (uUnit * 50.0), 2.0));
  light += mix(cool, uAzure, smoothstep(0.3, 0.95, aura)) * (uBeam * aura * 1.05);
  light += cool * (uBeam * exp(-d0 / (uUnit * 95.0)) * 0.2 * source);
  float fi = (flare + 0.6 * boost) * exp(-pow(d0 / (uUnit * (24.0 + 38.0 * min(flare, 1.4))), 3.0));
  vec3 rim = mix(uWarm, ramp(1.0), sideways < 0.0 ? 0.55 : 0.0);
  vec3 fc = mix(mix(ramp(1.0), rim, 0.35), rim, smoothstep(0.04, 0.4, fi));
  fc = mix(fc, uCream, smoothstep(0.58, 0.96, fi));
  light += fc * (uBeam * fi * (0.85 + 0.3 * fi));
  float off = d0 / uRow - 0.3;
  if (off > 0.0 && off < 3.0) {
    float r = floor(off);
    float near = uFunnel > 0.5 ? source : (1.0 - smoothstep(0.06, 0.36, Ts)) * smoothstep(uBack - 0.01, uBack + 0.09, Ts);
    float env = max(max(near, smoothstep(0.42, 0.75, Ts) * min(uFlare, 1.5)), 0.035 + boost);
    float rid = 900.0 + r + (sideways > 0.0 ? 0.0 : 7.0);
    float pace = max(1.0 + uVariance * (rnd(rid, 11.0) * 2.0 - 1.0), 0.2);
    float along = q.x / (uAspect * uRow) - uFlow * pace + floor(rnd(rid, 12.0) * 173.0);
    float tone;
    float cover = letter(along, sideways > 0.0 ? off - r : 1.0 - (off - r), uFlip, rid, uRow, tone);
    if (cover > 0.0) {
      float lit = env * (r < 0.5 ? 0.8 : (r < 1.5 ? 0.55 : 0.34 * clamp(fi * 3.0, 0.0, 1.0))) * (0.3 + 0.7 * tone);
      vec3 col = mix(mix(mix(uAzure, uHot, 0.45), mix(fc, vec3(1.0), 0.35 * uWhite), clamp(fi * 2.2, 0.0, 1.0)), vec3(1.0), uWhite * 0.2 * tone * tone);
      light += col * (uGlyphs * uBeam * cover * lit);
      ink += uGlyphs * uBeam * cover * lit * 1.3;
    }
  }
  if (uIntro < 1.0) {
    float eased = 1.0 - pow(1.0 - uIntro, 3.0);
    float shown = smoothstep(0.0, 0.5, eased * 1.55 - (Ts - uBack) / (1.0 - uBack)) * smoothstep(0.0, 0.25, uIntro);
    light *= shown;
    ink *= shown;
  }
  vec2 edge = min(gl_FragCoord.xy, uResolution - gl_FragCoord.xy) / (0.5 * min(uResolution.x, uResolution.y));
  float keep = mix(1.0, smoothstep(0.0, 0.6, edge.x) * smoothstep(0.0, 0.6, edge.y), uFade);
  fragColor = vec4(light * keep, ink * keep);
}
`,k=`
precision highp float;

uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uFirst;
uniform float uThreshold;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 a = texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  vec4 b = texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  vec4 c = texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  vec4 d = texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  vec4 color = (a + b + c + d) * 0.125 + texture(uSource, vUv) * 0.5;
  if (uFirst > 0.5) {
    float peak = max(color.r, max(color.g, color.b));
    float knee = uThreshold * 0.6 + 1e-4;
    float soft = clamp(peak - uThreshold + knee, 0.0, 2.0 * knee);
    color.rgb *= max(soft * soft / (4.0 * knee), peak - uThreshold) / max(peak, 1e-4);
  }
  fragColor = color;
}
`,S=`
precision highp float;

uniform sampler2D uSource;
uniform sampler2D uBase;
uniform vec2 uTexel;
uniform float uKeep;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 sum = texture(uSource, vUv) * 4.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, -1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, 1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = texture(uBase, vUv) + sum * (uKeep / 16.0);
}
`,C=`
precision highp float;

uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform vec3 uBackdrop;
uniform float uGlow;
uniform float uExposure;
uniform float uInk;
uniform float uGrain;
uniform float uFilm;
uniform float uSeed;

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

void main() {
  vec4 scene = texture(uScene, vUv);
  vec3 light = max(scene.rgb + texture(uBloom, vUv).rgb * uGlow, 0.0) * uExposure;
  float peak = max(light.r, max(light.g, light.b));
  vec3 color;
  float body;
  if (uInk < 0.5) {
    float knee = 0.72;
    float mapped = peak <= knee ? peak : knee + (1.0 - knee) * (1.0 - exp(-(peak - knee) / (1.0 - knee)));
    vec3 seen = peak > 1e-5 ? light * (mapped / peak) : vec3(0.0);
    seen = mix(seen, vec3(mapped), smoothstep(1.0, 3.4, peak) * 0.94);
    color = uBackdrop + (1.0 - uBackdrop) * seen;
    body = mapped;
  } else {
    vec3 hue = peak > 1e-5 ? light / peak : vec3(1.0);
    float wash = 1.0 - exp(-peak * 1.7);
    float mark = clamp(scene.a * uExposure * 1.4, 0.0, 1.0);
    vec3 paper = uBackdrop * mix(vec3(1.0), pow(hue, vec3(1.15)), 0.78 * wash);
    float vivid = 1.0 - min(hue.r, min(hue.g, hue.b));
    vec3 pigment = uBackdrop * pow(hue, vec3(1.9)) * (mix(0.52, 0.3, mark) * mix(0.42, 1.0, vivid));
    color = mix(paper, pigment, mark * mark * (3.0 - 2.0 * mark));
    body = max(wash, mark);
  }
  vec3 shown = encode(color);
  if (uGrain > 0.0) {
    float speck = hash(gl_FragCoord.xy + uFilm * vec2(17.0, 59.0)) + hash(gl_FragCoord.xy * 1.31 + uFilm * 7.0) - 1.0;
    shown += speck * uGrain * 0.2 * (0.25 + body) * smoothstep(0.0, 0.06, body);
  }
  fragColor = vec4(shown + (hash(gl_FragCoord.xy + uSeed * 311.0) - 0.5) / 255.0, 1.0);
}
`,F=(e,t,a)=>Math.min(a,Math.max(t,e)),B=(e,t)=>Number.isFinite(e)?e:t,T=(e,t,a)=>{let n=F((a-e)/(t-e),0,1);return n*n*(3-2*n)},M=e=>e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4),A=e=>{let t=Math.cbrt(.4122214708*e[0]+.5363325363*e[1]+.0514459929*e[2]),a=Math.cbrt(.2119034982*e[0]+.6806995451*e[1]+.1073969566*e[2]),n=Math.cbrt(.0883024619*e[0]+.2817188376*e[1]+.6299787005*e[2]);return[.2104542553*t+.793617785*a-.0040720468*n,1.9779984951*t-2.428592205*a+.4505937099*n,.0259040371*t+.7827717662*a-.808675766*n]},L=(e,t,a)=>{var n;let l,o,r;return l=Math.pow((n=[e,t*Math.cos(a),t*Math.sin(a)])[0]+.3963377774*n[1]+.2158037573*n[2],3),o=Math.pow(n[0]-.1055613458*n[1]-.0638541728*n[2],3),[Math.max(0,4.0767416621*l-3.3077115913*o+.2309699292*(r=Math.pow(n[0]-.0894841775*n[1]-1.291485548*n[2],3))),Math.max(0,-1.2684380046*l+2.6097574011*o-.3413193965*r),Math.max(0,-.0041960863*l-.7034186147*o+1.707614701*r)]},E=e=>"undefined"!=typeof Intl&&"Segmenter"in Intl?Array.from(new Intl.Segmenter(void 0,{granularity:"grapheme"}).segment(e),e=>e.segment):Array.from(e),j=e=>!!e&&"function"==typeof e.closest&&!!e.closest("a,button,input,textarea,select,label,summary,[role=button],[contenteditable=true]"),U=e=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");return t.addEventListener("change",e),()=>t.removeEventListener("change",e)},G=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,
I=(0,l.forwardRef)(function({colors:e=m,backgroundColor:t="#0a0a0a",shape:a="funnel",characters:o=f,text:r="",scramble:i=.08,shuffle:g=.4,fontFamily:I="",fontWeight:R=700,size:z=13,spacing:P=1.2,angle:W=0,originX:Y=0,originY:X=0,spread:q=1,curve:D=1.1,skew:H=.12,streams:O=6,rows:_=3,lines:V=1,speed:K=3,variance:N=.3,glyphs:$=1,pulse:J=1,pulseSpeed:Z=1,sheen:Q=1,beam:ee=1,flare:et=1,glow:ea=1,grain:en=.2,intensity:el=1,fade:eo=0,burstEvery:er=6,intro:ei=!0,interactive:eu=!0,ignite:es=1,burst:ec=1,seed:em=0,paused:ef=!1,quality:eh=1,className:ed,style:ep,children:ev},eg){let ex=(0,l.useRef)(null),ew=(0,l.useRef)(null),eb={colors:e,backgroundColor:t,shape:a,characters:o,text:r,scramble:i,shuffle:g,fontFamily:I,fontWeight:R,size:z,spacing:P,angle:W,originX:Y,originY:X,spread:q,curve:D,skew:H,streams:O,rows:_,lines:V,speed:K,variance:N,glyphs:$,pulse:J,pulseSpeed:Z,sheen:Q,beam:ee,flare:et,glow:ea,grain:en,intensity:el,fade:eo,burstEvery:er,intro:ei,interactive:eu,ignite:es,burst:ec,seed:em,paused:ef,quality:eh,reduced:(0,l.useSyncExternalStore)(U,G,()=>!1)},ey=(0,l.useRef)(eb);return(0,l.useEffect)(()=>{ey.current=eb,ew.current?.sync()}),(0,l.useEffect)(()=>{let e=ex.current;if(!e)return;let t=((e,t)=>{let a,n=e.ownerDocument,l=n.defaultView??window,o=n.createElement("canvas");o.setAttribute("aria-hidden","true"),o.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none",e.prepend(o);try{a=new u.WebGLRenderer({canvas:o,alpha:!1,antialias:!1,powerPreference:"high-performance"})}catch{return o.remove(),null}if(!a.capabilities.isWebGL2)return a.dispose(),o.remove(),null;a.autoClear=!1;let r=a.extensions.has("EXT_color_buffer_float")||a.extensions.has("EXT_color_buffer_half_float")?s.ix0:s.OUM,i=n.createElement("canvas").getContext("2d",{willReadFrequently:!0}),c=new Map,g=e=>{let t=c.get(e);if(t)return t;if(!i||!e||(i.fillStyle="#010203",i.fillStyle=e,"#010203"===String(i.fillStyle)&&"#010203"!==e.trim().toLowerCase()))return null;i.clearRect(0,0,1,1),i.fillRect(0,0,1,1);let a=i.getImageData(0,0,1,1).data,n=[a[0]/255,a[1]/255,a[2]/255,a[3]/255];return c.size>32&&c.clear(),c.set(e,n),n},U=n.createElement("canvas"),G=U.getContext("2d"),I=null,R="",z=new s.GYF(new Uint8Array([255]),1,1,s.VT0,s.OUM);z.needsUpdate=!0;let P=z,W=[],Y="",X=e=>Array.from({length:e},()=>new s.IUQ),q={uResolution:{value:new s.I9Y(1,1)},uOrigin:{value:new s.I9Y},uAxis:{value:new s.I9Y(1,0)},uLength:{value:1},uBack:{value:-.1},uPixel:{value:1},uUnit:{value:1},uThick:{value:1},uFunnel:{value:0},uKappa:{value:new s.I9Y},uWide:{value:new s.I9Y(1,1)},uLineCount:{value:0},uLineA:{value:X(24)},uLineB:{value:X(24)},uLineC:{value:X(24)},uGlintA:{value:X(24)},uGlintB:{value:X(24)},uBandCount:{value:0},uBandA:{value:X(8)},uBandB:{value:X(8)},uRow:{value:12},uAspect:{value:.9},uAtlas:{value:null},uGrid:{value:new s.IUQ(8,1,1,120)},uText:{value:z},uTextLength:{value:0},uScramble:{value:0},uShuffle:{value:.4},uTime:{value:0},uFlow:{value:0},uVariance:{value:.3},uGlyphs:{value:1},uPulse:{value:1},uSheen:{value:1},uBeam:{value:1},uFlare:{value:1},uFade:{value:0},uSeed:{value:0},uIntro:{value:1},uWhite:{value:1},uFlip:{value:1},uLabA:{value:new s.Pq0},uLabB:{value:new s.Pq0},uHot:{value:new s.Pq0},uAzure:{value:new s.Pq0},uWarm:{value:new s.Pq0},uCream:{value:new s.Pq0},uBursts:{value:Array.from({length:4},()=>new s.Pq0(-9,0,1))}},D=(e,t)=>new s.BKk({glslVersion:s.Wdf,uniforms:t,vertexShader:b,fragmentShader:e,depthTest:!1,depthWrite:!1,blending:s.XIg}),H=D(y,q),O={uSource:{value:null},uTexel:{value:new s.I9Y},uFirst:{value:0},uThreshold:{value:.75}},_=D(k,O),V={uSource:{value:null},uBase:{value:null},uTexel:{value:new s.I9Y},uKeep:{value:.62}},K=D(S,V),N={uScene:{value:null},uBloom:{value:null},uBackdrop:{value:new s.Pq0},uGlow:{value:1},uExposure:{value:1},uInk:{value:0},uGrain:{value:.2},uFilm:{value:0},uSeed:{value:0}},$=D(C,N),J=new s.bdM(2,2),Z=new s.eaF(J,H);Z.frustumCulled=!1;let Q=new s.Z58;Q.add(Z);let ee=new s.qUd(-1,1,1,-1,0,1),et=(e,t)=>new s.nWS(Math.max(1,e),Math.max(1,t),{type:r,format:s.GWd,minFilter:s.k6q,magFilter:s.k6q,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1}),ea=null,en=[],el=[],eo=!1,er=!1,ei=!0,eu=0,es=0,ec=1,em=1,ef=1,eh=1,ed=40,ep=0,ev=0,eg=0,ex=0,ew=!0,eb=0,ey=0,ek=0,eS=0,eC=0,eF=0,eB=0,eT=0,eM=!t.current.intro||t.current.reduced||t.current.paused?1:0,eA=null,eL=new Float32Array(24).fill(-1),eE=new Float32Array(24),ej=new Float32Array(24),eU=null,eG=[],eI={originX:0,originY:0,axisX:1,axisY:0,length:1,funnel:!1,kappas:[0,0],widest:[1,1],from:-.2},eR=()=>l.performance.now()/1e3,ez=()=>{let e=t.current;return ei&&!n.hidden&&!e.paused&&!e.reduced},eP=()=>{let e=t.current;return e.interactive&&!e.reduced&&!e.paused&&!eo&&!er},eW=()=>Math.min(Math.min(l.devicePixelRatio||1,2)*F(B(t.current.quality,1),.25,1)*eh,Math.sqrt(6e6/Math.max(1,ec*em))),eY=()=>{ea?.dispose(),en.forEach(e=>e.dispose()),el.forEach(e=>e.dispose()),ea=null,en=[],el=[]},eX=(e,t)=>{Z.material=e,a.setRenderTarget(t),a.render(Q,ee)},eq=()=>{if(eo||er||!ea||!en.length)return;let n=t.current;if((()=>{let e=t.current,n=e.fontFamily||'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',l=String(e.fontWeight||700),o=[e.characters,e.text,n,l].join("\x01");if(o===R&&I||!G)return;R=o;let r=Array.from(new Set(E(e.characters||f).filter(e=>e.trim()))).slice(0,64);r.length||r.push("0","1");let i=e.text?E(e.text).slice(0,255):[],u=r.slice();i.forEach(e=>{e.trim()&&!u.includes(e)&&u.length<128&&u.push(e)});let c=Math.ceil(u.length/8);U.width=576,U.height=120*c,G.fillStyle="#000",G.fillRect(0,0,U.width,U.height),G.fillStyle="#fff",G.textAlign="center",G.textBaseline="alphabetic",G.font=`${l} 100px ${n}`;let m=G.measureText("HX08").actualBoundingBoxAscent||72;if(G.font=`${l} ${(64.80000000000001/m*100).toFixed(2)}px ${n}`,u.forEach((e,t)=>{let a=Math.min(1,66.24000000000001/Math.max(G.measureText(e).width,1));G.save(),G.translate(t%8*72+36,120*Math.floor(t/8)+92.4),G.scale(a,1),G.fillText(e,0,0),G.restore()}),I?.dispose(),(I=new s.GOR(U)).generateMipmaps=!0,I.minFilter=s.$_I,I.magFilter=s.k6q,I.anisotropy=Math.min(8,a.capabilities.getMaxAnisotropy()),I.colorSpace=s.jf0,I.needsUpdate=!0,q.uAtlas.value=I,q.uGrid.value.set(8,c,r.length,120),P!==z&&P.dispose(),P=z,i.length){let e=new Uint8Array(i.length);i.forEach((t,a)=>{let n=t.trim()?u.indexOf(t):-1;e[a]=n<0?255:n}),(P=new s.GYF(e,i.length,1,s.VT0,s.OUM)).unpackAlignment=1,P.minFilter=s.hxR,P.magFilter=s.hxR,P.needsUpdate=!0}q.uText.value=P,q.uTextLength.value=i.length})(),!I)return;let r=o.width,i=o.height,u="funnel"===n.shape,c=r/i<.85,b=B(n.angle,0)*v+(c?Math.PI/2:0),y=F(B(n.originX,0),-2,2),k=F(B(n.originY,0),-2,2),S=r/2+(c?-k:y)*r/2,C=i/2-(c?y:k)*i/2,j=Math.cos(b),X=-Math.sin(b),D=1,J=0,Z=1,Q=1;for(let e=0;e<4;e++){let t=(1&e?r:0)-S,a=(2&e?i:0)-C,n=t*j+a*X,l=a*j-t*X;D=Math.max(D,n),J=Math.max(J,-n),Z=Math.max(Z,l),Q=Math.max(Q,-l)}let ee=u?Math.max(D,J):D,et=F(B(n.size,13),6,64)*F(Math.pow(ee/ef/1e3,.6),.8,1.6)*ef,ei=.9*F(B(n.spacing,1.2),.8,3),eu=F(B(n.spread,1),.1,3)*(1+.012*eB),es=F(B(n.curve,1.1),0,4),ec=F(B(n.skew,.12),-1,1),em=[es*(1+ec),es*(1-ec)],eh=[1.45*eu*(1+.35*ec)*Z,1.45*eu*(1-.35*ec)*Q],ed=[eh[0]/(ee*(1+em[0])),eh[1]/(ee*(1+em[1]))],ep=[em[0]/(ed[0]*ed[0]),em[1]/(ed[1]*ed[1])],ev=Math.round(F(B(n.streams,6),0,x.length)),eg=F(B(n.lines,1),0,1),ex=Math.round(F(B(n.seed,0),0,9999)),ew=[ev,eg.toFixed(3),ex].join("|");ew!==Y&&(Y=ew,W=((e,t,a)=>{let n,l=x.slice(0,e).concat(w.slice(0,Math.min(w.length,Math.round(t*w.length))));if(!a)return l.slice(0,24);let o=(n=7919*a+4421>>>0,()=>{let e=n=n+0x6d2b79f5>>>0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000});return l.slice(0,24).map(e=>{let t=(o()-.5)*.09;return{...e,at:Math.max(.12,e.at+t),level:e.level*(.8+.4*o()),tone:F(e.tone+(o()-.5)*.4,0,1),band:e.band?[e.band[0]+t,e.band[1]+t]:null,glints:e.glints.map(e=>({...e,at:.2+.9*o(),pace:e.pace*(.8+.4*o())}))}})})(ev,eg,ex),eL.fill(-1));let eF=Math.round(F(B(n.rows,3),1,12)),eT=F(B(n.ignite,1),0,3),eA=0;W.forEach((e,t)=>{let a=e.side>0?0:1,n=e.at*ed[a];q.uLineA.value[t].set(e.side*n,e.level,e.thick,e.tone),q.uLineB.value[t].set(e.out*ed[a],e.outLevel,e.inn*ed[a],e.innLevel),q.uLineC.value[t].set(e.drift,e.outTone,2.399*t,e.hot);let l=eL[t],o=l<0?0:T(0,.16,l)*(1-T(.45,1.7,l))*(1-T(.2,.5,eE[t]));for(let a=0;a<2;a++){let n=1===a&&!e.glints[1]&&e.band?e.glints[0]:null,l=e.glints[a]??n,r=0===a?q.uGlintA.value[t]:q.uGlintB.value[t],i=0===a?eE[t]:1.1*eT*o*ej[t];if(!l){r.set(0,1,0,i);continue}let u=(((Math.log(l.at)-h)/d+.5*!!n+ek*l.pace)%1+1)%1,s=Math.exp(h+u*d),c=e.at<.4?.85:9;r.set(h+u*d,l.span,l.amp*(n?.9:1)*T(.1,.4,u)*(1-T(.9,1,u))*(1-T(.6*c,c,s)),i)}if(e.band&&eA<8){let n=(e.band[0]+e.band[1])/2*ed[a],l=1+3*ep[a]*n*n,o=ee*l/Math.sqrt(1+n*n*l*l),r=Math.min(eF,Math.floor((e.band[1]-e.band[0])*ed[a]*o/et+.15));if(r>=1){let a=r*et/(2*o);q.uBandA.value[eA].set(e.side*(n-a),n+a,r,40+16*t),q.uBandB.value[eA].set(.9*e.level,e.at<.4?.4:9,e.at<.4?.5:1,t),eA++}}}),q.uLineCount.value=W.length,q.uBandCount.value=eA,q.uResolution.value.set(r,i),q.uOrigin.value.set(S,C),q.uAxis.value.set(j,X),q.uLength.value=ee,q.uBack.value=-J/ee,q.uPixel.value=ef,q.uUnit.value=ee/1750,q.uThick.value=Math.pow(F(ee/ef/1e3,.7,2.2),.7),q.uFunnel.value=+!!u,q.uKappa.value.set(ep[0],ep[1]),q.uWide.value.set(ed[0],ed[1]),q.uRow.value=et,q.uAspect.value=ei,q.uScramble.value=F(B(n.scramble,.08),0,1),q.uShuffle.value=F(B(n.shuffle,.4),0,30),q.uTime.value=eb,q.uFlow.value=ey,q.uVariance.value=F(B(n.variance,.3),0,1),q.uGlyphs.value=F(B(n.glyphs,1),0,3),q.uPulse.value=F(B(n.pulse,1),0,3),q.uSheen.value=F(B(n.sheen,1),0,3),q.uBeam.value=F(B(n.beam,1),0,3),q.uFade.value=F(B(n.fade,0),0,1),q.uSeed.value=7919*ex,q.uIntro.value=eM,q.uFlip.value=j<-1e-4?-1:1,eI.originX=S,eI.originY=C,eI.axisX=j,eI.axisY=X,eI.length=ee,eI.funnel=u,eI.kappas=ep,eI.widest=ed,eI.from=u?-1.05:-J/ee-.05;let eU=(()=>{let a=g(t.current.backgroundColor);if(a&&a[3]>.5)return[a[0],a[1],a[2]];let n=e.parentElement;for(;n;){let e=g(l.getComputedStyle(n).backgroundColor);if(e&&e[3]>.5)return[e[0],e[1],e[2]];n=n.parentElement}return[.039,.039,.039]})(),eR=.2126*eU[0]+.7152*eU[1]+.0722*eU[2]>.5;q.uWhite.value=+!eR;let ez=g(n.colors?.[0]??m[0])??[.32,.15,1,1],eP=g(n.colors?.[1]??m[1])??[1,.62,.99,1],eW=A([M(ez[0]),M(ez[1]),M(ez[2])]),eY=A([M(eP[0]),M(eP[1]),M(eP[2])]);q.uLabA.value.set(eW[0],eW[1],eW[2]),q.uLabB.value.set(eY[0],eY[1],eY[2]);let eq=Math.hypot(eW[1],eW[2]),eD=Math.atan2(eW[2],eW[1]),eH=e=>Math.atan2(Math.sin(e-eD),Math.cos(e-eD)),eO=eH(100*v),e_=eH(200*v),eV=(Math.abs(eO)<Math.abs(e_)?eO:e_)*Math.min(1,eq/.1),eK=L(eW[0]+(1-eW[0])*.62,.55*eq,eD+F(eV,-.5,.5));q.uHot.value.set(eK[0],eK[1],eK[2]);let eN=L(Math.min(.78,eW[0]+.2),.62*eq,eD+F(eV,-.36,.36));q.uAzure.value.set(eN[0],eN[1],eN[2]);let e$=Math.atan2(eY[2],eY[1]),eJ=((e$+75*v)%p+p)%p,eZ=eJ>100*v&&eJ<200*v?e$-50*v:e$+75*v,eQ=Math.hypot(eY[1],eY[2]),e0=T(.015,.07,Math.max(eq,eQ)),e1=L(.7,Math.max(.9*eQ,.18)*e0,eZ),e2=L(.95,.065*e0,eZ+F(Math.atan2(Math.sin(90*v-eZ),Math.cos(90*v-eZ)),-52*v,52*v));q.uWarm.value.set(e1[0],e1[1],e1[2]),q.uCream.value.set(e2[0],e2[1],e2[2]);let e5=F(B(n.burst,1),0,4),e3=0;for(let e=0;e<4;e++){let t=eG[e],a=t?eI.from+(eb-t.born)*.5:-9,n=t?t.power*e5*T(eI.from,eI.from+.25,a)*(1-T(.9,1.25,a)):0;q.uBursts.value[e].set(a,n,.14+.08*Math.max(a-eI.from,0)),t&&(e3+=t.power*e5*Math.exp(-Math.pow((a-1.02)/.3,2)))}q.uFlare.value=F(B(n.flare,1),0,3)*(1+.04*eB+.2*Math.min(e3,2)),eX(H,ea);let e4=ea;en.forEach((e,t)=>{O.uSource.value=e4.texture,O.uTexel.value.set(1/e4.width,1/e4.height),O.uFirst.value=+(0===t),eX(_,e),e4=e});let e6=en[en.length-1];for(let e=en.length-2;e>=0;e--)V.uSource.value=e6.texture,V.uBase.value=en[e].texture,V.uTexel.value.set(1/e6.width,1/e6.height),eX(K,el[e]),e6=el[e];N.uScene.value=ea.texture,N.uBloom.value=e6.texture,N.uBackdrop.value.set(M(eU[0]),M(eU[1]),M(eU[2])),N.uGlow.value=F(B(n.glow,1),0,4)*(eR?.1:.4),N.uExposure.value=F(B(n.intensity,1),0,4),N.uInk.value=+!!eR,N.uGrain.value=F(B(n.grain,.2),0,1),N.uFilm.value=eC,N.uSeed.value=eS,eX($,null)},eD=e=>{e<=0||(eG.length>=4&&eG.shift(),eG.push({born:eb,power:e}),eT=0)};function eH(e){if(eu=0,eo||er)return;let a=es?Math.max(0,(e-es)/1e3):0,n=es?Math.min(.05,a):1/60;es=e;let o=t.current;eb+=n,eS=(eS+.618034)%1,(eF+=n)>=1/24&&(eF=0,eC=(eC+1)%97),ey+=n*B(o.speed,3),ek+=.055*n*B(o.pulseSpeed,1);for(let e=0;e<24;e++)!(eL[e]<0)&&(eL[e]+=n,eE[e]+=.5*n,(eL[e]>1.7||eE[e]>.5)&&(eL[e]=-1));for(eB=Math.sin(.31*eb)+.5*Math.sin(.53*eb+1.7),eM<1&&(eM=Math.min(1,eM+n/2.6));eG.length&&eI.from+(eb-eG[0].born)*.5>1.7;)eG.shift();let r=B(o.burstEvery,6);eT+=n,r>0&&eT>=r&&eD(1);let i=!1;if(ed>0?ed--:a>0&&ew&&(ep++,eg+=a,a>.024&&ev++),ep>=60){let e=eg/ep,t=ev>36;ep=0,ev=0,eg=0,ex>0&&e>.9*ex?(eh=Math.min(1,eh/.8),ew=!1,i=!0):t&&eh>.5?(ex=e,eh=Math.max(.5,.8*eh),i=!0):ex=0}i?e_():eq(),ez()&&!eu&&(eu=l.requestAnimationFrame(eH))}function eO(){!eo&&!er&&!eu&&ez()&&(es=0,eu=l.requestAnimationFrame(eH))}let e_=()=>{if(eo)return;let t=e.getBoundingClientRect();ec=Math.max(1,e.clientWidth||t.width),em=Math.max(1,e.clientHeight||t.height),ef=eW(),ed=24,a.setPixelRatio(ef),a.setSize(ec,em,!1);let n=o.width,l=o.height;eY(),ea=et(n,l);let r=ef>1.5?6:5;for(let e=1;e<=r;e++)en.push(et(n>>e,l>>e)),el.push(et(n>>e,l>>e));eq(),eO()},eV=(e,t,a,n,l)=>{let o=Math.min(t,a),r=Math.max(t,a);W.forEach((t,a)=>{if((t.side>0?0:1)!==e)return;let i=t.at*eI.widest[e];i>o&&i<=r&&(eL[a]<0?(eL[a]=0,eE[a]=n,ej[a]=l):ej[a]===l&&eL[a]>.45&&(eL[a]=.45))})},eK=(a,n)=>{let l=eP()&&B(t.current.ignite,1)>0?((t,a)=>{let n,l=(n=e.getBoundingClientRect()).width<=0||n.height<=0?null:{x:(t-n.left)*(ec/n.width),y:(a-n.top)*(em/n.height)};if(!l)return null;let o=l.x*ef-eI.originX,r=(em-l.y)*ef-eI.originY,i=(o*eI.axisX+r*eI.axisY)/eI.length,u=(r*eI.axisX-o*eI.axisY)/eI.length,s=eI.funnel?Math.abs(i):i;if(s<.1)return null;let c=u>=0?0:1,m=eI.kappas[c],f=Math.abs(u),h=f;if(m>1e-4){let e=f/(2*m),t=Math.sqrt(e*e+1/(27*m*m*m)),a=Math.cbrt(e+t),n=Math.cbrt(Math.max(t-e,0));h=2*e/(a*a+a*n+n*n)}return{side:c,w:h/s,lt:Math.log(s),way:i<0?-1:1,t:eR()}})(a,n):null,o=eA;eA=l,l&&o&&l.way===o.way&&!(l.t-o.t>.25)&&(l.side===o.side?eV(l.side,o.w,l.w,l.lt,l.way):(eV(o.side,0,o.w,l.lt,l.way),eV(l.side,0,l.w,l.lt,l.way)),eO())},eN=e=>{"touch"!==e.pointerType&&eK(e.clientX,e.clientY)},e$=e=>{!("touch"===e.pointerType||0!==e.button||j(e.target))&&eP()&&(eD(1),eO())},eJ=e=>{"touch"!==e.pointerType&&(eA=null)},eZ=e=>{let t=e.changedTouches[0];t&&(eU={id:t.identifier,x:t.clientX,y:t.clientY,t:eR()},eA=null,eK(t.clientX,t.clientY))},eQ=e=>{let t=Array.from(e.touches).find(e=>!eU||e.identifier===eU.id)??e.touches[0];t&&eK(t.clientX,t.clientY)},e0=e=>{let t=eU;if(eU=null,eA=null,!t||j(e.target)||!eP())return;let a=Array.from(e.changedTouches).find(e=>e.identifier===t.id);!a||Math.hypot(a.clientX-t.x,a.clientY-t.y)>10||eR()-t.t>.5||(eD(1),eO())},e1=()=>{eU=null,eA=null},e2=()=>{es=0,n.hidden||eO()},e5=e=>{e.preventDefault(),er=!0,l.cancelAnimationFrame(eu),eu=0},e3=()=>{er=!1,ea=null,en=[],el=[],R="",e_()},e4=()=>{eo||er||(R="",eu||eq())};e.addEventListener("pointermove",eN),e.addEventListener("pointerdown",e$),l.addEventListener("pointermove",eN,{passive:!0}),l.addEventListener("pointerdown",e$),e.addEventListener("pointerleave",eJ),e.addEventListener("touchstart",eZ,{passive:!0}),e.addEventListener("touchmove",eQ,{passive:!0}),e.addEventListener("touchend",e0,{passive:!0}),e.addEventListener("touchcancel",e1,{passive:!0}),n.addEventListener("visibilitychange",e2),o.addEventListener("webglcontextlost",e5),o.addEventListener("webglcontextrestored",e3),n.fonts?.addEventListener?.("loadingdone",e4);let e6=new ResizeObserver(e_);e6.observe(e);let e7=new IntersectionObserver(e=>{ei=e.some(e=>e.isIntersecting),es=0,ei&&eO()},{rootMargin:"80px"});e7.observe(e);let e9=new MutationObserver(()=>{eo||er||eu||eq()});return e9.observe(n.documentElement,{attributes:!0,attributeFilter:["class","style","data-theme"]}),e_(),{sync:()=>{if(!eo&&!er){if(Math.abs(eW()-ef)>.001)return void e_();eu||eq(),eO()}},burst:(e=1)=>{eo||er||(eD(F(B(e,1),0,4)),eu||eq(),eO())},destroy:()=>{eo=!0,l.cancelAnimationFrame(eu),eu=0,e.removeEventListener("pointermove",eN),e.removeEventListener("pointerdown",e$),l.removeEventListener("pointermove",eN),l.removeEventListener("pointerdown",e$),e.removeEventListener("pointerleave",eJ),e.removeEventListener("touchstart",eZ),e.removeEventListener("touchmove",eQ),e.removeEventListener("touchend",e0),e.removeEventListener("touchcancel",e1),n.removeEventListener("visibilitychange",e2),o.removeEventListener("webglcontextlost",e5),o.removeEventListener("webglcontextrestored",e3),n.fonts?.removeEventListener?.("loadingdone",e4),e6.disconnect(),e7.disconnect(),e9.disconnect(),eY(),I?.dispose(),P!==z&&P.dispose(),z.dispose(),J.dispose(),[H,_,K,$].forEach(e=>e.dispose()),a.dispose(),a.forceContextLoss(),o.remove()}}})(e,ey);return ew.current=t,()=>{t?.destroy(),ew.current=null}},[]),(0,l.useImperativeHandle)(eg,()=>({burst:e=>ew.current?.burst(e)}),[]),(0,n.jsx)("div",{ref:ex,className:(0,c.cn)("relative isolate h-full min-h-[240px] w-full overflow-hidden",ed),style:{backgroundColor:t,...ep},children:ev&&(0,n.jsx)("div",{className:"relative z-10 h-full w-full",children:ev})})});I.displayName="AsciiStream";

export const AsciiStream = I;
export default AsciiStream;
