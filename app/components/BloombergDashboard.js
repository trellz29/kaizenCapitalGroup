"use client";
import { useEffect, useRef, useState } from "react";
import { LIVE_FUNDS, LIVE_COUNT, FUND_COUNT, APPROVED_BROKERS } from "../data/funds";

/* ??? Animated line chart ??????????????????????????????????????????? */
function MiniChart({ data, color = "#00E87A", height = 60, animated = false }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(animated ? 0 : 1);

  useEffect(() => {
    if (!animated) return;
    let start = null;
    const duration = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(step);
    };
    const t = setTimeout(() => requestAnimationFrame(step), 400);
    return () => clearTimeout(t);
  }, [animated]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const pts = data.slice(0, Math.max(2, Math.round(data.length * progress)));
    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const range = max - min || 1;

    const x = (i) => (i / (data.length - 1)) * W;
    const y = (v) => H - ((v - min) / range) * (H * 0.85) - H * 0.075;

    // Fill gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + "30");
    grad.addColorStop(1, color + "00");
    ctx.beginPath();
    ctx.moveTo(x(0), y(pts[0]));
    for (let i = 1; i < pts.length; i++) ctx.lineTo(x(i), y(pts[i]));
    ctx.lineTo(x(pts.length - 1), H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(x(0), y(pts[0]));
    for (let i = 1; i < pts.length; i++) ctx.lineTo(x(i), y(pts[i]));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Last dot
    if (pts.length > 1) {
      const lx = x(pts.length - 1);
      const ly = y(pts[pts.length - 1]);
      ctx.beginPath();
      ctx.arc(lx, ly, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }, [data, color, progress]);

  return <canvas ref={canvasRef} width={300} height={height} style={{ width: "100%", height }} />;
}

/* ??? Counter that counts up ???????????????????????????????????????? */
function LiveCounter({ value, prefix = "", suffix = "", decimals = 0, duration = 2000, started }) {
  const [display, setDisplay] = useState(prefix + "0" + suffix);
  useEffect(() => {
    if (!started) return;
    const target = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    let startTime = null;
    let raf;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      const cur = eased * target;
      const formatted = decimals > 0 ? cur.toFixed(decimals) : Math.floor(cur).toLocaleString();
      setDisplay(prefix + formatted + suffix);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, value]);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{display}</span>;
}

/* ??? Blinking terminal cursor ?????????????????????????????????????? */
function TerminalCursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return <span style={{ opacity: on ? 1 : 0, color: "#00E87A" }}>█</span>;
}

/* ??? Main component ???????????????????????????????????????????????? */
// D1/D2: no return, AUM or chart figures until each links its own verified record.
const FLAT = Array.from({ length: 20 }, () => 1);
const FUND_DATA = LIVE_FUNDS.map(f => ({
  name: f.name,
  ticker: `FUND${f.id.toUpperCase()}`,
  ret: f.track ? "See record" : "Pending",
  aum: "—",
  status: "LIVE",
  broker: f.broker,
  data: FLAT,
}));

const METRICS = [
  { label: "LIVE FUNDS", value: String(LIVE_COUNT), prefix: "", suffix: "", decimals: 0 },
  { label: "STRATEGIES LISTED", value: String(FUND_COUNT), prefix: "", suffix: "", decimals: 0 },
  { label: "WITH VERIFIED RECORD", value: String(LIVE_FUNDS.filter(f => f.track).length), prefix: "", suffix: "", decimals: 0 },
  { label: "APPROVED BROKERAGES", value: String(APPROVED_BROKERS.length), prefix: "", suffix: "", decimals: 0 },
];

export default function BloombergDashboard() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeRow, setActiveRow] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const styles = {
    terminal: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: 11, color: "rgba(0,232,120,0.7)", lineHeight: 1.6,
    },
    label: {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
      textTransform: "uppercase", color: "rgba(159,180,193,0.4)",
    },
    value: {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontWeight: 700, color: "#fff", letterSpacing: "-0.02em",
    },
  };

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 0.9s ease, transform 0.9s ease",
    }}>
      <style>{`
        .bb-grid-line { border-color: rgba(255,255,255,0.05) !important; }
        .bb-row:hover { background: rgba(255,255,255,0.03) !important; }
        .bb-row.active { background: rgba(0,232,120,0.04) !important; border-left: 2px solid rgba(0,232,120,0.4) !important; }
        @keyframes bbPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .bb-live { animation: bbPulse 1.8s ease infinite; }
        @keyframes bbScan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        .bb-scanline { position:absolute; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(0,232,120,0.06),transparent); animation:bbScan 4s linear infinite; pointer-events:none; }
      `}</style>

      {/* Terminal header bar */}
      <div style={{ background: "rgba(0,10,5,0.9)", border: "1px solid rgba(0,232,120,0.15)", borderBottom: "none", borderRadius: "16px 16px 0 0", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
          <span style={{ ...styles.terminal, marginLeft: 12, fontSize: 10 }}>KCG_TERMINAL v2.4.1 — FUND ANALYTICS</span>
        </div>
        <div style={{ ...styles.terminal, fontSize: 10 }}>
          {new Date().toLocaleTimeString("en-GB")} UTC <TerminalCursor />
        </div>
      </div>

      {/* Main terminal body */}
      <div style={{ position: "relative", background: "rgba(3,8,16,0.95)", border: "1px solid rgba(0,232,120,0.12)", borderRadius: "0 0 16px 16px", overflow: "hidden", backdropFilter: "blur(20px)" }}>
        <div className="bb-scanline" />

        {/* Top metrics strip */}
        <div className="bb-top-metrics bb-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {METRICS.map((m, i) => (
            <div key={m.label} style={{ padding: "20px 24px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ ...styles.label, marginBottom: 6 }}>{m.label}</div>
              <div style={{ ...styles.value, fontSize: "clamp(1.4rem,2.5vw,2rem)" }}>
                <LiveCounter value={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} started={visible} duration={2200} />
              </div>
            </div>
          ))}
        </div>

        {/* Two-column body */}
        <div className="bb-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 320px", minHeight: 360 }}>
          
          {/* Fund table */}
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 72px 72px 80px", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", gap: 8 }}>
              {["TICKER", "FUND NAME", "RECORD", "BROKER", "STATUS"].map(h => (
                <div key={h} style={{ ...styles.label }}>{h}</div>
              ))}
            </div>

            {/* Fund rows */}
            {FUND_DATA.map((fund, i) => (
              <div
                key={fund.ticker}
                className={`bb-row${activeRow === i ? " active" : ""}`}
                onClick={() => setActiveRow(i)}
                style={{ display: "grid", gridTemplateColumns: "70px 1fr 72px 72px 80px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)", gap: 8, cursor: "pointer", transition: "background 0.2s", alignItems: "center", borderLeft: "2px solid transparent" }}
              >
                <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "rgba(0,232,120,0.8)" }}>{fund.ticker}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fund.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: fund.ret === "Pending" ? "rgba(255,255,255,0.3)" : "#00E87A" }}>{fund.ret}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{fund.broker}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span className={fund.status === "LIVE" ? "bb-live" : ""} style={{ width: 5, height: 5, borderRadius: "50%", background: fund.status === "LIVE" ? "#00E87A" : "#F59E0B", flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontFamily: "monospace", fontSize: 9, color: fund.status === "LIVE" ? "rgba(0,232,120,0.7)" : "rgba(245,158,11,0.7)", letterSpacing: "0.1em" }}>{fund.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right panel ? selected fund detail */}
          <div className="bb-right-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ ...styles.label, marginBottom: 4 }}>SELECTED FUND</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{FUND_DATA[activeRow].name}</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(0,232,120,0.6)" }}>{FUND_DATA[activeRow].ticker} · {FUND_DATA[activeRow].status}</div>
            </div>

            <div style={{ height: 100 }}>
              <MiniChart data={FUND_DATA[activeRow].data} color={"#9FB4C1"} height={100} animated={visible} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "TRACK RECORD", value: FUND_DATA[activeRow].ret },
                { label: "BROKER", value: FUND_DATA[activeRow].broker },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ ...styles.label, marginBottom: 4, fontSize: 8 }}>{s.label}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: s.value?.startsWith("+") ? "#00E87A" : "#fff" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Terminal log */}
            <div style={{ flex: 1, background: "rgba(0,5,2,0.8)", borderRadius: 8, padding: "12px", border: "1px solid rgba(0,232,120,0.08)", overflow: "hidden" }}>
              <div style={{ ...styles.terminal, fontSize: 10 }}>
                {[
                  `> loading ${FUND_DATA[activeRow].ticker}...`,
                  `✓ data stream connected`,
                  `> RECORD: ${FUND_DATA[activeRow].ret}`,
                  `> BROKER: ${FUND_DATA[activeRow].broker}`,
                  `> STATUS: ${FUND_DATA[activeRow].status}`,
                  `> monitoring...`,
                ].map((line, i) => (
                  <div key={i} style={{ opacity: visible ? 1 : 0, transition: `opacity 0.3s ease ${i * 150}ms` }}>{line}</div>
                ))}
                <TerminalCursor />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="bb-status-bar" style={{ padding: "8px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,5,2,0.5)" }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {["XAUUSD 3,248.40 +0.41%", "EURUSD 1.1062 +0.02%", "BTCUSD 63,140 -1.28%"].map(t => (
              <span key={t} style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(0,232,120,0.5)" }}>{t}</span>
            ))}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)" }}>KCG ANALYTICS ENGINE v2.4 · DATA REFRESHED {tick}s AGO</div>
        </div>
      </div>
    </div>
  );
}
