"use client";
import { CinematicPageNav } from "../components/CinematicPageShell";

const TEAM = [
  {
    role: "Founder & Chief Capital Strategist",
    name: "KCG Leadership",
    bio: "Built KCG from the ground up as an institutional-grade capital platform. Oversees all fund strategy, brokerage relationships, and investor communication across 12 active funds.",
    stats: [{ label: "Funds Managed", val: "12" }, { label: "Strategies", val: "8+" }, { label: "Since", val: "2022" }],
  },
];

const MILESTONES = [
  { year: "2022", title: "Foundation", desc: "KCG established with a focus on disciplined Gold trading through TMGM." },
  { year: "2023", title: "Expansion", desc: "Fund 8 (Alpha), MAMALYN, and 4 additional strategies launched. MultiBank partnership secured." },
  { year: "2024", title: "Algorithmic Systems", desc: "Algo Amalgamation Fund and fully automated EUR/USD strategies deployed." },
  { year: "2025", title: "Institutional Scale", desc: "$847M+ in tracked volume. 12 funds across Gold, Forex, Crypto, and multi-asset strategies." },
  { year: "2026", title: "Global Reach", desc: "VaultKano re-launching. Copy trading network expanding. Portal and investor onboarding platform live." },
];

const VALUES = [
  { icon: "🏛️", title: "Institutional Discipline", desc: "Every decision is made through the lens of long-term capital preservation and structured risk management." },
  { icon: "🔍", title: "Radical Transparency", desc: "All fund data is tracked through third-party verification — Myfxbook, FX Blue, brokerage ratings." },
  { icon: "⚡", title: "Execution First", desc: "Strategy means nothing without execution. KCG prioritises speed, precision, and consistency." },
  { icon: "🌐", title: "Global Infrastructure", desc: "Regulated brokerages, verified partners, multi-jurisdiction access — built for the world." },
  { icon: "📈", title: "Compound Thinking", desc: "We optimise for compounding — not just returns, but relationships, systems, and trust." },
  { icon: "🤝", title: "Selective Partnerships", desc: "KCG is not for everyone. We work with investors who understand structure and respect process." },
];

export default function About() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { background: #050810; color: #fff; margin: 0; }
        .glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; backdrop-filter: blur(16px); }
        .scene-label { font-family:sans-serif; font-size:10px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:rgba(159,180,193,0.45); margin-bottom:16px; display:flex; align-items:center; gap:10px; }
        .scene-label::before { content:""; width:24px; height:1px; background:rgba(159,180,193,0.25); }
        .divider { height:1px; background:linear-gradient(90deg,transparent,rgba(159,180,193,0.1),transparent); margin:0; }
      `}</style>

      <CinematicPageNav />

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "65vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(1.5rem,8vw,80px) 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 100% 80% at 20% 60%, rgba(12,26,48,0.8) 0%, #050810 65%)" }} />
        <div style={{ position: "absolute", top: "20%", right: "10%", width: "40vw", height: "40vw", maxWidth: 500, maxHeight: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(50,100,180,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <p className="scene-label">About KCG</p>
          <h1 style={{ fontFamily: "sans-serif", fontSize: "clamp(3rem,7vw,7rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 1.5rem", lineHeight: 1.0 }}>
            Built for the<br />
            <span style={{ background: "linear-gradient(135deg,#9FB4C1,#fff,#C9D8E2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>serious investor.</span>
          </h1>
          <p style={{ fontFamily: "sans-serif", fontSize: "clamp(1rem,1.5vw,1.15rem)", color: "rgba(255,255,255,0.38)", lineHeight: 1.8, maxWidth: 580, margin: 0 }}>
            Kaizen Capital Group is a disciplined, multi-fund investment platform built on institutional execution, verified strategies, and long-term capital thinking. We don't manage impressions. We manage capital.
          </p>
        </div>
      </section>

      <div className="divider" />

      {/* Values */}
      <section style={{ padding: "80px clamp(1.5rem,5vw,3rem)", maxWidth: 1200, margin: "0 auto" }}>
        <p className="scene-label">Core Principles</p>
        <h2 style={{ fontFamily: "sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", margin: "0 0 3rem", lineHeight: 1.1 }}>What drives every decision.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
          {VALUES.map((v, i) => (
            <div key={v.title} className="glass" style={{ padding: 28, display: "flex", gap: 18, alignItems: "flex-start",
              opacity: 0, animation: `fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms forwards`,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{v.icon}</div>
              <div>
                <h3 style={{ fontFamily: "sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{v.title}</h3>
                <p style={{ fontFamily: "sans-serif", fontSize: "0.825rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Timeline */}
      <section style={{ padding: "80px clamp(1.5rem,5vw,3rem)", background: "#070F1E" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p className="scene-label">KCG History</p>
          <h2 style={{ fontFamily: "sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", margin: "0 0 4rem", lineHeight: 1.1 }}>The KCG story.</h2>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ position: "absolute", left: 68, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.06)" }} />
            {MILESTONES.map((m, i) => (
              <div key={m.year} style={{ display: "flex", gap: 32, alignItems: "flex-start", paddingBottom: 40, position: "relative" }}>
                <div style={{ width: 100, flexShrink: 0, textAlign: "right", paddingTop: 4 }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 900, color: "rgba(159,180,193,0.6)", letterSpacing: "-0.02em" }}>{m.year}</span>
                </div>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: i === MILESTONES.length - 1 ? "#00E87A" : "rgba(159,180,193,0.3)", border: `2px solid ${i === MILESTONES.length - 1 ? "#00E87A" : "rgba(159,180,193,0.2)"}`, flexShrink: 0, marginTop: 4, zIndex: 1, boxShadow: i === MILESTONES.length - 1 ? "0 0 12px rgba(0,232,120,0.4)" : "none" }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "sans-serif", fontSize: "1rem", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{m.title}</h3>
                  <p style={{ fontFamily: "sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Stats */}
      <section style={{ padding: "80px clamp(1.5rem,5vw,3rem)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {[
            { num: "12", label: "Active Funds", accent: "rgba(0,232,120,0.6)" },
            { num: "9.2%", label: "Avg Monthly Return", accent: "rgba(159,180,193,0.6)" },
            { num: "$847M+", label: "Total Volume Tracked", accent: "rgba(100,150,255,0.6)" },
            { num: "3", label: "Verified Brokerages", accent: "rgba(200,180,100,0.6)" },
            { num: "4+", label: "Years Operating", accent: "rgba(200,100,200,0.6)" },
            { num: "100%", label: "Third-Party Verified", accent: "rgba(100,200,180,0.6)" },
          ].map(s => (
            <div key={s.label} className="glass" style={{ padding: "24px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${s.accent},transparent)` }} />
              <div style={{ fontFamily: "sans-serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>{s.num}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(159,180,193,0.45)", marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* CTA */}
      <section style={{ padding: "80px clamp(1.5rem,5vw,3rem)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "sans-serif", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 1rem" }}>Ready to invest with KCG?</h2>
        <p style={{ fontFamily: "sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.38)", marginBottom: "2.5rem" }}>We're selective. Start a conversation and let's see if there's a fit.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" style={{ padding: "14px 32px", borderRadius: 100, background: "#fff", color: "#050810", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "all 0.2s ease" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
            Book a Call ↗
          </a>
          <a href="/funds" style={{ padding: "14px 32px", borderRadius: 100, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s ease" }}>
            View Funds →
          </a>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  );
}
