"use client";
import { useEffect, useRef, useState } from "react";

// Each character animates independently on scroll into view
export default function KineticText({ children, as: Tag = "h2", className = "", stagger = 30, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -20px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const text = typeof children === "string" ? children : "";
  if (!text) return <Tag ref={ref} className={className}>{children}</Tag>;

  let charIdx = 0;
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} aria-label={text} style={{ overflow: "hidden" }}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "pre" }}>
          {word.split("").map((char) => {
            const ci = charIdx++;
            return (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  transform: visible ? "translateY(0) rotateX(0deg)" : "translateY(100%) rotateX(-90deg)",
                  opacity: visible ? 1 : 0,
                  transition: `transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay + ci * stagger}ms, opacity 0.5s ease ${delay + ci * stagger}ms`,
                  transformOrigin: "bottom center",
                  willChange: "transform",
                }}
              >
                {char}
              </span>
            );
          })}
          {wi < words.length - 1 && (
            <span style={{ display: "inline-block", opacity: 0 }}>_</span>
          )}
          {wi < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
