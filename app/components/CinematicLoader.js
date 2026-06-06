"use client";
import { useEffect, useRef, useState } from "react";

const WORDS = ["Analyse", "Execute", "Compound", "Protect", "Deliver"];

export default function CinematicLoader({ onComplete }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [count, setCount]     = useState(0);
  const [opacity, setOpacity] = useState(1);

  // Force a repaint on mount so the loader is guaranteed visible
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    // Count 0 → 100 over ~2.2s
    let frame = 0;
    const total = 130;
    const tick = () => {
      frame++;
      setCount(Math.min(Math.round((frame / total) * 100), 100));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Cycle words
    const wordInterval = setInterval(() => {
      setWordIdx(i => (i + 1) % WORDS.length);
    }, 450);

    // Fade out at 2.6s
    const fadeTimer = setTimeout(() => {
      clearInterval(wordInterval);
      setOpacity(0);
      // Unmount after fade
      setTimeout(() => { onComplete && onComplete(); }, 750);
    }, 2600);

    return () => {
      clearInterval(wordInterval);
      clearTimeout(fadeTimer);
    };
  }, [onComplete]);

  // Render immediately — don't wait for mounted state to gate visibility
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 999999,
      background: "#050810",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      opacity,
      transform: opacity < 1 ? "scale(1.03)" : "scale(1)",
      transition: opacity < 1 ? "opacity 0.75s ease, transform 0.75s ease" : "none",
      pointerEvents: opacity < 1 ? "none" : "all",
      boxSizing: "border-box",
    }}>

      {/* Progress bar at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 1, background: "rgba(255,255,255,0.06)",
      }}>
        <div style={{
          height: "100%",
          width: `${count}%`,
          background: "linear-gradient(90deg, transparent, rgba(159,180,193,0.9), transparent)",
          transition: "width 0.04s linear",
        }} />
      </div>

      {/* Cycling word */}
      <div style={{
        fontFamily: "sans-serif",
        fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
        fontWeight: 800,
        letterSpacing: "-0.04em",
        color: "rgba(255,255,255,0.07)",
        userSelect: "none",
      }}>
        {WORDS[wordIdx]}
      </div>

      {/* KCG wordmark */}
      <div style={{
        marginTop: 20,
        fontFamily: "sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.35em",
        color: "rgba(255,255,255,0.12)",
        textTransform: "uppercase",
      }}>
        KCG
      </div>

      {/* Counter — bottom right */}
      <div style={{
        position: "absolute", bottom: 20, right: 28,
        fontFamily: "monospace", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.15em", color: "rgba(255,255,255,0.18)",
      }}>
        {String(count).padStart(3, "0")}
      </div>

      {/* Brand — bottom left */}
      <div style={{
        position: "absolute", bottom: 20, left: 28,
        fontFamily: "sans-serif", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.28em", color: "rgba(255,255,255,0.15)",
        textTransform: "uppercase",
      }}>
        Kaizen Capital Group
      </div>
    </div>
  );
}
