import { Suspense, lazy, useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";
import { useIsMobile } from "@/hooks/use-mobile";
import CharacterHeroScene from "@/components/CharacterHeroScene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";

gsap.registerPlugin(ScrollTrigger);

const HomeEffects = lazy(() => import("@/components/HomeEffects"));
const mapEmbedSrc = "https://www.google.com/maps?q=University+of+Engineering+%26+Management,+Kolkata+(UEM)&z=17&output=embed";
const mapHref = "https://www.google.com/maps/place/University+of+Engineering+%26+Management,+Kolkata+(UEM)/@22.5599202,88.4899014,17z/data=!3m1!4b1!4m6!3m5!1s0x3a020b267a3cdc13:0xb3b21d652126f40!8m2!3d22.5599202!4d88.4899014!16s%2Fg%2F11c4pg5gwf?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D";

const tagline = "Igniting Innovation, Creativity & Competition";

const Index = () => {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState("");
  const indexRef = useRef<HTMLDivElement>(null);
  const characterScrollProgressRef = useRef(0);

  // Loader complete listener
  useEffect(() => {
    const onLoaderComplete = () => setIsLoaded(true);
    window.addEventListener("ignitia:loader-complete", onLoaderComplete);

    const fallbackId = window.setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => {
      window.removeEventListener("ignitia:loader-complete", onLoaderComplete);
      window.clearTimeout(fallbackId);
    };
  }, []);

  // Typewriter effect for Hero tagline
  useEffect(() => {
    if (!isLoaded) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i <= tagline.length) {
        setTypedText(tagline.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 15);
    return () => clearInterval(timer);
  }, [isLoaded]);

  // Combined ScrollTrigger timeline
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-showcase-section",
          start: "top top",
          end: isMobile ? "+=1500" : "+=2500",
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (self) => {
            characterScrollProgressRef.current = self.progress;
          },
        },
      });

      // 1. Fade out the landing Hero UI overlays as user scrolls down
      tl.to("#hero-overlay-ui", {
        opacity: 0,
        y: -50,
        duration: 0.6,
        ease: "power2.inOut",
      });

      // 2. Fade in the About Fest details panel
      tl.fromTo(
        "#showcase-overlay-about",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }, indexRef);

    return () => ctx.revert();
  }, [isLoaded, isMobile]);

  return (
    <PageTransition>
      <div ref={indexRef} className="min-h-screen flex flex-col bg-[#050406] text-white overflow-x-hidden">
        <Suspense fallback={null}>
          {isLoaded && !isMobile && <HomeEffects />}
        </Suspense>
        <ScrollProgress />
        <Navbar />

        <main className="flex-1 relative z-10">
         
          {/* Unified Pinned Hero & About Section */}
          <section
            id="hero-showcase-section"
            className="relative h-screen w-full bg-[#050406] overflow-hidden"
          >
            {/* Full-bleed 3D Character Canvas as background */}
            <Suspense fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050406] z-10">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
                <span className="text-xs tracking-widest text-muted-foreground uppercase animate-pulse font-mono">Initializing Telemetry Link...</span>
              </div>
            }>
              <CharacterHeroScene scrollProgressRef={characterScrollProgressRef} />
            </Suspense>

            {/* Vignette overlay — darkens edges for cinematic feel */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,#050406_100%)] z-10" />

            {/* HUD Frame corner brackets */}
            <div className="absolute inset-6 md:inset-10 border border-white/[0.03] pointer-events-none z-20">
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-secondary/60" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-secondary/60" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-secondary/60" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-secondary/60" />
            </div>

            {/* Overlay 1: Hero UI (fades out on scroll) */}
            <div
              id="hero-overlay-ui"
              className="absolute inset-0 z-20 flex items-center pointer-events-none"
            >
              {/* Asymmetric radial glows */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_50%,rgba(168,85,247,0.08)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

              {/* Floating code/binary particles */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
                {["01", "//", "0x", "{}", "1A", "if", "fn", "10", "AI", "∑", "λ", ">>", "0b", "∞", "=="].map((char, i) => (
                  <span
                    key={i}
                    className="absolute font-mono text-white/[0.04] text-xs animate-float-particle"
                    style={{
                      left: `${(i * 6.5 + 3) % 95}%`,
                      top: `${(i * 13 + 7) % 90}%`,
                      animationDelay: `${i * 0.4}s`,
                      animationDuration: `${6 + (i % 4)}s`,
                      fontSize: i % 3 === 0 ? "1.5rem" : "0.7rem",
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>

              {/* Main Landing content layout */}
              <div className="w-full px-8 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center pointer-events-auto">
                {/* Title block */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="block w-8 h-px bg-primary/60" />
                    <span className="font-mono text-[10px] text-primary/80 uppercase tracking-[0.3em]">
                      IEM-UEM Group × UEM Kolkata
                    </span>
                  </div>

                  <div className="relative">
                    <h1 className="font-heading leading-[0.85] tracking-tighter">
                      <span className="block text-[clamp(4rem,12vw,9rem)] font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 select-none">
                        IGNITIA
                      </span>
                      <span className="block text-[clamp(2rem,7vw,5.5rem)] font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary ml-2 md:ml-6">
                        2K26
                      </span>
                    </h1>
                    <div className="absolute left-[-1.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/60 to-primary/0" />
                  </div>

                  <p className="font-mono text-sm md:text-base text-white/60 tracking-wide min-h-[1.5em]">
                    <span className="text-primary/70 mr-2">&gt;</span>
                    {typedText}
                    <span className="animate-blink text-primary">_</span>
                  </p>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-white/40">
                    <span><span className="text-secondary/70">DATE</span> :: 01–02.AUG.2026</span>
                    <span><span className="text-neon-cyan/70">LOC</span> :: UEM Kolkata, WB</span>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <a href="#register" className="hero-primary-button pulse-cta flex items-center gap-3 text-sm">
                      Register Now
                      <ArrowRight size={16} />
                    </a>
                    <a href="/events" className="hero-secondary-button glow-button-secondary flex items-center gap-3 text-sm">
                      Explore Events
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>

                {/* T-MINUS countdown box */}
                <div className="w-full lg:w-auto lg:min-w-[320px]">
                  <div className="relative border border-white/10 bg-black/60 p-5 md:p-7 overflow-hidden"
                    style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
                  >
                    <div className="absolute top-0 right-0 w-4 h-4 bg-primary/50" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 bg-secondary/50" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />

                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono text-[9px] tracking-[0.35em] text-white/40 uppercase">T-Minus // Event Launch Sequence</span>
                    </div>

                    <CountdownTimer embedded />

                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between font-mono text-[8px] text-white/30 uppercase tracking-widest">
                        <span>Event window open</span>
                        <span>Launch</span>
                      </div>
                      <div className="relative h-[2px] bg-white/10 overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary w-[82%]" />
                        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay 2: About Panel (fades in on scroll) */}
            <div
              id="showcase-overlay-about"
              className="absolute inset-0 flex items-center pointer-events-none z-20 opacity-0"
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
                <line x1="75%" y1="30%" x2="52%" y2="20%" stroke="rgba(168,85,247,0.15)" strokeWidth="1" strokeDasharray="4 6" />
                <line x1="78%" y1="55%" x2="52%" y2="55%" stroke="rgba(0,255,200,0.1)" strokeWidth="1" strokeDasharray="3 8" />
                <line x1="72%" y1="75%" x2="52%" y2="80%" stroke="rgba(197,160,89,0.12)" strokeWidth="1" strokeDasharray="4 6" />
                <circle cx="75%" cy="30%" r="3" fill="rgba(168,85,247,0.3)" />
                <circle cx="78%" cy="55%" r="3" fill="rgba(0,255,200,0.2)" />
                <circle cx="72%" cy="75%" r="3" fill="rgba(197,160,89,0.25)" />
              </svg>

              <div className="container mx-auto px-8 md:px-16 lg:px-20 pointer-events-auto">
                <div className="max-w-xl space-y-5 border border-white/10 bg-black/70 backdrop-blur-md p-6 md:p-8 relative"
                  style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
                >
                  <div className="absolute top-0 right-0 w-5 h-5 bg-primary/40" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                  <div className="absolute bottom-0 left-0 w-5 h-5 bg-secondary/40" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-primary/50" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-secondary/50" />

                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
                    <span className="font-mono text-[9px] tracking-[0.3em] text-neon-cyan/60 uppercase">Fest Diagnostics // System Readout</span>
                  </div>

                  <div>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                      About the{" "}
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-primary">
                        Fest &amp; Initiative
                      </span>
                    </h2>
                  </div>

                  <p className="font-mono text-xs md:text-sm text-white/50 leading-relaxed border-l-2 border-primary/30 pl-3">
                    <span className="text-primary/60 mr-1">//</span>
                    IGNITIA 2K26 brings together the brightest coders, designers, gamers, and roboticists. A crucible of competitive spirit and technical mastery — 2 days of adrenaline and innovation.
                  </p>

                  <div className="space-y-3 pt-1">
                    {[
                      { label: "PRIZE POOL", value: "₹2,00,000+", pct: 90, color: "from-secondary to-yellow-400" },
                      { label: "FOOTFALL",   value: "5000+",      pct: 85, color: "from-primary to-purple-400" },
                      { label: "COLLABORATORS", value: "50+ Colleges", pct: 75, color: "from-neon-cyan to-teal-400" },
                      { label: "ARENAS",     value: "7+",         pct: 55, color: "from-pink-500 to-primary" },
                    ].map(({ label, value, pct, color }) => (
                      <div key={label} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">{label}</span>
                          <span className="font-mono text-xs font-bold text-white/80">{value}</span>
                        </div>
                        <div className="relative h-[3px] bg-white/[0.06] overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <a href="#register" className="glow-button flex items-center gap-2 text-xs py-2 px-5">
                      <span>Access Portal</span>
                      <span className="font-mono opacity-70">&gt;&gt;</span>
                    </a>
                    <a href="/events" className="glow-button-secondary border-white/10 text-white hover:border-white/30 text-xs py-2 px-5">
                      Fest Schedule
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </section>

          {/* Below sections flow up naturally following pin completion */}
          <div className="relative bg-[#050406] z-20">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
           
            <CTABanner />

            {/* Event Map Location Embed */}
            <section className="section-padding py-16">
              <div className="container mx-auto max-w-5xl px-4">
                <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] h-72 transition-all duration-300 hover:border-primary/30">
                  <iframe
                    src={mapEmbedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                    loading="lazy"
                    title="UEM Kolkata Location"
                  />
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-4 py-1 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-primary"
                  >
                    Open Maps
                  </a>
                </div>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
