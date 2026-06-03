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
  { href: "https://t.me/KaizenCapitalGroup", label: "Telegram" },
  { href: "https://discord.gg/rJWSD6dhWm", label: "Discord" },
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
            <div className="pt-2"><Link href="/contact" className="block rounded-full bg-[#0F1A28] px-5 py-3 text-center text-sm font-semibold text-white">Get Started</Link></div>
          </div>
        </div>
      )}
    </nav>
  );
}



export default function AboutPage() {
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
        <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
          <div className="absolute inset-0 hero-gradient opacity-60" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#0F1A28 1px,transparent 1px),linear-gradient(90deg,#0F1A28 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9FB4C1]/50 bg-white/50 px-4 py-1.5 backdrop-blur-sm" style={{ animation: "fadeUp 0.6s ease-out 0.1s both" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#1F5E36] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2E4358]">About KCG</span>
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-tight text-[#0F1A28] sm:text-6xl md:text-7xl" style={{ animation: "fadeUp 0.7s ease-out 0.2s both" }}>Built for disciplined<br />capital execution.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-7 text-[#2E4358]" style={{ animation: "fadeUp 0.7s ease-out 0.35s both" }}>Kaizen Capital Group is an institutional capital strategy platform built around structure, credibility, and long-term growth across 12 active funds.</p>
          </div>
        </section>

        {/* MISSION */}
        <section className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <Reveal direction="left">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Our Mission</p>
                <h2 className="text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">Continuous improvement in every capital decision.</h2>
                <p className="mt-6 text-lg leading-7 text-[#2E4358]">The name Kaizen — derived from the Japanese philosophy of continuous improvement — defines how we approach every fund, every strategy, and every investor relationship.</p>
                <p className="mt-4 text-lg leading-7 text-[#2E4358]">We are not chasing short-term returns. We are building a long-term institutional presence across Gold, Forex, Crypto, and multi-asset instruments with disciplined execution at the core.</p>
              </Reveal>
              <Reveal direction="right">
                <div className="grid gap-4">
                  {[
                    { label: "Founded", value: "2023", sub: "Kaizen Capital Group established" },
                    { label: "Active Funds", value: "12", sub: "Across Gold, FX, Crypto & multi-asset" },
                    { label: "Brokerages", value: "3", sub: "TMGM · MultiBank · TradeSmart" },
                    { label: "Avg Monthly Return", value: "9.2%", sub: "Across all live fund strategies" },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl border border-white/60 bg-white/75 px-5 py-4 backdrop-blur-md shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#5A7188]">{s.label}</p>
                        <p className="mt-0.5 text-xs text-[#9FB4C1]">{s.sub}</p>
                      </div>
                      <p className="text-2xl font-bold text-[#0F1A28]">{s.value}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal><p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Core Values</p></Reveal>
            <Reveal delay={100}><h2 className="mb-12 max-w-3xl text-4xl font-bold text-[#0F1A28] md:text-5xl">The principles behind every KCG decision.</h2></Reveal>
            <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={80}>
              {[
                { icon: "⚡", title: "Disciplined Execution", body: "Every trade, every fund, every investor relationship is governed by structure and consistency — not emotion or short-term noise." },
                { icon: "🏛️", title: "Institutional Credibility", body: "KCG is built to feel like a real capital management firm — premium presentation, serious communication, and investor-grade standards." },
                { icon: "📈", title: "Long-Term Growth", body: "We are not optimising for this month. We are building for sustained, compounding growth across all KCG systems and funds." },
                { icon: "🔒", title: "Risk Management", body: "Every strategy includes built-in risk controls, drawdown limits, and position sizing designed to protect capital first." },
                { icon: "🤝", title: "Investor Alignment", body: "KCG's success is tied to investor outcomes. We build structures that align our incentives with the people we serve." },
                { icon: "🔄", title: "Continuous Improvement", body: "True to the Kaizen philosophy — we iterate, refine, and improve every system, strategy, and process without stopping." },
              ].map(v => (
                <div key={v.title} className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,26,40,0.12)] sm:p-8">
                  <div className="mb-4 text-3xl">{v.icon}</div>
                  <h3 className="mb-3 text-xl font-bold text-[#0F1A28]">{v.title}</h3>
                  <p className="text-sm leading-6 text-[#2E4358]">{v.body}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* STORY */}
        <section className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <Reveal direction="left">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">The Story</p>
              <h2 className="text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">From a single fund to a multi-strategy capital platform.</h2>
              <p className="mt-6 text-base leading-7 text-[#2E4358]">KCG started with a single gold scalping fund on TMGM and has grown into a structured ecosystem of 12 funds across Gold, Forex, Crypto, and multi-asset instruments.</p>
              <p className="mt-4 text-base leading-7 text-[#2E4358]">Each fund represents a different strategy, risk profile, and market focus — unified under one institutional brand built for credibility, consistency, and long-term capital growth.</p>
              <p className="mt-4 text-base leading-7 text-[#2E4358]">The roadmap ahead includes automated fund systems, institutional documents, investor portals, and a full capital management ecosystem.</p>
            </Reveal>
            <Reveal direction="right">
              <div className="space-y-4">
                {[
                  { year: "2023", event: "KCG Founded", detail: "First gold fund launched on TMGM" },
                  { year: "2024", event: "Multi-Fund Expansion", detail: "Grew to 12 funds across 3 brokerages" },
                  { year: "2024", event: "Platform Launch", detail: "Institutional website and investor funnel live" },
                  { year: "2025", event: "Portal & Automation", detail: "Investor portal, AI systems, and automation roadmap" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 rounded-2xl border border-white/60 bg-white/75 p-5 backdrop-blur-md shadow-sm">
                    <div className="shrink-0 rounded-xl bg-[#0F1A28] px-3 py-2 text-center"><p className="text-xs font-bold text-white">{item.year}</p></div>
                    <div>
                      <p className="font-bold text-[#0F1A28]">{item.event}</p>
                      <p className="text-sm text-[#5A7188]">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* TEAM */}
        <section className="bg-gradient-to-br from-[#DCE7EE] via-[#C9D8E2] to-[#B4C7D4] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal><p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Leadership</p></Reveal>
            <Reveal delay={100}><h2 className="mb-12 text-4xl font-bold text-[#0F1A28] md:text-5xl">The team behind KCG.</h2></Reveal>
            <StaggerReveal className="grid gap-6 md:grid-cols-3" stagger={100}>
              {[
                { name: "Cottrell Phillip", role: "Founder & Lead Strategist", bio: "Founder of Kaizen Capital Group. Oversees all fund strategy, investor relations, and platform development.", initials: "CP" },
                { name: "Fund Manager", role: "Senior Trader", bio: "Placeholder for additional team member. Replace with real bio when ready.", initials: "FM" },
                { name: "Operations", role: "Platform & Operations", bio: "Placeholder for additional team member. Replace with real bio when ready.", initials: "OP" },
              ].map(member => (
                <div key={member.name} className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md sm:p-8">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F1A28] text-xl font-black text-white">{member.initials}</div>
                  <h3 className="text-xl font-bold text-[#0F1A28]">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#5A7188]">{member.role}</p>
                  <p className="mt-3 text-sm leading-6 text-[#2E4358]">{member.bio}</p>
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
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">Ready to Connect?</p>
                <h2 className="text-4xl font-bold text-[#0F1A28] md:text-5xl">Start a serious conversation with KCG.</h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-[#2E4358]">Explore our funds, book a call, or submit an investor inquiry today.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link href="/contact" className="rounded-full bg-[#0F1A28] px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]">Get in Touch</Link>
                  <Link href="/funds" className="rounded-full border border-[#2E4358]/40 bg-white/50 px-8 py-4 font-semibold text-[#0F1A28] transition hover:scale-105 hover:bg-white/75">View Funds →</Link>
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
