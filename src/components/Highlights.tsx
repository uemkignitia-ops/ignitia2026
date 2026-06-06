import { useLayoutEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Trophy, Users, School, Gamepad2, Code } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Gamepad2, value: "7+", label: "Competitions", color: "text-primary", bg: "bg-primary/20" },
  {
    icon: Users,
    value: "5000+",
    label: "Expected Footfall",
    color: "text-neon-cyan",
    bg: "bg-neon-cyan/20"
  },
  {
    icon: School,
    value: "50+",
    label: "Colleges Invited",
    color: "text-neon-purple",
    bg: "bg-neon-purple/20"
  },
  {
    icon: Trophy,
    value: "200000+",
    rawDisplay: "₹2L+",
    label: "Prize Pool",
    color: "text-secondary",
    bg: "bg-secondary/20"
  },
  {
    icon: Code,
    value: "10+",
    label: "Societies Involved",
    color: "text-primary",
    bg: "bg-primary/20"
  },
];

const StatCard = ({ stat, index }: { stat: (typeof stats)[0]; index: number }) => {
  const { ref, display } = useCountUp(stat.value);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="highlight-card shrink-0 w-64 md:w-full glass-card p-8 text-center group hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg ${stat.bg} border border-white/10`}
        >
          <stat.icon
            className={`${stat.color} group-hover:scale-110 transition-transform`}
            size={32}
          />
        </motion.div>
        
        <p
          ref={ref}
          className={`font-heading text-4xl md:text-5xl font-bold tracking-tighter mb-2 ${stat.rawDisplay ? "gradient-text" : "text-white"}`}
        >
          {stat.rawDisplay || display}
        </p>
        <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">{stat.label}</p>
      </div>
    </motion.div>
  );
};

const Highlights = ({ centerOnMobile = false }: { centerOnMobile?: boolean }) => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [40, -20]);

  useLayoutEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".highlight-card",
        { autoAlpha: 0, y: 50, scale: 0.9 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="relative pt-8 pb-20 md:py-28 overflow-hidden">
      {/* Top gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-primary/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            By The <span className="gradient-text">Numbers</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            The scale of innovation and competition at IGNITIA 2K26.
          </p>
        </motion.div>

        {isMobile ? (
          /* Mobile: Horizontal scroll */
          <div className="-mx-4 px-4 pb-8 overflow-x-auto flex gap-4 snap-x snap-mandatory custom-scrollbar">
            {stats.map((stat, i) => (
              <div key={stat.label} className="snap-center first:pl-4 last:pr-4">
                <StatCard stat={stat} index={i} />
              </div>
            ))}
          </div>
        ) : (
          /* Desktop: Grid */
          <motion.div
            ref={gridRef}
            style={{ y: gridY }}
            className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-items-stretch"
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Highlights;
