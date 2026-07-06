"use client";


import { motion, useReducedMotion } from "framer-motion";

export default function HeroAcedImage() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative w-[410px] sm:w-[510px] lg:w-[650px] max-w-none select-none -ml-20 sm:-ml-28 lg:-ml-44"
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
          className="w-full h-auto object-contain"
        />
      </motion.div>
    </motion.div>
  );
}