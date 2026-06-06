import { Suspense, lazy, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Highlights from "@/components/Highlights";
import WhyAttend from "@/components/WhyAttend";
import Sponsors from "@/components/Sponsors";
import FAQSection from "@/components/FAQSection";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import ParallaxSection from "@/components/ParallaxSection";
import PageTransition from "@/components/PageTransition";
import { useIsMobile } from "@/hooks/use-mobile";

const HomeEffects = lazy(() => import("@/components/HomeEffects"));
const mapEmbedSrc = "https://www.google.com/maps?q=University+of+Engineering+%26+Management,+Kolkata+(UEM)&z=17&output=embed";
const mapHref = "https://www.google.com/maps/place/University+of+Engineering+%26+Management,+Kolkata+(UEM)/@22.5599202,88.4899014,17z/data=!3m1!4b1!4m6!3m5!1s0x3a020b267a3cdc13:0xb3b21d652126f40!8m2!3d22.5599202!4d88.4899014!16s%2Fg%2F11c4pg5gwf?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D";

const Index = () => {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const onLoaderComplete = () => setIsLoaded(true);
    window.addEventListener("ignitia:loader-complete", onLoaderComplete);

    // Dynamic fallback safeguard
    const fallbackId = window.setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => {
      window.removeEventListener("ignitia:loader-complete", onLoaderComplete);
      window.clearTimeout(fallbackId);
    };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-[#050406] text-white overflow-x-hidden">
        <Suspense fallback={null}>
          {isLoaded && !isMobile && <HomeEffects />}
        </Suspense>
        <ScrollProgress />
        <Navbar />

        <main className="flex-1 relative z-10">
          {/* Handles full 3D interactive zoom */}
          <HeroSection />
          
          {/* Below sections flow up naturally following pin completion */}
          <div className="relative bg-[#050406] z-20">
            <Highlights centerOnMobile />
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <WhyAttend />
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <FAQSection />
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <ParallaxSection offset={isMobile ? 10 : 25}>
              <Sponsors centerOnMobile />
            </ParallaxSection>
            
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