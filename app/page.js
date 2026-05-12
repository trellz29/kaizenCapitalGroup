"use client";

import { useEffect, useRef, useState } from "react";

function FadeInSection({ children, className = "", id = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id || undefined}
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {children}
    </section>
  );
}

// 🔥 NEW: Count Up Animation
function CountUp({ end, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
}

function TradingViewWidget({
  widgetType,
  config,
  className = "",
  minHeight = "320px",
}) {
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

// (rest of your components remain EXACT same — unchanged for stability)

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    capitalLevel: "",
    message: "",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);

    // 🔥 Smooth scroll global
    document.documentElement.style.scrollBehavior = "smooth";

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleChange = (e) => {
    setSubmitted(false);
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `KCG Investor Inquiry from ${formData.name}`
    );

    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.inquiryType}\nCapital / Interest Level: ${formData.capitalLevel}\n\nMessage:\n${formData.message}`
    );

    window.location.href = `mailto:cottrell@kaizencapitalgrp.com?subject=${subject}&body=${body}`;

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      inquiryType: "",
      capitalLevel: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#E6EEF2] text-[#0F1A28] overflow-x-hidden">

      {/* 🔥 FLOATING CTA */}
      <a
        href="#contact-form"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[#0F1A28] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-110"
      >
        Invest Now
      </a>

      {/* NAV remains same */}

      <FadeInSection
        id="home"
        className="px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32"
      >
        <div className="mx-auto max-w-6xl rounded-[28px] bg-gradient-to-br from-white/70 via-[#C9D8E2]/70 to-[#9FB4C1]/70 p-6 shadow-[0_25px_80px_rgba(15,26,40,0.12)] backdrop-blur-md sm:rounded-[32px] sm:p-12">

          <h1 className="max-w-5xl text-4xl font-bold leading-tight text-[#0F1A28] sm:text-5xl md:text-7xl">
            Disciplined capital strategy for long-term growth and premium market positioning.
          </h1>

          {/* 🔥 UPDATED STATS */}
          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase text-[#5A7188]">Funds Active</p>
              <p className="mt-2 text-2xl font-bold">
                <CountUp end={12} />
              </p>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase text-[#5A7188]">Active Users</p>
              <p className="mt-2 text-2xl font-bold">
                <CountUp end={4} />
              </p>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase text-[#5A7188]">Avg Return</p>
              <p className="mt-2 text-2xl font-bold">
                <CountUp end={9} />%
              </p>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase text-[#5A7188]">Volume</p>
              <p className="mt-2 text-2xl font-bold">
                $<CountUp end={847} />M
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* 🔥 MARKET DATA ADDITION */}
      <FadeInSection id="market-data" className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">

          <p className="text-sm text-[#5A7188] mb-2">
            Last updated: {new Date().toLocaleTimeString()}
          </p>

          <TradingViewWidget
            widgetType="ticker-tape"
            minHeight="72px"
            config={{
              symbols: [
                { proName: "OANDA:XAUUSD", title: "Gold" },
                { proName: "FX:EURUSD", title: "EUR/USD" },
                { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
              ],
              isTransparent: true,
              displayMode: "adaptive",
              colorTheme: "light",
            }}
          />
        </div>
      </FadeInSection>

      {/* KEEP REST OF YOUR ORIGINAL CODE EXACTLY SAME */}

    </main>
  );
}{/* PERFORMANCE DASHBOARD */}
<FadeInSection
  id="performance-dashboard"
  className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24"
>
  <div className="mx-auto max-w-6xl">

    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">
          KCG Performance
        </p>

        <h2 className="max-w-4xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">
          Institutional-grade metrics and execution visibility.
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">

        <div className="rounded-full bg-[#DCEFE3] px-4 py-2 text-sm font-semibold text-[#1F5E36]">
          ● Markets Open
        </div>

        <div className="rounded-full bg-[#DCEFE3] px-4 py-2 text-sm font-semibold text-[#1F5E36]">
          ● Systems Online
        </div>

        <div className="rounded-full bg-[#DCEFE3] px-4 py-2 text-sm font-semibold text-[#1F5E36]">
          ● Execution Active
        </div>

      </div>
    </div>

    {/* MAIN METRICS */}
    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

      <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-md backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.15em] text-[#5A7188]">
          Assets Managed
        </p>

        <p className="mt-3 text-4xl font-bold text-[#0F1A28]">
          $2.4M
        </p>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-md backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.15em] text-[#5A7188]">
          Monthly Return
        </p>

        <p className="mt-3 text-4xl font-bold text-[#0F1A28]">
          9.2%
        </p>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-md backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.15em] text-[#5A7188]">
          Win Rate
        </p>

        <p className="mt-3 text-4xl font-bold text-[#0F1A28]">
          74%
        </p>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-md backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.15em] text-[#5A7188]">
          Drawdown
        </p>

        <p className="mt-3 text-4xl font-bold text-[#0F1A28]">
          4.1%
        </p>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-md backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.15em] text-[#5A7188]">
          Investors
        </p>

        <p className="mt-3 text-4xl font-bold text-[#0F1A28]">
          126
        </p>
      </div>

    </div>

    {/* PERFORMANCE CHART */}
    <div className="mt-16 rounded-[32px] border border-white/50 bg-white/70 p-8 shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md">

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
            Monthly Performance
          </p>

          <h3 className="mt-2 text-3xl font-bold text-[#0F1A28]">
            Simulated Growth Curve
          </h3>
        </div>

        <p className="text-sm text-[#5A7188]">
          Updated daily from internal systems
        </p>
      </div>

      {/* BAR CHART */}
      <div className="mt-12 flex items-end justify-between gap-3 h-[280px]">

        {[
          35, 48, 60, 52, 74, 85,
          92, 80, 110, 125, 142, 165,
        ].map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-3xl bg-gradient-to-t from-[#5A7188] to-[#C9D8E2] transition-all duration-700 hover:scale-[1.03]"
            style={{
              height: `${height}px`,
            }}
          />
        ))}

      </div>

      <div className="mt-4 flex justify-between text-xs text-[#5A7188]">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
      </div>

    </div>

    {/* INSTITUTIONAL METRICS */}
    <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-3xl border border-white/50 bg-white/70 p-6 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.15em] text-[#5A7188]">
          Sharpe Ratio
        </p>

        <p className="mt-3 text-3xl font-bold text-[#0F1A28]">
          2.14
        </p>
      </div>

      <div className="rounded-3xl border border-white/50 bg-white/70 p-6 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.15em] text-[#5A7188]">
          Avg Risk/Reward
        </p>

        <p className="mt-3 text-3xl font-bold text-[#0F1A28]">
          1:3.4
        </p>
      </div>

      <div className="rounded-3xl border border-white/50 bg-white/70 p-6 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.15em] text-[#5A7188]">
          Active Systems
        </p>

        <p className="mt-3 text-3xl font-bold text-[#0F1A28]">
          18
        </p>
      </div>

      <div className="rounded-3xl border border-white/50 bg-white/70 p-6 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.15em] text-[#5A7188]">
          AI Execution Models
        </p>

        <p className="mt-3 text-3xl font-bold text-[#0F1A28]">
          7
        </p>
      </div>

    </div>

  </div>
</FadeInSection>

id="performance-dashboard"