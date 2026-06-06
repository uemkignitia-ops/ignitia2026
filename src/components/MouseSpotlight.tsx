import { useEffect, useRef } from "react";

const MouseSpotlight = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let frameId = 0;

    const handler = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.28;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.28;
      const spotlight = spotlightRef.current;

      if (spotlight) {
        spotlight.style.background = `
          radial-gradient(420px circle at ${currentRef.current.x}px ${currentRef.current.y}px, hsl(270 70% 60% / 0.06), transparent 46%),
          radial-gradient(720px circle at ${currentRef.current.x}px ${currentRef.current.y}px, hsl(45 95% 55% / 0.03), transparent 64%)
        `;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handler);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handler);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed inset-0 z-30 opacity-80 transition-opacity duration-300"
      style={{ background: "transparent" }}
    />
  );
};

export default MouseSpotlight;
