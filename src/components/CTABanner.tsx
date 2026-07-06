import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
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
    <style>{`
  .ignite-heading {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 0.9;
    text-align: center;
  }

  .ignite-ready {
    font-family: "Inter", system-ui, sans-serif;
    font-size: clamp(3rem, 7vw, 6.8rem);
    font-weight: 900;
    letter-spacing: -0.06em;
    color: rgba(255,255,255,0.96);
    text-shadow: 0 0 28px rgba(255,255,255,0.16);
  }

  .ignite-word-wrap {
    position: relative;
    display: inline-block;
    margin-top: 0.08em;
  }

  .ignite-word {
    position: relative;
    z-index: 2;
    display: inline-block;
    font-family: "Orbitron", "Audiowide", system-ui, sans-serif;
    font-size: clamp(4.4rem, 12vw, 12rem);
    font-weight: 900;
    letter-spacing: 0.04em;
    color: transparent;
    background:
      linear-gradient(
        180deg,
        #fff7c2 0%,
        #ffb347 18%,
        #ff4d00 44%,
        #d41414 67%,
        #6d1cff 100%
      );
    -webkit-background-clip: text;
    background-clip: text;
    filter:
      drop-shadow(0 0 12px rgba(255, 94, 0, 0.55))
      drop-shadow(0 0 34px rgba(168, 85, 247, 0.35));
    animation: ignite-lava 3.2s ease-in-out infinite;
  }

  .ignite-word::after {
    content: "IGNITE";
    position: absolute;
    inset: 0;
    z-index: -1;
    color: rgba(255, 72, 0, 0.28);
    filter: blur(18px);
    transform: translateY(8px);
  }

  .ignite-word-wrap::after {
    content: "";
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: -12px;
    height: 5px;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, #ff4d00, #ffd166, #a855f7, transparent);
    box-shadow:
      0 0 18px rgba(255, 94, 0, 0.75),
      0 0 38px rgba(168, 85, 247, 0.5);
    animation: ember-line 2.4s ease-in-out infinite;
  }

  .ignite-flame {
    position: absolute;
    bottom: 88%;
    width: 18px;
    height: 46px;
    border-radius: 50% 50% 45% 45%;
    background: radial-gradient(circle at 50% 80%, #fff7c2 0%, #ffb347 28%, #ff4d00 58%, transparent 72%);
    filter: blur(1px) drop-shadow(0 0 18px rgba(255, 94, 0, 0.8));
    opacity: 0.85;
    transform-origin: bottom center;
    animation: flame-flicker 1.35s ease-in-out infinite;
  }

  .ignite-flame-1 {
    left: 18%;
    animation-delay: 0s;
  }

  .ignite-flame-2 {
    left: 49%;
    height: 58px;
    width: 22px;
    animation-delay: 0.22s;
  }

  .ignite-flame-3 {
    right: 18%;
    animation-delay: 0.44s;
  }

  .ignite-spark {
    position: absolute;
    z-index: 3;
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: #ffd166;
    box-shadow:
      0 0 8px #ffd166,
      0 0 18px rgba(255, 94, 0, 0.9);
    animation: spark-rise 2s ease-in-out infinite;
  }

  .spark-1 { left: 8%; bottom: 25%; animation-delay: 0s; }
  .spark-2 { left: 25%; bottom: 50%; animation-delay: 0.45s; }
  .spark-3 { right: 18%; bottom: 42%; animation-delay: 0.9s; }
  .spark-4 { right: 6%; bottom: 20%; animation-delay: 1.25s; }
  .spark-5 { left: 52%; bottom: 62%; animation-delay: 1.55s; }

  @keyframes ignite-lava {
    0%, 100% {
      filter:
        drop-shadow(0 0 12px rgba(255, 94, 0, 0.55))
        drop-shadow(0 0 34px rgba(168, 85, 247, 0.35));
      transform: translateY(0);
    }
    50% {
      filter:
        drop-shadow(0 0 20px rgba(255, 125, 0, 0.85))
        drop-shadow(0 0 54px rgba(255, 45, 85, 0.5));
      transform: translateY(-2px);
    }
  }

  @keyframes flame-flicker {
    0%, 100% {
      transform: scaleY(0.85) rotate(-4deg);
      opacity: 0.55;
    }
    50% {
      transform: scaleY(1.25) rotate(5deg);
      opacity: 1;
    }
  }

  @keyframes spark-rise {
    0% {
      transform: translateY(0) scale(0.6);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: translateY(-70px) translateX(20px) scale(0.1);
      opacity: 0;
    }
  }

  @keyframes ember-line {
    0%, 100% {
      opacity: 0.65;
      transform: scaleX(0.92);
    }
    50% {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  @media (max-width: 640px) {
    .ignite-word {
      letter-spacing: 0.01em;
    }

    .ignite-flame {
      height: 32px;
    }
  }
`}</style>
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

        <h2 className="ignite-heading mb-7">
  <span className="ignite-ready">Ready to</span>

  <span className="ignite-word-wrap">
    <span className="ignite-word">IGNITE</span>

    {/* flame layer */}
    

    {/* sparks */}
    <span className="ignite-spark spark-1" />
    <span className="ignite-spark spark-2" />
    <span className="ignite-spark spark-3" />
    <span className="ignite-spark spark-4" />
    <span className="ignite-spark spark-5" />
  </span>
</h2>
        <p className="text-lg md:text-2xl text-white/75 max-w-3xl mx-auto mb-10 font-light tracking-wide leading-relaxed">
  Step into Ignitia 2K26 — where tech battles, creative arenas, innovation, 
  and campus energy collide into one unforgettable experience.
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
