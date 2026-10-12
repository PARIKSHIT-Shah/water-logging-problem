import { useEffect, useRef } from "react";

// Falling rain. The number of drops follows the current rain intensity (0 to 1).
export default function RainCanvas({ intensity }) {
  const ref = useRef(null);
  const level = useRef(intensity);

  useEffect(() => {
    level.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MAX = 420;
    let w = 0;
    let h = 0;
    let raf;
    const drops = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < MAX; i++) {
      drops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        len: 10 + Math.random() * 18,
        v: 8 + Math.random() * 10,
      });
    }

    const draw = (move) => {
      ctx.clearRect(0, 0, w, h);
      const active = Math.floor(50 + MAX * level.current * 0.88);
      ctx.strokeStyle = "rgba(127, 208, 228, 0.32)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < active; i++) {
        const d = drops[i];
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.2, d.y + d.len);
        if (move) {
          d.y += d.v;
          d.x -= d.v * 0.2;
          if (d.y > h) {
            d.y = -d.len;
            d.x = Math.random() * (w + h * 0.2);
          }
        }
      }
      ctx.stroke();
    };

    const loop = () => {
      draw(true);
      raf = requestAnimationFrame(loop);
    };

    if (reduce) draw(false);
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
