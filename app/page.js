"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════ */
function useCounter(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

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

function useParallax(speed = 0.3) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setOffset((rect.top + rect.height / 2 - window.innerHeight / 2) * speed);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return [ref, offset];
}

function useMagneticHover() {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - rect.left - rect.width / 2) * 0.25, y: (e.clientY - rect.top - rect.height / 2) * 0.25 });
  }, []);
  return [ref, pos, active, handleMove, () => setActive(true), () => { setActive(false); setPos({ x: 0, y: 0 }); }];
}

/* ═══════════════════════════════════════════════════════════════
   REVEAL / STAGGER
═══════════════════════════════════════════════════════════════ */
function Reveal({ children, className = "", id = "", delay = 0, direction = "up" }) {
  const [ref, inView] = useInView(0.08);
  const transforms = { up: inView ? "translateY(0)" : "translateY(40px)", left: inView ? "translateX(0)" : "translateX(-40px)", right: inView ? "translateX(0)" : "translateX(40px)", scale: inView ? "scale(1)" : "scale(0.94)", none: "none" };
  return (
    <section id={id || undefined} ref={ref} className={className}
      style={{ opacity: inView ? 1 : 0, transform: transforms[direction] || transforms.up, transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </section>
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

function ParallaxSection({ children, className = "", id = "", speed = 0.15 }) {
  const [ref, offset] = useParallax(speed);
  return (
    <section id={id || undefined} ref={ref} className={`relative overflow-hidden ${className}`}>
      <div style={{ transform: `translateY(${offset}px)`, willChange: "transform" }}>{children}</div>
    </section>
  );
}

function MagneticButton({ children, href, className, onClick, type = "button" }) {
  const [ref, pos, active, handleMove, handleEnter, handleLeave] = useMagneticHover();
  const Tag = href ? "a" : "button";
  return (
    <Tag ref={ref} href={href} type={href ? undefined : type} onClick={onClick}
      onMouseMove={handleMove} onMouseEnter={handleEnter} onMouseLeave={handleLeave}
      className={className}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${active ? 1.05 : 1})`, transition: active ? "transform 0.1s ease" : "transform 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
      {children}
    </Tag>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CURSOR TRAIL
═══════════════════════════════════════════════════════════════ */
function CursorTrail() {
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    const NUM = 8;
    const trails = Array.from({ length: NUM }, (_, i) => {
      const el = document.createElement("div");
      const s = 10 - i * 0.8;
      el.style.cssText = `position:fixed;pointer-events:none;z-index:9999;border-radius:50%;width:${s}px;height:${s}px;background:rgba(46,67,88,${0.12 - i * 0.012});transform:translate(-50%,-50%)`;
      document.body.appendChild(el);
      return { el, x: 0, y: 0 };
    });
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMove);
    let raf;
    const animate = () => {
      let x = mouse.x, y = mouse.y;
      trails.forEach((t, i) => {
        t.x += (x - t.x) * (0.35 - i * 0.025); t.y += (y - t.y) * (0.35 - i * 0.025);
        t.el.style.left = `${t.x}px`; t.el.style.top = `${t.y}px`;
        x = t.x; y = t.y;
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); trails.forEach(t => t.el.remove()); };
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════════════════════
   ★ EXIT-INTENT POPUP
═══════════════════════════════════════════════════════════════ */
function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (dismissed) return;
    // Trigger when mouse leaves top of viewport
    const onMouseLeave = (e) => {
      if (e.clientY <= 10 && !triggered.current) {
        triggered.current = true;
        setTimeout(() => setShow(true), 200);
      }
    };
    // Also show after 45 seconds on page
    const timer = setTimeout(() => {
      if (!triggered.current) { triggered.current = true; setShow(true); }
    }, 45000);
    document.addEventListener("mouseleave", onMouseLeave);
    return () => { document.removeEventListener("mouseleave", onMouseLeave); clearTimeout(timer); };
  }, [dismissed]);

  const dismiss = () => { setShow(false); setDismissed(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(dismiss, 2500);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0F1A28]/40 backdrop-blur-sm" onClick={dismiss} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-white/60 bg-white/95 shadow-[0_40px_120px_rgba(15,26,40,0.25)] backdrop-blur-xl"
        style={{ animation: "popIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>

        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#A9C2D1] via-[#DCE7EE] to-[#C7D9E4]" />

        <div className="p-8">
          {/* Close */}
          <button onClick={dismiss} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F7FA] text-[#5A7188] transition hover:bg-[#E6EEF2] hover:text-[#0F1A28]">✕</button>

          {!submitted ? (
            <>
              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#9FB4C1]/40 bg-[#F3F7FA] px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1F5E36] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7188]">Exclusive Access</span>
              </div>

              <h2 className="text-2xl font-bold leading-tight text-[#0F1A28] sm:text-3xl">
                Don't leave without starting the conversation.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#2E4358]">
                Join serious investors already in dialogue with Kaizen Capital Group. Drop your email and we'll reach out within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1] focus:ring-2 focus:ring-[#9FB4C1]/20" />
                <MagneticButton type="submit" className="w-full rounded-full bg-[#0F1A28] px-6 py-3.5 font-semibold text-white hover:bg-[#1A2A3D] hover:shadow-[0_8px_24px_rgba(15,26,40,0.20)]">
                  Get Investor Access →
                </MagneticButton>
              </form>

              <div className="mt-4 flex items-center justify-center gap-4">
                <a href="https://t.me/trellz_P" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-[#C9D8E2] bg-[#F3F7FA] px-4 py-2 text-xs font-semibold text-[#2E4358] transition hover:bg-[#E6EEF2]">
                  <span>✈</span> Telegram
                </a>
                <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-[#C9D8E2] bg-[#F3F7FA] px-4 py-2 text-xs font-semibold text-[#2E4358] transition hover:bg-[#E6EEF2]">
                  <span>📅</span> Book a Call
                </a>
              </div>

              <p className="mt-4 text-center text-[10px] text-[#9FB4C1]">No spam. Serious conversations only.</p>
            </>
          ) : (
            <div className="py-6 text-center" style={{ animation: "fadeUp 0.4s ease-out" }}>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#DCEFE3]">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F1A28]">You're on the list.</h3>
              <p className="mt-2 text-sm text-[#5A7188]">KCG will be in touch within 24 hours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ FLOATING CTA BAR
═══════════════════════════════════════════════════════════════ */
function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-3"
      style={{ animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)" }}>

      {/* Expanded options */}
      {expanded && (
        <div className="flex flex-col gap-2 items-end" style={{ animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
          <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#0F1A28] shadow-[0_8px_24px_rgba(15,26,40,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,26,40,0.16)]">
            <span>📅</span> Book a Call
          </a>
          <a href="https://t.me/trellz_P" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#0F1A28] shadow-[0_8px_24px_rgba(15,26,40,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,26,40,0.16)]">
            <span>✈</span> Telegram
          </a>
          <a href="#contact-form"
            className="flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#0F1A28] shadow-[0_8px_24px_rgba(15,26,40,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,26,40,0.16)]"
            onClick={() => setExpanded(false)}>
            <span>✉</span> Email Inquiry
          </a>
        </div>
      )}

      {/* Main FAB button */}
      <button onClick={() => setExpanded(!expanded)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F1A28] text-white shadow-[0_8px_30px_rgba(15,26,40,0.30)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(15,26,40,0.40)]"
        style={{ transform: `rotate(${expanded ? "45deg" : "0deg"})`, transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease" }}>
        <span className="text-xl">{expanded ? "✕" : "+"}</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ LEAD QUALIFIER POPUP
═══════════════════════════════════════════════════════════════ */
function LeadQualifier({ onClose, onSelect }) {
  const options = [
    { label: "Private Investor", icon: "👤", desc: "Looking to invest capital with KCG" },
    { label: "Fund Allocator", icon: "🏛️", desc: "Larger allocation or institutional interest" },
    { label: "Strategic Partner", icon: "🤝", desc: "Broker, platform, or business opportunity" },
    { label: "Just Exploring", icon: "👀", desc: "Learning more about KCG" },
  ];
  return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div className="absolute inset-0 bg-[#0F1A28]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] border border-white/60 bg-white/95 shadow-[0_40px_120px_rgba(15,26,40,0.25)] backdrop-blur-xl"
        style={{ animation: "popIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="h-1 w-full bg-gradient-to-r from-[#A9C2D1] via-[#DCE7EE] to-[#C7D9E4]" />
        <div className="p-8">
          <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F7FA] text-[#5A7188] transition hover:bg-[#E6EEF2]">✕</button>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#5A7188]">Quick Qualification</p>
          <h2 className="mb-2 text-2xl font-bold text-[#0F1A28]">What best describes you?</h2>
          <p className="mb-6 text-sm text-[#5A7188]">We'll route you to the right conversation.</p>
          <div className="grid gap-3">
            {options.map((opt) => (
              <button key={opt.label} onClick={() => onSelect(opt.label)}
                className="group flex items-center gap-4 rounded-2xl border border-[#E6EEF2] bg-[#F7FAFC]/80 px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9FB4C1] hover:bg-white hover:shadow-[0_8px_24px_rgba(15,26,40,0.08)]">
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <p className="font-semibold text-[#0F1A28]">{opt.label}</p>
                  <p className="text-xs text-[#5A7188]">{opt.desc}</p>
                </div>
                <span className="ml-auto text-[#C9D8E2] transition group-hover:text-[#5A7188]">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ CALENDLY EMBED SECTION
═══════════════════════════════════════════════════════════════ */
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
      {!loaded && (
        <div className="flex h-48 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-[#9FB4C1] border-t-[#0F1A28] animate-spin" />
            <p className="text-sm text-[#5A7188]">Loading booking calendar…</p>
          </div>
        </div>
      )}
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/trellzp12/30min?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=ffffff&text_color=0F1A28&primary_color=0F1A28"
        style={{ minWidth: "320px", height: loaded ? "700px" : "0px", transition: "height 0.3s ease" }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ TELEGRAM CARD
═══════════════════════════════════════════════════════════════ */
function TelegramCard() {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(15,26,40,0.14)] sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#A9C2D1] via-[#DCE7EE] to-[#C7D9E4]" />
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F1A28] text-2xl text-white transition-transform duration-300 group-hover:scale-110">
        ✈
      </div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#5A7188]">Direct Message</p>
      <h3 className="text-2xl font-bold text-[#0F1A28]">Telegram</h3>
      <p className="mt-3 text-sm leading-6 text-[#2E4358]">
        The fastest way to start a conversation with KCG. Direct, private, and institutional-grade communication.
      </p>
      <div className="mt-4 rounded-2xl bg-[#F7FAFC]/80 px-4 py-3">
        <p className="text-xs text-[#5A7188]">Handle</p>
        <p className="font-semibold text-[#0F1A28]">@trellz_P</p>
      </div>
      <MagneticButton href="https://t.me/trellz_P" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F1A28] px-6 py-3.5 font-semibold text-white hover:bg-[#1A2A3D] hover:shadow-[0_8px_24px_rgba(15,26,40,0.20)]">
        <span>✈</span> Message on Telegram
      </MagneticButton>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SPARKLINE / MONTHLY BAR / RISK METER (reused)
═══════════════════════════════════════════════════════════════ */
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
      {data.map((d, i) => <div key={i} className="flex-1 flex flex-col items-center justify-end" title={`${d.month}: ${d.val>0?"+":""}${d.val}%`}><div className="w-full rounded-sm" style={{ height: `${Math.max((Math.abs(d.val)/max)*100,8)}%`, background: d.val>=0?"rgba(31,94,54,0.7)":"rgba(122,47,47,0.6)" }} /></div>)}
    </div>
  );
}

function RiskMeter({ level }) {
  const n = { Low:1, Medium:2, High:3 }[level]||1;
  const colors = { Low:"#1F5E36", Medium:"#7A5C1E", High:"#7A2F2F" };
  const bg = { Low:"bg-[#DCEFE3] text-[#1F5E36] border-[#B8D8C4]", Medium:"bg-[#F5EDD8] text-[#7A5C1E] border-[#E8D5AA]", High:"bg-[#F3E4E4] text-[#7A2F2F] border-[#E5C6C6]" };
  return <div className="flex items-center gap-2"><div className="flex gap-0.5">{[1,2,3].map(i=><div key={i} className="h-2.5 w-2 rounded-sm" style={{background:i<=n?colors[level]:"#D4E3EC"}}/>)}</div><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${bg[level]}`}>{level}</span></div>;
}

/* ═══════════════════════════════════════════════════════════════
   FUND CARD (with tilt)
═══════════════════════════════════════════════════════════════ */
function FundCard({ label, name, focus, strategy, managers, brokerage, status, extra, primaryLink, secondaryLinks=[], totalReturn, winRate, maxDrawdown, sharpe, monthlyReturns, sparkData, riskLevel, minInvestment }) {
  const [expanded, setExpanded] = useState(false);
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const [hovered, setHovered] = useState(false);
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
      style={{ transform:`perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) ${hovered?"translateY(-6px)":"translateY(0)"}`, transition:hovered?"transform 0.1s ease,box-shadow 0.3s ease":"transform 0.6s cubic-bezier(0.16,1,0.3,1),box-shadow 0.3s ease", boxShadow:hovered?"0 28px 80px rgba(15,26,40,0.14),0 0 0 1px rgba(159,180,193,0.3)":"0 12px 40px rgba(15,26,40,0.06)" }}>
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
          {primaryLink&&<MagneticButton href={primaryLink} className="rounded-full bg-[#0F1A28] px-5 py-2 text-center text-sm font-semibold text-white hover:bg-[#1A2A3D]">Get Started</MagneticButton>}
          {secondaryLinks.map((link,i)=><MagneticButton key={i} href={link.url} className="rounded-full border border-[#2E4358] bg-white/60 px-5 py-2 text-center text-sm font-semibold text-[#0F1A28] hover:bg-[#EDF4F8]">{link.label}</MagneticButton>)}
        </div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OTHER CARDS
═══════════════════════════════════════════════════════════════ */
function DashMetric({ label, value, sub, trend, color="text-[#0F1A28]" }) {
  return <div className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(15,26,40,0.12)] sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">{label}</p><p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>{sub&&<p className="mt-1 text-xs text-[#5A7188]">{sub}</p>}{trend!==undefined&&<div className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${trend>=0?"bg-[#DCEFE3] text-[#1F5E36]":"bg-[#F3E4E4] text-[#7A2F2F]"}`}>{trend>=0?"▲":"▼"} {Math.abs(trend)}% vs last month</div>}</div>;
}

function FunnelCard({ title, description, points, cta }) {
  return <div className="group rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_28px_80px_rgba(15,26,40,0.14)] sm:p-8"><h3 className="text-2xl font-bold text-[#0F1A28]">{title}</h3><p className="mt-4 text-sm leading-7 text-[#2E4358]">{description}</p><div className="mt-6 space-y-3">{points.map((p,i)=><div key={i} className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3 text-sm text-[#2E4358] transition-transform duration-300 group-hover:translate-x-1">{p}</div>)}</div><MagneticButton href="#contact-form" className="mt-6 inline-block rounded-full bg-[#0F1A28] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1A2A3D]">{cta}</MagneticButton></div>;
}

function QualificationCard({ title, subtitle, bullets }) {
  return <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.05)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,26,40,0.12)]"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">Best Fit</p><h3 className="mt-2 text-xl font-bold text-[#0F1A28]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#2E4358]">{subtitle}</p><div className="mt-5 space-y-3">{bullets.map((b,i)=><div key={i} className="rounded-2xl bg-[#F7FAFC]/80 px-4 py-3 text-sm text-[#2E4358]">{b}</div>)}</div></div>;
}

function TestimonialCard({ quote, name, role }) {
  return <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.05)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,26,40,0.12)] sm:p-8"><p className="text-4xl leading-none text-[#9FB4C1]">"</p><p className="mt-3 text-sm leading-7 text-[#2E4358]">{quote}</p><div className="mt-6"><p className="text-sm font-semibold text-[#0F1A28]">{name}</p><p className="text-xs uppercase tracking-[0.12em] text-[#5A7188]">{role}</p></div></div>;
}

function AnimatedStatCard({ label, value, suffix="", decimals=0, started }) {
  const numericTarget = parseFloat(String(value).replace(/[^0-9.]/g,""));
  const counted = useCounter(numericTarget*Math.pow(10,decimals),2200,started);
  const display = decimals>0?(counted/Math.pow(10,decimals)).toFixed(decimals):counted.toLocaleString();
  return <div className="group relative overflow-hidden rounded-2xl border border-white/50 bg-white/55 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_16px_40px_rgba(15,26,40,0.12)]"><div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5A7188]">{label}</p><p className="mt-2 text-2xl font-bold text-[#0F1A28] tabular-nums">{display}{suffix}</p></div>;
}

function LiveTickerItem({ symbol, price, change, positive }) {
  return <div className="flex items-center gap-3 whitespace-nowrap"><span className="text-xs font-bold uppercase tracking-wider text-[#0F1A28]">{symbol}</span><span className="text-xs font-semibold text-[#2E4358]">{price}</span><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${positive?"bg-[#DCEFE3] text-[#1F5E36]":"bg-[#F3E4E4] text-[#7A2F2F]"}`}>{positive?"▲":"▼"} {change}</span><span className="text-[#C9D8E2] mx-2">·</span></div>;
}

function FloatingParticle({ x, y, size, duration, delay, opacity }) {
  return <div className="absolute rounded-full pointer-events-none" style={{ left:`${x}%`, top:`${y}%`, width:size, height:size, background:`radial-gradient(circle,rgba(159,180,193,${opacity}) 0%,transparent 70%)`, animation:`floatUp ${duration}s ease-in-out ${delay}s infinite alternate` }}/>;
}

function TradingViewWidget({ widgetType, config, className="", minHeight="320px" }) {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML="";
    const widget=document.createElement("div"); widget.className="tradingview-widget-container__widget"; widget.style.height="100%"; widget.style.width="100%";
    const script=document.createElement("script"); script.type="text/javascript"; script.async=true; script.src=`https://s3.tradingview.com/external-embedding/embed-widget-${widgetType}.js`; script.innerHTML=JSON.stringify(config);
    container.appendChild(widget); container.appendChild(script);
  },[widgetType,config]);
  return <div ref={containerRef} className={`tradingview-widget-container overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-sm backdrop-blur-md ${className}`} style={{minHeight}}/>;
}

function GrowthChart({ data, width=560, height=200 }) {
  const [ref,inView] = useInView(0.2);
  const [progress,setProgress] = useState(0);
  useEffect(()=>{
    if(!inView)return;
    let start=null;
    const animate=(ts)=>{if(!start)start=ts;const p=Math.min((ts-start)/1800,1);setProgress(p);if(p<1)requestAnimationFrame(animate);};
    requestAnimationFrame(animate);
  },[inView]);
  const visible=data.slice(0,Math.max(2,Math.floor(progress*data.length)));
  const minV=Math.min(...data.map(d=>d.value)),maxV=Math.max(...data.map(d=>d.value)),range=maxV-minV||1;
  const pad={t:16,r:8,b:32,l:48},cw=width-pad.l-pad.r,ch=height-pad.t-pad.b;
  const toX=(i)=>pad.l+(i/(data.length-1))*cw,toY=(v)=>pad.t+ch-((v-minV)/range)*ch;
  const pathD=visible.map((d,i)=>`${i===0?"M":"L"} ${toX(data.indexOf(d))} ${toY(d.value)}`).join(" ");
  const fillD=visible.length>1?`${pathD} L ${toX(data.indexOf(visible[visible.length-1]))} ${pad.t+ch} L ${toX(0)} ${pad.t+ch} Z`:"";
  const yTicks=[minV,(minV+maxV)/2,maxV].map(v=>({v,y:toY(v),label:`${v>0?"+":""}${v.toFixed(1)}%`}));
  const xLabels=data.filter((_,i)=>i%Math.ceil(data.length/6)===0);
  return <div ref={ref} className="w-full overflow-x-auto"><svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{minWidth:280}}>
    <defs><linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2E4358" stopOpacity="0.18"/><stop offset="100%" stopColor="#2E4358" stopOpacity="0.01"/></linearGradient></defs>
    {yTicks.map((t,i)=><g key={i}><line x1={pad.l} y1={t.y} x2={pad.l+cw} y2={t.y} stroke="#C9D8E2" strokeWidth="1" strokeDasharray="4 4"/><text x={pad.l-6} y={t.y+4} textAnchor="end" fontSize="9" fill="#9FB4C1">{t.label}</text></g>)}
    {fillD&&<path d={fillD} fill="url(#gf)"/>}
    {pathD&&<path d={pathD} fill="none" stroke="#0F1A28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
    {xLabels.map((d,i)=><text key={i} x={toX(data.indexOf(d))} y={height-6} textAnchor="middle" fontSize="9" fill="#9FB4C1">{d.label}</text>)}
    {visible.length>1&&<circle cx={toX(data.indexOf(visible[visible.length-1]))} cy={toY(visible[visible.length-1].value)} r="4" fill="#0F1A28"/>}
  </svg></div>;
}

function WinLossDonut({ winRate }) {
  const r=40,cx=56,cy=56,stroke=10,circ=2*Math.PI*r;
  return <div className="flex items-center gap-4"><svg width="112" height="112" viewBox="0 0 112 112"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#E6EEF2" strokeWidth={stroke}/><circle cx={cx} cy={cy} r={r} fill="none" stroke="#1F5E36" strokeWidth={stroke} strokeDasharray={`${(winRate/100)*circ} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} style={{transition:"stroke-dasharray 1.5s ease-out"}}/><text x={cx} y={cy-4} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0F1A28">{winRate}%</text><text x={cx} y={cy+12} textAnchor="middle" fontSize="8" fill="#9FB4C1">WIN RATE</text></svg><div className="space-y-2"><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-[#1F5E36]"/><span className="text-xs text-[#2E4358]">Wins: {winRate}%</span></div><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-[#E6EEF2] border border-[#C9D8E2]"/><span className="text-xs text-[#2E4358]">Losses: {100-winRate}%</span></div></div></div>;
}

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const GROWTH_DATA = [
  {label:"Jan",value:0},{label:"Feb",value:2.1},{label:"Mar",value:5.8},{label:"Apr",value:4.2},{label:"May",value:9.4},{label:"Jun",value:12.1},{label:"Jul",value:10.8},{label:"Aug",value:15.3},{label:"Sep",value:18.7},{label:"Oct",value:22.4},{label:"Nov",value:26.1},{label:"Dec",value:31.2},
];

const FUND_DATA = [
  {label:"Fund 1",name:"KaizenCapitalGroup.Xau-TMGM",focus:"Gold CFD",status:"Live",strategy:"Gold Scalping & Intra-day",managers:"1",brokerage:"TMGM",totalReturn:"+18.9%",winRate:"79.4%",maxDrawdown:"-4.2%",sharpe:"2.14",riskLevel:"Medium",minInvestment:"$500",sparkData:[12,14,13,16,15,18,17,19,21,20,22,24,23,26],monthlyReturns:[{month:"J",val:2.1},{month:"F",val:1.8},{month:"M",val:3.2},{month:"A",val:-0.4},{month:"M",val:2.8},{month:"J",val:1.9},{month:"J",val:3.1},{month:"A",val:2.4}],primaryLink:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/94720/KCG-TMGM",secondaryLinks:[{label:"Ratings",url:"https://ratings.tmgmplatform.com/widgets/shared/5173e304d7494051b27287f70426a327?lang=en%3Fpreview%3DP3U9ODIxMzA2JmE9MTM0NjMmcD0xMzgzNCZ3PTEmcz01MTczZTMwNGQ3NDk0MDUxYjI3Mjg3ZjcwNDI2YTMyNw%3D%3D"}]},
  {label:"Fund 1a",name:"KaizenCapitalGroup.Xau-MB",focus:"Gold CFD",status:"Live",strategy:"Gold Scalping & Intra-day",managers:"1",brokerage:"MultiBank",totalReturn:"+22.1%",winRate:"71.6%",maxDrawdown:"-5.8%",sharpe:"1.87",riskLevel:"Medium",minInvestment:"$1,500",sparkData:[10,12,11,15,14,17,16,20,19,22,21,25,24,27],monthlyReturns:[{month:"J",val:3.1},{month:"F",val:2.4},{month:"M",val:-0.8},{month:"A",val:4.2},{month:"M",val:1.6},{month:"J",val:3.8},{month:"J",val:2.1},{month:"A",val:3.4}],primaryLink:"https://social.mexatlantic.com/portal/registration/subscription/89528/KCG30"},
  {label:"Fund 2",name:"TradeXMarkets Fund",focus:"Gold & potentially Oil",strategy:"Gold Trading & automated trading mix",managers:"1",brokerage:"MultiBank",status:"N/A"},
  {label:"Fund 3",name:"VaultKano Fund",focus:"Crypto",strategy:"Manual & automated trading mix",managers:"1",brokerage:"MultiBank",status:"Re-Launching"},
  {label:"Fund 4",name:"Exodus Investments",focus:"Crypto & Gold",strategy:"Scalping + Macro / Swing Trading",managers:"2",brokerage:"TradeSmart",status:"N/A",extra:"United States Included"},
  {label:"Fund 5",name:"KCG + Phoenix",focus:"Gold & FX currencies",strategy:"To be defined",managers:"1",brokerage:"MultiBank",status:"N/A",extra:"Speculative"},
  {label:"Fund 6",name:"Phoenix",focus:"Forex mixed assets",strategy:"Automated trading mix of all instruments",managers:"Potential fully automated managed fund (1)",brokerage:"MultiBank",status:"N/A"},
  {label:"Fund 7",name:"Forex fotune AI",focus:"EURUSD",strategy:"Automated trading mix of EUR instruments",managers:"1",brokerage:"MultiBank",status:"N/A"},
  {label:"Fund 8",name:"The Alpha Fund",focus:"Gold trading",status:"Live",strategy:"Manual trading",managers:"2 traders",brokerage:"TMGM",totalReturn:"+24.7%",winRate:"73.2%",maxDrawdown:"-6.1%",sharpe:"1.96",riskLevel:"Medium",minInvestment:"$1,000",sparkData:[8,11,13,12,16,15,18,20,19,23,22,26,25,29],monthlyReturns:[{month:"J",val:4.1},{month:"F",val:-1.2},{month:"M",val:3.8},{month:"A",val:2.9},{month:"M",val:1.4},{month:"J",val:4.2},{month:"J",val:3.6},{month:"A",val:2.8}],primaryLink:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/67622/Alpha",secondaryLinks:[{label:"Ratings",url:"https://ratings.tmgmplatform.com/widgets/shared/05a7391d205e4c82982ea3141e98aee5?lang=en?preview=P3U9N2M1Y2IwJmE9MTg5ODgmcD0xOTUwMCZ3PTEmcz0wNWE3MzkxZDIwNWU0YzgyOTgyZWEzMTQxZTk4YWVlNQ=="}]},
  {label:"Fund 9",name:"Algo Amalgamation Fund",focus:"Multi-asset (Gold, Forex, Crypto & others)",strategy:"Fully algorithmic — amalgamation of strategies from Funds 1–8",managers:"Mixture of algorithmic bots",brokerage:"MultiBank / TradeSmart / TMGM",status:"N/A"},
  {label:"Fund 10",name:"PfaneTXau Fund",focus:"All CFD indices and commodities",strategy:"Swarm",managers:"1 (potentially 2)",brokerage:"To be confirmed",status:"Discontinuation"},
  {label:"Fund 11",name:"MAMALYN Fund",focus:"EUR/USD",status:"Live",strategy:"Fully algorithmic trading",managers:"1",brokerage:"MultiBank",totalReturn:"+31.5%",winRate:"68.9%",maxDrawdown:"-7.4%",sharpe:"1.74",riskLevel:"High",minInvestment:"$3,000",sparkData:[6,9,11,14,13,17,16,20,22,21,25,28,27,31],monthlyReturns:[{month:"J",val:5.2},{month:"F",val:3.1},{month:"M",val:-2.1},{month:"A",val:6.4},{month:"M",val:4.8},{month:"J",val:-1.2},{month:"J",val:5.9},{month:"A",val:4.1}],primaryLink:"https://social.multibankfx.com/portal/registration/subscription/89236/mamalynMin3000dollars",secondaryLinks:[{label:"FX Blue",url:"https://www.fxblue.com/users/mamalyn"},{label:"Myfxbook",url:"https://www.myfxbook.com/members/Panevino83/mamalyn-mt4-31229860/11078849"}]},
  {label:"Fund 12",name:"CXFund",focus:"Gold trading",status:"Disconnected",strategy:"Manual trading",managers:"2 traders",brokerage:"TMGM",primaryLink:"https://signal.tmc2lnbmfs.com/portal/registration/subscription/69413/CXFund2026",secondaryLinks:[{label:"Ratings",url:"https://ratings.tmgmplatform.com/widgets/shared/cc306ad97ef243a5aa092cd4d0d226bb?lang=en?preview=P3U9NjJiODU0JmE9MTg3MzkmcD0xOTI0NyZ3PTEmcz1jYzMwNmFkOTdlZjI0M2E1YWEwOTJjZDRkMGQyMjZiYg=="}]},
];

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [showQualifier, setShowQualifier] = useState(false);
  const [qualifierType, setQualifierType] = useState(null);
  const [formData, setFormData] = useState({ name:"", email:"", inquiryType:"", capitalLevel:"", message:"" });

  const particles = useRef(Array.from({length:18},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:`${Math.random()*120+40}px`,duration:Math.random()*8+6,delay:Math.random()*4,opacity:Math.random()*0.18+0.04}))).current;

  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>24);onScroll();window.addEventListener("scroll",onScroll);return()=>window.removeEventListener("scroll",onScroll);},[]);
  useEffect(()=>{const t=setTimeout(()=>setHeroVisible(true),300);return()=>clearTimeout(t);},[]);

  const handleChange=(e)=>{setSubmitted(false);setFormData(p=>({...p,[e.target.name]:e.target.value}));};
  const handleSubmit=(e)=>{
    e.preventDefault();
    const subject=encodeURIComponent(`KCG Investor Inquiry from ${formData.name}`);
    const body=encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.inquiryType}\nCapital / Interest Level: ${formData.capitalLevel}\n\nMessage:\n${formData.message}`);
    window.location.href=`mailto:cottrell@kaizencapitalgrp.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setFormData({name:"",email:"",inquiryType:"",capitalLevel:"",message:""});
  };

  const handleQualifierSelect = (type) => {
    setQualifierType(type);
    setShowQualifier(false);
    // Scroll to contact form
    setTimeout(()=>document.getElementById("contact-form")?.scrollIntoView({behavior:"smooth"}),200);
  };

  const navLinks = [
    {href:"#home",label:"Home"},{href:"#overview",label:"Overview"},{href:"#market-data",label:"Market Data"},
    {href:"#funds",label:"Funds"},{href:"#performance",label:"Performance"},{href:"#investor-funnel",label:"Investors"},
    {href:"#social-proof",label:"Proof"},{href:"#activity",label:"Activity"},{href:"#why-kcg",label:"Why KCG"},
    {href:"#book-a-call",label:"Book a Call"},{href:"#contact-form",label:"Contact"},
  ];

  return (
    <>
      <style>{`
        @keyframes floatUp{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-30px) scale(1.08)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulseGlow{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{from{opacity:0;transform:scale(0.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes scanLine{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        .animate-slide-down{animation:slideDown .3s ease-out forwards}
        .ticker-track{animation:tickerScroll 32s linear infinite}
        .shimmer-text{background:linear-gradient(90deg,#0F1A28 0%,#5A7188 40%,#9FB4C1 50%,#5A7188 60%,#0F1A28 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .hero-gradient{background:linear-gradient(-45deg,#E6EEF2,#D4E3EC,#C9D8E2,#DCE7EE,#E8F0F5);background-size:400% 400%;animation:gradientShift 12s ease infinite}
        .scan-line{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(159,180,193,0.4),transparent);animation:scanLine 8s linear infinite;pointer-events:none}
      `}</style>

      <CursorTrail />
      <ExitIntentPopup />
      <FloatingCTA />
      {showQualifier && <LeadQualifier onClose={()=>setShowQualifier(false)} onSelect={handleQualifierSelect} />}

      <main className="min-h-screen bg-[#E6EEF2] text-[#0F1A28] overflow-x-hidden">

        {/* ── NAV ── */}
        <nav className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${scrolled?"border-b border-white/40 bg-[#E6EEF2]/92 shadow-[0_8px_30px_rgba(15,26,40,0.08)] backdrop-blur-xl":"border-b border-white/20 bg-white/40 backdrop-blur-md"}`}>
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0F1A28] transition-transform hover:scale-110 sm:h-8 sm:w-8">
                <span className="text-[9px] font-black text-white sm:text-[10px]">KCG</span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2E4358] sm:text-xs md:text-sm md:tracking-[0.2em]">Kaizen Capital Group</span>
            </div>
            <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#2E4358]">
              {navLinks.map(l=><a key={l.href} href={l.href} className="relative py-1 transition-all hover:text-[#0F1A28] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#0F1A28] after:transition-all hover:after:w-full">{l.label}</a>)}
            </div>
            <div className="flex items-center gap-2">
              <MagneticButton onClick={()=>setShowQualifier(true)} className="hidden shrink-0 rounded-full bg-[#0F1A28] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1A2A3D] sm:inline-block sm:px-5 sm:text-sm">Get Started</MagneticButton>
              <button onClick={()=>setMenuOpen(!menuOpen)} className="flex flex-col justify-center gap-[5px] p-2 lg:hidden">
                <span className={`block h-0.5 w-5 bg-[#0F1A28] transition-all duration-300 ${menuOpen?"translate-y-[7px] rotate-45":""}`}/>
                <span className={`block h-0.5 w-5 bg-[#0F1A28] transition-all duration-300 ${menuOpen?"opacity-0":""}`}/>
                <span className={`block h-0.5 w-5 bg-[#0F1A28] transition-all duration-300 ${menuOpen?"-translate-y-[7px] -rotate-45":""}`}/>
              </button>
            </div>
          </div>
          {menuOpen&&(
            <div className="animate-slide-down border-t border-white/30 bg-[#E6EEF2]/96 backdrop-blur-xl lg:hidden">
              <div className="mx-auto max-w-6xl px-4 py-4 space-y-1 sm:px-6">
                {navLinks.map(l=><a key={l.href} href={l.href} onClick={()=>setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#2E4358] transition-all hover:bg-white/60 hover:translate-x-1">{l.label}</a>)}
                <div className="pt-2"><button onClick={()=>{setMenuOpen(false);setShowQualifier(true);}} className="block w-full rounded-full bg-[#0F1A28] px-5 py-3 text-center text-sm font-semibold text-white">Get Started</button></div>
              </div>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section id="home" className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
          <div className="absolute inset-0 hero-gradient"/>
          <div className="scan-line" style={{top:"30%"}}/>
          <div className="absolute inset-0 overflow-hidden">{particles.map(p=><FloatingParticle key={p.id} {...p}/>)}</div>
          <div className="absolute inset-0 opacity-[0.035]" style={{backgroundImage:`linear-gradient(#0F1A28 1px,transparent 1px),linear-gradient(90deg,#0F1A28 1px,transparent 1px)`,backgroundSize:"60px 60px"}}/>
          <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9FB4C1]/20 blur-[100px] pointer-events-none" style={{animation:"pulseGlow 6s ease-in-out infinite"}}/>
          <div className="absolute top-2/3 right-1/4 h-64 w-64 rounded-full bg-[#C9D8E2]/25 blur-[80px] pointer-events-none" style={{animation:"pulseGlow 8s ease-in-out 2s infinite"}}/>
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9FB4C1]/50 bg-white/50 px-4 py-1.5 backdrop-blur-sm" style={{animation:heroVisible?"fadeUp 0.6s ease-out 0.1s both":"none"}}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#1F5E36] animate-pulse"/>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2E4358]">Institutional Capital Strategy Platform</span>
            </div>
            <div style={{animation:heroVisible?"fadeUp 0.7s ease-out 0.2s both":"none"}}>
              <h1 className="max-w-5xl text-5xl font-bold leading-[1.08] tracking-tight text-[#0F1A28] sm:text-6xl md:text-7xl lg:text-8xl">
                Disciplined <span className="shimmer-text">capital</span><br/>
                strategy for <span className="relative inline-block">long-term<svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none"><path d="M2 6 C60 2,120 2,180 4 C240 6,280 4,298 3" stroke="#9FB4C1" strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg></span> growth.
              </h1>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#2E4358] sm:mt-8 sm:text-lg" style={{animation:heroVisible?"fadeUp 0.7s ease-out 0.35s both":"none"}}>
              Kaizen Capital Group presents a refined, institutional brand image centered on structure, credibility, execution, and strategic capital growth across 12 active funds.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4" style={{animation:heroVisible?"fadeUp 0.7s ease-out 0.45s both":"none"}}>
              <MagneticButton onClick={()=>setShowQualifier(true)} className="group relative overflow-hidden rounded-full bg-[#0F1A28] px-8 py-4 text-center font-semibold text-white hover:shadow-[0_12px_30px_rgba(15,26,40,0.25)]">
                <span className="relative z-10">Start the Conversation</span>
                <div className="absolute inset-0 translate-x-full bg-gradient-to-r from-[#1A2A3D] to-[#2E4358] transition-transform duration-300 group-hover:translate-x-0"/>
              </MagneticButton>
              <MagneticButton href="#funds" className="rounded-full border border-[#2E4358]/40 bg-white/50 px-8 py-4 text-center font-semibold text-[#0F1A28] backdrop-blur-sm hover:bg-white/75">View Funds →</MagneticButton>
            </div>
            <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4" style={{animation:heroVisible?"fadeUp 0.7s ease-out 0.55s both":"none"}}>
              <AnimatedStatCard label="Funds Active" value="12" started={heroVisible}/>
              <AnimatedStatCard label="Active Users" value="4" started={heroVisible}/>
              <AnimatedStatCard label="Avg Monthly Return" value="9.2" suffix="%" decimals={1} started={heroVisible}/>
              <AnimatedStatCard label="Total Volume" value="847200000" started={heroVisible}/>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/50 bg-white/50 py-3 backdrop-blur-sm" style={{animation:heroVisible?"fadeUp 0.7s ease-out 0.65s both":"none"}}>
              <div className="ticker-track flex">{[...Array(2)].map((_,si)=><div key={si} className="flex shrink-0 items-center px-4"><LiveTickerItem symbol="XAU/USD" price="$2,341.50" change="0.42%" positive={true}/><LiveTickerItem symbol="EUR/USD" price="1.0847" change="0.18%" positive={true}/><LiveTickerItem symbol="BTC/USD" price="$67,240" change="1.24%" positive={true}/><LiveTickerItem symbol="DXY" price="104.32" change="0.09%" positive={false}/><LiveTickerItem symbol="OIL" price="$82.14" change="0.61%" positive={false}/><LiveTickerItem symbol="ETH/USD" price="$3,480" change="2.11%" positive={true}/></div>)}</div>
            </div>
          </div>
        </section>

        {/* ── OVERVIEW ── */}
        <Reveal id="overview" className="px-4 pb-20 sm:px-6 sm:pb-24">
          <StaggerReveal className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 md:gap-8" stagger={100}>
            {[{title:"Strategic Positioning",body:"KCG is designed to communicate a premium, disciplined identity for partners, clients, and capital relationships."},{title:"Growth Framework",body:"We focus on long-term brand strength, structured presentation, and consistent execution across all touchpoints."}].map(card=>(
              <div key={card.title} className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,26,40,0.12)] sm:p-8">
                <h3 className="mb-3 text-xl font-semibold text-[#0F1A28]">{card.title}</h3>
                <p className="text-[#2E4358]">{card.body}</p>
              </div>
            ))}
          </StaggerReveal>
        </Reveal>

        {/* ── MARKET DATA ── */}
        <Reveal id="market-data" className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Live Market Data</p></Reveal>
            <Reveal direction="left" delay={100}><h2 className="mb-6 text-4xl font-bold text-[#0F1A28] md:text-5xl">Real-time market visibility for the instruments KCG watches most.</h2></Reveal>
            <div className="mb-6"><TradingViewWidget widgetType="ticker-tape" minHeight="72px" config={{symbols:[{proName:"OANDA:XAUUSD",title:"Gold"},{proName:"FX:EURUSD",title:"EUR/USD"},{proName:"BITSTAMP:BTCUSD",title:"Bitcoin"},{proName:"TVC:DXY",title:"DXY"},{proName:"TVC:USOIL",title:"Oil"}],showSymbolLogo:true,isTransparent:true,displayMode:"adaptive",colorTheme:"light",locale:"en"}}/></div>
            <StaggerReveal className="grid gap-6 lg:grid-cols-3" stagger={150}>
              <TradingViewWidget widgetType="symbol-overview" minHeight="420px" config={{symbols:[["OANDA:XAUUSD|1D"]],chartOnly:false,width:"100%",height:"100%",locale:"en",colorTheme:"light",autosize:true,showVolume:false,chartType:"area",lineWidth:2,lineColor:"#0F1A28",topColor:"rgba(143,168,184,0.45)",bottomColor:"rgba(143,168,184,0.08)",dateRanges:["1d|1","1m|30","3m|60","12m|1D","60m|1W"]}}/>
              <TradingViewWidget widgetType="symbol-overview" minHeight="420px" config={{symbols:[["FX:EURUSD|1D"]],chartOnly:false,width:"100%",height:"100%",locale:"en",colorTheme:"light",autosize:true,showVolume:false,chartType:"area",lineWidth:2,lineColor:"#2E4358",topColor:"rgba(201,216,226,0.45)",bottomColor:"rgba(201,216,226,0.08)",dateRanges:["1d|1","1m|30","3m|60","12m|1D","60m|1W"]}}/>
              <TradingViewWidget widgetType="symbol-overview" minHeight="420px" config={{symbols:[["BITSTAMP:BTCUSD|1D"]],chartOnly:false,width:"100%",height:"100%",locale:"en",colorTheme:"light",autosize:true,showVolume:false,chartType:"area",lineWidth:2,lineColor:"#5A7188",topColor:"rgba(220,231,238,0.55)",bottomColor:"rgba(220,231,238,0.12)",dateRanges:["1d|1","1m|30","3m|60","12m|1D","60m|1W"]}}/>
            </StaggerReveal>
          </div>
        </Reveal>

        {/* ── FUNDS ── */}
        <Reveal id="funds" className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div><Reveal direction="left"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">KCG Multiplied Funds</p></Reveal><Reveal direction="left" delay={100}><h2 className="text-4xl font-bold text-[#0F1A28] md:text-5xl">Live funds, developing systems, and structured strategies across KCG.</h2></Reveal></div>
              <Reveal direction="right"><div className="rounded-2xl border border-white/50 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-md"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">Premium Section</p><p className="mt-1 text-sm text-[#2E4358]">Refined for stronger investor presentation.</p></div></Reveal>
            </div>
            <StaggerReveal className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" stagger={60}>
              {FUND_DATA.map(fund=><FundCard key={fund.label} {...fund}/>)}
            </StaggerReveal>
          </div>
        </Reveal>

        {/* ── PERFORMANCE ── */}
        <Reveal id="performance" className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Performance Dashboard</p></Reveal>
            <Reveal direction="left" delay={100}><h2 className="mb-4 text-4xl font-bold text-[#0F1A28] md:text-5xl">Data-driven execution across all KCG systems.</h2></Reveal>
            <StaggerReveal className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={80}>
              <DashMetric label="Platform Avg Return" value="+24.3%" sub="Across all live funds YTD" trend={4.2} color="text-[#1F5E36]"/>
              <DashMetric label="Combined Win Rate" value="73.3%" sub="Weighted avg all live funds" trend={1.8} color="text-[#2E4358]"/>
              <DashMetric label="Avg Sharpe Ratio" value="1.93" sub="Risk-adjusted performance" trend={0.12} color="text-[#2E4358]"/>
              <DashMetric label="Max System Drawdown" value="-5.9%" sub="Worst peak-to-trough" color="text-[#7A2F2F]"/>
            </StaggerReveal>
            <StaggerReveal className="mb-8 grid gap-6 lg:grid-cols-3" stagger={100}>
              <div className="lg:col-span-2 rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md sm:p-8">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">Cumulative Growth Curve</p><p className="mt-1 text-2xl font-bold text-[#0F1A28]">+31.2% YTD</p></div><div className="flex gap-2">{["1M","3M","6M","YTD","1Y"].map(t=><button key={t} className={`rounded-full px-3 py-1 text-xs font-semibold transition hover:scale-105 ${t==="YTD"?"bg-[#0F1A28] text-white":"bg-[#F7FAFC] text-[#5A7188] hover:bg-[#EDF4F8]"}`}>{t}</button>)}</div></div>
                <GrowthChart data={GROWTH_DATA} width={560} height={200}/>
              </div>
              <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md sm:p-8">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">Win / Loss Breakdown</p>
                <WinLossDonut winRate={73}/>
                <div className="mt-6 space-y-3">{[{label:"Total Trades",value:"8,658"},{label:"Winning Trades",value:"6,325"},{label:"Losing Trades",value:"2,333"},{label:"Avg Trade Duration",value:"4.2h"}].map(s=><div key={s.label} className="flex items-center justify-between rounded-2xl bg-[#F7FAFC]/80 px-4 py-2.5 transition hover:bg-[#EDF4F8]"><span className="text-xs text-[#5A7188]">{s.label}</span><span className="text-sm font-bold text-[#0F1A28]">{s.value}</span></div>)}</div>
              </div>
            </StaggerReveal>
            <Reveal direction="up">
              <div className="mb-8 overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md sm:p-8">
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">Live Fund Performance Comparison</p>
                <div className="overflow-x-auto"><table className="w-full text-sm">
                  <thead><tr className="border-b border-[#E6EEF2]">{["Fund","Status","Total Return","Win Rate","Max DD","Sharpe","Risk"].map(h=><th key={h} className="pb-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-[#5A7188]">{h}</th>)}</tr></thead>
                  <tbody>{FUND_DATA.filter(f=>f.totalReturn).map(f=><tr key={f.label} className="border-b border-[#F3F7FA] transition-all hover:bg-[#F7FAFC]/60 hover:translate-x-1"><td className="py-3 font-semibold text-[#0F1A28]">{f.name.length>24?f.name.slice(0,24)+"…":f.name}</td><td className="py-3"><span className="inline-flex items-center gap-1 rounded-full bg-[#DCEFE3] px-2 py-0.5 text-[10px] font-bold text-[#1F5E36]"><span className="h-1 w-1 rounded-full bg-[#1F5E36] animate-pulse"/>Live</span></td><td className="py-3 font-bold text-[#1F5E36]">{f.totalReturn}</td><td className="py-3 text-[#2E4358]">{f.winRate}</td><td className="py-3 text-[#7A2F2F]">{f.maxDrawdown}</td><td className="py-3 text-[#2E4358]">{f.sharpe}</td><td className="py-3"><RiskMeter level={f.riskLevel}/></td></tr>)}</tbody>
                </table></div>
              </div>
            </Reveal>
          </div>
        </Reveal>

        {/* ── INVESTOR FUNNEL ── */}
        <Reveal id="investor-funnel" className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Investor Funnel</p></Reveal>
            <Reveal direction="left" delay={100}><h2 className="max-w-4xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">Structured pathways for investors, allocators, and strategic capital partners.</h2></Reveal>
            <StaggerReveal className="mt-12 grid gap-6 md:grid-cols-3" stagger={100}>
              <FunnelCard title="Private Investors" description="Built for individuals seeking structured exposure, disciplined execution, and premium communication." points={["Explore current live fund opportunities","Review fit based on your goals and capital profile","Begin a direct conversation with KCG"]} cta="Investor Inquiry"/>
              <FunnelCard title="Fund Allocation" description="Designed for larger capital conversations, managed allocation discussions, and more formal fund placement interest." points={["Discuss allocation objectives","Review strategy alignment and suitable structures","Position for a more advanced capital conversation"]} cta="Discuss Allocation"/>
              <FunnelCard title="Strategic Partnerships" description="For broker relationships, business partnerships, platform collaborations, and long-term institutional growth." points={["Review synergy and strategic fit","Explore growth, distribution, or platform alignment","Open a partnership discussion with KCG"]} cta="Partnership Inquiry"/>
            </StaggerReveal>
            <div className="mt-16">
              <Reveal direction="left"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Qualification Paths</p></Reveal>
              <Reveal direction="left" delay={100}><h3 className="max-w-3xl text-3xl font-bold leading-tight text-[#0F1A28] md:text-4xl">Identify your best-fit route before entering the inquiry process.</h3></Reveal>
              <StaggerReveal className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4" stagger={80}>
                <QualificationCard title="Private Investor" subtitle="Best for individuals exploring KCG opportunities." bullets={["Looking for fund access","Interested in disciplined capital exposure","Ready to begin with an initial conversation"]}/>
                <QualificationCard title="Allocator / Larger Capital" subtitle="Built for more formal capital conversations and larger deployment interest." bullets={["Exploring larger allocation discussions","Reviewing structure and strategy fit","Interested in a more advanced capital dialogue"]}/>
                <QualificationCard title="Strategic Partner" subtitle="For brokers, platforms, and growth partners exploring long-term alignment." bullets={["Interested in distribution or partnership","Exploring platform or business alignment","Looking for strategic synergies with KCG"]}/>
                <QualificationCard title="General Inquiry" subtitle="For visitors still learning about KCG." bullets={["Still determining best fit","Want general information first","Need guidance on the right entry path"]}/>
              </StaggerReveal>
            </div>
          </div>
        </Reveal>

        {/* ── SOCIAL PROOF ── */}
        <Reveal id="social-proof" className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Social Proof</p></Reveal>
            <Reveal direction="left" delay={100}><h2 className="max-w-4xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">Built for credibility, reinforced by presentation, consistency, and long-term brand trust.</h2></Reveal>
            <StaggerReveal className="mt-12 grid gap-6 md:grid-cols-3" stagger={100}>
              {[{label:"Reputation",title:"Premium Brand Positioning",body:"KCG is presented as a structured, disciplined, investor-facing brand built for long-term credibility."},{label:"Access",title:"Live + Developing Strategies",body:"The site is structured to present live funds, future strategies, and multiple entry paths for capital conversations."},{label:"Trust",title:"Investor Inquiry Flow",body:"Serious inquiries are guided into a more qualified, structured, and institutionally aligned contact experience."}].map(c=>(
                <div key={c.label} className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.05)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,26,40,0.12)] sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">{c.label}</p>
                  <p className="mt-3 text-3xl font-bold text-[#0F1A28]">{c.title}</p>
                  <p className="mt-4 text-sm leading-7 text-[#2E4358]">{c.body}</p>
                </div>
              ))}
            </StaggerReveal>
            <div className="mt-16">
              <StaggerReveal className="grid gap-6 md:grid-cols-3" stagger={100}>
                <TestimonialCard quote="KCG presents itself with structure, clarity, and a noticeably premium investor-facing standard." name="Future Testimonial" role="Investor / Allocator"/>
                <TestimonialCard quote="The platform feels built for disciplined long-term positioning rather than short-term noise." name="Future Testimonial" role="Strategic Partner"/>
                <TestimonialCard quote="From presentation to funnel structure, the brand reflects seriousness, direction, and growth intent." name="Future Testimonial" role="Capital Partner"/>
              </StaggerReveal>
            </div>
            <div className="mt-16">
              <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={80}>
                {["Broker / Partner Logo","Platform Logo","Media / Network Logo","Strategic Partner Logo"].map(n=><div key={n} className="flex h-20 items-center justify-center rounded-2xl border border-white/50 bg-white/65 px-6 text-center text-sm font-semibold text-[#5A7188] shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/80">{n}</div>)}
              </StaggerReveal>
            </div>
          </div>
        </Reveal>

        {/* ── ACTIVITY ── */}
        <Reveal id="activity" className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Live Trading Activity</p></Reveal>
            <Reveal direction="left" delay={100}><h2 className="mb-10 text-4xl font-bold text-[#0F1A28] md:text-5xl">Live-style activity feed for your future execution flow.</h2></Reveal>
            <StaggerReveal className="grid gap-4" stagger={120}>
              {[{action:"BUY XAUUSD",fund:"KaizenCapitalGroup.Xau-TMGM",lots:"0.10 lots",result:"+12.4 pips",profit:"+$124.00"},{action:"SELL EURUSD",fund:"MAMALYN Fund",lots:"0.05 lots",result:"+8.1 pips",profit:"+$40.50"},{action:"BUY BTCUSD",fund:"VaultKano Fund",lots:"0.01 lots",result:"+2.7%",profit:"+$67.20"}].map((trade,i)=>(
                <div key={i} className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#1F5E36] animate-pulse"/><div><p className="font-semibold text-[#0F1A28]">{trade.action}</p><p className="text-sm text-[#5A7188]">Fund: {trade.fund} • {trade.lots}</p></div></div>
                    <div className="text-right"><p className="text-sm font-bold text-[#1F5E36]">{trade.profit}</p><p className="text-xs text-[#5A7188]">{trade.result}</p></div>
                  </div>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </Reveal>

        {/* ── WHY KCG ── */}
        <ParallaxSection id="why-kcg" className="bg-gradient-to-br from-[#DCE7EE] via-[#C9D8E2] to-[#B4C7D4] px-4 py-20 sm:px-6 sm:py-24" speed={0.1}>
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Why Choose KCG?</p></Reveal>
            <Reveal direction="left" delay={100}><h2 className="mb-12 max-w-4xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">A brand experience built for disciplined traders, serious clients, and long-term credibility.</h2></Reveal>
            <StaggerReveal className="grid gap-6 md:grid-cols-3" stagger={100}>
              {[{title:"Structured Execution",body:"Every layer of KCG is built around consistency, clarity, and disciplined decision-making."},{title:"Premium Positioning",body:"The presentation is designed to feel trusted, investor-facing, and institutionally credible."},{title:"Scalable Systems",body:"Your ecosystem can expand into funds, bots, dashboards, reporting, and deeper automation later."}].map(c=>(
                <div key={c.title} className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-md backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/75 hover:shadow-[0_24px_60px_rgba(15,26,40,0.12)] sm:p-8">
                  <h3 className="mb-3 text-xl font-semibold text-[#0F1A28]">{c.title}</h3>
                  <p className="text-sm text-[#2E4358]">{c.body}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </ParallaxSection>

        {/* ══════════════════════════════════════════════
            ★ BOOK A CALL — Calendly + Telegram Section
        ══════════════════════════════════════════════ */}
        <Reveal id="book-a-call" className="bg-[#F3F7FA] px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal direction="left"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Start a Conversation</p></Reveal>
            <Reveal direction="left" delay={100}><h2 className="mb-4 text-4xl font-bold text-[#0F1A28] md:text-5xl">Book a call or message directly.</h2></Reveal>
            <Reveal direction="up" delay={150}><p className="mb-12 max-w-3xl text-lg text-[#2E4358]">Choose the fastest route to connect with KCG. Book a 30-minute investor call directly below, or reach out instantly via Telegram.</p></Reveal>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Calendly embed - takes 2/3 width */}
              <div className="lg:col-span-2">
                <Reveal direction="left">
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5A7188]">Schedule a 30-Minute Call</p>
                    <h3 className="mt-1 text-2xl font-bold text-[#0F1A28]">Investor Consultation</h3>
                  </div>
                  <CalendlyEmbed />
                </Reveal>
              </div>

              {/* Telegram + quick actions */}
              <div className="flex flex-col gap-6">
                <Reveal direction="right">
                  <TelegramCard />
                </Reveal>

                <Reveal direction="right" delay={100}>
                  <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,26,40,0.06)] backdrop-blur-md">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#5A7188]">Quick Actions</p>
                    <div className="space-y-3">
                      <MagneticButton onClick={()=>setShowQualifier(true)} className="flex w-full items-center justify-between rounded-2xl bg-[#0F1A28] px-4 py-3.5 font-semibold text-white hover:bg-[#1A2A3D]">
                        <span className="text-sm">Investor Qualifier</span><span>→</span>
                      </MagneticButton>
                      <MagneticButton href="#contact-form" className="flex w-full items-center justify-between rounded-2xl border border-[#2E4358]/30 bg-white/60 px-4 py-3.5 font-semibold text-[#0F1A28] hover:bg-[#EDF4F8]">
                        <span className="text-sm">Email Inquiry Form</span><span>→</span>
                      </MagneticButton>
                      <MagneticButton href="mailto:cottrell@kaizencapitalgrp.com" className="flex w-full items-center justify-between rounded-2xl border border-[#2E4358]/30 bg-white/60 px-4 py-3.5 font-semibold text-[#0F1A28] hover:bg-[#EDF4F8]">
                        <span className="text-sm">Direct Email</span><span>→</span>
                      </MagneticButton>
                    </div>
                    <p className="mt-4 text-center text-[10px] text-[#9FB4C1]">All inquiries answered within 24 hours</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── CONTACT CTA ── */}
        <Reveal className="px-4 py-20 sm:px-6 sm:py-24" direction="scale">
          <div className="mx-auto max-w-5xl rounded-[28px] border border-white/40 bg-white/70 p-8 text-center shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md transition-all duration-500 hover:shadow-[0_30px_80px_rgba(15,26,40,0.14)] sm:rounded-[32px] sm:p-10 md:p-16">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Investor Inquiry Flow</p>
            <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-6xl">Begin a serious conversation with Kaizen Capital Group.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#2E4358]">Structured for investors, allocators, strategic partners, and qualified inquiries.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <MagneticButton onClick={()=>setShowQualifier(true)} className="rounded-full bg-[#0F1A28] px-10 py-4 font-semibold text-white hover:bg-[#1A2A3D]">Start Investor Inquiry</MagneticButton>
              <MagneticButton href="https://calendly.com/trellzp12/30min" className="rounded-full border border-[#2E4358]/40 bg-white/50 px-10 py-4 font-semibold text-[#0F1A28] hover:bg-white/75">Book a Call →</MagneticButton>
            </div>
          </div>
        </Reveal>

        {/* ── CONTACT FORM ── */}
        <Reveal id="contact-form" className="px-4 pb-24 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
            <Reveal direction="left">
              <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7188]">Investor Contact</p>
                <h2 className="max-w-xl text-4xl font-bold leading-tight text-[#0F1A28] md:text-5xl">Submit your investor or partnership inquiry.</h2>
                <p className="mt-6 max-w-lg text-lg text-[#2E4358]">A pre-filled draft will open directly to your KCG business email.</p>
                {qualifierType && (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[#C9D8E2] bg-[#EDF4F8] px-4 py-3">
                    <span className="text-[#1F5E36]">✓</span>
                    <p className="text-sm text-[#2E4358]">Qualified as: <span className="font-semibold text-[#0F1A28]">{qualifierType}</span></p>
                  </div>
                )}
                <StaggerReveal className="mt-8 space-y-4" stagger={80}>
                  {[{href:"mailto:cottrell@kaizencapitalgrp.com",label:"Email",value:"cottrell@kaizencapitalgrp.com"},{href:"https://t.me/trellz_P",label:"Telegram",value:"@trellz_P"},{href:"https://calendly.com/trellzp12/30min",label:"Book a Call",value:"calendly.com/trellzp12/30min"}].map(c=>(
                    <a key={c.label} href={c.href} target={c.href.startsWith("mailto")?undefined:"_blank"} rel="noopener noreferrer" className="block rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-md hover:bg-white/80">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A7188]">{c.label}</p>
                      <p className="mt-2 break-all text-sm text-[#0F1A28]">{c.value}</p>
                    </a>
                  ))}
                </StaggerReveal>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="rounded-[28px] border border-white/30 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,26,40,0.08)] backdrop-blur-md sm:rounded-[32px] sm:p-8">
                {submitted&&<div className="mb-5 rounded-2xl border border-[#C9D8E2] bg-[#EDF4F8] px-4 py-3 text-sm text-[#0F1A28]" style={{animation:"fadeUp 0.4s ease-out"}}>Your investor inquiry draft was opened successfully.</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {[{id:"name",label:"Name",type:"text",placeholder:"Your full name"},{id:"email",label:"Email",type:"email",placeholder:"you@example.com"}].map(f=>(
                    <div key={f.id}>
                      <label htmlFor={f.id} className="mb-2 block text-sm font-medium text-[#0F1A28]">{f.label}</label>
                      <input id={f.id} name={f.id} type={f.type} value={formData[f.id]} onChange={handleChange} placeholder={f.placeholder} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition-all focus:border-[#9FB4C1] focus:ring-2 focus:ring-[#9FB4C1]/20" required/>
                    </div>
                  ))}
                  <div>
                    <label htmlFor="inquiryType" className="mb-2 block text-sm font-medium text-[#0F1A28]">Inquiry Type</label>
                    <select id="inquiryType" name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]" required>
                      <option value="">{qualifierType||"Select inquiry type"}</option>
                      <option>Private Investor</option><option>Fund Allocation</option><option>Strategic Partnership</option><option>General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="capitalLevel" className="mb-2 block text-sm font-medium text-[#0F1A28]">Capital / Interest Level</label>
                    <select id="capitalLevel" name="capitalLevel" value={formData.capitalLevel} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1]" required>
                      <option value="">Select level</option><option>Exploring / Learning</option><option>Under $10,000</option><option>$10,000 - $50,000</option><option>$50,000 - $250,000</option><option>$250,000+</option><option>Strategic / Non-capital partnership</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#0F1A28]">Message</label>
                    <textarea id="message" name="message" rows={6} value={formData.message} onChange={handleChange} placeholder="Tell KCG about your goals, background, allocation interest, or partnership reason..." className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#0F1A28] outline-none transition focus:border-[#9FB4C1] focus:ring-2 focus:ring-[#9FB4C1]/20" required/>
                  </div>
                  <MagneticButton type="submit" className="w-full rounded-full bg-[#0F1A28] px-6 py-4 font-semibold text-white hover:bg-[#1A2A3D] hover:shadow-[0_8px_24px_rgba(15,26,40,0.20)]">Submit Investor Inquiry</MagneticButton>
                </form>
              </div>
            </Reveal>
          </div>
        </Reveal>

        {/* ── FOOTER ── */}
        <footer className="border-t border-black/5 bg-[#DCE7EE] px-4 py-10 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0F1A28] transition hover:scale-110"><span className="text-[8px] font-black text-white">KCG</span></div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5A7188]">Kaizen Capital Group</p>
              </div>
              <p className="mt-1 max-w-md text-sm text-[#2E4358]">Built around disciplined execution, premium positioning, and long-term credibility.</p>
              <div className="mt-3 flex gap-3">
                <a href="https://t.me/trellz_P" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full border border-[#C9D8E2] bg-white/50 px-3 py-1.5 text-xs font-semibold text-[#2E4358] transition hover:bg-white/80"><span>✈</span>Telegram</a>
                <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full border border-[#C9D8E2] bg-white/50 px-3 py-1.5 text-xs font-semibold text-[#2E4358] transition hover:bg-white/80"><span>📅</span>Book a Call</a>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[#2E4358]">
              {navLinks.map(l=><a key={l.href} href={l.href} className="transition hover:opacity-70 hover:-translate-y-0.5">{l.label}</a>)}
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
