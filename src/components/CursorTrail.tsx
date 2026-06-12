import { useEffect, useRef } from "react";

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip entirely on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    // Trail points: position + remaining life
    const trail: { x: number; y: number; life: number }[] = [];

    // Direct cursor position — updated instantly, no lerp
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;

    // Track whether cursor has ever entered the window
    let hasEntered = false;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      hasEntered = true;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });

    // Previous position for distance-based trail spawning
    let prevX = cursorX;
    let prevY = cursorY;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

      if (!hasEntered) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Spawn trail points based on movement distance
      const dx = cursorX - prevX;
      const dy = cursorY - prevY;
      const dist = Math.hypot(dx, dy);

      if (dist > 2) {
        // Interpolate points along the path for smooth trails
        const steps = Math.min(Math.ceil(dist / 4), 8);
        for (let i = 0; i < steps; i++) {
          const t = (i + 1) / steps;
          trail.push({
            x: prevX + dx * t,
            y: prevY + dy * t,
            life: 1.0,
          });
        }
      }

      prevX = cursorX;
      prevY = cursorY;

      // Cap trail length
      while (trail.length > 28) trail.shift();

      // Draw trail particles
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        p.life *= 0.88;

        if (p.life < 0.01) continue;

        const progress = i / Math.max(1, trail.length - 1);
        const alpha = p.life * (0.5 - progress * 0.35);
        const size = 4 - progress * 2.8;

        if (alpha <= 0 || size <= 0) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        // Purple hue range: 265–280 to match theme primary (270)
        const hue = 265 + progress * 15;
        ctx.fillStyle = `hsla(${hue}, 80%, 68%, ${Math.max(0, alpha)})`;
        ctx.fill();
      }

      // Remove dead particles
      for (let i = trail.length - 1; i >= 0; i--) {
        if (trail[i].life < 0.01) trail.splice(i, 1);
      }

      // Main cursor glow — drawn directly at mouse position (zero lag)
      const glow = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, 14);
      glow.addColorStop(0, "hsla(270, 85%, 72%, 0.85)");
      glow.addColorStop(0.4, "hsla(275, 75%, 65%, 0.35)");
      glow.addColorStop(1, "hsla(280, 70%, 60%, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Tiny bright core dot
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(270, 90%, 88%, 0.9)";
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[31] pointer-events-none mix-blend-screen opacity-90"
    />
  );
};

export default CursorTrail;
