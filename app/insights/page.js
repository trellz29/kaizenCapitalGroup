"use client";
import { useState } from "react";
import { CinematicPageNav } from "../components/CinematicPageShell";

const INSIGHTS = [
  {
    category: "Strategy",
    tag: "GOLD TRADING",
    title: "Why Gold remains KCG's primary instrument in 2025",
    excerpt: "XAU/USD continues to offer the best risk-adjusted return profile for systematic short-term strategies. Here's why KCG's core funds remain Gold-focused.",
    date: "Dec 2025",
    readTime: "4 min read",
    accent: "#F59E0B",
  },
  {
    category: "Markets",
    tag: "FOREX",
    title: "EUR/USD algorithmic trading: what the MAMALYN strategy teaches us",
    excerpt: "Fully automated EUR/USD systems require a different risk framework than manual trading. The MAMALYN fund's approach to position sizing and volatility filtering.",
    date: "Nov 2025",
    readTime: "6 min read",
    accent: "#6496C8",
  },
  {
    category: "Operations",
    tag: "INFRASTRUCTURE",
    title: "Why KCG uses multiple brokerages instead of one",
    excerpt: "TMGM, MultiBank, TradeSmart — three regulated partners, three different liquidity pools. The infrastructure case for multi-brokerage capital deployment.",
    date: "Oct 2025",
    readTime: "5 min read",
    accent: "#00E87A",
  },
  {
    category: "Investor Education",
    tag: "COPY TRADING",
    title: "Copy trading vs fund allocation: which is right for you?",
    excerpt: "Two ways to access KCG strategies. One gives you control with lower minimums. The other offers structured allocation with direct manager access. The differences matter.",
    date: "Sep 2025",
    readTime: "5 min read",
    accent: "#9FB4C1",
  },
  {
    category: "Technology",
    tag: "ALGORITHMIC",
    title: "The Algo Amalgamation Fund: how KCG's swarm intelligence works",
    excerpt: "Fund 9 combines the algorithms from Funds 1 through 8 into a unified multi-asset system. The logic behind amalgamation and why diversification across strategies beats diversification across assets.",
    date: "Aug 2025",
    readTime: "7 min read",
    accent: "#A78BFA",
  },
  {
    category: "Risk Management",
    tag: "RISK",
    title: "KCG's approach to drawdown management across 12 funds",
    excerpt: "With 12 active strategies, how do you manage drawdown correlation? KCG's framework for position sizing, exposure limits, and recovery protocols.",
    date: "Jul 2025",
    readTime: "6 min read",
    accent: "#F87171",
  },
];

const CATEGORIES = ["All", "Strategy", "Markets", "Operations", "Investor Education", "Technology", "Risk Management"];

export default function Insights() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? INSIGHTS : INSIGHTS.filter(i => i.category === active);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { background: #050810; color: #fff; margin: 0; }
        .glass { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; backdrop-filter:blur(16px); transition:border-color 0.3s ease, transform 0.3s ease; }
        .glass:hover { border-color:rgba(255,255,255,0.18); transform:translateY(-4px); }
        .scene-label { font-family:sans-serif; font-size:10px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:rgba(159,180,193,0.45); margin-bottom:16px; display:flex; align-items:center; gap:10px; }
        .scene-label::before { content:""; width:24px; height:1px; background:rgba(159,180,193,0.25); }
        .divider { height:1px; background:linear-gradient(90deg,transparent,rgba(159,180,193,0.1),transparent); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <CinematicPageNav />

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "55vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(1.5rem,8vw,80px) 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 30% 70%, rgba(12,26,48,0.8) 0%, #050810 65%)" }} />
        <div style={{ position: "absolute", top: "20%", right: "8%", width: "35vw", height: "35vw", maxWidth: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(100,150,255,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <p className="scene-label">KCG Insights</p>
          <h1 style={{ fontFamily: "sans-serif", fontSize: "clamp(3rem,7vw,7rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 1.5rem", lineHeight: 1.0 }}>
            Intelligence<br />
            <span style={{ background: "linear-gradient(135deg,#9FB4C1,#fff,#C9D8E2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>for the informed.</span>
          </h1>
          <p style={{ fontFamily: "sans-serif", fontSize: "clamp(0.95rem,1.3vw,1.1rem)", color: "rgba(255,255,255,0.35)", lineHeight: 1.8, maxWidth: 520, margin: 0 }}>
            Strategy breakdowns, market analysis, and operational transparency from the KCG team. Updated regularly.
          </p>
        </div>
      </section>

      <div className="divider" />

      {/* Filter tabs */}
      <section style={{ padding: "40px clamp(1.5rem,5vw,3rem) 0", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: "8px 18px", borderRadius: 100, fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: active === cat ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${active === cat ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
              color: active === cat ? "#fff" : "rgba(255,255,255,0.4)",
              transition: "all 0.2s ease",
            }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles grid */}
      <section style={{ padding: "40px clamp(1.5rem,5vw,3rem) 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 20 }}>
          {filtered.map((post, i) => (
            <article key={post.title} className="glass" style={{
              padding: 32, cursor: "pointer", position: "relative", overflow: "hidden",
              opacity: 0, animation: `fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms forwards`,
            }}>
              {/* Top accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${post.accent}80,transparent)` }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ padding: "4px 12px", borderRadius: 100, fontFamily: "sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: `${post.accent}15`, border: `1px solid ${post.accent}30`, color: post.accent }}>{post.tag}</span>
                <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{post.date}</span>
              </div>

              <h2 style={{ fontFamily: "sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.4, margin: "0 0 12px" }}>{post.title}</h2>
              <p style={{ fontFamily: "sans-serif", fontSize: "0.825rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: "0 0 24px" }}>{post.excerpt}</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(159,180,193,0.4)" }}>{post.readTime}</span>
                <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(159,180,193,0.6)", fontWeight: 600 }}>Read more →</span>
              </div>
            </article>
          ))}
        </div>

        {/* Coming soon notice */}
        <div style={{ marginTop: 60, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 28px", borderRadius: 100, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E87A", animation: "livePulse 1.5s ease infinite" }} />
            <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>New insights published regularly — subscribe via Telegram for updates</span>
            <a href="https://t.me/KaizenCapitalGroup" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(159,180,193,0.7)", textDecoration: "none", letterSpacing: "0.04em" }}>Join ↗</a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(1.6)} }
      `}</style>
    </>
  );
}
