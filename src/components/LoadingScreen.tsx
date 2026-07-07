import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [fontsReady, setFontsReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const MIN_LOADER_TIME = 2200; // Allow enough time for animation to complete smoothly
    const MAX_LOADER_TIME = 4000; // Absolute fallback max time
    const startTime = Date.now();
    let isMounted = true;

    const criticalAssets = [
      "/images/tuf.png",
      "/images/Mascot.png"
    ];

    const loadImages = Promise.all(
      criticalAssets.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // don't hang if an image fails
        });
      })
    );

    const finishLoading = () => {
      if (!isMounted) return;
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsed);

      timerRef.current = setTimeout(() => {
        if (isMounted) {
          setLoading(false);
          (window as any).__IGNITIA_LOADER_DONE__ = true;
          window.dispatchEvent(new CustomEvent("ignitia:loader-complete"));
        }
      }, remainingTime);
    };

    Promise.all([document.fonts.ready, loadImages]).then(() => {
      if (isMounted) {
        setFontsReady(true);
        finishLoading();
      }
    });

    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setFontsReady(true);
        finishLoading();
      }
    }, MAX_LOADER_TIME);

    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(fallbackTimer);
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
              to   { fill: rgba(255,255,255,0.85); stroke-width: 0px; }
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
                loaderDrawOutline 1.8s ease-in-out forwards,
                loaderFillText 0.8s ease-in-out 1.2s forwards;
            }

            /* Bounding HUD Console Border */
            .preloader-page-border {
              position: absolute;
              inset: 45px;
              pointer-events: none;
              z-index: 50;
            }

            @keyframes borderTopDraw {
              from { transform: scaleX(0); }
              to { transform: scaleX(1); }
            }
            @keyframes borderRightDraw {
              from { transform: scaleY(0); }
              to { transform: scaleY(1); }
            }
            @keyframes borderBottomDraw {
              from { transform: scaleX(0); }
              to { transform: scaleX(1); }
            }
            @keyframes borderLeftDraw {
              from { transform: scaleY(0); }
              to { transform: scaleY(1); }
            }

            .border-line {
              position: absolute;
              background: rgba(255, 255, 255, 0.18);
              will-change: transform;
              transform: translate3d(0, 0, 0);
              backface-visibility: hidden;
            }
            .border-line-top {
              top: 0; left: 0; right: 0; height: 1px;
              transform-origin: left;
              animation: borderTopDraw 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }
            .border-line-right {
              top: 0; bottom: 0; right: 0; width: 1px;
              transform-origin: top;
              animation: borderRightDraw 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s forwards;
              transform: scaleY(0);
            }
            .border-line-bottom {
              bottom: 0; left: 0; right: 0; height: 1px;
              transform-origin: right;
              animation: borderBottomDraw 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards;
              transform: scaleX(0);
            }
            .border-line-left {
              top: 0; bottom: 0; left: 0; width: 1px;
              transform-origin: bottom;
              animation: borderLeftDraw 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.45s forwards;
              transform: scaleY(0);
            }

            /* Tech brackets styling (All-white) */
            @keyframes bracketFadeIn {
              from { opacity: 0; transform: scale(0.92); }
              to { opacity: 0.75; transform: scale(1); }
            }
            .tech-bracket {
              position: absolute;
              width: 12px;
              height: 12px;
              border-color: rgba(255, 255, 255, 0.75);
              animation: bracketFadeIn 0.8s ease-out 0.9s forwards;
              opacity: 0;
            }
            .bracket-tl { top: 0; left: 0; border-top: 1.5px solid; border-left: 1.5px solid; }
            .bracket-tr { top: 0; right: 0; border-top: 1.5px solid; border-right: 1.5px solid; }
            .bracket-bl { bottom: 0; left: 0; border-bottom: 1.5px solid; border-left: 1.5px solid; }
            .bracket-br { bottom: 0; right: 0; border-bottom: 1.5px solid; border-right: 1.5px solid; }

            /* Glowing white nodes */
            @keyframes nodePulse {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 0.9; transform: scale(1.2); }
            }
            .glow-node {
              position: absolute;
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: #ffffff;
              box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
              animation: bracketFadeIn 0.5s ease-out 1.1s forwards, nodePulse 2.5s infinite ease-in-out;
              opacity: 0;
              margin: -1.5px;
            }
            .node-tl { top: 0; left: 0; }
            .node-tr { top: 0; right: 0; }
            .node-bl { bottom: 0; left: 0; }
            .node-br { bottom: 0; right: 0; }

            @media (max-width: 768px) {
              .preloader-page-border {
                inset: 30px;
              }
              .tech-bracket {
                width: 9px;
                height: 9px;
              }
            }

            @media (max-width: 480px) {
              .preloader-page-border {
                inset: 24px;
              }
              .ignitia-loader-text {
                font-size: 76px;
                letter-spacing: 5px;
                stroke-dasharray: 600;
                stroke-dashoffset: 600;
              }
              @keyframes loaderDrawOutline {
                from { stroke-dashoffset: 600; }
                to   { stroke-dashoffset: 0; }
              }
            }
          `}</style>

          {/* Centered IGNITIA Branding SVG */}
          <div style={{ width: "90%", maxWidth: 550, padding: "0 16px", zIndex: 10 }}>
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

          {/* Futuristic CSS-Animated Page Frame Border (near edges but inset) */}
          <div className="preloader-page-border">
            <div className="border-line border-line-top" />
            <div className="border-line border-line-right" />
            <div className="border-line border-line-bottom" />
            <div className="border-line border-line-left" />

            <div className="tech-bracket bracket-tl" />
            <div className="tech-bracket bracket-tr" />
            <div className="tech-bracket bracket-bl" />
            <div className="tech-bracket bracket-br" />

            <div className="glow-node node-tl" />
            <div className="glow-node node-tr" />
            <div className="glow-node node-bl" />
            <div className="glow-node node-br" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
