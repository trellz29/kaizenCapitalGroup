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

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

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
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#E6EEF2] text-black">
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/30 bg-[#E6EEF2]/75 shadow-[0_8px_30px_rgba(15,26,40,0.08)] backdrop-blur-xl"
            : "border-b border-white/10 bg-white/20 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-600 md:text-sm">
            Kaizen Capital Group
          </span>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="#home" className="hover:opacity-70">
              Home
            </a>
            <a href="#overview" className="hover:opacity-70">
              Overview
            </a>
            <a href="#credibility" className="hover:opacity-70">
              Credibility
            </a>
            <a href="#performance" className="hover:opacity-70">
              Performance
            </a>
            <a href="#contact" className="hover:opacity-70">
              Contact
            </a>
          </div>

          <a
            href="#contact"
            className="rounded-full bg-[#0F1A28] px-5 py-2 text-sm font-semibold text-white transition hover:scale-105"
          >
            Get Started
          </a>
        </div>
      </nav>

      <FadeInSection id="home" className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-gradient-to-br from-white/60 via-[#C9D8E2]/60 to-[#9FB4C1]/60 p-12 backdrop-blur-md">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Kaizen Capital Group
          </p>

          <h1 className="max-w-5xl text-5xl font-bold leading-tight md:text-7xl">
            Disciplined capital strategy for long-term growth and premium market
            positioning.
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-gray-700">
            Kaizen Capital Group is built to present a refined, institutional
            brand image centered on structure, credibility, execution, and
            strategic growth.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              className="rounded-full bg-[#0F1A28] px-8 py-4 text-center font-semibold text-white transition hover:scale-105"
            >
              Start the Conversation
            </a>

            <a
              href="#performance"
              className="rounded-full border border-gray-400 px-8 py-4 text-center font-semibold transition hover:scale-105"
            >
              View Performance
            </a>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Capital Focus
              </p>
              <p className="mt-2 text-2xl font-bold text-[#0F1A28]">
                Multi-Asset
              </p>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Risk Framework
              </p>
              <p className="mt-2 text-2xl font-bold text-[#0F1A28]">
                Structured
              </p>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Market Position
              </p>
              <p className="mt-2 text-2xl font-bold text-[#0F1A28]">
                Premium
              </p>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Objective
              </p>
              <p className="mt-2 text-2xl font-bold text-[#0F1A28]">
                Growth
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection id="overview" className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-white/60 p-8 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1">
            <h3 className="mb-3 text-xl font-semibold">Strategic Positioning</h3>
            <p className="text-gray-600">
              KCG is designed to communicate a premium, disciplined identity for
              partners, clients, and capital relationships.
            </p>
          </div>

          <div className="rounded-3xl bg-white/60 p-8 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1">
            <h3 className="mb-3 text-xl font-semibold">Growth Framework</h3>
            <p className="text-gray-600">
              We focus on long-term brand strength, structured presentation, and
              consistent execution across all touchpoints.
            </p>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection
        id="credibility"
        className="bg-[#0F1A28] px-6 py-24 text-white"
      >
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#AFC3D1]">
            Credibility
          </p>

          <h2 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Built to communicate trust, structure, and investor-facing strength.
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 p-8 transition duration-300 hover:-translate-y-1">
              <h3 className="mb-3 text-xl font-semibold">Institutional Tone</h3>
              <p className="text-sm text-gray-300">
                The brand and website presentation are structured to feel
                premium, disciplined, and investor-ready.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 p-8 transition duration-300 hover:-translate-y-1">
              <h3 className="mb-3 text-xl font-semibold">Clear Framework</h3>
              <p className="text-sm text-gray-300">
                Every section reinforces clarity, long-term thinking, and
                consistent execution.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 p-8 transition duration-300 hover:-translate-y-1">
              <h3 className="mb-3 text-xl font-semibold">Premium Positioning</h3>
              <p className="text-sm text-gray-300">
                The overall experience is built to support high-trust
                communication and serious market presence.
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection id="performance" className="bg-[#F3F7FA] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Performance Snapshot
          </p>

          <h2 className="mb-6 text-4xl font-bold text-[#0F1A28] md:text-5xl">
            Metrics designed to reinforce strength, discipline, and market
            credibility.
          </h2>

          <p className="mb-12 max-w-3xl text-lg text-gray-600">
            Replace these placeholders with your real numbers as your public
            reporting and investor presentation evolve.
          </p>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1">
              <p className="mb-3 text-sm uppercase tracking-[0.15em] text-gray-500">
                Target Return
              </p>
              <h3 className="text-3xl font-bold text-[#0F1A28]">5–30%</h3>
              <p className="mt-2 text-sm text-gray-500">Monthly range</p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1">
              <p className="mb-3 text-sm uppercase tracking-[0.15em] text-gray-500">
                Risk Profile
              </p>
              <h3 className="text-3xl font-bold text-[#0F1A28]">Controlled</h3>
              <p className="mt-2 text-sm text-gray-500">Structured exposure</p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1">
              <p className="mb-3 text-sm uppercase tracking-[0.15em] text-gray-500">
                Core Asset
              </p>
              <h3 className="text-3xl font-bold text-[#0F1A28]">XAUUSD</h3>
              <p className="mt-2 text-sm text-gray-500">Primary focus</p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1">
              <p className="mb-3 text-sm uppercase tracking-[0.15em] text-gray-500">
                Execution
              </p>
              <h3 className="text-3xl font-bold text-[#0F1A28]">Disciplined</h3>
              <p className="mt-2 text-sm text-gray-500">Rule-based framework</p>
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection id="contact" className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Contact
            </p>

            <h2 className="max-w-xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">
              Start the conversation with Kaizen Capital Group.
            </h2>

            <p className="mt-6 max-w-lg text-lg text-gray-600">
              The form below opens a real email draft addressed to your business
              email with the visitor’s details already filled in.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="mailto:cottrell@kaizencapitalgrp.com"
                className="block rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Email
                </p>
                <p className="mt-2 text-sm text-[#0F1A28]">
                  cottrell@kaizencapitalgrp.com
                </p>
              </a>

              <a
                href="https://t.me/YOUR_USERNAME"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
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
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Book a Call
                </p>
                <p className="mt-2 text-sm text-[#0F1A28]">
                  Schedule a consultation
                </p>
              </a>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/30 bg-white/70 p-8 shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md">
            {submitted && (
              <div className="mb-5 rounded-2xl border border-[#C9D8E2] bg-[#EDF4F8] px-4 py-3 text-sm text-[#0F1A28]">
                Your email draft was opened successfully.
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
                  placeholder="Your name"
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
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-[#0F1A28]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your goals..."
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#0F1A28] px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </FadeInSection>

      <footer className="border-t border-black/5 bg-[#E1EAF0] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
              Kaizen Capital Group
            </p>
            <p className="mt-2 max-w-md text-sm text-gray-600">
              Built around disciplined execution, premium positioning, and
              long-term credibility.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <a href="#home" className="hover:opacity-70">
              Home
            </a>
            <a href="#overview" className="hover:opacity-70">
              Overview
            </a>
            <a href="#credibility" className="hover:opacity-70">
              Credibility
            </a>
            <a href="#contact" className="hover:opacity-70">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}