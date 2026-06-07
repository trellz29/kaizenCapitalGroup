"use client";
import { useEffect, useRef, useState } from "react";

export default function SlideReveal({ children, direction = "left", className = "", delay = 0, style = {}, id, stagger = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const xStart = direction === "left" ? "-40px" : direction === "right" ? "40px" : "0px";
  const yStart = direction === "up" ? "50px" : direction === "down" ? "-50px" : "0px";

  return (
    <div ref={ref} id={id} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate(0,0)" : `translate(${xStart},${yStart})`,
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      willChange: "opacity, transform",
      ...style,
    }}>
      {children}
    </div>
  );
}
