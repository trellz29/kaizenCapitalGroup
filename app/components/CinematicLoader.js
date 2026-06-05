"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const WORDS = ["Analyse", "Execute", "Compound", "Protect", "Deliver"];

export default function CinematicLoader({ onComplete }) {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const wordRef = useRef(null);
  const countRef = useRef(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const total = 120;
    const countUp = () => {
      frame++;
      setCount(Math.min(Math.round((frame / total) * 100), 100));
      if (frame < total) requestAnimationFrame(countUp);
    };
    requestAnimationFrame(countUp);

    const wordInterval = setInterval(() => {
      setWordIdx(i => (i + 1) % WORDS.length);
    }, 480);

    const timer = setTimeout(() => {
      clearInterval(wordInterval);
      const el = containerRef.current;
      if (!el) return;
      gsap.to(el, {
        opacity: 0,
        scale: 1.04,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete,
      });
    }, 2600);

    return () => { clearInterval(wordInterval); clearTimeout(timer); };
  }, [onComplete]);

  return (
    <div ref={containerRef} style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "#050810",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 0,
    }}>
      {/* Line */}
      <div style={{ width: "100%", position: "absolute", bottom: 0, left: 0, height: 1, background: "rgba(255,255,255,0.06)" }}>
        <div ref={lineRef} style={{
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(159,180,193,0.8), transparent)",
          width: `${count}%`,
          transition: "width 0.05s linear",
        }} />
      </div>

      {/* Word */}
      <div ref={wordRef} style={{
        fontFamily: "sans-serif",
        fontSize: "clamp(3rem, 8vw, 7rem)",
        fontWeight: 800,
        letterSpacing: "-0.04em",
        color: "rgba(255,255,255,0.08)",
        userSelect: "none",
        transition: "opacity 0.15s ease",
      }}>
        {WORDS[wordIdx]}
      </div>

      {/* Counter */}
      <div style={{
        position: "absolute",
        bottom: 24,
        right: 32,
        fontFamily: "sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.2)",
      }}>
        {String(count).padStart(3, "0")}
      </div>

      {/* Brand */}
      <div style={{
        position: "absolute",
        bottom: 24,
        left: 32,
        fontFamily: "sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.28em",
        color: "rgba(255,255,255,0.18)",
        textTransform: "uppercase",
      }}>
        Kaizen Capital Group
      </div>
    </div>
  );
}
