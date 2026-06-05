"use client";
import { useEffect, useRef, useState } from "react";

// Major global FX + financial hubs with corrected map positions
const CITIES = [
  // Tier 1 - Major FX hubs
  { name: "London",       x: 47,  y: 27,  hub: true,  tier: 1 },
  { name: "New York",     x: 22,  y: 30,  hub: true,  tier: 1 },
  { name: "Tokyo",        x: 79,  y: 31,  hub: true,  tier: 1 },
  { name: "Singapore",    x: 73,  y: 50,  hub: true,  tier: 1 },
  { name: "Hong Kong",    x: 76,  y: 38,  hub: true,  tier: 1 },
  { name: "Dubai",        x: 59,  y: 38,  hub: true,  tier: 1 },
  // Tier 2 - Major financial centres
  { name: "Frankfurt",    x: 50,  y: 26,  hub: false, tier: 2 },
  { name: "Zurich",       x: 49,  y: 28,  hub: false, tier: 2 },
  { name: "Paris",        x: 47,  y: 28,  hub: false, tier: 2 },
  { name: "Toronto",      x: 21,  y: 27,  hub: false, tier: 2 },
  { name: "Chicago",      x: 20,  y: 29,  hub: false, tier: 2 },
  { name: "Sydney",       x: 82,  y: 68,  hub: false, tier: 2 },
  { name: "Shanghai",     x: 77,  y: 33,  hub: false, tier: 2 },
  { name: "Seoul",        x: 79,  y: 28,  hub: false, tier: 2 },
  { name: "Mumbai",       x: 63,  y: 42,  hub: false, tier: 2 },
  // Tier 3 - FX + emerging markets
  { name: "Amsterdam",    x: 48,  y: 25,  hub: false, tier: 3 },
  { name: "Stockholm",    x: 51,  y: 20,  hub: false, tier: 3 },
  { name: "Johannesburg", x: 53,  y: 66,  hub: false, tier: 3 },
  { name: "São Paulo",    x: 30,  y: 63,  hub: false, tier: 3 },
  { name: "Mexico City",  x: 16,  y: 38,  hub: false, tier: 3 },
  { name: "Riyadh",       x: 58,  y: 40,  hub: false, tier: 3 },
  { name: "Nairobi",      x: 56,  y: 54,  hub: false, tier: 3 },
  { name: "Kuala Lumpur", x: 73,  y: 50,  hub: false, tier: 3 },
  { name: "Bangkok",      x: 72,  y: 44,  hub: false, tier: 3 },
  { name: "Taipei",       x: 78,  y: 36,  hub: false, tier: 3 },
];

// Connection arcs — hub-to-hub + hub-to-tier2
const ARCS = [
  // Major hub connections
  [0,1],[0,2],[0,3],[0,4],[0,5],
  [1,2],[1,3],[1,9],[1,10],
  [2,3],[2,4],[2,13],
  [3,4],[3,5],[3,22],[3,23],
  [4,5],[4,12],
  [0,6],[0,7],[0,8],[0,15],[0,16],
  [5,14],[5,20],
  [1,19],[1,18],
  [0,17],[3,21],
  [2,24],[4,24],
];

function lerpArc(p1, p2, t) {
  const mx = (p1.x + p2.x) / 2;
  const dist = Math.sqrt((p2.x-p1.x)**2 + (p2.y-p1.y)**2);
  const lift = dist * 0.18;
  const my = (p1.y + p2.y) / 2 - lift;
  const x = (1-t)*(1-t)*p1.x + 2*(1-t)*t*mx + t*t*p2.x;
  const y = (1-t)*(1-t)*p1.y + 2*(1-t)*t*my + t*t*p2.y;
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
      { threshold: 0.1 }
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
      canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 2);
      canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 2);
      ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const px = (city) => ({ x: (city.x / 100) * W(), y: (city.y / 100) * H() });

    // Particles per arc
    const particles = ARCS.map(arc => ({
      arc,
      progress: Math.random(),
      speed: 0.0015 + Math.random() * 0.002,
    }));

    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.006;
      const w = W(); const h = H();
      ctx.clearRect(0, 0, w, h);

      // Dot grid background (world map suggestion)
      ctx.fillStyle = "rgba(159,180,193,0.035)";
      for (let gx = 0; gx < w; gx += 20) {
        for (let gy = 0; gy < h; gy += 20) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw static arc paths
      ARCS.forEach(([a, b]) => {
        if (a >= CITIES.length || b >= CITIES.length) return;
        const p1 = px(CITIES[a]);
        const p2 = px(CITIES[b]);
        const mx = (p1.x + p2.x) / 2;
        const dist = Math.sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2);
        const my = (p1.y + p2.y) / 2 - dist * 0.18;
        const isMajor = CITIES[a].tier === 1 && CITIES[b].tier === 1;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(mx, my, p2.x, p2.y);
        ctx.strokeStyle = isMajor ? "rgba(100,160,255,0.1)" : "rgba(159,180,193,0.05)";
        ctx.lineWidth = isMajor ? 1 : 0.6;
        ctx.stroke();
      });

      // Animated flow particles
      particles.forEach(p => {
        p.progress = (p.progress + p.speed) % 1;
        const [a, b] = p.arc;
        if (a >= CITIES.length || b >= CITIES.length) return;
        const p1 = px(CITIES[a]);
        const p2 = px(CITIES[b]);
        const pos = lerpArc(p1, p2, p.progress);

        // Trail
        for (let i = 0; i < 5; i++) {
          const tp = Math.max(0, p.progress - i * 0.015);
          const tpos = lerpArc(p1, p2, tp);
          ctx.beginPath();
          ctx.arc(tpos.x, tpos.y, 1.4 - i * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(80,160,255,${0.55 - i * 0.1})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,190,255,0.95)";
        ctx.fill();
      });

      // City nodes
      CITIES.forEach((city, i) => {
        const pos = px(city);
        const isHov = hovered === i;
        const isTier1 = city.tier === 1;
        const isTier2 = city.tier === 2;

        // Pulse rings for tier 1
        if (isTier1) {
          const r1 = (10 + 4 * Math.sin(t * 1.1 + i * 0.7)) * (isHov ? 1.5 : 1);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r1, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(80,160,255,${0.08 + 0.04 * Math.sin(t + i)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          if (isHov) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r1 * 1.6, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(80,160,255,0.05)";
            ctx.stroke();
          }
        }

        // Dot
        const r = isTier1 ? (isHov ? 6 : 5) : isTier2 ? (isHov ? 4 : 3) : (isHov ? 3 : 2);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isTier1 
          ? (isHov ? "rgba(120,200,255,1)" : "rgba(100,180,255,0.9)") 
          : isTier2 
            ? (isHov ? "rgba(159,180,193,0.9)" : "rgba(159,180,193,0.55)")
            : "rgba(159,180,193,0.3)";
        ctx.fill();

        // Labels — tier 1 always, tier 2 on hover, tier 3 only hovered
        if (isTier1 || isHov) {
          ctx.font = `${isTier1 ? 600 : 500} ${isTier1 ? 11 : 10}px sans-serif`;
          ctx.fillStyle = isHov ? "#fff" : isTier1 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)";
          ctx.textAlign = "center";
          ctx.fillText(city.name, pos.x, pos.y - r - 5);
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
      const dx = c.x - mx; const dy = c.y - my;
      if (Math.sqrt(dx*dx + dy*dy) < 3.5) found = i;
    });
    setHovered(found);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,40,80,0.25) 0%, transparent 70%)", borderRadius: 20 }} />
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
        style={{ width: "100%", height: 460, borderRadius: 20, opacity: visible ? 1 : 0, transition: "opacity 1.2s ease", cursor: hovered !== null ? "pointer" : "default", display: "block" }}
      />
      {hovered !== null && (
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(5,8,16,0.95)", border: "1px solid rgba(100,180,255,0.2)", borderRadius: 12, padding: "10px 20px", backdropFilter: "blur(12px)", zIndex: 2, pointerEvents: "none", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: CITIES[hovered].tier === 1 ? "rgba(100,200,255,0.9)" : "rgba(159,180,193,0.6)" }} />
          <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: "#fff" }}>{CITIES[hovered].name}</span>
          <span style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
            {CITIES[hovered].tier === 1 ? "TIER 1 FX HUB" : CITIES[hovered].tier === 2 ? "FINANCIAL CENTRE" : "EMERGING MARKET"}
          </span>
        </div>
      )}
    </div>
  );
}
