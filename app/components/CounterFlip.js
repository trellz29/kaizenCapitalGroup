"use client";
import { useEffect, useRef, useState } from "react";

// Slot-machine style number flip counter
export default function CounterFlip({ value, prefix = "", suffix = "", duration = 2000, decimals = 0 }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const target = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    let startTime = null;
    let raf;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * target;
      const formatted = decimals > 0
        ? current.toFixed(decimals)
        : Math.floor(current).toLocaleString();
      setDisplay(formatted);
      if (progress < 1) raf = requestAnimationFrame(step);
      else setDisplay(decimals > 0 ? target.toFixed(decimals) : target.toLocaleString());
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, value, duration, decimals]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums", display: "inline-block" }}>
      {prefix}{display}{suffix}
    </span>
  );
}
