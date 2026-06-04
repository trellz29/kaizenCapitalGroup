"use client";
import { useEffect, useRef, useState } from "react";

export default function MagneticCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let raf;

    const move = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      // Dot follows instantly
      dotPos.current.x += (posRef.current.x - dotPos.current.x) * 0.15;
      dotPos.current.y += (posRef.current.y - dotPos.current.y) * 0.15;

      if (cursor) {
        cursor.style.transform = `translate(${posRef.current.x - 20}px, ${posRef.current.y - 20}px)`;
      }
      if (dot) {
        dot.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);
    const onHide = () => setHidden(true);
    const onShow = () => setHidden(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onHide);
    document.addEventListener("mouseenter", onShow);

    const interactables = document.querySelectorAll("a, button, [data-cursor]");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onHide);
      document.removeEventListener("mouseenter", onShow);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 768px) { .kcg-cursor, .kcg-cursor-dot { display: none !important; } }
        * { cursor: none !important; }
        .kcg-cursor {
          position: fixed;
          top: 0; left: 0;
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(15,26,40,0.35);
          pointer-events: none;
          z-index: 99999;
          transition: width 0.25s cubic-bezier(0.16,1,0.3,1),
                      height 0.25s cubic-bezier(0.16,1,0.3,1),
                      opacity 0.25s ease,
                      background 0.25s ease,
                      border-color 0.25s ease;
          mix-blend-mode: multiply;
          will-change: transform;
        }
        .kcg-cursor.hovered {
          width: 60px; height: 60px;
          background: rgba(15,26,40,0.07);
          border-color: rgba(15,26,40,0.55);
        }
        .kcg-cursor.clicked {
          width: 30px; height: 30px;
          background: rgba(15,26,40,0.15);
        }
        .kcg-cursor.hidden { opacity: 0; }
        .kcg-cursor-dot {
          position: fixed;
          top: 0; left: 0;
          width: 8px; height: 8px;
          background: #0F1A28;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          transition: opacity 0.2s ease, width 0.15s ease, height 0.15s ease;
          will-change: transform;
        }
        .kcg-cursor-dot.hidden { opacity: 0; }
        .kcg-cursor-dot.hovered { width: 6px; height: 6px; opacity: 0.4; }
      `}</style>
      <div
        ref={cursorRef}
        className={`kcg-cursor${hovered ? " hovered" : ""}${clicked ? " clicked" : ""}${hidden ? " hidden" : ""}`}
      />
      <div
        ref={dotRef}
        className={`kcg-cursor-dot${hidden ? " hidden" : ""}${hovered ? " hovered" : ""}`}
      />
    </>
  );
}
