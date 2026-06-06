"use client";
import { useEffect, useRef, useState } from "react";

const WORDS = ["Analyse", "Execute", "Compound", "Protect", "Deliver"];

export default function CinematicLoader({ onComplete }) {
  const containerRef = useRef(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Count up to 100
    let frame = 0;
    const total = 100;
    const tick = () => {
      frame++;
      setCount(Math.min(Math.round((frame / total) * 100), 100));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Cycle words
    const wordInterval = setInterval(() => {
      setWordIdx(i => (i + 1) % WORDS.length);
    }, 480);

    // Exit after 2.6s — CSS transition, no GSAP dependency
    const exitTimer = setTimeout(() => {
      clearInterval(wordInterval);
      setExiting(true);
      // Call onComplete after transition finishes
      setTimeout(() => { onComplete && onComplete(); }, 700);
    }, 2600);

    return () => {
      clearInterval(wordInterval);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#050810",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.04)" : "scale(1)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        pointerEvents: exiting ? "none" : "all",
      }}
    >
      {/* Progress bar */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"rgba(255,255,255,0.06)" }}>
        <div style={{
          height:"100%",
          background:"linear-gradient(90deg, transparent, rgba(159,180,193,0.8), transparent)",
          width:`${count}%`,
          transition:"width 0.04s linear",
        }}/>
      </div>

      {/* Cycling word */}
      <div style={{
        fontFamily:"sans-serif",
        fontSize:"clamp(3rem,8vw,7rem)",
        fontWeight:800,
        letterSpacing:"-0.04em",
        color:"rgba(255,255,255,0.07)",
        userSelect:"none",
        transition:"opacity 0.15s ease",
      }}>
        {WORDS[wordIdx]}
      </div>

      {/* Counter */}
      <div style={{
        position:"absolute", bottom:20, right:28,
        fontFamily:"sans-serif", fontSize:11, fontWeight:700,
        letterSpacing:"0.2em", color:"rgba(255,255,255,0.2)",
      }}>
        {String(count).padStart(3, "0")}
      </div>

      {/* Brand */}
      <div style={{
        position:"absolute", bottom:20, left:28,
        fontFamily:"sans-serif", fontSize:11, fontWeight:700,
        letterSpacing:"0.28em", color:"rgba(255,255,255,0.18)",
        textTransform:"uppercase",
      }}>
        Kaizen Capital Group
      </div>
    </div>
  );
}
