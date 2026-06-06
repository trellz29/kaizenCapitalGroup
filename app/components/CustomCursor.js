"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onEnterLink = () => {
      dot.style.transform = "translate(-50%,-50%) scale(2.5)";
      ring.style.transform = "translate(-50%,-50%) scale(1.6)";
      ring.style.borderColor = "rgba(255,255,255,0.6)";
      ring.style.background = "rgba(255,255,255,0.05)";
    };

    const onLeaveLink = () => {
      dot.style.transform = "translate(-50%,-50%) scale(1)";
      ring.style.transform = "translate(-50%,-50%) scale(1)";
      ring.style.borderColor = "rgba(255,255,255,0.4)";
      ring.style.background = "transparent";
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      // Dot follows instantly
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
      // Ring lerps behind with spring
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.querySelectorAll("a, button, [role=button], .cursor-pointer").forEach(el => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    // Re-attach on DOM changes
    const obs = new MutationObserver(() => {
      document.querySelectorAll("a, button, [role=button]").forEach(el => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        .cursor-dot {
          position: fixed; top: -100px; left: -100px;
          width: 6px; height: 6px; border-radius: 50%;
          background: #fff;
          pointer-events: none; z-index: 999999;
          transform: translate(-50%, -50%);
          transition: transform 0.15s cubic-bezier(0.16,1,0.3,1), background 0.2s ease;
          will-change: left, top, transform;
        }
        .cursor-ring {
          position: fixed; top: -100px; left: -100px;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.4);
          pointer-events: none; z-index: 999998;
          transform: translate(-50%, -50%);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease, background 0.2s ease;
          will-change: left, top, transform;
          backdrop-filter: blur(0px);
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
