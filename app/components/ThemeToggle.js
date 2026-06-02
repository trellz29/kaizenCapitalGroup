"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("kcg-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const handleToggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("kcg-theme", next ? "dark" : "light");
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle dark mode"
      className="fixed bottom-6 left-6 z-[999] flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
      style={{
        background: dark ? "#E8EFF4" : "#0F1A28",
        color: dark ? "#0F1A28" : "#E8EFF4",
        boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(15,26,40,0.3)",
      }}
    >
      <span style={{ fontSize: "18px", lineHeight: 1 }}>{dark ? "☀️" : "🌙"}</span>
    </button>
  );
}
