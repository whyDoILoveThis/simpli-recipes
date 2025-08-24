"use client";

import React, { useEffect, useRef } from "react";

type Orb = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  blur: number;
};

interface FloatingOrbsProps {
  count?: number;
  colors?: string[];
  minRadius?: number;
  maxRadius?: number;
  speedMultiplier?: number;
  className?: string; // apply container positioning (e.g., absolute inset-0)
}

/**
 * Usage:
 * <FloatingOrbs className="absolute inset-0 -z-10" count={6} />
 */
export default function FloatingOrbs({
  count = 6,
  colors = ["#a78bfa", "#4cc9f0", "#60a5fa", "#fb7185", "#f97316"],
  minRadius = 18,
  maxRadius = 44,
  speedMultiplier = 1,
  className = "absolute inset-0 -z-10",
}: FloatingOrbsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const orbsRef = useRef<Orb[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // random helpers
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  // init orbs inside width/height
  const initOrbs = (w: number, h: number) => {
    const orbs: Orb[] = [];
    for (let i = 0; i < count; i++) {
      const r = rand(minRadius, maxRadius);
      orbs.push({
        x: rand(r, w - r),
        y: rand(r, h - r),
        r,
        vx: rand(-60, 60) * 0.03 * speedMultiplier, // px/ms base
        vy: rand(-60, 60) * 0.03 * speedMultiplier,
        color: colors[i % colors.length],
        blur: Math.round(rand(18, 36)),
      });
    }
    orbsRef.current = orbs;
  };

  // resize canvas to device pixel ratio
  const resize = (canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // re-init orbs (random positions) if none or too many/missing
    if (!orbsRef.current || orbsRef.current.length === 0) {
      initOrbs(rect.width, rect.height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    resize(canvas);

    // animation loop
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min(50, time - lastTimeRef.current); // ms, clamp for stability
      lastTimeRef.current = time;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // clear
      ctx.clearRect(0, 0, w, h);

      // draw each orb & update physics
      for (let orb of orbsRef.current) {
        // update position (vx,vy in px/ms)
        orb.x += orb.vx * dt;
        orb.y += orb.vy * dt;

        // collision w/ bounds -> bounce
        let bounced = false;
        if (orb.x - orb.r <= 0) {
          orb.x = orb.r;
          orb.vx = Math.abs(orb.vx);
          bounced = true;
        } else if (orb.x + orb.r >= w) {
          orb.x = w - orb.r;
          orb.vx = -Math.abs(orb.vx);
          bounced = true;
        }

        if (orb.y - orb.r <= 0) {
          orb.y = orb.r;
          orb.vy = Math.abs(orb.vy);
          bounced = true;
        } else if (orb.y + orb.r >= h) {
          orb.y = h - orb.r;
          orb.vy = -Math.abs(orb.vy);
          bounced = true;
        }

        // small random nudge on bounce to avoid locked repeating patterns
        if (bounced) {
          const nudge = 0.02 * speedMultiplier;
          orb.vx += rand(-nudge, nudge);
          orb.vy += rand(-nudge, nudge);
          // clamp speed to reasonable range
          const maxSpeed = 0.2 * speedMultiplier;
          orb.vx = Math.max(-maxSpeed, Math.min(maxSpeed, orb.vx));
          orb.vy = Math.max(-maxSpeed, Math.min(maxSpeed, orb.vy));
        }

        // gentle drift (tiny acceleration) so movement slowly changes
        orb.vx *= 0.9995;
        orb.vy *= 0.9995;

        // render glow + circle
        ctx.beginPath();
        ctx.fillStyle = orb.color;
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = orb.blur;
        ctx.globalCompositeOperation = "lighter"; // nice additive glow
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();

        // subtle inner soft circle to add depth
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.arc(orb.x, orb.y, Math.max(2, orb.r * 0.18), 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    // handle resize
    const onResize = () => {
      resize(canvas);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, colors.join("|"), minRadius, maxRadius, speedMultiplier]);

  // if container size changes because of layout, allow manual re-init by exposing ref; for now it auto-resizes
  return (
    <div className={className} style={{ pointerEvents: "none" }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
        aria-hidden
      />
    </div>
  );
}
