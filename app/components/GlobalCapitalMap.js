"use client";
import { useEffect, useRef, useState } from "react";

// World cities with lat/lon converted to canvas %
const CITIES = [
  { name: "Dubai", x: 57, y: 38, hub: true },
  { name: "London", x: 47, y: 27, hub: true },
  { name: "New York", x: 24, y: 32, hub: true },
  { name: "Singapore", x: 74, y: 48, hub: true },
  { name: "Zurich", x: 49, y: 28 },
  { name: "Tokyo", x: 80, y: 33 },
  { name: "Hong Kong", x: 76, y: 40 },
  { name: "Toronto", x: 22, y: 28 },
  { name: "Sydney", x: 82, y: 68 },
  { name: "Frankfurt", x: 50, y: 27 },
];

// Arc connections between hubs
const ARCS = [
  [0, 1], [0, 3], [1, 2], [1, 3], [2, 0], [2, 6],
  [3, 5], [3, 8], [1, 9], [2, 3], [0, 6],
];

function lerpArc(p1, p2, t, height = 0.15) {
  // Quadratic bezier midpoint with lift
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2 - height * 100;
  const x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * mx + t * t * p2.x;
  const y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * my + t * t * p2.y;
  return { x, y };
}

export default function GlobalCapitalMap() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const px = (city) => ({ x: (city.x / 100) * W(), y: (city.y / 100) * H() });

    // Particles on arcs
    const particles = ARCS.map((arc, i) => ({
      arc,
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.002,
    }));

    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.008;
      const w = W(); const h = H();
      ctx.clearRect(0, 0, w, h);

      // World map silhouette — simplified continents as dots
      ctx.fillStyle = "rgba(159,180,193,0.04)";
      // Draw background dots grid
      for (let gx = 0; gx < w; gx += 18) {
        for (let gy = 0; gy < h; gy += 18) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw arc paths (static)
      ARCS.forEach(([a, b]) => {
        const p1 = px(CITIES[a]);
        const p2 = px(CITIES[b]);
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2 - 0.15 * h;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(mx, my, p2.x, p2.y);
        ctx.strokeStyle = "rgba(159,180,193,0.07)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Animated particles along arcs
      particles.forEach(p => {
        p.progress = (p.progress + p.speed) % 1;
        const [a, b] = p.arc;
        const p1 = px(CITIES[a]);
        const p2 = px(CITIES[b]);
        const pos = lerpArc(p1, p2, p.progress, 0.15);

        // Glow trail
        const trailLen = 6;
        for (let i = 0; i < trailLen; i++) {
          const tp = Math.max(0, p.progress - i * 0.012);
          const tpos = lerpArc(p1, p2, tp, 0.15);
          ctx.beginPath();
          ctx.arc(tpos.x, tpos.y, 1.5 - i * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100,180,255,${0.6 - i * 0.1})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100,200,255,0.9)";
        ctx.fill();
      });

      // City nodes
      CITIES.forEach((city, i) => {
        const pos = px(city);
        const isHov = hovered === i;
        const isHub = city.hub;

        // Pulse ring for hubs
        if (isHub) {
          const pulseR = (12 + 6 * Math.sin(t * 1.2 + i)) * (isHov ? 1.4 : 1);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(100,180,255,${0.08 + 0.04 * Math.sin(t + i)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // City dot
        const r = isHub ? (isHov ? 6 : 5) : (isHov ? 4 : 3);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isHub ? (isHov ? "rgba(100,200,255,1)" : "rgba(100,180,255,0.9)") : "rgba(159,180,193,0.5)";
        ctx.fill();

        // Label
        if (isHub || isHov) {
          ctx.font = `${isHub ? 600 : 500} ${isHub ? 11 : 10}px sans-serif`;
          ctx.fillStyle = isHov ? "#fff" : "rgba(255,255,255,0.6)";
          ctx.textAlign = "center";
          ctx.fillText(city.name, pos.x, pos.y - r - 6);
        }
      });
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [visible, hovered]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    let found = null;
    CITIES.forEach((c, i) => {
      const dx = c.x - mx;
      const dy = c.y - my;
      if (Math.sqrt(dx * dx + dy * dy) < 4) found = i;
    });
    setHovered(found);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Glow overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,40,80,0.3) 0%, transparent 70%)",
        borderRadius: 20,
      }} />

      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
        style={{
          width: "100%", height: 420,
          borderRadius: 20,
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease",
          cursor: hovered !== null ? "pointer" : "default",
          display: "block",
        }}
      />

      {/* City tooltip */}
      {hovered !== null && (
        <div style={{
          position: "absolute",
          bottom: 20, left: "50%", transform: "translateX(-50%)",
          background: "rgba(5,8,16,0.95)", border: "1px solid rgba(100,180,255,0.2)",
          borderRadius: 12, padding: "10px 20px", backdropFilter: "blur(12px)",
          zIndex: 2, pointerEvents: "none",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(100,200,255,0.9)" }} />
          <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: "#fff" }}>{CITIES[hovered].name}</span>
          {CITIES[hovered].hub && <span style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(100,180,255,0.6)", letterSpacing: "0.1em" }}>CAPITAL HUB</span>}
        </div>
      )}
    </div>
  );
}
