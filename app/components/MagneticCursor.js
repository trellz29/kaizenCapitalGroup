"use client";
import { useEffect, useRef, useState } from "react";

export default function MagneticCursor() {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState("up");
  const lastScrollY = useRef(0);
  const scrollTimer = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    setVisible(true);

    // Smooth cursor follow
    let raf;
    const smooth = { x: -200, y: -200 };
    const tick = () => {
      smooth.x += (posRef.current.x - smooth.x) * 0.18;
      smooth.y += (posRef.current.y - smooth.y) * 0.18;
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${smooth.x}px, ${smooth.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onScroll = () => {
      const sy = window.scrollY;
      const delta = sy - lastScrollY.current;
      lastScrollY.current = sy;
      if (Math.abs(delta) > 0.5) {
        setDirection(delta > 0 ? "down" : "up");
      }
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setDirection("up"), 800);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(scrollTimer.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!visible) return null;

  const isBullish = direction === "up";
  const green = "#00E87A";
  const red   = "#F84F4F";
  const col   = isBullish ? green : red;

  // Candle dimensions
  const cW = 14;   // candle body width
  const cH = 28;   // candle body height
  const wickW = 2;
  const topWick = 10;
  const botWick = 10;
  const totalH = topWick + cH + botWick;
  const totalW = cW + 8;

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        @media (hover: none) { * { cursor: auto !important; } .kcg-cursor { display: none !important; } }
        .kcg-cursor {
          position: fixed; top: 0; left: 0;
          pointer-events: none; z-index: 999999;
          will-change: transform;
        }
      `}</style>

      <div ref={cursorRef} className="kcg-cursor">
        <svg
          width={totalW}
          height={totalH}
          viewBox={`0 0 ${totalW} ${totalH}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: `drop-shadow(0 0 4px ${col})`,
            transition: "filter 0.3s ease",
          }}
        >
          {/* Top wick */}
          <line
            x1={totalW / 2} y1={0}
            x2={totalW / 2} y2={topWick}
            stroke={col}
            strokeWidth={wickW}
            strokeLinecap="round"
          />

          {/* Candle body */}
          {isBullish ? (
            // Bullish — filled green body
            <rect
              x={(totalW - cW) / 2}
              y={topWick}
              width={cW}
              height={cH}
              rx={1.5}
              fill={col}
            />
          ) : (
            // Bearish — hollow red body (open top = higher price, close bottom = lower)
            <rect
              x={(totalW - cW) / 2}
              y={topWick}
              width={cW}
              height={cH}
              rx={1.5}
              fill="transparent"
              stroke={col}
              strokeWidth={1.8}
            />
          )}

          {/* Bottom wick */}
          <line
            x1={totalW / 2} y1={topWick + cH}
            x2={totalW / 2} y2={topWick + cH + botWick}
            stroke={col}
            strokeWidth={wickW}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );
}
