"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
    <div ref={ref} className={className}
      style={{ opacity: inView ? 1 : 0, transform: transforms[direction] || transforms.up, transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

function StaggerReveal({ children, className = "", stagger = 60 }) {
  const [ref, inView] = useInView(0.05);
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
        <div className="border-t border-white/30 bg-[#E6EEF2]/96 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4 space-y-1">
            {NAV_LINKS.map(l => <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#2E4358] transition hover:bg-white/60">{l.label}</Link>)}
          </div>
        </div>
      )}
    </nav>
  );
}

function Sparkline({ data, color = "#2E4358", height = 44 }) {
  const w = 120, h = height, min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs><linearGradient id={`sg${color.replace(/\W/g,"")}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0.02" /></linearGradient></defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg${color.replace(/\W/g,"")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MonthlyBarChart({ data }) {
  const max = Math.max(...data.map(d => Math.abs(d.val)));
  return (
    <div className="flex items-end gap-0.5 h-10">
      {data.map((d, i) => <div key={i} className="flex-1 flex flex-col items-center justify-end"><div className="w-full rounded-sm" style={{ height: `${Math.max((Math.abs(d.val)/max)*100,8)}%`, background: d.val>=0?"rgba(31,94,54,0.7)":"rgba(122,47,47,0.6)" }}/></div>)}
    </div>
  );
}

function RiskMeter({ level }) {
  const n = { Low:1, Medium:2, High:3 }[level]||1;
  const colors = { Low:"#1F5E36", Medium:"#7A5C1E", High:"#7A2F2F" };
  const bg = { Low:"bg-[#DCEFE3] text-[#1F5E36] border-[#B8D8C4]", Medium:"bg-[#F5EDD8] text-[#7A5C1E] border-[#E8D5AA]", High:"bg-[#F3E4E4] text-[#7A2F2F] border-[#E5C6C6]" };
  return <div className="flex items-center gap-2"><div className="flex gap-0.5">{[1,2,3].map(i=><div key={i} className="h-2.5 w-2 rounded-sm" style={{background:i<=n?colors[level]:"#D4E3EC"}}/>)}</div><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${bg[level]}`}>{level}</span></div>;
}

function FundCard({ label, name, focus, strategy, managers, brokerage, status, extra, primaryLink, secondaryLinks=[], totalReturn, winRate, maxDrawdown, sharpe, monthlyReturns, sparkData, riskLevel, minInvestment }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const cardRef = useRef(null);
  const handleMouseMove = (e) => { if (!cardRef.current) return; const rect=cardRef.current.getBoundingClientRect(); setTilt({ x:((e.clientX-rect.left)/rect.width-0.5)*8, y:((e.clientY-rect.top)/rect.height-0.5)*-8 }); };
  const statusLower = status.toLowerCase();
  const isLive = statusLower==="live";
  const statusClass = isLive?"bg-[#DCEFE3] text-[#1F5E36] border border-[#B8D8C4]":statusLower==="re-launching"?"bg-[#EEF2F7] text-[#35506A] border border-[#D3DDE8]":statusLower==="discontinuation"||statusLower==="disconnected"?"bg-[#F3E4E4] text-[#7A2F2F] border border-[#E5C6C6]":"bg-[#E8EEF3] text-[#5A7188] border border-[#D3DDE8]";
  const accentClass = isLive?"from-[#A9C2D1] via-[#DCE7EE] to-[#C7D9E4]":"from-[#DCE7EE] via-[#C9D8E2] to-[#B4C7D4]";
  const hasMetrics = totalReturn||winRate||maxDrawdown||sharpe;
  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>{setHovered(false);setTilt({x:0,y:0});}}
      className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md"
      style={{ transform:`perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) ${hovered?"translateY(-6px)":"translateY(0)"}`, transition:hovered?"transform 0.1s ease,box-shadow 0.3s ease":"transform 0.6s cubic-bezier(0.16,1,0.3,1),box-shadow 0.3s ease", boxShadow:hovered?"0 28px 80px rgba(15,26,40,0.14)":"0 12px 40px rgba(15,26,40,0.06)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:`radial-gradient(circle at ${50+tilt.x*3}% ${50-tilt.y*3}%,rgba(255,255,255,0.15) 0%,transparent 60%)`}}/>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentClass}`}/>
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div className="min-w-0"><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5A7188]">{label}</p><h3 className="break-words text-lg font-bold leading-tight text-[#0F1A28] sm:text-xl">{name}</h3><p className="mt-0.5 text-xs text-[#5A7188]">{focus}</p></div>
          <div className="flex items-center gap-2 shrink-0">{isLive&&<span className="h-1.5 w-1.5 rounded-full bg-[#1F5E36] animate-pulse"/>}<span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusClass}`}>{status}</span></div>
        </div>
        {sparkData&&<div className="mb-4 overflow-hidden rounded-2xl bg-[#F7FAFC]/60 px-3 pt-2 pb-1"><Sparkline data={sparkData} color="#2E4358" height={44}/></div>}
        {hasMetrics&&<div className="mb-4 grid grid-cols-2 gap-2">
          {totalReturn&&<div className="rounded-2xl bg-[#F7FAFC]/80 px-3 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A7188]">Total Return</p><p className={`mt-0.5 text-lg font-bold ${totalReturn.startsWith("+")?"text-[#1F5E36]":"text-[#7A2F2F]"}`}>{totalReturn}</p></div>}
          {winRate&&<div className="rounded-2xl bg-[#F7FAFC]/80 px-3 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A7188]">Win Rate</p><p className="mt-0.5 text-lg font-bold text-[#2E4358]">{winRate}</p></div>}
          {maxDrawdown&&<div className="rounded-2xl bg-[#F7FAFC]/80 px-3 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A7188]">Max Drawdown</p><p className="mt-0.5 text-lg font-bold text-[#7A2F2F]">{maxDrawdown}</p></div>}
          {sharpe&&<div className="rounded-2xl bg-[#F7FAFC]/80 px-3 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A7188]">Sharpe Ratio</p><p className="mt-0.5 text-lg font-bold text-[#2E4358]">{sharpe}</p></div>}
        </div>}
        {monthlyReturns&&<div className="mb-4 rounded-2xl bg-[#F7FAFC]/80 px-3 py-2.5"><p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#5A7188]">Monthly Returns</p><MonthlyBarChart data={monthlyReturns}/><div className="mt-1 flex justify-between">{monthlyReturns.map((d,i)=><span key={i} className="text-[8px] text-[#9FB4C1]">{d.month}</span>)}</div></div>}
        {(riskLevel||minInvestment)&&<div className="mb-4 flex items-center justify-between rounded-2xl bg-[#F7FAFC]/80 px-3 py-2.5">{riskLevel&&<div><p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#5A7188]">Risk Level</p><RiskMeter level={riskLevel}/></div>}{minInvestment&&<div className="text-right"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A7188]">Min. Investment</p><p className="mt-0.5 text-base font-bold text-[#0F1A28]">{minInvestment}</p></div>}</div>}
        <button onClick={()=>setExpanded(!expanded)} className="mb-3 flex w-full items-center justify-between rounded-2xl bg-[#F7FAFC]/80 px-4 py-3 text-sm transition hover:bg-[#EDF4F8]">
          <span className="font-medium text-[#0F1A28]">Fund Details</span>
          <span className={`text-[#9FB4C1] transition-transform duration-300 ${expanded?"rotate-180":""}`}>▼</span>
        </button>
        {expanded&&<div className="mb-4 grid gap-2 text-sm leading-6 text-[#2E4358]">
          <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3"><span className="font-semibold text-[#0F1A28]">Strategy:</span> {strategy}</div>
          <div className="grid gap-2 sm:grid-cols-2"><div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3"><span className="font-semibold text-[#0F1A28]">Managers:</span> {managers}</div><div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3"><span className="font-semibold text-[#0F1A28]">Brokerage:</span> {brokerage}</div></div>
          {extra&&<div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3"><span className="font-semibold text-[#0F1A28]">Notes:</span> {extra}</div>}
        </div>}
        {(primaryLink||secondaryLinks.length>0)&&<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {primaryLink&&<a href={primaryLink} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#0F1A28] px-5 py-2 text-center text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]">Get Started</a>}
          {secondaryLinks.map((link,i)=><a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2E4358] bg-white/60 px-5 py-2 text-center text-sm font-semibold text-[#0F1A28] transition hover:scale-105 hover:bg-[#EDF4F8]">{link.label}</a>)}
        </div>}
      </div>
    </div>
  );
}

const FUND_DATA = [
  {label:"Fund 1",name:"KaizenCapitalGroup.Xau-TMGM",focus:"Gold CFD",status:"Live",strategy:"Gold Scalping & Intra-day",managers:"1",brokerage:"TMGM",totalReturn:"+18.9%",winRate:"79.4%",maxDrawdown:"-4.2%",sharpe:"2.14",riskLevel:"Medium",minInvestment:"$100",sparkData:[12,14,13,16,15,18,17,19,21,20,22,24,23,26],monthlyReturns:[{month:"J",val:2.1},{month:"F",val:1.8},{month:"M",val:3.2},{month:"A",val:-0.4},{month:"M",val:2.8},{month:"J",val:1.9},{month:"J",val:3.1},{month:"A",val:2.4}],primaryLink:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/94720/KCG-TMGM",secondaryLinks:[{label:"Ratings",url:"https://ratings.tmgmplatform.com/widgets/shared/5173e304d7494051b27287f70426a327?lang=en%3Fpreview%3DP3U9ODIxMzA2JmE9MTM0NjMmcD0xMzgzNCZ3PTEmcz01MTczZTMwNGQ3NDk0MDUxYjI3Mjg3ZjcwNDI2YTMyNw%3D%3D"}]},
  {label:"Fund 1a",name:"KaizenCapitalGroup.Xau-MB",focus:"Gold CFD",status:"Live",strategy:"Gold Scalping & Intra-day",managers:"1",brokerage:"MultiBank",totalReturn:"+22.1%",winRate:"71.6%",maxDrawdown:"-5.8%",sharpe:"1.87",riskLevel:"Medium",minInvestment:"$100",sparkData:[10,12,11,15,14,17,16,20,19,22,21,25,24,27],monthlyReturns:[{month:"J",val:3.1},{month:"F",val:2.4},{month:"M",val:-0.8},{month:"A",val:4.2},{month:"M",val:1.6},{month:"J",val:3.8},{month:"J",val:2.1},{month:"A",val:3.4}],primaryLink:"https://social.mexatlantic.com/portal/registration/subscription/89528/KCG30"},
  {label:"Fund 2",name:"TradeXMarkets Fund",focus:"Gold & potentially Oil",strategy:"Gold Trading & automated trading mix",managers:"1",brokerage:"MultiBank",status:"N/A"},
  {label:"Fund 3",name:"VaultKano Fund",focus:"Crypto",strategy:"Manual & automated trading mix",managers:"1",brokerage:"MultiBank",status:"Re-Launching"},
  {label:"Fund 4",name:"Exodus Investments",focus:"Crypto & Gold",strategy:"Scalping + Macro / Swing Trading",managers:"2",brokerage:"TradeSmart",status:"N/A",extra:"United States Included"},
  {label:"Fund 5",name:"KCG + Phoenix",focus:"Gold & FX currencies",strategy:"To be defined",managers:"1",brokerage:"MultiBank",status:"N/A",extra:"Speculative"},
  {label:"Fund 6",name:"Phoenix",focus:"Forex mixed assets",strategy:"Automated trading mix of all instruments",managers:"Potential fully automated managed fund (1)",brokerage:"MultiBank",status:"N/A"},
  {label:"Fund 7",name:"Forex Fortune AI",focus:"EURUSD",strategy:"Automated trading mix of EUR instruments",managers:"1",brokerage:"MultiBank",status:"N/A"},
  {label:"Fund 8",name:"The Alpha Fund",focus:"Gold trading",status:"Live",strategy:"Manual trading",managers:"2 traders",brokerage:"TMGM",totalReturn:"+24.7%",winRate:"73.2%",maxDrawdown:"-6.1%",sharpe:"1.96",riskLevel:"Medium",minInvestment:"$1,000",sparkData:[8,11,13,12,16,15,18,20,19,23,22,26,25,29],monthlyReturns:[{month:"J",val:4.1},{month:"F",val:-1.2},{month:"M",val:3.8},{month:"A",val:2.9},{month:"M",val:1.4},{month:"J",val:4.2},{month:"J",val:3.6},{month:"A",val:2.8}],primaryLink:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/67622/Alpha",secondaryLinks:[{label:"Ratings",url:"https://ratings.tmgmplatform.com/widgets/shared/05a7391d205e4c82982ea3141e98aee5"}]},
  {label:"Fund 9",name:"Algo Amalgamation Fund",focus:"Multi-asset (Gold, Forex, Crypto & others)",strategy:"Fully algorithmic — amalgamation of strategies from Funds 1–8",managers:"Mixture of algorithmic bots",brokerage:"MultiBank / TradeSmart / TMGM",status:"N/A"},
  {label:"Fund 10",name:"PfaneTXau Fund",focus:"All CFD indices and commodities",strategy:"Swarm",managers:"1 (potentially 2)",brokerage:"To be confirmed",status:"Discontinuation"},
  {label:"Fund 11",name:"MAMALYN Fund",focus:"EUR/USD",status:"Live",strategy:"Fully algorithmic trading",managers:"1",brokerage:"MultiBank",totalReturn:"+31.5%",winRate:"68.9%",maxDrawdown:"-7.4%",sharpe:"1.74",riskLevel:"High",minInvestment:"$3,000",sparkData:[6,9,11,14,13,17,16,20,22,21,25,28,27,31],monthlyReturns:[{month:"J",val:5.2},{month:"F",val:3.1},{month:"M",val:-2.1},{month:"A",val:6.4},{month:"M",val:4.8},{month:"J",val:-1.2},{month:"J",val:5.9},{month:"A",val:4.1}],primaryLink:"https://social.multibankfx.com/portal/registration/subscription/89236/mamalynMin3000dollars",secondaryLinks:[{label:"FX Blue",url:"https://www.fxblue.com/users/mamalyn"},{label:"Myfxbook",url:"https://www.myfxbook.com/members/Panevino83/mamalyn-mt4-31229860/11078849"}]},
  {label:"Fund 12",name:"CXFund",focus:"Gold trading",status:"Disconnected",strategy:"Manual trading",managers:"2 traders",brokerage:"TMGM",primaryLink:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/69413/CXFund2026",secondaryLinks:[{label:"Ratings",url:"https://ratings.tmgmplatform.com/widgets/shared/cc306ad97ef243a5aa092cd4d0d226bb"}]},,
  {label:"Fund 14",name:"KTAi Sentinel Dynamics (US_500 & TECH100)",focus:"US Equities CFD (S&P 500 & NASDAQ 100)",status:"Live",strategy:"AI-driven forecasting with time-varying auto-adaptive algorithms. 80% forecast accuracy across multiple horizons.",managers:"Kooy Labs Inc.",brokerage:"GenesisFX",totalReturn:"+101.2%",winRate:"92.59%",maxDrawdown:"-7.16%",minInvestment:"$250,000",riskLevel:"Medium",extra:"72-day live track record (Mar-May 2026). Same Sentinel Dynamics system as ES & NQ, implemented on CFD instruments.",primaryLink:"https://dashboard.genesisfxmarkets.com/auth/register?ref=GFXBEBEF21B"},
  {label:"Fund 15",name:"KTAi Stellite FOREX",focus:"G10 Forex Pairs",status:"Live",strategy:"Systematic trend-following with multi-timeframe consensus scoring. Volatility-adaptive trailing stops and autonomous Corrective Control system.",managers:"Kooy Labs Inc.",brokerage:"GenesisFX",totalReturn:"+88.69%",winRate:"44.30%",maxDrawdown:"-4.65%",sharpe:"1.46",minInvestment:"$250,000",riskLevel:"Low",extra:"15-month track record (Jan 2025 - Apr 2026). CAGR: 61.31%. No human intervention required — fully autonomous risk management.",primaryLink:"https://dashboard.genesisfxmarkets.com/auth/register?ref=GFXBEBEF21B"}
];



export default function FundsPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Live", "Re-Launching", "N/A", "Disconnected", "Discontinuation"];
  const filtered = filter === "All" ? FUND_DATA : FUND_DATA.filter(f => f.status === filter);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
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
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2E4358]">KCG Multiplied Funds</span>
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-tight text-[#0F1A28] sm:text-6xl md:text-7xl" style={{ animation: "fadeUp 0.7s ease-out 0.2s both" }}>14 funds. One<br />institutional platform.</h1>
            <p className="mt-6 max-w-2xl text-lg text-[#2E4358]" style={{ animation: "fadeUp 0.7s ease-out 0.35s both" }}>Explore KCG's complete fund ecosystem across Gold, Forex, Crypto, and multi-asset instruments. Live funds include direct access links, performance metrics, and risk profiles.</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-4" style={{ animation: "fadeUp 0.7s ease-out 0.45s both" }}>
              {[{label:"Total Funds",value:"14"},{label:"Live Funds",value:"6"},{label:"Brokerages",value:"3"},{label:"Avg Return",value:"9.2%"}].map(s=>(
                <div key={s.label} className="rounded-2xl border border-white/50 bg-white/55 p-4 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5A7188]">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold text-[#0F1A28]">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FILTER + FUNDS */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-wrap gap-2">
              {filters.map(f=>(
                <button key={f} onClick={()=>setFilter(f)} className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:scale-105 ${filter===f?"bg-[#0F1A28] text-white":"border border-[#C9D8E2] bg-white/60 text-[#2E4358] hover:bg-white/80"}`}>
                  {f} ({f==="All"?FUND_DATA.length:FUND_DATA.filter(d=>d.status===f).length})
                </button>
              ))}
            </div>
            <StaggerReveal className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" stagger={60}>
              {filtered.map(fund=><FundCard key={fund.label} {...fund}/>)}
            </StaggerReveal>
            {filtered.length===0&&<div className="py-20 text-center text-[#5A7188]">No funds match this filter.</div>}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#DCE7EE] via-[#C9D8E2] to-[#B4C7D4] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal direction="scale">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Ready to Invest?</p>
              <h2 className="text-4xl font-bold text-[#0F1A28] md:text-5xl">Start a conversation with KCG today.</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-[#2E4358]">Book a call, message on Telegram, or submit a formal inquiry to get started with any live fund.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/contact" className="rounded-full bg-[#0F1A28] px-8 py-4 font-semibold text-white transition hover:scale-105">Get in Touch</Link>
                <Link href="/performance" className="rounded-full border border-[#2E4358]/40 bg-white/50 px-8 py-4 font-semibold text-[#0F1A28] transition hover:scale-105 hover:bg-white/75">View Performance →</Link>
              </div>
            </Reveal>
          </div>
        </section>

        <footer className="border-t border-black/5 bg-[#DCE7EE] px-4 py-10 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div><div className="flex items-center gap-2 mb-2"><div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0F1A28]"><span className="text-[8px] font-black text-white">KCG</span></div><p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5A7188]">Kaizen Capital Group</p></div><p className="mt-1 max-w-md text-sm text-[#2E4358]">Built around disciplined execution, premium positioning, and long-term credibility.</p></div>
            <div className="flex flex-wrap gap-6 text-sm text-[#2E4358]">{NAV_LINKS.map(l=><Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">{l.label}</Link>)}</div>
          </div>
        </footer>
      </main>
    </>
  );
}
