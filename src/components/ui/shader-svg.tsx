import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useId } from "react";

const W = 80;
const H = 100;

export function MeshGradientSVG() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const reactId = useId();
  const gradId = `ghostGradient-${reactId.replace(/:/g, "")}`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Mouse tracking delta
      const deltaX = (mousePosition.x - centerX) * 0.08;
      const deltaY = (mousePosition.y - centerY) * 0.08;

      const maxOffset = 8;
      setEyeOffset({
        x: Math.max(-maxOffset, Math.min(maxOffset, deltaX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, deltaY)),
      });
    }
  }, [mousePosition]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="ig-ghost-float relative cursor-pointer"
      style={{
        width: W,
        height: H,
        filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))",
      }}
    >
      <style>{`
        .ig-ghost-float {
          animation: ig-float 3.5s ease-in-out infinite;
          transform-origin: top center;
        }
        @keyframes ig-float {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-10px) scaleY(1.05); }
        }
        .animate-blink {
          animation: blink 3s infinite ease-in-out;
        }
        @keyframes blink {
          0%, 90%, 100% { ry: 30px; }
          95% { ry: 3px; }
        }
      `}</style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 231 289"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB3D9">
              <animate attributeName="stop-color" values="#FFB3D9;#87CEEB;#4A90E2;#FFB3D9" dur="10s" repeatCount="indefinite" />
            </stop>
            <stop offset="40%" stopColor="#9B59B6">
              <animate attributeName="stop-color" values="#9B59B6;#4A90E2;#FFB3D9;#9B59B6" dur="10s" repeatCount="indefinite" />
            </stop>
            <stop offset="70%" stopColor="#4A90E2">
              <animate attributeName="stop-color" values="#4A90E2;#FFB3D9;#87CEEB;#4A90E2" dur="10s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#1A1A2E">
              <animate attributeName="stop-color" values="#1A1A2E;#2C3E50;#1A1A2E;#1A1A2E" dur="10s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Ghost Body path */}
        <path
          d="M230.809 115.385V249.411C230.809 269.923 214.985 287.282 194.495 288.411C184.544 288.949 175.364 285.718 168.26 280C159.746 273.154 147.769 273.461 139.178 280.23C132.638 285.384 124.381 288.462 115.379 288.462C106.377 288.462 98.1451 285.384 91.6055 280.23C82.912 273.385 70.9353 273.385 62.2415 280.23C55.7532 285.334 47.598 288.411 38.7246 288.462C17.4132 288.615 0 270.667 0 249.359V115.385C0 51.6667 51.6756 0 115.404 0C179.134 0 230.809 51.6667 230.809 115.385Z"
          fill={`url(#${gradId})`}
        />

        <AnimatePresence mode="wait">
          {isHovered ? (
            <g key="happy-face">
              {/* Left Happy Eye Arc */}
              <motion.path
                d="M 60 125 Q 80 100, 100 125"
                fill="none"
                stroke="#0f0f15"
                strokeWidth="7"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                transition={{ duration: 0.15 }}
              />

              {/* Right Happy Eye Arc */}
              <motion.path
                d="M 130 125 Q 150 100, 170 125"
                fill="none"
                stroke="#0f0f15"
                strokeWidth="7"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                transition={{ duration: 0.15 }}
              />

              {/* Laughing Mouth */}
              <motion.path
                d="M 98 150 Q 115.5 180, 133 150 Z"
                fill="#0f0f15"
                initial={{ scale: 0, y: -5 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: -5 }}
                transition={{ type: "spring", stiffness: 250, damping: 15 }}
              />
            </g>
          ) : (
            <g key="normal-face">
              {/* Left Normal Eye */}
              <motion.ellipse
                cx={80}
                cy={120}
                rx="20"
                ry="30"
                fill="#0f0f15"
                className="animate-blink"
                animate={{
                  cx: 80 + eyeOffset.x,
                  cy: 120 + eyeOffset.y,
                }}
                transition={{ type: "spring", stiffness: 180, damping: 15 }}
              />

              {/* Right Normal Eye */}
              <motion.ellipse
                cx={150}
                cy={120}
                rx="20"
                ry="30"
                fill="#0f0f15"
                className="animate-blink"
                animate={{
                  cx: 150 + eyeOffset.x,
                  cy: 120 + eyeOffset.y,
                }}
                transition={{ type: "spring", stiffness: 180, damping: 15 }}
              />

              {/* Cute Default Smile */}
              <motion.path
                d="M 105 153 Q 115.5 163, 126 153"
                fill="none"
                stroke="#0f0f15"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
              />
            </g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
