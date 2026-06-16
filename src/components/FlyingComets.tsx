import { useEffect, useRef } from "react";

interface Comet {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  life: number;
  maxLife: number;
  tailLen: number;
  size: number;
}

/**
 * FlyingComets — lightweight canvas effect for the hero section.
 * Comets streak from the top-left corner toward the bottom-right.
 * Blue-tinted, short-lived, small, and sparse.
 * Renders only on desktop (hidden via CSS on <1024px).
 */
const FlyingComets = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const comets: Comet[] = [];

    // Diagonal angle: top-left → bottom-right ≈ 40° from horizontal
    const ANGLE = (40 * Math.PI) / 180;
    const COS = Math.cos(ANGLE);
    const SIN = Math.sin(ANGLE);

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const spawn = () => {
      if (comets.length < 8 && Math.random() < 0.05) {
        let startX: number, startY: number;

        // 60% of comets spawn near the center (around the GLB model)
        if (Math.random() < 0.6) {
          const cx = canvas.width * 0.5;
          const cy = canvas.height * 0.5;
          // Gaussian-like spread around center
          startX = cx + (Math.random() - 0.5) * canvas.width * 0.4;
          startY = cy + (Math.random() - 0.5) * canvas.height * 0.4;
        } else {
          startX = Math.random() * canvas.width;
          startY = Math.random() * canvas.height;
        }

        comets.push({
          x: startX,
          y: startY,
          speed: Math.random() * 3 + 4, // 4-7 px/frame
          opacity: 1,
          life: 0,
          maxLife: Math.random() * 30 + 25, // 25-55 frames — short lived
          tailLen: Math.random() * 50 + 50, // 50-100px tail — longer
          size: Math.random() * 1 + 1, // 1-2px head
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawn();

      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.life++;
        c.x += c.speed * COS;
        c.y += c.speed * SIN;
        c.opacity = 1 - c.life / c.maxLife;

        if (c.life >= c.maxLife) {
          comets.splice(i, 1);
          continue;
        }

        // Tail: gradient line from head backward (toward top-left)
        const tailX = c.x - c.tailLen * COS;
        const tailY = c.y - c.tailLen * SIN;

        const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        grad.addColorStop(0, `hsla(210, 85%, 72%, ${c.opacity * 0.9})`);
        grad.addColorStop(0.5, `hsla(215, 80%, 65%, ${c.opacity * 0.4})`);
        grad.addColorStop(1, `hsla(220, 75%, 60%, 0)`);

        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = c.size * 0.8;
        ctx.lineCap = "round";
        ctx.stroke();

        // Head glow — soft outer
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size + 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(210, 80%, 75%, ${c.opacity * 0.2})`;
        ctx.fill();

        // Head core — bright dot
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(205, 90%, 85%, ${c.opacity * 0.95})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[5] hidden lg:block"
      aria-hidden="true"
    />
  );
};

export default FlyingComets;
