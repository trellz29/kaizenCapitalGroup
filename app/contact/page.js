"use client";
import { useState, useEffect } from "react";
import { CinematicPageNav } from "../components/CinematicPageShell";

function CalendlyEmbed() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = () => setLoaded(true);
    document.head.appendChild(s);
  }, []);
  return (
    <div className="calendly-inline-widget"
      data-url="https://calendly.com/trellzp12/30min?hide_landing_page_details=1&hide_gdpr_banner=1"
      style={{ minWidth: 320, height: loaded ? 700 : 200, transition: "height 0.5s ease" }} />
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "", interest: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:support@kaizencapitalgrp.com?subject=Investor Inquiry from ${form.name}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nInterest: ${form.interest}\n\n${form.message}`)}`;
    setSent(true);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { background: #050810; color: #fff; margin: 0; }
        .glass { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; backdrop-filter:blur(16px); }
        .scene-label { font-family:sans-serif; font-size:10px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:rgba(159,180,193,0.45); margin-bottom:16px; display:flex; align-items:center; gap:10px; }
        .scene-label::before { content:""; width:24px; height:1px; background:rgba(159,180,193,0.25); }
        .c-input { width:100%; padding:14px 16px; border-radius:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); color:#fff; font-family:sans-serif; font-size:14px; outline:none; transition:border-color 0.2s ease; }
        .c-input:focus { border-color:rgba(159,180,193,0.4); }
        .c-input::placeholder { color:rgba(255,255,255,0.2); }
        .c-label { font-family:sans-serif; font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(159,180,193,0.5); display:block; margin-bottom:8px; }
        .divider { height:1px; background:linear-gradient(90deg,transparent,rgba(159,180,193,0.1),transparent); }
      `}</style>

      <CinematicPageNav />

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(1.5rem,8vw,80px) 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 100% 80% at 50% 80%, rgba(12,26,48,0.7) 0%, #050810 65%)" }} />
        <div style={{ position: "absolute", top: "30%", right: "15%", width: "30vw", height: "30vw", maxWidth: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(50,100,180,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="scene-label">Get in Touch</p>
          <h1 style={{ fontFamily: "sans-serif", fontSize: "clamp(3rem,7vw,7rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 1rem", lineHeight: 1.0 }}>
            Let's talk<br />
            <span style={{ background: "linear-gradient(135deg,#9FB4C1,#fff,#C9D8E2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>capital.</span>
          </h1>
          <p style={{ fontFamily: "sans-serif", fontSize: "clamp(0.95rem,1.3vw,1.1rem)", color: "rgba(255,255,255,0.35)", lineHeight: 1.8, maxWidth: 500, margin: 0 }}>KCG is selective with who we work with. If you're serious about capital, book a call or reach out directly.</p>
        </div>
      </section>

      <div className="divider" />

      {/* Main contact grid */}
      <section style={{ padding: "80px clamp(1.5rem,5vw,3rem)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 48, alignItems: "start" }}>

          {/* Left — details + form */}
          <div>
            <p className="scene-label">Direct Contact</p>
            <h2 style={{ fontFamily: "sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#fff", margin: "0 0 2rem", letterSpacing: "-0.02em" }}>Reach out directly.</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
              {[
                { icon: "✉️", label: "Email", value: "support@kaizencapitalgrp.com", href: "mailto:support@kaizencapitalgrp.com" },
                { icon: "✈️", label: "Telegram", value: "@trellz_P", href: "https://t.me/trellz_P" },
                { icon: "💬", label: "Community", value: "t.me/KaizenCapitalGroup", href: "https://t.me/KaizenCapitalGroup" },
                { icon: "🎮", label: "Discord", value: "discord.gg/rJWSD6dhWm", href: "https://discord.gg/rJWSD6dhWm" },
              ].map(c => (
                <a key={c.label} href={c.href} target={c.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
                  className="glass" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, textDecoration: "none", transition: "border-color 0.2s ease" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                  <span style={{ fontSize: 18 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)" }}>{c.label}</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", fontWeight: 500, marginTop: 2 }}>{c.value}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.2)", fontSize: 16 }}>↗</span>
                </a>
              ))}
            </div>

            {/* Quick form */}
            <p className="scene-label">Quick Message</p>
            {sent ? (
              <div className="glass" style={{ padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, color: "#00E87A", margin: "0 0 8px" }}>Message sent!</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>We'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label className="c-label">Name</label>
                    <input className="c-input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="c-label">Email</label>
                    <input type="email" className="c-input" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <label className="c-label">Interest</label>
                  <select className="c-input" style={{ appearance: "none" }} value={form.interest} onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}>
                    <option value="">Select your interest...</option>
                    <option>Copy Trading / Signal Subscription</option>
                    <option>Capital Allocation</option>
                    <option>Strategic Partnership</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="c-label">Message</label>
                  <textarea className="c-input" rows={4} placeholder="Tell us about your goals..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ resize: "vertical" }} required />
                </div>
                <button type="submit" style={{ padding: "14px", borderRadius: 100, background: "#fff", color: "#050810", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Right — Calendly */}
          <div>
            <p className="scene-label">Schedule a Call</p>
            <h2 style={{ fontFamily: "sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#fff", margin: "0 0 2rem", letterSpacing: "-0.02em" }}>Book a 30-minute call.</h2>
            <div className="glass" style={{ padding: 24, overflow: "hidden" }}>
              <CalendlyEmbed />
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Legal links */}
      <footer style={{ padding: "32px clamp(1.5rem,5vw,3rem)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} Kaizen Capital Group</span>
        <div style={{ display: "flex", gap: 20 }}>
          {[{ href: "/privacy", label: "Privacy Policy" }, { href: "/disclaimer", label: "Risk Disclaimer" }].map(l => (
            <a key={l.href} href={l.href} style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>{l.label}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
