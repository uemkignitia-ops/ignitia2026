import { useEffect, useRef } from "react";

const MouseSpotlight = () => {
  const spotRef1 = useRef<HTMLDivElement>(null);
  const spotRef2 = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let frameId = 0;

    // Initialize position to center of screen
    targetRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    currentRef.current = { ...targetRef.current };

    const handler = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.16;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.16;

      const s1 = spotRef1.current;
      const s2 = spotRef2.current;

      const transformStr = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0) translate(-50%, -50%)`;

      if (s1) {
        s1.style.transform = transformStr;
      }
      if (s2) {
        s2.style.transform = transformStr;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handler, { passive: true });
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handler);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 opacity-80 overflow-hidden">
      {/* 420px spotlight (Primary glow) */}
      <div
        ref={spotRef1}
        className="absolute top-0 left-0 rounded-full w-[420px] h-[420px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(270 70% 60% / 0.06) 0%, transparent 70%)",
          transform: "translate3d(-999px, -999px, 0)",
          willChange: "transform",
        }}
      />
      {/* 720px spotlight (Secondary subtle glow) */}
      <div
        ref={spotRef2}
        className="absolute top-0 left-0 rounded-full w-[720px] h-[720px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(45 95% 55% / 0.03) 0%, transparent 70%)",
          transform: "translate3d(-999px, -999px, 0)",
          willChange: "transform",
        }}
      />
    </div>
  );
};

export default MouseSpotlight;
