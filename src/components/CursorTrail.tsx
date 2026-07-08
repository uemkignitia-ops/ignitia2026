import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const CursorTrail = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isAdmin = location.pathname.startsWith("/admin");
  const [isLoaderDone, setIsLoaderDone] = useState(() => !!(window as any).__IGNITIA_LOADER_DONE__);

  useEffect(() => {
    if (isLoaderDone) return;
    const handleComplete = () => setIsLoaderDone(true);
    window.addEventListener("ignitia:loader-complete", handleComplete);
    return () => window.removeEventListener("ignitia:loader-complete", handleComplete);
  }, [isLoaderDone]);

  useEffect(() => {
    if (isAdmin || !isLoaderDone) return;
    
    // Skip entirely on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isLoopActive = false;
    let lastMoveTime = Date.now();

    // Trail points: position + remaining life + velocity
    const trail: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    // Direct cursor position — updated instantly, no lerp
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;

    // Track whether cursor has ever entered the window
    let hasEntered = true;

    // Draw main cursor glow & dot
    const drawCursorGlowAndDot = () => {
      const glow = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, 15);
      glow.addColorStop(0, "rgba(255, 255, 255, 0.35)"); 
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Tiny bright core dot
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fill();
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!isLoopActive) {
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        drawCursorGlowAndDot();
      }
    };
    resize();

    // Previous position for distance-based trail spawning
    let prevX = cursorX;
    let prevY = cursorY;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

      if (!hasEntered) {
        if (isLoopActive) {
          animId = requestAnimationFrame(draw);
        }
        return;
      }

      // Spawn trail points based on movement distance
      const dx = cursorX - prevX;
      const dy = cursorY - prevY;
      const dist = Math.hypot(dx, dy);

      if (dist > 2) {
        // Interpolate points along the path for smooth trails
        const steps = Math.min(Math.ceil(dist / 3), 12);
        for (let i = 0; i < steps; i++) {
          const t = (i + 1) / steps;
          trail.push({
            x: prevX + dx * t,
            y: prevY + dy * t,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7 - 0.25, // upward thermal drift
            life: 1.0,
          });
        }
      }

      prevX = cursorX;
      prevY = cursorY;

      // Cap trail length
      while (trail.length > 45) trail.shift();

      // Draw trail particles
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        
        // Update physics
        p.x += p.vx;
        p.y += p.vy;
        p.life *= 0.89;

        if (p.life < 0.01) continue;

        const progress = i / Math.max(1, trail.length - 1);
        const alpha = p.life * (0.6 - progress * 0.4);
        const size = 3.8 - progress * 2.6;

        if (alpha <= 0 || size <= 0) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha)})`;
        ctx.fill();
      }

      // Remove dead particles
      for (let i = trail.length - 1; i >= 0; i--) {
        if (trail[i].life < 0.01) trail.splice(i, 1);
      }

      // Draw active cursor glow & dot
      drawCursorGlowAndDot();

      // If trail has faded completely and mouse is stationary, go idle
      if (trail.length === 0 && Date.now() - lastMoveTime > 250) {
        isLoopActive = false;
        return;
      }

      animId = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (!isLoopActive) {
        isLoopActive = true;
        animId = requestAnimationFrame(draw);
      }
    };

    const onMove = (e: MouseEvent) => {
      if (e.clientX === cursorX && e.clientY === cursorY) {
        return;
      }
      if (!isLoopActive) {
        prevX = e.clientX;
        prevY = e.clientY;
      }
      cursorX = e.clientX;
      cursorY = e.clientY;
      hasEntered = true;
      lastMoveTime = Date.now();
      startLoop();
    };

    // Draw the initial static cursor point
    drawCursorGlowAndDot();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [isAdmin, isLoaderDone]);

  if (isAdmin || !isLoaderDone) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[31] pointer-events-none mix-blend-screen opacity-90"
    />
  );
};

export default CursorTrail;
