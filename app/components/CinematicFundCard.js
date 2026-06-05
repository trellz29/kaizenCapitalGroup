"use client";
import { useRef } from "react";

const STATUS_CONFIG = {
  live: { label: "LIVE", bg: "rgba(0,232,120,0.12)", color: "#00E87A", border: "rgba(0,232,120,0.3)", dot: "#00E87A" },
  "re-launching": { label: "RELAUNCHING", bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.3)", dot: "#F59E0B" },
  "n/a": { label: "DEVELOPING", bg: "rgba(159,180,193,0.08)", color: "rgba(159,180,193,0.6)", border: "rgba(159,180,193,0.15)", dot: "rgba(159,180,193,0.4)" },
  "disconnected": { label: "PAUSED", bg: "rgba(100,100,120,0.08)", color: "rgba(180,180,200,0.4)", border: "rgba(180,180,200,0.1)", dot: "rgba(180,180,200,0.3)" },
  "discontinuation": { label: "CLOSED", bg: "rgba(200,50,50,0.08)", color: "rgba(220,100,100,0.6)", border: "rgba(220,100,100,0.15)", dot: "rgba(220,100,100,0.4)" },
};

export default function CinematicFundCard({ label, name, focus, strategy, managers, brokerage, status, extra, primaryLink, secondaryLinks = [] }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const rafRef = useRef(null);
  const sl = (status || "n/a").toLowerCase();
  const cfg = STATUS_CONFIG[sl] || STATUS_CONFIG["n/a"];
  const isLive = sl === "live";

  const onMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -10;
    const rotY = ((x - cx) / cx) * 10;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      card.style.transition = "transform 0.08s ease";
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${(x/rect.width)*100}% ${(y/rect.height)*100}%, ${cfg.color}22 0%, transparent 60%)`;
        glow.style.opacity = "1";
      }
    });
  };

  const onLeave = () => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    card.style.transform = "perspective(700px) rotateX(0) rotateY(0) scale(1)";
    card.style.transition = "transform 0.7s cubic-bezier(0.16,1,0.3,1)";
    if (glow) glow.style.opacity = "0";
  };

  return (
    <>
      <style>{`
        .cfc { position:relative; border-radius:20px; padding:24px; cursor:default;
          background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07);
          backdrop-filter:blur(12px); will-change:transform; transform-style:preserve-3d;
          overflow:hidden; transition:border-color 0.3s ease;
        }
        .cfc:hover { border-color:rgba(255,255,255,0.14); }
        .cfc.live { background:rgba(0,30,20,0.4); border-color:rgba(0,232,120,0.15); }
        .cfc.live:hover { border-color:rgba(0,232,120,0.35); }
        .cfc-top-line { position:absolute; top:0; left:0; right:0; height:1px; }
        .cfc-glow { position:absolute; inset:0; pointer-events:none; z-index:0; opacity:0; transition:opacity 0.3s ease; border-radius:inherit; }
        .cfc-content { position:relative; z-index:1; }
        .cfc-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
        .cfc-label { font-family:sans-serif; font-size:10px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(159,180,193,0.5); margin-bottom:4px; }
        .cfc-name { font-family:sans-serif; font-size:1.05rem; font-weight:700; color:#fff; letter-spacing:-0.01em; line-height:1.3; }
        .cfc-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; font-family:sans-serif; font-size:9px; font-weight:700; letter-spacing:0.15em; flex-shrink:0; }
        .cfc-dot { width:5px; height:5px; border-radius:50%; }
        .cfc-live-dot { animation:livePulse 1.5s ease-in-out infinite; }
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        .cfc-fields { display:grid; gap:8px; margin-bottom:16px; }
        .cfc-field { background:rgba(255,255,255,0.04); border-radius:10px; padding:10px 12px; font-family:sans-serif; font-size:12px; color:rgba(200,220,235,0.65); line-height:1.5; }
        .cfc-field strong { color:rgba(159,180,193,0.8); font-weight:600; }
        .cfc-btns { display:flex; gap:8px; flex-wrap:wrap; margin-top:auto; }
        .cfc-btn-primary { padding:9px 18px; border-radius:100px; font-family:sans-serif; font-size:12px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; transition:all 0.2s ease; }
        .cfc-btn-primary:hover { transform:scale(1.06); }
        .cfc-btn-secondary { padding:9px 18px; border-radius:100px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); color:rgba(200,220,235,0.7); font-family:sans-serif; font-size:12px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; transition:all 0.2s ease; }
        .cfc-btn-secondary:hover { border-color:rgba(255,255,255,0.25); background:rgba(255,255,255,0.08); }
      `}</style>
      <div
        ref={cardRef}
        className={`cfc${isLive ? " live" : ""}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* Top accent line */}
        <div className="cfc-top-line" style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}60, transparent)` }} />

        {/* Cursor glow */}
        <div ref={glowRef} className="cfc-glow" />

        <div className="cfc-content">
          <div className="cfc-header">
            <div>
              <div className="cfc-label">{label}</div>
              <div className="cfc-name">{name}</div>
            </div>
            <div className="cfc-badge" style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
              <span className={`cfc-dot${isLive ? " cfc-live-dot" : ""}`} style={{ background: cfg.dot }} />
              {cfg.label}
            </div>
          </div>

          <div className="cfc-fields">
            <div className="cfc-field"><strong>Focus:</strong> {focus}</div>
            <div className="cfc-field"><strong>Strategy:</strong> {strategy}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div className="cfc-field"><strong>Managers:</strong> {managers}</div>
              <div className="cfc-field"><strong>Broker:</strong> {brokerage}</div>
            </div>
            {extra && <div className="cfc-field"><strong>Notes:</strong> {extra}</div>}
          </div>

          {(primaryLink || secondaryLinks.length > 0) && (
            <div className="cfc-btns">
              {primaryLink && (
                <a href={primaryLink} target="_blank" rel="noopener noreferrer" className="cfc-btn-primary"
                  style={{ background: isLive ? "linear-gradient(135deg,#00a855,#006b35)" : "rgba(255,255,255,0.08)", color: isLive ? "#fff" : "rgba(200,220,235,0.8)" }}>
                  {isLive ? "Subscribe →" : "View →"}
                </a>
              )}
              {secondaryLinks.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="cfc-btn-secondary">{l.label}</a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
