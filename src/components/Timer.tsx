"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const TARGET_DATE = "2026-08-01T00:00:00";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

interface CountdownTimerProps {
  targetDate?: string;
  eyebrow?: string;
  embedded?: boolean;
}

function getTimeLeft(target: string): TimeLeft {
  const total = Math.max(0, new Date(target).getTime() - Date.now());

  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1_000) % 60),
  };
}

function useCountdown(target: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target));

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));

    const id = window.setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);

    return () => window.clearInterval(id);
  }, [target]);

  return timeLeft;
}

function ScanRain() {
  const streams = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${(i * 15.7) % 100}%`,
        delay: `${(i % 9) * 0.5}s`,
        duration: `${5 + (i % 6)}s`,
        value: (i * 7 + 3) % 2 === 0 ? "1" : "0",
        opacity: 0.1 + (i % 4) * 0.05,
      })),
    [],
  );

  return (
    <div className="cyber-rain" aria-hidden="true">
      {streams.map((s) => (
        <span
          key={s.id}
          style={{
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
            opacity: s.opacity,
          }}
        >
          {s.value}
        </span>
      ))}
    </div>
  );
}

function DigitTile({
  value,
  label,
  index,
  loading,
  reduceMotion,
}: {
  value: number;
  label: string;
  index: number;
  loading: boolean;
  reduceMotion: boolean;
}) {
  const display = loading ? "--" : String(value).padStart(2, "0");

  return (
    <div className="cyber-unit">
      <div className="cyber-tile">
        <span className="cyber-tile-index" aria-hidden="true">
          {label.slice(0, 1)}
        </span>
        <div className="cyber-tile-grid" aria-hidden="true" />
        <div className="cyber-tile-scan" aria-hidden="true" />

        <AnimatePresence mode="wait">
          <motion.span
            key={display}
            className="cyber-digit"
            style={{ animationDelay: `${index * 1.5}s` }}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { y: -20, opacity: 0, filter: "blur(5px)" }
            }
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { y: 20, opacity: 0, filter: "blur(5px)" }
            }
            transition={{
              duration: reduceMotion ? 0.01 : 0.34,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="cyber-label">{label}</span>
    </div>
  );
}

function Divider() {
  return <span className="cyber-divider">/</span>;
}

export default function Timer({
  targetDate = TARGET_DATE,
  eyebrow = "T-MINUS // EVENT LAUNCH",
  embedded = false,
}: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    setMounted(true);
  }, []);

  const { days, hours, minutes, seconds, total } = useCountdown(targetDate);

  const loading = !mounted;
  const isOver = mounted && total <= 0;

  const hexCode = mounted
    ? Math.max(0, Math.floor(total)).toString(16).toUpperCase().padStart(6, "0").slice(-6)
    : "000000";

  return (
    <div className={`cyber-root ${embedded ? "cyber-root-embedded" : ""}`}>
      <ScanRain />

      <div className="cyber-beam cyber-beam-a" />
      <div className="cyber-beam cyber-beam-b" />

      <motion.div
        className="cyber-panel"
        initial={
          reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 26 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : { type: "spring", stiffness: 200, damping: 15, mass: 0.7 }
        }
        whileHover={reduceMotion ? undefined : { scale: 1.035, y: -5 }}
      >
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        <div className="cyber-panel-inner">
          <div className="cyber-hazard" aria-hidden="true" />


          <div className="cyber-title">
            {isOver ? "IGNITIA IS LIVE" : "COUNTDOWN ACTIVE"}
            <span className="cyber-cursor" aria-hidden="true" />
          </div>

          <div
            className="cyber-time-row"
            role="timer"
            aria-live="off"
            aria-label={
              loading
                ? "Loading countdown."
                : isOver
                  ? "Countdown ended."
                  : `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds remaining.`
            }
          >
            <DigitTile value={days} label="DAYS" index={0} loading={loading} reduceMotion={reduceMotion} />
            <Divider />
            <DigitTile value={hours} label="HRS" index={1} loading={loading} reduceMotion={reduceMotion} />
            <Divider />
            <DigitTile value={minutes} label="MIN" index={2} loading={loading} reduceMotion={reduceMotion} />
            <Divider />
            <DigitTile value={seconds} label="SEC" index={3} loading={loading} reduceMotion={reduceMotion} />
          </div>

          {/* Bottom row telemetry labels removed per request */}
        </div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Share+Tech+Mono&display=swap');

        .cyber-root {
          position: relative;
          width: min(100%, 520px);
          font-family: "Share Tech Mono", "Space Mono", ui-monospace, monospace;

          --cyber-fuchsia: #05f7ff;
          --cyber-magenta: #ff2168;
          --cyber-yellow: #fcee0a;
          --cyber-text: #eafcff;
          --cyber-muted: rgba(198, 240, 255, 0.62);
        }

        .cyber-root-embedded {
          width: 100%;
        }

        .cyber-panel {
          position: relative;
          z-index: 2;
          padding: 2px;
          cursor: default;
          background:
            linear-gradient(120deg, var(--cyber-fuchsia), transparent 24%),
            linear-gradient(300deg, var(--cyber-magenta), transparent 28%),
            #060812;
          clip-path: polygon(7% 0, 100% 0, 100% 78%, 91% 100%, 0 100%, 0 18%);
          box-shadow:
            0 0 30px rgba(5, 247, 255, 0.28),
            0 0 70px rgba(255, 33, 104, 0.16),
            0 24px 60px rgba(0, 0, 0, 0.75);
          transition: box-shadow 0.25s ease, filter 0.25s ease;
        }

        .cyber-panel:hover {
          box-shadow:
            0 0 44px rgba(5, 247, 255, 0.4),
            0 0 96px rgba(255, 33, 104, 0.26),
            0 30px 78px rgba(0, 0, 0, 0.85);
          filter: saturate(1.12);
        }

        .cyber-panel-inner {
          position: relative;
          overflow: hidden;
          padding: 24px 24px 20px;
          background:
            radial-gradient(circle at 50% 0%, rgba(5, 247, 255, 0.12), transparent 32%),
            linear-gradient(135deg, #02040a 0%, #050813 42%, #02040a 100%);
          clip-path: polygon(7% 0, 100% 0, 100% 78%, 91% 100%, 0 100%, 0 18%);
          border: 1px solid rgba(255, 255, 255, 0.035);
        }

        .cyber-panel-inner::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 22px 22px;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
        }

        .cyber-panel-inner::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(5, 247, 255, 0.07) 42%,
            rgba(255, 33, 104, 0.1) 50%,
            transparent 58%
          );
          transform: translateX(-120%);
          animation: cyber-shine 5s ease-in-out infinite;
        }

        .cyber-hazard {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          z-index: 3;
          background: repeating-linear-gradient(
            135deg,
            var(--cyber-yellow) 0 8px,
            #060608 8px 16px
          );
          opacity: 0.85;
          box-shadow: 0 0 10px rgba(252, 238, 10, 0.45);
        }

        .cyber-top-row {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 6px;
          color: var(--cyber-fuchsia);
          font-family: "Orbitron", sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .cyber-eyebrow {
          flex: 1;
        }

        .cyber-code {
          color: var(--cyber-muted);
          font-family: "Share Tech Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          opacity: 0.4;
        }

        .cyber-live-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          background: var(--cyber-fuchsia);
          border-radius: 50%;
          box-shadow: 0 0 14px var(--cyber-fuchsia);
          animation: cyber-pulse 1.3s ease-in-out infinite;
        }

        .cyber-title {
          position: relative;
          z-index: 2;
          margin-top: 8px;
          margin-bottom: 18px;
          font-family: "Orbitron", sans-serif;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.06em;
          color: var(--cyber-text);
          text-shadow: 0 0 12px rgba(5, 247, 255, 0.55);
        }

        .cyber-cursor {
          display: inline-block;
          width: 8px;
          height: 13px;
          margin-left: 4px;
          background: var(--cyber-yellow);
          box-shadow: 0 0 8px rgba(252, 238, 10, 0.8);
          animation: cyber-blink 1s steps(1) infinite;
          vertical-align: -2px;
        }

        .cyber-time-row {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .cyber-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .cyber-tile {
          position: relative;
          width: clamp(48px, 5.5vw, 63px);
          height: clamp(52px, 5.5vw, 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 0%, rgba(5, 247, 255, 0.18), transparent 55%),
            linear-gradient(145deg, rgba(5, 247, 255, 0.1), rgba(255, 33, 104, 0.07)),
            rgba(0, 0, 0, 0.62);
          border: 1px solid rgba(5, 247, 255, 0.5);
          clip-path: polygon(16% 0, 100% 0, 84% 100%, 0 100%);
          box-shadow: inset 0 0 22px rgba(5, 247, 255, 0.1), 0 0 18px rgba(5, 247, 255, 0.16);
        }

        .cyber-tile-index {
          position: absolute;
          top: 6px;
          left: 9px;
          z-index: 3;
          font-family: "Orbitron", sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--cyber-fuchsia);
          opacity: 0.32;
        }

        .cyber-tile-grid {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(5, 247, 255, 0.07) 1px, transparent 1px);
          background-size: 100% 9px;
          opacity: 0.7;
        }

        .cyber-tile-scan {
          position: absolute;
          left: -20%;
          right: -20%;
          height: 16px;
          background: linear-gradient(90deg, transparent, rgba(5, 247, 255, 0.25), transparent);
          animation: cyber-scan 2.6s linear infinite;
        }

        .cyber-digit {
          position: relative;
          z-index: 3;
          color: var(--cyber-text);
          font-family: "Share Tech Mono", monospace;
          font-size: clamp(24px, 3.2vw, 36px);
          font-weight: 700;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          text-shadow:
            0 0 8px rgba(5, 247, 255, 0.85),
            2px 0 rgba(255, 33, 104, 0.5),
            -2px 0 rgba(110, 60, 255, 0.4);
          animation: cyber-flicker 6s infinite;
        }

        .cyber-label {
          color: var(--cyber-muted);
          font-family: "Orbitron", sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .cyber-divider {
          margin-bottom: 20px;
          color: var(--cyber-yellow);
          font-size: 22px;
          font-weight: 900;
          transform: skewX(-16deg);
          text-shadow: 0 0 12px rgba(252, 238, 10, 0.75);
        }

        .cyber-bottom-row {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          margin-top: 18px;
          color: rgba(198, 240, 255, 0.45);
          font-family: "Orbitron", sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .cyber-progress {
          position: relative;
          height: 4px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.08);
        }

        .cyber-progress i {
          position: absolute;
          top: 0;
          bottom: 0;
          left: -40%;
          width: 35%;
          background: linear-gradient(90deg, transparent, var(--cyber-fuchsia), var(--cyber-magenta), transparent);
          box-shadow: 0 0 14px rgba(5, 247, 255, 0.7);
          animation: cyber-sweep 2.4s linear infinite;
        }

        .cyber-corner {
          position: absolute;
          z-index: 5;
          width: 24px;
          height: 24px;
          pointer-events: none;
        }

        .cyber-corner-tl {
          top: 6px;
          left: 6px;
          border-top: 2px solid var(--cyber-fuchsia);
          border-left: 2px solid var(--cyber-fuchsia);
        }

        .cyber-corner-tr {
          top: 6px;
          right: 6px;
          border-top: 2px solid var(--cyber-magenta);
          border-right: 2px solid var(--cyber-magenta);
        }

        .cyber-corner-bl {
          bottom: 6px;
          left: 6px;
          border-bottom: 2px solid var(--cyber-magenta);
          border-left: 2px solid var(--cyber-magenta);
        }

        .cyber-corner-br {
          bottom: 6px;
          right: 6px;
          border-bottom: 2px solid var(--cyber-fuchsia);
          border-right: 2px solid var(--cyber-fuchsia);
        }

        .cyber-rain {
          position: absolute;
          inset: -30px 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
        }

        .cyber-rain span {
          position: absolute;
          top: -20px;
          color: var(--cyber-fuchsia);
          font-family: "Share Tech Mono", monospace;
          font-size: 12px;
          font-weight: 700;
          text-shadow: 0 0 10px var(--cyber-fuchsia);
          animation-name: cyber-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .cyber-beam {
          position: absolute;
          z-index: 1;
          pointer-events: none;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--cyber-fuchsia), var(--cyber-magenta), transparent);
          opacity: 0.55;
          transform: skewX(-26deg);
          filter: drop-shadow(0 0 8px rgba(5, 247, 255, 0.8));
        }

        .cyber-beam-a {
          width: 46%;
          top: -8px;
          right: 6%;
        }

        .cyber-beam-b {
          width: 30%;
          bottom: 10px;
          left: -6%;
        }

        @keyframes cyber-fall {
          from { transform: translateY(-40px); }
          to { transform: translateY(330px); }
        }

        @keyframes cyber-scan {
          0% { top: -30%; }
          100% { top: 120%; }
        }

        @keyframes cyber-shine {
          0%, 60% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @keyframes cyber-pulse {
          0%, 100% { opacity: 0.55; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes cyber-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        @keyframes cyber-sweep {
          0% { left: -40%; }
          100% { left: 120%; }
        }

        @keyframes cyber-flicker {
          0%, 92%, 100% {
            text-shadow:
              0 0 8px rgba(5, 247, 255, 0.85),
              2px 0 rgba(255, 33, 104, 0.5),
              -2px 0 rgba(110, 60, 255, 0.4);
          }
          93% {
            text-shadow: 3px 0 rgba(255, 33, 104, 0.9), -3px 0 rgba(5, 247, 255, 0.9);
          }
          95% {
            text-shadow: -3px 0 rgba(255, 33, 104, 0.9), 3px 0 rgba(5, 247, 255, 0.9);
          }
        }

        @media (max-width: 768px) {
          .cyber-panel-inner {
            padding: 20px 14px 16px;
          }

          .cyber-time-row {
            gap: 5px;
          }

          .cyber-divider {
            font-size: 17px;
          }

          .cyber-title {
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cyber-rain span,
          .cyber-tile-scan,
          .cyber-panel-inner::after,
          .cyber-live-dot,
          .cyber-digit,
          .cyber-cursor,
          .cyber-progress i {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}