import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_DATE = new Date("2026-08-01T09:00:00+05:30").getTime();

interface TimeUnit {
  value: number;
  label: string;
}

const FlipDigit = ({ value, label }: { value: number; label: string }) => {
  const prev = useRef(value);
  const changed = prev.current !== value;
  prev.current = value;
  const str = String(value).padStart(2, "0");

  return (
    <div className="countdown-unit flex flex-col items-center gap-1 md:gap-2.5">
      <div className="countdown-panel glass-card neon-glow-blue px-2 py-2 md:px-3 md:py-3 min-w-[54px] md:min-w-[74px] text-center relative overflow-hidden">
        <div className="absolute inset-x-2 top-1.5 h-1 rounded-full bg-gradient-to-r from-primary/60 via-white/70 to-secondary/60 opacity-65 blur-lg" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={changed ? { y: -32, opacity: 0, rotateX: -85 } : false}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 30, opacity: 0, rotateX: 90 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="font-heading text-[1.25rem] md:text-[2.5rem] font-bold text-primary block relative z-10 leading-none"
          >
            {str}
          </motion.span>
        </AnimatePresence>
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.18),_transparent_40%)]" />
      </div>
      <p className="text-[8px] md:text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
};

const CountdownTimer = ({ embedded = false }: { embedded?: boolean }) => {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([]);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, TARGET_DATE - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft([
        { value: days, label: "Days" },
        { value: hours, label: "Hours" },
        { value: minutes, label: "Minutes" },
        { value: seconds, label: "Seconds" },
      ]);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_46%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.12),_transparent_38%)] px-2.5 py-4 md:px-5 md:py-6 shadow-[0_0_90px_rgba(168,85,247,0.14)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-white/60 to-secondary opacity-50 blur-2xl" />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-[9px] md:text-[10px] text-muted-foreground mb-3 md:mb-4 uppercase tracking-[0.28em]"
      >
        <span className="text-primary">Event Starts In</span>
      </motion.p>
      <div className="grid grid-cols-4 gap-x-1 gap-y-1 sm:gap-2.5 md:gap-2.5 justify-items-center">
        {timeLeft.map((unit, i) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
            className="w-full max-w-[68px] sm:max-w-[84px] md:max-w-[90px]"
          >
            <FlipDigit value={unit.value} label={unit.label} />
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="relative w-full pt-7 md:pt-5 lg:pt-4">
        <div className="mx-auto w-full max-w-[340px] sm:max-w-3xl">{content}</div>
      </div>
    );
  }

  return (
    <section className="relative py-16 px-4">
      <div className="container mx-auto">{content}</div>
    </section>
  );
};

export default CountdownTimer;
