"use client";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#overview",       label: "Overview" },
  { href: "#funds",          label: "Funds" },
  { href: "#market-data",    label: "Markets" },
  { href: "#investor-funnel",label: "Investors" },
  { href: "#contact",        label: "Contact" },
  { href: "/performance",    label: "Platform" },
  { href: "/about",          label: "About" },
];

export default function CinematicNav() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [activeHref, setActive]   = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .cnav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 9000;
          pointer-events: none;
          padding-top: 16px;
        }
        .cnav-inner {
          pointer-events: all;
          margin: 0 auto;
          max-width: 1320px;
          padding: 0 28px;
          display: flex; align-items: center; gap: 0;
          height: 64px;
          border-radius: 16px;
          background: rgba(5,8,16,0.0);
          border: 1px solid rgba(255,255,255,0);
          backdrop-filter: blur(0px);
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .cnav-inner.scrolled {
          background: rgba(5,8,16,0.92);
          border-color: rgba(255,255,255,0.08);
          backdrop-filter: blur(28px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        /* Logo */
        .cnav-logo {
          display: flex; align-items: center; gap: 9px;
          text-decoration: none; flex-shrink: 0; margin-right: 8px;
        }
        .cnav-logo-ring {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, #9FB4C1, #0C1A30, #C9D8E2);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: #fff;
          font-family: sans-serif; letter-spacing: -0.02em; flex-shrink: 0;
        }
        .cnav-logo-text {
          font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase; color: rgba(255,255,255,0.75);
          font-family: sans-serif; white-space: nowrap;
        }

        /* Links */
        .cnav-links {
          display: flex; align-items: center; gap: 0;
          flex: 1; justify-content: center;
        }
        .cnav-link {
          padding: 6px 12px; border-radius: 100px;
          font-size: 11.5px; font-weight: 600; letter-spacing: 0.02em;
          color: rgba(255,255,255,0.48); text-decoration: none;
          transition: all 0.2s ease; font-family: sans-serif;
          white-space: nowrap; position: relative;
        }
        .cnav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .cnav-link.active { color: rgba(255,255,255,0.9); }
        .cnav-link.active::after {
          content: ""; position: absolute; bottom: 2px; left: 50%;
          transform: translateX(-50%); width: 16px; height: 1.5px;
          background: rgba(100,150,200,0.8); border-radius: 2px;
        }

        /* CTA */
        .cnav-cta {
          flex-shrink: 0; margin-left: 8px;
          padding: 7px 16px; border-radius: 100px;
          font-size: 11.5px; font-weight: 700; letter-spacing: 0.04em;
          background: #fff; color: #050810;
          text-decoration: none; font-family: sans-serif;
          transition: all 0.2s ease; white-space: nowrap;
        }
        .cnav-cta:hover { background: rgba(255,255,255,0.88); transform: scale(1.03); }

        /* Hamburger */
        .cnav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          padding: 8px; cursor: pointer; background: none; border: none;
          margin-left: auto;
        }
        .cnav-hamburger span {
          width: 20px; height: 1.5px; background: rgba(255,255,255,0.7);
          display: block; transition: all 0.2s ease;
        }

        @media (max-width: 900px) {
          .cnav-links, .cnav-cta { display: none !important; }
          .cnav-hamburger { display: flex !important; }
          .cnav-logo-text { display: none; }
        }

        /* Mobile menu */
        .cnav-mobile {
          position: fixed; inset: 0; z-index: 8999;
          background: rgba(5,8,16,0.97); backdrop-filter: blur(24px);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px;
        }
        .cnav-mobile a {
          font-size: 1.8rem; font-weight: 700; color: rgba(255,255,255,0.75);
          text-decoration: none; font-family: sans-serif;
          letter-spacing: -0.02em; transition: color 0.2s ease;
        }
        .cnav-mobile a:hover { color: #fff; }
        .cnav-mobile-cta {
          font-size: 1rem !important; color: #9FB4C1 !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          padding: 10px 28px; border-radius: 100px; margin-top: 8px;
        }
      `}</style>

      <nav className="cnav">
        <div className={`cnav-inner${scrolled ? " scrolled" : ""}`}>

          {/* Logo */}
          <a href="#" className="cnav-logo">
            <div className="cnav-logo-ring">KCG</div>
            <span className="cnav-logo-text">Kaizen Capital</span>
          </a>

          {/* Nav links — centred */}
          <div className="cnav-links">
            {LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={`cnav-link${activeHref === l.href ? " active" : ""}`}
                onClick={() => setActive(l.href)}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://calendly.com/trellzp12/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="cnav-cta"
          >
            Get Started
          </a>

          {/* Hamburger */}
          <button
            className="cnav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="cnav-mobile" onClick={() => setMenuOpen(false)}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            href="https://calendly.com/trellzp12/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="cnav-mobile-cta"
          >
            Get Started ↗
          </a>
        </div>
      )}
    </>
  );
}
