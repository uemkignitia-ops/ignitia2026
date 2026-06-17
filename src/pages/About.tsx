import { useRef, useEffect, useState, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";
import AboutScrollScene from "@/components/AboutScrollScene";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";
import { Cpu, Globe, Lightbulb, Sparkles, Users, Facebook, Instagram, Linkedin, Github, ArrowRight } from "lucide-react";
import { TerminalSubheading } from "@/components/TerminalSubheading";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const clubs = [
  { name: "IEM-UEM group", role: "Lead Organizer", icon: Cpu },
  { name: "Microsoft Student Society UEMK", role: "Hosting Partner", icon: Globe },
  { name: "Department of CSE (IOT,CS,BT)", role: "Knowledge Partner", icon: Lightbulb },
];

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const About = () => {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    // Artificial load delay to let R3F load smoothly
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#about-showcase-section",
          start: "top top",
          end: isMobile ? "+=1500" : "+=2500",
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        },
      });

      // Timeline transitions for sci-fi overlay panels

      // Phase 1: Hero content fades out
      tl.to("#about-hero-content", {
        opacity: 0,
        y: -40,
        duration: 0.6,
        ease: "power2.inOut",
      });

      // Phase 2: Vision content fades in
      tl.fromTo("#about-vision-content",
        { opacity: 0, y: 40, pointerEvents: "none" },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.8, ease: "power2.out" }
      );

      // Keep it visible for a scrub duration, then fade out
      tl.to("#about-vision-content", {
        opacity: 0,
        y: -40,
        pointerEvents: "none",
        duration: 0.6,
        delay: 0.6,
        ease: "power2.inOut",
      });

      // Phase 3: Stats telemetry fades in
      tl.fromTo("#about-stats-content",
        { opacity: 0, y: 40, pointerEvents: "none" },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.8, ease: "power2.out" }
      );

    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded, isMobile]);

  return (
    <PageTransition>
      <div ref={containerRef} className="min-h-screen bg-background scanline-overlay text-white overflow-x-hidden">
        <ParticleField />
        <AnimatedBlobs />
        <ScrollProgress />
        <Navbar />

        {/* 3D Showcase Section (Pinned) */}
        <section
          id="about-showcase-section"
          className="relative h-screen w-full bg-[#050406] overflow-hidden"
        >
          {/* Full Canvas behind overlays */}
          <Suspense fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050406] z-10">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
              <span className="text-xs tracking-widest text-primary uppercase animate-pulse font-mono">Loading Experience...</span>
            </div>
          }>
            <AboutScrollScene scrollProgressRef={scrollProgressRef} />
          </Suspense>

          {/* Mobile bottom-half scroll overlay */}
          <div className="md:hidden absolute bottom-0 left-0 w-full h-[55%] z-10" aria-hidden="true" />

          {/* HUD Frame brackets */}
          <div className="absolute inset-6 md:inset-10 border border-white/[0.02] pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-secondary/60" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-secondary/60" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-secondary/60" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-secondary/60" />
          </div>

          {/* Overlay 1: Hero Title (Initially Visible) */}
          <div
            id="about-hero-content"
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-20"
          >
            <p className="text-[10px] md:text-xs text-primary uppercase tracking-[0.4em] mb-5 font-semibold font-mono flex items-center justify-center gap-2">
              <Cpu size={14} className="text-primary" /> OUR STORY & VISION
            </p>
            <div className="relative w-full" style={{ perspective: "800px" }}>
              <div style={{ transformStyle: "preserve-3d" }}>
                {/* Shadow/depth clone */}
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
                  style={{ transform: "translateZ(-40px) translateY(12px)" }}
                >
                  <span
                    className="font-heading font-black uppercase leading-none tracking-tight text-center w-full"
                    style={{
                      fontSize: "clamp(2.5rem, 10vw, 5.5rem)",
                      color: "rgba(88,28,235,0.25)",
                      filter: "blur(8px)",
                    }}
                  >
                    ABOUT IGNITIA
                  </span>
                </div>

                {/* Actual title */}
                <h1
                  className="font-heading font-black uppercase leading-none tracking-tight w-full text-center relative"
                  style={{ fontSize: "clamp(2.5rem, 10vw, 5.5rem)", transformStyle: "preserve-3d" }}
                >
                  <span
                    className="inline-block mr-[0.15em]"
                    style={{
                      color: "rgba(255,255,255,0.28)",
                      fontWeight: 300,
                      textShadow: "0 2px 20px rgba(139,92,246,0.1)",
                    }}
                  >
                    ABOUT
                  </span>

                  <span
                    className="inline-block relative"
                    style={{
                      color: "#ffffff",
                      textShadow: [
                        "0 0 60px rgba(139,92,246,0.9)",
                        "0 0 120px rgba(139,92,246,0.5)",
                        "0 2px 0 rgba(88,28,235,0.6)",
                        "0 4px 0 rgba(68,14,180,0.4)",
                        "0 8px 20px rgba(0,0,0,0.6)",
                      ].join(", "),
                    }}
                  >
                    IGNITIA
                  </span>
                </h1>
              </div>
            </div>

            <p className="text-muted-foreground text-sm max-w-xl mx-auto font-medium leading-relaxed mt-10">
              The flagship multi-domain event organized by the IEM-UEM group
              at UEM Kolkata - where innovation, creativity, and
              competition converge.
            </p>
          </div>

          {/* Overlay 2: Vision Panel (Fades in on scroll) */}
          <div
            id="about-vision-content"
            className="absolute inset-0 flex items-center justify-start pointer-events-none z-20 opacity-0"
          >
            <div className="container mx-auto px-6 md:px-16 lg:px-20">
              <div className="max-w-xl border border-white/10 bg-black/80 backdrop-blur-md p-6 md:p-8 relative"
                style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
              >
                <div className="absolute top-0 right-0 w-5 h-5 bg-primary/40" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                <div className="absolute bottom-0 left-0 w-5 h-5 bg-primary/40" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-primary/50" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-primary/50" />

                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-primary uppercase">Our Vision</span>
                </div>

                <TerminalSubheading
                  text="Igniting the Next Generation of Innovators."
                  className="font-mono text-xl md:text-2xl font-bold tracking-tight mb-4 text-white"
                />

                <div className="grid md:grid-cols-2 gap-4 text-xs text-white/60 leading-relaxed font-mono">
                  <p className="border-l border-primary/20 pl-2">
                    IGNITIA &apos;26 aims to create a vibrant ecosystem where students
                    from diverse backgrounds come together to learn, compete, and
                    innovate. We believe in the power of technology to transform ideas.
                  </p>
                  <p className="border-l border-primary/20 pl-2">
                    From high-stakes coding battles to creative cultural
                    showcases, every event is designed to push boundaries and
                    inspire the next wave of tech leaders.
                  </p>
                </div>

                {/* Social links */}
                <div className="flex gap-4 mt-6">
                  {[
                    { icon: DiscordIcon, href: "https://discord.gg/shUKTMPMTj" },
                    { icon: Instagram, href: "https://www.instagram.com/ignitia2k26" },
                    { icon: Facebook, href: "https://www.facebook.com/people/Ignitia/61573281091277/" },
                    { icon: Linkedin, href: "https://www.linkedin.com/company/ignitia2k26" },
                  ].map((soc, i) => (
                    <motion.a
                      key={i}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative z-50 pointer-events-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-card/60 text-muted-foreground transition-colors hover:text-white hover:border-white/20"
                    >
                      <soc.icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Overlay 3: Telemetry Stats Panel (Fades in on scroll) */}
          <div
            id="about-stats-content"
            className="absolute inset-0 flex items-center justify-start pointer-events-none z-20 opacity-0"
          >
            {/* Cyber telemetry lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
              <line x1="75%" y1="30%" x2="52%" y2="25%" stroke="rgba(168,85,247,0.2)" strokeWidth="1" strokeDasharray="4 6" />
              <line x1="78%" y1="55%" x2="52%" y2="55%" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="3 8" />
              <circle cx="75%" cy="30%" r="3" fill="rgba(168,85,247,0.4)" />
              <circle cx="78%" cy="55%" r="3" fill="rgba(6,182,212,0.3)" />
            </svg>

            <div className="container mx-auto px-6 md:px-16 lg:px-20">
              <div className="max-w-xl border border-white/10 bg-black/85 backdrop-blur-md p-6 md:p-8 relative"
                style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
              >
                <div className="absolute top-0 right-0 w-5 h-5 bg-cyan-500/40" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                <div className="absolute bottom-0 left-0 w-5 h-5 bg-cyan-500/40" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-500/50" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-500/50" />

                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-cyan-400/80 uppercase">Key Metrics</span>
                </div>

                <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  Ignitia 2K26{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
                    By The Numbers
                  </span>
                </h2>

                <div className="space-y-3 font-mono">
                  {[
                    { label: "PRIZE POOL", value: "₹2,00,000+", pct: 90, color: "from-primary to-pink-500" },
                    { label: "EXPECTED FOOTFALL", value: "1000+ Participants", pct: 85, color: "from-purple-500 to-indigo-500" },
                    { label: "COLLABORATING COLLEGES", value: "50+ Regional Colleges", pct: 75, color: "from-cyan-400 to-teal-400" },
                    { label: "COMPETITIVE ARENAS", value: "7+ Events", pct: 60, color: "from-yellow-500 to-primary" },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[10px] md:text-xs">
                        <span className="text-white/45">{stat.label}</span>
                        <span className="text-white font-bold">{stat.value}</span>
                      </div>
                      <div className="h-[3px] bg-white/10 w-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-1000`}
                          style={{ width: `${stat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <Link to="/events" className="bg-primary hover:bg-primary shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-primary flex items-center gap-2 transition-all text-white px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wider cursor-pointer">
                    REGISTER NOW <ArrowRight size={14} />
                  </Link>
                  <Link to="/events" className="border border-white/10 hover:border-white/30 bg-black/20 flex items-center justify-center text-white px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wider transition-all">
                    VIEW EVENTS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clubs - Diagonal entry */}
        <section className="section-padding relative z-30 bg-[#050406]">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs text-primary uppercase tracking-[0.3em] font-mono mb-2">
                COLLABORATING SOCIETIES
              </p>
              <TerminalSubheading
                text="Powered by Community"
                className="font-mono text-2xl md:text-3xl font-bold text-foreground"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {clubs.map((club) => {
                const Icon = club.icon;
                return (
                  <div
                    key={club.name}
                    className="relative group bg-card/40 backdrop-blur-md p-6 text-center border border-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden cursor-pointer"
                    style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))" }}
                  >
                    <div className="absolute top-0 right-0 w-4 h-4 bg-primary/20 group-hover:bg-primary/40 transition-colors" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 bg-primary/20 group-hover:bg-primary/40 transition-colors" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />

                    {/* Scanning line effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent translate-y-[-100%] group-hover:animate-scanline pointer-events-none" />

                    <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} className="text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-mono text-base font-bold text-white/90 mb-1 tracking-wide relative z-10">
                      {club.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-primary/60 font-mono relative z-10">{club.role}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* IEM-UEM group */}
        <section className="section-padding relative z-30 bg-[#050406]">
          <div className="container mx-auto">
            <div className="glass-card bg-card/75 backdrop-blur-2xl p-8 md:p-12 max-w-4xl mx-auto text-center shimmer-card border border-white/5 relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/30" />

              <Users className="text-primary mx-auto mb-4" size={40} />
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                IEM-UEM Group
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                The IEM-UEM group is a thriving ecosystem of education and
                innovation, fostering excellence in engineering, management,
                and science across their various campuses.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                IGNITIA is their flagship annual event, bringing together the
                best minds from across the region to compete, learn, and
                celebrate technology.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default About;
