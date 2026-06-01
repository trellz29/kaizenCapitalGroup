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
          <Link href="/portal" className="hidden shrink-0 rounded-full bg-[#0F1A28] px-4 py-2 text-xs font-semibold text-white transition hover:scale-105 sm:inline-block sm:px-5 sm:text-sm">Apply for Access</Link>
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
            <div className="pt-2"><Link href="/portal" className="block rounded-full bg-[#0F1A28] px-5 py-3 text-center text-sm font-semibold text-white">Apply for Access</Link></div>
          </div>
        </div>
      )}
    </nav>
  );
}

function LockedCard({ title, description, icon, tier }) {
  const tierColors = { "Verified": "bg-[#DCEFE3] text-[#1F5E36] border-[#B8D8C4]", "Institutional": "bg-[#F5EDD8] text-[#7A5C1E] border-[#E8D5AA]", "Partner": "bg-[#EEF2F7] text-[#35506A] border-[#D3DDE8]" };
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F1A28]"><span className="text-xl">🔒</span></div>
          <p className="text-sm font-bold text-[#0F1A28]">Apply for Access</p>
        </div>
      </div>
      <div className="mb-4 flex items-start justify-between">
        <span className="text-3xl">{icon}</span>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tierColors[tier]}`}>{tier}</span>
      </div>
      <h3 className="mb-2 font-bold text-[#0F1A28]">{title}</h3>
      <p className="text-sm leading-6 text-[#5A7188]">{description}</p>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-[#9FB4C1]">
        <span>🔒</span><span>Requires verification</span>
      </div>
    </div>
  );
}


const metadata = {
  title: 'Investor Portal | Kaizen Capital Group',
  description: 'Apply for exclusive investor portal access. Verified members get access to live fund reports, strategy documents, and direct investor communications.',
  openGraph: {
    title: 'Investor Portal | Kaizen Capital Group',
    description: 'Apply for exclusive investor portal access. Verified members get access to live fund reports, strategy documents, and direct investor communications.',
    url: 'https://kaizen-capital-group.vercel.app',
    siteName: 'Kaizen Capital Group',
    type: 'website',
  },
};

export default function PortalPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", type: "", capital: "", reason: "" });
  const handleChange = (e) => { setFormData(p => ({ ...p, [e.target.name]: e.target.value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`KCG Portal Access Application — ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nInvestor Type: ${formData.type}\nCapital Level: ${formData.capital}\n\nWhy they want access:\n${formData.reason}`);
    window.location.href = `mailto:support@kaizencapitalgrp.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

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
          <div className="absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9FB4C1]/15 blur-[120px] pointer-events-none" style={{ animation: "pulseGlow 6s ease-in-out infinite" }} />
          <div className="relative z-10 mx-auto max-w-6xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9FB4C1]/50 bg-white/50 px-4 py-1.5 backdrop-blur-sm" style={{ animation: "fadeUp 0.6s ease-out 0.1s both" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#1F5E36] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2E4358]">Investor Portal</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight text-[#0F1A28] sm:text-6xl md:text-7xl" style={{ animation: "fadeUp 0.7s ease-out 0.2s both" }}>
              Exclusive access<br />for serious investors.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#2E4358]" style={{ animation: "fadeUp 0.7s ease-out 0.35s both" }}>
              The KCG Investor Portal provides verified members with access to detailed fund reporting, live performance data, strategy documents, and direct investor communications.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center" style={{ animation: "fadeUp 0.7s ease-out 0.45s both" }}>
              <a href="#apply" className="rounded-full bg-[#0F1A28] px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]">Apply for Access</a>
              <Link href="/contact" className="rounded-full border border-[#2E4358]/40 bg-white/50 px-8 py-4 font-semibold text-[#0F1A28] transition hover:scale-105 hover:bg-white/75">Contact KCG →</Link>
            </div>
          </div>
        </section>

        {/* WHAT'S INSIDE */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Portal Contents</p>
              <h2 className="mb-4 text-3xl font-bold text-[#0F1A28] md:text-4xl">What verified members get access to.</h2>
              <p className="mb-10 max-w-2xl text-lg text-[#2E4358]">Hover over any card to see what's inside. Access is tiered based on investor profile and capital level.</p>
            </Reveal>
            <StaggerReveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={70}>
              <LockedCard icon="📊" title="Live Fund Reports" description="Real-time performance reports for all active KCG funds including detailed trade logs and drawdown analysis." tier="Verified"/>
              <LockedCard icon="📄" title="Strategy Documents" description="Full strategy overviews, risk frameworks, and execution methodology for each KCG fund." tier="Verified"/>
              <LockedCard icon="🤖" title="Bot Performance Data" description="Detailed algorithmic system metrics, signal accuracy reports, and backtesting results." tier="Verified"/>
              <LockedCard icon="📈" title="Institutional Analytics" description="Advanced portfolio analysis, correlation reports, and multi-fund allocation breakdowns." tier="Institutional"/>
              <LockedCard icon="💼" title="Fund Prospectus" description="Complete fund documentation including legal structures, fee schedules, and investor terms." tier="Institutional"/>
              <LockedCard icon="🤝" title="Partner Dashboard" description="Broker referral tracking, co-management opportunities, and strategic partner communications." tier="Partner"/>
            </StaggerReveal>
          </div>
        </section>

        {/* TIERS */}
        <section className="bg-[#F3F7FA] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Access Tiers</p>
              <h2 className="mb-10 text-3xl font-bold text-[#0F1A28] md:text-4xl">Three levels of investor access.</h2>
            </Reveal>
            <StaggerReveal className="grid gap-5 md:grid-cols-3" stagger={100}>
              {[
                { tier: "Verified", icon: "✓", color: "bg-[#DCEFE3] text-[#1F5E36]", border: "border-[#B8D8C4]", items: ["Live fund reports", "Strategy documents", "Bot performance data", "Monthly investor updates"], requirement: "Identity verified, min. $500 invested" },
                { tier: "Institutional", icon: "🏛", color: "bg-[#F5EDD8] text-[#7A5C1E]", border: "border-[#E8D5AA]", items: ["Everything in Verified", "Institutional analytics", "Fund prospectus access", "Quarterly strategy calls", "Priority allocation access"], requirement: "$10,000+ capital commitment" },
                { tier: "Partner", icon: "🤝", color: "bg-[#EEF2F7] text-[#35506A]", border: "border-[#D3DDE8]", items: ["Everything in Institutional", "Partner dashboard", "Co-management opportunities", "Direct founder access", "Custom reporting"], requirement: "Broker, platform, or strategic partner" },
              ].map(t => (
                <div key={t.tier} className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,26,40,0.12)] sm:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${t.color} border ${t.border}`}>{t.icon}</span>
                    <h3 className="text-xl font-bold text-[#0F1A28]">{t.tier}</h3>
                  </div>
                  <div className="mb-5 space-y-2">
                    {t.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-[#2E4358]">
                        <span className="mt-0.5 text-[#1F5E36] shrink-0">✓</span>{item}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A7188]">Requirement</p>
                    <p className="mt-1 text-xs text-[#2E4358]">{t.requirement}</p>
                  </div>
                  <a href="#apply" className="mt-4 block rounded-full bg-[#0F1A28] px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]">Apply for {t.tier}</a>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* PORTAL PREVIEW */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Portal Preview</p>
              <h2 className="mb-10 text-3xl font-bold text-[#0F1A28] md:text-4xl">A glimpse inside the investor dashboard.</h2>
            </Reveal>
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md sm:p-8">
                {/* Blur overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F1A28]"><span className="text-3xl">🔒</span></div>
                    <h3 className="text-2xl font-bold text-[#0F1A28]">Verified Access Only</h3>
                    <p className="mt-2 text-[#5A7188]">Apply below to unlock the full investor portal.</p>
                    <a href="#apply" className="mt-4 inline-block rounded-full bg-[#0F1A28] px-6 py-3 text-sm font-semibold text-white transition hover:scale-105">Apply for Access</a>
                  </div>
                </div>
                {/* Blurred preview content */}
                <div className="filter blur-sm pointer-events-none select-none">
                  <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    {[{label:"Portfolio Value",value:"$124,500"},{label:"Total Return",value:"+24.3%"},{label:"Active Funds",value:"3"},{label:"Next Report",value:"3 days"}].map(s=>(
                      <div key={s.label} className="rounded-2xl bg-[#F7FAFC]/80 p-4"><p className="text-xs text-[#5A7188]">{s.label}</p><p className="text-xl font-bold text-[#0F1A28]">{s.value}</p></div>
                    ))}
                  </div>
                  <div className="h-32 rounded-2xl bg-gradient-to-r from-[#DCE7EE] to-[#E6EEF2]" />
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {["Monthly Report — April 2025","Strategy Update — Gold Systems","Investor Memo — Q1 2025"].map(d=>(
                      <div key={d} className="rounded-xl bg-[#F7FAFC]/80 px-4 py-3 text-sm font-medium text-[#2E4358]">📄 {d}</div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section id="apply" className="bg-[#F3F7FA] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 md:grid-cols-2">
              <Reveal direction="left">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Apply Now</p>
                <h2 className="text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">Apply for investor portal access.</h2>
                <p className="mt-6 max-w-lg text-lg text-[#2E4358]">Submit your application and KCG will review your profile within 48 hours. All applications are reviewed personally.</p>
                <div className="mt-8 space-y-4">
                  {[
                    { icon: "⚡", title: "Fast Review", desc: "Applications reviewed within 48 hours" },
                    { icon: "🔒", title: "Private & Secure", desc: "Your information is never shared" },
                    { icon: "🤝", title: "Personal Touch", desc: "Every applicant is reviewed personally by KCG" },
                  ].map(f => (
                    <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-white/60 bg-white/75 p-4 backdrop-blur-md">
                      <span className="text-xl shrink-0">{f.icon}</span>
                      <div><p className="font-bold text-[#0F1A28]">{f.title}</p><p className="text-sm text-[#5A7188]">{f.desc}</p></div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal direction="right">
                <div className="rounded-[28px] border border-white/30 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md sm:p-8">
                  {submitted ? (
                    <div className="py-8 text-center" style={{ animation: "fadeUp 0.4s ease-out" }}>
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#DCEFE3]"><span className="text-3xl">✓</span></div>
                      <h3 className="text-2xl font-bold text-[#0F1A28]">Application Submitted</h3>
                      <p className="mt-3 text-[#5A7188]">Your application has been sent to KCG. You'll hear back within 48 hours.</p>
                      <div className="mt-6 space-y-3">
                        <a href="https://t.me/trellz_P" target="_blank" rel="noopener noreferrer" className="block rounded-full border border-[#C9D8E2] bg-[#F3F7FA] px-5 py-3 text-sm font-semibold text-[#2E4358] transition hover:bg-[#E6EEF2]">✈ Follow up on Telegram</a>
                        <Link href="/" className="block rounded-full bg-[#0F1A28] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1A2A3D]">Back to Homepage</Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#0F1A28]">Full Name</label>
                        <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Your full name" required className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1] focus:ring-2 focus:ring-[#9FB4C1]/20"/>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#0F1A28]">Email Address</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1] focus:ring-2 focus:ring-[#9FB4C1]/20"/>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#0F1A28]">Investor Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]">
                          <option value="">Select type</option>
                          <option>Private Investor</option>
                          <option>Fund Allocator</option>
                          <option>Broker / Partner</option>
                          <option>Strategic Partner</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#0F1A28]">Capital Level</label>
                        <select name="capital" value={formData.capital} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]">
                          <option value="">Select level</option>
                          <option>Under $10,000</option>
                          <option>$10,000 - $50,000</option>
                          <option>$50,000 - $250,000</option>
                          <option>$250,000+</option>
                          <option>Strategic / Non-capital</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#0F1A28]">Why do you want portal access?</label>
                        <textarea name="reason" value={formData.reason} onChange={handleChange} rows={4} placeholder="Tell KCG about your investment goals and what you're looking for..." required className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]"/>
                      </div>
                      <button type="submit" className="w-full rounded-full bg-[#0F1A28] px-6 py-4 font-semibold text-white transition hover:scale-[1.02] hover:bg-[#1A2A3D]">Submit Application</button>
                      <p className="text-center text-xs text-[#9FB4C1]">Reviewed personally within 48 hours</p>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
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
