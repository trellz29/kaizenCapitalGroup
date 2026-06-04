"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const ROLES = ["Capital Strategy", "Disciplined Execution", "Long-term Growth", "Institutional Precision"];

export default function HeroGSAP() {
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const descRef = useRef(null);
  const ctasRef = useRef(null);
  const scrollRef = useRef(null);
  const canvasRef = useRef(null);
  const [roleIdx, setRoleIdx] = useState(0);
  const [ready, setReady] = useState(false);

  // Animated canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.offsetWidth || window.innerWidth;
    let H = canvas.offsetHeight || window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const mouse = { x: W / 2, y: H / 2 };
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });

    const COUNT = 60;
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Mouse glow
      const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
      grd.addColorStop(0, "rgba(159,180,193,0.18)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // Connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d/140) * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        // Mouse connections
        const mdx = pts[i].x - mouse.x;
        const mdy = pts[i].y - mouse.y;
        const md = Math.sqrt(mdx*mdx + mdy*mdy);
        if (md < 180) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(159,180,193,${(1 - md/180) * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Points
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setReady(true);
      requestAnimationFrame(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (eyebrowRef.current) tl.fromTo(eyebrowRef.current, { opacity:0, y:20, filter:"blur(8px)" }, { opacity:1, y:0, filter:"blur(0px)", duration:1, delay:0.1 });
        if (titleRef.current) tl.fromTo(titleRef.current, { opacity:0, y:60 }, { opacity:1, y:0, duration:1.2 }, "-=0.6");
        if (descRef.current) tl.fromTo(descRef.current, { opacity:0, y:20, filter:"blur(6px)" }, { opacity:1, y:0, filter:"blur(0px)", duration:0.9 }, "-=0.7");
        if (ctasRef.current) tl.fromTo(ctasRef.current, { opacity:0, y:20 }, { opacity:1, y:0, duration:0.8 }, "-=0.5");
        if (scrollRef.current) tl.fromTo(scrollRef.current, { opacity:0 }, { opacity:1, duration:0.6 }, "-=0.2");
      });
    }, 500);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2200);
    return () => clearInterval(t);
  }, []);

  const css = `
    @keyframes kcgScrollAnim { 0%{transform:translateY(-100%);opacity:0} 20%,80%{opacity:1} 100%{transform:translateY(200%);opacity:0} }
    @keyframes kcgHeroPulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
    .kcg-hero-bg {
      position:absolute; inset:0;
      background: linear-gradient(135deg, #050d18 0%, #0a1628 40%, #0f1e35 70%, #091422 100%);
    }
    .kcg-hero-glow1 {
      position:absolute; top:-20%; left:-10%;
      width:70vw; height:70vw; max-width:900px; max-height:900px;
      border-radius:50%;
      background: radial-gradient(circle, rgba(100,140,180,0.12) 0%, transparent 65%);
      animation: kcgHeroPulse 6s ease-in-out infinite;
      pointer-events:none;
    }
    .kcg-hero-glow2 {
      position:absolute; bottom:-10%; right:-5%;
      width:50vw; height:50vw; max-width:600px; max-height:600px;
      border-radius:50%;
      background: radial-gradient(circle, rgba(80,120,160,0.10) 0%, transparent 65%);
      animation: kcgHeroPulse 9s ease-in-out 3s infinite;
      pointer-events:none;
    }
    .kcg-gsap-eyebrow { font-size:11px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:rgba(255,255,255,0.38); margin:0 0 2rem; font-family:sans-serif; display:flex; align-items:center; gap:10px; }
    .kcg-gsap-eyebrow::before { content:""; width:28px; height:1px; background:rgba(255,255,255,0.2); flex-shrink:0; }
    .kcg-gsap-title { font-size:clamp(2.8rem,5.8vw,5.8rem); font-weight:800; line-height:1.02; letter-spacing:-0.03em; color:#fff; margin:0 0 1.5rem; font-family:sans-serif; }
    .kcg-gsap-role {
      font-style:italic; display:block;
      background: linear-gradient(90deg, #9FB4C1, #C9D8E2, #7BA3BA);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .kcg-gsap-desc { font-size:clamp(0.95rem,1.4vw,1.1rem); color:rgba(255,255,255,0.45); line-height:1.85; max-width:480px; margin:0 0 2.5rem; font-family:sans-serif; }
    .kcg-gsap-ctas { display:flex; gap:14px; flex-wrap:wrap; }
    .kcg-gsap-btn-solid {
      background: linear-gradient(135deg, #fff 0%, #e8f0f5 100%);
      color:#050d18; font-size:13px; font-weight:700; padding:14px 32px;
      border-radius:100px; text-decoration:none; font-family:sans-serif;
      transition:all 0.3s cubic-bezier(0.16,1,0.3,1);
      display:inline-flex; align-items:center; gap:6px;
      box-shadow: 0 0 0 0 rgba(255,255,255,0);
    }
    .kcg-gsap-btn-solid:hover {
      transform:scale(1.06) translateY(-2px);
      box-shadow: 0 12px 40px rgba(255,255,255,0.2);
    }
    .kcg-gsap-btn-outline {
      border:1.5px solid rgba(255,255,255,0.22);
      color:#fff; font-size:13px; font-weight:600; padding:14px 32px;
      border-radius:100px; text-decoration:none; font-family:sans-serif;
      transition:all 0.3s cubic-bezier(0.16,1,0.3,1);
      display:inline-flex; align-items:center; gap:6px;
      backdrop-filter: blur(8px); background: rgba(255,255,255,0.04);
    }
    .kcg-gsap-btn-outline:hover {
      border-color:rgba(255,255,255,0.55); background:rgba(255,255,255,0.09);
      transform:scale(1.06) translateY(-2px);
    }
    .kcg-scroll-ind { position:absolute; bottom:2.5rem; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; }
    .kcg-scroll-label { font-size:9px; color:rgba(255,255,255,0.25); letter-spacing:0.22em; text-transform:uppercase; font-family:sans-serif; }
    .kcg-scroll-track { width:1px; height:42px; background:rgba(255,255,255,0.08); position:relative; overflow:hidden; }
    .kcg-scroll-fill { position:absolute; top:0; left:0; right:0; height:40%; background:rgba(255,255,255,0.5); animation:kcgScrollAnim 2s ease-in-out infinite; }
    .kcg-stat-row { display:flex; gap:2.5rem; flex-wrap:wrap; margin-top:3rem; padding-top:2.5rem; border-top:1px solid rgba(255,255,255,0.07); }
    .kcg-stat-item { display:flex; flex-direction:column; gap:3px; }
    .kcg-stat-num { font-size:1.5rem; font-weight:800; color:#fff; font-family:sans-serif; letter-spacing:-0.02em; }
    .kcg-stat-lbl { font-size:10px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.3); font-family:sans-serif; }
  `;

  return (
    <>
      <style>{css}</style>
      {/* Dark cinematic bg */}
      <div className="kcg-hero-bg" />
      <div className="kcg-hero-glow1" />
      <div className="kcg-hero-glow2" />

      {/* Interactive particle canvas */}
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:2 }} />

      {/* Grid lines overlay */}
      <div style={{
        position:"absolute", inset:0, zIndex:3, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize:"80px 80px"
      }} />

      {/* Content */}
      <div style={{ position:"absolute", inset:0, zIndex:6, display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px clamp(1.5rem,8vw,110px) 5rem" }}>
        <p ref={eyebrowRef} className="kcg-gsap-eyebrow" style={{ opacity:0 }}>
          Institutional Capital Strategy
        </p>
        <h1 ref={titleRef} className="kcg-gsap-title" style={{ opacity:0 }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIdx}
              className="kcg-gsap-role"
              initial={{ opacity:0, y:18, filter:"blur(6px)" }}
              animate={{ opacity:1, y:0, filter:"blur(0px)" }}
              exit={{ opacity:0, y:-18, filter:"blur(6px)" }}
              transition={{ duration:0.45, ease:"easeOut" }}
            >
              {ROLES[roleIdx]}
            </motion.span>
          </AnimatePresence>
          <span style={{ display:"block" }}>for long-term growth.</span>
        </h1>
        <p ref={descRef} className="kcg-gsap-desc" style={{ opacity:0 }}>
          Kaizen Capital Group is a disciplined capital strategy platform — 12 active funds, institutional execution, and premium presentation built for serious investors.
        </p>
        <div ref={ctasRef} className="kcg-gsap-ctas" style={{ opacity:0 }}>
          <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" className="kcg-gsap-btn-solid" data-cursor-label="Book">
            Start the Conversation ↗
          </a>
          <a href="#funds" className="kcg-gsap-btn-outline" data-cursor-label="View">
            View Funds →
          </a>
        </div>
        <div className="kcg-stat-row" style={{ opacity:0 }} ref={scrollRef}>
          <div className="kcg-stat-item"><span className="kcg-stat-num">12</span><span className="kcg-stat-lbl">Active Funds</span></div>
          <div className="kcg-stat-item"><span className="kcg-stat-num">9.2%</span><span className="kcg-stat-lbl">Avg Monthly</span></div>
          <div className="kcg-stat-item"><span className="kcg-stat-num">$847M+</span><span className="kcg-stat-lbl">Volume</span></div>
          <div className="kcg-stat-item"><span className="kcg-stat-num">4+</span><span className="kcg-stat-lbl">Active Users</span></div>
        </div>
      </div>

      <div style={{ position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)", zIndex:6 }}>
        <div className="kcg-scroll-ind">
          <span className="kcg-scroll-label">Scroll</span>
          <div className="kcg-scroll-track"><div className="kcg-scroll-fill" /></div>
        </div>
      </div>
    </>
  );
}
