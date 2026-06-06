import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    let rafId = 0;
    let finishTimeoutId = 0;
    const start = performance.now();
    const duration = isMobile ? 1800 : 1500;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      setProgress(easeOutQuart(t) * 100);

      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
        return;
      }

      finishTimeoutId = window.setTimeout(() => {
        setLoading(false);
        window.dispatchEvent(new CustomEvent("ignitia:loader-complete"));
      }, isMobile ? 320 : 240);
    };

    rafId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(finishTimeoutId);
    };
  }, [isMobile]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          style={{ background: "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.18), transparent 25%), radial-gradient(circle at 80% 20%, rgba(255,215,0,0.16), transparent 22%), #050406" }}
        >
          {/* Animated grid bg */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Glow orbs */}
          <div className="absolute top-1/3 left-1/3 w-44 md:w-64 h-44 md:h-64 rounded-full bg-primary/15 blur-[75px] md:blur-[100px] animate-pulse-glow" />
          <div
            className="absolute bottom-1/3 right-1/3 w-36 md:w-48 h-36 md:h-48 rounded-full bg-secondary/12 blur-[60px] md:blur-[80px] animate-pulse-glow"
            style={{ animationDelay: "1s" }}
          />

          {/* Neon spinner ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: isMobile ? 2.6 : 2, repeat: Infinity, ease: "linear" }}
            className="w-20 md:w-24 h-20 md:h-24 rounded-full border-2 border-transparent mb-8"
            style={{
              borderTopColor: "hsl(270 70% 60%)",
              borderRightColor: "hsl(45 95% 55% / 0.55)",
              boxShadow:
                "0 0 30px hsl(270 70% 60% / 0.3), inset 0 0 30px hsl(270 70% 60% / 0.12)",
            }}
          />

          {/* Logo reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-heading text-4xl md:text-6xl font-bold gradient-text mb-6 relative z-10"
            style={{ textShadow: "0 0 24px hsl(270 70% 60% / 0.35)" }}
          >
            IGNITIA '26
          </motion.h1>

          {/* Loading bar */}
          <div className="w-48 h-1 rounded-full bg-muted/30 overflow-hidden relative z-10">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background:
                  "linear-gradient(90deg, hsl(270 70% 60%), hsl(45 95% 55% / 0.55))",
                boxShadow: "0 0 10px hsl(270 70% 60% / 0.5)",
              }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted-foreground mt-4 font-mono relative z-10"
          >
            INITIALIZING...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
