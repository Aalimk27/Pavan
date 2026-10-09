"use client";

import { useEffect, useRef } from "react";

/**
 * PRANA FIELD — a living silk of forest and gold behind Sakhi.
 * Raw WebGL (no libraries). Tinted by the visitor's time of day, drawn toward the pointer,
 * brightening when Sakhi speaks (reads --sk-amp). Pauses off-screen; static under reduced motion.
 */

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `precision mediump float;
uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;uniform vec3 u_tint;uniform float u_amp;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy;
  vec2 p=(gl_FragCoord.xy-.5*u_res.xy)/u_res.y;
  float t=u_time*.035;
  vec2 q=vec2(fbm(p*1.5+t),fbm(p*1.5-t+3.1));
  vec2 r=vec2(fbm(p*2.+q*1.8+vec2(1.7,9.2)+t*1.3),fbm(p*2.+q*1.8+vec2(8.3,2.8)-t));
  float f=fbm(p*1.3+r*1.7);
  vec3 deep=vec3(.010,.066,.040);
  vec3 forest=vec3(.050,.255,.170);
  vec3 gold=vec3(.96,.79,.37);
  vec3 col=mix(deep,forest,smoothstep(.25,.95,f));
  float band=smoothstep(.58,.98,f+.28*q.x);
  col+=gold*band*.16;
  col=mix(col,col*u_tint*1.35,.32);
  vec2 m=(u_mouse-.5)*vec2(u_res.x/u_res.y,1.);
  col+=gold*exp(-length(p-m)*4.5)*.07;
  float glow=exp(-length((p-vec2(0.,-.02))*vec2(1.,.8))*2.6);
  col+=gold*glow*(.16+.30*u_amp);
  col*=1.-.65*dot(uv-.5,uv-.5)*1.8;
  gl_FragColor=vec4(col,1.);
}`;

const TINTS: Record<string, [number, number, number]> = {
  brahma: [0.82, 0.78, 1.05],
  morning: [1.08, 0.96, 0.82],
  afternoon: [1.05, 1.0, 0.86],
  evening: [1.15, 0.86, 0.7],
  night: [0.78, 0.86, 1.08],
};

export default function PranaField({ phase = "evening" }: { phase?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) {
      canvas.classList.add("is-fallback");
      return;
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.classList.add("is-fallback");
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uTint = gl.getUniformLocation(prog, "u_tint");
    const uAmp = gl.getUniformLocation(prog, "u_amp");
    const tint = TINTS[phase] ?? TINTS.evening;
    gl.uniform3f(uTint, tint[0], tint[1], tint[2]);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = 0.5;
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let mouse = { x: 0.5, y: 0.55 };
    let target = { x: 0.5, y: 0.55 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target = { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    let raf = 0;
    const start = performance.now() - Math.random() * 20000;
    const root = document.documentElement;
    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.uniform1f(uAmp, parseFloat(root.style.getPropertyValue("--sk-amp") || "0") || 0);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [phase]);

  return <canvas ref={ref} className="prana-field" aria-hidden />;
}
