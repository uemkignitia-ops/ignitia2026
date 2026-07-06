import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import NeonFlicker from "./NeonFlicker";
import { Link } from "react-router-dom";

// Pre-generated star positions to avoid Math.random() on every render
const STARS = [
  { left: "5%", top: "20%", delay: "0s", dur: "3.1s" },
  { left: "12%", top: "60%", delay: "0.4s", dur: "4.2s" },
  { left: "22%", top: "35%", delay: "0.8s", dur: "2.8s" },
  { left: "35%", top: "75%", delay: "1.1s", dur: "3.7s" },
  { left: "48%", top: "15%", delay: "0.2s", dur: "4.5s" },
  { left: "57%", top: "55%", delay: "1.6s", dur: "3.0s" },
  { left: "68%", top: "30%", delay: "0.7s", dur: "3.9s" },
  { left: "78%", top: "70%", delay: "1.3s", dur: "2.6s" },
  { left: "88%", top: "45%", delay: "0.9s", dur: "4.1s" },
  { left: "93%", top: "10%", delay: "1.8s", dur: "3.3s" },
];

const CTABanner = () => (
  <section
    id="register"
    className="relative py-32 overflow-hidden bg-transparent"
  >
    {/* Full-width gradient mesh background */}
    <div
      className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
      }}
    />
    <div
      className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_60%)]"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
      }}
    />

    {/* Static CSS-animated stars — no JS animation, GPU composited */}
    <div className="absolute inset-0 opacity-40" aria-hidden="true">
      {STARS.map((s, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white animate-float-particle"
          style={
            {
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              "--duration": s.dur,
            } as React.CSSProperties
          }
        />
      ))}
    </div>

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
          className="flex flex-row sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto"
        >
          <Link
            to="/events"
            className="hero-primary-button pulse-cta flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-1.5 sm:gap-3 px-2 sm:px-8 py-3 sm:py-4 text-xs sm:text-lg whitespace-nowrap"
          >
            Register Now
            <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
          </Link>
          <Link
            to="/events"
            className="hero-secondary-button glow-button-secondary flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-1.5 sm:gap-3 px-2 sm:px-8 py-3 sm:py-4 text-xs sm:text-lg whitespace-nowrap"
          >
            Explore Events
            <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default CTABanner;
