"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function CinematicPageNav() {
  const navRef = useRef(null);
  useEffect(() => {
    const fn = () => {
      if (navRef.current) {
        const scrolled = window.scrollY > 40;
        navRef.current.style.background = scrolled ? "rgba(5,8,16,0.92)" : "transparent";
        navRef.current.style.borderBottomColor = scrolled ? "rgba(255,255,255,0.06)" : "transparent";
        navRef.current.style.backdropFilter = scrolled ? "blur(24px)" : "none";
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/funds", label: "Funds" },
    { href: "/performance", label: "Performance" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav ref={navRef} style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9000,
      padding: "0 clamp(1.5rem,5vw,3rem)", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all 0.4s ease",
      borderBottom: "1px solid transparent",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#9FB4C1,#0C1A30,#C9D8E2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#fff", fontFamily: "sans-serif", flexShrink: 0 }}>KCG</div>
        <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Kaizen Capital</span>
      </Link>
      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{ padding: "6px 14px", borderRadius: 100, fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "all 0.2s ease" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "transparent"; }}>
            {l.label}
          </Link>
        ))}
        <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, padding: "8px 18px", borderRadius: 100, background: "#fff", color: "#050810", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, textDecoration: "none", transition: "all 0.2s ease" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
          Get Started
        </a>
      </div>
    </nav>
  );
}
