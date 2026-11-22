// @ts-nocheck
import React, { forwardRef } from 'react';
import * as THREE from 'three';

export interface RisingLinesProps {
  colors?: [string, string];
  backgroundColor?: string;
  density?: number;
  speed?: number;
  lineWidth?: number;
  lineLength?: number;
  horizonHeight?: number;
  horizonGlow?: number;
  depth?: number;
  spread?: number;
  updraft?: number;
  particles?: number;
  interactive?: boolean;
  intro?: boolean;
  paused?: boolean;
  dpr?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  horizonColor?: string;
  haloColor?: string;
  riseSpeed?: number;
  riseScale?: number;
  riseIntensity?: number;
  flowSpeed?: number;
  flowDensity?: number;
  flowIntensity?: number;
  horizonIntensity?: number;
  haloIntensity?: number;
  circleScale?: number;
  scale?: number;
  brightness?: number;
  children?: React.ReactNode;
}

export interface RisingLinesHandle {
  launch: (x?: number, y?: number) => void;
  replay: () => void;
}

const s: any = {
  ...THREE,
  AdditiveBlending: THREE.AdditiveBlending,
  EZo: THREE.AdditiveBlending,
  NoColorSpace: THREE.NoColorSpace,
  jf0: THREE.NoColorSpace,
  UnsignedByteType: THREE.UnsignedByteType,
  OUM: THREE.UnsignedByteType,
  Vector4: THREE.Vector4,
  IUQ: THREE.Vector4,
  Float32BufferAttribute: THREE.Float32BufferAttribute,
  qtW: THREE.Float32BufferAttribute,
  Color: THREE.Color,
  Q1f: THREE.Color,
  Mesh: THREE.Mesh,
  eaF: THREE.Mesh,
  Scene: THREE.Scene,
  Z58: THREE.Scene,
  Vector2: THREE.Vector2,
  I9Y: THREE.Vector2,
  NoBlending: THREE.NoBlending,
  XIg: THREE.NoBlending,
  BufferGeometry: THREE.BufferGeometry,
  LoY: THREE.BufferGeometry,
  Vector3: THREE.Vector3,
  Pq0: THREE.Vector3,
  GLSL3: THREE.GLSL3,
  Wdf: THREE.GLSL3,
  HalfFloatType: THREE.HalfFloatType,
  ix0: THREE.HalfFloatType,
  OrthographicCamera: THREE.OrthographicCamera,
  qUd: THREE.OrthographicCamera,
  LinearFilter: THREE.LinearFilter,
  k6q: THREE.LinearFilter,
  RGBAFormat: THREE.RGBAFormat,
  GWd: THREE.RGBAFormat,
  WebGLRenderTarget: THREE.WebGLRenderTarget,
  nWS: THREE.WebGLRenderTarget,
  RawShaderMaterial: THREE.RawShaderMaterial,
  D$Q: THREE.RawShaderMaterial,
};

const u: any = {
  ...THREE
};

const l: any = React;
const c: any = {
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
};

const a: any = {
  jsx: (type: any, props: any) => {
    const { children, key, ...rest } = props || {};
    return React.createElement(type, { ...rest, key }, children);
  },
  jsxs: (type: any, props: any) => {
    const { children, key, ...rest } = props || {};
    return React.createElement(type, { ...rest, key }, ...(Array.isArray(children) ? children : [children]));
  }
};

let d=(e,t,o)=>Math.min(o,Math.max(t,e)),f=(e,t)=>Number.isFinite(e)?e:t,h=new s.Q1f,p=e=>{if("string"!=typeof e)return null;let t=e.trim().toLowerCase();if(!t||"transparent"===t||"none"===t||"auto"===t)return null;let o=/^rgba?\(([^)]+)\)$/.exec(t);if(o){let e=o[1].split(/[\s,/]+/).filter(Boolean).map(e=>Number.parseFloat(e));return e.length<3||e.slice(0,3).some(e=>!Number.isFinite(e))||e.length>3&&Number.isFinite(e[3])&&e[3]<.05?null:[e[0]/255,e[1]/255,e[2]/255]}h.setRGB(-1,-1,-1);try{h.setStyle(t,s.jf0)}catch{return null}return h.r<0?null:[h.r,h.g,h.b]},m=e=>e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4),v=([e,t,o])=>{let a=m(e),l=m(t),n=m(o),r=Math.cbrt(.4122214708*a+.5363325363*l+.0514459929*n),i=Math.cbrt(.2119034982*a+.6806995451*l+.1073969566*n),s=Math.cbrt(.0883024619*a+.2817188376*l+.6299787005*n),u=1.9779984951*r-2.428592205*i+.4505937099*s,c=.0259040371*r+.7827717662*i-.808675766*s;return[.2104542553*r+.793617785*i-.0040720468*s,Math.hypot(u,c),Math.atan2(c,u)]},g=([e,t,o])=>{let a=t*Math.cos(o),l=t*Math.sin(o),n=Math.pow(e+.3963377774*a+.2158037573*l,3),r=Math.pow(e-.1055613458*a-.0638541728*l,3),i=Math.pow(e-.0894841775*a-1.291485548*l,3);return[4.0767416621*n-3.3077115913*r+.2309699292*i,-1.2684380046*n+2.6097574011*r-.3413193965*i,-.0041960863*n-.7034186147*r+1.707614701*i]},x=e=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");return t.addEventListener("change",e),()=>t.removeEventListener("change",e)},y=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,w=`
in vec3 position;
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,b=`
precision highp float;

uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform vec3 uHead;
uniform vec3 uBody;
uniform vec3 uTail;
uniform vec3 uHaze;
uniform float uRiseSpeed;
uniform float uRiseScale;
uniform float uRiseIntensity;
uniform float uFlowSpeed;
uniform float uFlowDensity;
uniform float uFlowIntensity;
uniform float uHorizonIntensity;
uniform float uHaloIntensity;
uniform float uHorizonHeight;
uniform float uCircleScale;
uniform float uScale;
uniform float uBrightness;
uniform float uColumn;
uniform float uWidth;
uniform float uLength;
uniform float uDepth;
uniform float uSpread;
uniform float uFade;
uniform float uHorizonIn;
uniform float uOpen;
uniform float uReveal;
uniform float uEncode;
uniform vec3 uDraft;
uniform float uLift[64];
uniform vec4 uVolleys[8];

in vec2 vUv;
out vec4 fragColor;

float hash2D(vec2 coord) {
  vec2 k = fract(coord * vec2(127.82, 311.45));
  k += dot(k, k + 71.83);
  return fract(k.x * k.y);
}

vec2 hash2D_vec2(vec2 coord) {
  float h1 = hash2D(coord);
  float h2 = hash2D(coord + h1);
  return vec2(h1, h2);
}

vec2 computeParticleOffset(vec2 cellIndex, float timeScale) {
  vec2 randVec = hash2D_vec2(cellIndex);
  return sin(randVec * uTime * timeScale) * 0.4;
}

float liftAt(float u) {
  float f = clamp(u * 64.0 - 0.5, 0.0, 63.0);
  int i = int(f);
  int j = min(i + 1, 63);
  return mix(uLift[i], uLift[j], f - float(i));
}

float draftAt(float u, float aspect) {
  float g = ((u - 0.5) * aspect - uDraft.x) / uDraft.z;
  return min(uDraft.y * exp(-g * g), 1.5);
}

vec3 lineTint(float along, float near) {
  vec3 tint = mix(uHead, uBody, smoothstep(0.0, 0.2, along));
  tint = mix(tint, uTail, smoothstep(0.22, 1.0, along));
  return mix(tint, uTail, (1.0 - near) * 0.55);
}

float generateAscendingGlow(vec2 coordinates, float gridDensity, float aspect) {
  vec2 scaledCoords = coordinates * gridDensity;
  float column = floor(scaledCoords.x);
  float total = 0.0;
  for (int i = -1; i <= 1; i++) {
    float cellX = column + float(i);
    float u = (cellX + 0.5) / gridDensity * uScale / aspect * 0.5 + 0.5;
    float lifted = scaledCoords.y - (uTime + liftAt(u)) * uRiseSpeed * gridDensity;
    float row = floor(lifted);
    float boost = 1.0 + 0.6 * draftAt(u, aspect);
    for (int j = -1; j <= 1; j++) {
      vec2 cellIndex = vec2(cellX, row + float(j));
      vec2 pick = hash2D_vec2(cellIndex + 17.3);
      if (pick.x > 0.38) continue;
      vec2 localPos = vec2(scaledCoords.x, lifted) - cellIndex - 0.5;
      vec2 particlePos = computeParticleOffset(cellIndex, 0.7);
      vec2 delta = particlePos - localPos;
      float spot = 1.0 / (1.0 + dot(delta, delta) * 22500.0);
      float window = 1.0 - smoothstep(0.25, 0.55, length(delta));
      float phase = particlePos.x * 10.0;
      float oscillation = sin(uTime * 1.6 + phase) * 0.22 + 0.85;
      total += spot * window * oscillation * boost * (0.3 + 1.2 * pick.y * pick.y);
    }
  }
  return total;
}

void main() {
  vec2 cssRes = uRes / uDpr;
  float aspectRatio = uRes.x / uRes.y;
  vec2 screenUV = gl_FragCoord.xy / uRes;
  vec2 centeredUV = (screenUV - 0.5) * 2.0;
  centeredUV.x *= aspectRatio;

  vec2 transformedUV = centeredUV / uScale;
  transformedUV.y -= uHorizonHeight / uScale;
  float rise = transformedUV.y + 0.1;

  float reveal = 1.0 - smoothstep(uReveal - 0.14, uReveal, rise);
  float ceiling = 1.0 - smoothstep(0.6, 0.98, screenUV.y);
  vec2 vignetteCoords = (screenUV - 0.5) * 2.0;
  float vignetteMask = smoothstep(-0.6 + uCircleScale, 0.2 + uCircleScale, 1.0 - length(vignetteCoords));

  vec2 haloOffset = transformedUV * vec2(1.0, 10.0) - vec2(0.0, -1.0);
  float halo = uHaloIntensity * 2.0 / pow(dot(haloOffset, haloOffset) + 0.0004, 1.2) / 15.0;
  float lineAmp = halo / (1.0 + halo / 3.0);
  float combAmp = halo / (1.0 + halo / 10.0);
  float shown = smoothstep(0.0, 0.01, rise + 0.01) * reveal * ceiling;

  vec2 scaledScreenUV = (screenUV - 0.5) / uScale + 0.5;
  vec2 pixelCoords = scaledScreenUV * cssRes;
  float workX = abs((scaledScreenUV.x - 0.5) * 2.0) * uFlowDensity;
  float workY = 1.0 - scaledScreenUV.y + workX;
  float weight = workY * workY * 2.4;
  float horizonScreen = 0.5 + 0.5 * (uHorizonHeight - 0.1 * uScale);
  float horizonPixel = ((horizonScreen - 0.5) / uScale + 0.5) * cssRes.y;
  float unit = 1.0 / (uDpr * uScale);
  float cssUnit = 1.0 / uScale;

  float sx = vignetteCoords.x / max(uOpen * uSpread, 0.05);
  float bell = exp(-2.4 * sx * sx) * (1.0 - smoothstep(0.4, 0.97, abs(sx)));
  float wide = exp(-1.2 * sx * sx) * (1.0 - smoothstep(0.35, 1.0, abs(sx)));
  float lateral = 1.0 - smoothstep(0.5, 1.05, abs(sx));
  vec3 light = vec3(0.0);
  float total = 0.0;

  float cssX = gl_FragCoord.x / uDpr;
  float column = floor(cssX / uColumn);
  float columnX = (column + 0.5) * uColumn;
  float columnU = columnX / cssRes.x;
  float seed = fract(tan(((columnU - 0.5) / uScale + 0.5) * cssRes.x) * 7.0);
  vec2 pick = hash2D_vec2(vec2(column, 5.31));
  vec2 pick2 = hash2D_vec2(vec2(column, 9.77));
  float near = mix(1.0, pick.x, uDepth);
  float draft = draftAt(columnU, aspectRatio);
  float animOffset = cssRes.y * (uTime + 60.0 + liftAt(columnU)) * uFlowSpeed;
  float head = mod(seed * animOffset, cssRes.x);
  float wrapFade = 1.0 - smoothstep(cssRes.x * 0.72, cssRes.x, head);
  float base = horizonPixel + (1.0 - near) * 0.05 * cssRes.y * cssUnit;
  float above = pixelCoords.y - base;
  float gap = head - pixelCoords.y;
  float widthDev = uWidth * mix(0.5, 1.0, near) * uDpr;
  float cover = clamp(0.5 + 0.5 * widthDev - abs(cssX - columnX) * uDpr, 0.0, min(widthDev, 1.0));
  float hero = pow(pick2.x, 5.0);
  float strength = (0.1 + 2.2 * hero) * (0.45 + 0.55 * seed) * mix(0.3, 1.0, near) * (1.0 + 0.8 * draft);
  float tailLen = (40.0 + 150.0 * pick2.y + 220.0 * hero) * uLength * mix(0.45, 1.0, near) * cssUnit;
  float along = gap / tailLen;
  float taper = pow(clamp(1.0 - along, 0.0, 1.0), 2.2);
  float headGlow = exp(-max(gap, 0.0) / (3.5 * cssUnit));
  float body = strength * weight * cover * wrapFade * smoothstep(-unit, unit, gap) * smoothstep(0.0, 2.0 * unit, above);
  float needle = body * taper * (0.75 * lineAmp + headGlow * (2.2 + 0.8 * min(lineAmp, 2.0))) * lateral;
  light += lineTint(clamp(along, 0.0, 1.0), near) * needle;
  total += needle;

  float lead = head - base;
  float combHeight = (4.0 + 12.0 * pick.y * pick.y) * cssUnit * (1.0 + 0.6 * draft);
  float comb = seed * weight * cover * wrapFade * smoothstep(0.0, 4.0 * unit, lead) / (1.0 + max(lead, 0.0) / (60.0 * cssUnit))
    * exp(-max(above, 0.0) / combHeight) * smoothstep(-unit, unit, above) * mix(0.4, 1.0, near) * combAmp * 0.55 * pow(wide, 1.5);
  light += mix(uBody, uHead, min(combAmp / 10.0, 1.0) * 0.6) * comb;
  total += comb;

  for (int n = 0; n < 8; n++) {
    vec4 volley = uVolleys[n];
    if (volley.z <= 0.0 || abs(cssX - volley.x) > 66.0 + uWidth) continue;
    for (int j = 0; j < 9; j++) {
      float lane = float(j);
      vec2 a = hash2D_vec2(vec2(volley.w, lane * 1.37 + 0.5));
      vec2 b = hash2D_vec2(vec2(lane * 2.11 + 0.25, volley.w));
      float t = volley.y - a.y * 0.2;
      if (t <= 0.0) continue;
      float x = volley.x + (a.x + b.x - 1.0) * 64.0;
      float widthV = uWidth * 1.1 * uDpr;
      float coverV = clamp(0.5 + 0.5 * widthV - abs(cssX - x) * uDpr, 0.0, min(widthV, 1.0));
      if (coverV <= 0.0) continue;
      float apex = (0.3 + 0.45 * b.y) * min(volley.z, 2.0) * cssRes.y * cssUnit;
      float gapV = horizonPixel + apex * (1.0 - exp(-t / (0.5 + 0.3 * a.x))) - pixelCoords.y;
      float tailV = (70.0 + 110.0 * b.x) * uLength * cssUnit;
      float alongV = gapV / tailV;
      float taperV = pow(clamp(1.0 - alongV, 0.0, 1.0), 2.2);
      float life = smoothstep(0.0, 0.06, t) * pow(1.0 - clamp(t / 3.0, 0.0, 1.0), 2.0);
      float valueV = min(volley.z, 2.0) * 1.3 * weight * coverV * life * smoothstep(-unit, unit, gapV)
        * smoothstep(0.0, 2.0 * unit, pixelCoords.y - horizonPixel) * taperV * (0.75 * lineAmp + exp(-max(gapV, 0.0) / (3.5 * cssUnit)) * (2.2 + 0.8 * min(lineAmp, 2.0)));
      light += lineTint(clamp(alongV, 0.0, 1.0), 1.0) * valueV;
      total += valueV;
    }
  }

  float sparks = uRiseIntensity > 0.0 ? generateAscendingGlow(transformedUV, uRiseScale, aspectRatio) * uRiseIntensity : 0.0;
  sparks *= (0.6 + min(lineAmp, 2.0)) * 1.6 * lateral;
  light += mix(uBody, uHead, 0.35) * sparks;
  total += sparks;

  light *= shown;
  total *= shown;

  float dyCss = (pixelCoords.y - horizonPixel) * uScale;
  float dyDev = dyCss * uDpr;
  float sigma = (0.4 + 0.55 * bell) * uDpr;
  float sigmaE = sqrt(sigma * sigma + 0.083);
  float coreLine = exp(-0.5 * dyDev * dyDev / (sigmaE * sigmaE)) * (sigma / sigmaE) * pow(bell, 1.3);
  float upward = max(dyCss, 0.0);
  float downward = max(-dyCss, 0.0);
  float reach = 1.0 - smoothstep(0.0, 0.55 * cssRes.y, abs(dyCss));
  float glowBand = exp(-(upward / (4.0 + 20.0 * bell) + downward / (2.5 + 9.0 * bell))) * pow(bell, 0.9) * reach;
  float hazeBand = exp(-(upward / (0.14 * cssRes.y) + downward / (0.035 * cssRes.y))) * wide * reach;
  float horizonLight = uHorizonIntensity * uHorizonIn * uFade;
  vec3 horizon = uHead * coreLine * 2.6 + mix(uTail, uBody, bell) * glowBand * 0.6 + uHaze * hazeBand * 0.12 * (0.4 + uDepth);
  light += horizon * horizonLight;
  total += (coreLine * 2.6 + glowBand * 0.6 + hazeBand * 0.12 * (0.4 + uDepth)) * horizonLight;

  float gain = vignetteMask * uBrightness * uFade;
  light *= gain;
  total *= gain;
  vec4 result = vec4(light, total);
  fragColor = uEncode > 0.5 ? result / (1.0 + result) : result;
}
`,C=`
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uThreshold;
uniform float uEncode;
in vec2 vUv;
out vec4 fragColor;
vec4 tap(vec2 d) {
  vec4 c = texture(uSource, vUv + d * uTexel);
  return uEncode > 0.5 ? c / max(1.0 - c, 0.002) : c;
}
void main() {
  vec4 color = tap(vec2(0.0)) * 0.125
    + (tap(vec2(-2.0, 2.0)) + tap(vec2(2.0, 2.0)) + tap(vec2(-2.0, -2.0)) + tap(vec2(2.0, -2.0))) * 0.03125
    + (tap(vec2(0.0, 2.0)) + tap(vec2(-2.0, 0.0)) + tap(vec2(2.0, 0.0)) + tap(vec2(0.0, -2.0))) * 0.0625
    + (tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0)) + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0))) * 0.125;
  if (uThreshold > 0.0) {
    float peak = max(color.r, max(color.g, color.b));
    float knee = uThreshold * 0.8;
    float soft = clamp(peak - uThreshold + knee, 0.0, 2.0 * knee);
    soft = soft * soft / (4.0 * knee + 0.00001);
    color *= max(soft, peak - uThreshold) / max(peak, 0.00001);
  }
  fragColor = uEncode > 0.5 ? color / (1.0 + color) : color;
}
`,S=`
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uEncode;
in vec2 vUv;
out vec4 fragColor;
vec4 tap(vec2 d) {
  vec4 c = texture(uSource, vUv + d * uTexel);
  return uEncode > 0.5 ? c / max(1.0 - c, 0.002) : c;
}
void main() {
  vec4 color = tap(vec2(0.0)) * 4.0
    + (tap(vec2(-1.0, 0.0)) + tap(vec2(1.0, 0.0)) + tap(vec2(0.0, -1.0)) + tap(vec2(0.0, 1.0))) * 2.0
    + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0));
  color /= 16.0;
  fragColor = uEncode > 0.5 ? color / (1.0 + color) : color;
}
`,k=`
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomStrength;
uniform float uExposure;
uniform float uInk;
uniform float uEncode;
in vec2 vUv;
out vec4 fragColor;

vec4 decode(vec4 c) {
  return uEncode > 0.5 ? c / max(1.0 - c, 0.002) : c;
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  vec4 scene = decode(texture(uScene, vUv));
  vec4 bloom = decode(texture(uBloom, vUv));
  float dither = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  if (uInk > 0.5) {
    vec4 field = scene + bloom * uBloomStrength * 0.45;
    float amount = field.a;
    vec3 ink = field.rgb / max(field.a, 0.00001);
    float cover = 1.0 - exp(-amount * 3.0 * uExposure);
    fragColor = vec4(encode(ink), clamp(cover + dither, 0.0, 1.0));
    return;
  }
  vec3 emission = scene.rgb + bloom.rgb * uBloomStrength;
  float peak = max(emission.r, max(emission.g, emission.b));
  emission *= peak / (peak + 0.05);
  vec3 color = encode(1.0 - exp(-emission * uExposure)) + dither;
  float alpha = clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0);
  fragColor = vec4(clamp(color / max(alpha, 0.0001), 0.0, 1.0), alpha);
}
`,F=null,z=e=>{if(!e||/^rgba?\(/i.test(e)||(F||(F=document.createElement("canvas").getContext("2d",{willReadFrequently:!0})),!F)||(F.fillStyle="#010203",F.fillStyle=e,"#010203"===String(F.fillStyle)&&"#010203"!==e.trim().toLowerCase()))return e;F.clearRect(0,0,1,1),F.fillRect(0,0,1,1);let t=F.getImageData(0,0,1,1).data;return 255===t[3]?`rgb(${t[0]}, ${t[1]}, ${t[2]})`:`rgba(${t[0]}, ${t[1]}, ${t[2]}, ${Math.round(t[3]/255*1e3)/1e3})`}; let D=(0,l.forwardRef)(function({colors:e,backgroundColor:t="transparent",density:o=1,speed:n=.6,lineWidth:r=1,lineLength:i=1,horizonHeight:h=-.45,horizonGlow:m=1,depth:F=.5,spread:D=1,updraft:E=1,particles:R=1,interactive:L=!0,intro:I=!0,paused:M=!1,dpr:T=2,className:H,style:U,children:es,color:V,horizonColor:B,haloColor:j,riseSpeed:P=.1,riseScale:A=11.5,riseIntensity:W=1,flowSpeed:X=.2,flowDensity:_=4,flowIntensity:G=.6,horizonIntensity:O=.85,haloIntensity:q=7.5,circleScale:N,scale:$=3.5,brightness:Y=1},Q){let Z=(0,l.useRef)(null),K=(0,l.useRef)(null),J=(0,l.useSyncExternalStore)(x,y,()=>!1),ee=V??e?.[1]??"#FF9FFC",et={glowColor:B??e?.[0]??"#8B5CF6",lineColor:ee,haloColor:j??e?.[1]??ee,backgroundColor:t,column:Math.max(r,1)/d(f(o,1),.1,10),speed:n,lineWidth:r,lineLength:i,horizonHeight:h,depth:F,spread:D,updraft:E,riseSpeed:P,riseScale:A,riseIntensity:W*R,flowSpeed:X,flowDensity:_,flowIntensity:G,horizonIntensity:O*m,haloIntensity:q,circleScale:N??.2+(D-1)*.6,scale:$,brightness:Y,interactive:L,intro:I,paused:M,dpr:T,reduced:J},eo=(0,l.useRef)(et);(0,l.useEffect)(()=>{eo.current=et,K.current?.sync()}),(0,l.useEffect)(()=>{let e=Z.current;if(!e)return;let t=function(e,t){let o,a=e.ownerDocument,l=a.defaultView??window;try{o=new u.WebGLRenderer({antialias:!1,alpha:!0,premultipliedAlpha:!1,powerPreference:"high-performance"})}catch{return null}o.setClearColor(0,0),o.autoClear=!1;let n=o.domElement;n.setAttribute("aria-hidden","true"),n.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block",e.appendChild(n);let r=o.extensions.has("EXT_color_buffer_float")||o.extensions.has("EXT_color_buffer_half_float"),i=+!r,c=new s.qUd(-1,1,1,-1,-1,1),h=new s.LoY;h.setAttribute("position",new s.qtW([-1,-1,0,3,-1,0,-1,3,0],3));let m=new s.Z58,x=new s.eaF(h);x.frustumCulled=!1,m.add(x);let y=(e,t,o=!1)=>new s.D$Q({glslVersion:s.Wdf,vertexShader:w,fragmentShader:e,uniforms:t,blending:o?s.EZo:s.XIg,transparent:o,depthTest:!1,depthWrite:!1}),F=new Float32Array(64),D=Array.from({length:8},()=>new s.IUQ),E={uRes:{value:new s.I9Y(1,1)},uDpr:{value:1},uTime:{value:0},uHead:{value:new s.Pq0},uBody:{value:new s.Pq0},uTail:{value:new s.Pq0},uHaze:{value:new s.Pq0},uRiseSpeed:{value:.1},uRiseScale:{value:11.5},uRiseIntensity:{value:1},uFlowSpeed:{value:.2},uFlowDensity:{value:4},uFlowIntensity:{value:.6},uHorizonIntensity:{value:.85},uHaloIntensity:{value:7.5},uHorizonHeight:{value:-.45},uCircleScale:{value:.2},uScale:{value:3.5},uBrightness:{value:1},uColumn:{value:1},uWidth:{value:1},uLength:{value:1},uDepth:{value:.5},uSpread:{value:1},uFade:{value:1},uHorizonIn:{value:1},uOpen:{value:1},uReveal:{value:9},uEncode:{value:i},uDraft:{value:new s.Pq0(0,0,.13)},uLift:{value:F},uVolleys:{value:D}},R=y(b,E),L=()=>new s.nWS(1,1,{type:r?s.ix0:s.OUM,format:s.GWd,depthBuffer:!1,stencilBuffer:!1,minFilter:s.k6q,magFilter:s.k6q,generateMipmaps:!1}),I=L(),M=Array.from({length:5},L),T=y(C,{uSource:{value:null},uTexel:{value:new s.I9Y},uThreshold:{value:0},uEncode:{value:i}}),H=y(S,{uSource:{value:null},uTexel:{value:new s.I9Y},uEncode:{value:i}},!i),U=y(k,{uScene:{value:I.texture},uBloom:{value:M[0].texture},uBloomStrength:{value:.1},uExposure:{value:1},uInk:{value:0},uEncode:{value:i}}),V=0,B=0,j=1,P=!1,A=!1,W="",X=-1/0,_=0,G=1,O=!1,q=1,N=9,$=-1,Y=0,Q=0,Z=0,K=0,J=0,ee=0,et=0,eo=!1,ea=!1,el=!1,en=null,er=[],ei=()=>{let o,a,n=t.current,r=p(n.backgroundColor)??(()=>{let t=e.parentElement;for(;t;){let e=z(l.getComputedStyle(t).backgroundColor).match(/rgba?\(([^)]+)\)/);if(e){let t=e[1].split(/[\s,/]+/).filter(Boolean).map(e=>Number.parseFloat(e));if(t.length<4||t[3]>.05)return[t[0]/255,t[1]/255,t[2]/255]}t=t.parentElement}return l.matchMedia("(prefers-color-scheme: dark)").matches?[.04,.04,.04]:[1,1,1]})();A=.2126*r[0]+.7152*r[1]+.0722*r[2]>.55;let i=[n.glowColor,n.lineColor,n.haloColor,A].join("|");if(i===W)return;W=i;let s=p(n.glowColor)??[.55,.36,.96],u=p(n.lineColor)??[1,.62,.99],c=p(n.haloColor)??u,f=v(u),h=v(s);f[1]<.02&&(f[2]=h[2]),h[1]<.02&&(h[2]=f[2]);let m=h[2]-f[2];h[2]=f[2]+Math.atan2(Math.sin(m),Math.cos(m));let x=f[1]>.02||h[1]>.02,y=[Math.min(f[0]+.16,.97),.45*f[1],f[2]],w=[f[0],1.15*f[1],f[2]],b=[.92*h[0],1.1*h[1],h[2]],C=(o=b,a=w,[o[0]+(a[0]-o[0])*.3,o[1]+(a[1]-o[1])*.3,o[2]+(a[2]-o[2])*.3]);A&&(y=[d(.55*f[0],.35,.58),Math.max(1.5*f[1],.25*!!x),f[2]],w=[d(.65*f[0],.40,.64),Math.max(1.4*f[1],.22*!!x),f[2]],b=[d(.75*h[0],.38,.60),Math.max(1.4*h[1],.20*!!x),h[2]],C=[.60,Math.max(h[1],.18*!!x),h[2]]);let S=(e,t)=>{let o,a=[d((o=g((e=>{let t=[e[0],e[1],e[2]];for(let e=0;e<24&&!g(t).every(e=>e>=-5e-4&&e<=1.0005);e++)t[1]*=.93;return t})(t)))[0],0,1),d(o[1],0,1),d(o[2],0,1)];e.set(a[0],a[1],a[2])};S(E.uHead.value,y),S(E.uBody.value,w),S(E.uTail.value,b),S(E.uHaze.value,C),U.uniforms.uInk.value=+!!A},es=()=>{let a=t.current,n=Math.round(e.clientWidth),r=Math.round(e.clientHeight);if(n<2||r<2)return P=!1,!1;let i=Math.min(l.devicePixelRatio||1,d(f(a.dpr,2),.5,3));if(P&&n===V&&r===B&&i===j)return!1;P=!0,V=n,B=r,j=i,o.setPixelRatio(j),o.setSize(V,B,!1);let s=Math.max(1,Math.round(V*j)),u=Math.max(1,Math.round(B*j));I.setSize(s,u),E.uRes.value.set(s,u),E.uDpr.value=u/B;let c=s,h=u;for(let e of M)c=Math.max(1,Math.round(c/2)),h=Math.max(1,Math.round(h/2)),e.setSize(c,h);return!0},eu=()=>{if(!P)return;let e=t.current;performance.now()-X>1e3&&(X=performance.now(),ei());let a=d(f(e.lineWidth,1),.25,6);E.uTime.value=_,E.uRiseSpeed.value=d(f(e.riseSpeed,.1),0,2),E.uRiseScale.value=d(f(e.riseScale,11.5),1,60),E.uRiseIntensity.value=d(f(e.riseIntensity,1),0,4),E.uFlowSpeed.value=d(f(e.flowSpeed,.2),0,4),E.uFlowDensity.value=d(f(e.flowDensity,4),0,20),E.uFlowIntensity.value=d(f(e.flowIntensity,.6),0,4),E.uHorizonIntensity.value=d(f(e.horizonIntensity,.85),0,8),E.uHaloIntensity.value=d(f(e.haloIntensity,7.5),0,40),E.uHorizonHeight.value=d(f(e.horizonHeight,-.45),-3,3),E.uCircleScale.value=d(f(e.circleScale,.2),-.5,1.5),E.uScale.value=d(f(e.scale,3.5),.3,40),E.uBrightness.value=d(f(e.brightness,1),0,4)*d(f(e.flowIntensity,.6),0,4)/.6,E.uColumn.value=Math.max(d(f(e.column,1),.25,40),a,1/j),E.uWidth.value=a,E.uLength.value=d(f(e.lineLength,1),.1,6),E.uDepth.value=d(f(e.depth,.5),0,1),E.uSpread.value=d(f(e.spread,1),.1,2),E.uFade.value=G,E.uHorizonIn.value=q,E.uOpen.value=.1+.9*q,E.uReveal.value=N,E.uDraft.value.set(Y,K*d(f(e.updraft,1),0,3),.13);for(let e=0;e<8;e++){let t=er[e];t?D[e].set(t.x,t.age,t.strength,t.seed):D[e].set(0,0,0,0)}x.material=R,o.setRenderTarget(I),o.clear(),o.render(m,c);let l=I;for(let e of(x.material=T,M))T.uniforms.uThreshold.value=l===I?A?.5:.35:0,T.uniforms.uSource.value=l.texture,T.uniforms.uTexel.value.set(1/l.width,1/l.height),o.setRenderTarget(e),o.render(m,c),l=e;x.material=H;for(let e=M.length-1;e>0;e--)H.uniforms.uSource.value=M[e].texture,H.uniforms.uTexel.value.set(1/M[e].width,1/M[e].height),o.setRenderTarget(M[e-1]),i&&o.clear(),o.render(m,c);U.uniforms.uBloomStrength.value=(A?.35:.85)/M.length*2,x.material=U,o.setRenderTarget(null),o.clear(),o.render(m,c)},ec=()=>{F.fill(0),er.length=0,q=0,N=0,$=-2,G=1,O=!1},ed=()=>{_=9,q=1,N=9,$=-1,G=1,O=!1,er.length=0,K=0,J=0},ef=()=>{ea||el||!eo||ee||(ee=requestAnimationFrame(eh))},eh=e=>{if(ee=0,ea||el)return;let o=t.current,l=et&&e-et<100?Math.min(Math.max((e-et)/1e3,0),.05):1/60;et=e,(o.reduced||o.paused&&-2===$)&&ed();let n=!o.reduced&&!o.paused;n&&((e,t,o)=>{let a=d(f(o.speed,1),0,4);if(O&&(G=Math.max(0,G-e/.4))<=0&&ec(),-2===$&&($=t),$>=0){let e=(t-$)/1e3;q=1-Math.pow(1-d(e/1.6,0,1),3),N=(1-Math.pow(1-d((e-.25)/1.6,0,1),3))*1.2,e>2.1&&($=-1,q=1,N=9)}_+=e*a;let l=o.interactive?J:0;K+=(l-K)*(1-Math.exp(-e/.45)),Q+=(-56.25*(Y-Z)-15*Q)*e,Y+=Q*e;let n=d(f(o.updraft,1),0,3)*K;if(n>5e-4){let t=V/Math.max(B,1),o=e*a*n*1.2;for(let e=0;e<64;e++){let a=(((e+.5)/64-.5)*t-Y)/.13;F[e]+=o*Math.exp(-a*a)}}for(let t=er.length-1;t>=0;t--)er[t].age+=e*a,er[t].age>3.4&&er.splice(t,1)})(l,e,o),eu(),n&&!a.hidden?ee=requestAnimationFrame(eh):et=0},ep=t=>{let o=e.getBoundingClientRect();return o.width<=0||o.height<=0?null:{fraction:(t-o.left)/o.width,aspect:o.width/o.height}},em=(e,t)=>{if(er.length>=8){let e=0;for(let t=1;t<er.length;t++)er[t].age>er[e].age&&(e=t);if(er[e].age<2.38)return;er.splice(e,1)}er.push({x:d(e,0,1)*V,age:0,strength:t,seed:1+Math.floor(900*Math.random())}),ef()},ev=()=>{let e=t.current;return e.interactive&&!e.reduced&&!e.paused},eg=(e,t)=>{let o=(e-.5)*t;K<.03&&(Y=o,Q=0),Z=o,J=1,ef()},ex=e=>{if(!e.isPrimary||!ev()||"mouse"===e.pointerType&&0!==e.button)return;let t=ep(e.clientX);if(t){if("mouse"===e.pointerType)return void em(t.fraction,1);en={id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now()},eg(t.fraction,t.aspect)}},ey=e=>{if("mouse"===e.pointerType)return;J=0;let t=en;if(en=null,!t||t.id!==e.pointerId||!ev()||Math.hypot(e.clientX-t.x,e.clientY-t.y)>12||performance.now()-t.time>500)return;let o=ep(e.clientX);o&&em(o.fraction,1)},ew=e=>{if(!ev()||"mouse"!==e.pointerType&&(!en||en.id!==e.pointerId))return;let t=ep(e.clientX);t&&eg(t.fraction,t.aspect)},eb=e=>{"mouse"===e.pointerType&&(J=0,ef())},eC=()=>{en=null,J=0},eS=()=>{et=0,ef()},ek=e=>{e.preventDefault(),el=!0,cancelAnimationFrame(ee),ee=0},eF=()=>{el=!1,W="",ef()},ez=new ResizeObserver(()=>{es()&&(eu(),ef())}),eD=new IntersectionObserver(([e])=>{eo=e.isIntersecting,et=0,ef()},{rootMargin:"120px"});return e.addEventListener("pointerdown",ex),e.addEventListener("pointerup",ey),e.addEventListener("pointermove",ew),e.addEventListener("pointerleave",eb),e.addEventListener("pointercancel",eC),a.addEventListener("visibilitychange",eS),n.addEventListener("webglcontextlost",ek),n.addEventListener("webglcontextrestored",eF),ez.observe(e),eD.observe(e),t.current.reduced?ed():t.current.intro&&ec(),es(),ei(),{sync:()=>{X=-1/0,es(),et=0,!ee&&eo&&(eu(),ef())},launch:(e,o)=>{let a=t.current;a.reduced||a.paused||em(void 0===e?.2+.6*Math.random():d(f(e,.5),0,1),d(f(o??1,1),.1,2))},replay:()=>{t.current.reduced||(O=!0,et=0,ef())},destroy:()=>{for(let t of(ea=!0,cancelAnimationFrame(ee),ez.disconnect(),eD.disconnect(),e.removeEventListener("pointerdown",ex),e.removeEventListener("pointerup",ey),e.removeEventListener("pointermove",ew),e.removeEventListener("pointerleave",eb),e.removeEventListener("pointercancel",eC),a.removeEventListener("visibilitychange",eS),n.removeEventListener("webglcontextlost",ek),n.removeEventListener("webglcontextrestored",eF),h.dispose(),R.dispose(),T.dispose(),H.dispose(),U.dispose(),I.dispose(),M))t.dispose();o.dispose(),n.remove()}}}(e,eo);return K.current=t,()=>{t?.destroy(),K.current=null}},[]),(0,l.useImperativeHandle)(Q,()=>({launch:(e,t)=>K.current?.launch(e,t),replay:()=>K.current?.replay()}),[]);let ea=t.trim().toLowerCase();return(0,a.jsxs)("div",{ref:Z,className:(0,c.cn)("absolute inset-0 overflow-hidden",H),style:{backgroundColor:""===ea||"transparent"===ea||"none"===ea?void 0:t,...U},children:[es&&(0,a.jsx)("div",{className:"relative z-10 w-full h-full",children:es})]})});;
D.displayName = "RisingLines";

export const RisingLines = D;
export default RisingLines;
