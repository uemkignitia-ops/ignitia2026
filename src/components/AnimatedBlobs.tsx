import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const blobs = [
  { color: "bg-primary/8", size: "w-[500px] h-[500px]", x: "-10%", y: "20%", duration: 20 },
  { color: "bg-secondary/6", size: "w-[400px] h-[400px]", x: "70%", y: "50%", duration: 25 },
  { color: "bg-neon-pink/5", size: "w-[350px] h-[350px]", x: "30%", y: "70%", duration: 22 },
  { color: "bg-neon-cyan/6", size: "w-[300px] h-[300px]", x: "60%", y: "10%", duration: 18 },
];

const AnimatedBlobs = () => {
  const isMobile = useIsMobile();
  const activeBlobs = isMobile ? blobs.slice(0, 2) : blobs;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {activeBlobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${blob.color} ${blob.size} ${isMobile ? "blur-[95px]" : "blur-[150px]"}`}
          style={{ left: blob.x, top: blob.y }}
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
      ))}
    </div>
  );
};

export default AnimatedBlobs;
