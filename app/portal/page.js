"use client";
import { useState } from "react";
import Link from "next/link";

export default function Portal() {
  const [tab, setTab] = useState("login");

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { background: #050810; color: #fff; margin: 0; }
        .glass { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; backdrop-filter:blur(16px); }
        .portal-input {
          width:100%; padding:14px 16px; border-radius:12px;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
          color:#fff; font-family:sans-serif; font-size:14px; outline:none;
          transition:border-color 0.2s ease;
        }
        .portal-input:focus { border-color:rgba(159,180,193,0.4); }
        .portal-input::placeholder { color:rgba(255,255,255,0.2); }
        .portal-btn {
          width:100%; padding:14px; border-radius:12px;
          background:#fff; color:#050810;
          font-family:sans-serif; font-size:14px; font-weight:700;
          border:none; cursor:pointer; transition:all 0.2s ease;
        }
        .portal-btn:hover { background:rgba(255,255,255,0.88); transform:scale(1.02); }
        .portal-tab { padding:8px 20px; border-radius:100px; font-family:sans-serif; font-size:13px; font-weight:600; cursor:pointer; border:none; transition:all 0.2s ease; }
        .portal-tab.active { background:rgba(255,255,255,0.1); color:#fff; }
        .portal-tab.inactive { background:transparent; color:rgba(255,255,255,0.35); }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9000, padding: "16px 24px", background: "rgba(5,8,16,0.9)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#9FB4C1,#0C1A30,#C9D8E2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", fontFamily: "sans-serif" }}>KCG</div>
          <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Kaizen Capital</span>
        </Link>
        <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>← Back to HQ</Link>
      </nav>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(12,26,48,0.6) 0%, #050810 70%)", pointerEvents: "none" }} />

      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px", position: "relative", zIndex: 1 }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#9FB4C1,#0C1A30,#C9D8E2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: "sans-serif", margin: "0 auto 16px" }}>KCG</div>
          <h1 style={{ fontFamily: "sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 4px" }}>Investor Portal</h1>
          <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>Private access for KCG investors</p>
        </div>

        {/* Card */}
        <div className="glass" style={{ width: "100%", maxWidth: 420, padding: 40 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 100, padding: 4, marginBottom: 32 }}>
            <button className={`portal-tab ${tab === "login" ? "active" : "inactive"}`} style={{ flex: 1 }} onClick={() => setTab("login")}>Sign In</button>
            <button className={`portal-tab ${tab === "apply" ? "active" : "inactive"}`} style={{ flex: 1 }} onClick={() => setTab("apply")}>Apply for Access</button>
          </div>

          {tab === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)", display: "block", marginBottom: 8 }}>Email Address</label>
                <input type="email" className="portal-input" placeholder="investor@example.com" />
              </div>
              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)", display: "block", marginBottom: 8 }}>Access Code</label>
                <input type="password" className="portal-input" placeholder="••••••••" />
              </div>
              <button className="portal-btn" style={{ marginTop: 8 }}>Access Portal →</button>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", margin: 0 }}>
                Don't have access?{" "}
                <button onClick={() => setTab("apply")} style={{ background: "none", border: "none", color: "rgba(159,180,193,0.7)", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer", padding: 0, textDecoration: "underline" }}>Apply here</button>
              </p>
            </div>
          )}

          {tab === "apply" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "rgba(0,232,120,0.06)", border: "1px solid rgba(0,232,120,0.15)", borderRadius: 12, padding: "14px 16px", marginBottom: 4 }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(0,232,120,0.8)", margin: 0, lineHeight: 1.6 }}>Portal access is by invitation and qualification only. Submit your details and a KCG representative will be in touch.</p>
              </div>
              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)", display: "block", marginBottom: 8 }}>Full Name</label>
                <input type="text" className="portal-input" placeholder="Your full name" />
              </div>
              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)", display: "block", marginBottom: 8 }}>Email Address</label>
                <input type="email" className="portal-input" placeholder="your@email.com" />
              </div>
              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)", display: "block", marginBottom: 8 }}>Telegram Handle</label>
                <input type="text" className="portal-input" placeholder="@yourhandle" />
              </div>
              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(159,180,193,0.5)", display: "block", marginBottom: 8 }}>Investment Interest</label>
                <select className="portal-input" style={{ appearance: "none" }}>
                  <option value="">Select your interest...</option>
                  <option>Copy Trading / Signal Subscription</option>
                  <option>Capital Allocation ($10k–$50k)</option>
                  <option>Capital Allocation ($50k+)</option>
                  <option>Strategic Partnership</option>
                  <option>Fund Management Discussion</option>
                </select>
              </div>
              <a href="mailto:support@kaizencapitalgrp.com?subject=Portal Access Request" className="portal-btn" style={{ textDecoration: "none", textAlign: "center", display: "block", marginTop: 8 }}>Submit Application →</a>
            </div>
          )}
        </div>

        {/* Trust signals */}
        <div style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {["🔒 Encrypted", "✓ Verified Brokerages", "🏛️ Institutional Grade"].map(t => (
            <span key={t} style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>{t}</span>
          ))}
        </div>
      </main>
    </>
  );
}
