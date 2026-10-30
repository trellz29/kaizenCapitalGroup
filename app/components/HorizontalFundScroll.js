"use client";
import { useRef, useState, useCallback, useEffect } from "react";

import { FUNDS, RISK_LINE } from "../data/funds";

const CARD_W = 300;
const CARD_GAP = 20;

function FundCard({ fund, active }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x:0, y:0, glow:false });
  const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const onMouseMove = useCallback((e) => {
    if (isTouch) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = -((e.clientY - r.top) / r.height - 0.5) * 18;
    setTilt({ x, y, glow:true });
  }, [isTouch]);

  const onMouseLeave = useCallback(() => {
    if (!isTouch) setTilt({ x:0, y:0, glow:false });
  }, [isTouch]);

  const isLive = fund.status === "live";
  const tagBg = isLive ? "rgba(0,232,122,0.12)" : fund.status === "relaunching" ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)";

  const btnLabel = isLive ? "Subscribe Now →"
    : fund.status === "relaunching" ? "Re-Launching Soon"
    : fund.status === "discontinued" ? "Discontinued"
    : fund.status === "disconnected" ? "Disconnected"
    : "Coming Soon";

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        flexShrink:0, width: CARD_W,
        background: active ? "rgba(15,28,55,0.95)" : "rgba(10,18,38,0.85)",
        border: `1px solid ${tilt.glow ? `${fund.color}40` : active ? "rgba(100,150,200,0.25)" : "rgba(255,255,255,0.07)"}`,
        borderRadius:16, padding:"26px 22px 22px",
        display:"flex", flexDirection:"column",
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${tilt.glow ? 1.03 : 1})`,
        transition: tilt.glow ? "transform 0.1s ease, border-color 0.2s ease" : "transform 0.5s cubic-bezier(0.23,1,0.32,1), border-color 0.3s ease",
        boxShadow: tilt.glow ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${fund.color}18` : "none",
        cursor: isLive ? "pointer" : "default",
        scrollSnapAlign: "start",
      }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontFamily:"sans-serif", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.25)", letterSpacing:"0.1em" }}>FUND {fund.id}</span>
        <span style={{ background:tagBg, color:fund.color, padding:"3px 9px", borderRadius:100, fontSize:9, fontWeight:800, letterSpacing:"0.1em", fontFamily:"sans-serif" }}>
          {isLive && <span style={{ display:"inline-block", width:5, height:5, borderRadius:"50%", background:fund.color, marginRight:4, verticalAlign:"middle" }}/>}
          {fund.tag}
        </span>
      </div>
      <div style={{ fontFamily:"sans-serif", fontSize:17, fontWeight:800, color:"#fff", lineHeight:1.2, margin:"8px 0 3px", letterSpacing:"-0.02em" }}>{fund.name}</div>
      <div style={{ fontFamily:"sans-serif", fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:4 }}>{fund.focus}</div>
      <div style={{ display:"flex", gap:12, marginBottom:12 }}>
        <span style={{ fontFamily:"sans-serif", fontSize:10, color:"rgba(255,255,255,0.28)" }}>🏦 {fund.broker}</span>
        {fund.managers > 0 && <span style={{ fontFamily:"sans-serif", fontSize:10, color:"rgba(255,255,255,0.28)" }}>👤 {fund.managers} {fund.managers === 1 ? "Manager" : "Managers"}</span>}
        {fund.managers === 0 && <span style={{ fontFamily:"sans-serif", fontSize:10, color:"rgba(100,150,200,0.6)" }}>🤖 Algorithmic</span>}
      </div>
      <div style={{ display:"flex", gap:10, marginTop: isLive ? 0 : 16 }}>
        <div style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px" }}>
          <div style={{ fontFamily:"sans-serif", fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Track record</div>
          <div style={{ fontFamily:"sans-serif", fontSize:12, fontWeight:700, color: fund.track ? fund.color : "rgba(255,255,255,0.4)" }}>{fund.track ? "Verified ↓" : isLive ? "Link pending" : "—"}</div>
        </div>
        <div style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px" }}>
          <div style={{ fontFamily:"sans-serif", fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Status</div>
          <div style={{ fontFamily:"sans-serif", fontSize:12, fontWeight:700, color: isLive ? fund.color : "rgba(255,255,255,0.4)" }}>{fund.status.toUpperCase()}</div>
        </div>
      </div>
      {fund.link ? (
        <a href={fund.link} target="_blank" rel="noopener noreferrer" style={{ marginTop:16, display:"block", textAlign:"center", padding:"12px", borderRadius:10, background:fund.color, color:"#050810", fontFamily:"sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.05em", textDecoration:"none" }}>
          {btnLabel}
        </a>
      ) : (
        <div style={{ marginTop:16, textAlign:"center", padding:"12px", borderRadius:10, background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.25)", fontFamily:"sans-serif", fontSize:12, fontWeight:700 }}>{btnLabel}</div>
      )}

      {fund.track && (
        <a href={fund.track} target="_blank" rel="noopener noreferrer"
          style={{ marginTop:8, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"9px 12px", borderRadius:10, background:"rgba(0,232,122,0.05)", border:"1px solid rgba(0,232,122,0.2)", fontFamily:"sans-serif", fontSize:11, fontWeight:700, color:"rgba(0,232,122,0.7)", textDecoration:"none", letterSpacing:"0.03em", transition:"all 0.2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(0,232,122,0.1)"; e.currentTarget.style.color="#00E87A"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="rgba(0,232,122,0.05)"; e.currentTarget.style.color="rgba(0,232,122,0.7)"; }}
        >
          <span>✓</span> Verified Track Record
        </a>
      )}
    </div>
  );
}

export default function HorizontalFundScroll() {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setCanLeft(t.scrollLeft > 10);
    setCanRight(t.scrollLeft < t.scrollWidth - t.clientWidth - 10);
    const step = CARD_W + CARD_GAP;
    setActiveIdx(Math.min(FUNDS.length - 1, Math.round(t.scrollLeft / step)));
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    t.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    return () => t.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  const scrollTo = (dir) => {
    const t = trackRef.current;
    if (!t) return;
    t.scrollBy({ left: dir * (CARD_W + CARD_GAP), behavior: "smooth" });
  };

  return (
    <div style={{ padding: "80px 0 100px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:"0 clamp(1.5rem,6vw,80px) 28px" }}>
        <div>
          <p style={{ fontFamily:"sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.25em", color:"rgba(255,255,255,0.28)", textTransform:"uppercase", margin:"0 0 8px" }}>KCG Fund Collection</p>
          <h2 style={{ fontFamily:"sans-serif", fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:900, color:"#fff", margin:0, letterSpacing:"-0.03em", lineHeight:1 }}>
            Every fund. <span style={{ color:"rgba(255,255,255,0.35)" }}>Scroll to explore.</span>
          </h2>
        </div>
        {/* Arrow buttons */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => scrollTo(-1)} style={{ width:40, height:40, borderRadius:"50%", background: canLeft ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)", border:`1px solid ${canLeft ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`, color: canLeft ? "#fff" : "rgba(255,255,255,0.2)", fontSize:18, cursor: canLeft ? "pointer" : "default", display:"flex", alignItems:"center", justifyContent:"center", outline:"none", transition:"all 0.2s" }}>←</button>
          <button onClick={() => scrollTo(1)} style={{ width:40, height:40, borderRadius:"50%", background: canRight ? "rgba(0,232,122,0.15)" : "rgba(255,255,255,0.04)", border:`1px solid ${canRight ? "rgba(0,232,122,0.3)" : "rgba(255,255,255,0.06)"}`, color: canRight ? "#00E87A" : "rgba(255,255,255,0.2)", fontSize:18, cursor: canRight ? "pointer" : "default", display:"flex", alignItems:"center", justifyContent:"center", outline:"none", transition:"all 0.2s" }}>→</button>
          {/* Dots */}
          <div style={{ display:"flex", gap:5, marginLeft:8 }}>
            {FUNDS.map((_,i) => (
              <div key={i} style={{ height:5, borderRadius:3, transition:"all 0.3s ease", width: i===activeIdx ? 16 : 5, background: i===activeIdx ? "#00E87A" : "rgba(255,255,255,0.15)" }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        style={{
          display:"flex", gap:CARD_GAP, overflowX:"auto", overflowY:"visible",
          padding:`8px clamp(1.5rem,6vw,80px) 24px`,
          scrollSnapType:"x mandatory",
          WebkitOverflowScrolling:"touch",
          scrollbarWidth:"thin",
          scrollbarColor:"rgba(255,255,255,0.15) transparent",
        }}
      >
        {FUNDS.map((fund, i) => (
          <FundCard key={fund.id} fund={fund} active={i === activeIdx} />
        ))}
      </div>

      <p style={{ margin:"0 clamp(1.5rem,6vw,80px) 16px", fontFamily:"sans-serif", fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>
        Fund performance is shown only on each fund&apos;s own verified track record. {RISK_LINE}
      </p>
      {/* Progress bar */}
      <div style={{ margin:"12px clamp(1.5rem,6vw,80px) 0", height:2, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:2, background:"linear-gradient(90deg,#6496C8,#00E87A)", width:`${((activeIdx+1)/FUNDS.length)*100}%`, transition:"width 0.3s ease" }}/>
      </div>
    </div>
  );
}
