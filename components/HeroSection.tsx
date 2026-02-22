"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      pulse: number;
      pulseSpeed: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NODE_COUNT = 55;
    const MAX_DIST = 160;

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(234, 179, 8, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const radius = 2 + Math.sin(n.pulse) * 1;
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4);
        glow.addColorStop(0, "rgba(250, 204, 21, 0.9)");
        glow.addColorStop(1, "rgba(250, 204, 21, 0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(250, 204, 21, 0.95)";
        ctx.fill();
      }

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border border-yellow-500/20 bg-black/60 shadow-2xl shadow-black/60">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-60"
        style={{ pointerEvents: "none" }}
      />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(161,98,7,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 py-16 sm:px-14 sm:py-20">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-400/10 px-4 py-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-300">
            University of Iowa
          </span>
        </div>

        <h1
          className="mb-5 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
          style={{ lineHeight: 1.05 }}
        >
          Applied{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #facc15, #fbbf24, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI
          </span>
        </h1>

        <p className="mb-4 max-w-2xl text-xl leading-relaxed text-gray-200">
          Iowa&apos;s student organization for applied artificial intelligence
          and machine learning.
        </p>
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-gray-400">
          Empowering students to explore, learn, and innovate through hands-on
          experiences and collaborative projects.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <a
            href="https://groupme.com/join_group/106294198/W4gZutv4"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-yellow-400 px-7 py-3.5 font-bold text-black shadow-lg shadow-yellow-900/40 transition hover:bg-yellow-300 active:scale-95"
          >
            <span>Join Us</span>
            <span className="transition group-hover:translate-x-0.5">→</span>
          </a>
          <Link
            href="/tutorials"
            className="inline-flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-black/40 px-7 py-3.5 font-semibold text-yellow-300 transition hover:border-yellow-400/60 hover:bg-black/60 hover:text-yellow-200 active:scale-95"
          >
            Explore Tutorials
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-12 flex flex-wrap gap-8 border-t border-yellow-500/10 pt-8">
          {[
            { label: "Members", value: "100+" },
            { label: "Projects Built", value: "20+" },
            { label: "Meetings Held", value: "30+" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-yellow-400">{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
