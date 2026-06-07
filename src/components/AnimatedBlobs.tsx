import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from "framer-motion";

const blobs = [
  { color: "bg-primary/10", size: "w-[620px] h-[620px]", x: "50%", y: "48%", duration: 18, centered: true },
  { color: "bg-secondary/6", size: "w-[420px] h-[420px]", x: "60%", y: "52%", duration: 25 },
  { color: "bg-neon-pink/5", size: "w-[320px] h-[320px]", x: "32%", y: "66%", duration: 22 },
  { color: "bg-neon-cyan/6", size: "w-[280px] h-[280px]", x: "58%", y: "18%", duration: 18 },
];

const blobStyles: Record<string, string> = {
  "bg-primary/10": "radial-gradient(circle, hsl(var(--primary) / 0.10) 0%, transparent 70%)",
  "bg-secondary/6": "radial-gradient(circle, hsl(var(--secondary) / 0.06) 0%, transparent 70%)",
  "bg-neon-pink/5": "radial-gradient(circle, hsl(var(--neon-pink) / 0.05) 0%, transparent 70%)",
  "bg-neon-cyan/6": "radial-gradient(circle, hsl(var(--neon-cyan) / 0.06) 0%, transparent 70%)",
};

const AnimatedBlobs = () => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  if (isMobile || prefersReducedMotion) {
    return null;
  }

  const activeBlobs = blobs;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {activeBlobs.map((blob, i) =>
        blob.centered ? (
          <div
            key={i}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: "50vw", top: "50vh" }}
          >
            <motion.div
              className={`rounded-full ${blob.size}`}
              style={{ background: blobStyles[blob.color] }}
              animate={{
                x: isMobile ? [0, 18, -12, 0] : [0, 44, -28, 16, 0],
                y: isMobile ? [0, -14, 10, 0] : [0, -36, 24, -16, 0],
                scale: isMobile ? [1, 1.04, 0.97, 1] : [1, 1.1, 0.92, 1.04, 1],
              }}
              transition={{
                duration: isMobile ? blob.duration * 1.2 : blob.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        ) : (
          <motion.div
            key={i}
            className={`absolute rounded-full ${blob.size}`}
            style={{ left: blob.x, top: blob.y, background: blobStyles[blob.color] }}
            animate={{
              x: isMobile ? [0, 24, -16, 0] : [0, 60, -40, 20, 0],
              y: isMobile ? [0, -18, 14, 0] : [0, -50, 30, -20, 0],
              scale: isMobile ? [1, 1.05, 0.96, 1] : [1, 1.15, 0.9, 1.05, 1],
            }}
            transition={{
              duration: isMobile ? blob.duration * 1.2 : blob.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      )}
    </div>
  );
};

export default AnimatedBlobs;
