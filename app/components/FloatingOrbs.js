"use client";
import { useEffect, useRef } from "react";

export default function FloatingOrbs() {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const orbsRef = useRef([]);
  const posRef = useRef([
    { x: 20, y: 30, vx: 0, vy: 0, size: 500, color: "rgba(159,180,193,0.12)" },
    { x: 70, y: 60, vx: 0, vy: 0, size: 380, color: "rgba(201,216,226,0.10)" },
    { x: 45, y: 80, vx: 0, vy: 0, size: 280, color: "rgba(180,199,212,0.08)" },
  ]);

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf;
    const tick = () => {
      const orbs = orbsRef.current;
      const positions = posRef.current;
      const mx = mouseRef.current.x * 100;
      const my = mouseRef.current.y * 100;

      positions.forEach((pos, i) => {
        const targetX = pos.x + (mx - 50) * 0.06 * (i + 1) * 0.4;
        const targetY = pos.y + (my - 50) * 0.06 * (i + 1) * 0.4;
        pos.vx += (targetX - (pos.x + pos.vx)) * 0.02;
        pos.vy += (targetY - (pos.y + pos.vy)) * 0.02;
        pos.vx *= 0.85;
        pos.vy *= 0.85;

        const orb = orbs[i];
        if (orb) {
          orb.style.left = `${pos.x + pos.vx}%`;
          orb.style.top = `${pos.y + pos.vy}%`;
        }
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {posRef.current.map((orb, i) => (
        <div
          key={i}
          ref={(el) => { orbsRef.current[i] = el; }}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle at center, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(40px)",
            willChange: "left, top",
          }}
        />
      ))}
    </div>
  );
}
