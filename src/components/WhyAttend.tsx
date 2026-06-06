import { useLayoutEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Network, Zap, Award, Handshake, PartyPopper } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    icon: Network,
    title: "Unrivaled Networking",
    description: "Connect with thousands of brilliant minds, visionary mentors, and top-tier industry professionals from over 50 leading institutions.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "group-hover:border-primary/40",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    icon: Zap,
    title: "Skill Evolution",
    description: "Sharpen your coding and design prowess through intense, real-world hackathons.",
    color: "text-neon-cyan",
    bg: "bg-neon-cyan/10",
    border: "group-hover:border-neon-cyan/40",
    glow: "group-hover:shadow-[0_0_30px_rgba(45,245,255,0.15)]",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    icon: Award,
    title: "₹2L+ Prize Pool",
    description: "Compete for massive cash prizes, exclusive swags, and prestigious certificates.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "group-hover:border-secondary/40",
    glow: "group-hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    icon: Handshake,
    title: "Industry Exposure",
    description: "Get noticed by tech giants. Present your innovative ideas directly to hiring partners looking for fresh talent.",
    color: "text-neon-pink",
    bg: "bg-neon-pink/10",
    border: "group-hover:border-neon-pink/40",
    glow: "group-hover:shadow-[0_0_30px_rgba(255,60,160,0.15)]",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    icon: PartyPopper,
    title: "Cultural Extravaganza",
    description: "Experience two days of electrifying music, thrilling games, and unforgettable memories.",
    color: "text-neon-purple",
    bg: "bg-neon-purple/10",
    border: "group-hover:border-neon-purple/40",
    glow: "group-hover:shadow-[0_0_30px_rgba(192,132,252,0.15)]",
    className: "md:col-span-1 md:row-span-1",
  },
];

const WhyAttend = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const orbY1 = useTransform(scrollYProgress, [0, 1], [-50, 100]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [50, -100]);

  useLayoutEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bento-card",
        { autoAlpha: 0, y: 40, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
            end: "top 35%",
            scrub: 0.8,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="relative pt-20 pb-32 overflow-hidden bg-[#050406]">
      {/* Decorative Orbs */}
      <motion.div
        style={isMobile ? undefined : { y: orbY1 }}
        className="absolute top-0 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px] pointer-events-none"
      />
      <motion.div
        style={isMobile ? undefined : { y: orbY2 }}
        className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[150px] pointer-events-none"
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              The Experience
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Why <span className="gradient-text">Attend?</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Discover what makes IGNITIA the most anticipated multi-domain fest of the year.
          </p>
        </motion.div>

        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto"
        >
          {reasons.map((r) => (
            <div
              key={r.title}
              className={`bento-card group relative overflow-hidden rounded-3xl glass-card p-8 transition-all duration-500 border border-white/5 ${r.border} ${r.glow} ${r.className}`}
            >
              {/* Card Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${r.bg} border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                  <r.icon size={26} className={r.color} />
                </div>
                
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3 tracking-tight">
                  {r.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mt-auto font-light">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAttend;
