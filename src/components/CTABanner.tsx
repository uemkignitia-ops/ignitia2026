import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import NeonFlicker from "./NeonFlicker";

const CTABanner = () => (
  <section id="register" className="relative py-32 overflow-hidden bg-[#050406]">
    {/* Full-width gradient mesh background */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#050406] to-secondary/10" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_60%)]" />

    {/* Floating Particles/Stars */}
    <div className="absolute inset-0 opacity-40">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * 400,
            opacity: Math.random() * 0.5 + 0.3,
            scale: Math.random() * 1.5 + 0.5,
          }}
          animate={{
            y: [null, Math.random() * -50 - 20],
            opacity: [null, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>

    {/* Animated neon rings */}
    <motion.div
      animate={{ rotate: 360, scale: [1, 1.05, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/20 pointer-events-none opacity-50"
    />
    <motion.div
      animate={{ rotate: -360, scale: [1.05, 1, 1.05] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-secondary/10 pointer-events-none opacity-30"
    />

    <div className="container mx-auto relative z-10 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md mb-8"
        >
          <Sparkles size={14} className="text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary tracking-wide uppercase">
            The Future Is Now
          </span>
        </motion.div>

        <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none filter drop-shadow-2xl mb-6">
          Ready to <NeonFlicker className="gradient-text">Ignite?</NeonFlicker>
        </h2>
        
        <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-light tracking-wide">
          Join thousands of students competing, creating, and connecting at the
          biggest multi-domain event of 2026.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#register"
            className="hero-primary-button pulse-cta w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-lg"
          >
            Register Now
            <ArrowRight size={20} />
          </a>
          <a
            href="#events"
            className="hero-secondary-button glow-button-secondary w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-lg"
          >
            Explore Events
            <ArrowRight size={20} />
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default CTABanner;
