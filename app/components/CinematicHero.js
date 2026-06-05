"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = ["Capital Allocation", "Asset Management", "Alternative Investments", "Digital Assets", "Venture Capital"];

export default function CinematicHero() {
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const [roleIdx, setRoleIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const mouse = { x: W / 2, y: H / 2 };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouseRef.current = { x: e.clientX / W, y: e.clientY / H };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const N = Math.min(Math.floor(W * H / 12000), 80);
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.4,
      o: Math.random() * 0.5 + 0.15,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Mouse glow
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
      g.addColorStop(0, "rgba(100,150,220,0.1)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // Lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(159,180,193,${(1 - d / 150) * 0.18})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
        // Mouse pull
        const mdx = pts[i].x - mouse.x;
        const mdy = pts[i].y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 200) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(100,160,255,${(1 - md / 200) * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,240,${p.o})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // GSAP entrance
  useEffect(() => {
    const t = setTimeout(() => {
      setReady(true);
      requestAnimationFrame(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        if (titleRef.current) tl.fromTo(titleRef.current, { opacity: 0, y: 80, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4 }, 0);
        if (subRef.current) tl.fromTo(subRef.current, { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }, 0.5);
        if (ctaRef.current) tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.8);
        if (statsRef.current) tl.fromTo(statsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 1);
      });
    }, 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        .hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 120% 80% at 60% 40%, rgba(12,26,48,0.9) 0%, #050810 65%);
        }
        .hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(159,180,193,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(159,180,193,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }
        .hero-glow-1 {
          position: absolute; top: -20%; right: 5%;
          width: 55vw; height: 55vw; max-width: 700px; max-height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(50,100,180,0.12) 0%, transparent 65%);
          pointer-events: none; animation: heroGlow 8s ease-in-out infinite;
        }
        .hero-glow-2 {
          position: absolute; bottom: 10%; left: 5%;
          width: 35vw; height: 35vw; max-width: 450px; max-height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(100,150,200,0.08) 0%, transparent 65%);
          pointer-events: none; animation: heroGlow 12s ease-in-out 4s infinite;
        }
        @keyframes heroGlow { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        .hero-eyebrow {
          font-family: sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(159,180,193,0.6);
          display: flex; align-items: center; gap: 12px; margin-bottom: 2rem;
        }
        .hero-eyebrow::before { content:""; width:32px; height:1px; background:rgba(159,180,193,0.3); }
        .hero-title {
          font-family: sans-serif;
          font-size: clamp(2.8rem, 6.5vw, 6.5rem);
          font-weight: 900; line-height: 1.0; letter-spacing: -0.04em;
          color: #fff; margin: 0 0 0.5rem;
        }
        .hero-title-accent {
          display: block;
          background: linear-gradient(135deg, #9FB4C1 0%, #ffffff 40%, #C9D8E2 60%, #7BA3BA 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerTitle 6s linear infinite;
        }
        @keyframes shimmerTitle { 0%{background-position:0%} 100%{background-position:200%} }
        .hero-role-wrapper { display:inline-block; overflow:hidden; height:1.1em; vertical-align:bottom; }
        .hero-desc {
          font-family: sans-serif; font-size: clamp(0.9rem, 1.3vw, 1.05rem);
          color: rgba(255,255,255,0.38); line-height: 1.8; max-width: 520px;
          margin: 0 0 2.5rem; font-weight: 400; letter-spacing: 0.01em;
        }
        .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-btn-primary {
          padding: 14px 32px; border-radius: 100px;
          background: #fff; color: #050810;
          font-family: sans-serif; font-size: 13px; font-weight: 700;
          text-decoration: none; letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          display: inline-flex; align-items: center; gap: 6px;
        }
        .hero-btn-primary:hover { transform: scale(1.06) translateY(-2px); box-shadow: 0 16px 48px rgba(255,255,255,0.2); }
        .hero-btn-secondary {
          padding: 14px 32px; border-radius: 100px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.75);
          font-family: sans-serif; font-size: 13px; font-weight: 600;
          text-decoration: none; letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          display: inline-flex; align-items: center; gap: 6px;
          backdrop-filter: blur(8px);
        }
        .hero-btn-secondary:hover { border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.08); transform: scale(1.04) translateY(-2px); }
        .hero-stats { display: flex; gap: 3rem; flex-wrap: wrap; padding-top: 3rem; margin-top: 3rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .hero-stat-num { font-family: sans-serif; font-size: clamp(1.8rem,3.5vw,2.8rem); font-weight: 900; color: #fff; letter-spacing: -0.04em; line-height: 1; }
        .hero-stat-lbl { font-family: sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-top: 6px; }
        .hero-scroll-ind {
          position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .hero-scroll-lbl { font-family: sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.18); }
        @keyframes scrollBounce { 0%,100%{opacity:0.2;transform:translateY(-4px)} 50%{opacity:0.6;transform:translateY(4px)} }
        .hero-scroll-arrow { animation: scrollBounce 2s ease-in-out infinite; color: rgba(255,255,255,0.25); font-size: 18px; }
      `}</style>

      {/* Backgrounds */}
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 6,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "100px clamp(1.5rem, 8vw, 100px) 5rem",
        maxWidth: 1200, margin: "0 auto", width: "100%",
        left: "50%", transform: "translateX(-50%)",
      }}>
        <p className="hero-eyebrow" style={{ opacity: 0 }} ref={el => { if (titleRef.current === null) titleRef.current = el; }}>
          Institutional Capital Strategy
        </p>

        <h1 className="hero-title" ref={titleRef} style={{ opacity: 0 }}>
          Building the Future<br />
          <span className="hero-title-accent">of Capital</span>{" "}
          <div className="hero-role-wrapper">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIdx}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "inline-block", color: "rgba(255,255,255,0.5)", WebkitTextFillColor: "initial" }}
              >
                {ROLES[roleIdx]}.
              </motion.span>
            </AnimatePresence>
          </div>
        </h1>

        <p className="hero-desc" ref={subRef} style={{ opacity: 0 }}>
          Kaizen Capital Group operates 12 active funds across Gold, Forex, Crypto, and multi-asset strategies — built for serious investors seeking disciplined, institutional-grade execution.
        </p>

        <div className="hero-ctas" ref={ctaRef} style={{ opacity: 0 }}>
          <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" className="hero-btn-primary">
            Start a Conversation ↗
          </a>
          <a href="#funds" className="hero-btn-secondary">
            Explore Funds →
          </a>
        </div>

        <div className="hero-stats" ref={statsRef} style={{ opacity: 0 }}>
          {[
            { num: "12", lbl: "Active Funds" },
            { num: "9.2%", lbl: "Avg Monthly Return" },
            { num: "$847M+", lbl: "Total Volume" },
            { num: "4+", lbl: "Active Users" },
          ].map(s => (
            <div key={s.lbl}>
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-ind" style={{ zIndex: 6 }}>
        <span className="hero-scroll-lbl">Scroll</span>
        <span className="hero-scroll-arrow">↓</span>
      </div>
    </>
  );
}
