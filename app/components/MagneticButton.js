"use client";
import { useRef } from "react";

// Button that physically moves toward the cursor when hovered
export default function MagneticButton({ children, className = "", href, onClick, style = {}, strength = 0.35, target, rel }) {
  const btnRef = useRef(null);
  const rafRef = useRef(null);

  const handleMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
      btn.style.transition = "transform 0.1s ease";
    });
  };

  const handleLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    btn.style.transform = "translate(0,0) scale(1)";
    btn.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
  };

  const props = { ref: btnRef, className, style, onMouseMove: handleMove, onMouseLeave: handleLeave, onClick };
  if (href) return <a {...props} href={href} target={target} rel={rel}>{children}</a>;
  return <button {...props}>{children}</button>;
}
