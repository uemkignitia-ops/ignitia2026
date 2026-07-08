"use client";


import { motion, useReducedMotion } from "framer-motion";

export default function HeroAcedImage() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative w-full max-w-[380px] select-none mx-auto mt-32"
      initial={{ opacity: 0, y: 110, scale: 0.96 }}
      animate={{ opacity: 1, y: 90, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >


      <motion.div
        animate={reduceMotion ? { y: 0 } : { y: [0, -10, 0] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 4.4, repeat: Infinity, ease: "easeInOut" }
        }
        whileHover={
          reduceMotion
            ? undefined
            : { scale: 1.03, rotateX: 4, rotateY: -5 }
        }
        className="relative"
      >
        <img
          src="/Home page card -- website.png"
          alt="Ignitia Access Card"
          className="w-full h-auto object-contain"
        />
      </motion.div>
    </motion.div>
  );
}