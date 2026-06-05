"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function CinematicPageNav() {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <>
      <style>{`
        .cpn-links { display: flex; gap: 2px; align-items: center; }
        .cpn-cta { margin-left: 8px; padding: 8px 18px; border-radius: 100px; background: #fff; color: #050810; font-family: sans-serif; font-size: 12px; font-weight: 700; text-decoration: none; transition: all 0.2s ease; white-space: nowrap; }
        .cpn-cta:hover { transform: scale(1.05); }
        .cpn-hamburger { display: none; flex-direction: column; gap: 5px; padding: 8px; cursor: pointer; background: none; border: none; }
        .cpn-hamburger span { width: 20px; height: 1.5px; background: rgba(255,255,255,0.7); display: block; }
        .cpn-mobile { position: fixed; inset: 0; z-index: 8999; background: rgba(5,8,16,0.97); backdrop-filter: blur(24px); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
        .cpn-mobile a { font-size: 1.8rem; font-weight: 700; color: rgba(255,255,255,0.8); text-decoration: none; font-family: sans-serif; letter-spacing: -0.02em; transition: color 0.2s; }
        .cpn-mobile a:hover { color: #fff; }
        @media (max-width: 820px) {
          .cpn-links { display: none !important; }
          .cpn-cta { display: none !important; }
          .cpn-hamburger { display: flex !important; }
        }
      `}</style>

      <nav ref={navRef} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9000,
        padding: "0 clamp(1rem,4vw,3rem)", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.4s ease",
        borderBottom: "1px solid transparent",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#9FB4C1,#0C1A30,#C9D8E2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#fff", fontFamily: "sans-serif", flexShrink: 0 }}>KCG</div>
          <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Kaizen Capital</span>
        </Link>

        <div className="cpn-links">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{ padding: "6px 12px", borderRadius: 100, fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "all 0.2s ease", whiteSpace: "nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "transparent"; }}>
              {l.label}
            </Link>
          ))}
          <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" className="cpn-cta">Get Started</a>
        </div>

        <button className="cpn-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span />
        </button>
      </nav>

      {menuOpen && (
        <div className="cpn-mobile" onClick={() => setMenuOpen(false)}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" style={{ color: "#9FB4C1", fontSize: "1.2rem" }}>Get Started ↗</a>
        </div>
      )}
    </>
  );
}
