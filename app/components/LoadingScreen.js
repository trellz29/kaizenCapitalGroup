"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Design", "Create", "Inspire", "Execute", "Deliver"];

export default function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const duration = 2800;
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * 100));
      if (p < 1) { rafRef.current = requestAnimationFrame(tick); }
      else { setCount(100); setTimeout(onComplete, 400); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % WORDS.length), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      style={{ position:"fixed", inset:0, zIndex:9999, background:"#050d18",
        display:"flex", flexDirection:"column", justifyContent:"space-between",
        padding:"2rem", overflow:"hidden" }}
    >
      <motion.p
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6, delay:0.1 }}
        style={{ fontSize:11, color:"rgba(255,255,255,0.35)",
          textTransform:"uppercase", letterSpacing:"0.3em", fontFamily:"sans-serif" }}
      >
        Kaizen Capital Group
      </motion.p>

      <div style={{ position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)", textAlign:"center" }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={wordIndex}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
            transition={{ duration:0.35, ease:"easeOut" }}
            style={{ fontSize:"clamp(3rem,8vw,7rem)", fontStyle:"italic",
              color:"rgba(255,255,255,0.7)", fontFamily:"Georgia,serif",
              fontWeight:400, whiteSpace:"nowrap", margin:0 }}
          >
            {WORDS[wordIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div style={{ width:"60%", maxWidth:400 }}>
          <div style={{ height:2, background:"rgba(255,255,255,0.08)",
            borderRadius:2, overflow:"hidden", marginBottom:8 }}>
            <motion.div
              animate={{ scaleX: count / 100 }} initial={{ scaleX:0 }}
              transition={{ ease:"linear", duration:0.05 }}
              style={{ height:"100%", background:"linear-gradient(90deg,#229ED9,#5865F2)",
                transformOrigin:"left", boxShadow:"0 0 8px rgba(34,158,217,0.5)" }}
            />
          </div>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.25)",
            fontFamily:"sans-serif", letterSpacing:"0.15em", margin:0 }}>
            Loading assets
          </p>
        </div>
        <motion.p
          animate={{ opacity:1 }} initial={{ opacity:0 }} transition={{ duration:0.3 }}
          style={{ fontSize:"clamp(3rem,7vw,6rem)", fontStyle:"italic",
            color:"rgba(255,255,255,0.9)", fontFamily:"Georgia,serif",
            fontWeight:400, lineHeight:1, margin:0 }}
        >
          {String(count).padStart(3, "0")}
        </motion.p>
      </div>
    </motion.div>
  );
}
