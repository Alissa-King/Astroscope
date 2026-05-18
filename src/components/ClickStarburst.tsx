"use client";

import { useEffect, useRef } from "react";

const CHARS = ["✦", "✧", "★", "·", "*", "⋆", "✶"];
const COLORS = ["#38bdf8", "#818cf8", "#34d399", "#f59e0b", "#f472b6", "#a78bfa", "#ffffff"];
const LOGO_SUPERNOVA_THRESHOLD = 5;

export default function ClickStarburst() {
  const logoClicksRef = useRef(0);
  const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function spawnBurst(x: number, y: number, count = 8, scale = 1) {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 360 + Math.random() * (360 / count / 2);
        const dist = (30 + Math.random() * 40) * scale;
        const size = (10 + Math.random() * 8) * scale;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const duration = 550 + Math.random() * 300;
        const delay = Math.random() * 80;

        const rad = (angle * Math.PI) / 180;
        const dx = Math.cos(rad) * dist;
        const dy = Math.sin(rad) * dist;

        const star = document.createElement("span");
        star.textContent = char;
        star.style.cssText = `
          position:fixed;left:${x}px;top:${y}px;
          font-size:${size}px;color:${color};
          pointer-events:none;z-index:99999;
          text-shadow:0 0 6px ${color};
          will-change:transform,opacity;
        `;
        document.body.appendChild(star);

        star.animate(
          [
            { transform: "translate(-50%,-50%)", opacity: 1 },
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`, opacity: 0 },
          ],
          { duration, delay, easing: "ease-out", fill: "both" }
        );

        setTimeout(() => star.remove(), duration + delay + 50);
      }
    }

    function triggerSupernova(x: number, y: number) {
      // Shockwave ring
      const ring = document.createElement("div");
      ring.style.cssText = `
        position:fixed;left:${x}px;top:${y}px;width:0;height:0;
        pointer-events:none;z-index:99998;border-radius:50%;
      `;
      document.body.appendChild(ring);
      ring.animate(
        [
          { boxShadow: "0 0 0 0 rgba(56,189,248,0.8), 0 0 0 0 rgba(129,140,248,0.5)" },
          { boxShadow: "0 0 0 200px rgba(56,189,248,0), 0 0 0 360px rgba(129,140,248,0)" },
        ],
        { duration: 900, easing: "ease-out", fill: "forwards" }
      );

      // Three waves of particles
      for (let wave = 0; wave < 3; wave++) {
        setTimeout(() => spawnBurst(x, y, 16, 2 + wave * 0.5), wave * 160);
      }

      // "Welcome to the cosmos" message
      const msg = document.createElement("div");
      msg.textContent = "✦ Welcome to the cosmos ✦";
      msg.style.cssText = `
        position:fixed;left:50%;top:50%;
        pointer-events:none;z-index:99999;
        font-size:18px;font-weight:700;letter-spacing:0.2em;
        color:#38bdf8;text-shadow:0 0 20px #38bdf8,0 0 40px #818cf8;
        white-space:nowrap;font-family:var(--font-geist-sans,sans-serif);
      `;
      document.body.appendChild(msg);
      msg.animate(
        [
          { opacity: 0, transform: "translate(-50%,-50%) scale(0.6)" },
          { opacity: 1, transform: "translate(-50%,-50%) scale(1.05)", offset: 0.2 },
          { opacity: 1, transform: "translate(-50%,-50%) scale(1)", offset: 0.7 },
          { opacity: 0, transform: "translate(-50%,-50%) scale(1.1)" },
        ],
        { duration: 2200, easing: "ease-out", fill: "forwards" }
      );

      setTimeout(() => { ring.remove(); msg.remove(); }, 2400);
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA") return;

      const isLogo = target.closest("[data-logo-trigger]");
      if (isLogo) {
        logoClicksRef.current++;
        if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
        logoTimerRef.current = setTimeout(() => { logoClicksRef.current = 0; }, 1500);
        if (logoClicksRef.current >= LOGO_SUPERNOVA_THRESHOLD) {
          logoClicksRef.current = 0;
          triggerSupernova(e.clientX, e.clientY);
          return;
        }
      }

      spawnBurst(e.clientX, e.clientY);
    }

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    };
  }, []);

  return null;
}
