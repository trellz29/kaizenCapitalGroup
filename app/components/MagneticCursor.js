"use client";
import { useEffect, useRef, useState } from "react";

export default function MagneticCursor() {
  const cursorRef = useRef(null);
  const trailsRef = useRef([]);
  const posRef = useRef({ x: -200, y: -200 });
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    setVisible(true);

    const TRAIL_COUNT = 8;
    const trail = trailsRef.current;

    const positions = Array(TRAIL_COUNT).fill(null).map(() => ({ x: -200, y: -200 }));

    let raf;
    const tick = () => {
      const mx = posRef.current.x;
      const my = posRef.current.y;

      positions[0].x += (mx - positions[0].x) * 0.28;
      positions[0].y += (my - positions[0].y) * 0.28;

      for (let i = 1; i < TRAIL_COUNT; i++) {
        positions[i].x += (positions[i-1].x - positions[i].x) * 0.38;
        positions[i].y += (positions[i-1].y - positions[i].y) * 0.38;
        if (trail[i]) {
          const scale = 1 - i / TRAIL_COUNT;
          trail[i].style.transform = `translate(${positions[i].x}px, ${positions[i].y}px) translate(-50%,-50%) scale(${scale})`;
          trail[i].style.opacity = String((1 - i / TRAIL_COUNT) * 0.35);
        }
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      }

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onEnterLink = (e) => {
      const el = e.currentTarget;
      setLabel(el.dataset.cursorLabel || "");
      if (cursorRef.current) {
        cursorRef.current.classList.add("kcg-cur-hover");
      }
    };
    const onLeaveLink = () => {
      setLabel("");
      if (cursorRef.current) {
        cursorRef.current.classList.remove("kcg-cur-hover");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    const attachLinks = () => {
      document.querySelectorAll("a, button").forEach(el => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };
    attachLinks();
    const obs = new MutationObserver(attachLinks);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      obs.disconnect();
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        @media (max-width: 768px) { * { cursor: auto !important; } .kcg-cur, .kcg-cur-dot { display:none !important; } }
        .kcg-cur {
          position: fixed; top: 0; left: 0;
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1.5px solid rgba(15,26,40,0.6);
          pointer-events: none; z-index: 99999;
          transition: width 0.2s ease, height 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          display: flex; align-items: center; justify-content: center;
          will-change: transform;
          mix-blend-mode: multiply;
        }
        .kcg-cur.kcg-cur-hover {
          width: 64px; height: 64px;
          background: rgba(15,26,40,0.08);
          border-color: rgba(15,26,40,0.9);
        }
        .kcg-cur-label {
          font-size: 9px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #0F1A28;
          opacity: 0; transition: opacity 0.15s ease;
          white-space: nowrap;
        }
        .kcg-cur.kcg-cur-hover .kcg-cur-label { opacity: 1; }
        .kcg-cur-trail {
          position: fixed; top: 0; left: 0;
          width: 10px; height: 10px;
          background: #0F1A28;
          border-radius: 50%;
          pointer-events: none; z-index: 99998;
          will-change: transform, opacity;
        }
      `}</style>

      {Array(8).fill(null).map((_, i) => (
        <div
          key={i}
          ref={el => { trailsRef.current[i] = el; }}
          className="kcg-cur-trail"
          style={{ width: 10 - i, height: 10 - i }}
        />
      ))}

      <div ref={cursorRef} className="kcg-cur">
        <span className="kcg-cur-label">{label}</span>
      </div>
    </>
  );
}
