import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";
import StatsDark from "@/components/StatsDark";



import { ArrowRight } from "lucide-react";
import TimeSpline from "@/components/TimeSpline";
import HeroAcedImage from "@/components/HeroAcedImage";

import { Link } from "react-router-dom";
import Timer from "@/components/Timer";


const mapEmbedSrc =
  "https://www.google.com/maps?q=University+of+Engineering+%26+Management,+Kolkata+(UEM)&z=17&output=embed";
const mapHref =
  "https://www.google.com/maps/place/University+of+Engineering+%26+Management,+Kolkata+(UEM)/@22.5599202,88.4899014,17z/data=!3m1!4b1!4m6!3m5!1s0x3a020b267a3cdc13:0xb3b21d652126f40!8m2!3d22.5599202!4d88.4899014!16s%2Fg%2F11c4pg5gwf?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D";

const tagline = "Igniting Innovation, Creativity & Competition";

const Index = () => {

  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState("");

  const [showSdk, setShowSdk] = useState(false);

  // Load Devfolio SDK — only load on production, keep fallback on localhost/local IPs
  useEffect(() => {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.startsWith("192.168.");

    if (isLocal) {
      setShowSdk(false);
      return;
    }

    const existing = document.getElementById("devfolio-sdk");
    if (existing) {
      if ((window as any).devfolio) (window as any).devfolio.init();
      setShowSdk(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "devfolio-sdk";
    script.src = "https://apply.devfolio.co/v2/sdk.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTimeout(() => {
        if ((window as any).devfolio) (window as any).devfolio.init();
        setShowSdk(true);
      }, 300);
    };
    script.onerror = () => {
      setShowSdk(false);
    };
    document.body.appendChild(script);

    return () => {
      const s = document.getElementById("devfolio-sdk");
      if (s) document.body.removeChild(s);
    };
  }, []);

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
    }, 30);
    return () => clearInterval(timer);
  }, [isLoaded]);

  // Combined ScrollTrigger timeline


  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-transparent text-white overflow-x-hidden relative">
        {/* Global Fixed Background Image */}
        <div 
          className="fixed inset-0 w-full h-full pointer-events-none z-0"
          style={{
            maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)"
          }}
        >
          <img
            src="/images/tuf.png"
            alt="IGNITIA Background"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.06)_0%,rgba(0,0,0,0.12)_38%,rgba(0,0,0,0.8)_100%)]" />
        </div>
        <ScrollProgress />
        <Navbar />

        <main className="flex-1 relative z-10">
          {/* New Video Hero Section */}
          <section
            id="hero-showcase-section"
            className="relative min-h-screen w-full overflow-hidden bg-transparent"
          >

            {/* Center IGNITIA title above mascot */}
            <div className="absolute top-[14%] md:top-[15%] left-1/2 z-[36] -translate-x-1/2 pointer-events-none text-center">
              <h1 className="hero-title-block leading-[0.82] select-none">
                <span className="ignitia-citadel-title mx-auto" data-text="IGNITIA">
                  <span>I</span>
                  <span>G</span>
                  <span>N</span>
                  <span>I</span>
                  <span>T</span>
                  <span>I</span>
                  <span>A</span>
                </span>

                <span className="ignitia-year-title mx-auto">
                  2K26
                </span>
              </h1>
            </div>
            {/* Center mascot PNG */}
            {/* Center mascot floating from corridor */}
            <div className="absolute inset-0 z-[45] flex items-center justify-center pointer-events-none">
              <div className="relative w-[230px] sm:w-[240px] md:w-[290px] lg:w-[360px] xl:w-[400px] translate-x-0 md:translate-x-[6%] translate-y-[-80px] sm:translate-y-[135px] md:translate-y-[175px]">
                <div className="animate-mascot-float">
                  <img
                    src="/images/Mascot.png"
                    alt="IGNITIA Mascot"
                    className="w-full h-auto object-contain select-none drop-shadow-[0_0_35px_rgba(0,245,255,0.38)] drop-shadow-[0_0_55px_rgba(168,85,247,0.22)]"
                    draggable={false}
                  />
                </div>
                {/* Mascot hand buttons moved to left panel */}


                {/* Floor glow / smoke */}
                {/* Thick floor smoke cloud */}
                <div className="absolute left-1/2 bottom-[-2%] h-20 w-[110%] -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl opacity-90" />

                <div className="absolute left-[28%] bottom-[1%] h-16 w-[55%] -translate-x-1/2 rounded-full bg-purple-400/25 blur-2xl animate-smoke-left" />

                <div className="absolute left-[48%] bottom-[-1%] h-20 w-[70%] -translate-x-1/2 rounded-full bg-white/15 blur-3xl animate-smoke-center" />

                <div className="absolute left-[68%] bottom-[1%] h-16 w-[55%] -translate-x-1/2 rounded-full bg-cyan-300/25 blur-2xl animate-smoke-right" />

                <div className="absolute left-[38%] bottom-[8%] h-10 w-[45%] -translate-x-1/2 rounded-full bg-cyan-200/15 blur-xl animate-smoke-small-left" />

                <div className="absolute left-[62%] bottom-[8%] h-10 w-[45%] -translate-x-1/2 rounded-full bg-purple-300/15 blur-xl animate-smoke-small-right" />
              </div>
            </div>

            {/* HUD frame */}
            <div className="absolute inset-6 md:inset-10 border border-white/[0.05] pointer-events-none z-30">
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-secondary/70" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-secondary/70" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-secondary/70" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-secondary/70" />
            </div>

            {/* Landing content */}
            <div className="relative z-[48] min-h-screen flex items-end pb-24 sm:pb-36 md:pb-56 lg:pb-64 pointer-events-none">
              <div className="w-full px-8 md:px-16 lg:px-24 flex flex-col md:grid md:grid-cols-[1fr_auto] gap-8 items-center md:items-end pointer-events-auto">
                {/* Left title block */}
                {/* Left info terminal + buttons */}
                <div className="space-y-6 max-w-[360px] mb-8 md:absolute md:left-[5%] md:bottom-[11%] md:z-[50] md:mb-0 w-full flex flex-col items-center md:items-start">
                  
                  {/* Access Pass Card */}
                  <div className="hidden md:block">
                    <HeroAcedImage />
                  </div>

                  {/* Mobile-only Timer */}
                  <div className="block md:hidden w-full max-w-[280px] sm:max-w-[320px] mb-2 pointer-events-auto">
                    <Timer targetDate="2026-08-01T00:00:00" />
                  </div>

                  <div className="flex flex-col items-center md:items-start gap-4 pt-3 pointer-events-auto">

                    {/* Register and Explore buttons side-by-side (Row 1) */}
                    <div className="flex items-center gap-2.5 w-full max-w-[340px] pointer-events-auto">
                      <Link
                        to="/events"
                        className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-white flex-1 h-[46px] rounded-xl transition-all border border-white/10 register-button-orange active:scale-[0.98] px-3 whitespace-nowrap text-center"
                      >
                        <span>Register Now</span>
                        <ArrowRight size={13} className="shrink-0" />
                      </Link>

                      <Link
                        to="/events"
                        className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-white flex-1 h-[46px] rounded-xl transition-all border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 active:scale-[0.98] px-3 whitespace-nowrap text-center"
                      >
                        <span>Explore Events</span>
                        <ArrowRight size={13} className="shrink-0" />
                      </Link>
                    </div>

                    {/* Apply on Devfolio Button (Row 2) */}
                    <div
                      className="relative"
                      style={{ height: "46px", width: "312px" }}
                    >
                      {showSdk ? (
                        <div
                          className="apply-button w-full h-full"
                          data-hackathon-slug="ignisys-ignitia"
                          data-button-theme="dark"
                          style={{ height: "46px", width: "312px" }}
                        />
                      ) : (
                        <a
                          href="https://ignisys-ignitia.devfolio.co/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="devfolio-apply-button flex items-center justify-center gap-3 text-sm h-full w-full"
                        >
                          <img
                            src="/devfolio.png"
                            alt="Devfolio"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain brightness-0 invert"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                          Apply on Devfolio
                          <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right timer */}
                <TimeSpline />
              </div>
            </div>



            {/* Futuristic glowing gradient divider */}
            <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
              {/* Soft vertical shadow fade to ease transition */}
              <div className="h-32 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              {/* 1px glowing cyber line */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 via-purple-500/25 to-transparent" />
              {/* Subtle neon bloom/glow behind the line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-12 bg-cyan-500/5 blur-xl rounded-full" />
            </div>

          </section>

          {/* Below sections flow up naturally following pin completion */}
          <div className="relative bg-transparent z-20">
            <StatsDark />
            <CTABanner />

            {/* Event Map Location Embed */}

          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
