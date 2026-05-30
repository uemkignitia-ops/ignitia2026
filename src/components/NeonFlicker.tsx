import { motion } from "framer-motion";
import { ReactNode } from "react";

const flickerVariants = {
  animate: {
    opacity: [1, 0.4, 1, 1, 0.3, 1, 1, 1, 0.5, 1],
    textShadow: [
      "0 0 10px hsl(0 95% 60% / 0.8), 0 0 40px hsl(20 90% 60% / 0.35)",
      "0 0 2px hsl(20 90% 60% / 0.2)",
      "0 0 10px hsl(0 95% 60% / 0.8), 0 0 40px hsl(20 90% 60% / 0.35)",
      "0 0 10px hsl(0 95% 60% / 0.8), 0 0 40px hsl(20 90% 60% / 0.35)",
      "0 0 2px hsl(0 95% 60% / 0.12)",
      "0 0 10px hsl(0 95% 60% / 0.8), 0 0 40px hsl(20 90% 60% / 0.35)",
      "0 0 10px hsl(0 95% 60% / 0.8), 0 0 40px hsl(20 90% 60% / 0.35)",
      "0 0 10px hsl(0 95% 60% / 0.8), 0 0 40px hsl(20 90% 60% / 0.35)",
      "0 0 3px hsl(20 90% 60% / 0.2)",
      "0 0 10px hsl(0 95% 60% / 0.8), 0 0 40px hsl(20 90% 60% / 0.35)",
    ],
    transition: { duration: 4, repeat: Infinity, ease: "linear" as const },
  },
};

const NeonFlicker = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.span variants={flickerVariants} animate="animate" className={`inline-block ${className}`}>
    {children}
  </motion.span>
);

export default NeonFlicker;
