// @ts-nocheck
import React, { forwardRef } from 'react';
import * as THREE from 'three';

export interface SpectralTilesProps {
  color?: string;
  glowColor?: string;
  backgroundColor?: string;
  grid?: number;
  gap?: number;
  thickness?: number;
  radius?: number;
  bevel?: number;
  density?: number;
  scatter?: number;
  heightVariance?: number;
  angle?: number;
  tilt?: number;
  perspective?: number;
  zoom?: number;
  lights?: number;
  lightIntensity?: number;
  lightSize?: number;
  edgeGlow?: number;
  rim?: number;
  frost?: number;
  grain?: number;
  fog?: number;
  speed?: number;
  interactive?: boolean;
  lift?: number;
  lean?: number;
  ripple?: boolean;
  intro?: boolean;
  seed?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const s: any = {
  ...THREE,
  Float32BufferAttribute: THREE.Float32BufferAttribute,
  qtW: THREE.Float32BufferAttribute,
  BufferGeometry: THREE.BufferGeometry,
  LoY: THREE.BufferGeometry,
  PlaneGeometry: THREE.PlaneGeometry,
  bdM: THREE.PlaneGeometry,
  Vector3: THREE.Vector3,
  Pq0: THREE.Vector3,
  Vector4: THREE.Vector4,
  IUQ: THREE.Vector4,
  Vector2: THREE.Vector2,
  I9Y: THREE.Vector2,
  Color: THREE.Color,
  Q1f: THREE.Color,
  Scene: THREE.Scene,
  Z58: THREE.Scene,
  Mesh: THREE.Mesh,
  eaF: THREE.Mesh,
  LinearSRGBColorSpace: THREE.LinearSRGBColorSpace,
  Zr2: THREE.LinearSRGBColorSpace,
  ShaderMaterial: THREE.ShaderMaterial,
  BKk: THREE.ShaderMaterial,
  PerspectiveCamera: THREE.PerspectiveCamera,
  ubm: THREE.PerspectiveCamera,
  Plane: THREE.Plane,
  Zcv: THREE.Plane,
  Euler: THREE.Euler,
  O9p: THREE.Euler,
  Matrix4: THREE.Matrix4,
  kn4: THREE.Matrix4,
  MathUtils: THREE.MathUtils,
  cj9: THREE.MathUtils,
  Quaternion: THREE.Quaternion,
  PTz: THREE.Quaternion,
  DynamicDrawUsage: THREE.DynamicDrawUsage,
  Vnu: THREE.DynamicDrawUsage,
  InstancedBufferAttribute: THREE.InstancedBufferAttribute,
  uWO: THREE.InstancedBufferAttribute,
  InstancedMesh: THREE.InstancedMesh,
  ZLX: THREE.InstancedMesh,
  Raycaster: THREE.Raycaster,
  tBo: THREE.Raycaster,
};

const u: any = {
  ...THREE
};

const i: any = React;
const c: any = {
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
};

const o: any = {
  jsx: (type: any, props: any) => {
    const { children, key, ...rest } = props || {};
    return React.createElement(type, { ...rest, key }, children);
  },
  jsxs: (type: any, props: any) => {
    const { children, key, ...rest } = props || {};
    return React.createElement(type, { ...rest, key }, ...(Array.isArray(children) ? children : [children]));
  }
};

let h=`
attribute float aSeed;
attribute vec2 aState;
varying vec3 vLocal;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vCenter;
varying float vSeed;
varying vec2 vState;
void main() {
  mat4 world = modelMatrix * instanceMatrix;
  vec4 position4 = world * vec4(position, 1.0);
  vLocal = position;
  vWorld = position4.xyz;
  vNormal = normalize(mat3(world) * normal);
  vCenter = (world * vec4(0.0, 0.0, 0.0, 1.0)).xz;
  vSeed = aSeed;
  vState = aState;
  gl_Position = projectionMatrix * viewMatrix * position4;
}
`,d=`
precision highp float;
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uBright;
uniform vec3 uGlow;
uniform vec3 uBackground;
uniform vec4 uLights[4];
uniform int uCount;
uniform float uEdge;
uniform float uRim;
uniform float uFrost;
uniform float uGrain;
uniform float uFog;
uniform float uFogNear;
uniform float uFogFar;
uniform float uTick;
uniform float uPower;
uniform float uDark;
uniform float uThick;
uniform float uCorner;
varying vec3 vLocal;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vCenter;
varying float vSeed;
varying vec2 vState;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float field(vec2 q) {
  float total = 0.0;
  for (int i = 0; i < 4; i++) {
    if (i >= uCount) break;
    vec4 light = uLights[i];
    vec2 d = q - light.xy;
    total += light.w * exp(-dot(d, d) / (light.z * light.z));
  }
  return total;
}

float haze(vec2 q, float spread) {
  float total = 0.0;
  for (int i = 0; i < 4; i++) {
    if (i >= uCount) break;
    vec4 light = uLights[i];
    float r2 = light.z * light.z;
    float s2 = r2 + spread;
    vec2 d = q - light.xy;
    total += light.w * (r2 / s2) * exp(-dot(d, d) / s2);
  }
  return total;
}

float edgeGlow(vec2 q, vec4 walls) {
  vec4 d = max(vec4(0.5 - q.x, 0.5 + q.x, 0.5 - q.y, 0.5 + q.y), 0.0);
  return dot(walls, exp(-d * 7.0) * 0.46 + exp(-d * 2.6) * 0.4);
}

float roundedBox(vec2 q, float r) {
  vec2 a = abs(q) - vec2(0.5 - r);
  return length(max(a, 0.0)) + min(max(a.x, a.y), 0.0) - r;
}

vec3 toSRGB(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 D = normalize(vWorld - cameraPosition);
  vec3 V = -D;
  vec2 p = clamp(vLocal.xz, vec2(-0.5), vec2(0.5));
  vec2 c = vCenter;
  float raised = vState.x;

  vec4 walls = vec4(
    field(c + vec2(0.5, p.y)),
    field(c + vec2(-0.5, p.y)),
    field(c + vec2(p.x, 0.5)),
    field(c + vec2(p.x, -0.5))
  );

  float topW = smoothstep(0.965, 0.998, N.y);
  float sideW = 1.0 - smoothstep(0.12, 0.42, N.y);
  float bevelW = clamp(1.0 - topW - sideW, 0.0, 1.0);
  float facing = 1.0 - max(dot(N, V), 0.0);

  vec3 R = refract(D, vec3(0.0, 1.0, 0.0), 0.667);
  vec2 travel = R.xz / max(-R.y, 0.25);
  vec2 q = p + travel * uThick * 0.5;
  vec2 qb = p + travel * uThick;

  float smudge = noise(p * 0.95 + vSeed * 17.3) * 0.65 + noise(p * 2.1 - vSeed * 9.1) * 0.35;
  float cloud = mix(1.0, 0.45 + 0.85 * smoothstep(0.1, 0.9, smudge), uFrost);
  vec2 g = p * 64.0 + vSeed * 13.0;
  float fine = 1.0 - smoothstep(0.3, 0.9, length(fwidth(g)));
  float speckle = (noise(g) * 0.65 + noise(g * 2.3 + 7.3) * 0.35 - 0.5) * fine;
  float frost = cloud * (1.0 + speckle * 0.07 * uFrost);

  float body = haze(c + q, 0.3) * 0.45;
  float top = (edgeGlow(q, walls) * uEdge + body) * frost;

  float wall = roundedBox(qb, uCorner);
  float wallLight = edgeGlow(clamp(qb, vec2(-0.5), vec2(0.5)), walls) * uEdge + body;
  float seamWidth = max(fwidth(wall) * 1.25, 0.002);
  float seam = exp(-(wall * wall) / (seamWidth * seamWidth));
  float band = smoothstep(-seamWidth, seamWidth, wall);
  top = mix(top, wallLight * 1.05, band * 0.7) + seam * wallLight * uRim * 0.45;

  float edgeLight = edgeGlow(p, walls);
  float edgeTop = edgeLight * uEdge * 0.85 + body;
  float leak = edgeLight * edgeLight * 0.7 * uRim * (1.0 + 0.3 * facing);
  float below = clamp((uThick * 0.5 - vLocal.y) / uThick, 0.0, 1.0);
  float side = (edgeTop + leak * 1.2) * mix(1.0, 0.72, below);
  float up = max(N.y, 0.0);
  float lobe = exp(-pow((up - 0.68) / 0.24, 2.0));
  float bevel = (edgeTop * 1.12 + leak * 1.5) * (1.0 + 0.22 * lobe);
  float seat = 1.0 - 0.28 * exp(-pow((up - 0.955) / 0.03, 2.0));

  float I = (top * topW * (1.0 + raised * 0.45) + (bevel * bevelW + side * sideW) * (1.0 + raised * 1.8)) * seat * uPower;

  float t = 1.0 - exp(-pow(max(I, 0.0), 1.25));
  vec3 color = mix(uBase, uDeep, smoothstep(0.0, 0.25, t));
  color = mix(color, uMid, smoothstep(0.25, 0.5, t));
  color = mix(color, uBright, smoothstep(0.5, 0.72, t));
  color = mix(color, uGlow, smoothstep(0.72, 0.97, t));

  float depth = distance(cameraPosition, vWorld);
  float fog = smoothstep(uFogNear, uFogFar, depth) * uFog;
  color = mix(color, uBackground, fog);
  color = mix(uBackground, color, vState.y);

  vec3 display = toSRGB(color);
  float luma = dot(display, vec3(0.2126, 0.7152, 0.0722));
  float response = mix(0.45, smoothstep(0.0, 0.6, luma), uDark) * vState.y * (1.0 - fog);
  float speck = hash13(vec3(gl_FragCoord.xy, uTick)) + hash13(vec3(gl_FragCoord.yx + 41.7, uTick + 19.3)) - 1.0;
  display += speck * uGrain * 0.08 * response;
  display += (hash12(gl_FragCoord.xy * 1.7 + 0.5) - 0.5) / 255.0;

  gl_FragColor = vec4(display, 1.0);
}
`,p=`
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,f=`
precision highp float;
uniform vec3 uFloor;
uniform vec3 uBackground;
uniform float uFogNear;
uniform float uFogFar;
uniform float uPower;
varying vec3 vWorld;
void main() {
  float depth = distance(cameraPosition, vWorld);
  float fade = max(smoothstep(uFogNear, uFogFar, depth), 1.0 - uPower);
  vec3 c = clamp(mix(uFloor, uBackground, fade), 0.0, 1.0);
  c = mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
  gl_FragColor = vec4(c, 1.0);
}
`,m=(e,t,a)=>Math.min(a,Math.max(t,e)),v=(e,t)=>"number"==typeof e&&Number.isFinite(e)?e:t,g=e=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");return t.addEventListener("change",e),()=>t.removeEventListener("change",e)},x=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,w=e=>{let t=Math.floor(0x9e3779b1*e)>>>0||1;return()=>(t^=t<<13,t^=t>>>17,((t^=t<<5)>>>0)%1e5/1e5)},y=(e,t)=>{let a=new s.Q1f;try{a.set(e)}catch{a.set(t)}return a}; let b=(0,i.forwardRef)(function({color:e="#375A9C",glowColor:t="#E1EBFD",backgroundColor:a="#000000",grid:l=16,gap:r=.06,thickness:n=.12,radius:b=.07,bevel:M=.025,density:C=.94,scatter:S=.9,heightVariance:z=.08,angle:F=45,tilt:k=44,perspective:P=24,zoom:E=1,lights:j=4,lightIntensity:B=1,lightSize:L=1,edgeGlow:I=1,rim:N=1,frost:W=.5,grain:R=.3,fog:T=.7,speed:q=1,interactive:G=!0,lift:A=1,lean:V=1,ripple:D=!0,intro:H=!0,seed:X=7,className:Z,style:Q,children:es},U){let $=(0,i.useRef)(null),_=(0,i.useRef)(null),Y=(0,i.useRef)(()=>{}),O=(0,i.useRef)(()=>{}),K=(0,i.useRef)(!1),J=(0,i.useSyncExternalStore)(g,x,()=>!1),ee=(0,i.useRef)({color:e,glowColor:t,backgroundColor:a,angle:F,tilt:k,perspective:P,zoom:E,lights:j,lightIntensity:B,lightSize:L,edgeGlow:I,rim:N,frost:W,grain:R,fog:T,speed:q,interactive:G,lift:A,lean:V,ripple:D,intro:H}),et=m(Math.round(v(l,16)),4,40),ea=`${et}|${v(r,.06)}|${v(n,.12)}|${v(b,.07)}|${v(M,.025)}|${v(C,.94)}|${v(S,.9)}|${v(z,.08)}|${v(X,7)}`;return(0,i.useEffect)(()=>{ee.current={color:e,glowColor:t,backgroundColor:a,angle:F,tilt:k,perspective:P,zoom:E,lights:j,lightIntensity:B,lightSize:L,edgeGlow:I,rim:N,frost:W,grain:R,fog:T,speed:q,interactive:G,lift:A,lean:V,ripple:D,intro:H}}),(0,i.useImperativeHandle)(U,()=>({replay:()=>Y.current()}),[]),(0,i.useEffect)(()=>{let e,t=$.current,a=_.current;if(!t||!a)return;let o=t.ownerDocument,i=o.defaultView??window,[l,r,n,c,g,x,b,M,C]=ea.split("|"),S=Number(l),z=1+m(Number(r),0,.5),F=m(Number(n),.02,.4),k=m(Number(c),0,.5),P=m(Number(g),.002,.2),E=m(Number(x),.2,1),j=m(Number(b),0,1)*(z-1)*.48,B=w(Number(C)+.25),L=m(Number(M),0,.5),I=w(Number(C)+.5);try{e=new u.WebGLRenderer({canvas:a,antialias:!0,alpha:!0,powerPreference:"high-performance"})}catch{return}e.setClearColor(0,0),e.outputColorSpace=s.Zr2;let N=new s.Z58,W=new s.ubm(32,1,.1,200),R=((e,t,a)=>{let o=m(t,.002,Math.min(a/2,e,.2)),i=Math.max(e,o),l=.5-o,r=Math.max(0,i-o),n=[];for(let[e,t,a]of[[1,1,0],[-1,1,Math.PI/2],[-1,-1,Math.PI],[1,-1,3*Math.PI/2]]){let o=e*(l-r),i=t*(l-r);for(let e=0;e<=8;e+=1){let t=a+e/8*(Math.PI/2);n.push([o+Math.cos(t)*r,i+Math.sin(t)*r,Math.cos(t),Math.sin(t)])}}let u=[],c=-(a/2-o),h=a/2-o;for(let e=0;e<=5;e+=1){let t=-Math.PI/2+e/5*(Math.PI/2);u.push([o*Math.cos(t),c+o*Math.sin(t),Math.cos(t),Math.sin(t)])}for(let e=0;e<=5;e+=1){let t=e/5*(Math.PI/2);u.push([o*Math.cos(t),h+o*Math.sin(t),Math.cos(t),Math.sin(t)])}let d=[],p=[],f=[],v=n.length;for(let[e,t,a,o]of n)for(let[i,l,r,n]of u)d.push(e+a*i,l,t+o*i),p.push(a*r,n,o*r);let g=u.length,x=(e,t)=>e%v*g+t,w=(e,t,a)=>{let o=d[3*e],i=d[3*e+1],l=d[3*e+2],r=d[3*t]-o,n=d[3*t+1]-i,s=d[3*t+2]-l,u=d[3*a]-o,c=d[3*a+1]-i,h=d[3*a+2]-l;(n*h-s*c)*(p[3*e]+p[3*t]+p[3*a])+(s*u-r*h)*(p[3*e+1]+p[3*t+1]+p[3*a+1])+(r*c-n*u)*(p[3*e+2]+p[3*t+2]+p[3*a+2])>=0?f.push(e,t,a):f.push(e,a,t)};for(let e=0;e<v;e+=1)for(let t=0;t<g-1;t+=1)w(x(e,t),x(e+1,t),x(e+1,t+1)),w(x(e,t),x(e+1,t+1),x(e,t+1));let y=d.length/3;d.push(0,a/2,0),p.push(0,1,0);let b=d.length/3;d.push(0,-a/2,0),p.push(0,-1,0);for(let e=0;e<v;e+=1)w(y,x(e,g-1),x(e+1,g-1)),w(b,x(e,0),x(e+1,0));let M=new s.LoY;return M.setAttribute("position",new s.qtW(d,3)),M.setAttribute("normal",new s.qtW(p,3)),M.setIndex(f),M.computeBoundingSphere(),M})(k,P,F),T=[],q=(S-1)*z/2;for(let e=0;e<S;e+=1)for(let t=0;t<S;t+=1){let a=I()<E,o=I(),i=(2*B()-1)*j,l=(2*B()-1)*j;a&&T.push({x:t*z-q+i,z:e*z-q+l,base:-o*L,seed:10*I(),delay:0,lift:0,liftV:0,tiltX:0,tiltXV:0,tiltZ:0,tiltZV:0,wave:-1})}let G={uBase:{value:new s.Q1f},uDeep:{value:new s.Q1f},uMid:{value:new s.Q1f},uBright:{value:new s.Q1f},uGlow:{value:new s.Q1f},uBackground:{value:new s.Q1f},uLights:{value:Array.from({length:4},()=>new s.IUQ)},uCount:{value:3},uEdge:{value:1},uRim:{value:1},uFrost:{value:.6},uGrain:{value:.3},uFog:{value:.7},uFogNear:{value:4},uFogFar:{value:14},uTick:{value:0},uPower:{value:1},uDark:{value:1},uThick:{value:F},uCorner:{value:Math.max(k,m(P,.002,Math.min(F/2,k,.2)))}},A=new s.BKk({vertexShader:h,fragmentShader:d,uniforms:G}),V=new s.ZLX(R,A,T.length);V.instanceMatrix.setUsage(s.Vnu),V.frustumCulled=!1;let D=new Float32Array(T.length),X=new Float32Array(2*T.length);T.forEach((e,t)=>{D[t]=e.seed,X[2*t+1]=1});let Z=new s.uWO(X,2);Z.setUsage(s.Vnu),R.setAttribute("aSeed",new s.uWO(D,1)),R.setAttribute("aState",Z),N.add(V);let Q=new s.bdM(S*z+8,S*z+8).rotateX(-Math.PI/2),U=new s.BKk({vertexShader:p,fragmentShader:f,uniforms:{uFloor:{value:new s.Q1f},uBackground:G.uBackground,uFogNear:G.uFogNear,uFogFar:G.uFogFar,uPower:G.uPower}}),et=new s.eaF(Q,U);et.position.y=-F/2-L-.01,et.visible=!1,N.add(et);let eo=new s.Pq0(0,0,0),ei=new s.I9Y(1,0),el=new s.I9Y(0,1),er=new s.tBo,en=new s.Zcv(new s.Pq0(0,1,0),0),es=new s.Pq0,eu=new s.kn4,ec=new s.PTz,eh=new s.O9p,ed=new s.Pq0,ep=new s.Pq0(1,1,1),ef={x:0,z:0,active:!1,strength:0},em=[],ev=0,eg=1,ex=1,ew=0,ey=0,eb=0,eM=!1,eC=H&&!J&&!K.current,eS=0,ez=!1,eF=0,ek=!0,eP=!1,eE=()=>{let e=ee.current,t=s.cj9.degToRad(v(e.angle,45)),a=s.cj9.degToRad(m(v(e.tilt,44),8,85));W.fov=m(v(e.perspective,24),10,80);let o=6.9*(24/W.fov)**.9/m(v(e.zoom,1),.3,4);eo.set(-Math.sin(t)*z*Math.SQRT2,0,-Math.cos(t)*z*Math.SQRT2),W.position.set(eo.x+Math.sin(t)*Math.cos(a)*o,Math.sin(a)*o,eo.z+Math.cos(t)*Math.cos(a)*o),W.lookAt(eo),W.aspect=eg/ex,W.updateProjectionMatrix(),ei.set(Math.cos(t),-Math.sin(t)),el.set(Math.sin(t),Math.cos(t)),G.uFogNear.value=.98*o,G.uFogFar.value=1.5*o,eW()},ej=()=>{let e=ee.current,t=y(e.backgroundColor,"#000000"),a=y(e.color,"#3A5CBA"),o=y(e.glowColor,"#D7E4FF"),i=.2>.2126*t.r+.7152*t.g+.0722*t.b;G.uBackground.value.copy(t),G.uDark.value=+!!i,et.visible=!i,U.uniforms.uFloor.value.copy(t).lerp(a,.06).multiplyScalar(.84);let l=new s.Q1f(.55*Math.pow(a.r,1.6),.55*Math.pow(a.g,1.6),.55*Math.pow(a.b,1.6)),r=new s.Q1f(Math.min(1,2.6*a.r),Math.min(1,2.6*a.g),Math.min(1,2.6*a.b)).lerp(o,.2);i?(G.uBase.value.copy(t),G.uDeep.value.copy(l).lerp(t,.15),G.uMid.value.copy(a),G.uBright.value.copy(r),G.uGlow.value.copy(o)):(G.uBase.value.copy(t).lerp(a,.04).multiplyScalar(.93),G.uDeep.value.copy(t).lerp(a,.14).multiplyScalar(.96),G.uMid.value.copy(t).lerp(a,.3),G.uBright.value.copy(t).lerp(a,.48),G.uGlow.value.copy(t).lerp(a,.62).lerp(o,.12)),G.uEdge.value=m(v(e.edgeGlow,1),0,4),G.uRim.value=m(v(e.rim,1),0,4),G.uFrost.value=m(v(e.frost,.6),0,1),G.uGrain.value=m(v(e.grain,.3),0,1),G.uFog.value=m(v(e.fog,.7),0,1),G.uCount.value=m(Math.round(v(e.lights,3)),1,4)},eB=[{sx:.62,sy:.43,ax:.45,az:.3,fx:.071,fz:.053,px:.3,pz:1.7,r:.5,w:1.28},{sx:.29,sy:.72,ax:.4,az:.3,fx:.047,fz:.061,px:2.1,pz:.4,r:.48,w:1.31},{sx:.8,sy:.95,ax:.45,az:.35,fx:.058,fz:.043,px:4,pz:2.9,r:.58,w:1.16},{sx:.93,sy:.6,ax:.5,az:.35,fx:.039,fz:.051,px:5.2,pz:3.6,r:.55,w:.9}],eL=eB.map(()=>new s.I9Y),eI=new s.tBo,eN=new s.Pq0,eW=()=>{W.updateMatrixWorld(!0),eB.forEach((e,t)=>{eI.setFromCamera(new s.I9Y(2*e.sx-1,-(2*e.sy-1)),W),eI.ray.intersectPlane(en,eN)?eL[t].set(eN.x,eN.z):eL[t].set(eo.x,eo.z)})},eR=()=>{eg=Math.max(1,t.clientWidth),ex=Math.max(1,t.clientHeight),e.setPixelRatio(Math.min(1.75,i.devicePixelRatio||1)),e.setSize(eg,ex,!1),eE()},eT=()=>{T.forEach((e,t)=>{let a=e.x*el.x+e.z*el.y,o=e.x*ei.x+e.z*ei.y;e.delay=m((4-a)*.11+.03*Math.abs(o)+7919*t%97/97*.12,0,2.4)})},eq=e=>{let t,a,o,i=ee.current,l=m(v(i.speed,1),0,4);J||(ew+=e*l),ey+=e,a=m(v((t=ee.current).lightSize,1),.2,4),o=m(v(t.lightIntensity,1),0,4),eB.forEach((e,t)=>{let i=(Math.sin(ew*e.fx*Math.PI*2+e.px)-Math.sin(e.px))*e.ax*.7,l=(Math.sin(ew*e.fz*Math.PI*2+e.pz)-Math.sin(e.pz))*e.az*.7,r=eL[t].x+ei.x*i+el.x*l,n=eL[t].y+ei.y*i+el.y*l,s=1+.14*(Math.sin(.21*ew*Math.PI*2+1.7*t)-Math.sin(1.7*t));G.uLights.value[t].set(r,n,e.r*a,e.w*o*s)});let r=m(v(i.lift,1),0,3),n=m(v(i.lean,1),0,3),s=i.interactive&&!J;ef.strength+=((ef.active&&s?1:0)-ef.strength)*(1-Math.exp(-(6*e))),eM&&(eb+=e);let u=!0,c=!1,h=ew;T.forEach((t,a)=>{let o=1,i=0;if(eM||eC){let e=m((eb-t.delay)/1.1,0,1),a=1-Math.pow(1-e,3);o=a,i=-(.55*(1-a)),e<1&&(u=!1)}let l=0,s=0,d=0;if(ef.strength>.001){let e=ef.x-t.x,a=ef.z-t.z,o=Math.hypot(e,a),i=Math.exp(-(o*o)/2.2)*ef.strength;l=.16*r*i;let u=.16*n*i*m(o/.9,0,1);o>1e-4&&(s=a/o*u,d=-e/o*u)}for(let e of em){if(e.id<=t.wave)continue;let a=Math.hypot(t.x-e.x,t.z-e.z);(h-e.start)*4.2>=a&&(t.wave=e.id,t.liftV+=1.1*r*Math.exp(-(.18*a)))}let p=2*Math.sqrt(70)*.55;t.liftV+=(70*(l-t.lift)-p*t.liftV)*e,t.lift+=t.liftV*e,t.tiltXV+=(70*(s-t.tiltX)-p*t.tiltXV)*e,t.tiltX+=t.tiltXV*e,t.tiltZV+=(70*(d-t.tiltZ)-p*t.tiltZV)*e,t.tiltZ+=t.tiltZV*e,(Math.abs(t.liftV)+Math.abs(t.tiltXV)+Math.abs(t.tiltZV)>.002||Math.abs(l-t.lift)>.0015)&&(c=!0),ed.set(t.x,t.base+i+t.lift,t.z),eh.set(t.tiltX,0,t.tiltZ),ec.setFromEuler(eh),eu.compose(ed,ec,ep),V.setMatrixAt(a,eu),X[2*a]=3*Math.max(0,t.lift),X[2*a+1]=o}),eM&&u&&(eM=!1),G.uPower.value=eM||eC?m(eb/1.6,0,1):1;for(let e=em.length-1;e>=0;e-=1)(h-em[e].start)*4.2>S*z*1.5&&em.splice(e,1);return V.instanceMatrix.needsUpdate=!0,Z.needsUpdate=!0,G.uTick.value=Math.floor(24*ey)%1e3,c||eM},eG=t=>{eS=0,ez=!0;let a=Math.min(.05,eF?(t-eF)/1e3:1/60);eF=t,eq(a),e.render(N,W),ez=!1,!ek||o.hidden||eP||J?eF=0:eS=i.requestAnimationFrame(eG)},eA=()=>{if(!eS&&!ez&&!eP){if(!ek||o.hidden||J){eq(1/60),e.render(N,W);return}eS=i.requestAnimationFrame(eG)}},eV=(e,a)=>{let o=t.getBoundingClientRect();if(e<o.left||e>o.right||a<o.top||a>o.bottom)return!1;let i=new s.I9Y((e-o.left)/o.width*2-1,-((a-o.top)/o.height*2-1));return er.setFromCamera(i,W),!!er.ray.intersectPlane(en,es)&&(ef.x=es.x,ef.z=es.z,!0)},eD=e=>{ef.active=eV(e.clientX,e.clientY),ef.active&&eA()},eH=()=>{ef.active=!1},eX=e=>{let t=ee.current;!t.interactive||!t.ripple||J||eV(e.clientX,e.clientY)&&(ev+=1,em.push({x:ef.x,z:ef.z,start:ew,id:ev}),em.length>4&&em.shift(),eA())},eZ=()=>{eC&&ek&&(eC=!1,K.current=!0,eM=!0,eb=0,eT(),eA())};Y.current=()=>{J||(eC=!0,eM=!1,eb=0,K.current=!1,eZ())},O.current=()=>{ej(),eE(),eM&&eT(),eA()},ej(),eR(),eT(),eq(0),e.render(N,W);let eQ=new ResizeObserver(()=>{eR(),eq(0),e.render(N,W)});eQ.observe(t);let eU=new IntersectionObserver(e=>{(ek=e.some(e=>e.isIntersecting))&&(eZ(),eA())});eU.observe(t);let e$=()=>eA();return o.addEventListener("visibilitychange",e$),o.addEventListener("pointermove",eD,{passive:!0}),o.addEventListener("pointerdown",eX,{passive:!0}),o.documentElement.addEventListener("pointerleave",eH),eA(),()=>{eP=!0,i.cancelAnimationFrame(eS),eQ.disconnect(),eU.disconnect(),o.removeEventListener("visibilitychange",e$),o.removeEventListener("pointermove",eD),o.removeEventListener("pointerdown",eX),o.documentElement.removeEventListener("pointerleave",eH),Y.current=()=>{},O.current=()=>{},R.dispose(),A.dispose(),V.dispose(),Q.dispose(),U.dispose(),e.dispose()}},[H,J,ea]),(0,i.useEffect)(()=>{O.current()},[e,t,a,F,k,P,E,j,I,N,W,R,T]),(0,o.jsx)("div",{ref:$,className:(0,c.cn)("relative h-full w-full overflow-hidden",Z),style:{background:a,...Q},children:[(0,o.jsx)("canvas",{ref:_,"aria-hidden":"true",style:{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}}),es&&(0,o.jsx)("div",{className:"relative z-10 h-full w-full",children:es})]})});;
b.displayName = "SpectralTiles";

export const SpectralTiles = b;
export default SpectralTiles;
