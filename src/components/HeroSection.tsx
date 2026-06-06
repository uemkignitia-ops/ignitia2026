import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import CountdownTimer from "./CountdownTimer";
import { VaderScene } from "./VaderScene";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

const tagline = "Igniting Innovation, Creativity & Competition";

const HeroSection = () => {
  const [typedText, setTypedText] = useState("");
  const isMobile = useIsMobile();

  const pinRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  // These refs are mutated by GSAP and read every frame by VaderScene's useFrame.
  // They are THREE.Vector3 instances so GSAP can animate their .x/.y/.z properties directly.
  // Phase 0 (load):  wide isometric — entire diorama visible, camera outside all smoke rings
  // Phase 1 (scroll ↓ ~40 %): straight-on first-person frame of the upper body / visor
  // Phase 2 (scroll ↓ ~100 %): plunge through the glowing faceplate; UI reveal
  const cameraPosRef = useRef(new THREE.Vector3(6.0, 5.0, 14.0));
  const cameraTargetRef = useRef(new THREE.Vector3(0, -0.4, 0));

  // ── GSAP Scroll-Driven Timeline ─────────────────────────────────────────
  useLayoutEffect(() => {
    if (!pinRef.current || !heroContentRef.current || !scrollPromptRef.current) return;

    const ctx = gsap.context(() => {
      // ── 3D GEOMETRY NOTES ──────────────────────────────────────────────
      // Model group: position=[0, -1.3, 0], scale=0.8
      // Character face/visor in world-space: approx y ≈ -0.15, z ≈ 0.3
      // The camera must end at face-height (y ≈ -0.15) looking straight
      // at the visor (not from above) for a true first-person portrait.
      // ──────────────────────────────────────────────────────────────────

      // Starting position: high-right isometric (retained)
      const pStart = new THREE.Vector3(6.0, 5.0, 14.0);
      const tStart = new THREE.Vector3(0.0, -0.4, 0.0);

      // Midpoint: First-person straight-on portrait at face height
      // Camera directly in front of the face, same Y as visor
      const pMid = new THREE.Vector3(0.0, -0.2, 2.8);
      const tMid = new THREE.Vector3(0.0, -0.2, 0.0);

      // Endpoint: Plunge straight into the bright visor
      const pEnd = new THREE.Vector3(0.0, -0.1, 0.4);
      const tEnd = new THREE.Vector3(0.0, -0.1, 0.0);

      // Cubic Bezier control points for orbital sweep:
      // Ctrl1: swing wide to the left while staying high (dramatic arc)
      // Ctrl2: descend to face height while curving back to center
      const pCtrl1 = new THREE.Vector3(-4.0, 4.0, 12.0);
      const pCtrl2 = new THREE.Vector3(-6.0, 0.5, 5.0);

      // Animate progress keys using GSAP
      const animState = {
        orbitProgress: 0,
        plungeProgress: 0,
      };

      const updateCamera = () => {
        if (animState.plungeProgress > 0) {
          // Phase 2: Plunge straight forward into the visor
          const t = animState.plungeProgress;
          cameraPosRef.current.x = (1 - t) * pMid.x + t * pEnd.x;
          cameraPosRef.current.y = (1 - t) * pMid.y + t * pEnd.y;
          cameraPosRef.current.z = (1 - t) * pMid.z + t * pEnd.z;

          cameraTargetRef.current.x = (1 - t) * tMid.x + t * tEnd.x;
          cameraTargetRef.current.y = (1 - t) * tMid.y + t * tEnd.y;
          cameraTargetRef.current.z = (1 - t) * tMid.z + t * tEnd.z;
        } else {
          // Phase 1: Orbit via Cubic Bezier curve
          const t = animState.orbitProgress;
          const oneMinusT = 1 - t;

          cameraPosRef.current.x =
            oneMinusT ** 3 * pStart.x +
            3 * oneMinusT ** 2 * t * pCtrl1.x +
            3 * oneMinusT * t ** 2 * pCtrl2.x +
            t ** 3 * pMid.x;

          cameraPosRef.current.y =
            oneMinusT ** 3 * pStart.y +
            3 * oneMinusT ** 2 * t * pCtrl1.y +
            3 * oneMinusT * t ** 2 * pCtrl2.y +
            t ** 3 * pMid.y;

          cameraPosRef.current.z =
            oneMinusT ** 3 * pStart.z +
            3 * oneMinusT ** 2 * t * pCtrl1.z +
            3 * oneMinusT * t ** 2 * pCtrl2.z +
            t ** 3 * pMid.z;

          cameraTargetRef.current.x = (1 - t) * tStart.x + t * tMid.x;
          cameraTargetRef.current.y = (1 - t) * tStart.y + t * tMid.y;
          cameraTargetRef.current.z = (1 - t) * tStart.z + t * tMid.z;
        }
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: isMobile ? "+=1100" : "+=2000",
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // ── Phase 1: Orbital Sweep to First-Person View ───────────────────────
      tl.to(animState, {
        orbitProgress: 1,
        duration: 0.6,
        ease: "power2.inOut",
        onUpdate: updateCamera,
      })
        // Fade out scroll prompt as soon as scroll starts
        .to(
          scrollPromptRef.current,
          { opacity: 0, y: -30, duration: 0.2 },
          "<",
        )

        // ── Phase 2: Plunge directly into visor ───────────────────────────────
        .to(animState, {
          plungeProgress: 1,
          duration: 0.4,
          ease: "power2.in",
          onUpdate: updateCamera,
        })
        
        // ── Phase 2.5: Blackout ──────────────────────────────────────────────
        // Right as we enter the bright visor, fade the entire canvas to black
        .to(
          blackoutRef.current,
          { opacity: 1, duration: 0.1 },
          "-=0.1" // trigger just before plunge finishes
        )

        // ── Phase 3: Circular Portal Reveal ──────────────────────────────────
        .fromTo(
          ".portal-ring",
          { scale: 0, opacity: 1 },
          { 
            scale: (i) => 8 + (i * 2), // Expand massively off-screen
            opacity: 0, // Fade out completely as they expand
            duration: 0.8, 
            stagger: 0.15, 
            ease: "power1.inOut" 
          }
        )

        // ── Phase 4: UI Reveal ─────────────────────────────────────────────
        .fromTo(
          heroContentRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
          "-=0.2",
        );
    });

    return () => ctx.revert();
  }, [isMobile]);

  // ── Typewriter effect ───────────────────────────────────────────────────
  useEffect(() => {
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
  }, []);

  return (
    <div
      ref={pinRef}
      className="relative w-full h-screen bg-[#050406] overflow-hidden"
    >
      {/* ── Three.js canvas (fills entire section, z-0) ── */}
      <VaderScene
        cameraPosRef={cameraPosRef}
        cameraTargetRef={cameraTargetRef}
      />

      {/* ── Vignette overlay — darkens edges for cinematic feel ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,#050406_100%)] z-[1]" />

      {/* ── Phase 0 prompt — fades out on first scroll movement ── */}
      <div
        ref={scrollPromptRef}
        className="absolute top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 text-[10px] text-white/50 uppercase tracking-[0.4em] bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
            <Sparkles size={10} className="text-primary animate-pulse" />
            <span>Scroll or Drag to Explore</span>
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-widest text-white/10 select-none">
            IGNITIA
          </h1>
        </div>
      </div>

      {/* ── Phase 2.5 Blackout overlay ── */}
      <div 
        ref={blackoutRef}
        className="absolute inset-0 bg-[#050406] z-[5] opacity-0 pointer-events-none"
      />

      {/* ── Phase 3 Portal overlay — concentric expanding rings ── */}
      <div 
        ref={portalRef}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden"
      >
        <div className="portal-ring absolute w-[60vh] h-[60vh] rounded-full border-[12px] border-primary/90 shadow-[0_0_60px_rgba(168,85,247,0.8)_inset,0_0_60px_rgba(168,85,247,0.8)]" />
        <div className="portal-ring absolute w-[40vh] h-[40vh] rounded-full border-[8px] border-[#c5a059]/90 shadow-[0_0_50px_rgba(197,160,89,0.8)_inset,0_0_50px_rgba(197,160,89,0.8)]" />
        <div className="portal-ring absolute w-[20vh] h-[20vh] rounded-full border-[4px] border-secondary/90 shadow-[0_0_40px_rgba(255,215,0,0.8)_inset,0_0_40px_rgba(255,215,0,0.8)]" />
      </div>

      {/* ── Phase 4 UI overlay — fades in after the plunge ── */}
      {/* Starts at opacity-0; GSAP animates it to opacity-100 */}
      <div
        ref={heroContentRef}
        className="absolute inset-0 flex items-center justify-center opacity-0 z-20 pointer-events-auto bg-black/40 backdrop-blur-[2px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center relative max-w-6xl mt-12 md:mt-0">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary tracking-wide uppercase">
                IEM-UEM Group × UEM Kolkata
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter leading-none filter drop-shadow-2xl mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
                IGNITIA
              </span>
              <span className="block mt-[-0.1em] text-4xl sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-neon-purple to-secondary">
                2K26
              </span>
            </h1>

            {/* Typewriter tagline */}
            <p className="text-lg md:text-2xl text-white/80 max-w-2xl h-8 font-light tracking-wide">
              {typedText}
              <span className="animate-blink text-primary">_</span>
            </p>

            {/* Date + venue chips */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm md:text-base font-medium">
              <span className="glass-card px-5 py-2.5 bg-black/40 border-white/10 text-white/90 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                📅 1st &amp; 2nd August 2026
              </span>
              <span className="glass-card px-5 py-2.5 bg-black/40 border-white/10 text-white/90 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                📍 UEM Kolkata
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
              <a
                href="#register"
                className="hero-primary-button pulse-cta flex items-center justify-center gap-3"
              >
                Register Now
                <ArrowRight size={18} />
              </a>
              <a
                href="/events"
                className="hero-secondary-button glow-button-secondary flex items-center justify-center gap-3"
              >
                Explore Events
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Countdown */}
            <div className="w-full max-w-4xl mt-8 glass-card bg-black/40 border-white/10 p-6 md:p-8 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
              <CountdownTimer embedded />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;