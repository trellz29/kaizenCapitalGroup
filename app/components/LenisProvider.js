"use client";
import { useEffect } from "react";

export default function LenisProvider() {
  useEffect(() => {
    let lenis;
    let raf;

    const init = async () => {
      const { default: Lenis } = await import("@studio-freight/lenis");
      lenis = new Lenis({
        duration: 1.8,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
        lerp: 0.07,
      });

      const animate = (time) => {
        lenis.raf(time);
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    };

    init();

    return () => {
      if (lenis) lenis.destroy();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
