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
      const burst = document.createElement("div");
      burst.style.cssText = `
        position:fixed;left:${x}px;top:${y}px;pointer-events:none;
        z-index:99999;transform:translate(-50%,-50%);
      `;

      for (let i = 0; i < count; i++) {
        const star = document.createElement("span");
        const angle = (i / count) * 360 + Math.random() * (360 / count / 2);
        const dist = (25 + Math.random() * 35) * scale;
        const size = (9 + Math.random() * 8) * scale;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const duration = 500 + Math.random() * 300;
        const delay = Math.random() * 80;

        star.textContent = char;
        star.style.cssText = `
          position:absolute;font-size:${size}px;color:${color};
          left:0;top:0;transform-origin:0 0;
          animation:starburst-fly ${duration}ms ${delay}ms ease-out forwards;
          --sb-angle:${angle}deg;--sb-dist:${dist}px;
          opacity:0;text-shadow:0 0 6px ${color};
        `;
        burst.appendChild(star);
      }

      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 900);
    }

    function triggerSupernova(x: number, y: number) {
      // Big central flash
      const flash = document.createElement("div");
      flash.style.cssText = `
        position:fixed;left:${x}px;top:${y}px;width:0;height:0;
        pointer-events:none;z-index:99998;
        box-shadow:0 0 0 0 rgba(56,189,248,0.6);
        border-radius:50%;animation:supernova-ring 800ms ease-out forwards;
      `;
      document.body.appendChild(flash);

      // Many burst waves
      for (let wave = 0; wave < 3; wave++) {
        setTimeout(() => spawnBurst(x, y, 16, 2 + wave), wave * 150);
      }

      // Secret message
      const msg = document.createElement("div");
      msg.textContent = "✦ Welcome to the cosmos ✦";
      msg.style.cssText = `
        position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
        pointer-events:none;z-index:99999;
        font-size:18px;font-weight:700;letter-spacing:0.2em;
        color:#38bdf8;text-shadow:0 0 20px #38bdf8,0 0 40px #818cf8;
        animation:cosmos-message 2s ease-out forwards;white-space:nowrap;
      `;
      document.body.appendChild(msg);

      setTimeout(() => { flash.remove(); msg.remove(); }, 2200);
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      // Skip clicks on interactive controls that would feel annoying
      if (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA") return;

      // Detect logo click for supernova easter egg
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
