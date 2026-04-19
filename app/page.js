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

function FundCard({
  label,
  name,
  focus,
  strategy,
  managers,
  brokerage,
  status,
  extra,
  primaryLink,
  secondaryLinks = [],
}) {
  const statusLower = status.toLowerCase();

  const statusClass =
    statusLower === "live"
      ? "bg-[#DCEFE3] text-[#1F5E36] border border-[#B8D8C4]"
      : statusLower === "re-launching"
      ? "bg-[#EEF2F7] text-[#35506A] border border-[#D3DDE8]"
      : statusLower === "discontinuation"
      ? "bg-[#F3E4E4] text-[#7A2F2F] border border-[#E5C6C6]"
      : statusLower === "disconnected"
      ? "bg-[#F3E4E4] text-[#7A2F2F] border border-[#E5C6C6]"
      : "bg-[#E8EEF3] text-[#5A7188] border border-[#D3DDE8]";

  const accentClass =
    statusLower === "live"
      ? "from-[#A9C2D1] via-[#DCE7EE] to-[#C7D9E4]"
      : "from-[#DCE7EE] via-[#C9D8E2] to-[#B4C7D4]";

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-5 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(15,26,40,0.12)] sm:p-6 lg:p-8">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentClass}`}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5A7188] sm:text-xs">
            {label}
          </p>

          <h3 className="break-words text-xl font-bold leading-tight text-[#0F1A28] sm:text-2xl">
            {name}
          </h3>
        </div>

        <span
          className={`w-fit shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs ${statusClass}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm leading-6 text-[#2E4358]">
        <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3">
          <span className="font-semibold text-[#0F1A28]">Focus:</span> {focus}
        </div>

        <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3">
          <span className="font-semibold text-[#0F1A28]">Strategy:</span>{" "}
          {strategy}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3">
            <span className="font-semibold text-[#0F1A28]">Managers:</span>{" "}
            {managers}
          </div>

          <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3">
            <span className="font-semibold text-[#0F1A28]">Brokerage:</span>{" "}
            {brokerage}
          </div>
        </div>

        {extra ? (
          <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3">
            <span className="font-semibold text-[#0F1A28]">Notes:</span> {extra}
          </div>
        ) : null}
      </div>

      {(primaryLink || secondaryLinks.length > 0) && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {primaryLink ? (
            <a
              href={primaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#0F1A28] px-5 py-2 text-center text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]"
            >
              Get Started
            </a>
          ) : null}

          {secondaryLinks.map((link, index) => (
            <a
              key={`${name}-${index}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#2E4358] bg-white/60 px-5 py-2 text-center text-sm font-semibold text-[#0F1A28] transition hover:scale-105 hover:bg-[#EDF4F8]"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function FunnelCard({ title, description, points, cta }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(15,26,40,0.12)] sm:p-8">
      <h3 className="text-2xl font-bold text-[#0F1A28]">{title}</h3>

      <p className="mt-4 text-sm leading-7 text-[#2E4358]">{description}</p>

      <div className="mt-6 space-y-3">
        {points.map((point, idx) => (
          <div
            key={`${title}-${idx}`}
            className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3 text-sm text-[#2E4358]"
          >
            {point}
          </div>
        ))}
      </div>

      <a
        href="#contact-form"
        className="mt-6 inline-block rounded-full bg-[#0F1A28] px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]"
      >
        {cta}
      </a>
    </div>
  );
}

function QualificationCard({ title, subtitle, bullets }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(15,26,40,0.10)]">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
        Best Fit
      </p>

      <h3 className="mt-2 text-xl font-bold text-[#0F1A28]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-[#2E4358]">{subtitle}</p>

      <div className="mt-5 space-y-3">
        {bullets.map((bullet, idx) => (
          <div
            key={`${title}-${idx}`}
            className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3 text-sm text-[#2E4358]"
          >
            {bullet}
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/40 bg-[#E6EEF2]/90 shadow-[0_8px_30px_rgba(15,26,40,0.08)] backdrop-blur-xl"
            : "border-b border-white/20 bg-white/40 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <span className="min-w-0 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2E4358] sm:text-xs md:text-sm md:tracking-[0.2em]">
            Kaizen Capital Group
          </span>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2E4358]">
            <a href="#home" className="hover:opacity-70">
              Home
            </a>

            <a href="#overview" className="hover:opacity-70">
              Overview
            </a>

            <a href="#market-data" className="hover:opacity-70">
              Market Data
            </a>

            <a href="#funds" className="hover:opacity-70">
              Funds
            </a>

            <a href="#investor-funnel" className="hover:opacity-70">
              Investors
            </a>

            <a href="#activity" className="hover:opacity-70">
              Activity
            </a>

            <a href="#why-kcg" className="hover:opacity-70">
              Why KCG
            </a>

            <a href="#contact-form" className="hover:opacity-70">
              Contact
            </a>
          </div>

          <a
            href="#contact-form"
            className="shrink-0 rounded-full bg-[#0F1A28] px-4 py-2 text-xs font-semibold text-white transition hover:scale-105 sm:px-5 sm:text-sm"
          >
            Get Started
          </a>
        </div>
      </nav>

      <FadeInSection
        id="home"
        className="px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32"
      >
        <div className="mx-auto max-w-6xl rounded-[28px] bg-gradient-to-br from-white/70 via-[#C9D8E2]/70 to-[#9FB4C1]/70 p-6 shadow-[0_25px_80px_rgba(15,26,40,0.12)] backdrop-blur-md sm:rounded-[32px] sm:p-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#2E4358] sm:text-sm sm:tracking-[0.2em]">
            Kaizen Capital Group
          </p>

          <h1 className="max-w-5xl text-4xl font-bold leading-tight text-[#0F1A28] sm:text-5xl md:text-7xl">
            Disciplined capital strategy for long-term growth and premium market
            positioning.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-[#2E4358] sm:mt-6 sm:text-lg">
            Kaizen Capital Group is built to present a refined, institutional
            brand image centered on structure, credibility, execution, and
            strategic growth.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <a
              href="#contact-form"
              className="rounded-full bg-[#0F1A28] px-8 py-4 text-center font-semibold text-white transition hover:scale-105"
            >
              Start the Conversation
            </a>

            <a
              href="#funds"
              className="rounded-full border border-[#2E4358] px-8 py-4 text-center font-semibold text-[#0F1A28] transition hover:scale-105"
            >
              View Funds
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
                Funds Active
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F1A28]">12</p>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
                Active Users
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F1A28]">4</p>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
                Avg Monthly Return
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F1A28]">9.2%</p>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
                Total Volume
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F1A28]">$847.2M</p>
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection id="overview" className="px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 md:gap-8">
          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 sm:p-8">
            <h3 className="mb-3 text-xl font-semibold text-[#0F1A28]">
              Strategic Positioning
            </h3>

            <p className="text-[#2E4358]">
              KCG is designed to communicate a premium, disciplined identity for
              partners, clients, and capital relationships.
            </p>
          </div>

          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 sm:p-8">
            <h3 className="mb-3 text-xl font-semibold text-[#0F1A28]">
              Growth Framework
            </h3>

            <p className="text-[#2E4358]">
              We focus on long-term brand strength, structured presentation, and
              consistent execution across all touchpoints.
            </p>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection
        id="market-data"
        className="px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">
            Live Market Data
          </p>

          <h2 className="mb-6 text-4xl font-bold text-[#0F1A28] md:text-5xl">
            Real-time market visibility for the instruments KCG watches most.
          </h2>

          <p className="mb-10 max-w-3xl text-lg text-[#2E4358]">
            This section adds live market widgets for gold, EUR/USD, Bitcoin,
            DXY, and oil so the site feels more active, current, and
            institutional.
          </p>

          <div className="mb-6">
            <TradingViewWidget
              widgetType="ticker-tape"
              minHeight="72px"
              config={{
                symbols: [
                  { proName: "OANDA:XAUUSD", title: "Gold" },
                  { proName: "FX:EURUSD", title: "EUR/USD" },
                  { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
                  { proName: "TVC:DXY", title: "DXY" },
                  { proName: "TVC:USOIL", title: "Oil" },
                ],
                showSymbolLogo: true,
                isTransparent: true,
                displayMode: "adaptive",
                colorTheme: "light",
                locale: "en",
              }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <TradingViewWidget
              widgetType="symbol-overview"
              minHeight="420px"
              config={{
                symbols: [["OANDA:XAUUSD|1D"]],
                chartOnly: false,
                width: "100%",
                height: "100%",
                locale: "en",
                colorTheme: "light",
                autosize: true,
                showVolume: false,
                showMA: false,
                hideDateRanges: false,
                hideMarketStatus: false,
                hideSymbolLogo: false,
                scalePosition: "right",
                scaleMode: "Normal",
                fontFamily: "Arial, sans-serif",
                fontSize: "12",
                noTimeScale: false,
                valuesTracking: "1",
                changeMode: "price-and-percent",
                chartType: "area",
                lineWidth: 2,
                lineColor: "#0F1A28",
                topColor: "rgba(143,168,184,0.45)",
                bottomColor: "rgba(143,168,184,0.08)",
                dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W"],
              }}
            />

            <TradingViewWidget
              widgetType="symbol-overview"
              minHeight="420px"
              config={{
                symbols: [["FX:EURUSD|1D"]],
                chartOnly: false,
                width: "100%",
                height: "100%",
                locale: "en",
                colorTheme: "light",
                autosize: true,
                showVolume: false,
                showMA: false,
                hideDateRanges: false,
                hideMarketStatus: false,
                hideSymbolLogo: false,
                scalePosition: "right",
                scaleMode: "Normal",
                fontFamily: "Arial, sans-serif",
                fontSize: "12",
                noTimeScale: false,
                valuesTracking: "1",
                changeMode: "price-and-percent",
                chartType: "area",
                lineWidth: 2,
                lineColor: "#2E4358",
                topColor: "rgba(201,216,226,0.45)",
                bottomColor: "rgba(201,216,226,0.08)",
                dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W"],
              }}
            />

            <TradingViewWidget
              widgetType="symbol-overview"
              minHeight="420px"
              config={{
                symbols: [["BITSTAMP:BTCUSD|1D"]],
                chartOnly: false,
                width: "100%",
                height: "100%",
                locale: "en",
                colorTheme: "light",
                autosize: true,
                showVolume: false,
                showMA: false,
                hideDateRanges: false,
                hideMarketStatus: false,
                hideSymbolLogo: false,
                scalePosition: "right",
                scaleMode: "Normal",
                fontFamily: "Arial, sans-serif",
                fontSize: "12",
                noTimeScale: false,
                valuesTracking: "1",
                changeMode: "price-and-percent",
                chartType: "area",
                lineWidth: 2,
                lineColor: "#5A7188",
                topColor: "rgba(220,231,238,0.55)",
                bottomColor: "rgba(220,231,238,0.12)",
                dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W"],
              }}
            />
          </div>
        </div>
      </FadeInSection>

      <FadeInSection
        id="funds"
        className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">
                KCG Multiplied Funds
              </p>

              <h2 className="text-4xl font-bold text-[#0F1A28] md:text-5xl">
                Live funds, developing systems, and structured strategies across
                KCG.
              </h2>
            </div>

            <div className="rounded-2xl border border-white/50 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
                Premium Section
              </p>

              <p className="mt-1 text-sm text-[#2E4358]">
                Refined for stronger investor presentation.
              </p>
            </div>
          </div>

          <p className="mb-12 max-w-3xl text-lg text-[#2E4358]">
            Explore KCG’s live offerings and developing fund structures. Live
            funds include direct access links where available.
          </p>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <FundCard
              label="Fund 1"
              name="KaizenCapitalGroup.Xau-TMGM"
              focus="Gold trading"
              strategy="Gold Scalping & Intra-day"
              managers="1"
              brokerage="TMGM"
              status="Live"
              primaryLink="https://signal.tmc2lnbmfs.com/portal/registration/subscription/94720/KCG-TMGM"
              secondaryLinks={[
                {
                  label: "Ratings",
                  url: "https://ratings.tmgmplatform.com/widgets/shared/5173e304d7494051b27287f70426a327?lang=en%3Fpreview%3DP3U9ODIxMzA2JmE9MTM0NjMmcD0xMzgzNCZ3PTEmcz01MTczZTMwNGQ3NDk0MDUxYjI3Mjg3ZjcwNDI2YTMyNw%3D%3D",
                },
              ]}
            />

            <FundCard
              label="Fund 1a"
              name="KaizenCapitalGroup.Xau-MB"
              focus="Gold trading"
              strategy="Gold Scalping & Intra-day"
              managers="1"
              brokerage="MultiBank"
              status="Live"
              primaryLink="https://social.mexatlantic.com/portal/registration/subscription/89528/KCG30"
            />

            <FundCard
              label="Fund 2"
              name="TradeXMarkets Fund"
              focus="Gold & potentially Oil"
              strategy="Gold Trading & automated trading mix"
              managers="1"
              brokerage="MultiBank"
              status="N/A"
            />

            <FundCard
              label="Fund 3"
              name="VaultKano Fund"
              focus="Crypto"
              strategy="Manual & automated trading mix"
              managers="1"
              brokerage="MultiBank"
              status="Re-Launching"
            />

            <FundCard
              label="Fund 4"
              name="Exodus Investments"
              focus="Crypto & Gold"
              strategy="Scalping + Macro / Swing Trading"
              managers="2"
              brokerage="TradeSmart"
              status="N/A"
              extra="United States Included"
            />

            <FundCard
              label="Fund 5"
              name="KCG + Phoenix"
              focus="Gold & FX currencies"
              strategy="To be defined"
              managers="1"
              brokerage="MultiBank"
              status="N/A"
              extra="Speculative"
            />

            <FundCard
              label="Fund 6"
              name="Phoenix"
              focus="Forex mixed assets"
              strategy="Automated trading mix of all instruments (exact strategy to be explained)"
              managers="Potential fully automated managed fund (1)"
              brokerage="MultiBank"
              status="N/A"
            />

            <FundCard
              label="Fund 7"
              name="Forex fotune AI"
              focus="EURUSD"
              strategy="Automated trading mix of EUR instruments (exact strategy to be explained)"
              managers="1"
              brokerage="MultiBank"
              status="N/A"
            />

            <FundCard
              label="Fund 8"
              name="The Alpha Fund"
              focus="Gold trading"
              strategy="Manual trading"
              managers="2 traders"
              brokerage="TMGM"
              status="Live"
              primaryLink="https://signal.tmc2lnbmfs.com/portal/registration/subscription/67622/Alpha"
              secondaryLinks={[
                {
                  label: "Ratings",
                  url: "https://ratings.tmgmplatform.com/widgets/shared/05a7391d205e4c82982ea3141e98aee5?lang=en?preview=P3U9N2M1Y2IwJmE9MTg5ODgmcD0xOTUwMCZ3PTEmcz0wNWE3MzkxZDIwNWU0YzgyOTgyZWEzMTQxZTk4YWVlNQ==",
                },
              ]}
            />

            <FundCard
              label="Fund 9"
              name="Algo Amalgamation Fund"
              focus="Multi-asset (Gold, Forex, Crypto & others covered in Funds 1–8)"
              strategy="Fully algorithmic trading — amalgamation of strategies from Funds 1–8 into one unified system"
              managers="Mixture of algorithmic bots (no human managers)"
              brokerage="MultiBank / TradeSmart / TMGM"
              status="N/A"
            />

            <FundCard
              label="Fund 10"
              name="PfaneTXau Fund"
              focus="All CFD indices and commodities"
              strategy="Swarm"
              managers="1 (potentially 2)"
              brokerage="To be confirmed"
              status="Discontinuation"
            />

            <FundCard
              label="Fund 11"
              name="MAMALYN Fund"
              focus="EUR/USD"
              strategy="Fully algorithmic trading"
              managers="1"
              brokerage="MultiBank"
              status="Live"
              primaryLink="https://social.multibankfx.com/portal/registration/subscription/89236/mamalynMin3000dollars"
              secondaryLinks={[
                {
                  label: "FX Blue",
                  url: "https://www.fxblue.com/users/mamalyn",
                },
                {
                  label: "Myfxbook",
                  url: "https://www.myfxbook.com/members/Panevino83/mamalyn-mt4-31229860/11078849",
                },
              ]}
            />

            <FundCard
              label="Fund 12"
              name="CXFund"
              focus="Gold trading"
              strategy="Manual trading"
              managers="2 traders"
              brokerage="TMGM"
              status="Disconnected"
              primaryLink="https://signal.tmc2lnbmfs.com/portal/registration/subscription/69413/CXFund2026"
              secondaryLinks={[
                {
                  label: "Ratings",
                  url: "https://ratings.tmgmplatform.com/widgets/shared/cc306ad97ef243a5aa092cd4d0d226bb?lang=en?preview=P3U9NjJiODU0JmE9MTg3MzkmcD0xOTI0NyZ3PTEmcz1jYzMwNmFkOTdlZjI0M2E1YWEwOTJjZDRkMGQyMjZiYg==",
                },
              ]}
            />
          </div>
        </div>
      </FadeInSection>

      <FadeInSection
        id="investor-funnel"
        className="px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">
            Investor Funnel
          </p>

          <h2 className="max-w-4xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">
            Structured pathways for investors, allocators, and strategic capital
            partners.
          </h2>

          <p className="mt-6 max-w-3xl text-lg text-[#2E4358]">
            KCG is building a premium entry point for serious capital
            conversations. Choose the route that best reflects your interest,
            then move directly into the inquiry flow.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FunnelCard
              title="Private Investors"
              description="Built for individuals seeking structured exposure, disciplined execution, and premium communication."
              points={[
                "Explore current live fund opportunities",
                "Review fit based on your goals and capital profile",
                "Begin a direct conversation with KCG",
              ]}
              cta="Investor Inquiry"
            />

            <FunnelCard
              title="Fund Allocation"
              description="Designed for larger capital conversations, managed allocation discussions, and more formal fund placement interest."
              points={[
                "Discuss allocation objectives",
                "Review strategy alignment and suitable structures",
                "Position for a more advanced capital conversation",
              ]}
              cta="Discuss Allocation"
            />

            <FunnelCard
              title="Strategic Partnerships"
              description="For broker relationships, business partnerships, platform collaborations, and long-term institutional growth opportunities."
              points={[
                "Review synergy and strategic fit",
                "Explore growth, distribution, or platform alignment",
                "Open a partnership discussion with KCG",
              ]}
              cta="Partnership Inquiry"
            />
          </div>

          <div className="mt-16">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">
              Qualification Paths
            </p>

            <h3 className="max-w-3xl text-3xl font-bold leading-tight text-[#0F1A28] md:text-4xl">
              Identify your best-fit route before entering the inquiry process.
            </h3>

            <p className="mt-4 max-w-3xl text-lg text-[#2E4358]">
              These qualification cards help visitors self-select the most
              relevant path, making investor conversations cleaner and more
              intentional.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <QualificationCard
                title="Private Investor"
                subtitle="Best for individuals exploring KCG opportunities and seeking a structured introduction."
                bullets={[
                  "Looking for fund access",
                  "Interested in disciplined capital exposure",
                  "Ready to begin with an initial conversation",
                ]}
              />

              <QualificationCard
                title="Allocator / Larger Capital"
                subtitle="Built for more formal capital conversations, allocation reviews, and larger deployment interest."
                bullets={[
                  "Exploring larger allocation discussions",
                  "Reviewing structure and strategy fit",
                  "Interested in a more advanced capital dialogue",
                ]}
              />

              <QualificationCard
                title="Strategic Partner"
                subtitle="For brokers, platforms, operators, and growth partners exploring long-term alignment."
                bullets={[
                  "Interested in distribution or partnership",
                  "Exploring platform or business alignment",
                  "Looking for strategic synergies with KCG",
                ]}
              />

              <QualificationCard
                title="General Inquiry"
                subtitle="For visitors who are still learning about KCG and want to start with a broader conversation."
                bullets={[
                  "Still determining best fit",
                  "Want general information first",
                  "Need guidance on the right entry path",
                ]}
              />
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection
        id="activity"
        className="px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">
            Live Trading Activity
          </p>

          <h2 className="mb-10 text-4xl font-bold text-[#0F1A28] md:text-5xl">
            Live-style activity feed for your future execution flow.
          </h2>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm backdrop-blur-md">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[#0F1A28]">BUY XAUUSD</p>

                  <p className="text-sm text-[#5A7188]">
                    Fund: KaizenCapitalGroup.Xau-TMGM • 0.10 lots
                  </p>
                </div>

                <p className="text-sm font-semibold text-[#2E4358]">
                  +12.4 pips
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm backdrop-blur-md">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[#0F1A28]">SELL EURUSD</p>

                  <p className="text-sm text-[#5A7188]">
                    Fund: MAMALYN Fund • 0.05 lots
                  </p>
                </div>

                <p className="text-sm font-semibold text-[#2E4358]">
                  +8.1 pips
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm backdrop-blur-md">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[#0F1A28]">BUY BTCUSD</p>

                  <p className="text-sm text-[#5A7188]">
                    Fund: VaultKano Fund • 0.01 lots
                  </p>
                </div>

                <p className="text-sm font-semibold text-[#2E4358]">+2.7%</p>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection
        id="why-kcg"
        className="bg-gradient-to-br from-[#DCE7EE] via-[#C9D8E2] to-[#B4C7D4] px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">
            Why Choose KCG?
          </p>

          <h2 className="mb-12 max-w-4xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">
            A brand experience built for disciplined traders, serious clients,
            and long-term credibility.
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 sm:p-8">
              <h3 className="mb-3 text-xl font-semibold text-[#0F1A28]">
                Structured Execution
              </h3>

              <p className="text-sm text-[#2E4358]">
                Every layer of KCG is built around consistency, clarity, and
                disciplined decision-making.
              </p>
            </div>

            <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 sm:p-8">
              <h3 className="mb-3 text-xl font-semibold text-[#0F1A28]">
                Premium Positioning
              </h3>

              <p className="text-sm text-[#2E4358]">
                The presentation is designed to feel trusted, investor-facing,
                and institutionally credible.
              </p>
            </div>

            <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 sm:p-8">
              <h3 className="mb-3 text-xl font-semibold text-[#0F1A28]">
                Scalable Systems
              </h3>

              <p className="text-sm text-[#2E4358]">
                Your ecosystem can expand into funds, bots, dashboards,
                reporting, and deeper automation later.
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">
            Trusted by Traders Worldwide
          </p>

          <h2 className="mx-auto max-w-4xl text-4xl font-bold text-[#0F1A28] md:text-5xl">
            Built to support a growing global KCG presence across traders,
            clients, and capital partners.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-[#2E4358]">
            This section is ready for future testimonials, partner logos,
            member counts, and social proof as your platform grows.
          </p>
        </div>
      </FadeInSection>

      <FadeInSection id="contact" className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-white/40 bg-white/70 p-8 text-center shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md sm:rounded-[32px] sm:p-10 md:p-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">
            Investor Inquiry Flow
          </p>

          <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-6xl">
            Begin a serious conversation with Kaizen Capital Group.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#2E4358]">
            This section is structured for investors, allocators, strategic
            partners, and qualified inquiries seeking a direct KCG conversation.
          </p>

          <a
            href="#contact-form"
            className="mt-10 inline-block rounded-full bg-[#0F1A28] px-10 py-4 font-semibold text-white transition hover:scale-105"
          >
            Start Investor Inquiry
          </a>
        </div>
      </FadeInSection>

      <FadeInSection id="contact-form" className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">
              Investor Contact
            </p>

            <h2 className="max-w-xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">
              Submit your investor or partnership inquiry.
            </h2>

            <p className="mt-6 max-w-lg text-lg text-[#2E4358]">
              Use the form to identify your inquiry type, your level of capital
              interest, and the nature of your conversation. A pre-filled draft
              will open directly to your KCG business email.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="mailto:cottrell@kaizencapitalgrp.com"
                className="block rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
                  Email
                </p>

                <p className="mt-2 break-all text-sm text-[#0F1A28]">
                  cottrell@kaizencapitalgrp.com
                </p>
              </a>

              <a
                href="https://t.me/YOUR_USERNAME"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
                  Telegram
                </p>

                <p className="mt-2 text-sm text-[#0F1A28]">@YOUR_USERNAME</p>
              </a>

              <a
                href="https://calendly.com/YOUR_LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
                  Book a Call
                </p>

                <p className="mt-2 text-sm text-[#0F1A28]">
                  Schedule an investor consultation
                </p>
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/30 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md sm:rounded-[32px] sm:p-8">
            {submitted && (
              <div className="mb-5 rounded-2xl border border-[#C9D8E2] bg-[#EDF4F8] px-4 py-3 text-sm text-[#0F1A28]">
                Your investor inquiry draft was opened successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#0F1A28]"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#0F1A28]"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="inquiryType"
                  className="mb-2 block text-sm font-medium text-[#0F1A28]"
                >
                  Inquiry Type
                </label>

                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]"
                  required
                >
                  <option value="">Select inquiry type</option>
                  <option value="Private Investor">Private Investor</option>
                  <option value="Fund Allocation">Fund Allocation</option>
                  <option value="Strategic Partnership">
                    Strategic Partnership
                  </option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="capitalLevel"
                  className="mb-2 block text-sm font-medium text-[#0F1A28]"
                >
                  Capital / Interest Level
                </label>

                <select
                  id="capitalLevel"
                  name="capitalLevel"
                  value={formData.capitalLevel}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]"
                  required
                >
                  <option value="">Select level</option>
                  <option value="Exploring / Learning">
                    Exploring / Learning
                  </option>
                  <option value="Under $10,000">Under $10,000</option>
                  <option value="$10,000 - $50,000">$10,000 - $50,000</option>
                  <option value="$50,000 - $250,000">$50,000 - $250,000</option>
                  <option value="$250,000+">$250,000+</option>
                  <option value="Strategic / Non-capital partnership">
                    Strategic / Non-capital partnership
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-[#0F1A28]"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell KCG about your goals, background, allocation interest, or partnership reason..."
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#0F1A28] px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
              >
                Submit Investor Inquiry
              </button>
            </form>
          </div>
        </div>
      </FadeInSection>

      <footer className="border-t border-black/5 bg-[#DCE7EE] px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5A7188]">
              Kaizen Capital Group
            </p>

            <p className="mt-2 max-w-md text-sm text-[#2E4358]">
              Built around disciplined execution, premium positioning, and
              long-term credibility.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-[#2E4358]">
            <a href="#home" className="hover:opacity-70">
              Home
            </a>

            <a href="#overview" className="hover:opacity-70">
              Overview
            </a>

            <a href="#market-data" className="hover:opacity-70">
              Market Data
            </a>

            <a href="#funds" className="hover:opacity-70">
              Funds
            </a>

            <a href="#investor-funnel" className="hover:opacity-70">
              Investors
            </a>

            <a href="#contact-form" className="hover:opacity-70">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}