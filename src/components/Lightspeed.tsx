// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export interface LightspeedProps {
  width?: number | string;
  height?: number | string;
  speed?: number;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  streakCount?: number;
  stretchFactor?: number;
  intensity?: number;
  interactionEnabled?: boolean;
  rotation?: number;
  fadePower?: number;
  opacity?: number;
  quality?: 'low' | 'medium' | 'high';
  maxFPS?: number;
  pauseWhenOffscreen?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const s: any = {
  ...THREE,
  eaF: THREE.Mesh,
  bdM: THREE.PlaneGeometry,
  Z58: THREE.Scene,
  Pq0: THREE.Vector3,
  EZo: THREE.AdditiveBlending,
  I9Y: THREE.Vector2,
  IUQ: THREE.Vector4,
  qUd: THREE.OrthographicCamera,
  BKk: THREE.ShaderMaterial,
};

const u: any = THREE;
const r: any = React;
const a = {
  jsx: (type: any, props: any) => {
    const { children, ...rest } = props || {};
    return React.createElement(type, rest, children);
  },
  jsxs: (type: any, props: any) => {
    const { children, ...rest } = props || {};
    return React.createElement(type, rest, ...(Array.isArray(children) ? children : [children]));
  }
};
const d = { cn: (...classes: any[]) => classes.filter(Boolean).join(' ') };

let c=({width:e="100%",height:t="100%",speed:o=1,primaryColor:n="#FF5722",secondaryColor:i="#2196F3",tertiaryColor:l="#4CAF50",streakCount:c=128,stretchFactor:m=.05,intensity:f=1,interactionEnabled:p=!0,rotation:v=0,fadePower:h=2,opacity:C=1,quality:y="medium",maxFPS:w=60,pauseWhenOffscreen:x=!0,className:g,children:S})=>{let b=(0,r.useRef)(null),P=(0,r.useRef)(0),F=(0,r.useRef)(0),k=(0,r.useRef)(0),R=(0,r.useRef)(!1),E=(0,r.useRef)(!0),j=(0,r.useRef)(0),I=(0,r.useRef)(0);(0,r.useEffect)(()=>{if(!b.current)return;let e=b.current,t=e=>{let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16)/255,g:parseInt(t[2],16)/255,b:parseInt(t[3],16)/255}:{r:1,g:.4,b:.13}},a=t(n),r=t(i),d=t(l),g=e.getBoundingClientRect(),S=g.width,T=g.height,M={low:{pixelRatio:1,antialias:!1},medium:{pixelRatio:Math.min(window.devicePixelRatio,2),antialias:!0},high:{pixelRatio:Math.min(window.devicePixelRatio,3),antialias:!0}}[y],z=new u.WebGLRenderer({antialias:M.antialias,alpha:!0,powerPreference:"high-performance",stencil:!1,depth:!1});z.setClearColor(0,0);let O=M.pixelRatio;z.setSize(S,T,!1),z.setPixelRatio(O),z.domElement.style.width="100%",z.domElement.style.height="100%",z.domElement.style.display="block",e.appendChild(z.domElement);let V=new s.Z58,L=new s.qUd(-1,1,1,-1,0,1),B={iTime:{value:0},iResolution:{value:new s.I9Y(S*O,T*O)},iMouse:{value:new s.IUQ(0,0,0,0)},uCompression:{value:0},uColor1:{value:new s.Pq0(a.r,a.g,a.b)},uColor2:{value:new s.Pq0(r.r,r.g,r.b)},uColor3:{value:new s.Pq0(d.r,d.g,d.b)},uStreakCount:{value:c},uStretchFactor:{value:m},uIntensity:{value:f},uSpeed:{value:o},uRotation:{value:v},uFadePower:{value:h},uOpacity:{value:C}},q=`
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,A=`
      #define PI 3.14159265359

      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec4 iMouse;
      uniform float uCompression;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform float uStreakCount;
      uniform float uStretchFactor;
      uniform float uIntensity;
      uniform float uSpeed;
      uniform float uRotation;
      uniform float uFadePower;
      uniform float uOpacity;

      float computeStreak(vec2 coord, float timeOffset) {
        coord.x = coord.x * uStreakCount;
        float horizontalPos = fract(coord.x);
        float columnIndex = floor(coord.x);

        coord.y *= uStretchFactor;

        float randomOffset = sin(columnIndex * 215.4);

        float speedVariation = cos(columnIndex * 33.1) * 0.3 + 0.7;

        float dynamicTrail = mix(95.0, 35.0, speedVariation);

        float animatedY = fract(coord.y + timeOffset * speedVariation + randomOffset);
        float streakValue = animatedY * dynamicTrail;

        streakValue = 1.0 / streakValue;
        streakValue = smoothstep(0.0, 1.0, streakValue * streakValue);
        streakValue = sin(streakValue * PI) * (speedVariation * 5.0);

        float horizontalFalloff = sin(horizontalPos * PI);

        return streakValue * (horizontalFalloff * horizontalFalloff);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;

        float distFromCenter = length(uv) + 0.1;

        float angle = atan(uv.x, uv.y) / PI + uRotation;
        float radius = 2.5 / distFromCenter;
        vec2 polarCoord = vec2(angle, radius);

        float compressionFactor = mix(1.0, 0.5, uCompression);
        polarCoord.y *= compressionFactor;

        float animTime = iTime * 0.4 * uSpeed;

        vec3 finalColor = vec3(0.0);
        finalColor += uColor1 * computeStreak(polarCoord, animTime);
        finalColor += uColor2 * computeStreak(polarCoord, animTime + 0.33);
        finalColor += uColor3 * computeStreak(polarCoord, animTime + 0.66);

        finalColor *= uIntensity;
        float distanceFade = pow(distFromCenter, uFadePower);
        finalColor *= distanceFade;

        finalColor *= uOpacity;

        float alpha = max(max(finalColor.r, finalColor.g), finalColor.b);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,N=new s.BKk({uniforms:B,vertexShader:q,fragmentShader:A,transparent:!0,blending:s.EZo}),_=new s.bdM(2,2),W=new s.eaF(_,N);V.add(W);let H=t=>{let o=e.getBoundingClientRect();B.iMouse.value.x=t.clientX-o.left,B.iMouse.value.y=T-(t.clientY-o.top)},U=()=>{R.current=!0,j.current=1,B.iMouse.value.z=1},Y=()=>{R.current=!1,j.current=0,B.iMouse.value.z=0},D=t=>{if(t.touches.length>0){let o=t.touches[0],a=e.getBoundingClientRect();B.iMouse.value.x=o.clientX-a.left,B.iMouse.value.y=T-(o.clientY-a.top),j.current=1,B.iMouse.value.z=1}},X=()=>{j.current=0,B.iMouse.value.z=0};p&&(e.addEventListener("mousemove",H),e.addEventListener("mousedown",U),e.addEventListener("mouseup",Y),e.addEventListener("touchstart",D),e.addEventListener("touchend",X));let G=null;x&&(G=new IntersectionObserver(e=>{E.current=e[0].isIntersecting},{threshold:0})).observe(e);let Q=1e3/w,$=e=>{P.current=requestAnimationFrame($),F.current||(F.current=e,k.current=e);let t=e-k.current;t<Q||(k.current=e-t%Q,(!x||E.current)&&(B.iTime.value=(e-F.current)*.001,I.current+=(j.current-I.current)*4*(.001*t),B.uCompression.value=I.current,B.uColor1.value.set(a.r,a.g,a.b),B.uColor2.value.set(r.r,r.g,r.b),B.uColor3.value.set(d.r,d.g,d.b),B.uStreakCount.value=c,B.uStretchFactor.value=m,B.uIntensity.value=f,B.uSpeed.value=o,B.uRotation.value=v,B.uFadePower.value=h,B.uOpacity.value=C,z.render(V,L)))};P.current=requestAnimationFrame($);let Z=()=>{let t=e.getBoundingClientRect(),o=t.width,a=t.height;z.setSize(o,a,!1),B.iResolution.value.set(o*O,a*O)};return window.addEventListener("resize",Z),()=>{window.removeEventListener("resize",Z),P.current&&cancelAnimationFrame(P.current),p&&(e.removeEventListener("mousemove",H),e.removeEventListener("mousedown",U),e.removeEventListener("mouseup",Y),e.removeEventListener("touchstart",D),e.removeEventListener("touchend",X)),G&&G.disconnect(),_.dispose(),N.dispose(),z.dispose(),e.contains(z.domElement)&&e.removeChild(z.domElement)}},[n,i,l,c,m,f,o,v,h,C,p,y,w,x]);let T="number"==typeof e?`${e}px`:e,M="number"==typeof t?`${t}px`:t;return(0,a.jsx)("div",{ref:b,className:(0,d.cn)("relative overflow-hidden",g),style:{width:T,height:M},children:S&&(0,a.jsx)("div",{className:"pointer-events-none absolute inset-0 z-10 flex items-center justify-center",children:S})})}

export const Lightspeed: React.FC<LightspeedProps> = c;
export { c };
export default Lightspeed;
