"use client";
import { useEffect, useRef, useState } from "react";

export default function StaggerGrid({ children, className = "", staggerMs = 80, threshold = 0.05, style = {} }) {
  const ref = useRef(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const childArray = Array.isArray(children) ? children : [children];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          let count = 0;
          const iv = setInterval(() => {
            count++;
            setVisibleCount(count);
            if (count >= childArray.length) clearInterval(iv);
          }, staggerMs);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [childArray.length, staggerMs, threshold]);

  return (
    <div ref={ref} className={className} style={style}>
      {childArray.map((child, i) => (
        <div key={i} style={{
          opacity: i < visibleCount ? 1 : 0,
          transform: i < visibleCount ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
          transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
          willChange: "opacity, transform",
        }}>
          {child}
        </div>
      ))}
    </div>
  );
}
