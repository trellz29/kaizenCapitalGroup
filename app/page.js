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
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id || undefined}
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {children}
    </section>
  );
}

function FundCard({ category, name, focus, strategy, managers, brokerage, extra }) {
  return (
    <div className="rounded-3xl border border-white/50 bg-white/70 p-8 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">
        {category}
      </p>
      <h3 className="text-2xl font-bold text-[#0F1A28]">{name}</h3>
      <div className="mt-4 space-y-2 text-sm text-[#2E4358]">
        <p><span className="font-semibold text-[#0F1A28]">Focus:</span> {focus}</p>
        <p><span className="font-semibold text-[#0F1A28]">Strategy:</span> {strategy}</p>
        <p><span className="font-semibold text-[#0F1A28]">Managers:</span> {managers}</p>
        <p><span className="font-semibold text-[#0F1A28]">Brokerage:</span> {brokerage}</p>
        {extra && (
          <p><span className="font-semibold text-[#0F1A28]">Notes:</span> {extra}</p>
        )}
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
      `KCG Website Inquiry from ${formData.name}`
    );

    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );

    window.location.href = `mailto:cottrell@kaizencapitalgrp.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-[#E6EEF2] text-[#0F1A28]">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/40 bg-[#E6EEF2]/80 backdrop-blur-xl"
          : "bg-white/30 backdrop-blur-md"
      }`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#2E4358]">
            Kaizen Capital Group
          </span>

          <div className="hidden md:flex gap-8 text-sm text-[#2E4358]">
            <a href="#home">Home</a>
            <a href="#funds">Funds</a>
            <a href="#contact-form">Contact</a>
          </div>

          <a href="#contact-form" className="bg-[#0F1A28] text-white px-5 py-2 rounded-full">
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <FadeInSection id="home" className="px-6 pt-32 pb-20">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-gradient-to-br from-white/70 via-[#C9D8E2]/70 to-[#9FB4C1]/70 p-12">
          <h1 className="text-5xl md:text-7xl font-bold">
            Disciplined capital strategy.
          </h1>

          <div className="mt-12 grid md:grid-cols-4 gap-4">
            <div className="p-5 bg-white/50 rounded-xl">Funds Active<br/><b>12</b></div>
            <div className="p-5 bg-white/50 rounded-xl">Active Users<br/><b>4</b></div>
            <div className="p-5 bg-white/50 rounded-xl">Avg Return<br/><b>9.2%</b></div>
            <div className="p-5 bg-white/50 rounded-xl">Volume<br/><b>$847M</b></div>
          </div>
        </div>
      </FadeInSection>

      {/* FUNDS */}
      <FadeInSection id="funds" className="px-6 py-24">
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-3">

          <FundCard category="Fund 01" name="Trellz Gold Trading Fund" focus="Gold" strategy="Scalping" managers="1" brokerage="MultiBank"/>
          <FundCard category="Fund 02" name="TradeXMarkets Fund" focus="Gold/Oil" strategy="Hybrid" managers="2" brokerage="MultiBank"/>
          <FundCard category="Fund 03" name="VaultKano Fund" focus="BTC & Gold" strategy="Hybrid" managers="2" brokerage="MultiBank"/>
          <FundCard category="Fund 04" name="Forex Profit Snipers Fund" focus="Forex/Gold" strategy="Scalping + Swing" managers="2" brokerage="TradeSmart"/>
          <FundCard category="Fund 05" name="Trellz + Phoenix" focus="Gold/FX" strategy="TBD" managers="2" brokerage="MultiBank"/>
          <FundCard category="Fund 06" name="Phoenix" focus="Forex" strategy="Automated" managers="1" brokerage="MultiBank"/>
          <FundCard category="Fund 07" name="Forex Fortune Fund" focus="EURUSD" strategy="Automated" managers="1" brokerage="MultiBank"/>
          <FundCard category="Fund 09" name="Algo Amalgamation Fund" focus="Multi-Asset" strategy="Fully Algorithmic" managers="Bots" brokerage="MultiBank / TMGM"/>
          <FundCard category="Fund 10" name="PfaneTXau Fund" focus="CFDs" strategy="Swarm" managers="1-2" brokerage="TBD"/>
          <FundCard category="Fund 11" name="MAMALYN Fund" focus="EUR/USD" strategy="Fully algorithmic trading" managers="1" brokerage="MultiBank"/>
          <FundCard category="Fund 12" name="A&M Fund" focus="Gold" strategy="Manual" managers="1" brokerage="MultiBank"/>
        </div>
      </FadeInSection>

      {/* CONTACT */}
      <FadeInSection id="contact-form" className="px-6 pb-24">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-3 rounded"/>
            <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 rounded"/>
            <textarea name="message" placeholder="Message" onChange={handleChange} className="w-full p-3 rounded"/>
            <button className="w-full bg-black text-white p-3 rounded">Submit</button>
          </form>
        </div>
      </FadeInSection>

    </main>
  );
}