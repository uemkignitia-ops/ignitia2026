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

gsap.registerPlugin(ScrollTrigger);

const clubs = [
  { name: "IEM-UEM group", role: "Lead Organizer", icon: Cpu },
  { name: "Google Developer Group", role: "Tech Partner", icon: Globe },
  { name: "IEEE Student Branch", role: "Knowledge Partner", icon: Lightbulb },
  { name: "ACM Chapter", role: "Coding Partner", icon: Sparkles },
];

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
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      
      // Keep it visible for a scrub duration, then fade out
      tl.to("#about-vision-content", {
        opacity: 0,
        y: -40,
        duration: 0.6,
        delay: 0.6,
        ease: "power2.inOut",
      });

      // Phase 3: Stats telemetry fades in
      tl.fromTo("#about-stats-content",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
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
              <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4" />
              <span className="text-xs tracking-widest text-orange-500 uppercase animate-pulse font-mono">Initializing Telemetry Link...</span>
            </div>
          }>
            <AboutScrollScene scrollProgressRef={scrollProgressRef} />
          </Suspense>

          {/* HUD Frame brackets */}
          <div className="absolute inset-6 md:inset-10 border border-white/[0.02] pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-orange-500/50" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-orange-500/50" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-orange-500/50" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-orange-500/50" />
          </div>

          {/* Overlay 1: Hero Title (Initially Visible) */}
          <div
            id="about-hero-content"
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-20"
          >
            <p className="text-[10px] md:text-xs text-orange-500 uppercase tracking-[0.4em] mb-3 font-semibold font-mono">
              OUR STORY & VISION — IGNITIA &apos;26
            </p>
            <div className="relative inline-block mb-3 px-6 py-2">
              <div className="absolute left-0 -top-2 w-3 h-3 border-t-2 border-l-2 border-orange-500/50" />
              <div className="absolute right-0 -top-2 w-3 h-3 border-t-2 border-r-2 border-orange-500/50" />
              <div className="absolute left-0 -bottom-2 w-3 h-3 border-b-2 border-l-2 border-orange-500/50" />
              <div className="absolute right-0 -bottom-2 w-3 h-3 border-b-2 border-r-2 border-orange-500/50" />

              <h1 className="font-heading text-5xl md:text-7xl font-black tracking-wider uppercase mb-0">
                <span className="text-white/40 font-light mr-3 select-none">ABOUT</span>
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  IGNITIA
                </span>
              </h1>
            </div>

            <p className="text-muted-foreground text-sm max-w-xl mx-auto font-medium leading-relaxed mt-4">
              The flagship multi-domain event organized by the IEM-UEM group
              at UEM Kolkata — where innovation, creativity, and
              competition converge.
            </p>
          </div>

          {/* Overlay 2: Vision Panel (Fades in on scroll) */}
          <div
            id="about-vision-content"
            className="absolute inset-0 flex items-center justify-start pointer-events-none z-20 opacity-0"
          >
            <div className="container mx-auto px-6 md:px-16 lg:px-20">
              <div className="max-w-xl border border-white/10 bg-black/80 backdrop-blur-md p-6 md:p-8 relative pointer-events-auto"
                style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
              >
                <div className="absolute top-0 right-0 w-5 h-5 bg-orange-500/40" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                <div className="absolute bottom-0 left-0 w-5 h-5 bg-orange-500/40" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange-500/50" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange-500/50" />

                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-orange-400 uppercase">Core Directive // Vision Statement</span>
                </div>

                <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  Igniting the Next Generation of{" "}
                  <span className="text-orange-500">Innovators.</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-4 text-xs text-white/60 leading-relaxed font-mono">
                  <p className="border-l border-orange-500/20 pl-2">
                    IGNITIA &apos;26 aims to create a vibrant ecosystem where students
                    from diverse backgrounds come together to learn, compete, and
                    innovate. We believe in the power of technology to transform ideas.
                  </p>
                  <p className="border-l border-orange-500/20 pl-2">
                    From high-stakes coding battles to creative cultural
                    showcases, every event is designed to push boundaries and
                    inspire the next wave of tech leaders.
                  </p>
                </div>

                {/* Social links */}
                <div className="flex gap-4 mt-6">
                  {[
                    { icon: Facebook, href: "https://www.facebook.com" },
                    { icon: Instagram, href: "https://www.instagram.com" },
                    { icon: Linkedin, href: "https://www.linkedin.com" },
                    { icon: Github, href: "https://www.github.com" },
                  ].map((soc, i) => (
                    <a
                      key={i}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 border border-white/10 bg-black/40 rounded-lg flex items-center justify-center hover:text-orange-500 hover:border-orange-500/50 transition-colors"
                    >
                      <soc.icon size={14} />
                    </a>
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
              <line x1="75%" y1="30%" x2="52%" y2="25%" stroke="rgba(249,115,22,0.2)" strokeWidth="1" strokeDasharray="4 6" />
              <line x1="78%" y1="55%" x2="52%" y2="55%" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="3 8" />
              <circle cx="75%" cy="30%" r="3" fill="rgba(249,115,22,0.4)" />
              <circle cx="78%" cy="55%" r="3" fill="rgba(6,182,212,0.3)" />
            </svg>

            <div className="container mx-auto px-6 md:px-16 lg:px-20">
              <div className="max-w-xl border border-white/10 bg-black/85 backdrop-blur-md p-6 md:p-8 relative pointer-events-auto"
                style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
              >
                <div className="absolute top-0 right-0 w-5 h-5 bg-cyan-500/40" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                <div className="absolute bottom-0 left-0 w-5 h-5 bg-cyan-500/40" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-500/50" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-500/50" />

                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-cyan-400/80 uppercase">Telemetry Readout // Fest Metrics</span>
                </div>

                <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  Ignitia 2K26{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-cyan-400">
                    By The Numbers
                  </span>
                </h2>

                <div className="space-y-3 font-mono">
                  {[
                    { label: "PRIZE POOL", value: "₹2,00,000+", pct: 90, color: "from-orange-500 to-pink-500" },
                    { label: "EXPECTED FOOTFALL", value: "1000+ Participants", pct: 85, color: "from-purple-500 to-indigo-500" },
                    { label: "COLLABORATING COLLEGES", value: "50+ Regional Colleges", pct: 75, color: "from-cyan-400 to-teal-400" },
                    { label: "COMPETITIVE ARENAS", value: "7+ Events", pct: 60, color: "from-yellow-500 to-orange-500" },
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
                  <button className="bg-orange-500 hover:bg-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] border border-orange-400 flex items-center gap-2 transition-all text-white px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wider cursor-pointer">
                    REGISTER NOW <ArrowRight size={14} />
                  </button>
                  <a href="/events" className="border border-white/10 hover:border-white/30 bg-black/20 flex items-center justify-center text-white px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wider transition-all">
                    VIEW EVENTS
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clubs - Diagonal entry */}
        <section className="section-padding relative z-30 bg-[#050406]">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs text-orange-500 uppercase tracking-[0.3em] font-mono mb-2">
                COLLABORATING SOCIETIES
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Powered by <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Community</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {clubs.map((club, i) => {
                const Icon = club.icon;
                return (
                  <div
                    key={club.name}
                    className="glass-card bg-card/75 backdrop-blur-2xl p-6 text-center shimmer-card animated-border-glow cursor-pointer transition-all hover:scale-105 hover:-translate-y-2"
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Icon size={28} className="text-orange-500" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                      {club.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{club.role}</p>
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
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-orange-500/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-orange-500/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-orange-500/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-orange-500/30" />
              
              <Users className="text-orange-500 mx-auto mb-4" size={40} />
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
