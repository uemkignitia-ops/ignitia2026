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
      {/* Full-page tuf.png background — fixed so it covers every section */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/images/tuf.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Cinematic gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.08)_0%,rgba(0,0,0,0.1)_38%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />
      </div>

      <div className="min-h-screen flex flex-col text-white overflow-x-hidden relative z-10">
        
        
        <ScrollProgress />
        <Navbar />

        <main className="flex-1 relative z-10">
          {/* New Video Hero Section */}
<section
  id="hero-showcase-section"
  className="relative min-h-screen w-full overflow-hidden"
>

{/* Center IGNITIA title above mascot */}
<div className="absolute top-[10%] left-1/2 z-[36] -translate-x-1/2 pointer-events-none text-center">
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
  <div className="relative w-[260px] md:w-[340px] lg:w-[430px] xl:w-[480px] translate-x-[6%] translate-y-[175px]">
    <div className="animate-mascot-float">
      <img
        src="/images/Mascot.png"
        alt="IGNITIA Mascot"
        className="w-full h-auto object-contain select-none drop-shadow-[0_0_35px_rgba(0,245,255,0.38)] drop-shadow-[0_0_55px_rgba(168,85,247,0.22)]"
        draggable={false}
      />
    </div>
    {/* Floating hand buttons */}
  <Link
    to="/events"
    className="mascot-hand-button mascot-hand-button-left pointer-events-auto"
  >
    <span>Register Now</span>
    <ArrowRight size={15} />
  </Link>

  <Link
    to="/events"
    className="mascot-hand-button mascot-hand-button-right pointer-events-auto"
  >
    <span>Explore Events</span>
    <ArrowRight size={15} />
  </Link>


    {/* Floor glow / smoke */}
    {/* Thick floor smoke cloud */}
<div className="absolute left-1/2 bottom-[-2%] h-20 w-[110%] -translate-x-1/2 rounded-full bg-fuchsia-300/20 blur-3xl opacity-90" />

<div className="absolute left-[28%] bottom-[1%] h-16 w-[55%] -translate-x-1/2 rounded-full bg-purple-400/25 blur-2xl animate-smoke-left" />

<div className="absolute left-[48%] bottom-[-1%] h-20 w-[70%] -translate-x-1/2 rounded-full bg-white/15 blur-3xl animate-smoke-center" />

<div className="absolute left-[68%] bottom-[1%] h-16 w-[55%] -translate-x-1/2 rounded-full bg-fuchsia-300/25 blur-2xl animate-smoke-right" />

<div className="absolute left-[38%] bottom-[8%] h-10 w-[45%] -translate-x-1/2 rounded-full bg-fuchsia-200/15 blur-xl animate-smoke-small-left" />

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
  <div className="relative z-40 min-h-screen flex items-center pointer-events-none">
    <div className="w-full px-8 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center pointer-events-auto">
      {/* Left title block */}
      {/* Left info terminal + buttons */}
<div className="space-y-6 max-w-[360px] mt-28">
  <HeroAcedImage />

  <div className="flex flex-col items-start gap-6 pt-3"></div>

        <div className="flex flex-col items-start gap-6 pt-3">
          
          <div
            className="relative"
            style={{ height: "44px", width: "312px" }}
          >
            {showSdk ? (
              <div
                className="apply-button w-full h-full"
                data-hackathon-slug="ignisys-ignitia"
                data-button-theme="dark"
                style={{ height: "44px", width: "312px" }}
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



  {/* Bottom fade */}
  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-50" />
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
