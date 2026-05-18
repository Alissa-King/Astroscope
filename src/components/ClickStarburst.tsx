"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#38bdf8", "#818cf8", "#34d399", "#f59e0b", "#f472b6", "#a78bfa", "#ffffff"];
const CHARS = ["✦", "✧", "★", "·", "*", "⋆", "✶"];
const SUPERNOVA_THRESHOLD = 5;

interface Particle {
  x: number; y: number;
  dx: number; dy: number;
  size: number;
  color: string;
  char: string;
  born: number;
  life: number;
}

interface CosmosMessage {
  born: number;
  life: number;
}

function addBurst(particles: Particle[], x: number, y: number, count = 8, scale = 1) {
  const now = performance.now();
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * ((Math.PI * 2) / count / 2);
    const dist = (30 + Math.random() * 45) * scale;
    particles.push({
      x, y,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      size: 11 + Math.random() * 8 * scale,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      born: now,
      life: 520 + Math.random() * 280,
    });
  }
}

export default function ClickStarburst() {
  const particlesRef = useRef<Particle[]>([]);
  const messagesRef = useRef<CosmosMessage[]>([]);
  const logoClicksRef = useRef(0);
  const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Persistent fixed canvas overlay — pointer-events:none so it never blocks clicks
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999;";
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    document.body.appendChild(canvas);
    window.addEventListener("resize", setSize);

    // RAF draw loop — particles rendered directly onto canvas
    let rafId: number;
    const ctx = canvas.getContext("2d")!;

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();
      particlesRef.current = particlesRef.current.filter((p) => {
        const t = (now - p.born) / p.life;
        if (t >= 1) return false;
        const eased = 1 - (1 - t) * (1 - t); // ease-out quad
        ctx.save();
        ctx.globalAlpha = 1 - t;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText(p.char, p.x + p.dx * eased, p.y + p.dy * eased);
        ctx.restore();
        return true;
      });

      // Cosmos message — fully canvas-rendered, no DOM animation API
      messagesRef.current = messagesRef.current.filter((m) => {
        const t = (now - m.born) / m.life;
        if (t >= 1) return false;
        // Fade in (0→0.2), hold (0.2→0.7), fade out (0.7→1)
        const alpha = t < 0.2 ? t / 0.2 : t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        const scale = t < 0.2 ? 0.6 + 0.45 * (t / 0.2) : t < 0.7 ? 1.05 : 1.05 + 0.05 * ((t - 0.7) / 0.3);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#38bdf8";
        ctx.shadowColor = "#818cf8";
        ctx.shadowBlur = 30;
        ctx.fillText("✦ Welcome to the cosmos ✦", 0, 0);
        ctx.restore();
        return true;
      });

      rafId = requestAnimationFrame(loop);
    }
    loop();

    function triggerSupernova(x: number, y: number) {
      for (let w = 0; w < 4; w++) {
        setTimeout(() => addBurst(particlesRef.current, x, y, 20, 2 + w * 0.5), w * 140);
      }
      messagesRef.current.push({ born: performance.now(), life: 2200 });
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA"
      ) return;

      if (target.closest("[data-logo-trigger]")) {
        logoClicksRef.current++;
        if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
        logoTimerRef.current = setTimeout(() => { logoClicksRef.current = 0; }, 1500);
        if (logoClicksRef.current >= SUPERNOVA_THRESHOLD) {
          logoClicksRef.current = 0;
          triggerSupernova(e.clientX, e.clientY);
          return;
        }
      }

      addBurst(particlesRef.current, e.clientX, e.clientY);
    }

    window.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", setSize);
      canvas.remove();
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    };
  }, []);

  return null;
}
