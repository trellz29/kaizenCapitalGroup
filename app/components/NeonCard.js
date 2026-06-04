"use client";
import { useRef } from "react";

// Card with animated neon border that traces the cursor position
export default function NeonCard({ children, className = "", style = {}, color = "159,180,193", intensity = 12 }) {
  const cardRef = useRef(null);
  const borderRef = useRef(null);
  const rafRef = useRef(null);

  const handleMove = (e) => {
    const card = cardRef.current;
    const border = borderRef.current;
    if (!card || !border) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -intensity;
    const rotY = ((x - cx) / cx) * intensity;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      card.style.transition = "transform 0.08s ease";
      border.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(${color},0.35) 0%, rgba(${color},0.05) 50%, transparent 100%)`;
      border.style.opacity = "1";
    });
  };

  const handleLeave = () => {
    const card = cardRef.current;
    const border = borderRef.current;
    if (!card) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    card.style.transform = "perspective(700px) rotateX(0) rotateY(0) scale(1)";
    card.style.transition = "transform 0.7s cubic-bezier(0.16,1,0.3,1)";
    if (border) border.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={{ ...style, position: "relative", willChange: "transform", transformStyle: "preserve-3d" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Neon glow border */}
      <div
        ref={borderRef}
        style={{
          position: "absolute", inset: 0,
          borderRadius: "inherit",
          opacity: 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Animated border line */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "inherit",
        padding: "1px",
        background: `linear-gradient(135deg, rgba(${color},0.4), rgba(${color},0.05), rgba(${color},0.4))`,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
