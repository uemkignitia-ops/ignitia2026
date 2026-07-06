"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type HeroInfoTerminalCardProps = {
  typedText: string;
};

/* ------------------------------------------------------------------ */
/* Fast sequential "terminal" typewriter for the card's internal lines */
/* (typedText itself is driven externally by the parent component)     */
/* ------------------------------------------------------------------ */
function useFastTypewriter(
  lines: string[],
  active: boolean,
  charDelay = 12,
  lineGap = 150,
) {
  const [revealed, setRevealed] = useState<string[]>(() => lines.map(() => ""));
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    setRevealed(lines.map(() => ""));
    setLineIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!active || lineIndex >= lines.length) return;

    const line = lines[lineIndex];
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setRevealed((prev) => {
        const next = [...prev];
        next[lineIndex] = line.slice(0, i);
        return next;
      });
      if (i >= line.length) {
        window.clearInterval(id);
        window.setTimeout(() => setLineIndex((v) => v + 1), lineGap);
      }
    }, charDelay);

    return () => window.clearInterval(id);
  }, [active, lineIndex, lines, charDelay, lineGap]);

  return revealed;
}

function splitLabelValue(text: string) {
  const idx = text.indexOf(":");
  if (idx === -1) return { label: text, value: "" };
  return { label: text.slice(0, idx + 1), value: text.slice(idx + 1) };
}

/* index 0 = identity line, index 1 = date, index 2 = location */
const TERMINAL_LINES = [
  "IEM-UEM Group × UEM Kolkata",
  "DATE: 01–02.AUG.2026",
  "LOC: UEM Kolkata, WB",
];

function HeroInfoTerminalCard({ typedText }: HeroInfoTerminalCardProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [expanded, setExpanded] = useState(false);
  const [contentIn, setContentIn] = useState(false);

  const revealed = useFastTypewriter(TERMINAL_LINES, contentIn, 11, 160);

  useEffect(() => {
    if (!expanded) return;
    const t = window.setTimeout(() => setContentIn(true), 90);
    return () => window.clearTimeout(t);
  }, [expanded]);

  const identDone = revealed[0].length >= TERMINAL_LINES[0].length;
  const dateDone = revealed[1].length >= TERMINAL_LINES[1].length;
  const locDone = revealed[2].length >= TERMINAL_LINES[2].length;

  const dateParts = splitLabelValue(revealed[1]);
  const locParts = splitLabelValue(revealed[2]);

  return (
    <div
      className="htc-root relative w-full max-w-[300px] sm:max-w-[340px] select-none [perspective:1100px]"
      aria-label={`Event access pass. ${TERMINAL_LINES[0]}. ${typedText}. ${TERMINAL_LINES[1]}. ${TERMINAL_LINES[2]}.`}
    >
      {/* expander: thin line -> full card */}
      <motion.div
        className="htc-expander"
        style={{ transformOrigin: "center" }}
        initial={reduceMotion ? { opacity: 0 } : { scaleY: 0.035, opacity: 0.8 }}
        animate={reduceMotion ? { opacity: 1 } : { scaleY: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0.25 }
            : { duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }
        }
        onAnimationComplete={() => setExpanded(true)}
      >
        {/* floater: bob loop once expanded + hover tilt */}
        <motion.div
          className="htc-panel relative overflow-hidden px-5 py-4 sm:px-6 sm:py-5 [transform-style:preserve-3d]"
          animate={!reduceMotion && expanded ? { y: [0, -7, 0] } : { y: 0 }}
          transition={
            !reduceMotion && expanded
              ? { duration: 4.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0 }
          }
          whileHover={reduceMotion ? undefined : { rotateX: 5, rotateY: -6, scale: 1.015 }}
        >
          {/* --- decorative overlays --- */}
          <div className="htc-grid" aria-hidden="true" />
          <div className="htc-scanline" aria-hidden="true" />
          <div className="htc-sweep" aria-hidden="true" />
          <span className="htc-accent-dot htc-accent-dot-yellow" aria-hidden="true" />
          <span className="htc-accent-dot htc-accent-dot-cyan" aria-hidden="true" />
          <span className="htc-bracket htc-bracket-tl" aria-hidden="true" />
          <span className="htc-bracket htc-bracket-tr" aria-hidden="true" />
          <span className="htc-bracket htc-bracket-bl" aria-hidden="true" />
          <span className="htc-bracket htc-bracket-br" aria-hidden="true" />

          {/* --- content --- */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 6 }}
            animate={contentIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* id badge row: chip + pass label + status pill */}
            <div className="flex items-center justify-between gap-3">
              <span className="htc-mono htc-id-label flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.2em]">
                <span className="htc-chip" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                ACCESS PASS
              </span>
              <span className="htc-mono htc-status-pill text-[9px] sm:text-[10px] tracking-[0.16em]">
                <span className="htc-live-dot" />
                ACTIVE
              </span>
            </div>

            {/* system / signal row */}
            <div className="htc-mono mt-2 flex items-center justify-between gap-3 text-[9px] sm:text-[10px] tracking-[0.16em] text-htc-ice-dim">
              <span>SYSTEM: IGNITIA_INTERFACE</span>
              <span className="flex items-center gap-2">
                SIGNAL: LOCKED
                <span className="htc-signal-bars" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </span>
            </div>

            <div className="htc-divider my-3" />

            {/* identity line (typed internally) */}
            <div className="htc-mono flex items-center text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-htc-ice">
              <span className="htc-caret mr-1.5">{">>"}</span>
              <span>{revealed[0]}</span>
              {!identDone && <span className="htc-cursor" />}
            </div>

            {/* tagline (external typedText, parent-controlled) */}
            <div
              className="htc-heading htc-glow-text htc-glitch mt-2 text-lg sm:text-xl font-bold leading-snug tracking-wide"
              data-text={typedText}
            >
              {typedText}
              <span className="htc-cursor htc-cursor-lg" />
            </div>

            {/* date / location */}
            <div className="mt-3.5 space-y-1.5">
              <div className="htc-mono flex items-center gap-2 text-[10px] sm:text-[11px]">
                <span className="htc-diamond htc-diamond-violet" />
                <span className="htc-tag htc-tag-violet">{dateParts.label}</span>
                <span className="htc-tag-value">{dateParts.value}</span>
                {!dateDone && <span className="htc-cursor" />}
              </div>
              <div className="htc-mono flex items-center gap-2 text-[10px] sm:text-[11px]">
                <span className="htc-diamond htc-diamond-cyan" />
                <span className="htc-tag htc-tag-cyan">{locParts.label}</span>
                <span className="htc-tag-value">{locParts.value}</span>
                {!locDone && <span className="htc-cursor" />}
              </div>
            </div>

            {/* decorative UI ticks */}
            <div className="htc-ticks mt-4 flex items-end gap-1" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, i) => (
                <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .htc-root {
          --htc-cyan: #2be8ff;
          --htc-cyan-dim: rgba(43, 232, 255, 0.5);
          --htc-violet: #c39bff;
          --htc-violet-dim: rgba(195, 155, 255, 0.5);
          --htc-yellow: #eeff5c;
          --htc-yellow-dim: rgba(238, 255, 92, 0.55);
          --htc-ice: #f2fdff;
          --htc-ice-dim: rgba(200, 235, 240, 0.6);
        }

        .htc-mono {
          font-family: "JetBrains Mono", ui-monospace, "Share Tech Mono", monospace;
        }
        .htc-heading {
          font-family: "Chakra Petch", "JetBrains Mono", sans-serif;
        }
        .text-htc-ice { color: var(--htc-ice); opacity: 0.95; }
        .text-htc-ice-dim { color: var(--htc-ice-dim); }

        .htc-panel {
          background:
            linear-gradient(160deg, rgba(7, 15, 22, 0.96) 0%, rgba(2, 4, 8, 0.98) 55%, rgba(11, 4, 20, 0.96) 100%);
          border: 1px solid rgba(43, 232, 255, 0.45);
          clip-path: polygon(6% 0, 100% 0, 100% 82%, 94% 100%, 0 100%, 0 18%);
          box-shadow:
            0 0 0 1px rgba(195, 155, 255, 0.18),
            0 0 26px rgba(43, 232, 255, 0.24),
            0 0 60px rgba(195, 155, 255, 0.15),
            0 22px 48px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          transition: box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .htc-panel:hover {
          border-color: rgba(43, 232, 255, 0.78);
          box-shadow:
            0 0 0 1px rgba(195, 155, 255, 0.3),
            0 0 42px rgba(43, 232, 255, 0.4),
            0 0 92px rgba(195, 155, 255, 0.24),
            0 28px 58px rgba(0, 0, 0, 0.7);
        }

        .htc-grid {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(43, 232, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43, 232, 255, 0.06) 1px, transparent 1px);
          background-size: 16px 16px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        .htc-scanline {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 12px;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(43, 232, 255, 0.16), transparent);
          animation: htc-scan 3.4s linear infinite;
        }
        @keyframes htc-scan {
          0% { top: -10%; }
          100% { top: 108%; }
        }

        .htc-sweep {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          mix-blend-mode: screen;
          background: linear-gradient(
            115deg,
            transparent 30%,
            rgba(43, 232, 255, 0.14) 46%,
            rgba(238, 255, 92, 0.14) 51%,
            rgba(195, 155, 255, 0.18) 56%,
            transparent 68%
          );
          transform: translateX(-130%);
        }
        .htc-panel:hover .htc-sweep {
          animation: htc-sweep-move 0.9s ease forwards;
        }
        @keyframes htc-sweep-move {
          0% { transform: translateX(-130%); }
          100% { transform: translateX(130%); }
        }

        .htc-bracket {
          position: absolute;
          z-index: 5;
          width: 16px;
          height: 16px;
          pointer-events: none;
        }
        .htc-bracket-tl {
          top: 8px;
          left: 8px;
          border-top: 2px solid var(--htc-yellow);
          border-left: 2px solid var(--htc-yellow);
        }
        .htc-bracket-tr {
          top: 8px;
          right: 8px;
          border-top: 2px solid var(--htc-cyan);
          border-right: 2px solid var(--htc-cyan);
        }
        .htc-bracket-bl {
          bottom: 8px;
          left: 8px;
          border-bottom: 2px solid var(--htc-violet);
          border-left: 2px solid var(--htc-violet);
        }
        .htc-bracket-br {
          bottom: 8px;
          right: 8px;
          border-bottom: 2px solid var(--htc-yellow);
          border-right: 2px solid var(--htc-yellow);
        }

        .htc-accent-dot {
          position: absolute;
          z-index: 5;
          width: 4px;
          height: 4px;
          pointer-events: none;
          border-radius: 1px;
          transform: rotate(45deg);
        }
        .htc-accent-dot-yellow {
          top: 6%;
          left: 50%;
          margin-left: -30px;
          background: var(--htc-yellow);
          box-shadow: 0 0 6px rgba(238, 255, 92, 0.8);
          opacity: 0.9;
        }
        .htc-accent-dot-cyan {
          bottom: 6%;
          right: 50%;
          margin-right: -30px;
          background: var(--htc-cyan);
          box-shadow: 0 0 6px rgba(43, 232, 255, 0.8);
          opacity: 0.9;
        }

        /* access chip — homage to a physical smart-card chip */
        .htc-chip {
          position: relative;
          display: inline-block;
          width: 18px;
          height: 13px;
          border-radius: 2.5px;
          background: linear-gradient(135deg, #fff3c4 0%, #eeff5c 45%, #cdbb63 100%);
          box-shadow: 0 0 6px rgba(238, 255, 92, 0.55), inset 0 0 0 1px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          flex-shrink: 0;
        }
        .htc-chip i {
          position: absolute;
          background: rgba(8, 10, 6, 0.55);
        }
        .htc-chip i:nth-child(1) { top: 33%; left: 0; right: 0; height: 1px; }
        .htc-chip i:nth-child(2) { top: 66%; left: 0; right: 0; height: 1px; }
        .htc-chip i:nth-child(3) { top: 0; bottom: 0; left: 50%; width: 1px; }

        .htc-id-label {
          color: var(--htc-ice);
          opacity: 0.85;
          font-weight: 600;
        }

        .htc-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 8px;
          border-radius: 3px;
          border: 1px solid var(--htc-cyan-dim);
          background: rgba(43, 232, 255, 0.09);
          color: var(--htc-cyan);
          font-weight: 700;
        }

        .htc-live-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--htc-cyan);
          box-shadow: 0 0 8px var(--htc-cyan);
          animation: htc-pulse 1.4s ease-in-out infinite;
        }
        @keyframes htc-pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .htc-signal-bars {
          display: inline-flex;
          align-items: flex-end;
          gap: 2px;
          height: 9px;
        }
        .htc-signal-bars i {
          width: 2px;
          display: block;
          background: var(--htc-cyan);
          box-shadow: 0 0 4px rgba(43, 232, 255, 0.7);
          animation: htc-signal 1.6s ease-in-out infinite;
        }
        .htc-signal-bars i:nth-child(1) { height: 4px; animation-delay: 0s; }
        .htc-signal-bars i:nth-child(2) { height: 6px; animation-delay: 0.15s; }
        .htc-signal-bars i:nth-child(3) { height: 8px; animation-delay: 0.3s; }
        .htc-signal-bars i:nth-child(4) { height: 9px; animation-delay: 0.45s; }
        @keyframes htc-signal {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .htc-divider {
          height: 1px;
          background-image: repeating-linear-gradient(
            90deg,
            var(--htc-cyan-dim) 0 6px,
            transparent 6px 9px,
            var(--htc-violet-dim) 9px 15px,
            transparent 15px 18px
          );
        }

        .htc-caret {
          color: var(--htc-yellow);
          text-shadow: 0 0 6px rgba(238, 255, 92, 0.7);
          font-weight: 700;
        }

        .htc-diamond {
          display: inline-block;
          width: 5px;
          height: 5px;
          transform: rotate(45deg);
          flex-shrink: 0;
        }
        .htc-diamond-violet {
          background: var(--htc-violet);
          box-shadow: 0 0 6px rgba(195, 155, 255, 0.85);
        }
        .htc-diamond-cyan {
          background: var(--htc-cyan);
          box-shadow: 0 0 6px rgba(43, 232, 255, 0.85);
        }

        .htc-tag {
          padding: 1px 7px;
          border-radius: 2px;
          font-weight: 700;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }
        .htc-tag-violet {
          color: var(--htc-violet);
          background: rgba(195, 155, 255, 0.12);
          border: 1px solid rgba(195, 155, 255, 0.4);
        }
        .htc-tag-cyan {
          color: var(--htc-cyan);
          background: rgba(43, 232, 255, 0.1);
          border: 1px solid rgba(43, 232, 255, 0.4);
        }
        .htc-tag-value {
          color: var(--htc-ice);
          opacity: 0.92;
          letter-spacing: 0.03em;
        }

        .htc-glow-text {
          color: var(--htc-ice);
          text-shadow:
            0 0 12px rgba(43, 232, 255, 0.55),
            0 0 26px rgba(195, 155, 255, 0.32),
            0 0 2px rgba(255, 255, 255, 0.65);
        }

        /* glitch duplicate layers, activated on card hover */
        .htc-glitch {
          position: relative;
        }
        .htc-glitch::before,
        .htc-glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          opacity: 0;
          pointer-events: none;
        }
        .htc-panel:hover .htc-glitch::before {
          color: var(--htc-cyan);
          transform: translate(-2px, -1px);
          opacity: 0.65;
          mix-blend-mode: screen;
          animation: htc-glitch-shift 1.3s steps(2, end) infinite;
        }
        .htc-panel:hover .htc-glitch::after {
          color: var(--htc-violet);
          transform: translate(2px, 1px);
          opacity: 0.65;
          mix-blend-mode: screen;
          animation: htc-glitch-shift 1.3s steps(2, end) infinite reverse;
        }
        @keyframes htc-glitch-shift {
          0%, 100% { clip-path: inset(0 0 85% 0); }
          20% { clip-path: inset(10% 0 60% 0); }
          40% { clip-path: inset(40% 0 30% 0); }
          60% { clip-path: inset(60% 0 10% 0); }
          80% { clip-path: inset(80% 0 0 0); }
        }

        .htc-cursor {
          display: inline-block;
          width: 6px;
          height: 12px;
          margin-left: 2px;
          background: var(--htc-cyan);
          box-shadow: 0 0 6px rgba(43, 232, 255, 0.8);
          animation: htc-blink 0.85s steps(1) infinite;
          vertical-align: -2px;
        }
        .htc-cursor-lg {
          width: 8px;
          height: 16px;
          background: var(--htc-ice);
          box-shadow: 0 0 8px rgba(242, 253, 255, 0.9);
        }
        @keyframes htc-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        .htc-ticks i {
          width: 2px;
          height: 8px;
          display: inline-block;
          animation: htc-tick 2.4s ease-in-out infinite;
        }
        .htc-ticks i:nth-child(3n+1) { background: var(--htc-cyan); }
        .htc-ticks i:nth-child(3n+2) { background: var(--htc-violet); }
        .htc-ticks i:nth-child(3n) { background: var(--htc-yellow); }
        @keyframes htc-tick {
          0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
          50% { transform: scaleY(1); opacity: 0.9; }
        }

        @media (prefers-reduced-motion: reduce) {
          .htc-scanline,
          .htc-sweep,
          .htc-live-dot,
          .htc-signal-bars i,
          .htc-ticks i,
          .htc-cursor,
          .htc-glitch::before,
          .htc-glitch::after {
            animation: none !important;
          }
          .htc-glitch::before,
          .htc-glitch::after {
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default HeroInfoTerminalCard;