"use client";
import { useEffect, useRef, useState } from "react";

const FUNDS = [
  { label: "Fund 1", name: "KaizenCapitalGroup.Xau-TMGM", focus: "Gold Scalping", broker: "TMGM", status: "live", return: "+9.4%", tag: "FLAGSHIP", color: "#00E87A", link: "https://signal.tmc2lnbmfs.com/portal/registration/subscription/94720/KCG-TMGM" },
  { label: "Fund 1a", name: "KaizenCapitalGroup.Xau-MB", focus: "Gold Intra-day", broker: "MultiBank", status: "live", return: "+11.2%", tag: "LIVE", color: "#00E87A", link: "https://social.mexatlantic.com/portal/registration/subscription/89528/KCG30" },
  { label: "Fund 8", name: "The Alpha Fund", focus: "Gold Manual", broker: "TMGM", status: "live", return: "+7.8%", tag: "LIVE", color: "#00E87A", link: "https://signal.tmc2lnbmfs.com/portal/registration/subscription/67622/Alpha" },
  { label: "Fund 11", name: "MAMALYN Fund", focus: "EUR/USD Algo", broker: "MultiBank", status: "live", return: "+8.9%", tag: "LIVE", color: "#00E87A", link: "https://social.multibankfx.com/portal/registration/subscription/89236/mamalynMin3000dollars" },
  { label: "Fund 3", name: "VaultKano Fund", focus: "Crypto", broker: "MultiBank", status: "relaunching", return: "—", tag: "RELAUNCHING", color: "#F59E0B", link: null },
  { label: "Fund 4", name: "Exodus Investments", focus: "Crypto & Gold", broker: "TradeSmart", status: "dev", return: "—", tag: "US INCLUDED", color: "#9FB4C1", link: null },
  { label: "Fund 9", name: "Algo Amalgamation", focus: "Multi-asset", broker: "MultiBank", status: "dev", return: "—", tag: "ALGORITHMIC", color: "#6496C8", link: null },
  { label: "Fund 12", name: "CXFund", focus: "Gold Trading", broker: "TMGM", status: "paused", return: "—", tag: "PAUSED", color: "#888", link: "https://signal.tmc2lnbmfs.com/portal/registration/subscription/69413/CXFund2026" },
];

export default function HorizontalFundScroll() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;
      // Pin when top hits viewport top
      const scrolled = -rect.top;
      const maxScroll = sectionH - viewH;
      const pct = Math.max(0, Math.min(1, scrolled / maxScroll));
      setProgress(pct);

      // Translate track horizontally
      const trackW = track.scrollWidth - track.offsetWidth;
      track.style.transform = `translateX(-${pct * trackW}px)`;

      // Active card
      const cardW = 360 + 24; // card width + gap
      const activeCard = Math.min(FUNDS.length - 1, Math.floor((pct * trackW) / cardW));
      setActiveIdx(activeCard);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLive = (f) => f.status === "live";

  return (
    <>
      <style>{`
        .hfs-section {
          position: relative;
          height: 400vh;
        }
        .hfs-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .hfs-track {
          display: flex;
          gap: 24px;
          padding: 0 clamp(1.5rem, 8vw, 100px);
          will-change: transform;
          transition: transform 0.05s linear;
        }
        .hfs-card {
          flex-shrink: 0;
          width: 360px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease;
          cursor: default;
        }
        .hfs-card:hover {
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-4px);
        }
        .hfs-card.live {
          background: rgba(0,20,12,0.5);
          border-color: rgba(0,232,120,0.15);
        }
        .hfs-card.live:hover {
          border-color: rgba(0,232,120,0.35);
        }
        .hfs-card.active-card {
          transform: translateY(-8px) scale(1.02);
        }
        .hfs-top-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
        }
        .hfs-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 100px;
          font-family: sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .hfs-label {
          font-family: sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(159,180,193,0.45);
          margin-bottom: 6px;
        }
        .hfs-name {
          font-family: sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .hfs-focus {
          font-family: sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 24px;
        }
        .hfs-stat-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        .hfs-stat {
          background: rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 12px 14px;
        }
        .hfs-stat-lbl {
          font-family: sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(159,180,193,0.4);
          margin-bottom: 4px;
        }
        .hfs-stat-val {
          font-family: sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
        }
        .hfs-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 12px;
          border-radius: 100px;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .hfs-btn:hover {
          transform: scale(1.04);
        }
        .hfs-progress {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          align-items: center;
          z-index: 10;
        }
        .hfs-dot {
          width: 5px;
          height: 5px;
          border-radius: 100px;
          background: rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }
        .hfs-dot.active {
          width: 20px;
          background: rgba(255,255,255,0.7);
        }
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }
        .live-dot { animation: livePulse 1.6s ease infinite; }
        @media (max-width: 768px) {
          .hfs-section { height: auto; }
          .hfs-sticky { position: relative; height: auto; overflow: visible; padding: 60px 0; }
          .hfs-track { overflow-x: auto; transform: none !important; padding-bottom: 16px; }
        }
      `}</style>

      <div ref={sectionRef} className="hfs-section">
        <div className="hfs-sticky">
          {/* Header */}
          <div style={{ padding: "0 clamp(1.5rem,8vw,100px)", marginBottom: 40, opacity: 1 - progress * 3 }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(159,180,193,0.45)", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 24, height: 1, background: "rgba(159,180,193,0.25)", display: "inline-block" }} />
              KCG Fund Collection
            </p>
            <h2 style={{ fontFamily: "sans-serif", fontSize: "clamp(1.8rem,4vw,3.2rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", margin: 0, lineHeight: 1.1 }}>
              Every fund.<br />
              <span style={{ color: "rgba(159,180,193,0.5)" }}>Scroll to explore.</span>
            </h2>
          </div>

          {/* Scrolling track */}
          <div ref={trackRef} className="hfs-track">
            {FUNDS.map((fund, i) => (
              <div
                key={fund.label}
                className={`hfs-card${isLive(fund) ? " live" : ""}${activeIdx === i ? " active-card" : ""}`}
              >
                {/* Top accent */}
                <div className="hfs-top-line" style={{ background: `linear-gradient(90deg,transparent,${fund.color}80,transparent)` }} />

                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div className="hfs-label">{fund.label}</div>
                    <div className="hfs-name">{fund.name}</div>
                    <div className="hfs-focus">{fund.focus} · {fund.broker}</div>
                  </div>
                  <div className="hfs-tag" style={{ background: fund.status === "live" ? "rgba(0,232,120,0.1)" : "rgba(255,255,255,0.05)", color: fund.color, border: `1px solid ${fund.color}40` }}>
                    {isLive(fund) && <span className="live-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: fund.color, display: "inline-block" }} />}
                    {fund.tag}
                  </div>
                </div>

                {/* Stats */}
                <div className="hfs-stat-row">
                  <div className="hfs-stat">
                    <div className="hfs-stat-lbl">Monthly Return</div>
                    <div className="hfs-stat-val" style={{ color: fund.return !== "—" ? "#00E87A" : "rgba(255,255,255,0.3)" }}>{fund.return}</div>
                  </div>
                  <div className="hfs-stat">
                    <div className="hfs-stat-lbl">Status</div>
                    <div className="hfs-stat-val" style={{ fontSize: "0.8rem", color: fund.color }}>{fund.status.toUpperCase()}</div>
                  </div>
                </div>

                {/* Mini chart bars */}
                <div style={{ display: "flex", gap: 3, height: 40, alignItems: "flex-end", marginBottom: 20 }}>
                  {Array.from({ length: 20 }).map((_, j) => {
                    const h = isLive(fund)
                      ? 20 + Math.abs(Math.sin(i * 3 + j * 0.7)) * 80
                      : 10 + Math.abs(Math.sin(i * 2 + j)) * 40;
                    return (
                      <div key={j} style={{
                        flex: 1, borderRadius: 2,
                        height: `${Math.min(h, 100)}%`,
                        background: j === 19
                          ? fund.color
                          : `rgba(${isLive(fund) ? "0,232,120" : "159,180,193"},${0.1 + (j / 20) * 0.3})`,
                        transition: `height 0.3s ease ${j * 20}ms`,
                      }} />
                    );
                  })}
                </div>

                {/* CTA */}
                {fund.link ? (
                  <a href={fund.link} target="_blank" rel="noopener noreferrer" className="hfs-btn"
                    style={{ background: isLive(fund) ? "linear-gradient(135deg,#00a855,#006b35)" : "rgba(255,255,255,0.08)", color: "#fff" }}>
                    {isLive(fund) ? "Subscribe Now →" : "View Fund →"}
                  </a>
                ) : (
                  <div className="hfs-btn" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", cursor: "not-allowed" }}>
                    {fund.status === "relaunching" ? "Re-launching Soon" : "In Development"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="hfs-progress">
            {FUNDS.map((_, i) => (
              <div key={i} className={`hfs-dot${activeIdx === i ? " active" : ""}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
