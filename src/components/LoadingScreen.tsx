import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [fontsReady, setFontsReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Wait for Orbitron font to load before starting the animation.
    // This prevents jitter from the browser swapping fallback → Orbitron mid-animation.
    document.fonts.ready.then(() => {
      setFontsReady(true);

      // Start the dismiss timer only after fonts are ready
      timerRef.current = setTimeout(() => {
        setLoading(false);
        (window as any).__IGNITIA_LOADER_DONE__ = true;
        window.dispatchEvent(new CustomEvent("ignitia:loader-complete"));
      }, 3100);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#000000",
            willChange: "opacity",
          }}
        >
          <style>{`
            @keyframes loaderDrawOutline {
              from { stroke-dashoffset: 600; }
              to   { stroke-dashoffset: 0; }
            }
            @keyframes loaderFillText {
              from { fill: rgba(255,255,255,0); stroke-width: 2px; }
              to   { fill: rgba(255,255,255,0.75); stroke-width: 0px; }
            }

            .ignitia-loader-text {
              font-family: 'Orbitron', 'Rajdhani', system-ui, sans-serif;
              font-size: 80px;
              font-weight: 900;
              letter-spacing: 6px;
              stroke: #ffffff;
              stroke-width: 2px;
              stroke-linecap: round;
              stroke-linejoin: round;
              fill: rgba(255,255,255,0);
              stroke-dasharray: 600;
              stroke-dashoffset: 600;
              will-change: stroke-dashoffset, fill, stroke-width;
            }

            .ignitia-loader-text.animate {
              animation:
                loaderDrawOutline 2s ease-in-out forwards,
                loaderFillText 1s ease-in-out 1.5s forwards;
            }

            @media (max-width: 480px) {
              .ignitia-loader-text {
                font-size: 68px;
                letter-spacing: 4px;
                stroke-dasharray: 400;
                stroke-dashoffset: 400;
              }
              @keyframes loaderDrawOutline {
                from { stroke-dashoffset: 400; }
                to   { stroke-dashoffset: 0; }
              }
            }
          `}</style>

          <div style={{ width: "90%", maxWidth: 550, padding: "0 16px" }}>
            <svg
              viewBox="0 0 500 100"
              style={{ width: "100%", height: "auto", display: "block" }}
              aria-label="Loading IGNITIA"
            >
              <text
                x="50%"
                y="55%"
                dominantBaseline="middle"
                textAnchor="middle"
                className={`ignitia-loader-text${fontsReady ? " animate" : ""}`}
              >
                IGNITIA
              </text>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
