"use client";
import { useRef } from "react";

export default function TiltCard({ children, className = "", style = {}, intensity = 12 }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const rafRef = useRef(null);

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -intensity;
    const rotY = ((x - cx) / cx) * intensity;

    // Glow follows cursor
    if (glowRef.current) {
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(159,180,193,0.2) 0%, transparent 60%)`;
      glowRef.current.style.opacity = "1";
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      card.style.transition = "transform 0.08s ease";
      card.style.boxShadow = `${-rotY * 1.5}px ${rotX * 1.5}px 40px rgba(15,26,40,0.18)`;
    });
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.transition = "transform 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.7s ease";
    card.style.boxShadow = "";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={{ ...style, willChange: "transform", transformStyle: "preserve-3d", position: "relative" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        ref={glowRef}
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit",
          opacity: 0, transition: "opacity 0.3s ease", pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
