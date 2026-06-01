"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export const metadata = {
  title: 'Performance | Kaizen Capital Group',
  description: 'Track live and historical performance across KCG funds. Transparent reporting on returns, drawdowns, and risk metrics.',
  openGraph: {
    title: 'Performance | Kaizen Capital Group',
    description: 'Track live and historical performance across KCG funds. Transparent reporting on returns, drawdowns, and risk metrics.',
    url: 'https://www.kaizencapitalgrp.com/performance',
    siteName: 'Kaizen Capital Group',
    type: 'website',
  },
};


function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); observer.unobserve(node); } },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, className = "", delay = 0, direction = "up" }) {
  const [ref, inView] = useInView(0.08);
  const transforms = { up: inView ? "translateY(0)" : "translateY(40px)", left: inView ? "translateX(0)" : "translateX(-40px)", right: inView ? "translateX(0)" : "translateX(40px)", scale: inView ? "scale(1)" : "scale(0.94)" };
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: transforms[direction] || transforms.up, transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

function StaggerReveal({ children, className = "", stagger = 80 }) {
  const [ref, inView] = useInView(0.08);
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms` }}>{child}</div>
      )) : children}
    </div>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/funds", label: "Funds" },
  { href: "/performance", label: "Performance" },
  { href: "/contact", label: "Contact" },
  { href: "/portal", label: "Portal" },
  { href: "/insights", label: "Insights" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled ? "border-b border-white/40 bg-[#E6EEF2]/92 shadow-[0_8px_30px_rgba(15,26,40,0.08)] backdrop-blur-xl" : "border-b border-white/20 bg-white/40 backdrop-blur-md"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F1A28] sm:h-8 sm:w-8"><span className="text-[9px] font-black text-white sm:text-[10px]">KCG</span></div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2E4358] sm:text-xs md:text-sm">Kaizen Capital Group</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2E4358]">
          {NAV_LINKS.map(l => <Link key={l.href} href={l.href} className="relative py-1 transition-opacity hover:opacity-70 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#0F1A28] after:transition-all hover:after:w-full">{l.label}</Link>)}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/contact" className="hidden shrink-0 rounded-full bg-[#0F1A28] px-4 py-2 text-xs font-semibold text-white transition hover:scale-105 sm:inline-block sm:px-5 sm:text-sm">Get Started</Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col justify-center gap-[5px] p-2 md:hidden">
            <span className={`block h-0.5 w-5 bg-[#0F1A28] transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#0F1A28] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#0F1A28] transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="border-t border-white/30 bg-[#E6EEF2]/96 backdrop-blur-xl md:hidden nav-mobile-open">
          <div className="mx-auto max-w-6xl px-4 py-4 space-y-1">
            {NAV_LINKS.map(l => <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#2E4358] transition hover:bg-white/60">{l.label}</Link>)}
          </div>
        </div>
      )}
    </nav>
  );
}

function RiskMeter({ level }) {
  const n = { Low: 1, Medium: 2, High: 3 }[level] || 1;
  const colors = { Low: "#1F5E36", Medium: "#7A5C1E", High: "#7A2F2F" };
  const bg = { Low: "bg-[#DCEFE3] text-[#1F5E36] border-[#B8D8C4]", Medium: "bg-[#F5EDD8] text-[#7A5C1E] border-[#E8D5AA]", High: "bg-[#F3E4E4] text-[#7A2F2F] border-[#E5C6C6]" };
  return <div className="flex items-center gap-2"><div className="flex gap-0.5">{[1,2,3].map(i=><div key={i} className="h-2.5 w-2 rounded-sm" style={{background:i<=n?colors[level]:"#D4E3EC"}}/>)}</div><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${bg[level]}`}>{level}</span></div>;
}

function GrowthChart({ data, width = 600, height = 220 }) {
  const [ref, inView] = useInView(0.2);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const animate = (ts) => { if (!start) start = ts; const p = Math.min((ts - start) / 2000, 1); setProgress(p); if (p < 1) requestAnimationFrame(animate); };
    requestAnimationFrame(animate);
  }, [inView]);
  const visible = data.slice(0, Math.max(2, Math.floor(progress * data.length)));
  const minV = Math.min(...data.map(d => d.value)), maxV = Math.max(...data.map(d => d.value)), range = maxV - minV || 1;
  const pad = { t: 20, r: 12, b: 36, l: 52 };
  const cw = width - pad.l - pad.r, ch = height - pad.t - pad.b;
  const toX = (i) => pad.l + (i / (data.length - 1)) * cw;
  const toY = (v) => pad.t + ch - ((v - minV) / range) * ch;
  const pathD = visible.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(data.indexOf(d))} ${toY(d.value)}`).join(" ");
  const fillD = visible.length > 1 ? `${pathD} L ${toX(data.indexOf(visible[visible.length-1]))} ${pad.t+ch} L ${toX(0)} ${pad.t+ch} Z` : "";
  const yTicks = [minV, (minV+maxV)/2, maxV].map(v => ({ v, y: toY(v), label: `${v>0?"+":""}${v.toFixed(1)}%` }));
  const xLabels = data.filter((_, i) => i % 2 === 0);
  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 300 }}>
        <defs><linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2E4358" stopOpacity="0.2"/><stop offset="100%" stopColor="#2E4358" stopOpacity="0.01"/></linearGradient></defs>
        {yTicks.map((t, i) => <g key={i}><line x1={pad.l} y1={t.y} x2={pad.l+cw} y2={t.y} stroke="#C9D8E2" strokeWidth="1" strokeDasharray="4 4"/><text x={pad.l-8} y={t.y+4} textAnchor="end" fontSize="10" fill="#9FB4C1">{t.label}</text></g>)}
        {fillD && <path d={fillD} fill="url(#gfill)"/>}
        {pathD && <path d={pathD} fill="none" stroke="#0F1A28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>}
        {xLabels.map((d, i) => <text key={i} x={toX(data.indexOf(d))} y={height-8} textAnchor="middle" fontSize="10" fill="#9FB4C1">{d.label}</text>)}
        {visible.length > 1 && <circle cx={toX(data.indexOf(visible[visible.length-1]))} cy={toY(visible[visible.length-1].value)} r="5" fill="#0F1A28"/>}
      </svg>
    </div>
  );
}

function WinLossDonut({ winRate }) {
  const r = 44, cx = 60, cy = 60, stroke = 11, circ = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-5">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E6EEF2" strokeWidth={stroke}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1F5E36" strokeWidth={stroke} strokeDasharray={`${(winRate/100)*circ} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} style={{transition:"stroke-dasharray 2s ease-out"}}/>
        <text x={cx} y={cy-4} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#0F1A28">{winRate}%</text>
        <text x={cx} y={cy+13} textAnchor="middle" fontSize="9" fill="#9FB4C1">WIN RATE</text>
      </svg>
      <div className="space-y-2">
        <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#1F5E36]"/><span className="text-sm text-[#2E4358]">Wins: {winRate}%</span></div>
        <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#E6EEF2] border border-[#C9D8E2]"/><span className="text-sm text-[#2E4358]">Losses: {100-winRate}%</span></div>
      </div>
    </div>
  );
}

function Sparkline({ data, color = "#2E4358", height = 44 }) {
  const w = 120, h = height, min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*(h-4)-2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs><linearGradient id={`sg${color.replace(/\W/g,"")}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25"/><stop offset="100%" stopColor={color} stopOpacity="0.02"/></linearGradient></defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg${color.replace(/\W/g,"")})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const GROWTH_DATA = [
  {label:"Jan",value:0},{label:"Feb",value:2.1},{label:"Mar",value:5.8},{label:"Apr",value:4.2},
  {label:"May",value:9.4},{label:"Jun",value:12.1},{label:"Jul",value:10.8},{label:"Aug",value:15.3},
  {label:"Sep",value:18.7},{label:"Oct",value:22.4},{label:"Nov",value:26.1},{label:"Dec",value:31.2},
];

const LIVE_FUNDS = [
  { label:"Fund 1", name:"KaizenCapitalGroup.Xau-TMGM", brokerage:"TMGM", focus:"Gold CFD", totalReturn:"+18.9%", winRate:"79.4%", maxDrawdown:"-4.2%", sharpe:"2.14", riskLevel:"Medium", minInvestment:"$500", sparkData:[12,14,13,16,15,18,17,19,21,20,22,24,23,26] },
  { label:"Fund 1a", name:"KaizenCapitalGroup.Xau-MB", brokerage:"MultiBank", focus:"Gold CFD", totalReturn:"+22.1%", winRate:"71.6%", maxDrawdown:"-5.8%", sharpe:"1.87", riskLevel:"Medium", minInvestment:"$1,500", sparkData:[10,12,11,15,14,17,16,20,19,22,21,25,24,27] },
  { label:"Fund 8", name:"The Alpha Fund", brokerage:"TMGM", focus:"Gold Trading", totalReturn:"+24.7%", winRate:"73.2%", maxDrawdown:"-6.1%", sharpe:"1.96", riskLevel:"Medium", minInvestment:"$1,000", sparkData:[8,11,13,12,16,15,18,20,19,23,22,26,25,29] },
  { label:"Fund 11", name:"MAMALYN Fund", brokerage:"MultiBank", focus:"EUR/USD", totalReturn:"+31.5%", winRate:"68.9%", maxDrawdown:"-7.4%", sharpe:"1.74", riskLevel:"High", minInvestment:"$3,000", sparkData:[6,9,11,14,13,17,16,20,22,21,25,28,27,31] },
];



export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState("YTD");
  const tabs = ["1M", "3M", "6M", "YTD", "1Y"];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes pulseGlow { 0%,100%{opacity:.5} 50%{opacity:1} }
        .hero-gradient { background: linear-gradient(-45deg, #E6EEF2, #D4E3EC, #C9D8E2, #DCE7EE); background-size: 400% 400%; animation: gradientShift 12s ease infinite; }
      `}</style>

      <main className="min-h-screen bg-[#E6EEF2] text-[#0F1A28]">
        <Nav />

        {/* HERO */}
        <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-40">
          <div className="absolute inset-0 hero-gradient opacity-60" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#0F1A28 1px,transparent 1px),linear-gradient(90deg,#0F1A28 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9FB4C1]/50 bg-white/50 px-4 py-1.5 backdrop-blur-sm" style={{ animation: "fadeUp 0.6s ease-out 0.1s both" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#1F5E36] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2E4358]">Performance Dashboard</span>
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-tight text-[#0F1A28] sm:text-6xl md:text-7xl" style={{ animation: "fadeUp 0.7s ease-out 0.2s both" }}>Data-driven execution<br />across all KCG systems.</h1>
            <p className="mt-6 max-w-2xl text-lg text-[#2E4358]" style={{ animation: "fadeUp 0.7s ease-out 0.35s both" }}>A consolidated view of live fund performance, growth trajectory, risk-adjusted returns, and system activity across the entire KCG platform.</p>

            {/* Top KPI row */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ animation: "fadeUp 0.7s ease-out 0.45s both" }}>
              {[
                { label: "Platform Avg Return", value: "+24.3%", sub: "Across all live funds YTD", color: "text-[#1F5E36]", trend: "+4.2%" },
                { label: "Combined Win Rate", value: "73.3%", sub: "Weighted avg all live funds", color: "text-[#2E4358]", trend: "+1.8%" },
                { label: "Avg Sharpe Ratio", value: "1.93", sub: "Risk-adjusted performance", color: "text-[#2E4358]", trend: "+0.12" },
                { label: "Max System Drawdown", value: "-5.9%", sub: "Worst peak-to-trough", color: "text-[#7A2F2F]", trend: null },
              ].map(m => (
                <div key={m.label} className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">{m.label}</p>
                  <p className={`mt-2 text-3xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="mt-1 text-xs text-[#5A7188]">{m.sub}</p>
                  {m.trend && <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#DCEFE3] px-2 py-0.5 text-[10px] font-bold text-[#1F5E36]">▲ {m.trend} vs last month</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GROWTH CHART */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Reveal direction="left">
                  <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md sm:p-8">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">Cumulative Platform Growth</p>
                        <p className="mt-1 text-3xl font-bold text-[#0F1A28]">+31.2% <span className="text-lg text-[#5A7188]">YTD</span></p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {tabs.map(t => <button key={t} onClick={() => setActiveTab(t)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition hover:scale-105 ${activeTab===t?"bg-[#0F1A28] text-white":"bg-[#F7FAFC] text-[#5A7188] hover:bg-[#EDF4F8]"}`}>{t}</button>)}
                      </div>
                    </div>
                    <GrowthChart data={GROWTH_DATA} width={600} height={220}/>
                  </div>
                </Reveal>
              </div>

              <Reveal direction="right">
                <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md sm:p-8">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">Win / Loss Breakdown</p>
                  <WinLossDonut winRate={73}/>
                  <div className="mt-6 space-y-3">
                    {[{label:"Total Trades",value:"8,658"},{label:"Winning Trades",value:"6,325"},{label:"Losing Trades",value:"2,333"},{label:"Avg Trade Duration",value:"4.2h"},{label:"Best Month",value:"+6.4%"},{label:"Worst Month",value:"-2.1%"}].map(s => (
                      <div key={s.label} className="flex items-center justify-between rounded-xl bg-[#F7FAFC]/80 px-4 py-2.5">
                        <span className="text-xs text-[#5A7188]">{s.label}</span>
                        <span className="text-sm font-bold text-[#0F1A28]">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FUND COMPARISON TABLE */}
        <section className="bg-[#F3F7FA] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Live Fund Comparison</p>
              <h2 className="mb-8 text-3xl font-bold text-[#0F1A28] md:text-4xl">All 4 live funds side by side.</h2>
            </Reveal>
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E6EEF2]">
                        {["Fund","Focus","Brokerage","Total Return","Win Rate","Max DD","Sharpe","Risk","Min Invest"].map(h => (
                          <th key={h} className="px-4 pb-3 pt-5 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-[#5A7188]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {LIVE_FUNDS.map((f, i) => (
                        <tr key={f.label} className={`border-b border-[#F3F7FA] transition-all hover:bg-[#F7FAFC]/60 ${i===LIVE_FUNDS.length-1?"border-b-0":""}`}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#1F5E36] animate-pulse shrink-0"/>
                              <div>
                                <p className="font-bold text-[#0F1A28]">{f.label}</p>
                                <p className="text-[11px] text-[#9FB4C1]">{f.name.length>20?f.name.slice(0,20)+"…":f.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[#5A7188]">{f.focus}</td>
                          <td className="px-4 py-4 text-[#5A7188]">{f.brokerage}</td>
                          <td className="px-4 py-4 font-bold text-[#1F5E36]">{f.totalReturn}</td>
                          <td className="px-4 py-4 text-[#2E4358]">{f.winRate}</td>
                          <td className="px-4 py-4 text-[#7A2F2F]">{f.maxDrawdown}</td>
                          <td className="px-4 py-4 text-[#2E4358]">{f.sharpe}</td>
                          <td className="px-4 py-4"><RiskMeter level={f.riskLevel}/></td>
                          <td className="px-4 py-4 font-semibold text-[#0F1A28]">{f.minInvestment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* INDIVIDUAL FUND CARDS */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Individual Fund Performance</p>
              <h2 className="mb-8 text-3xl font-bold text-[#0F1A28] md:text-4xl">Sparkline trends for each live fund.</h2>
            </Reveal>
            <StaggerReveal className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" stagger={80}>
              {LIVE_FUNDS.map(f => (
                <div key={f.label} className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,26,40,0.12)]">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#5A7188]">{f.label}</p>
                      <p className={`text-2xl font-bold ${f.totalReturn.startsWith("+")?"text-[#1F5E36]":"text-[#7A2F2F]"}`}>{f.totalReturn}</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-[#1F5E36] animate-pulse"/>
                  </div>
                  <div className="mb-3 overflow-hidden rounded-xl bg-[#F7FAFC]/60 px-2 pt-2 pb-1">
                    <Sparkline data={f.sparkData} color="#2E4358" height={44}/>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-[#F7FAFC]/80 px-3 py-2"><p className="text-[#5A7188]">Win Rate</p><p className="font-bold text-[#0F1A28]">{f.winRate}</p></div>
                    <div className="rounded-xl bg-[#F7FAFC]/80 px-3 py-2"><p className="text-[#5A7188]">Sharpe</p><p className="font-bold text-[#0F1A28]">{f.sharpe}</p></div>
                    <div className="rounded-xl bg-[#F7FAFC]/80 px-3 py-2"><p className="text-[#5A7188]">Max DD</p><p className="font-bold text-[#7A2F2F]">{f.maxDrawdown}</p></div>
                    <div className="rounded-xl bg-[#F7FAFC]/80 px-3 py-2"><p className="text-[#5A7188]">Min</p><p className="font-bold text-[#0F1A28]">{f.minInvestment}</p></div>
                  </div>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* SYSTEM STATUS */}
        <section className="bg-[#F3F7FA] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">System Status</p>
              <h2 className="mb-8 text-3xl font-bold text-[#0F1A28] md:text-4xl">KCG infrastructure overview.</h2>
            </Reveal>
            <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={80}>
              {[
                { label:"Systems Online", value:"4", icon:"⚡", sub:"Live & executing", status:"live" },
                { label:"Algorithms Active", value:"7", icon:"🤖", sub:"Across all platforms", status:"live" },
                { label:"Brokerages Connected", value:"3", icon:"🏦", sub:"TMGM · MultiBank · TradeSmart", status:"live" },
                { label:"Instruments Traded", value:"5", icon:"📈", sub:"Gold · FX · Crypto · CFDs", status:"live" },
              ].map(s => (
                <div key={s.label} className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(15,26,40,0.12)]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="flex items-center gap-1 rounded-full bg-[#DCEFE3] px-2 py-0.5 text-[10px] font-bold text-[#1F5E36]"><span className="h-1 w-1 rounded-full bg-[#1F5E36] animate-pulse"/>LIVE</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold text-[#0F1A28]">{s.value}</p>
                  <p className="mt-1 text-xs text-[#9FB4C1]">{s.sub}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal direction="scale">
              <div className="rounded-[28px] border border-white/40 bg-white/70 p-8 shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md sm:p-12">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Interested in these results?</p>
                <h2 className="text-4xl font-bold text-[#0F1A28] md:text-5xl">Start a conversation with KCG today.</h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-[#2E4358]">Book a call, explore the funds, or submit a formal investor inquiry.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link href="/contact" className="rounded-full bg-[#0F1A28] px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]">Get in Touch</Link>
                  <Link href="/funds" className="rounded-full border border-[#2E4358]/40 bg-white/50 px-8 py-4 font-semibold text-[#0F1A28] transition hover:scale-105 hover:bg-white/75">View All Funds →</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-black/5 bg-[#DCE7EE] px-4 py-10 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2"><div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0F1A28]"><span className="text-[8px] font-black text-white">KCG</span></div><p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5A7188]">Kaizen Capital Group</p></div>
              <p className="mt-1 max-w-md text-sm text-[#2E4358]">Built around disciplined execution, premium positioning, and long-term credibility.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[#2E4358]">{NAV_LINKS.map(l => <Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">{l.label}</Link>)}</div>
          </div>
        </footer>
      </main>
    </>
  );
}
