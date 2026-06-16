import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const progressRef = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let rafId = 0;
    let finishTimeoutId = 0;
    const start = performance.now();
    const duration = 2000;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const p = easeOutQuart(t) * 100;
      progressRef.current = p;

      // Direct DOM updates — no React re-renders
      if (barRef.current) {
        barRef.current.style.width = `${p}%`;
      }
      if (textRef.current) {
        textRef.current.textContent = `${Math.round(p)}%`;
      }

      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
        return;
      }

      finishTimeoutId = window.setTimeout(() => {
        setLoading(false);
        (window as any).__IGNITIA_LOADER_DONE__ = true;
        window.dispatchEvent(new CustomEvent("ignitia:loader-complete"));
      }, 250);
    };

    rafId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(finishTimeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#050406" }}
        >
          {/* Subtle radial gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(168,85,247,0.1) 0%, transparent 60%)",
            }}
          />

          {/* Central content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo container with ring */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 flex items-center justify-center">
              {/* Single rotating ring — CSS only, GPU composited */}
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  border: "1px solid rgba(168,85,247,0.15)",
                  animationDuration: "10s",
                }}
              >
                <div
                  className="absolute w-1.5 h-1.5 rounded-full bg-primary/70"
                  style={{
                    top: "-3px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: "0 0 6px rgba(168,85,247,0.6)",
                  }}
                />
              </div>

              {/* Second rotating ring (inner/reverse) */}
              <div
                className="absolute rounded-full animate-spin"
                style={{
                  inset: "16px",
                  border: "1px dashed rgba(255,215,0,0.15)",
                  animationDuration: "15s",
                  animationDirection: "reverse",
                }}
              >
                <div
                  className="absolute w-1 h-1 rounded-full bg-secondary/60"
                  style={{
                    bottom: "-1px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: "0 0 4px rgba(255,215,0,0.4)",
                  }}
                />
              </div>

              {/* Soft glow — static, no animation */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: "25%",
                  background:
                    "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
                  filter: "blur(10px)",
                }}
              />

              {/* Logo image */}
              <motion.img
                src="/ignitia-3d.png"
                alt="IGNITIA Logo"
                className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain select-none"
                style={{
                  filter:
                    "drop-shadow(0 0 16px rgba(168,85,247,0.35)) drop-shadow(0 0 6px rgba(255,215,0,0.15))",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                draggable={false}
              />
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mt-3 md:mt-5 relative z-10 text-center"
              style={{ textShadow: "0 0 16px hsl(270 70% 60% / 0.25)" }}
            >
              IGNITIA '26
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="font-mono text-[10px] sm:text-xs text-white/35 mt-2 tracking-[0.3em] uppercase relative z-10 text-center"
            >
              IEM-UEM Group × UEM Kolkata
            </motion.p>

            {/* Progress bar — DOM-ref driven, zero re-renders */}
            <div className="w-32 sm:w-40 md:w-48 mt-7 relative z-10">
              <div className="w-full h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  ref={barRef}
                  className="h-full rounded-full"
                  style={{
                    width: "0%",
                    background:
                      "linear-gradient(90deg, hsl(270 70% 60%), hsl(45 90% 55% / 0.5))",
                    boxShadow: "0 0 8px hsl(270 70% 60% / 0.3)",
                    transition: "none",
                    willChange: "width",
                  }}
                />
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-[0.2em] uppercase">
                  Loading
                </span>
                <span
                  ref={textRef}
                  className="font-mono text-[9px] sm:text-[10px] text-white/25 tracking-wider tabular-nums"
                >
                  0%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
