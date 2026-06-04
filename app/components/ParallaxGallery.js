"use client";
import { useEffect, useRef } from "react";

const CARDS = [
  { label:"Gold Scalping", sub:"XAU/USD", tag:"Live", bg:"#0F1A28", accent:"#F5A623" },
  { label:"Disciplined Execution", sub:"Risk-First Framework", tag:"Core", bg:"#1a2f45", accent:"#229ED9" },
  { label:"Fund 3", sub:"Multi-Asset", tag:"Active", bg:"#0d2035", accent:"#22c55e" },
  { label:"Institutional Grade", sub:"Copy Trading", tag:"Verified", bg:"#1c1c2e", accent:"#a78bfa" },
  { label:"Long-Term Growth", sub:"Capital Preservation", tag:"Strategy", bg:"#0F1A28", accent:"#f97316" },
  { label:"KCG AI Systems", sub:"Algorithmic Signals", tag:"Beta", bg:"#0a1628", accent:"#229ED9" },
];

export default function ParallaxGallery() {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const maxShift = track.scrollWidth - track.clientWidth;
      track.style.transform = "translateX(-" + (progress * maxShift * 0.65) + "px)";
      Array.from(track.children).forEach((card, i) => {
        const speed = 1 + i * 0.04;
        card.style.transform = "translateY(" + (progress * (i % 2 === 0 ? -18 : 14) * speed) + "px)";
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{ height:"60vh", background:"#07111f", overflow:"hidden", position:"relative" }}
    >
      <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, display:"flex", alignItems:"center" }}>
        <div
          ref={trackRef}
          style={{ display:"flex", gap:20, padding:"0 48px", willChange:"transform" }}
        >
          {CARDS.map((c, i) => (
            <div
              key={i}
              style={{
                flexShrink:0, width:280, height:200, borderRadius:20,
                background:c.bg, border:"1px solid rgba(255,255,255,0.08)",
                padding:28, display:"flex", flexDirection:"column",
                justifyContent:"space-between", willChange:"transform"
              }}
            >
              <div>
                <span style={{
                  display:"inline-block", fontSize:10, fontWeight:700,
                  letterSpacing:"0.15em", textTransform:"uppercase",
                  color:c.accent, background:c.accent + "22",
                  borderRadius:6, padding:"3px 8px", marginBottom:12
                }}>{c.tag}</span>
                <p style={{ fontSize:17, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{c.label}</p>
              </div>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{c.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
