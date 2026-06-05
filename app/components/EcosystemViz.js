"use client";
import { useEffect, useRef, useState } from "react";

const NODES = [
  { id: "kcg", label: "KCG HQ", x: 50, y: 50, size: 52, color: "#fff", textColor: "#050810", primary: true },
  { id: "funds", label: "12 Funds", x: 20, y: 25, size: 40, color: "rgba(0,232,120,0.9)", textColor: "#050810" },
  { id: "investors", label: "Investors", x: 78, y: 22, size: 38, color: "rgba(159,180,193,0.9)", textColor: "#050810" },
  { id: "trading", label: "Copy Trading", x: 15, y: 65, size: 36, color: "rgba(100,150,255,0.9)", textColor: "#050810" },
  { id: "assets", label: "Digital Assets", x: 80, y: 68, size: 34, color: "rgba(200,150,255,0.9)", textColor: "#050810" },
  { id: "algo", label: "Algo Systems", x: 35, y: 82, size: 32, color: "rgba(255,200,50,0.9)", textColor: "#050810" },
  { id: "brokers", label: "Brokerages", x: 65, y: 82, size: 32, color: "rgba(255,120,80,0.9)", textColor: "#050810" },
];

const CONNECTIONS = [
  ["kcg", "funds"], ["kcg", "investors"], ["kcg", "trading"],
  ["kcg", "assets"], ["kcg", "algo"], ["kcg", "brokers"],
  ["funds", "trading"], ["funds", "algo"], ["investors", "funds"],
  ["brokers", "funds"], ["brokers", "trading"],
];

export default function EcosystemViz() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const animRef = useRef({ particles: [], t: 0 });
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const getPos = (node) => ({
      x: (node.x / 100) * canvas.width,
      y: (node.y / 100) * canvas.height,
    });

    // Initialize flow particles on connections
    const particles = CONNECTIONS.map((conn, i) => ({
      conn,
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.003,
      opacity: 0.6 + Math.random() * 0.4,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!visible) return;

      // Draw connections
      CONNECTIONS.forEach(([a, b]) => {
        const nA = NODES.find(n => n.id === a);
        const nB = NODES.find(n => n.id === b);
        if (!nA || !nB) return;
        const pA = getPos(nA);
        const pB = getPos(nB);
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.strokeStyle = "rgba(159,180,193,0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Flow particles
      particles.forEach(p => {
        p.progress = (p.progress + p.speed) % 1;
        const [a, b] = p.conn;
        const nA = NODES.find(n => n.id === a);
        const nB = NODES.find(n => n.id === b);
        if (!nA || !nB) return;
        const pA = getPos(nA);
        const pB = getPos(nB);
        const x = pA.x + (pB.x - pA.x) * p.progress;
        const y = pA.y + (pB.y - pA.y) * p.progress;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(159,180,193,${p.opacity * (0.5 + 0.5 * Math.sin(t + p.progress * 10))})`;
        ctx.fill();
      });

      // Draw nodes
      NODES.forEach(node => {
        const pos = getPos(node);
        const isHovered = hoveredNode === node.id;
        const scale = isHovered ? 1.15 : 1;
        const r = (node.size / 2) * scale;

        // Glow
        const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2.5);
        grd.addColorStop(0, node.primary ? "rgba(255,255,255,0.12)" : "rgba(159,180,193,0.08)");
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Label
        ctx.font = `${node.primary ? 700 : 600} ${node.primary ? 11 : 10}px sans-serif`;
        ctx.fillStyle = node.textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.label, pos.x, pos.y);
      });
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [visible, hoveredNode]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    let found = null;
    NODES.forEach(n => {
      const dx = n.x - mx; const dy = n.y - my;
      if (Math.sqrt(dx * dx + dy * dy) < (n.size / 2 / rect.width) * 110) found = n.id;
    });
    setHoveredNode(found);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: 480, cursor: hoveredNode ? "pointer" : "default" }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        style={{ width: "100%", height: "100%", opacity: visible ? 1 : 0, transition: "opacity 1s ease" }}
      />
      {hoveredNode && (() => {
        const node = NODES.find(n => n.id === hoveredNode);
        const conns = CONNECTIONS.filter(c => c.includes(hoveredNode)).length;
        return (
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(5,8,16,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 18px", backdropFilter: "blur(12px)", pointerEvents: "none" }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, color: "#fff" }}>{node.label}</span>
            <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>{conns} connections</span>
          </div>
        );
      })()}
    </div>
  );
}
