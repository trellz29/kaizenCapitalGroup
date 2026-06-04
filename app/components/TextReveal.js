"use client";
import { useEffect, useRef, useState } from "react";

export default function TextReveal({ children, as: Tag = "h2", className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.2, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const text = typeof children === "string" ? children : "";
  if (!text) {
    return <Tag ref={ref} className={className}>{children}</Tag>;
  }

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} style={{ overflow: "hidden" }} aria-label={text}>
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ display: "inline-block", overflow: "hidden", marginRight: "0.28em" }}
        >
          <span
            style={{
              display: "inline-block",
              transform: visible ? "translateY(0)" : "translateY(110%)",
              opacity: visible ? 1 : 0,
              transition: `transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay + wi * 55}ms, opacity 0.6s ease ${delay + wi * 55}ms`,
              willChange: "transform",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
