"use client";
import { useEffect, useRef } from "react";

export default function FloatingOrbs() {
  const orbsRef = useRef([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const posRef = useRef([
    { x: 15, y: 25, vx: 0, vy: 0 },
    { x: 75, y: 55, vx: 0, vy: 0 },
    { x: 50, y: 75, vx: 0, vy: 0 },
  ]);

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    let raf;
    const tick = () => {
      const mx = mouseRef.current.x * 100;
      const my = mouseRef.current.y * 100;
      posRef.current.forEach((p, i) => {
        const speed = 0.025 * (i + 1) * 0.6;
        p.vx += (mx * 0.08 * (i + 1) * 0.5 - p.vx) * speed;
        p.vy += (my * 0.08 * (i + 1) * 0.5 - p.vy) * speed;
        p.vx *= 0.92;
        p.vy *= 0.92;
        const orb = orbsRef.current[i];
        if (orb) {
          orb.style.left = `${p.x + p.vx}%`;
          orb.style.top = `${p.y + p.vy}%`;
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);

  const orbs = [
    { size: 600, color: "rgba(100,140,180,0.07)" },
    { size: 450, color: "rgba(80,120,160,0.06)" },
    { size: 320, color: "rgba(120,160,190,0.05)" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {orbs.map((orb, i) => (
        <div
          key={i}
          ref={el => { orbsRef.current[i] = el; }}
          style={{
            position: "absolute",
            width: orb.size, height: orb.size,
            left: `${posRef.current[i].x}%`,
            top: `${posRef.current[i].y}%`,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle at center, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(30px)",
            willChange: "left, top",
          }}
        />
      ))}
    </div>
  );
}
