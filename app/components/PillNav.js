"use client";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#overview", label: "Overview" },
  { href: "#market-data", label: "Market Data" },
  { href: "#funds", label: "Funds" },
  { href: "#investor-funnel", label: "Investors" },
  { href: "#social-proof", label: "Proof" },
  { href: "#activity", label: "Activity" },
  { href: "#why-kcg", label: "Why KCG" },
  { href: "#contact-form", label: "Contact" },
  { href: "https://t.me/KaizenCapitalGroup", label: "Community", external: true },
];

export default function PillNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = LINKS.filter(l => l.href.startsWith("#")).map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const css = `
    @keyframes kcgGradRing {
      0%,100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    .kcg-pill-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      display: flex; justify-content: center;
      padding: 16px 16px 0; pointer-events: none;
    }
    .kcg-pill-inner {
      display: inline-flex; align-items: center; gap: 2px;
      background: rgba(9,18,30,0.88);
      backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255,255,255,0.08); border-radius: 100px;
      padding: 5px 6px; pointer-events: all;
      transition: box-shadow 0.3s ease;
    }
    .kcg-pill-inner.scrolled {
      box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(34,158,217,0.1);
    }
    .kcg-logo-btn {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg,#229ED9,#5865F2,#229ED9);
      background-size: 200% 200%;
      animation: kcgGradRing 4s ease infinite;
      display: flex; align-items: center; justify-content: center;
      margin-right: 4px; cursor: pointer;
      transition: transform 0.2s ease; border: none; padding: 0;
      text-decoration: none; flex-shrink: 0;
    }
    .kcg-logo-btn:hover { transform: scale(1.1); }
    .kcg-logo-inner {
      width: 28px; height: 28px; border-radius: 50%;
      background: #07111e; display: flex; align-items: center; justify-content: center;
    }
    .kcg-logo-text { font-size: 8px; font-weight: 900; color: #fff; font-family: sans-serif; }
    .kcg-divider { width: 1px; height: 20px; background: rgba(255,255,255,0.08); margin: 0 4px; flex-shrink: 0; }
    .kcg-nav-link {
      font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.45);
      padding: 6px 12px; border-radius: 100px; text-decoration: none;
      white-space: nowrap; transition: color 0.2s ease, background 0.2s ease;
      font-family: sans-serif;
    }
    .kcg-nav-link:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.06); }
    .kcg-nav-link.active { color: #fff; background: rgba(255,255,255,0.1); }
    .kcg-cta-btn {
      font-size: 12px; font-weight: 600; color: #fff; font-family: sans-serif;
      padding: 6px 14px; border-radius: 100px;
      background: linear-gradient(135deg,#229ED9,#5865F2);
      text-decoration: none; white-space: nowrap;
      transition: opacity 0.2s ease, transform 0.2s ease; margin-left: 4px;
    }
    .kcg-cta-btn:hover { opacity: 0.88; transform: scale(1.03); }
    @media (max-width: 900px) { .kcg-hide-md { display: none !important; } }
    @media (max-width: 600px) { .kcg-hide-sm { display: none !important; } .kcg-nav-link { padding: 6px 8px; font-size: 11px; } }
  `;

  return (
    <>
      <style>{css}</style>
      <nav className="kcg-pill-nav">
        <div className={"kcg-pill-inner" + (scrolled ? " scrolled" : "")}>
          <a href="#home" className="kcg-logo-btn" aria-label="KCG Home">
            <div className="kcg-logo-inner">
              <span className="kcg-logo-text">KCG</span>
            </div>
          </a>
          <div className="kcg-divider" />
          {LINKS.slice(0, 5).map(l => (
            <a key={l.href} href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className={"kcg-nav-link" +
                (active === l.href.slice(1) ? " active" : "") +
                (["Market Data","Investors","Proof"].includes(l.label) ? " kcg-hide-md" : "") +
                (["Activity","Why KCG"].includes(l.label) ? " kcg-hide-sm" : "")}
            >{l.label}</a>
          ))}
          <div className="kcg-divider kcg-hide-sm" />
          <a href="https://calendly.com/trellzp12/30min" target="_blank" rel="noopener noreferrer" className="kcg-cta-btn">
            Get Started
          </a>
        </div>
      </nav>
    </>
  );
}
