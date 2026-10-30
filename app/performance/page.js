"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { LIVE_FUNDS, LIVE_COUNT, FUND_COUNT, APPROVED_BROKERS, RISK_LINE } from "../data/funds";

// F12: same live-fund list as the homepage, from the shared roster.
const FUNDS = LIVE_FUNDS.map(f => ({
  name: f.name,
  label: `Fund ${f.id}`,
  broker: f.broker,
  focus: f.focus,
  track: f.track,
  myfxbook: f.track && f.track.includes("myfxbook.com") ? f.track : null,
}));
const WITH_RECORD = FUNDS.filter(f => f.track).length;

function MyfxbookWidget({ url, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !url) return;
    // Embed myfxbook iframe
    el.innerHTML = `<iframe src="${url}/widget" width="100%" height="400" frameborder="0" style="border-radius:12px;background:transparent;"></iframe>`;
  }, [url]);

  if (!url) {
    return (
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "40px 24px", textAlign: "center", minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⏳</div>
        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>Performance data coming soon</p>
      </div>
    );
  }

  return <div ref={ref} />;
}

export default function Performance() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { background: #050810; color: #fff; margin: 0; }
        .perf-label { font-family:sans-serif; font-size:10px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:rgba(159,180,193,0.45); margin-bottom:12px; display:flex; align-items:center; gap:10px; }
        .perf-label::before { content:""; width:24px; height:1px; background:rgba(159,180,193,0.25); }
        .glass { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; backdrop-filter:blur(16px); }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9000, padding: "16px 24px", background: "rgba(5,8,16,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#9FB4C1,#0C1A30,#C9D8E2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", fontFamily: "sans-serif" }}>KCG</div>
          <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Kaizen Capital</span>
        </Link>
        <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>← Back to HQ</Link>
      </nav>

      <main style={{ paddingTop: 100, paddingBottom: 80, maxWidth: 1200, margin: "0 auto", padding: "100px clamp(1.5rem,5vw,3rem) 80px" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p className="perf-label">Live Performance</p>
          <h1 style={{ fontFamily: "sans-serif", fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 1rem", lineHeight: 1.05 }}>
            Fund Performance<br />
            <span style={{ background: "linear-gradient(135deg,#9FB4C1,#fff,#C9D8E2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Dashboard.</span>
          </h1>
          <p style={{ fontFamily: "sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.8, maxWidth: 520, margin: 0 }}>Live and verified performance data across KCG's active funds. All data sourced directly from brokerage platforms and third-party tracking services.</p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,calc(50% - 8px)),1fr))", gap: 16, marginBottom: 64 }}>
          {[
            { label: "Live Funds", value: String(LIVE_COUNT), accent: "rgba(0,232,120,0.5)" },
            { label: "With Verified Record", value: String(WITH_RECORD), accent: "rgba(159,180,193,0.5)" },
            { label: "Strategies Listed", value: String(FUND_COUNT), accent: "rgba(100,150,255,0.5)" },
            { label: "Approved Brokerages", value: String(APPROVED_BROKERS.length), accent: "rgba(200,180,100,0.5)" },
          ].map(s => (
            <div key={s.label} className="glass" style={{ padding: "20px 24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${s.accent},transparent)` }} />
              <div style={{ fontFamily: "sans-serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>{s.value}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(159,180,193,0.45)", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Fund performance widgets */}
        <div style={{ marginBottom: 48 }}>
          <p className="perf-label">Verified Fund Data</p>
          <h2 style={{ fontFamily: "sans-serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 32 }}>Live Fund Tracking</h2>

          <div style={{ display: "grid", gap: 24 }}>
            {FUNDS.map((fund) => (
              <div key={fund.label} className="glass" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)", marginBottom: 4 }}>{fund.label} · {fund.broker}</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{fund.name}</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{fund.focus}</div>
                  </div>
                  {fund.track && (
                    <a href={fund.track} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(200,220,235,0.7)", fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
                      {fund.myfxbook ? "View on Myfxbook ↗" : "View verified record ↗"}
                    </a>
                  )}
                </div>
                {fund.myfxbook || !fund.track ? <MyfxbookWidget url={fund.myfxbook} label={fund.label} /> : null}
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ background: "rgba(255,200,50,0.04)", border: "1px solid rgba(255,200,50,0.1)", borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.7 }}>
            ⚠️ {RISK_LINE} Trading CFDs and Forex carries significant risk. All performance data shown is sourced from verified third-party platforms. KCG does not guarantee future returns.{" "}
            <Link href="/disclaimer" style={{ color: "rgba(159,180,193,0.6)", textDecoration: "none" }}>Read full disclaimer →</Link>
          </p>
        </div>
      </main>
    </>
  );
}
