"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export const metadata = {
  title: 'Contact | Kaizen Capital Group',
  description: 'Get in touch with Kaizen Capital Group. Schedule a call, submit an investor inquiry, or connect directly with the team.',
  openGraph: {
    title: 'Contact | Kaizen Capital Group',
    description: 'Get in touch with Kaizen Capital Group. Schedule a call, submit an investor inquiry, or connect directly with the team.',
    url: 'https://www.kaizencapitalgrp.com/contact',
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
  const transforms = { up: inView ? "translateY(0)" : "translateY(40px)", left: inView ? "translateX(0)" : "translateX(-40px)", right: inView ? "translateX(0)" : "translateX(40px)" };
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: transforms[direction] || transforms.up, transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
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

function CalendlyEmbed() {
  const [loaded, setLoaded] = useState(false);
  const [ref, inView] = useInView(0.1);
  useEffect(() => {
    if (!inView) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch {} };
  }, [inView]);
  return (
    <div ref={ref} className="rounded-3xl border border-white/60 bg-white/75 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md overflow-hidden">
      {!loaded && <div className="flex h-48 items-center justify-center"><div className="flex flex-col items-center gap-3"><div className="h-8 w-8 rounded-full border-2 border-[#9FB4C1] border-t-[#0F1A28] animate-spin" /><p className="text-sm text-[#5A7188]">Loading booking calendar…</p></div></div>}
      <div className="calendly-inline-widget" data-url="https://calendly.com/trellzp12/30min?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=ffffff&text_color=0F1A28&primary_color=0F1A28" style={{ minWidth: "320px", height: loaded ? "700px" : "0px", transition: "height 0.3s ease" }} />
    </div>
  );
}



export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", inquiryType: "", capitalLevel: "", message: "" });
  const handleChange = (e) => { setSubmitted(false); setFormData(p => ({ ...p, [e.target.name]: e.target.value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`KCG Investor Inquiry from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.inquiryType}\nCapital / Interest Level: ${formData.capitalLevel}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:support@kaizencapitalgrp.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setFormData({ name: "", email: "", inquiryType: "", capitalLevel: "", message: "" });
  };

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
          <div className="relative z-10 mx-auto max-w-6xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9FB4C1]/50 bg-white/50 px-4 py-1.5 backdrop-blur-sm" style={{ animation: "fadeUp 0.6s ease-out 0.1s both" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#1F5E36] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2E4358]">Get In Touch</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight text-[#0F1A28] sm:text-6xl md:text-7xl" style={{ animation: "fadeUp 0.7s ease-out 0.2s both" }}>Start a serious<br />conversation.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#2E4358]" style={{ animation: "fadeUp 0.7s ease-out 0.35s both" }}>Choose your preferred route — book a call directly, message on Telegram, or submit a formal investor inquiry below.</p>
          </div>
        </section>

        {/* QUICK CONTACT CARDS */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl grid gap-5 sm:grid-cols-3">
            {[
              { icon: "📅", label: "Book a Call", value: "calendly.com/trellzp12/30min", sub: "Schedule a 30-min investor consultation", href: "https://calendly.com/trellzp12/30min", cta: "Book Now" },
              { icon: "✈", label: "Telegram", value: "@trellz_P", sub: "Fastest way to reach KCG directly", href: "https://t.me/trellz_P", cta: "Message Now" },
              { icon: "✉", label: "Email", value: "support@kaizencapitalgrp.com", sub: "Formal inquiries and documentation", href: "mailto:support@kaizencapitalgrp.com", cta: "Send Email" },
            ].map(c => (
              <Reveal key={c.label}>
                <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(15,26,40,0.12)]">
                  <div className="mb-4 text-3xl">{c.icon}</div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5A7188]">{c.label}</p>
                  <p className="mt-1 text-sm font-bold text-[#0F1A28] break-all">{c.value}</p>
                  <p className="mt-1 text-xs text-[#9FB4C1]">{c.sub}</p>
                  <a href={c.href} target={c.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" className="mt-5 inline-block rounded-full bg-[#0F1A28] px-5 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]">{c.cta}</a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CALENDLY */}
        <section className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Reveal direction="left">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Book a Call</p>
                <h2 className="mb-4 text-3xl font-bold text-[#0F1A28] md:text-4xl">Schedule your 30-minute investor consultation.</h2>
                <p className="mb-8 text-lg text-[#2E4358]">Pick a time that works for you. All calls happen via Google Meet.</p>
                <CalendlyEmbed />
              </Reveal>
            </div>
            <div className="space-y-5">
              <Reveal direction="right">
                <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#5A7188]">What to Expect</p>
                  <div className="space-y-3">
                    {["30-minute structured conversation", "Review your investment goals", "Walk through relevant KCG funds", "Discuss capital levels and fit", "Next steps and onboarding"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-[#2E4358]"><span className="mt-0.5 text-[#1F5E36] shrink-0">✓</span>{item}</div>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal direction="right" delay={100}>
                <a href="https://t.me/trellz_P" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,26,40,0.12)]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F1A28] text-xl text-white transition group-hover:scale-110">✈</div>
                  <div><p className="font-bold text-[#0F1A28]">Message on Telegram</p><p className="text-sm text-[#5A7188]">@trellz_P — fastest response</p></div>
                </a>
              </Reveal>
              <Reveal direction="right" delay={200}>
                <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#5A7188]">Response Time</p>
                  <div className="space-y-2">
                    {[{ method: "Telegram", time: "Within 2 hours" }, { method: "Calendly Call", time: "Scheduled directly" }, { method: "Email", time: "Within 24 hours" }].map(r => (
                      <div key={r.method} className="flex justify-between text-sm"><span className="text-[#5A7188]">{r.method}</span><span className="font-semibold text-[#0F1A28]">{r.time}</span></div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-2">
            <Reveal direction="left">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Investor Inquiry</p>
              <h2 className="text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">Submit a formal inquiry.</h2>
              <p className="mt-6 max-w-lg text-lg text-[#2E4358]">Fill in the form and a pre-drafted message will open directly to the KCG business inbox.</p>
            </Reveal>
            <Reveal direction="right">
              <div className="rounded-[28px] border border-white/30 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md sm:p-8">
                {submitted && <div className="mb-5 rounded-2xl border border-[#C9D8E2] bg-[#EDF4F8] px-4 py-3 text-sm text-[#0F1A28]">Your investor inquiry was opened in your email client.</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {[{ id: "name", label: "Name", type: "text", placeholder: "Your full name" }, { id: "email", label: "Email", type: "email", placeholder: "you@example.com" }].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="mb-2 block text-sm font-medium text-[#0F1A28]">{f.label}</label>
                      <input id={f.id} name={f.id} type={f.type} value={formData[f.id]} onChange={handleChange} placeholder={f.placeholder} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1] focus:ring-2 focus:ring-[#9FB4C1]/20" required />
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
                    <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} placeholder="Tell KCG about your goals, background, and interest..." className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]" required />
                  </div>
                  <button type="submit" className="w-full rounded-full bg-[#0F1A28] px-6 py-4 font-semibold text-white transition hover:scale-[1.02] hover:bg-[#1A2A3D]">Submit Investor Inquiry</button>
                </form>
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
            <div className="flex flex-wrap gap-6 text-sm text-[#2E4358]">{NAV_LINKS.map(l => <Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">{l.label}</Link>)}<Link href="/privacy" className="hover:opacity-70 transition-opacity">Privacy</Link><Link href="/disclaimer" className="hover:opacity-70 transition-opacity">Disclaimer</Link></div>
          </div>
        </footer>
      </main>
    </>
  );
}
