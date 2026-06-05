"use client";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#funds", label: "Funds" },
  { href: "#market-data", label: "Markets" },
  { href: "#investor-funnel", label: "Investors" },
  { href: "#contact", label: "Contact" },
];

export default function CinematicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{`
        .cnav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 9000;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .cnav-inner {
          margin: 16px auto 0;
          max-width: 1200px;
          padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          height: 52px;
          border-radius: 100px;
          background: rgba(5,8,16,0.0);
          border: 1px solid rgba(255,255,255,0);
          backdrop-filter: blur(0px);
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .cnav-inner.scrolled {
          background: rgba(5,8,16,0.85);
          border-color: rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
        }
        .cnav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .cnav-logo-ring {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #9FB4C1, #0C1A30, #C9D8E2);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; color: #fff;
          font-family: sans-serif; letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .cnav-logo-text {
          font-size: 12px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.75);
          font-family: sans-serif;
        }
        .cnav-links { display: flex; align-items: center; gap: 2px; }
        .cnav-link {
          padding: 6px 14px; border-radius: 100px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
          color: rgba(255,255,255,0.45); text-decoration: none;
          transition: all 0.2s ease; font-family: sans-serif;
        }
        .cnav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .cnav-cta {
          padding: 8px 20px; border-radius: 100px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
          background: #fff; color: #050810;
          text-decoration: none; font-family: sans-serif;
          transition: all 0.2s ease;
        }
        .cnav-cta:hover { background: rgba(255,255,255,0.85); transform: scale(1.04); }
        @media (max-width: 768px) {
          .cnav-links, .cnav-cta { display: none; }
          .cnav-hamburger { display: flex !important; }
        }
        .cnav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          padding: 8px; cursor: pointer; background: none; border: none;
        }
        .cnav-hamburger span {
          width: 20px; height: 1.5px; background: rgba(255,255,255,0.7);
          transition: all 0.2s ease; display: block;
        }
        .cnav-mobile {
          position: fixed; inset: 0; z-index: 8999;
          background: rgba(5,8,16,0.97); backdrop-filter: blur(24px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 24px;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .cnav-mobile a {
          font-size: 2rem; font-weight: 700; color: rgba(255,255,255,0.8);
          text-decoration: none; font-family: sans-serif; letter-spacing: -0.02em;
          transition: color 0.2s ease;
        }
        .cnav-mobile a:hover { color: #fff; }
      `}</style>

      <nav className="cnav">
        <div className={`cnav-inner${scrolled ? " scrolled" : ""}`}>
          <a href="#" className="cnav-logo">
            <div className="cnav-logo-ring">KCG</div>
            <span className="cnav-logo-text">Kaizen Capital</span>
          </a>

          <div className="cnav-links">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} className="cnav-link">{l.label}</a>
            ))}
          </div>

          <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" className="cnav-cta">
            Get Started
          </a>

          <button className="cnav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="cnav-mobile" onClick={() => setMenuOpen(false)}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" style={{ color: "#9FB4C1" }}>Get Started ↗</a>
        </div>
      )}
    </>
  );
}
