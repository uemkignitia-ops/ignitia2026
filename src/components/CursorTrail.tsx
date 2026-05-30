import { useEffect, useRef } from "react";

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const trail: { x: number; y: number; life: number }[] = [];
    const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: cursor.x, y: cursor.y };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cursor.x += (target.x - cursor.x) * 0.36;
      cursor.y += (target.y - cursor.y) * 0.36;

      const dx = target.x - cursor.x;
      const dy = target.y - cursor.y;
      const distance = Math.hypot(dx, dy);

      if (distance > 0.12) {
        trail.push({ x: cursor.x, y: cursor.y, life: 1 });
      }

      if (trail.length > 16) trail.shift();

      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        p.life *= 0.86;
        const progress = i / Math.max(1, trail.length - 1);
        const alpha = p.life * (0.42 - progress * 0.28);
        const size = 5.5 - progress * 3.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        const hue = progress < 0.55 ? 0 : 18;
        const saturation = progress < 0.55 ? 95 : 90;
        const lightness = progress < 0.55 ? 60 : 58;
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${Math.max(0, alpha)})`;
        ctx.fill();
      }

      trail.forEach((point) => {
        point.life *= 0.985;
      });

      ctx.save();
      ctx.shadowBlur = 28;
      ctx.shadowColor = "hsla(0, 95%, 60%, 0.55)";
      const glow = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 16);
      glow.addColorStop(0, "hsla(0, 95%, 65%, 0.9)");
      glow.addColorStop(0.45, "hsla(18, 90%, 60%, 0.45)");
      glow.addColorStop(1, "hsla(18, 90%, 60%, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[31] pointer-events-none mix-blend-screen opacity-90" />;
};

export default CursorTrail;
