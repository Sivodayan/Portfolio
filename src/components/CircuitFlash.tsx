// @ts-nocheck
import React from 'react';
import * as THREE from 'three';

export interface CircuitFlashProps {
  colors?: [string, string];
  backgroundColor?: string;
  cellSize?: number;
  cellAspect?: number;
  shape?: 'rect' | 'square' | 'dot' | 'diamond';
  coverage?: number;
  scale?: number;
  drift?: number;
  brightness?: number;
  twinkle?: number;
  signals?: number;
  traceLength?: number;
  points?: number;
  labels?: number;
  rays?: number;
  target?: [number, number];
  focus?: number;
  regions?: boolean;
  status?: boolean;
  grid?: number;
  glow?: number;
  grain?: number;
  speed?: number;
  seed?: number;
  interactive?: boolean;
  intro?: boolean;
  paused?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface CircuitFlashHandle {
  replay: () => void;
  flash: (x?: number, y?: number) => void;
}

const s: any = {
  ...THREE,
  qtW: THREE.Float32BufferAttribute,
  i7d: THREE.Camera,
  LoY: THREE.BufferGeometry,
  Zr2: THREE.LinearSRGBColorSpace,
  er$: THREE.SRGBColorSpace,
  Q1f: THREE.Color,
  BKk: THREE.ShaderMaterial,
  Pq0: THREE.Vector3,
  I9Y: THREE.Vector2,
  Z58: THREE.Scene,
  eaF: THREE.Mesh,
  Wdf: THREE.GLSL3,
  nWS: THREE.WebGLRenderTarget,
  GWd: THREE.RGBAFormat,
  OUM: THREE.UnsignedByteType,
  k6q: THREE.LinearFilter,
  hxR: THREE.NearestFilter,
  GYF: THREE.DataTexture
};

const u: any = {
  ...THREE
};
const r: any = React;
const h: any = {
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
};

// JSX helper
const l: any = {
  jsx: (type: any, props: any) => {
    const { children, key, ...rest } = props || {};
    return React.createElement(type, { ...rest, key }, children);
  },
  jsxs: (type: any, props: any) => {
    const { children, key, ...rest } = props || {};
    return React.createElement(type, { ...rest, key }, ...(Array.isArray(children) ? children : [children]));
  }
};

let c=["#96E4CB","#88E7EA"],d=[.62,.44],f=Math.exp(-3.2),p=2*Math.PI/0x1000000,m='ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',v=`
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,g=`
uint scramble(uint x) {
  x ^= x >> 16u;
  x *= 0x7feb352du;
  x ^= x >> 15u;
  x *= 0x846ca68bu;
  x ^= x >> 16u;
  return x;
}

float slopeDot(uvec2 c, uint seed, vec2 d) {
  uint h = scramble(c.x * 0x9e3779b1u ^ scramble(c.y ^ seed));
  float a = float(h >> 8u) * ${p.toExponential(10)};
  return cos(a) * d.x + sin(a) * d.y;
}

float wave(vec2 p, uint seed) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  uvec2 c = uvec2(ivec2(i) + 32768);
  float a = slopeDot(c, seed, f);
  float b = slopeDot(c + uvec2(1u, 0u), seed, f - vec2(1.0, 0.0));
  float d = slopeDot(c + uvec2(0u, 1u), seed, f - vec2(0.0, 1.0));
  float e = slopeDot(c + uvec2(1u, 1u), seed, f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(d, e, u.x), u.y) * 1.41421356;
}

float terrain(vec2 q, float t, uint seed) {
  vec2 bend = vec2(wave(q * 0.6 + vec2(t * 0.031, 4.7), seed), wave(q * 0.6 + vec2(9.2, -t * 0.027), seed));
  q += 0.7 * bend;
  return 0.6 * wave(q + vec2(t * 0.045, -t * 0.018), seed) + 0.28 * wave(q * 2.07 + vec2(13.1 - t * 0.07, t * 0.05), seed) + 0.12 * wave(q * 4.23 + vec2(t * 0.11, 27.3 + t * 0.09), seed);
}

float speck(uvec2 cell, uint lane) {
  return float(scramble(cell.x * 0x85ebca6bu ^ scramble(cell.y * 0xc2b2ae35u ^ lane)) >> 8u) / 16777216.0;
}
`,x=`
uniform vec2 uOriginCss;
uniform vec2 uPitchCss;
uniform float uFreq;
uniform float uTime;
uniform float uThreshold;
uniform float uSeed;

out vec4 fragColor;
${g}
void main() {
  uvec2 cell = uvec2(gl_FragCoord.xy);
  uint seed = uint(uSeed);
  vec2 q = (uOriginCss + (vec2(cell) + 0.5) * uPitchCss) * uFreq;
  float f = terrain(q, uTime, seed);
  float fine = wave(q * 5.3 + vec2(31.7, -uTime * 0.05), seed) * 0.5 + 0.5;
  float density = smoothstep(uThreshold - 0.08, uThreshold + 0.14, f) * (0.8 + 0.2 * fine) * 1.12;
  float pick = speck(cell, seed + 101u);
  float presence = smoothstep(pick - 0.06, pick + 0.06, density);
  float heat = smoothstep(uThreshold, uThreshold + 0.35, f);
  float bright = (0.45 + 0.55 * heat) * (0.55 + 0.8 * speck(cell, seed + 202u)) * (0.76 + 0.48 * fine);
  fragColor = vec4(presence, clamp(bright / 1.8, 0.0, 1.0), heat, 1.0);
}
`,y=`
uniform vec2 uSize;
uniform vec2 uPitch;
uniform vec2 uOrigin;
uniform ivec2 uCells;
uniform ivec2 uGridStep;
uniform ivec2 uGridShift;
uniform sampler2D uField;
uniform sampler2D uSpark;
uniform vec3 uBase;
uniform vec3 uTint;
uniform vec3 uSparkA;
uniform vec3 uSparkB;
uniform vec3 uHot;
uniform vec3 uLine;
uniform float uLevel;
uniform vec2 uCellExtent;
uniform vec2 uBarExtent;
uniform float uBarWiden;
uniform int uShape;
uniform float uGlow;
uniform float uInk;
uniform float uGridAlpha;
uniform vec3 uScan;
uniform float uScanBand;
uniform float uGrain;
uniform float uTick;

out vec4 fragColor;

const mat3 LAB_TO_CONE = mat3(1.0, 1.0, 1.0, 0.3963377774, -0.1055613458, -0.0894841775, 0.2158037573, -0.0638541728, -1.291485548);
const mat3 CONE_TO_RGB = mat3(4.0767416621, -1.2684380046, -0.0041960863, -3.3077115913, 2.6097574011, -0.7034186147, 0.2309699292, -0.3413193965, 1.707614701);

vec3 toLight(vec3 lab) {
  vec3 cone = LAB_TO_CONE * lab;
  return CONE_TO_RGB * (cone * cone * cone);
}

vec3 toDisplay(vec3 v) {
  return mix(v * 12.92, 1.055 * pow(max(v, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, v));
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float diamond(vec2 p, vec2 extent) {
  vec2 e = max(extent, vec2(0.001));
  vec2 q = abs(p) / e;
  return (q.x + q.y - 1.0) / length(1.0 / e);
}

float box(vec2 p, vec2 extent, float radius) {
  vec2 q = abs(p) - extent + radius;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

float rest(vec2 p, vec2 extent) {
  if (uShape == 2) return length(p) - extent.x;
  if (uShape == 3) {
    float bevel = 0.24 * min(extent.x, extent.y);
    return diamond(p, extent - bevel) - bevel;
  }
  return box(p, extent, 0.0);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  vec2 rel = p - uOrigin;
  vec2 slot = floor(rel / uPitch);
  ivec2 cell = clamp(ivec2(slot), ivec2(0), uCells - 1);
  vec2 centre = uOrigin + (slot + 0.5) * uPitch;
  vec2 local = p - centre;
  vec4 field = texelFetch(uField, cell, 0);
  vec4 spark = texelFetch(uSpark, cell, 0);

  float shown = 1.0;
  float front = 0.0;
  if (uScan.z < 100000.0) {
    float d = distance(centre, uScan.xy);
    shown = smoothstep(uScan.z, uScan.z - uScanBand, d);
    float x = (d - uScan.z + uScanBand * 0.6) / (uScanBand * 0.45);
    front = exp(-x * x);
  }
  float presence = field.r * shown;
  float bright = field.g * 1.8;
  float level = spark.r;
  float hue = clamp(spark.g / max(level, 0.004), 0.0, 1.0);
  float hot = clamp(spark.b / max(level, 0.004), 0.0, 1.0);
  float boot = front * presence * 0.42;
  float booting = step(level, boot);
  level = max(level, boot);
  hue *= 1.0 - booting;
  hot *= 1.0 - booting;

  ivec2 lane = (ivec2(slot) + uGridStep - uGridShift) % uGridStep;
  float edgeX = float(lane.x == 0) * step(local.x, 1.0 - 0.5 * uPitch.x);
  float edgeY = float(lane.y == 0) * step(local.y, 1.0 - 0.5 * uPitch.y);
  vec3 lab = mix(uBase, uLine, uGridAlpha * max(edgeX, edgeY) * shown);

  float grow = mix(0.4, 1.0, smoothstep(0.0, 1.0, presence));
  float morph = smoothstep(0.05, 0.2, level);
  float dist = mix(rest(local, uCellExtent * grow), box(local, vec2(uBarExtent.x + uBarWiden * hot, uBarExtent.y), 0.0), morph);
  float cover = clamp(0.5 - dist, 0.0, 1.0) * max(step(0.002, presence), morph);

  vec3 still = mix(uBase, uTint, clamp(uLevel * presence * bright, 0.0, 1.0));
  vec3 sparkColor = mix(mix(uSparkA, uSparkB, hue), uHot, hot * smoothstep(0.5, 1.0, level));
  lab = mix(lab, mix(still, sparkColor, smoothstep(0.0, 0.8, level)), cover);

  vec2 texel = 1.0 / vec2(uCells);
  vec4 halo = texture(uSpark, rel / uPitch * texel);
  float glow = halo.r * halo.r * uGlow * (1.0 - 0.7 * cover);
  vec3 glowColor = mix(uSparkA, uSparkB, clamp(halo.g / max(halo.r, 0.004), 0.0, 1.0));
  lab = mix(lab, glowColor, glow * 0.16 * uInk);

  vec3 light = max(toLight(lab), 0.0) + max(toLight(glowColor), 0.0) * glow * 0.2 * (1.0 - uInk);
  light /= max(max(light.r, max(light.g, light.b)), 1.0);
  vec3 color = toDisplay(light);
  float mask = clamp(distance(lab, uBase) * 6.0 + glow * 4.0, 0.0, 1.0);
  color += (hash12(gl_FragCoord.xy + fract(uTick * 13.0) * 911.0) - 0.5) * uGrain * 0.1 * mask;
  color += (hash12(gl_FragCoord.xy * 1.7 + 3.1) - 0.5) / 255.0 * mask;
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`,b=(e,t,a)=>Math.min(a,Math.max(t,e)),M=(e,t)=>"number"==typeof e&&Number.isFinite(e)?e:t,w=(e,t,a)=>{let l=b((a-e)/(t-e),0,1);return l*l*(3-2*l)},k=e=>{let t=b(e,0,1);return t*t*t*(t*(6*t-15)+10)},S=(e,t,a,l,r)=>{let n=e-a,o=t+l*n,i=Math.exp(-l*r);return[a+(n+o*r)*i,(t-l*o*r)*i]},C=e=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");return t.addEventListener("change",e),()=>t.removeEventListener("change",e)},A=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,E=e=>{let t=Math.floor(0x9e3779b1*e)>>>0||1;return()=>(t^=t<<13,t^=t>>>17,((t^=t<<5)>>>0)%1e5/1e5)},F=e=>{let t=e>>>0;return((t=Math.imul(t=((t=Math.imul(t=(t^t>>>16)>>>0,0x7feb352d)>>>0)^t>>>15)>>>0,0x846ca68b)>>>0)^t>>>16)>>>0},T=(e,t,a,l,r)=>{let n=(F(Math.imul(e,0x9e3779b1)^F(t^a))>>>8)*p;return Math.cos(n)*l+Math.sin(n)*r},B=(e,t,a)=>{let l=Math.floor(e),r=Math.floor(t),n=e-l,o=t-r,i=n*n*n*(n*(6*n-15)+10),s=o*o*o*(o*(6*o-15)+10),u=l+32768>>>0,h=r+32768>>>0,c=T(u,h,a,n,o),d=T(u+1,h,a,n-1,o),f=T(u,h+1,a,n,o-1),p=T(u+1,h+1,a,n-1,o-1),m=c+(d-c)*i;return(m+(f+(p-f)*i-m)*s)*1.41421356},L=(e,t,a,l)=>{let r=e+.7*B(.6*e+.031*a,.6*t+4.7,l),n=t+.7*B(.6*e+9.2,.6*t-.027*a,l);return .6*B(r+.045*a,n-.018*a,l)+.28*B(2.07*r+13.1-.07*a,2.07*n+.05*a,l)+.12*B(4.23*r+.11*a,4.23*n+27.3+.09*a,l)},G=null,j=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,R=(e,t)=>{let a=new s.Q1f(t);try{a.set(e)}catch{a.set(t)}let l=a.getRGB({r:0,g:0,b:0},s.er$),r=j(l.r),n=j(l.g),o=j(l.b),i=Math.cbrt(.4122214708*r+.5363325363*n+.0514459929*o),u=Math.cbrt(.2119034982*r+.6806995451*n+.1073969566*o),h=Math.cbrt(.0883024619*r+.2817188376*n+.6299787005*o);return[.2104542553*i+.793617785*u-.0040720468*h,1.9779984951*i-2.428592205*u+.4505937099*h,.0259040371*i+.7827717662*u-.808675766*h]},P=([e,t,a])=>{let l=(e+.3963377774*t+.2158037573*a)**3,r=(e-.1055613458*t-.0638541728*a)**3,n=(e-.0894841775*t-1.291485548*a)**3;return[4.0767416621*l-3.3077115913*r+.2309699292*n,-1.2684380046*l+2.6097574011*r-.3413193965*n,-.0041960863*l-.7034186147*r+1.707614701*n]},q=e=>{let[t,a,l]=P(e);return Math.min(t,a,l)>-5e-4&&1.0005>Math.max(t,a,l)},O=([e,t,a])=>({L:e,C:Math.hypot(t,a),h:180*Math.atan2(a,t)/Math.PI}),I=(e,t,a)=>[e,t*Math.cos(a*Math.PI/180),t*Math.sin(a*Math.PI/180)],Y=(e,t,a)=>{let l=b(e,0,1),r=0,n=Math.max(0,t);if(q(I(l,n,a)))return I(l,n,a);for(let e=0;e<20;e+=1){let e=(r+n)/2;q(I(l,e,a))?r=e:n=e}return I(l,r,a)},z=(e,t,a)=>[e[0]+(t[0]-e[0])*a,e[1]+(t[1]-e[1])*a,e[2]+(t[2]-e[2])*a],W=e=>P(e).map(e=>{let t;return Math.round(255*b((t=b(e,0,1))<=.0031308?12.92*t:1.055*t**(1/2.4)-.055,0,1))}),U=(e,t)=>{let a=t%2,l=2*Math.round((e-a)/2)+a;return Math.max(a||2,l)},X=e=>String(Math.max(0,Math.round(e))).padStart(3,"0"),D=()=>({mode:0,wait:0,x:0,y:0,vx:0,vy:0,life:0,check:0,alpha:0,scale:1,spin:0,focus:0,focusGoal:0,focusUntil:0,glint:0,filled:!1,group:-1,labelled:!1,labelAt:0,labelOut:-1,corner:0}),_=()=>({l:0,t:0,r:0,b:0,vl:0,vt:0,vr:0,vb:0,alpha:0}),

$=(0,r.forwardRef)(function({colors:e=c,backgroundColor:t="#0A0A0A",cellSize:a=9,cellAspect:n=1.33,shape:o="rect",coverage:i=.66,scale:p=1,drift:g=1,brightness:T=1,twinkle:j=1,signals:P=1,traceLength:q=7,points:I=24,labels:$=6,rays:H=1,target:N=d,focus:V=1,regions:K=!0,status:Z=!0,grid:Q=1,glow:J=1,grain:ee=0,speed:et=1,seed:ea=0,interactive:el=!0,intro:er=!0,paused:en=!1,className:eo,style:ei,children:es},eu){let eh=(0,r.useRef)(null),ec=(0,r.useRef)(null),ed=(0,r.useRef)(null),ef=(0,r.useRef)(()=>{}),ep=(0,r.useRef)(()=>{}),em=(0,r.useRef)(()=>{}),ev=(0,r.useRef)(!1),eg=(0,r.useSyncExternalStore)(C,A,()=>!1),ex=Array.isArray(e)&&"string"==typeof e[0]?e[0]:c[0],ey=Array.isArray(e)&&"string"==typeof e[1]?e[1]:c[1],eb=Array.isArray(N)?M(N[0],d[0]):d[0],eM=Array.isArray(N)?M(N[1],d[1]):d[1],ew=(0,r.useRef)({first:ex,second:ey,backgroundColor:t,cellSize:a,cellAspect:n,shape:o,coverage:i,scale:p,drift:g,brightness:T,twinkle:j,signals:P,traceLength:q,points:I,labels:$,rays:H,targetX:eb,targetY:eM,focus:V,regions:K,status:Z,grid:Q,glow:J,grain:ee,speed:et,seed:ea,interactive:el,paused:en});return(0,r.useEffect)(()=>{ew.current={first:ex,second:ey,backgroundColor:t,cellSize:a,cellAspect:n,shape:o,coverage:i,scale:p,drift:g,brightness:T,twinkle:j,signals:P,traceLength:q,points:I,labels:$,rays:H,targetX:eb,targetY:eM,focus:V,regions:K,status:Z,grid:Q,glow:J,grain:ee,speed:et,seed:ea,interactive:el,paused:en}}),(0,r.useImperativeHandle)(eu,()=>({replay:()=>ef.current(),flash:(e,t)=>ep.current(e,t)}),[]),(0,r.useEffect)(()=>{let e,t=eh.current,a=ec.current,l=ed.current;if(!t||!a||!l)return;let r=l.getContext("2d");if(!r)return;let n=t.ownerDocument,o=n.defaultView??window;try{e=new u.WebGLRenderer({canvas:a,antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:"high-performance"})}catch{return}e.outputColorSpace=s.Zr2,e.setPixelRatio(1);let i=new s.nWS(1,1,{type:s.OUM,format:s.GWd,minFilter:s.hxR,magFilter:s.hxR,generateMipmaps:!1,depthBuffer:!1,stencilBuffer:!1}),h=new Uint8Array(4),d=new s.GYF(h,1,1,s.GWd,s.OUM),p={uOriginCss:{value:new s.I9Y},uPitchCss:{value:new s.I9Y(9,12)},uFreq:{value:.004347826086956522},uTime:{value:0},uThreshold:{value:0},uSeed:{value:0}},g={uSize:{value:new s.I9Y(1,1)},uPitch:{value:new s.I9Y(18,24)},uOrigin:{value:new s.I9Y},uCells:{value:new s.I9Y(1,1)},uGridStep:{value:new s.I9Y(10,8)},uGridShift:{value:new s.I9Y},uField:{value:i.texture},uSpark:{value:d},uBase:{value:new s.Pq0},uTint:{value:new s.Pq0},uSparkA:{value:new s.Pq0},uSparkB:{value:new s.Pq0},uHot:{value:new s.Pq0},uLine:{value:new s.Pq0},uLevel:{value:.3},uCellExtent:{value:new s.I9Y(6,9)},uBarExtent:{value:new s.I9Y(3,9)},uBarWiden:{value:2},uShape:{value:0},uGlow:{value:1},uInk:{value:0},uGridAlpha:{value:.06},uScan:{value:new s.Pq0(0,0,1e6)},uScanBand:{value:60},uGrain:{value:0},uTick:{value:0}},C=new s.BKk({glslVersion:s.Wdf,vertexShader:v,fragmentShader:x,uniforms:p,depthTest:!1,depthWrite:!1}),A=new s.BKk({glslVersion:s.Wdf,vertexShader:v,fragmentShader:y,uniforms:g,depthTest:!1,depthWrite:!1}),T=new s.LoY;T.setAttribute("position",new s.qtW([-1,-1,0,3,-1,0,-1,3,0],3));let j=new s.eaF(T,A);j.frustumCulled=!1;let P=new s.Z58;P.add(j);let q=new s.i7d,I=E(M(ew.current.seed,0)+3.7),$=[],H=[],N=[_(),_()],V={x:0,y:0,inside:!1,tapUntil:-1},K={x:0,y:0,vx:0,vy:0,gx:0,gy:0,gliding:!1,fromX:0,fromY:0,toX:0,toY:0,at:0,dur:1,dwellUntil:0,still:0,locked:!1,alpha:0,scale:1,spin:0,tagAt:0,placed:!1},Z=[6.28*I(),6.28*I(),6.28*I(),6.28*I()],Q=1,J=1,ee=1,et=1,ea=1,el=18,en=24,eo=0,ei=0,es=0,eu=0,ex=0,ey=0,eb=0,eM=0,ek=new Int32Array(1).fill(-1),eS=new Int32Array(8192),eC=new Float32Array(8192),eA=new Float32Array(8192),eE=new Float32Array(8192),eF=new Float32Array(8192),eT=new Float32Array(8192),eB=new Float32Array(8192),eL=0,eG=!0,ej=0,eR=400*I(),eP=0,eq=0,eO=1.2,eI=0,eY=.004347826086956522,ez=0,eW=9,eU=1,eX=19,eD=[10,10,10],e_=[226,230,229],e$=[180,220,205],eH=[150,228,203],eN=[136,231,234],eV=er&&!eg&&!ev.current,eK=0,eZ=0,eQ=0,eJ=0,e0=1,e1=1e6,e2=60,e5=20,e3=12,e6=3,e4=0,e8=!1,e9=0,e7=!0,te=!1,tt={value:0,heat:0},ta={r:0,b:0},tl=(e,t)=>e-eX<ta.r&&t-eX<ta.b,tr=(e,t)=>{let a=(es+(e+.5)*el)/ee*eY,l=(eu+(t+.5)*en)/ee*eY,r=L(a,l,eR,ez),n=.5*B(5.3*a+31.7,5.3*l-.05*eR,ez)+.5,o=w(eI-.08,eI+.14,r)*(.8+.2*n)*1.12,i=(F(Math.imul(e,0x85ebca6b)^F(Math.imul(t,0xc2b2ae35)^ez+101>>>0))>>>8)/0x1000000;return tt.value=w(i-.06,i+.06,o),tt.heat=w(eI,eI+.35,r),tt},tn=e=>b(Math.round((e*ee-es)/el-.5),ex,ey),to=e=>b(Math.round((e*ee-eu)/en-.5),eb,eM),ti=e=>(es+(e%eo+.5)*el)/ee,ts=e=>(eu+(Math.floor(e/eo)+.5)*en)/ee,tu=(e,t)=>Math.hypot(e*ee-eZ,t*ee-eQ),th=e=>!eV||tu(ti(e),ts(e))<e1-e2,tc=()=>{for(let e=0;e<eL;e+=1)ek[eS[e]]=-1;eL=0,h.fill(0),eG=!0,$.length=0},td=e=>{let t=ej-eC[e];if(t<.045)return eA[e]+(eE[e]-eA[e])*k(t/.045);let a=(t-.045)/eB[e];return a>=1?-1:eE[e]*(Math.exp(-3.2*a)-f)/(1-f)},tf=(e,t,a,l,r)=>{if(e<0||e>=ek.length)return;let n=ek[e];if(n<0){if(eL>=8192)return;n=eL,eL+=1,ek[e]=n,eS[n]=e,eA[n]=0}else eA[n]=Math.max(0,td(n));eC[n]=ej,eE[n]=Math.max(t,eA[n]),eF[n]=a,eT[n]=l,eB[n]=r},tp=e=>{for(let t=0;t<10;t+=1){let t=ex+Math.floor(I()*(ey-ex+1)),a=eb+Math.floor(I()*(eM-eb+1)),l=a*eo+t;if(!th(l))continue;let r=tr(t,a);if(r.value>e&&I()<.35+.65*r.heat)return l}return -1},tm=(e,t,a,l,r,n)=>{if($.length>=640||0===e.length)return;let o=[],i=[],s=[];for(let l=0;l<e.length;l+=1){let e=+(I()<t);o.push(e?1:n+I()*(1-n)),i.push(+(I()<a)),s.push(e)}$.push({cells:e,peaks:o,hues:i,hots:s,start:ej,rate:l,decay:r,head:0})},tv=()=>{let e=tp(.3);if(e<0)return;let t=e%eo,a=Math.floor(e/eo),l=I(),r=l<.42?1:l<.84?2:3,n=.18>I(),o=.5>I()?-1:1,i=[e];for(let e=1;e<r&&(n?a+=1:t+=o,!(t<ex)&&!(t>ey)&&!(a>eM));e+=1)i.push(a*eo+t);tm(i,.1,.06,140,.32+.3*I(),.5)},tg=(e,t,a,l)=>{let r=e>=0?e:tp(.5);if(r<0)return;let n=b(Math.round(b(M(ew.current.traceLength,7),1,40)*a*(.55+.9*I())),2,64),o=t||(.5>I()?-1:1),i=r%eo,s=Math.floor(r/eo),u=!0,h=[r];for(let e=1;e<n;e+=1){if(!u&&.16>I()){let e=s+(.5>I()?-1:1);if(e<eb||e>eM)break;s=e,u=!0}else i+=o,u=!1;if(i<ex||i>ey)break;let e=s*eo+i;if(!l&&(!th(e)||tr(i,s).value<.15))break;h.push(e)}(!(h.length<2)||l)&&tm(h,l?.3:.15,l?.35:.12,46*(.8+.4*I()),.75,.55)},tx=e=>Q*(0===e?.24+.05*Math.sin(.07*ej+Z[0]):.77+.05*Math.sin(.06*ej+Z[2])),ty=e=>J*(0===e?.66+.06*Math.cos(.05*ej+Z[1]):.3+.06*Math.cos(.08*ej+Z[3])),tb=()=>{let e=0;for(let t of H)t.labelled&&t.labelOut<0&&(e+=1);return e},tM=e=>{let t=ew.current,a=I(),l=t.regions?a<.32?0:a<.64?1:-1:-1,r=.085*Math.min(Q,J),n=Math.max(eX,.03*Math.min(Q,J)),o=(2.3*eX)**2;for(let a=0;a<14;a+=1){let a,i;if(l>=0){let e=I()*Math.PI*2,t=r*Math.sqrt(-2*Math.log(1-.98*I()))*.75;a=tx(l)+Math.cos(e)*t,i=ty(l)+Math.sin(e)*t}else a=n+I()*(Q-2*n),i=n+I()*(J-2*n);if(a<n||a>Q-n||i<n||i>J-n)continue;let s=tn(a),u=to(i),h=u*eo+s,c=ti(h),d=ts(h);if(eV){let e=tu(c,d);if(e>e1-e2||e<e1-3.2*e2)continue}if(tr(s,u).value<.55||tl(c,d)||Math.abs(c-K.x)<4*eX&&Math.abs(d-K.y)<3*eX)continue;let f=!1;for(let t of H)if(t!==e&&1===t.mode&&(t.x-c)**2+(t.y-d)**2<o){f=!0;break}if(f)continue;e.mode=1,e.x=c,e.y=d,e.vx=0,e.vy=0,e.life=8+12*I(),e.check=.3,e.alpha=0,e.scale=2,e.spin=0,e.focus=0,e.focusGoal=0,e.filled=.38>I(),e.group=l;let p=Math.round(b(M(t.labels,6),0,16));return e.labelled=tb()<p,e.labelAt=ej+.16,e.labelOut=-1,tf(h,.95,0,.5,.5),!0}return!1},tw=e=>{e.mode=2,e.focusGoal=0,e.labelled&&e.labelOut<0&&(e.labelOut=ej)},tk=(e,t)=>{e.focusGoal=1,e.focusUntil=ej+t,e.glint=ej},tS=(e,t,a)=>{let l=null,r=a;for(let a of H){if(1!==a.mode||a.alpha<.8)continue;let n=Math.hypot(a.x-e,a.y-t);n<r&&(r=n,l=a)}l&&tk(l,1.6+.6*I())},tC=e=>{let t=eX*(1+e.focus)/2-2,a=tn(e.x-t),l=tn(e.x+t),r=to(e.y-t),n=to(e.y+t);for(let o=r;o<=n;o+=1)for(let r=a;r<=l;r+=1){let a=o*eo+r,l=ti(a),n=ts(a);!(Math.abs(l-e.x)>t||Math.abs(n-e.y)>t)&&(.18>I()||tf(a,.8+.2*I(),1,+(.14>I()),.42))}},tA=()=>{let e=ew.current;K.x=K.gx=K.fromX=K.toX=b(e.targetX,.05,.95)*Q,K.y=K.gy=K.fromY=K.toY=b(e.targetY,.05,.95)*J,K.vx=0,K.vy=0,K.gliding=!1,K.dwellUntil=ej+2.6,K.placed=!0},tE=()=>{var e,t,a;let l,r,n,o,i,s,u,h,d,f=ew.current,m=(e=f.first,t=f.second,l=R(f.backgroundColor,"#0A0A0A"),r=O(R(e,c[0])),n=O(R(t,c[1])),o=w(.5,.72,l[0]),i={tint:Y(r.L,r.C,r.h),sparkA:Y(Math.max(r.L,.8),r.C,r.h),sparkB:Y(Math.max(n.L,.78),n.C,n.h),hot:Y(.97,.3*Math.min(r.C,.12),r.h),line:Y(.9,.012,r.h),mark:Y(.86,.55*Math.min(r.C,.1),r.h),aim:Y(Math.max(r.L,.82),r.C,r.h),focus:Y(Math.max(n.L,.84),n.C,n.h)},s={tint:Y(Math.min(r.L,.56),1.05*r.C,r.h),sparkA:Y(b(r.L,.46,.6),1.25*r.C,r.h),sparkB:Y(b(n.L,.44,.58),1.25*n.C,n.h),hot:Y(.32,.85*r.C,r.h),line:Y(.26,.012,r.h),mark:Y(.36,.7*Math.min(r.C,.1),r.h),aim:Y(.48,1.2*r.C,r.h),focus:Y(.5,1.2*n.C,n.h)},{base:l,ink:o,tint:z(i.tint,s.tint,o),sparkA:z(i.sparkA,s.sparkA,o),sparkB:z(i.sparkB,s.sparkB,o),hot:z(i.hot,s.hot,o),line:z(i.line,s.line,o),mark:z(i.mark,s.mark,o),aim:z(i.aim,s.aim,o),focus:z(i.focus,s.focus,o)});g.uBase.value.set(...m.base),g.uTint.value.set(...m.tint),g.uSparkA.value.set(...m.sparkA),g.uSparkB.value.set(...m.sparkB),g.uHot.value.set(...m.hot),g.uLine.value.set(...m.line),g.uInk.value=m.ink,g.uLevel.value=(.34+.03*m.ink)*b(M(f.brightness,1),0,3),g.uGlow.value=b(M(f.glow,1),0,3),g.uGridAlpha.value=(.07+.02*m.ink)*b(M(f.grid,1),0,4),g.uGrain.value=b(M(f.grain,0),0,1),g.uShape.value=Math.max(0,["rect","square","dot","diamond"].indexOf(f.shape)),eD=W(m.base),e_=W(m.line),e$=W(m.mark),eH=W(m.aim),eN=W(m.focus),a=b(M(f.coverage,.66),0,1),u=(()=>{if(G)return G;let e=E(7),t=new Float32Array(4e3);for(let a=0;a<4e3;a+=1)t[a]=L(300*e()+40,300*e()+40,200*e(),0);t.sort();let a=new Float32Array(101);for(let e=0;e<=100;e+=1)a[e]=t[Math.min(3999,Math.round(e/100*3999))];return G=a,a})(),eI=u[d=Math.min(99,Math.floor(h=100*b(1-a,0,1)))]+(u[d+1]-u[d])*(h-d),p.uThreshold.value=eI,eY=1/(230*b(M(f.scale,1),.2,6)),p.uFreq.value=eY,ez=7919*Math.floor(Math.abs(M(f.seed,0)))%0x1000000,p.uSeed.value=ez;let v=Math.round(b(M(f.points,24),0,64)*b(Math.sqrt(Q*J/921600),.5,1.5));for(;H.length<v;){let e=D();e.wait=eV?.25+H.length/Math.max(1,v)*1.92:.1+1.2*I(),H.push(e)}H.length>v&&(H=H.slice(0,v))},tF=()=>{let a=ew.current;Q=Math.max(1,t.clientWidth),J=Math.max(1,t.clientHeight),ee=b(Math.min(o.devicePixelRatio||1,3,Math.sqrt(9e6/(Q*J))),.75,3),et=Math.max(1,Math.round(Q*ee)),ea=Math.max(1,Math.round(J*ee)),e.setSize(et,ea,!1),l.width!==et&&(l.width=et),l.height!==ea&&(l.height=ea);let n=b(M(a.cellSize,9),4,48),u=b(M(a.cellAspect,1.33),.6,2.5);eW=n;let c=Math.max(3,Math.round(n*ee)),f=Math.max(3,Math.round(n*u*ee)),v=Math.ceil(et/c)+1,x=Math.ceil(ea/f)+1,y=Math.floor((et-v*c)/2),w=Math.floor((ea-x*f)/2),k=c!==el||f!==en||v!==eo||x!==ei||y!==es||w!==eu;el=c,en=f,es=y,eu=w,v!==eo||x!==ei?(eo=v,ei=x,i.setSize(eo,ei),d.dispose(),h=new Uint8Array(eo*ei*4),(d=new s.GYF(h,eo,ei,s.GWd,s.OUM)).minFilter=s.k6q,d.magFilter=s.k6q,d.generateMipmaps=!1,d.needsUpdate=!0,g.uSpark.value=d,ek=new Int32Array(eo*ei).fill(-1),eL=0,$.length=0):k&&tc(),ex=Math.max(0,Math.ceil(-es/el-.5)),ey=Math.min(eo-1,Math.floor((et-es)/el-.5)),eb=Math.max(0,Math.ceil(-eu/en-.5)),eM=Math.min(ei-1,Math.floor((ea-eu)/en-.5)),g.uSize.value.set(et,ea),g.uPitch.value.set(el,en),g.uOrigin.value.set(es,eu),g.uCells.value.set(eo,ei);let S=Math.max(2,Math.round(96/n)),C=Math.max(2,Math.round(96/(n*u)));g.uGridStep.value.set(S,C),g.uGridShift.value.set(Math.floor(eo/2)%S,Math.floor(ei/2)%C),p.uOriginCss.value.set(es/ee,eu/ee),p.uPitchCss.value.set(el/ee,en/ee);let A=Math.max(0,["rect","square","dot","diamond"].indexOf(a.shape));if(1===A){let e=U(.56*Math.min(el,en),el);g.uCellExtent.value.set(e/2,e/2)}else if(2===A){let e=.3*Math.min(el,en);g.uCellExtent.value.set(e,e)}else 3===A?g.uCellExtent.value.set(.4*el,.42*en):g.uCellExtent.value.set(U(.56*el,el)/2,U(.64*en,en)/2);let E=U(.34*el,el),F=U(.76*en,en),T=U(.52*el,el);g.uBarExtent.value.set(E/2,F/2),g.uBarWiden.value=Math.max(0,(T-E)/2),eU=b(n/9,.8,1.6),eX=b(2.1*n,14,44),e5=Math.max(8,Math.round(12*eU*b(Q/720,.84,1)*ee)),r.font=`${e5}px ${m}`,e3=r.measureText("0").width,e6=Math.round(.16*e5),K.placed||tA(),eZ=K.x*ee,eQ=K.y*ee;let B=b(eZ,0,et),L=b(eQ,0,ea);eJ=Math.hypot(eZ-B,eQ-L),e0=Math.max(Math.hypot(eZ,eQ),Math.hypot(eZ-et,eQ),Math.hypot(eZ,eQ-ea),Math.hypot(eZ-et,eQ-ea)),e2=3.2*Math.max(el,en)},tT=e=>{let t=Math.max(1,(ey-ex+1)*(eM-eb+1));return e*b(M(ew.current.coverage,.66),.05,1)*.75*t},tB=e=>{let t,a,l,r=ew.current;if(ej+=e,eR+=e*b(M(r.drift,1),0,6),eV){let t=b((eK+=e)/2.4,0,1);e1=eJ-e2+(e0-eJ+2*e2)*(1-(1-t)**3),t>=1&&(eV=!1,e1=1e6)}let n=tT(.13*b(M(r.twinkle,1),0,4));if(n>0){eP-=e;let t=0;for(;eP<=0&&t<40;)tv(),eP+=-Math.log(1-.999*I())/n,t+=1;eP<0&&(eP=0)}let o=tT(b(M(r.signals,1),0,4)/1100);if(o>0){eq-=e;let t=0;for(;eq<=0&&t<8;)tg(-1,0,1,!1),eq+=-Math.log(1-.999*I())/o,t+=1;eq<0&&(eq=0)}(()=>{for(let e=$.length-1;e>=0;e-=1){let t=$[e],a=Math.min(t.cells.length,Math.floor((ej-t.start)*t.rate)+1);for(;t.head<a;){let e=t.head;tf(t.cells[e],t.peaks[e],t.hues[e],t.hots[e],t.decay),t.head+=1}t.head>=t.cells.length&&$.splice(e,1)}for(let e=eL-1;e>=0;e-=1){let t=eS[e],a=td(e),l=4*t;if(a<0)h[l]=0,h[l+1]=0,h[l+2]=0,ek[t]=-1,e!==(eL-=1)&&(eS[e]=eS[eL],eC[e]=eC[eL],eA[e]=eA[eL],eE[e]=eE[eL],eF[e]=eF[eL],eT[e]=eT[eL],eB[e]=eB[eL],ek[eS[e]]=e);else{let t=255*b(a,0,1);h[l]=t,h[l+1]=t*eF[e],h[l+2]=t*eT[e],h[l+3]=255}eG=!0}})();let i=Math.max(eX,.03*Math.min(Q,J));for(let t of H){if(0===t.mode)t.wait-=e,t.wait<=0&&!tM(t)&&(t.wait=eV?.05:.25);else if(1===t.mode){t.life-=e;let a=4.2*Math.sqrt(e);t.vx+=-t.vx/2.4*e+(I()+I()+I()-1.5)*2*a,t.vy+=-t.vy/2.4*e+(I()+I()+I()-1.5)*2*a,t.x+=t.vx*e,t.y+=t.vy*e,(t.x<i&&t.vx<0||t.x>Q-i&&t.vx>0)&&(t.vx*=-1),(t.y<i&&t.vy<0||t.y>J-i&&t.vy>0)&&(t.vy*=-1),t.check-=e,t.check<=0&&(t.check=.3,(tr(tn(t.x),to(t.y)).value<.1||tl(t.x,t.y))&&(t.life=Math.min(t.life,.4))),t.focusGoal>0&&ej>t.focusUntil&&(t.focusGoal=0),t.focus>.3&&ej>=t.glint&&(tC(t),t.glint=ej+.11+.07*I()),t.life<=0&&tw(t)}else t.alpha<.01&&(t.mode=0,t.alpha=0,t.labelled=!1,t.wait=.3+1.4*I());[t.scale,t.spin]=S(t.scale,t.spin,2===t.mode?1.35:1,14,e),t.alpha+=((1===t.mode)-t.alpha)*(1-Math.exp(-e/(1===t.mode?.12:.22))),t.focus+=(t.focusGoal-t.focus)*(1-Math.exp(-e/.16)),t.labelled&&t.labelOut>=0&&ej-t.labelOut>.2&&(t.labelled=!1,t.labelOut=-1)}let s=b(M(ew.current.focus,1),0,4);if(s>0&&!eV&&(eO-=e)<=0){eO=(1.3+1.5*I())/s;let e=H.filter(e=>1===e.mode&&e.alpha>.9&&e.focus<.1);e.length>0&&tk(e[Math.floor(I()*e.length)],1.1+.8*I())}t=ew.current,a=eX/2,l=1.5*eW,N.forEach((r,n)=>{let o=0,i=1/0,s=1/0,u=-1/0,h=-1/0;for(let e of H)1!==e.mode||e.group!==n||e.alpha<.6||(o+=1,i=Math.min(i,e.x-a),s=Math.min(s,e.y-a),u=Math.max(u,e.x+a),h=Math.max(h,e.y+a));let c=t.regions&&o>=2?1:0;c>0&&(i-=l,s-=l,u+=l,h+=l,r.alpha<.02&&(r.l=i-2*l,r.t=s-2*l,r.r=u+2*l,r.b=h+2*l,r.vl=r.vt=r.vr=r.vb=0),[r.l,r.vl]=S(r.l,r.vl,i,3.2,e),[r.t,r.vt]=S(r.t,r.vt,s,3.2,e),[r.r,r.vr]=S(r.r,r.vr,u,3.2,e),[r.b,r.vb]=S(r.b,r.vb,h,3.2,e)),r.alpha+=(c-r.alpha)*(1-Math.exp(-e/.35))})},tL=e=>{let t=ew.current,a=!eg&&!t.paused,l=a?e*b(M(t.speed,1),0,4):0;return l>0&&tB(l),((e,t)=>{let a=ew.current,l=a.interactive&&!a.paused&&!eg&&(V.inside||V.tapUntil>ej);if(l)K.gx=V.x,K.gy=V.y,K.gliding=!1,K.dwellUntil=ej+2.4;else if(t>0){if(K.gliding){let e=(ej-K.at)/K.dur,t=k(e);K.gx=K.fromX+(K.toX-K.fromX)*t,K.gy=K.fromY+(K.toY-K.fromY)*t,e>=1&&(K.gliding=!1,K.dwellUntil=ej+3+2.6*I())}else if(ej>K.dwellUntil&&!eV){let e,t,a,l,r,n=(t=b((e=ew.current).targetX,.1,.9)*Q,a=b(e.targetY,.1,.9)*J,l=I()*Math.PI*2,{x:b(t+Math.cos(l)*(r=.35+.65*I())*.2*Q,.12*Q,.88*Q),y:b(a+Math.sin(l)*r*.18*J,.14*J,.86*J)});K.fromX=K.gx,K.fromY=K.gy,K.toX=n.x,K.toY=n.y,K.at=ej,K.dur=1.5+.9*I(),K.gliding=!0}}let r=Math.min(e,.05),n=l?11:20;[K.x,K.vx]=S(K.x,K.vx,K.gx,n,r),[K.y,K.vy]=S(K.y,K.vy,K.gy,n,r);let o=Math.hypot(K.vx,K.vy);K.still=o<14?K.still+r:0,!K.locked&&K.still>.45?(K.locked=!0,K.tagAt=ej,K.scale=Math.max(K.scale,1.18),t>0&&tS(K.x,K.y,6*eX)):K.locked&&o>60&&(K.locked=!1,K.tagAt=ej),[K.scale,K.spin]=S(K.scale,K.spin,1,15,r),K.alpha+=(1-K.alpha)*(1-Math.exp(-r/.2))})(e,l),p.uTime.value=eR,g.uScan.value.set(eZ,eQ,eV?e1:1e6),g.uScanBand.value=e2,g.uTick.value=24*ej%1e3,eG&&(d.needsUpdate=!0,eG=!1),a},tG=(e,t)=>`rgba(${e[0]},${e[1]},${e[2]},${b(t,0,1).toFixed(3)})`,tj=e=>e.length*(e3+e6)-e6,tR=(e,t,a,l,n)=>{let o=e3+e6;for(let i=0;i<l;i+=1){let s=e[i];n&&i>=l-2&&s>="0"&&s<="9"&&(s=String(Math.floor(10*I()))),r.fillText(s,t+i*o,a)}},tP=(e,t)=>b(Math.floor((ej-t)/.026),0,e.length),tq=(e,t,a,l,n,o)=>{let i=tP(e,l),s=Math.round(.55*e5),u=Math.round(1.75*e5),h=Math.round(tj(e)+2*s),c=Math.max(1,Math.round(ee)),d=Math.round(t),f=Math.round(a);return r.fillStyle=tG(eD,.82*n),r.fillRect(d,f,h,u),r.strokeStyle=tG(e_,.5*n),r.lineWidth=c,r.strokeRect(d+c/2,f+c/2,h-c,u-c),r.fillStyle=tG(o,.92*n),tR(e,d+s,f+u/2,i,i<e.length),{w:h,h:u}},tO=(e,t,a,l,n)=>{let o=K.x*ee,i=K.y*ee,{left:s,top:u,size:h}=tI(e),c=s+h/2-o,d=u+h/2-i,f=Math.abs(c),p=Math.abs(d);if(f+p<1)return;let m=Math.min(f>1e-6?l/2/f:1/0,p>1e-6?n/2/p:1/0),v=1-h/2/Math.max(f,p);if(v-m<=.02)return;let g=o+c*m,x=i+d*m,y=o+c*v,b=i+d*v,M=r.createLinearGradient(g,x,y,b);M.addColorStop(0,tG(e_,.3*t)),M.addColorStop(1,tG(e_,t)),r.strokeStyle=M,r.lineWidth=a,r.beginPath(),r.moveTo(g,x),r.lineTo(y,b),r.stroke()},tI=e=>{let t=eX*e.scale*(1+e.focus)*ee;return{left:Math.round(e.x*ee-t/2),top:Math.round(e.y*ee-t/2),size:Math.round(t)}},tY=()=>{j.material=C,e.setRenderTarget(i),e.render(P,q),e.setRenderTarget(null),j.material=A,g.uField.value=i.texture,e.render(P,q),(()=>{r.setTransform(1,0,0,1,0,0),r.clearRect(0,0,et,ea);let e=ew.current;r.font=`${e5}px ${m}`,r.textBaseline="middle",r.textAlign="left";let t=Math.max(1,Math.round(ee)),a=6*ee,l=.42*b(M(e.rays,1),0,3),n=Math.max(1,Math.round(.5*ee)),o=Math.round(5*eW*ee*K.scale),i=Math.round(3.2*eW*ee*K.scale),s=b(M(e.labels,6),0,16),u=Math.round(1.75*e5),h=[],c=(e,t,a,l)=>{h.push(e,t,a,l)},d=(e,t,l,r)=>{if(e<a||t<a||l>et-a||r>ea-a)return!1;for(let a=0;a<h.length;a+=4)if(e<h[a+2]&&l>h[a]&&t<h[a+3]&&r>h[a+1])return!1;return!0};for(let e of H){if(e.alpha<.01||!e.filled)continue;let{left:t,top:a,size:l}=tI(e);r.fillStyle=tG(eD,.62*e.alpha*(1-e.focus)),r.fillRect(t,a,l,l)}if(l>0)for(let e of H)e.alpha>.01&&tO(e,l*e.alpha*K.alpha,n,o,i);let f=[];if(e.regions){let e=N[0].alpha>.01&&N[1].alpha>.01;N.forEach((a,l)=>{let n;if(a.alpha<.01)return;let o=Math.round(a.l*ee),i=Math.round(a.t*ee),h=Math.round(a.r*ee),c=Math.round(a.b*ee);r.strokeStyle=tG(e_,.38*a.alpha),r.lineWidth=t,r.strokeRect(o+t/2,i+t/2,h-o-t,c-i-t),s>0&&f.push({text:`SECTOR ${(n=(N[l].l+N[l].r)/2,!e?n<Q/2?"L":"R":n<=(N[1-l].l+N[1-l].r)/2?"L":"R")}`,x:o,y:i-u-Math.round(4*ee),alpha:a.alpha})})}for(let e of H){if(e.alpha<.01)continue;let{left:a,top:l,size:n}=tI(e);r.strokeStyle=tG(e.focus>.5?eN:e$,(.82+.18*e.focus)*e.alpha),r.lineWidth=t,r.strokeRect(a+t/2,l+t/2,n-t,n-t),c(a-t,l-t,a+n+t,l+n+t)}for(let e of f){let t=tq(e.text,e.x,e.y,-10,e.alpha,e_);c(e.x,e.y,e.x+t.w,e.y+t.h)}if(K.alpha>.01){let e=Math.round(K.x*ee-o/2),l=Math.round(K.y*ee-i/2);r.strokeStyle=tG(eH,.82*K.alpha),r.lineWidth=t,r.strokeRect(e+t/2,l+t/2,o-t,i-t);let n=Math.round(.24*i),h=l+Math.round(i/2)+t%2/2;if(r.beginPath(),r.moveTo(e-n,h),r.lineTo(e,h),r.moveTo(e+o,h),r.lineTo(e+o+n,h),r.stroke(),c(e-n,l,e+o+n,l+i),s>0){let t=K.locked?"LOCK":"TARGET",r=tj(t)+2*Math.round(.55*e5),n=e+o+Math.round(.8*e5);n+r>et-a&&(n=e-Math.round(.8*e5)-r);let i=Math.max(a,l-Math.round(.75*u)),s=tq(t,n,i,K.tagAt,K.alpha,e_);c(n,i,n+s.w,i+s.h)}}if(e.status){let e=0;for(let t of H)1===t.mode&&t.alpha>.5&&(e+=1);let t=Math.round(Math.max(16,.028*Math.min(Q,J))*ee),a=tq(`TRACKING ${e} POINTS`,t,t,-10,1,e_);c(t,t,t+a.w,t+a.h),ta.r=(t+a.w)/ee,ta.b=(t+a.h)/ee}else ta.r=0,ta.b=0;if(s>0){let e=Math.round(.45*e5),t=Math.round(.62*e5);for(let a of H){if(!a.labelled||a.alpha<.01)continue;let l=`X ${X(a.x)} Y ${X(a.y)}`,n=tP(l,a.labelAt);if(n<=0)continue;let o=a.labelOut>=0?1-b((ej-a.labelOut)/.2,0,1):1,{left:i,top:s,size:u}=tI(a),h=tj(l),f=-1,p=0,m=0;for(let l=0;l<4&&f<0;l+=1){let r=(a.corner+l)%4,n=0===r||1===r?i+u+e:i-e-h,o=0===r||2===r?s-t:s+u+t;d(n-2,o-t,n+h+2,o+t)&&(f=r,p=n,m=o)}f<0||(a.corner=f,c(p-2,m-t,p+h+2,m+t),r.fillStyle=tG(e_,.86*a.alpha*o),tR(l,Math.round(p),Math.round(m),n,n<l.length))}}})()},tz=e=>{e4=0,e8=!0;let t=e9?e-e9:0,a=Math.min(.05,e9?t/1e3:1/60);e9=e;let l=tL(a);tY(),e8=!1;let r=V.inside||Math.hypot(K.vx,K.vy)>.5;(l||r)&&e7&&!n.hidden&&!te?e4=o.requestAnimationFrame(tz):e9=0},tW=()=>{e4||e8||te||e7&&!n.hidden&&(e4=o.requestAnimationFrame(tz))},tU=(e,a)=>{let l=t.getBoundingClientRect();if(e<l.left||e>l.right||a<l.top||a>l.bottom||l.width<=0)return null;let r=l.width/Math.max(1,t.clientWidth);return{x:(e-l.left)/r,y:(a-l.top)/r}},tX=e=>{if("touch"===e.pointerType)return;let t=tU(e.clientX,e.clientY);if(!t){V.inside=!1;return}V.x=t.x,V.y=t.y,V.inside||(V.inside=!0,tW())},tD=()=>{V.inside=!1},t_=(e,t)=>{let a=ew.current;if(!eg&&!a.paused&&!(eo<=0)){var l;let a,r;a=(l=to(t)*eo+tn(e))%eo,r=Math.floor(l/eo),tf(l,1,1,1,.8),tg(l,1,1.35,!0),tg(l,-1,1.35,!0),r-1>=eb&&tg((r-1)*eo+a,1,.8,!0),r+1<=eM&&tg((r+1)*eo+a,-1,.8,!0),K.scale=Math.max(K.scale,1.3),tS(e,t,8*eX),tW()}},t$=e=>{if(!ew.current.interactive||eg)return;let t=tU(e.clientX,e.clientY);t&&(V.inside||(V.x=t.x,V.y=t.y,V.tapUntil=ej+3.2),t_(t.x,t.y))};ef.current=()=>{eg||(tc(),eV=!0,eK=0,K.alpha=0,K.scale=1.6,K.locked=!1,K.tagAt=ej,tA(),eZ=K.x*ee,eQ=K.y*ee,e1=eJ-e2,H.forEach((e,t)=>{e.mode=0,e.alpha=0,e.focus=0,e.focusGoal=0,e.labelled=!1,e.wait=.25+t/Math.max(1,H.length)*1.92}),N.forEach(e=>{e.alpha=0}),tW())},ep.current=(e=.5,t=.5)=>{t_(b(e,0,1)*Q,b(t,0,1)*J)},em.current=()=>{tF(),tE(),tL(0),tY(),tW()},tF(),tE(),eV?(e1=eJ-e2,K.alpha=0,K.scale=1.6,K.tagAt=.3):K.alpha=1,eg&&(()=>{eV=!1,e1=1e6;for(let e=0;e<300;e+=1)tB(1/60);for(let e of H)e.labelAt=-10,e.alpha=+(1===e.mode),e.scale=1;K.alpha=1,K.locked=!0,K.tagAt=-10,d.needsUpdate=!0})(),tL(0),tY();let tH=new ResizeObserver(()=>{let e=Q,t=J;if(tF(),e>1&&t>1&&(e!==Q||t!==J)){let a=Q/e,l=J/t;for(let e of(K.x*=a,K.gx*=a,K.toX*=a,K.fromX*=a,K.y*=l,K.gy*=l,K.toY*=l,K.fromY*=l,H))e.x*=a,e.y*=l}tE(),tL(0),tY()});tH.observe(t);let tN=new IntersectionObserver(e=>{(e7=e.some(e=>e.isIntersecting))&&(eV&&(ev.current=!0),tW())});tN.observe(t);let tV=()=>tW();return n.addEventListener("visibilitychange",tV),n.addEventListener("pointermove",tX,{passive:!0}),n.addEventListener("click",t$,{passive:!0}),n.documentElement.addEventListener("pointerleave",tD),tW(),()=>{te=!0,o.cancelAnimationFrame(e4),tH.disconnect(),tN.disconnect(),n.removeEventListener("visibilitychange",tV),n.removeEventListener("pointermove",tX),n.removeEventListener("click",t$),n.documentElement.removeEventListener("pointerleave",tD),ef.current=()=>{},ep.current=()=>{},em.current=()=>{},T.dispose(),A.dispose(),C.dispose(),i.dispose(),d.dispose(),e.dispose()}},[er,eg]),(0,r.useEffect)(()=>{em.current()},[ex,ey,t,a,n,o,i,p,g,T,j,P,q,I,$,H,eb,eM,V,K,Z,Q,J,ee,et,ea,el,en]),(0,l.jsxs)("div",{ref:eh,className:(0,h.cn)("relative isolate h-full min-h-[240px] w-full overflow-hidden",eo),style:{background:t,...ei},children:[(0,l.jsx)("canvas",{ref:ec,"aria-hidden":"true",style:{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}}),(0,l.jsx)("canvas",{ref:ed,"aria-hidden":"true",style:{position:"absolute",inset:0,width:"100%",height:"100%",display:"block",pointerEvents:"none"}}),es&&(0,l.jsx)("div",{className:"relative z-10 h-full w-full",children:es})]})});$.displayName="CircuitFlash";

export const CircuitFlash = $;
export default CircuitFlash;
