"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const FUNDS = [
  { id:"1",  name:"KaizenCapitalGroup.Xau-TMGM", focus:"Gold Scalping",   broker:"TMGM",      status:"live",         ret:"+9.4%",  tag:"FLAGSHIP",     color:"#00E87A", link:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/94720/KCG-TMGM" },
  { id:"1a", name:"KaizenCapitalGroup.Xau-MB",   focus:"Gold Intra-day",  broker:"MultiBank", status:"live",         ret:"+11.2%", tag:"LIVE",         color:"#00E87A", link:"https://social.mexatlantic.com/portal/registration/subscription/89528/KCG30" },
  { id:"2",  name:"TradeXMarkets Fund",          focus:"Gold + Oil",      broker:"—",         status:"coming",       ret:"—",      tag:"COMING SOON",  color:"#6496C8", link:null },
  { id:"3",  name:"VaultKano Fund",              focus:"Crypto",          broker:"MultiBank", status:"relaunching",  ret:"—",      tag:"RE-LAUNCHING",  color:"#F59E0B", link:null },
  { id:"4",  name:"Exodus Investments",          focus:"Crypto + Gold",   broker:"—",         status:"coming",       ret:"—",      tag:"US INCLUDED",  color:"#9FB4C1", link:null },
  { id:"5",  name:"KCG + Phoenix",               focus:"Gold + FX",       broker:"—",         status:"coming",       ret:"—",      tag:"SPECULATIVE",  color:"#6496C8", link:null },
  { id:"6",  name:"Phoenix",                     focus:"Forex",           broker:"—",         status:"coming",       ret:"—",      tag:"COMING SOON",  color:"#6496C8", link:null },
  { id:"7",  name:"Forex Fortune AI",            focus:"EUR/USD",         broker:"—",         status:"coming",       ret:"—",      tag:"AI POWERED",   color:"#a78bfa", link:null },
  { id:"8",  name:"The Alpha Fund",              focus:"Gold Manual",     broker:"TMGM",      status:"live",         ret:"+7.8%",  tag:"LIVE",         color:"#00E87A", link:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/67622/Alpha" },
  { id:"9",  name:"Algo Amalgamation Fund",      focus:"Multi-asset",     broker:"MultiBank", status:"coming",       ret:"—",      tag:"ALGORITHMIC",  color:"#6496C8", link:null },
  { id:"10", name:"PfaneTXau Fund",              focus:"CFDs",            broker:"—",         status:"discontinued", ret:"—",      tag:"DISCONTINUED", color:"#555",    link:null },
  { id:"11", name:"MAMALYN Fund",                focus:"EUR/USD Algo",    broker:"MultiBank", status:"live",         ret:"+8.9%",  tag:"LIVE",         color:"#00E87A", link:"https://social.multibankfx.com/portal/registration/subscription/89236/mamalynMin3000dollars" },
  { id:"CX", name:"CXFund",                     focus:"Gold Trading",    broker:"TMGM",      status:"disconnected", ret:"—",      tag:"DISCONNECTED", color:"#888",    link:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/69413/CXFund2026" },
];

const CARD_W = 300;
const CARD_GAP = 20;

function Sparkline({ color }) {
  const bars = Array.from({ length: 16 }, (_, i) => ({
    h: 25 + Math.sin(i * 0.7 + 1) * 15 + i * 1.5 + Math.random() * 8,
  }));
  return (
    <div style={{ display:"flex", gap:3, height:44, alignItems:"flex-end", margin:"14px 0" }}>
      {bars.map((b, i) => (
        <div key={i} style={{
          flex:1, borderRadius:2,
          background: i === bars.length-1 ? color : `${color}55`,
          height:`${Math.min(b.h,100)}%`,
          transition:`height 0.4s ease ${i*18}ms`,
        }}/>
      ))}
    </div>
  );
}

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
  }, []);

  const onMouseLeave = useCallback(() => { if (!isTouch) setTilt({ x:0, y:0, glow:false }); }, [isTouch]);

  const isLive = fund.status === "live";
  const tagBg = isLive ? "rgba(0,232,122,0.12)"
    : fund.status === "relaunching" ? "rgba(245,158,11,0.12)"
    : "rgba(255,255,255,0.05)";

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
        flexShrink:0,
        width: CARD_W,
        background: active ? "rgba(15,28,55,0.95)" : "rgba(10,18,38,0.85)",
        border: `1px solid ${tilt.glow ? `${fund.color}40` : active ? "rgba(100,150,200,0.25)" : "rgba(255,255,255,0.07)"}`,
        borderRadius:16,
        padding:"26px 22px 22px",
        display:"flex", flexDirection:"column",
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${tilt.glow ? 1.03 : active ? 1.01 : 1})`,
        transition: tilt.glow ? "transform 0.1s ease, border-color 0.2s ease, box-shadow 0.2s ease"
          : "transform 0.5s cubic-bezier(0.23,1,0.32,1), border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: tilt.glow ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${fund.color}18`
          : active ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
        cursor: isLive ? "pointer" : "default",
        willChange:"transform",
      }}
    >
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontFamily:"sans-serif", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.25)", letterSpacing:"0.1em" }}>
          FUND {fund.id}
        </span>
        <span style={{ background:tagBg, color:fund.color, padding:"3px 9px", borderRadius:100, fontSize:9, fontWeight:800, letterSpacing:"0.1em", fontFamily:"sans-serif" }}>
          {isLive && <span style={{ display:"inline-block", width:5, height:5, borderRadius:"50%", background:fund.color, marginRight:4, verticalAlign:"middle", animation:"pulse 2s infinite" }}/>}
          {fund.tag}
        </span>
      </div>

      <div style={{ fontFamily:"sans-serif", fontSize:17, fontWeight:800, color:"#fff", lineHeight:1.2, margin:"8px 0 3px", letterSpacing:"-0.02em" }}>
        {fund.name}
      </div>
      <div style={{ fontFamily:"sans-serif", fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:12 }}>
        {fund.focus} · {fund.broker}
      </div>

      {isLive && <Sparkline color={fund.color} />}

      {/* Stats */}
      <div style={{ display:"flex", gap:10, marginTop: isLive ? 0 : 16 }}>
        <div style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px" }}>
          <div style={{ fontFamily:"sans-serif", fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Monthly</div>
          <div style={{ fontFamily:"sans-serif", fontSize:18, fontWeight:800, color: isLive ? fund.color : "rgba(255,255,255,0.2)", letterSpacing:"-0.03em" }}>{fund.ret}</div>
        </div>
        <div style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px" }}>
          <div style={{ fontFamily:"sans-serif", fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Status</div>
          <div style={{ fontFamily:"sans-serif", fontSize:12, fontWeight:700, color: isLive ? fund.color : "rgba(255,255,255,0.4)", letterSpacing:"0.02em" }}>{fund.status.toUpperCase()}</div>
        </div>
      </div>

      {/* CTA */}
      {fund.link ? (
        <a href={fund.link} target="_blank" rel="noopener noreferrer" style={{
          marginTop:16, display:"block", textAlign:"center", padding:"12px",
          borderRadius:10, background:fund.color, color:"#050810",
          fontFamily:"sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.05em",
          textDecoration:"none", transition:"opacity 0.2s ease",
        }}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}
        >{btnLabel}</a>
      ) : (
        <div style={{
          marginTop:16, textAlign:"center", padding:"12px", borderRadius:10,
          background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.25)",
          fontFamily:"sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.05em",
        }}>{btnLabel}</div>
      )}
    </div>
  );
}

export default function HorizontalFundScroll() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  const [progress, setProgress]   = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  // Only need to scroll the amount the track overflows the viewport
  // trackOverflow = (cardW + gap) * numCards - viewportW
  // We add 100vh so the section pins for long enough, plus a small buffer
  const totalScrollPx = Math.max((CARD_W + CARD_GAP) * FUNDS.length - (typeof window !== "undefined" ? window.innerWidth : 1200) + 120, 800);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const onScroll = () => {
      const rect     = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH    = window.innerHeight;
      const scrolled = -rect.top;
      const maxScroll = sectionH - viewH;
      const pct = Math.max(0, Math.min(1, scrolled / maxScroll));
      setProgress(pct);

      const trackScrollW = track.scrollWidth - track.offsetWidth;
      track.style.transform = `translateX(-${pct * trackScrollW}px)`;

      const step = CARD_W + CARD_GAP;
      setActiveIdx(Math.min(FUNDS.length - 1, Math.floor((pct * trackScrollW) / step)));
    };

    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .hfs-section { position:relative; }
        .hfs-sticky {
          position:sticky; top:0; height:100vh; overflow:hidden;
          display:flex; flex-direction:column; justify-content:center;
        }
        .hfs-header {
          padding: 0 clamp(1.5rem,6vw,80px) 28px;
          display:flex; align-items:flex-end; justify-content:space-between; flex-shrink:0;
        }
        .hfs-track {
          display:flex; gap:${CARD_GAP}px;
          padding: 0 clamp(1.5rem,6vw,60px) 8px;
          will-change:transform;
          transition: transform 0.06s linear;
        }
        .hfs-progress {
          position:absolute; bottom:24px;
          left:clamp(1.5rem,6vw,80px); right:clamp(1.5rem,6vw,80px);
          height:2px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden;
        }
        .hfs-progress-fill { height:100%; border-radius:2px; transition:width 0.05s linear; }
        .hfs-dots { display:flex; gap:5px; align-items:center; }
        .hfs-dot { border-radius:3px; transition:all 0.3s ease; }
        @media(max-width:768px){
          .hfs-section { height:auto !important; }
          .hfs-sticky { position:relative; height:auto; overflow:visible; padding:60px 0; }
          .hfs-track { overflow-x:auto; transform:none !important; padding-bottom:16px; scroll-snap-type:x mandatory; }
          .hfs-track::-webkit-scrollbar { height:3px; }
          .hfs-track::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:2px; }
        }
      `}</style>

      <div
        ref={sectionRef}
        className="hfs-section"
        style={{ height:`calc(100vh + ${totalScrollPx}px)` }}
      >
        <div className="hfs-sticky">
          <div className="hfs-header">
            <div>
              <p style={{ fontFamily:"sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.25em", color:"rgba(255,255,255,0.28)", textTransform:"uppercase", margin:"0 0 8px" }}>
                KCG Fund Collection
              </p>
              <h2 style={{ fontFamily:"sans-serif", fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:900, color:"#fff", margin:0, letterSpacing:"-0.03em", lineHeight:1 }}>
                Every fund. <span style={{ color:"rgba(255,255,255,0.35)" }}>Scroll to explore.</span>
              </h2>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {/* Arrow buttons */}
              <button
                onClick={() => {
                  const newIdx = Math.max(0, activeIdx - 1);
                  const track = trackRef.current;
                  if (!track) return;
                  const step = CARD_W + CARD_GAP;
                  track.style.transition = "transform 0.4s cubic-bezier(0.23,1,0.32,1)";
                  track.style.transform = `translateX(-${newIdx * step}px)`;
                  setTimeout(() => { track.style.transition = ""; }, 420);
                  setActiveIdx(newIdx);
                }}
                style={{
                  width:40, height:40, borderRadius:"50%",
                  background: activeIdx === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  color: activeIdx === 0 ? "rgba(255,255,255,0.2)" : "#fff",
                  cursor: activeIdx === 0 ? "default" : "pointer",
                  fontSize:18, display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.2s ease", outline:"none",
                }}
              >←</button>
              <button
                onClick={() => {
                  const newIdx = Math.min(FUNDS.length - 1, activeIdx + 1);
                  const track = trackRef.current;
                  if (!track) return;
                  const step = CARD_W + CARD_GAP;
                  track.style.transition = "transform 0.4s cubic-bezier(0.23,1,0.32,1)";
                  track.style.transform = `translateX(-${newIdx * step}px)`;
                  setTimeout(() => { track.style.transition = ""; }, 420);
                  setActiveIdx(newIdx);
                }}
                style={{
                  width:40, height:40, borderRadius:"50%",
                  background: activeIdx === FUNDS.length - 1 ? "rgba(255,255,255,0.05)" : "rgba(0,232,122,0.15)",
                  border:`1px solid ${activeIdx === FUNDS.length - 1 ? "rgba(255,255,255,0.1)" : "rgba(0,232,122,0.3)"}`,
                  color: activeIdx === FUNDS.length - 1 ? "rgba(255,255,255,0.2)" : "#00E87A",
                  cursor: activeIdx === FUNDS.length - 1 ? "default" : "pointer",
                  fontSize:18, display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.2s ease", outline:"none",
                }}
              >→</button>
              {/* Dots */}
              <div className="hfs-dots">
                {FUNDS.map((_,i) => (
                  <div key={i} className="hfs-dot" style={{
                    width: i===activeIdx ? 16 : 5,
                    height: 5,
                    background: i===activeIdx ? "#00E87A" : "rgba(255,255,255,0.15)",
                  }}/>
                ))}
              </div>
            </div>
          </div>

          <div ref={trackRef} className="hfs-track">
            {FUNDS.map((fund, i) => (
              <FundCard key={fund.id} fund={fund} active={i===activeIdx} />
            ))}
          </div>

          <div className="hfs-progress">
            <div className="hfs-progress-fill" style={{
              width:`${progress*100}%`,
              background:"linear-gradient(90deg,#6496C8,#00E87A)",
            }}/>
          </div>
        </div>
      </div>
    </>
  );
}
