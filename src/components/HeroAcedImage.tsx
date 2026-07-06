"use client";


import { motion, useReducedMotion } from "framer-motion";

export default function HeroAcedImage() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative w-[520px] sm:w-[650px] lg:w-[820px] max-w-none select-none -ml-24 sm:-ml-36 lg:-ml-56"
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
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
  src="/images/Terminal.png"
  alt="ACED Ignitia visual"
  className="w-full h-auto object-contain drop-shadow-[0_0_35px_rgba(43,232,255,0.35)]"
/>

        <div className="absolute left-1/2 bottom-4 h-[2px] w-[65%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent blur-[1px]" />
      </motion.div>
    </motion.div>
  );
}