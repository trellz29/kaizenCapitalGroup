"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (pathname !== prevPath) {
      setTransitioning(true);
      const t = setTimeout(() => {
        setPrevPath(pathname);
        setTransitioning(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [pathname, prevPath]);

  // On initial load — render children immediately with NO opacity/blur
  // Only apply transition on route CHANGES, not on first load
  return (
    <div style={{
      opacity: transitioning ? 0 : 1,
      filter: transitioning ? "blur(8px)" : "blur(0px)",
      transition: transitioning ? "none" : "opacity 0.4s ease, filter 0.4s ease",
    }}>
      {children}
    </div>
  );
}
