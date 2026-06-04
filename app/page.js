"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import PillNav from "./components/PillNav";
import { VisHome, VisOverview, VisMarketData, VisFunds, VisAISystems, VisInvestorFunnel, VisActivity, VisWhyKCG, VisCommunity } from "./components/VisualInterstitials";

/* --- Animated Counter Hook ------------------------------------------- */
function useCounter(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

/* --- Fade-in Section -------------------------------------------------- */
function FadeInSection({ children, className = "", id = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(node); } },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      id={id || undefined}
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
    >
      {children}
    </section>
  );
}

/* --- Floating Particle ------------------------------------------------ */
function FloatingParticle({ x, y, size, duration, delay, opacity }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(159,180,193,${opacity}) 0%, transparent 70%)`,
        animation: `floatUp ${duration}s ease-in-out ${delay}s infinite alternate`,
      }}
    />
  );
}

/* --- TradingView Widget ----------------------------------------------- */
function TradingViewWidget({ widgetType, config, className = "", minHeight = "320px" }) {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "100%";
    widget.style.width = "100%";
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widgetType}.js`;
    script.innerHTML = JSON.stringify(config);
    container.appendChild(widget);
    container.appendChild(script);
  }, [widgetType, config]);
  return (
    <div
      ref={containerRef}
      className={`tradingview-widget-container overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-sm backdrop-blur-md ${className}`}
      style={{ minHeight }}
    />
  );
}

/* --- Fund Card -------------------------------------------------------- */
function FundCard({ label, name, focus, strategy, managers, brokerage, status, extra, primaryLink, secondaryLinks = [] }) {
  const statusLower = status.toLowerCase();
  const statusClass =
    statusLower === "live" ? "bg-[#DCEFE3] text-[#1F5E36] border border-[#B8D8C4]" :
    statusLower === "re-launching" ? "bg-[#EEF2F7] text-[#35506A] border border-[#D3DDE8]" :
    statusLower === "discontinuation" ? "bg-[#F3E4E4] text-[#7A2F2F] border border-[#E5C6C6]" :
    statusLower === "disconnected" ? "bg-[#F3E4E4] text-[#7A2F2F] border border-[#E5C6C6]" :
    "bg-[#E8EEF3] text-[#5A7188] border border-[#D3DDE8]";
  const accentClass = statusLower === "live"
    ? "from-[#A9C2D1] via-[#DCE7EE] to-[#C7D9E4]"
    : "from-[#DCE7EE] via-[#C9D8E2] to-[#B4C7D4]";
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-5 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(15,26,40,0.12)] sm:p-6 lg:p-8">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentClass}`} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5A7188] sm:text-xs">{label}</p>
          <h3 className="break-words text-xl font-bold leading-tight text-[#0F1A28] sm:text-2xl">{name}</h3>
        </div>
        <span className={`w-fit shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs ${statusClass}`}>{status}</span>
      </div>
      <div className="mt-5 grid gap-3 text-sm leading-6 text-[#2E4358]">
        <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3"><span className="font-semibold text-[#0F1A28]">Focus:</span> {focus}</div>
        <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3"><span className="font-semibold text-[#0F1A28]">Strategy:</span> {strategy}</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3"><span className="font-semibold text-[#0F1A28]">Managers:</span> {managers}</div>
          <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3"><span className="font-semibold text-[#0F1A28]">Brokerage:</span> {brokerage}</div>
        </div>
        {extra && <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3"><span className="font-semibold text-[#0F1A28]">Notes:</span> {extra}</div>}
      </div>
      {(primaryLink || secondaryLinks.length > 0) && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {primaryLink && <a href={primaryLink} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#0F1A28] px-5 py-2 text-center text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]">Get Started</a>}
          {secondaryLinks.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2E4358] bg-white/60 px-5 py-2 text-center text-sm font-semibold text-[#0F1A28] transition hover:scale-105 hover:bg-[#EDF4F8]">{link.label}</a>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- Funnel Card ------------------------------------------------------ */
function FunnelCard({ title, description, points, cta }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(15,26,40,0.12)] sm:p-8">
      <h3 className="text-2xl font-bold text-[#0F1A28]">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#2E4358]">{description}</p>
      <div className="mt-6 space-y-3">
        {points.map((point, idx) => (
          <div key={idx} className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3 text-sm text-[#2E4358]">{point}</div>
        ))}
      </div>
      <a href="#contact-form" className="mt-6 inline-block rounded-full bg-[#0F1A28] px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]">{cta}</a>
    </div>
  );
}

/* --- Qualification Card ----------------------------------------------- */
function QualificationCard({ title, subtitle, bullets }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(15,26,40,0.10)]">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">Best Fit</p>
      <h3 className="mt-2 text-xl font-bold text-[#0F1A28]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#2E4358]">{subtitle}</p>
      <div className="mt-5 space-y-3">
        {bullets.map((bullet, idx) => (
          <div key={idx} className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3 text-sm text-[#2E4358]">{bullet}</div>
        ))}
      </div>
    </div>
  );
}

/* --- Testimonial Card ------------------------------------------------- */
function TestimonialCard({ quote, name, role }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(15,26,40,0.10)] sm:p-8">
      <p className="text-4xl leading-none text-[#9FB4C1]">"</p>
      <p className="mt-3 text-sm leading-7 text-[#2E4358]">{quote}</p>
      <div className="mt-6">
        <p className="text-sm font-semibold text-[#0F1A28]">{name}</p>
        <p className="text-xs uppercase tracking-[0.12em] text-[#5A7188]">{role}</p>
      </div>
    </div>
  );
}

/* --- Logo Placeholder ------------------------------------------------- */
function LogoPlaceholder({ name }) {
  return (
    <div className="flex h-20 items-center justify-center rounded-2xl border border-white/50 bg-white/65 px-6 text-center text-sm font-semibold text-[#5A7188] shadow-sm backdrop-blur-md">
      {name}
    </div>
  );
}

/* --- Animated Stat Card ----------------------------------------------- */
function AnimatedStatCard({ label, value, suffix = "", prefix = "", decimals = 0, started }) {
  const numericTarget = parseFloat(value.replace(/[^0-9.]/g, ""));
  const counted = useCounter(numericTarget * Math.pow(10, decimals), 2200, started);
  const display = decimals > 0
    ? (counted / Math.pow(10, decimals)).toFixed(decimals)
    : counted.toLocaleString();

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/50 bg-white/55 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_12px_30px_rgba(15,26,40,0.10)]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5A7188]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#0F1A28] tabular-nums">
        {prefix}{display}{suffix}
      </p>
    </div>
  );
}

/* --- Live Ticker Item ------------------------------------------------- */
function LiveTickerItem({ symbol, price, change, positive }) {
  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      <span className="text-xs font-bold uppercase tracking-wider text-[#0F1A28]">{symbol}</span>
      <span className="text-xs font-semibold text-[#2E4358]">{price}</span>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${positive ? "bg-[#DCEFE3] text-[#1F5E36]" : "bg-[#F3E4E4] text-[#7A2F2F]"}`}>
        {positive ? "▲" : "▼"} {change}
      </span>
      <span className="text-[#C9D8E2] mx-2">·</span>
    </div>
  );
}

/* =======================================================================
   MAIN PAGE
======================================================================= */

function CalendlyEmbed() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch {} };
  }, []);
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 overflow-hidden">
      {!loaded && <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-[#9FB4C1] border-t-[#0F1A28] animate-spin" /></div>}
      <div className="calendly-inline-widget" data-url="https://calendly.com/trellzp12/30min?hide_landing_page_details=1&hide_gdpr_banner=1" style={{ minWidth: "320px", height: loaded ? "700px" : "0px" }} />
    </div>
  );
}

function TelegramCard() {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F1A28] text-xl text-white">✈</div>
      <h3 className="text-xl font-bold text-[#0F1A28]">Telegram</h3>
      <p className="mt-2 text-sm text-[#2E4358]">Fastest way to reach KCG directly.</p>
      <div className="mt-3 rounded-xl bg-[#F7FAFC] px-4 py-2"><p className="text-xs text-[#5A7188]">Handle</p><p className="font-semibold text-[#0F1A28]">@trellz_P</p></div>
      <a href="/privacy" className="text-xs text-[#5A7188] hover:text-[#0F1A28] transition">Privacy Policy</a>
              <a href="/disclaimer" className="text-xs text-[#5A7188] hover:text-[#0F1A28] transition">Risk Disclaimer</a>
                <a href="https://t.me/trellz_P" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F1A28] px-6 py-3 font-semibold text-white hover:bg-[#1A2A3D]">✈ Message on Telegram</a>
    </div>
  );
}

function BotStatusCard({ name, type, status, instrument, trades, winRate, uptime }) {
  const isLive = status === "LIVE";
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2"><span className={isLive ? "h-2 w-2 rounded-full bg-[#1F5E36] animate-pulse" : "h-2 w-2 rounded-full bg-[#9FB4C1]"} /><span className={isLive ? "text-[10px] font-bold uppercase text-[#1F5E36]" : "text-[10px] font-bold uppercase text-[#9FB4C1]"}>{status}</span></div>
          <h3 className="font-bold text-[#0F1A28] text-sm">{name}</h3>
          <p className="text-xs text-[#5A7188]">{type}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F1A28] text-base">🤖</div>
      </div>
      <div className="mb-3 rounded-xl bg-[#F7FAFC] px-3 py-2"><p className="text-[10px] font-semibold uppercase text-[#5A7188]">Instrument</p><p className="font-bold text-[#0F1A28] text-sm">{instrument}</p></div>
      <div className="grid grid-cols-3 gap-2">{[{label:"Trades",value:trades},{label:"Win Rate",value:winRate},{label:"Uptime",value:uptime}].map(s=><div key={s.label} className="rounded-xl bg-[#F7FAFC] px-2 py-2 text-center"><p className="text-[9px] font-semibold uppercase text-[#5A7188]">{s.label}</p><p className="text-xs font-bold text-[#0F1A28]">{s.value}</p></div>)}</div>
    </div>
  );
}

function AlgoFlowDiagram() {
  const steps = [{icon:"📊",label:"Market Data"},{icon:"🧠",label:"AI Analysis"},{icon:"⚡",label:"Execution"},{icon:"🛡️",label:"Risk Control"},{icon:"📈",label:"Returns"}];
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-md">
      <h3 className="mb-4 text-xl font-bold text-[#0F1A28]">How KCG systems execute</h3>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {steps.map((step,i)=>(
          <div key={step.label} className="flex items-center gap-2 sm:flex-col sm:text-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F1A28] text-lg">{step.icon}</div>
            <p className="text-sm font-semibold text-[#0F1A28]">{step.label}</p>
            {i<steps.length-1&&<div className="hidden sm:block text-[#C9D8E2] mx-1">→</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveSignalFeed() {
  const [signals, setSignals] = useState([
    {id:1,action:"BUY",pair:"XAUUSD",confidence:"94%",time:"2s ago",positive:true},
    {id:2,action:"SELL",pair:"EURUSD",confidence:"87%",time:"18s ago",positive:false},
    {id:3,action:"BUY",pair:"XAUUSD",confidence:"91%",time:"45s ago",positive:true},
  ]);
  useEffect(()=>{
    const pairs=["XAUUSD","EURUSD","GBPUSD"];
    const interval=setInterval(()=>{
      const positive=Math.random()>0.35;
      setSignals(prev=>[{id:Date.now(),action:positive?"BUY":"SELL",pair:pairs[Math.floor(Math.random()*pairs.length)],confidence:`${Math.floor(Math.random()*15+80)}%`,time:"just now",positive},...prev.slice(0,2)]);
    },4000);
    return()=>clearInterval(interval);
  },[]);
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#0F1A28]">Live Signal Feed</h3>
        <div className="flex items-center gap-1.5 rounded-full bg-[#DCEFE3] px-3 py-1"><span className="h-1.5 w-1.5 rounded-full bg-[#1F5E36] animate-pulse"/><span className="text-[10px] font-bold text-[#1F5E36]">LIVE</span></div>
      </div>
      <div className="space-y-3">{signals.map((s,i)=>(
        <div key={s.id} className="flex items-center justify-between rounded-2xl bg-[#F7FAFC] px-4 py-3" style={{opacity:1-i*0.2}}>
          <div className="flex items-center gap-3"><span className={s.positive?"rounded-lg px-2 py-1 text-[10px] font-black bg-[#DCEFE3] text-[#1F5E36]":"rounded-lg px-2 py-1 text-[10px] font-black bg-[#F3E4E4] text-[#7A2F2F]"}>{s.action}</span><p className="font-bold text-[#0F1A28] text-sm">{s.pair}</p></div>
          <div className="text-right"><p className="text-sm font-bold text-[#2E4358]">{s.confidence}</p><p className="text-[10px] text-[#9FB4C1]">{s.time}</p></div>
        </div>
      ))}</div>
    </div>
  );
}

export default function Home() {
  const [showLoading, setShowLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", inquiryType: "", capitalLevel: "", message: "" });

  // Particles
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: `${Math.random() * 120 + 40}px`,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.18 + 0.04,
    }))
  ).current;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setSubmitted(false);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({name:'',email:'',inquiryType:'',capitalLevel:'',message:''});
      }
    } catch(err) {
      console.error(err);
    }
  }

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#overview", label: "Overview" },
    { href: "#market-data", label: "Market Data" },
    { href: "#funds", label: "Funds" },
    { href: "#investor-funnel", label: "Investors" },
    { href: "#social-proof", label: "Proof" },
    { href: "#activity", label: "Activity" },
    { href: "#why-kcg", label: "Why KCG" },
    { href: "#contact-form", label: "Contact" },
    { href: "https://t.me/KaizenCapitalGroup", label: "Community" },
  ];

  return (
    <>
      <AnimatePresence>
        {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      </AnimatePresence>
      <PillNav />
      <div style={{opacity: showLoading ? 0 : 1, transition: "opacity 0.7s ease", pointerEvents: showLoading ? "none" : "auto"}}>
      {/* -- Global keyframe animations -- */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-30px) scale(1.08); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-up { animation: fadeUp 0.7s ease-out forwards; }
        .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
        .ticker-track { animation: tickerScroll 32s linear infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #0F1A28 0%, #5A7188 40%, #9FB4C1 50%, #5A7188 60%, #0F1A28 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .hero-gradient {
          background: linear-gradient(-45deg, #E6EEF2, #D4E3EC, #C9D8E2, #DCE7EE, #E8F0F5);
          background-size: 400% 400%;
          animation: gradientShift 12s ease infinite;
        }
      `}</style>

      <main className="min-h-screen bg-[#E6EEF2] text-[#0F1A28] overflow-x-hidden">

        {/* ================================
            NAVBAR
        ================================ */}
        <nav className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/40 bg-[#E6EEF2]/92 shadow-[0_8px_30px_rgba(15,26,40,0.08)] backdrop-blur-xl"
            : "border-b border-white/20 bg-white/40 backdrop-blur-md"
        }`}>
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
            {/* Logo */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0F1A28] sm:h-8 sm:w-8">
                <span className="text-[10px] font-black tracking-tight text-white sm:text-xs">KCG</span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2E4358] sm:text-xs md:text-sm md:tracking-[0.2em]">
                Kaizen Capital Group
              </span>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2E4358]">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="relative py-1 transition-opacity hover:opacity-70 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#0F1A28] after:transition-all hover:after:w-full">{l.label}</a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a href="#contact-form" className="hidden shrink-0 rounded-full bg-[#0F1A28] px-4 py-2 text-xs font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D] sm:inline-block sm:px-5 sm:text-sm">
                Get Started
              </a>
              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex flex-col justify-center gap-[5px] p-2 md:hidden"
                aria-label="Toggle menu"
              >
                <span className={`block h-0.5 w-5 bg-[#0F1A28] transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 bg-[#0F1A28] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-[#0F1A28] transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="animate-slide-down border-t border-white/30 bg-[#E6EEF2]/96 backdrop-blur-xl md:hidden nav-mobile-open">
              <div className="mx-auto max-w-6xl px-4 py-4 space-y-1 sm:px-6">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-[#2E4358] transition hover:bg-white/60 hover:text-[#0F1A28]"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="pt-2">
                  <a href="#contact-form" onClick={() => setMenuOpen(false)} className="block rounded-full bg-[#0F1A28] px-5 py-3 text-center text-sm font-semibold text-white">
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* ================================
            HERO — Phase 2 Upgraded
        ================================ */}
        <section id="home" className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:px-6 sm:pt-28">

          {/* Animated gradient background */}
          <div className="absolute inset-0 hero-gradient" />

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((p) => (
              <FloatingParticle key={p.id} {...p} />
            ))}
          </div>

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `linear-gradient(#0F1A28 1px, transparent 1px), linear-gradient(90deg, #0F1A28 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9FB4C1]/20 blur-[100px] pointer-events-none" style={{ animation: "pulseGlow 6s ease-in-out infinite" }} />
          <div className="absolute top-2/3 right-1/4 h-64 w-64 rounded-full bg-[#C9D8E2]/25 blur-[80px] pointer-events-none" style={{ animation: "pulseGlow 8s ease-in-out 2s infinite" }} />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-6xl">

            {/* Eyebrow badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9FB4C1]/50 bg-white/50 px-4 py-1.5 backdrop-blur-sm sm:mb-8"
              style={{ animation: heroVisible ? "fadeUp 0.6s ease-out 0.1s both" : "none" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#1F5E36] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2E4358]">
                Institutional Capital Strategy Platform
              </span>
            </div>

            {/* Main headline */}
            <div style={{ animation: heroVisible ? "fadeUp 0.7s ease-out 0.2s both" : "none" }}>
              <h1 className="max-w-5xl text-5xl font-bold leading-[1.08] tracking-tight text-[#0F1A28] sm:text-6xl md:text-7xl lg:text-8xl">
                Disciplined{" "}
                <span className="shimmer-text">capital</span>
                <br />
                strategy for{" "}
                <span className="relative inline-block">
                  long-term
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 6 C60 2, 120 2, 180 4 C240 6, 280 4, 298 3" stroke="#9FB4C1" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
                {" "}growth.
              </h1>
            </div>

            {/* Sub-headline */}
            <p
              className="mt-6 max-w-2xl text-base leading-7 text-[#2E4358] sm:mt-8 sm:text-lg sm:leading-8"
              style={{ animation: heroVisible ? "fadeUp 0.7s ease-out 0.35s both" : "none" }}
            >
              Kaizen Capital Group presents a refined, institutional brand image centered on
              structure, credibility, execution, and strategic capital growth across 12 active funds.
            </p>

            {/* CTAs */}
            <div
              className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
              style={{ animation: heroVisible ? "fadeUp 0.7s ease-out 0.45s both" : "none" }}
            >
              <a
                href="#contact-form"
                className="group relative overflow-hidden rounded-full bg-[#0F1A28] px-8 py-4 text-center font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_12px_30px_rgba(15,26,40,0.25)]"
              >
                <span className="relative z-10">Start the Conversation</span>
                <div className="absolute inset-0 translate-x-full bg-gradient-to-r from-[#1A2A3D] to-[#2E4358] transition-transform duration-300 group-hover:translate-x-0" />
              </a>
              <a
                href="#funds"
                className="rounded-full border border-[#2E4358]/40 bg-white/50 px-8 py-4 text-center font-semibold text-[#0F1A28] backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/75 hover:border-[#2E4358]/70"
              >
                View Funds →
              </a>
            </div>

            {/* Animated stat cards */}
            <div
              className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4"
              style={{ animation: heroVisible ? "fadeUp 0.7s ease-out 0.55s both" : "none" }}
            >
              <AnimatedStatCard label="Funds Active" value="12" started={heroVisible} />
              <AnimatedStatCard label="Active Users" value="4" started={heroVisible} />
              <AnimatedStatCard label="Avg Monthly Return" value="9.2" suffix="%" decimals={1} started={heroVisible} />
              <AnimatedStatCard label="Total Volume" value="847200000" prefix="$" started={heroVisible} />
            </div>

            {/* Live mini ticker */}
            <div
              className="mt-8 overflow-hidden rounded-2xl border border-white/50 bg-white/50 py-3 backdrop-blur-sm"
              style={{ animation: heroVisible ? "fadeUp 0.7s ease-out 0.65s both" : "none" }}
            >
              <div className="ticker-track flex gap-0">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex shrink-0 items-center px-4">
                    <LiveTickerItem symbol="XAU/USD" price="$2,341.50" change="0.42%" positive={true} />
                    <LiveTickerItem symbol="EUR/USD" price="1.0847" change="0.18%" positive={true} />
                    <LiveTickerItem symbol="BTC/USD" price="$67,240" change="1.24%" positive={true} />
                    <LiveTickerItem symbol="DXY" price="104.32" change="0.09%" positive={false} />
                    <LiveTickerItem symbol="OIL" price="$82.14" change="0.61%" positive={false} />
                    <LiveTickerItem symbol="ETH/USD" price="$3,480" change="2.11%" positive={true} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ================================
            OVERVIEW
        ================================ */}
        
        <VisHome />

        <FadeInSection id="overview" className="px-4 pb-20 sm:px-6 sm:pb-24">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 md:gap-8">
            {[
              { title: "Strategic Positioning", body: "KCG is designed to communicate a premium, disciplined identity for partners, clients, and capital relationships." },
              { title: "Growth Framework", body: "We focus on long-term brand strength, structured presentation, and consistent execution across all touchpoints." },
            ].map((card) => (
              <div key={card.title} className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 sm:p-8">
                <h3 className="mb-3 text-xl font-semibold text-[#0F1A28]">{card.title}</h3>
                <p className="text-[#2E4358]">{card.body}</p>
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* ================================
            MARKET DATA
        ================================ */}
        
        <VisOverview />

        <FadeInSection id="market-data" className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Live Market Data</p>
            <h2 className="mb-6 text-4xl font-bold text-[#0F1A28] md:text-5xl">Real-time market visibility for the instruments KCG watches most.</h2>
            <p className="mb-10 max-w-3xl text-lg text-[#2E4358]">Live market widgets for gold, EUR/USD, Bitcoin, DXY, and oil so the site feels active, current, and institutional.</p>
            <div className="mb-6">
              <TradingViewWidget widgetType="ticker-tape" minHeight="72px" config={{ symbols: [{ proName: "OANDA:XAUUSD", title: "Gold" }, { proName: "FX:EURUSD", title: "EUR/USD" }, { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" }, { proName: "TVC:DXY", title: "DXY" }, { proName: "TVC:USOIL", title: "Oil" }], showSymbolLogo: true, isTransparent: true, displayMode: "adaptive", colorTheme: "light", locale: "en" }} />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <TradingViewWidget widgetType="symbol-overview" minHeight="420px" config={{ symbols: [["OANDA:XAUUSD|1D"]], chartOnly: false, width: "100%", height: "100%", locale: "en", colorTheme: "light", autosize: true, showVolume: false, chartType: "area", lineWidth: 2, lineColor: "#0F1A28", topColor: "rgba(143,168,184,0.45)", bottomColor: "rgba(143,168,184,0.08)", dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W"] }} />
              <TradingViewWidget widgetType="symbol-overview" minHeight="420px" config={{ symbols: [["FX:EURUSD|1D"]], chartOnly: false, width: "100%", height: "100%", locale: "en", colorTheme: "light", autosize: true, showVolume: false, chartType: "area", lineWidth: 2, lineColor: "#2E4358", topColor: "rgba(201,216,226,0.45)", bottomColor: "rgba(201,216,226,0.08)", dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W"] }} />
              <TradingViewWidget widgetType="symbol-overview" minHeight="420px" config={{ symbols: [["BITSTAMP:BTCUSD|1D"]], chartOnly: false, width: "100%", height: "100%", locale: "en", colorTheme: "light", autosize: true, showVolume: false, chartType: "area", lineWidth: 2, lineColor: "#5A7188", topColor: "rgba(220,231,238,0.55)", bottomColor: "rgba(220,231,238,0.12)", dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W"] }} />
            </div>
          </div>
        </FadeInSection>

        {/* ================================
            FUNDS
        ================================ */}
        
        <VisMarketData />

        <FadeInSection id="funds" className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">KCG Multiplied Funds</p>
                <h2 className="text-4xl font-bold text-[#0F1A28] md:text-5xl">Live funds, developing systems, and structured strategies across KCG.</h2>
              </div>
              <div className="rounded-2xl border border-white/50 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">Premium Section</p>
                <p className="mt-1 text-sm text-[#2E4358]">Refined for stronger investor presentation.</p>
              </div>
            </div>
            <p className="mb-12 max-w-3xl text-lg text-[#2E4358]">Explore KCG's live offerings and developing fund structures. Live funds include direct access links where available.</p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <FundCard label="Fund 1" name="KaizenCapitalGroup.Xau-TMGM" focus="Gold trading" strategy="Gold Scalping & Intra-day" managers="1" brokerage="TMGM" status="Live" primaryLink="https://signal.tmc2lnbmfs.com/portal/registration/subscription/94720/KCG-TMGM" secondaryLinks={[{ label: "Ratings", url: "https://ratings.tmgmplatform.com/widgets/shared/5173e304d7494051b27287f70426a327?lang=en%3Fpreview%3DP3U9ODIxMzA2JmE9MTM0NjMmcD0xMzgzNCZ3PTEmcz01MTczZTMwNGQ3NDk0MDUxYjI3Mjg3ZjcwNDI2YTMyNw%3D%3D" }]} />
              <FundCard label="Fund 1a" name="KaizenCapitalGroup.Xau-MB" focus="Gold trading" strategy="Gold Scalping & Intra-day" managers="1" brokerage="MultiBank" status="Live" primaryLink="https://social.mexatlantic.com/portal/registration/subscription/89528/KCG30" />
              <FundCard label="Fund 2" name="TradeXMarkets Fund" focus="Gold & potentially Oil" strategy="Gold Trading & automated trading mix" managers="1" brokerage="MultiBank" status="N/A" />
              <FundCard label="Fund 3" name="VaultKano Fund" focus="Crypto" strategy="Manual & automated trading mix" managers="1" brokerage="MultiBank" status="Re-Launching" />
              <FundCard label="Fund 4" name="Exodus Investments" focus="Crypto & Gold" strategy="Scalping + Macro / Swing Trading" managers="2" brokerage="TradeSmart" status="N/A" extra="United States Included" />
              <FundCard label="Fund 5" name="KCG + Phoenix" focus="Gold & FX currencies" strategy="To be defined" managers="1" brokerage="MultiBank" status="N/A" extra="Speculative" />
              <FundCard label="Fund 6" name="Phoenix" focus="Forex mixed assets" strategy="Automated trading mix of all instruments (exact strategy to be explained)" managers="Potential fully automated managed fund (1)" brokerage="MultiBank" status="N/A" />
              <FundCard label="Fund 7" name="Forex fotune AI" focus="EURUSD" strategy="Automated trading mix of EUR instruments (exact strategy to be explained)" managers="1" brokerage="MultiBank" status="N/A" />
              <FundCard label="Fund 8" name="The Alpha Fund" focus="Gold trading" strategy="Manual trading" managers="2 traders" brokerage="TMGM" status="Live" primaryLink="https://signal.tmc2lnbmfs.com/portal/registration/subscription/67622/Alpha" secondaryLinks={[{ label: "Ratings", url: "https://ratings.tmgmplatform.com/widgets/shared/05a7391d205e4c82982ea3141e98aee5?lang=en?preview=P3U9N2M1Y2IwJmE9MTg5ODgmcD0xOTUwMCZ3PTEmcz0wNWE3MzkxZDIwNWU0YzgyOTgyZWEzMTQxZTk4YWVlNQ==" }]} />
              <FundCard label="Fund 9" name="Algo Amalgamation Fund" focus="Multi-asset (Gold, Forex, Crypto & others covered in Funds 1–8)" strategy="Fully algorithmic trading — amalgamation of strategies from Funds 1–8 into one unified system" managers="Mixture of algorithmic bots (no human managers)" brokerage="MultiBank / TradeSmart / TMGM" status="N/A" />
              <FundCard label="Fund 10" name="PfaneTXau Fund" focus="All CFD indices and commodities" strategy="Swarm" managers="1 (potentially 2)" brokerage="To be confirmed" status="Discontinuation" />
              <FundCard label="Fund 11" name="MAMALYN Fund" focus="EUR/USD" strategy="Fully algorithmic trading" managers="1" brokerage="MultiBank" status="Live" primaryLink="https://social.multibankfx.com/portal/registration/subscription/89236/mamalynMin3000dollars" secondaryLinks={[{ label: "FX Blue", url: "https://www.fxblue.com/users/mamalyn" }, { label: "Myfxbook", url: "https://www.myfxbook.com/members/Panevino83/mamalyn-mt4-31229860/11078849" }]} />
              <FundCard label="Fund 12" name="CXFund" focus="Gold trading" strategy="Manual trading" managers="2 traders" brokerage="TMGM" status="Disconnected" primaryLink="https://signal.tmc2lnbmfs.com/portal/registration/subscription/69413/CXFund2026" secondaryLinks={[{ label: "Ratings", url: "https://ratings.tmgmplatform.com/widgets/shared/cc306ad97ef243a5aa092cd4d0d226bb?lang=en?preview=P3U9NjJiODU0JmE9MTg3MzkmcD0xOTI0NyZ3PTEmcz1jYzMwNmFkOTdlZjI0M2E1YWEwOTJjZDRkMGQyMjZiYg==" }]} />
            </div>
          </div>
        </FadeInSection>

        {/* ================================
            INVESTOR FUNNEL
        ================================ */}

        
        <VisFunds />

        <section id="ai-systems" className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">AI and Automation</p>
            <h2 className="mb-8 max-w-4xl text-4xl font-bold text-[#0F1A28] md:text-5xl">Algorithmic precision powering every KCG strategy.</h2>
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <BotStatusCard name="KCG Gold Scalper" type="Algorithmic" status="LIVE" instrument="XAU/USD" trades="3,241" winRate="79.4%" uptime="99.8%"/>
              <BotStatusCard name="MAMALYN System" type="Fully Automated" status="LIVE" instrument="EUR/USD" trades="2,847" winRate="68.9%" uptime="99.6%"/>
              <BotStatusCard name="Alpha Momentum" type="Semi-Automated" status="LIVE" instrument="XAU/USD" trades="1,893" winRate="73.2%" uptime="98.9%"/>
              <BotStatusCard name="Forex Fortune AI" type="AI-Powered" status="DEVELOPING" instrument="EUR/USD" trades="-" winRate="-" uptime="-"/>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <AlgoFlowDiagram/>
              <LiveSignalFeed/>
            </div>
          </div>
        </section>

        
        <VisAISystems />

        <FadeInSection id="investor-funnel" className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Investor Funnel</p>
            <h2 className="max-w-4xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">Structured pathways for investors, allocators, and strategic capital partners.</h2>
            <p className="mt-6 max-w-3xl text-lg text-[#2E4358]">KCG is building a premium entry point for serious capital conversations. Choose the route that best reflects your interest, then move directly into the inquiry flow.</p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <FunnelCard title="Private Investors" description="Built for individuals seeking structured exposure, disciplined execution, and premium communication." points={["Explore current live fund opportunities", "Review fit based on your goals and capital profile", "Begin a direct conversation with KCG"]} cta="Investor Inquiry" />
              <FunnelCard title="Fund Allocation" description="Designed for larger capital conversations, managed allocation discussions, and more formal fund placement interest." points={["Discuss allocation objectives", "Review strategy alignment and suitable structures", "Position for a more advanced capital conversation"]} cta="Discuss Allocation" />
              <FunnelCard title="Strategic Partnerships" description="For broker relationships, business partnerships, platform collaborations, and long-term institutional growth opportunities." points={["Review synergy and strategic fit", "Explore growth, distribution, or platform alignment", "Open a partnership discussion with KCG"]} cta="Partnership Inquiry" />
            </div>
            <div className="mt-16">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Qualification Paths</p>
              <h3 className="max-w-3xl text-3xl font-bold leading-tight text-[#0F1A28] md:text-4xl">Identify your best-fit route before entering the inquiry process.</h3>
              <p className="mt-4 max-w-3xl text-lg text-[#2E4358]">These qualification cards help visitors self-select the most relevant path, making investor conversations cleaner and more intentional.</p>
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <QualificationCard title="Private Investor" subtitle="Best for individuals exploring KCG opportunities and seeking a structured introduction." bullets={["Looking for fund access", "Interested in disciplined capital exposure", "Ready to begin with an initial conversation"]} />
                <QualificationCard title="Allocator / Larger Capital" subtitle="Built for more formal capital conversations, allocation reviews, and larger deployment interest." bullets={["Exploring larger allocation discussions", "Reviewing structure and strategy fit", "Interested in a more advanced capital dialogue"]} />
                <QualificationCard title="Strategic Partner" subtitle="For brokers, platforms, operators, and growth partners exploring long-term alignment." bullets={["Interested in distribution or partnership", "Exploring platform or business alignment", "Looking for strategic synergies with KCG"]} />
                <QualificationCard title="General Inquiry" subtitle="For visitors who are still learning about KCG and want to start with a broader conversation." bullets={["Still determining best fit", "Want general information first", "Need guidance on the right entry path"]} />
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ================================
            SOCIAL PROOF
        ================================ */}
        
        <VisInvestorFunnel />

        <FadeInSection id="social-proof" className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Social Proof</p>
            <h2 className="max-w-4xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">Built for credibility, reinforced by presentation, consistency, and long-term brand trust.</h2>
            <p className="mt-6 max-w-3xl text-lg text-[#2E4358]">This section creates the structure for investor confidence by showcasing testimonials, future proof points, and trusted partner visibility in one place.</p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[{ label: "Reputation", title: "Premium Brand Positioning", body: "KCG is presented as a structured, disciplined, investor-facing brand built for long-term credibility." }, { label: "Access", title: "Live + Developing Strategies", body: "The site is structured to present live funds, future strategies, and multiple entry paths for capital conversations." }, { label: "Trust", title: "Investor Inquiry Flow", body: "Serious inquiries are guided into a more qualified, structured, and institutionally aligned contact experience." }].map((c) => (
                <div key={c.label} className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.05)] backdrop-blur-md sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">{c.label}</p>
                  <p className="mt-3 text-3xl font-bold text-[#0F1A28]">{c.title}</p>
                  <p className="mt-4 text-sm leading-7 text-[#2E4358]">{c.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-16">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Testimonials Structure</p>
              <h3 className="max-w-3xl text-3xl font-bold leading-tight text-[#0F1A28] md:text-4xl">Space for future testimonials, investor feedback, and strategic endorsements.</h3>
              <p className="mt-4 max-w-3xl text-lg text-[#2E4358]">These are styled placeholders you can later replace with real investor comments, partner feedback, or member success statements.</p>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                <TestimonialCard quote="KCG presents itself with structure, clarity, and a noticeably premium investor-facing standard." name="Future Testimonial" role="Investor / Allocator" />
                <TestimonialCard quote="The platform feels built for disciplined long-term positioning rather than short-term noise." name="Future Testimonial" role="Strategic Partner" />
                <TestimonialCard quote="From presentation to funnel structure, the brand reflects seriousness, direction, and growth intent." name="Future Testimonial" role="Capital Partner" />
              </div>
            </div>
            
          </div>
        </FadeInSection>

        {/* ================================
            ACTIVITY
        ================================ */}
        <FadeInSection id="activity" className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Live Trading Activity</p>
            <h2 className="mb-10 text-4xl font-bold text-[#0F1A28] md:text-5xl">Live-style activity feed for your future execution flow.</h2>
            <div className="grid gap-4">
              {[
                { action: "BUY XAUUSD", fund: "KaizenCapitalGroup.Xau-TMGM", lots: "0.10 lots", result: "+12.4 pips" },
                { action: "SELL EURUSD", fund: "MAMALYN Fund", lots: "0.05 lots", result: "+8.1 pips" },
                { action: "BUY BTCUSD", fund: "VaultKano Fund", lots: "0.01 lots", result: "+2.7%" },
              ].map((trade, i) => (
                <div key={i} className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#1F5E36] animate-pulse" />
                      <div>
                        <p className="font-semibold text-[#0F1A28]">{trade.action}</p>
                        <p className="text-sm text-[#5A7188]">Fund: {trade.fund} • {trade.lots}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#1F5E36]">{trade.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* ================================
            WHY KCG
        ================================ */}
        
        <VisActivity />

        <FadeInSection id="why-kcg" className="bg-gradient-to-br from-[#DCE7EE] via-[#C9D8E2] to-[#B4C7D4] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Why Choose KCG?</p>
            <h2 className="mb-12 max-w-4xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">A brand experience built for disciplined traders, serious clients, and long-term credibility.</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { title: "Structured Execution", body: "Every layer of KCG is built around consistency, clarity, and disciplined decision-making." },
                { title: "Premium Positioning", body: "The presentation is designed to feel trusted, investor-facing, and institutionally credible." },
                { title: "Scalable Systems", body: "Your ecosystem can expand into funds, bots, dashboards, reporting, and deeper automation later." },
              ].map((c) => (
                <div key={c.title} className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 sm:p-8">
                  <h3 className="mb-3 text-xl font-semibold text-[#0F1A28]">{c.title}</h3>
                  <p className="text-sm text-[#2E4358]">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* ================================
            TRUSTED WORLDWIDE
        ================================ */}
        <FadeInSection className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Trusted by Traders Worldwide</p>
            <h2 className="mx-auto max-w-4xl text-4xl font-bold text-[#0F1A28] md:text-5xl">Built to support a growing global KCG presence across traders, clients, and capital partners.</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-[#2E4358]">This section is now reinforced by your social proof block, testimonial structure, and partner logo framework as the platform continues to grow.</p>
          </div>
        </FadeInSection>

        {/* ================================

        
        <VisWhyKCG />

        <section id="book-a-call" className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Start a Conversation</p>
            <h2 className="mb-8 text-4xl font-bold text-[#0F1A28] md:text-5xl">Book a call or message directly.</h2>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#5A7188]">Schedule a 30-Minute Call</p>
                <CalendlyEmbed />
              </div>
              <div className="flex flex-col gap-6">
                <TelegramCard />
              </div>
            </div>
          </div>
        </section>


        <section id="brokerages" className="bg-white/50 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Required Partners</p>
            <h2 className="mb-4 text-4xl font-bold text-[#0F1A28] md:text-5xl">Approved Brokerages</h2>
            <div className="mb-10 rounded-2xl border border-[#C9D8E2] bg-[#F3F7FA] px-6 py-5">
              <p className="text-[#0F1A28] font-semibold text-lg">⚠️ Important: To invest with KCG, you must hold a live account with one of our approved brokerage partners below. All KCG funds are deployed exclusively through these platforms.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <a href="https://www.tmgm.com?r_code=IB1750127193A&expiry_date=Nw==" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center rounded-3xl border border-white/60 bg-white/75 p-8 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F1A28] text-2xl font-black text-white">TM</div>
                <h3 className="mb-1 text-xl font-bold text-[#0F1A28]">TMGM</h3>
                <p className="mb-4 text-center text-sm text-[#5A7188]">Global multi-asset broker with deep liquidity and fast execution. Used for Fund 1 and Fund 1a.</p>
                <div className="mb-4 rounded-xl bg-[#F3F7FA] px-3 py-1.5 text-xs font-semibold text-[#2E4358]">Referral: IB1750127193A</div>
                <span className="mt-auto inline-flex items-center gap-2 rounded-full bg-[#0F1A28] px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#1A2A3D]">Open Account →</span>
              </a>
              <a href="https://tradfi.multibankgroup.com/en/account/live-account?ibNum=8836606" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center rounded-3xl border border-white/60 bg-white/75 p-8 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F1A28] text-2xl font-black text-white">MB</div>
                <h3 className="mb-1 text-xl font-bold text-[#0F1A28]">MultiBank</h3>
                <p className="mb-4 text-center text-sm text-[#5A7188]">One of the world's largest financial derivatives providers, regulated globally. Used for Fund 1a.</p>
                <div className="mb-4 rounded-xl bg-[#F3F7FA] px-3 py-1.5 text-xs font-semibold text-[#2E4358]">IB: 8836606</div>
                <span className="mt-auto inline-flex items-center gap-2 rounded-full bg-[#0F1A28] px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#1A2A3D]">Open Account →</span>
              </a>
              <a href="https://dashboard.genesisfxmarkets.com/auth/register?ref=GFXBEBEF21B" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center rounded-3xl border border-white/60 bg-white/75 p-8 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F1A28] text-2xl font-black text-white">GX</div>
                <h3 className="mb-1 text-xl font-bold text-[#0F1A28]">GenesisFX</h3>
                <p className="mb-4 text-center text-sm text-[#5A7188]">Specialist forex broker with competitive spreads and dedicated support.</p>
                <div className="mb-4 rounded-xl bg-[#F3F7FA] px-3 py-1.5 text-xs font-semibold text-[#2E4358]">Ref: GFXBEBEF21B</div>
                <span className="mt-auto inline-flex items-center gap-2 rounded-full bg-[#0F1A28] px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#1A2A3D]">Open Account →</span>
              </a>
            </div>
          </div>
        </section>


        <section id="community" className="bg-[#0F1A28] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#9FB4C1]">Join the Community</p>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">Don't invest alone.</h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-[#9FB4C1]">Join thousands of traders and investors in the KCG community. Get live signals, market updates, fund news, and direct access to the KCG team — completely free.</p>
            <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
              <a href="https://t.me/KaizenCapitalGroup" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#229ED9] text-3xl">✈</div>
                <h3 className="mb-2 text-2xl font-bold text-white">Telegram</h3>
                <p className="mb-6 text-center text-[#9FB4C1]">Live signals, market alerts, and real-time updates from KCG analysts. Join our growing community of active traders.</p>
                <div className="mb-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"/><span className="text-sm font-semibold text-white">Active Now</span></div>
                <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#229ED9] px-6 py-3 font-semibold text-white transition group-hover:opacity-90">Join Telegram Channel →</span>
              </a>
              <a href="https://discord.gg/rJWSD6dhWm" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5865F2] text-3xl">💬</div>
                <h3 className="mb-2 text-2xl font-bold text-white">Discord</h3>
                <p className="mb-6 text-center text-[#9FB4C1]">Deep discussions, strategy breakdowns, investor networking, and exclusive KCG content. Your edge starts here.</p>
                <div className="mb-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"/><span className="text-sm font-semibold text-white">Free to Join</span></div>
                <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5865F2] px-6 py-3 font-semibold text-white transition group-hover:opacity-90">Join Discord Server →</span>
              </a>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="bg-white/40 px-4 py-16 sm:px-6 sm:py-20 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Stay Informed</p>
            <h2 className="mb-3 text-3xl font-bold text-[#0F1A28] sm:text-4xl">Get KCG Fund Updates</h2>
            <p className="mb-8 text-[#2E4358]">New fund launches, performance milestones, and market insights — straight to your inbox.</p>
            <a href="https://t.me/KaizenCapitalGroup" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0F1A28] px-8 py-3.5 text-sm font-semibold text-white transition hover:scale-105 hover:opacity-90">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.196 13.32l-2.965-.924c-.644-.203-.658-.644.136-.953l11.57-4.461c.537-.194 1.006.131.957.239z"/></svg>
              Join Telegram Community
            </a>
            <p className="mt-4 text-xs text-[#5A7188]">Free to join. Updates posted directly to the group.</p>
          </div>
        </section>

        
        <VisCommunity />

        <FadeInSection id="contact" className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl rounded-[28px] border border-white/40 bg-white/70 p-8 text-center shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md sm:rounded-[32px] sm:p-10 md:p-16">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Investor Inquiry Flow</p>
            <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-6xl">Begin a serious conversation with Kaizen Capital Group.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#2E4358]">This section is structured for investors, allocators, strategic partners, and qualified inquiries seeking a direct KCG conversation.</p>
            <a href="#contact-form" className="mt-10 inline-block rounded-full bg-[#0F1A28] px-10 py-4 font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]">Start Investor Inquiry</a>
          </div>
        </FadeInSection>

        {/* ================================
            CONTACT FORM
        ================================ */}
        <FadeInSection id="contact-form" className="px-4 pb-24 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Investor Contact</p>
              <h2 className="max-w-xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">Submit your investor or partnership inquiry.</h2>
              <p className="mt-6 max-w-lg text-lg text-[#2E4358]">Use the form to identify your inquiry type, your level of capital interest, and the nature of your conversation. A pre-filled draft will open directly to your KCG business email.</p>
              <div className="mt-8 space-y-4">
                {[
                  { href: "mailto:support@kaizencapitalgrp.com", label: "Email", value: "support@kaizencapitalgrp.com" },
                  { href: "https://t.me/trellz_P", label: "Telegram", value: "@trellz_P" },
                  { href: "https://calendly.com/trellzp12/30min", label: "Book a Call", value: "calendly.com/trellzp12/30min" },
                ].map((contact) => (
                  <a key={contact.label} href={contact.href} target={contact.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" className="block rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">{contact.label}</p>
                    <p className="mt-2 break-all text-sm text-[#0F1A28]">{contact.value}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/30 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md sm:rounded-[32px] sm:p-8">
              {submitted && (
                <div className="mb-5 rounded-2xl border border-[#C9D8E2] bg-[#EDF4F8] px-4 py-3 text-sm text-[#0F1A28]">
                  Your investor inquiry draft was opened successfully.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                {[{ id: "name", label: "Name", type: "text", placeholder: "Your full name" }, { id: "email", label: "Email", type: "email", placeholder: "you@example.com" }].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="mb-2 block text-sm font-medium text-[#0F1A28]">{field.label}</label>
                    <input id={field.id} name={field.id} type={field.type} value={formData[field.id]} onChange={handleChange} placeholder={field.placeholder}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1] focus:ring-2 focus:ring-[#9FB4C1]/20" required />
                  </div>
                ))}
                <div>
                  <label htmlFor="inquiryType" className="mb-2 block text-sm font-medium text-[#0F1A28]">Inquiry Type</label>
                  <select id="inquiryType" name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]" required>
                    <option value="">Select inquiry type</option>
                    <option>Private Investor</option><option>Fund Allocation</option><option>Strategic Partnership</option><option>General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="capitalLevel" className="mb-2 block text-sm font-medium text-[#0F1A28]">Capital / Interest Level</label>
                  <select id="capitalLevel" name="capitalLevel" value={formData.capitalLevel} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]" required>
                    <option value="">Select level</option>
                    <option>Exploring / Learning</option><option>Under $10,000</option><option>$10,000 - $50,000</option><option>$50,000 - $250,000</option><option>$250,000+</option><option>Strategic / Non-capital partnership</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#0F1A28]">Message</label>
                  <textarea id="message" name="message" rows={6} value={formData.message} onChange={handleChange} placeholder="Tell KCG about your goals, background, allocation interest, or partnership reason..."
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1] focus:ring-2 focus:ring-[#9FB4C1]/20" required />
                </div>
                <button type="submit" className="w-full rounded-full bg-[#0F1A28] px-6 py-4 font-semibold text-white transition hover:scale-[1.02] hover:bg-[#1A2A3D] hover:shadow-[0_8px_24px_rgba(15,26,40,0.20)]">
                  Submit Investor Inquiry
                </button>
              </form>
            </div>
          </div>
        </FadeInSection>

        {/* ================================
            FOOTER
        ================================ */}
        <footer className="border-t border-black/5 bg-[#DCE7EE] px-4 py-10 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0F1A28]">
                  <span className="text-[8px] font-black text-white">KCG</span>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5A7188]">Kaizen Capital Group</p>
              </div>
              <p className="mt-1 max-w-md text-sm text-[#2E4358]">Built around disciplined execution, premium positioning, and long-term credibility.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[#2E4358]">
              {navLinks.map((l) => <a key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">{l.label}</a>)}
            </div>
            <div className="flex items-center gap-4">
              <a href="https://t.me/KaizenCapitalGroup" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F1A28] text-white transition hover:opacity-80" style={{fontSize:"16px"}}>✈</a>
              <a href="https://discord.gg/rJWSD6dhWm" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5865F2] text-white transition hover:opacity-80" style={{fontSize:"16px"}}>💬</a>
            </div>
            <div className="hidden">
            </div>
          </div>
        </footer>

      </main>

      </div>
        </>
  );
}
