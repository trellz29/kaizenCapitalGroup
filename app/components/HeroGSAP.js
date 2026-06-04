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
  const [roleIdx, setRoleIdx] = useState(0);
  const [ready, setReady] = useState(false);

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
    .kcg-gsap-eyebrow { font-size:11px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:rgba(255,255,255,0.38); margin:0 0 2rem; font-family:sans-serif; display:flex; align-items:center; gap:10px; }
    .kcg-gsap-eyebrow::before { content:""; width:28px; height:1px; background:rgba(255,255,255,0.2); flex-shrink:0; }
    .kcg-gsap-title { font-size:clamp(2.6rem,5.5vw,5.2rem); font-weight:800; line-height:1.05; letter-spacing:-0.025em; color:#fff; margin:0 0 1.5rem; font-family:sans-serif; }
    .kcg-gsap-role { font-style:italic; color:rgba(255,255,255,0.65); display:block; }
    .kcg-gsap-desc { font-size:clamp(0.95rem,1.4vw,1.08rem); color:rgba(255,255,255,0.48); line-height:1.78; max-width:460px; margin:0 0 2.5rem; font-family:sans-serif; }
    .kcg-gsap-ctas { display:flex; gap:14px; flex-wrap:wrap; }
    .kcg-gsap-btn-solid { background:#fff; color:#050d18; font-size:13px; font-weight:600; padding:13px 28px; border-radius:100px; text-decoration:none; font-family:sans-serif; transition:all 0.2s ease; display:inline-flex; align-items:center; gap:6px; }
    .kcg-gsap-btn-solid:hover { background:rgba(255,255,255,0.88); transform:scale(1.03); box-shadow:0 8px 24px rgba(0,0,0,0.35); }
    .kcg-gsap-btn-outline { border:1.5px solid rgba(255,255,255,0.16); color:#fff; font-size:13px; font-weight:500; padding:13px 28px; border-radius:100px; text-decoration:none; font-family:sans-serif; transition:all 0.2s ease; display:inline-flex; align-items:center; gap:6px; }
    .kcg-gsap-btn-outline:hover { border-color:rgba(255,255,255,0.38); background:rgba(255,255,255,0.05); transform:scale(1.03); }
    .kcg-scroll-ind { position:absolute; bottom:2rem; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; }
    .kcg-scroll-label { font-size:9px; color:rgba(255,255,255,0.28); letter-spacing:0.22em; text-transform:uppercase; font-family:sans-serif; }
    .kcg-scroll-track { width:1px; height:38px; background:rgba(255,255,255,0.1); position:relative; overflow:hidden; }
    .kcg-scroll-fill { position:absolute; top:0; left:0; right:0; height:40%; background:rgba(255,255,255,0.45); animation:kcgScrollAnim 2s ease-in-out infinite; }
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{ position:"absolute", inset:0, zIndex:6, display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px clamp(1.5rem,8vw,110px) 5rem" }}>
        <p ref={eyebrowRef} className="kcg-gsap-eyebrow" style={{ opacity:0 }}>
          Institutional Capital Strategy
        </p>
        <h1 ref={titleRef} className="kcg-gsap-title" style={{ opacity:0 }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIdx}
              className="kcg-gsap-role"
              initial={{ opacity:0, y:14 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-14 }}
              transition={{ duration:0.38, ease:"easeOut" }}
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
          <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" className="kcg-gsap-btn-solid">
            Start the Conversation ↗
          </a>
          <a href="#funds" className="kcg-gsap-btn-outline">
            View Funds →
          </a>
        </div>
      </div>
      <div ref={scrollRef} className="kcg-scroll-ind" style={{ opacity:0, zIndex:6 }}>
        <span className="kcg-scroll-label">Scroll</span>
        <div className="kcg-scroll-track">
          <div className="kcg-scroll-fill" />
        </div>
      </div>
    </>
  );
}
