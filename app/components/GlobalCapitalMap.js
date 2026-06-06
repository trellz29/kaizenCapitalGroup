"use client";
import { useEffect, useRef, useState } from "react";

// Full global financial network — all major hubs, FX centers, emerging markets
const CITIES = [
  // Tier 1 — FX & Global Finance Hubs
  { name: "London", x: 47, y: 26, tier: 1 },
  { name: "New York", x: 22, y: 30, tier: 1 },
  { name: "Tokyo", x: 80, y: 31, tier: 1 },
  { name: "Singapore", x: 74, y: 50, tier: 1 },

  // Tier 2 — Major Financial Centers
  { name: "Dubai", x: 58, y: 38, tier: 2 },
  { name: "Hong Kong", x: 77, y: 40, tier: 2 },
  { name: "Zurich", x: 50, y: 26, tier: 2 },
  { name: "Frankfurt", x: 50, y: 24, tier: 2 },
  { name: "Sydney", x: 83, y: 67, tier: 2 },
  { name: "Toronto", x: 21, y: 26, tier: 2 },
  { name: "Chicago", x: 20, y: 28, tier: 2 },
  { name: "Paris", x: 48, y: 25, tier: 2 },
  { name: "Amsterdam", x: 49, y: 23, tier: 2 },

  // Tier 3 — Regional Hubs
  { name: "São Paulo", x: 30, y: 64, tier: 3 },
  { name: "Mexico City", x: 16, y: 38, tier: 3 },
  { name: "Mumbai", x: 64, y: 41, tier: 3 },
  { name: "Shanghai", x: 78, y: 34, tier: 3 },
  { name: "Seoul", x: 80, y: 29, tier: 3 },
  { name: "Johannesburg", x: 54, y: 64, tier: 3 },
  { name: "Cairo", x: 54, y: 37, tier: 3 },
  { name: "Istanbul", x: 54, y: 28, tier: 3 },
  { name: "Moscow", x: 57, y: 20, tier: 3 },
  { name: "Stockholm", x: 51, y: 18, tier: 3 },

  // Tier 4 — Emerging Markets
  { name: "Lagos", x: 48, y: 50, tier: 4 },
  { name: "Nairobi", x: 57, y: 53, tier: 4 },
  { name: "Riyadh", x: 58, y: 40, tier: 4 },
  { name: "Karachi", x: 63, y: 38, tier: 4 },
  { name: "Bangkok", x: 74, y: 44, tier: 4 },
  { name: "Kuala Lumpur", x: 74, y: 49, tier: 4 },
  { name: "Jakarta", x: 76, y: 54, tier: 4 },
  { name: "Manila", x: 79, y: 45, tier: 4 },
  { name: "Buenos Aires", x: 28, y: 70, tier: 4 },
  { name: "Bogotá", x: 24, y: 52, tier: 4 },
  { name: "Lima", x: 22, y: 58, tier: 4 },
  { name: "Santiago", x: 24, y: 68, tier: 4 },
  { name: "Warsaw", x: 53, y: 22, tier: 4 },
  { name: "Prague", x: 51, y: 23, tier: 4 },
  { name: "Vienna", x: 51, y: 24, tier: 4 },
  { name: "Tel Aviv", x: 56, y: 33, tier: 4 },
  { name: "Taipei", x: 79, y: 37, tier: 4 },
  { name: "Auckland", x: 88, y: 72, tier: 4 },
  { name: "Casablanca", x: 44, y: 33, tier: 4 },
];

// Connections — Tier 1 hubs connect to everything nearby
const CONNECTIONS = [
  // T1-T1 backbone
  [0,1],[0,2],[0,3],[1,2],[1,3],[2,3],
  // London spokes
  [0,6],[0,7],[0,12],[0,11],[0,35],[0,13],[0,32],
  // New York spokes
  [1,9],[1,10],[1,13],[1,25],[1,32],[1,34],
  // Tokyo spokes
  [2,5],[2,15],[2,16],[2,36],[2,37],
  // Singapore spokes
  [3,5],[3,15],[3,26],[3,27],[3,28],[3,29],[3,38],
  // Dubai spokes
  [4,0],[4,19],[4,24],[4,23],[4,33],[4,15],[4,25],
  // Hong Kong
  [5,15],[5,16],[5,17],[5,36],[5,28],
  // Regional
  [6,7],[7,11],[11,12],[9,10],[13,25],[13,34],
  [14,1],[19,4],[20,4],[18,4],[21,0],
  [22,23],[23,24],[26,27],[27,28],[29,28],
  // Sydney connections
  [8,3],[8,2],[8,5],[8,38],
];

const TIER_CONFIG = {
  1: { r: 7, color: "rgba(100,200,255,1)", ring: true, ringMax: 18, label: true },
  2: { r: 5, color: "rgba(80,170,230,0.85)", ring: true, ringMax: 12, label: true },
  3: { r: 3.5, color: "rgba(60,140,200,0.7)", ring: false, label: false },
  4: { r: 2.2, color: "rgba(40,110,170,0.55)", ring: false, label: false },
};

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

    // Particles per connection
    const particles = CONNECTIONS.map(([a, b]) => ({
      a, b,
      progress: Math.random(),
      speed: 0.0015 + Math.random() * 0.002,
    }));

    // Bezier midpoint
    const bezierPt = (p1, p2, t) => {
      const lift = Math.min(0.12, 0.08 + Math.abs(p1.x - p2.x) / W() * 0.1);
      const mx = (p1.x + p2.x) / 2;
      const my = (p1.y + p2.y) / 2 - lift * H();
      return {
        x: (1-t)*(1-t)*p1.x + 2*(1-t)*t*mx + t*t*p2.x,
        y: (1-t)*(1-t)*p1.y + 2*(1-t)*t*my + t*t*p2.y,
      };
    };

    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.008;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // Dot grid background (world map silhouette feel)
      ctx.fillStyle = "rgba(100,150,200,0.035)";
      for (let gx = 0; gx < w; gx += 20) {
        for (let gy = 0; gy < h; gy += 20) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw arc connections
      CONNECTIONS.forEach(([a, b]) => {
        const p1 = px(CITIES[a]);
        const p2 = px(CITIES[b]);
        const lift = Math.min(0.12, 0.08 + Math.abs(p1.x - p2.x) / w * 0.1);
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2 - lift * h;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(mx, my, p2.x, p2.y);
        ctx.strokeStyle = "rgba(100,160,220,0.06)";
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      // Animated flow particles
      particles.forEach(p => {
        p.progress = (p.progress + p.speed) % 1;
        const p1 = px(CITIES[p.a]);
        const p2 = px(CITIES[p.b]);
        const pos = bezierPt(p1, p2, p.progress);

        // Glowing trail
        for (let i = 5; i >= 0; i--) {
          const tp = Math.max(0, p.progress - i * 0.015);
          const tpos = bezierPt(p1, p2, tp);
          ctx.beginPath();
          ctx.arc(tpos.x, tpos.y, 1.2 - i * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100,200,255,${(0.7 - i * 0.1) * (0.4 + 0.6 * Math.abs(Math.sin(t + p.progress * 5)))})`;
          ctx.fill();
        }
      });

      // City nodes
      CITIES.forEach((city, i) => {
        const pos = px(city);
        const cfg = TIER_CONFIG[city.tier];
        const isHov = hovered === i;
        const r = isHov ? cfg.r * 1.5 : cfg.r;

        // Pulse ring for tier 1 & 2
        if (cfg.ring) {
          const pulse = (Math.sin(t * 1.4 + i * 0.8) + 1) / 2;
          const ringR = cfg.r + 2 + pulse * (cfg.ringMax - cfg.r - 2);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(100,180,255,${0.06 + pulse * 0.06})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Glow
        const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 3);
        grd.addColorStop(0, cfg.color.replace("1)", "0.18)").replace(/[\d.]+\)$/, "0.18)"));
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isHov ? "rgba(150,230,255,1)" : cfg.color;
        ctx.fill();

        // Label for tier 1+2 and hovered
        if (cfg.label || isHov) {
          ctx.font = `${city.tier === 1 ? 600 : 500} ${city.tier === 1 ? 11 : 10}px sans-serif`;
          ctx.fillStyle = isHov ? "#fff" : city.tier === 1 ? "rgba(200,230,255,0.85)" : "rgba(160,200,240,0.6)";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(city.name, pos.x, pos.y - r - 4);
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
      const hitR = c.tier <= 2 ? 4 : 2.5;
      if (Math.sqrt(dx * dx + dy * dy) < hitR) found = i;
    });
    setHovered(found);
  };

  const hovCity = hovered !== null ? CITIES[hovered] : null;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, background: "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(10,25,60,0.3) 0%, transparent 70%)", borderRadius: 20 }} />

      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
        style={{ width: "100%", height: 460, borderRadius: 20, opacity: visible ? 1 : 0, transition: "opacity 1.2s ease", cursor: hovered !== null ? "pointer" : "default", display: "block" }}
      />

      {hovCity && (
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(5,8,16,0.95)", border: "1px solid rgba(100,180,255,0.2)", borderRadius: 12, padding: "10px 20px", backdropFilter: "blur(12px)", zIndex: 2, pointerEvents: "none", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: TIER_CONFIG[hovCity.tier].color }} />
          <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: "#fff" }}>{hovCity.name}</span>
          <span style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(100,180,255,0.6)", letterSpacing: "0.1em" }}>
            {hovCity.tier === 1 ? "TIER 1 · FX HUB" : hovCity.tier === 2 ? "MAJOR CENTER" : hovCity.tier === 3 ? "REGIONAL HUB" : "EMERGING MARKET"}
          </span>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
        {[
          { label: "FX Hub", color: "rgba(100,200,255,1)" },
          { label: "Major Center", color: "rgba(80,170,230,0.85)" },
          { label: "Regional", color: "rgba(60,140,200,0.7)" },
          { label: "Emerging Market", color: "rgba(40,110,170,0.55)" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color }} />
            <span style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
