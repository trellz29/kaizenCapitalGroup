"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CinematicLoader from "./components/CinematicLoader";
import CinematicNav from "./components/CinematicNav";
import CinematicHero from "./components/CinematicHero";
import CinematicFundCard from "./components/CinematicFundCard";
import LenisProvider from "./components/LenisProvider";
import HeroGlobe from "./components/HeroGlobe";
import EcosystemViz from "./components/EcosystemViz";
import BloombergDashboard from "./components/BloombergDashboard";
import GlobalCapitalMap from "./components/GlobalCapitalMap";
import HorizontalFundScroll from "./components/HorizontalFundScroll";
import MagneticCursor from "./components/MagneticCursor";
import KineticText from "./components/KineticText";
import CounterFlip from "./components/CounterFlip";
import SlideReveal from "./components/SlideReveal";
import StaggerGrid from "./components/StaggerGrid";

/* --- TradingView widget ------------------------------------------- */
function TradingViewWidget({ widgetType, config, minHeight }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-" + widgetType + ".js";
    s.async = true;
    s.innerHTML = JSON.stringify(config);
    el.appendChild(s);
  }, [widgetType]);
  return <div ref={ref} style={{ minHeight }} />;
}

/* --- Calendly widget ---------------------------------------------- */
function CalendlyWidget() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);
  return (
    <div className="calendly-inline-widget" data-url="https://calendly.com/trellzp12/30min?hide_landing_page_details=1&hide_gdpr_banner=1"
      style={{ minWidth: "320px", height: loaded ? "700px" : "0px" }} />
  );
}

/* --- Section wrapper ---------------------------------------------- */
function Scene({ id, children, className = "", style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.01, rootMargin: '200px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} id={id} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
      ...style,
    }}>
      {children}
    </section>
  );
}

/* --- Scroll progress bar ------------------------------------------ */
function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    const fn = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(pct, 1)})`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 9001, background: "rgba(255,255,255,0.05)" }}>
      <div ref={barRef} style={{ height: "100%", background: "linear-gradient(90deg,#9FB4C1,#fff,#9FB4C1)", transformOrigin: "left", transform: "scaleX(0)", transition: "transform 0.1s linear" }} />
    </div>
  );
}

/* --- Bento stats card --------------------------------------------- */
function BentoStat({ num, label, prefix = "", suffix = "", accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "24px", backdropFilter: "blur(12px)",
      position: "relative", overflow: "hidden",
    }}>
      {accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />}
      <div style={{ fontFamily: "sans-serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
        <CounterFlip value={parseFloat(String(num).replace(/[^0-9.]/g, ""))} prefix={prefix} suffix={suffix} decimals={String(num).includes(".") ? 1 : 0} />
      </div>
      <div style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)", marginTop: 8 }}>{label}</div>
    </div>
  );
}

/* --- GLOBAL CSS --------------------------------------------------- */
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { background: #050810; color: #fff; overflow-x: hidden; }
  ::selection { background: rgba(159,180,193,0.25); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #050810; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
  .scene-label { font-family:sans-serif; font-size:10px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:rgba(159,180,193,0.45); margin-bottom:16px; display:flex; align-items:center; gap:10px; }
  .scene-label::before { content:""; width:24px; height:1px; background:rgba(159,180,193,0.25); }
  .scene-h2 { font-family:sans-serif; font-size:clamp(2rem,4.5vw,3.8rem); font-weight:900; letter-spacing:-0.03em; color:#fff; line-height:1.1; margin:0 0 1rem; }
  .scene-p { font-family:sans-serif; font-size:clamp(0.9rem,1.2vw,1rem); color:rgba(255,255,255,0.38); line-height:1.85; }
  .divider { height:1px; background:linear-gradient(90deg,transparent,rgba(159,180,193,0.12),transparent); margin:0; }
  @keyframes kcgTicker { 0%{transform:translateX(0)} 100%{transform:translateX(-33.333%)} }
  @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .glass-card {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);
    border-radius:20px; backdrop-filter:blur(16px);
    transition:border-color 0.3s ease, background 0.3s ease;
  }
  .glass-card:hover { border-color:rgba(255,255,255,0.15); background:rgba(255,255,255,0.05); }
  .marquee-track { display:flex; animation:kcgTicker 30s linear infinite; white-space:nowrap; }
`;

/* --- MAIN PAGE ---------------------------------------------------- */
export default function Home() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <AnimatePresence>
        {showLoader && (
          <motion.div key="loader" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <CinematicLoader onComplete={() => setShowLoader(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ opacity: showLoader ? 0 : 1, transition: "opacity 0.8s ease 0.2s" }}>
        <LenisProvider />
        <MagneticCursor />
        <ScrollProgress />
        <CinematicNav />

        {/* ??????????????????????????????????????
            SCENE 1 — HERO
        ?????????????????????????????????????? */}
        <section id="home" style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
          <CinematicHero />
          <HeroGlobe />
        </section>

        {/* ??????????????????????????????????????
            TICKER STRIP
        ?????????????????????????????????????? */}
        <div style={{ background: "#070F1E", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "16px 0", overflow: "hidden" }}>
          <div className="marquee-track">
            {[...Array(3)].map((_, si) => (
              <div key={si} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                {["INSTITUTIONAL EXECUTION", "12 ACTIVE FUNDS", "DISCIPLINED CAPITAL", "$847M+ VOLUME", "9.2% AVG MONTHLY RETURN", "COPY TRADING LIVE", "KAIZEN CAPITAL GROUP", "VERIFIED STRATEGIES"].map((item, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 24, paddingRight: 48 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", color: "rgba(159,180,193,0.4)", fontFamily: "sans-serif", textTransform: "uppercase" }}>{item}</span>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(159,180,193,0.2)", flexShrink: 0, display: "inline-block" }} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ??????????????????????????????????????
            SCENE 2 — STATS BENTO
        ?????????????????????????????????????? */}
        <Scene id="overview" style={{ background: "#070F1E", padding: "80px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)" }}>
            <SlideReveal direction="up">
              <p className="scene-label">KCG at a Glance</p>
              <KineticText as="h2" className="scene-h2" style={{ maxWidth: 700, marginBottom: "3rem" }}>
                A disciplined multi-fund platform built for long-term capital growth.
              </KineticText>
            </SlideReveal>

            {/* Bento grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(180px,calc(50% - 8px)),1fr))", gap: 12, marginBottom: 40 }}>
              <SlideReveal direction="up" delay={0}><BentoStat num="12" label="Active Funds" accent="rgba(0,232,120,0.6)" /></SlideReveal>
              <SlideReveal direction="up" delay={80}><BentoStat num="9.2" label="Avg Monthly Return" suffix="%" accent="rgba(159,180,193,0.6)" /></SlideReveal>
              <SlideReveal direction="up" delay={160}><BentoStat num="847" label="Total Volume" prefix="$" suffix="M+" accent="rgba(100,150,255,0.6)" /></SlideReveal>
              <SlideReveal direction="up" delay={240}><BentoStat num="4" label="Active Users" suffix="+" accent="rgba(200,180,100,0.6)" /></SlideReveal>
            </div>

            {/* Overview cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: 16 }}>
              {[
                { title: "Institutional Execution", body: "KCG deploys capital through verified brokerages with institutional-grade execution infrastructure across 12 active funds." },
                { title: "Multi-Asset Strategies", body: "From Gold scalping and EUR/USD algos to Crypto and multi-asset amalgamation — diversified across asset classes and timeframes." },
                { title: "Transparent Structure", body: "Every fund has defined strategy, manager allocation, brokerage partner, and status — built for serious capital relationships." },
              ].map((c, i) => (
                <SlideReveal key={c.title} direction="up" delay={i * 100}>
                  <div className="glass-card" style={{ padding: 28 }}>
                    <h3 style={{ fontFamily: "sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.01em" }}>{c.title}</h3>
                    <p style={{ fontFamily: "sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>{c.body}</p>
                  </div>
                </SlideReveal>
              ))}
            </div>
          </div>
        </Scene>

        <div className="divider" />

        {/* ??????????????????????????????????????
            SCENE 3 — LIVE MARKET DATA
        ?????????????????????????????????????? */}
        <Scene id="market-data" style={{ background: "#050810", padding: "80px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)" }}>
            <SlideReveal direction="left">
              <p className="scene-label">Live Market Data</p>
              <KineticText as="h2" className="scene-h2" style={{ maxWidth: 600, marginBottom: "1rem" }}>
                Real-time visibility on the instruments KCG watches most.
              </KineticText>
              <p className="scene-p" style={{ maxWidth: 500, marginBottom: "2.5rem" }}>Gold, EUR/USD, Bitcoin, DXY, and oil — updating live so the platform always feels active and institutional.</p>
            </SlideReveal>

            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: "0 0 2px", overflow: "hidden", marginBottom: 24 }}>
              <TradingViewWidget widgetType="ticker-tape" minHeight="72px" config={{ symbols: [{ proName: "OANDA:XAUUSD", title: "Gold" }, { proName: "FX:EURUSD", title: "EUR/USD" }, { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" }, { proName: "TVC:DXY", title: "DXY" }, { proName: "TVC:USOIL", title: "Oil" }], showSymbolLogo: true, isTransparent: true, displayMode: "adaptive", colorTheme: "dark", locale: "en" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: 16 }}>
              {[
                { widget: "mini-symbol-overview", config: { symbol: "OANDA:XAUUSD", width: "100%", height: 220, locale: "en", dateRange: "1D", colorTheme: "dark", isTransparent: true, autosize: false, largeChartUrl: "" }, label: "XAU/USD" },
                { widget: "mini-symbol-overview", config: { symbol: "FX:EURUSD", width: "100%", height: 220, locale: "en", dateRange: "1D", colorTheme: "dark", isTransparent: true, autosize: false, largeChartUrl: "" }, label: "EUR/USD" },
                { widget: "mini-symbol-overview", config: { symbol: "BITSTAMP:BTCUSD", width: "100%", height: 220, locale: "en", dateRange: "1D", colorTheme: "dark", isTransparent: true, autosize: false, largeChartUrl: "" }, label: "BTC/USD" },
              ].map((item, i) => (
                <SlideReveal key={item.label} direction="up" delay={i * 100}>
                  <div className="glass-card" style={{ overflow: "hidden" }}>
                    <TradingViewWidget widgetType={item.widget} minHeight="220px" config={item.config} />
                  </div>
                </SlideReveal>
              ))}
            </div>
          </div>
        </Scene>

        <div className="divider" />

        {/* ??????????????????????????????????????
            SCENE 3b — INSTITUTIONAL DASHBOARD
        ?????????????????????????????????????? */}
        <Scene style={{ background: "#070F1E", padding: "80px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)" }}>
            <SlideReveal direction="up">
              <p className="scene-label">Institutional Dashboard</p>
              <KineticText as="h2" className="scene-h2" style={{ maxWidth: 700, marginBottom: "1rem" }}>
                Bloomberg-grade analytics. Built for KCG.
              </KineticText>
              <p className="scene-p" style={{ maxWidth: 520, marginBottom: "3rem" }}>Real-time fund performance, animated AUM counters, live strategy monitoring — every metric that matters, in one terminal.</p>
            </SlideReveal>
            <BloombergDashboard />
          </div>
        </Scene>

        <div className="divider" />

        {/* ??????????????????????????????????????
            SCENE 4 — HORIZONTAL FUND SHOWCASE
        ?????????????????????????????????????? */}
        <div id="funds" style={{ background: "#070F1E" }}>
          <HorizontalFundScroll />
        </div>

        <div className="divider" />

        {/* ??????????????????????????????????????
            SCENE 5 — INVESTOR FUNNEL
        ?????????????????????????????????????? */}
        <Scene id="investor-funnel" style={{ background: "#050810", padding: "80px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)" }}>
            <SlideReveal direction="up">
              <p className="scene-label">Who KCG Serves</p>
              <KineticText as="h2" className="scene-h2" style={{ maxWidth: 700, marginBottom: "1rem" }}>
                Built for investors who demand precision, structure, and results.
              </KineticText>
              <p className="scene-p" style={{ maxWidth: 520, marginBottom: "3rem" }}>Whether you're allocating capital, following signals, or exploring a strategic partnership — there's a KCG path for you.</p>
            </SlideReveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: 16 }}>
              {[
                { n: "01", title: "Private Investors", desc: "Built for individuals seeking structured exposure, disciplined execution, and premium communication.", points: ["Explore current live fund opportunities", "Review fit based on your goals", "Begin a direct conversation with KCG"], cta: "Investor Inquiry", href: "#contact-form" },
                { n: "02", title: "Fund Allocation", desc: "Designed for larger capital conversations, managed allocation discussions, and formal fund placement interest.", points: ["Discuss allocation objectives", "Review strategy alignment", "Position for advanced capital conversation"], cta: "Discuss Allocation", href: "#contact-form" },
                { n: "03", title: "Strategic Partnerships", desc: "For broker relationships, business partnerships, platform collaborations, and long-term institutional growth.", points: ["Review synergy and strategic fit", "Explore growth alignment", "Open a partnership discussion"], cta: "Partnership Inquiry", href: "#contact-form" },
              ].map((item, i) => (
                <SlideReveal key={item.n} direction="up" delay={i * 100}>
                  <div className="glass-card" style={{ padding: 32, height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(159,180,193,0.35)", marginBottom: 12 }}>{item.n}</div>
                    <h3 style={{ fontFamily: "sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 12 }}>{item.title}</h3>
                    <p style={{ fontFamily: "sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.75, marginBottom: 20 }}>{item.desc}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                      {item.points.map(p => (
                        <li key={p} style={{ fontFamily: "sans-serif", fontSize: "0.8rem", color: "rgba(159,180,193,0.6)", display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: "rgba(0,232,120,0.6)", marginTop: 2, flexShrink: 0 }}>→</span>{p}
                        </li>
                      ))}
                    </ul>
                    <a href={item.href} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 20px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, textDecoration: "none", transition: "all 0.2s ease", marginTop: "auto" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                      {item.cta} →
                    </a>
                  </div>
                </SlideReveal>
              ))}
            </div>
          </div>
        </Scene>

        <div className="divider" />

        {/* ??????????????????????????????????????
            SCENE 5b — GLOBAL CAPITAL NETWORK
        ?????????????????????????????????????? */}
        <Scene style={{ position: "relative", background: "#050810", padding: "80px 0", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 100% 60% at 50% 50%, rgba(8,20,50,0.5) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)", position: "relative", zIndex: 1 }}>
            <SlideReveal direction="up" style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p className="scene-label" style={{ justifyContent: "center" }}>Global Network</p>
              <KineticText as="h2" className="scene-h2" style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 1rem" }}>
                Capital flows across every major market.
              </KineticText>
              <p className="scene-p" style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>KCG operates through verified brokerages with presence across Dubai, London, New York, Singapore, and beyond.</p>
            </SlideReveal>
            <GlobalCapitalMap />
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
              {[
                { city: "London", tier: 1 }, { city: "New York", tier: 1 }, { city: "Tokyo", tier: 1 },
                { city: "Singapore", tier: 1 }, { city: "Hong Kong", tier: 1 }, { city: "Dubai", tier: 1 },
                { city: "Frankfurt", tier: 2 }, { city: "Sydney", tier: 2 }, { city: "Shanghai", tier: 2 },
                { city: "Mumbai", tier: 2 }, { city: "São Paulo", tier: 2 }, { city: "Zurich", tier: 2 },
              ].map(({ city, tier }) => (
                <div key={city} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: tier === 1 ? 6 : 4, height: tier === 1 ? 6 : 4, borderRadius: "50%", background: tier === 1 ? "rgba(100,180,255,0.8)" : "rgba(159,180,193,0.4)" }} />
                  <span style={{ fontFamily: "sans-serif", fontSize: tier === 1 ? 11 : 10, fontWeight: 700, letterSpacing: "0.08em", color: tier === 1 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>{city}</span>
                </div>
              ))}
            </div>
          </div>
        </Scene>

        <div className="divider" />

        {/* ??????????????????????????????????????
            SCENE 6 — BROKERAGES
        ?????????????????????????????????????? */}
        <Scene id="brokerages" style={{ background: "#070F1E", padding: "80px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)" }}>
            <SlideReveal direction="up">
              <p className="scene-label">Required Partners</p>
              <KineticText as="h2" className="scene-h2" style={{ maxWidth: 600, marginBottom: "1rem" }}>Approved Brokerages</KineticText>
              <p className="scene-p" style={{ maxWidth: 500, marginBottom: "1.5rem" }}>To invest with KCG, you must hold a live account with one of our approved brokerage partners.</p>
            </SlideReveal>

            <div style={{ background: "rgba(255,200,50,0.05)", border: "1px solid rgba(255,200,50,0.15)", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
              <p style={{ fontFamily: "sans-serif", fontSize: "0.875rem", color: "rgba(255,200,100,0.8)", margin: 0 }}>⚠️ All KCG funds are deployed exclusively through these verified platforms. A live account is required before investing.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 16 }}>
              {[
                { name: "TMGM", abbr: "TM", desc: "Global multi-asset broker with deep liquidity and fast execution. Used for Fund 1 and Fund 1a.", href: "https://www.tmgm.com?r_code=IB1750127193A&expiry_date=Nw==" },
                { name: "MultiBank Group", abbr: "MB", desc: "One of the world's largest financial derivatives providers. Used across multiple KCG funds.", href: "https://tradfi.multibankgroup.com/en/account/live-account?ibNum=8836606" },
                { name: "Genesis FX", abbr: "GF", desc: "Emerging brokerage with competitive spreads and institutional infrastructure.", href: "https://dashboard.genesisfxmarkets.com/auth/register?ref=GFXBEBEF21B" },
              ].map((b, i) => (
                <SlideReveal key={b.name} direction="up" delay={i * 100}>
                  <a href={b.href} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", textDecoration: "none", gap: 14, height: "100%" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", flexShrink: 0 }}>{b.abbr}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>{b.name}</div>
                      <div style={{ fontFamily: "sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>{b.desc}</div>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 24px", borderRadius: 100, background: "linear-gradient(135deg,#00a855,#006b35)", border: "1px solid rgba(0,232,120,0.3)", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", width: "100%", transition: "all 0.2s ease", boxShadow: "0 4px 16px rgba(0,168,85,0.25)" }}>Open Account →</div>
                  </a>
                </SlideReveal>
              ))}
            </div>
          </div>
        </Scene>

        <div className="divider" />

        {/* ??????????????????????????????????????
            SCENE 6b — WHY KCG + ACTIVITY
        ?????????????????????????????????????? */}
        <Scene style={{ background: "#070F1E", padding: "80px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: 40, alignItems: "start" }}>
              <SlideReveal direction="left">
                <p className="scene-label">Why KCG</p>
                <h2 className="scene-h2" style={{ marginBottom: "2rem" }}>Built for credibility. Built for results.</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { icon: "🏛️", title: "Institutional Structure", desc: "Every fund has defined strategy, verified brokerage, and transparent reporting." },
                    { icon: "⚡", title: "Disciplined Execution", desc: "Algorithmic and manual strategies with strict risk management protocols." },
                    { icon: "🌐", title: "Global Brokerage Access", desc: "TMGM, MultiBank, TradeSmart — regulated partners with deep liquidity." },
                    { icon: "📊", title: "Verified Performance", desc: "Third-party tracking through Myfxbook, FX Blue, and brokerage ratings." },
                  ].map((item) => (
                    <div key={item.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontFamily: "sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>{item.title}</div>
                        <div style={{ fontFamily: "sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </SlideReveal>
              <SlideReveal direction="right">
                <p className="scene-label">Live Trading Activity</p>
                <h2 className="scene-h2" style={{ marginBottom: "2rem" }}>Recent executions.</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { action: "BUY", pair: "XAUUSD", fund: "Fund 1 · TMGM", lots: "0.10 lots", result: "+12.4 pips", time: "2m ago", win: true },
                    { action: "SELL", pair: "EURUSD", fund: "MAMALYN · MultiBank", lots: "0.05 lots", result: "+8.1 pips", time: "18m ago", win: true },
                    { action: "BUY", pair: "BTCUSD", fund: "VaultKano · MultiBank", lots: "0.01 lots", result: "+2.7%", time: "1h ago", win: true },
                    { action: "SELL", pair: "XAUUSD", fund: "Alpha Fund · TMGM", lots: "0.08 lots", result: "-3.2 pips", time: "3h ago", win: false },
                    { action: "BUY", pair: "EURUSD", fund: "MAMALYN · MultiBank", lots: "0.05 lots", result: "+11.0 pips", time: "5h ago", win: true },
                  ].map((t, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: t.win ? "rgba(0,232,120,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${t.win ? "rgba(0,232,120,0.2)" : "rgba(248,113,113,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 9, fontWeight: 800, color: t.win ? "#00E87A" : "#F87171", letterSpacing: "0.05em" }}>{t.action}</div>
                        <div>
                          <div style={{ fontFamily: "sans-serif", fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>{t.pair} · {t.lots}</div>
                          <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{t.fund}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "sans-serif", fontSize: "0.875rem", fontWeight: 700, color: t.win ? "#00E87A" : "#F87171" }}>{t.result}</div>
                        <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{t.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/performance" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(159,180,193,0.6)", textDecoration: "none" }}>View full performance dashboard →</a>
              </SlideReveal>
            </div>
          </div>
        </Scene>

        <div className="divider" />

        {/* ??????????????????????????????????????
            SCENE 7 — COMMUNITY
        ?????????????????????????????????????? */}
        <Scene id="community" style={{ position: "relative", background: "#050810", padding: "80px 0", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "60vw", height: "60vw", maxWidth: 600, maxHeight: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(50,100,180,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)", position: "relative", zIndex: 1 }}>
            <SlideReveal direction="up" style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p className="scene-label" style={{ justifyContent: "center" }}>Join the Network</p>
              <KineticText as="h2" className="scene-h2" style={{ textAlign: "center", marginBottom: "1rem" }}>Don't invest alone.</KineticText>
              <p className="scene-p" style={{ textAlign: "center", maxWidth: 480, margin: "0 auto 2rem" }}>Join the KCG community for live signals, market updates, fund news, and direct access to the team — completely free.</p>
            </SlideReveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 16, maxWidth: 600, margin: "0 auto" }}>
              <SlideReveal direction="left">
                <a href="https://t.me/KaizenCapitalGroup" target="_blank" rel="noopener noreferrer" className="glass-card" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textDecoration: "none" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(35,158,217,0.15)", border: "1px solid rgba(35,158,217,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✈️</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "sans-serif", fontWeight: 700, color: "#fff", fontSize: "1rem", marginBottom: 4 }}>Telegram</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>Live signals and market updates</div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "9px 24px", borderRadius: 100, background: "rgba(35,158,217,0.15)", border: "1px solid rgba(35,158,217,0.3)", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(100,190,240,0.9)", textDecoration: "none", width: "100%" }}>Join Channel →</span>
                </a>
              </SlideReveal>

              <SlideReveal direction="right" delay={150}>
                <a href="https://discord.gg/rJWSD6dhWm" target="_blank" rel="noopener noreferrer" className="glass-card" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textDecoration: "none" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(88,101,242,0.15)", border: "1px solid rgba(88,101,242,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎮</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "sans-serif", fontWeight: 700, color: "#fff", fontSize: "1rem", marginBottom: 4 }}>Discord</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>Community discussions and access</div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "9px 24px", borderRadius: 100, background: "rgba(88,101,242,0.15)", border: "1px solid rgba(88,101,242,0.3)", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(140,150,255,0.9)", textDecoration: "none", width: "100%" }}>Join Server →</span>
                </a>
              </SlideReveal>
            </div>
          </div>
        </Scene>

        <div className="divider" />

        {/* ??????????????????????????????????????
            SCENE 8 — CONTACT / CTA
        ?????????????????????????????????????? */}
        <Scene id="contact" style={{ background: "#070F1E", padding: "80px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: 40, alignItems: "start" }}>
              <SlideReveal direction="left">
                <p className="scene-label">Start a Conversation</p>
                <KineticText as="h2" className="scene-h2" style={{ marginBottom: "1rem" }}>
                  Book a call or message directly.
                </KineticText>
                <p className="scene-p" style={{ marginBottom: "2rem" }}>KCG is selective with who we work with. If you're serious about capital allocation, let's talk.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { href: "mailto:support@kaizencapitalgrp.com", label: "Email", value: "support@kaizencapitalgrp.com" },
                    { href: "https://t.me/trellz_P", label: "Telegram", value: "@trellz_P" },
                    { href: "https://calendly.com/trellzp12/30min", label: "Book a Call", value: "calendly.com/trellzp12/30min" },
                  ].map(c => (
                    <a key={c.label} href={c.href} target={c.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
                      className="glass-card" style={{ padding: "16px 20px", textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)" }}>{c.label}</span>
                      <span style={{ fontFamily: "sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{c.value}</span>
                    </a>
                  ))}
                </div>

                <a href="https://t.me/trellz_P" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, padding: "12px 28px", borderRadius: 100, background: "#fff", color: "#050810", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "all 0.2s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,255,255,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  ✈ Message on Telegram
                </a>
              </SlideReveal>

              <SlideReveal direction="right" id="contact-form">
                <div className="glass-card" style={{ padding: 32 }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)", marginBottom: 20 }}>Schedule a 30-Minute Call</p>
                  <CalendlyWidget />
                </div>
              </SlideReveal>
            </div>
          </div>
        </Scene>

        <div className="divider" />

        {/* ??????????????????????????????????????
            SCENE 9 — FINAL CTA
        ?????????????????????????????????????? */}
        <Scene style={{ position: "relative", background: "#050810", padding: "120px 0", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,60,120,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)", textAlign: "center", position: "relative", zIndex: 1 }}>
            <SlideReveal direction="up">
              <p className="scene-label" style={{ justifyContent: "center" }}>The Opportunity</p>
              <h2 style={{ fontFamily: "sans-serif", fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#fff", margin: "0 0 1.5rem" }}>
                The future of capital<br />
                <span style={{ color: "rgba(159,180,193,0.5)" }}>is being built.</span>
              </h2>
              <p className="scene-p" style={{ maxWidth: 480, margin: "0 auto 3rem", fontSize: "1.05rem" }}>KCG is building an institutional platform for the next generation of capital allocation. The question is whether you're part of it.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", padding: "0 1rem" }}>
                <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" style={{ padding: "16px 36px", borderRadius: 100, background: "#fff", color: "#050810", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "all 0.3s ease", display: "inline-flex", alignItems: "center", gap: 6 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06) translateY(-2px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(255,255,255,0.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  Start the Conversation ↗
                </a>
                <a href="#funds" style={{ padding: "16px 36px", borderRadius: 100, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.75)", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.3s ease", display: "inline-flex", alignItems: "center", backdropFilter: "blur(8px)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}>
                  View Funds →
                </a>
              </div>
            </SlideReveal>
          </div>
        </Scene>

        {/* ??????????????????????????????????????
            FOOTER
        ?????????????????????????????????????? */}
        <footer style={{ background: "#050810", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3rem)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#9FB4C1,#0C1A30,#C9D8E2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff", fontFamily: "sans-serif" }}>KCG</div>
              <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)" }}>KAIZEN CAPITAL GROUP</span>
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
              {[{ href: "/privacy", label: "Privacy Policy" }, { href: "/disclaimer", label: "Risk Disclaimer" }, { href: "/about", label: "About" }, { href: "/insights", label: "Insights" }].map(l => (
                <a key={l.href} href={l.href} style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.2s ease" }}
                  onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>
                  {l.label}
                </a>
              ))}
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.18)", margin: 0 }}>© {new Date().getFullYear()} Kaizen Capital Group</p>
          </div>
        </footer>

        {/* Tawk.to */}
        <script dangerouslySetInnerHTML={{ __html: `var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/6a18f4c2c95c7a1c33ced5d5/1jpono5pb';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0)})();` }} />
      </div>
    </>
  );
}
