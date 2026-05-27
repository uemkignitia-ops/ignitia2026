import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Highlights from "@/components/Highlights";
import FeaturedEvents from "@/components/FeaturedEvents";
import WhyAttend from "@/components/WhyAttend";
import Sponsors from "@/components/Sponsors";
import FAQSection from "@/components/FAQSection";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import MouseSpotlight from "@/components/MouseSpotlight";
import ParticleField from "@/components/ParticleField";
import ScrollProgress from "@/components/ScrollProgress";
import ShootingStars from "@/components/ShootingStars";
import CursorTrail from "@/components/CursorTrail";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ParallaxSection from "@/components/ParallaxSection";
import PageTransition from "@/components/PageTransition";
import RAOneArtifacts3D from "@/components/RAOneArtifacts3D";
import FloatingTechElements from "@/components/FloatingTechElements";
import AnnouncementBar from "@/components/AnnouncementBar";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const onLoaderComplete = () => setIsLoaded(true);
    window.addEventListener("ignitia:loader-complete", onLoaderComplete);

    const fallbackId = window.setTimeout(() => {
      setIsLoaded(true);
    }, 2600);

    return () => {
      window.removeEventListener("ignitia:loader-complete", onLoaderComplete);
      window.clearTimeout(fallbackId);
    };
  }, []);

  return (
    <>
      {!isMobile && <MouseSpotlight />}
      {!isMobile && <CursorTrail />}
      <PageTransition>
        <div className="min-h-screen bg-background scanline-overlay" style={{ paddingBottom: 52 }}>
          {/* Fixed layers */}
          {isLoaded && <RAOneArtifacts3D />}
          {!isMobile && isLoaded && <FloatingTechElements />}
          {!isMobile && <ParticleField />}
          {!isMobile && <ShootingStars />}
          {isLoaded && <AnimatedBlobs />}
          <ScrollProgress />

          {/* Page content */}
          <Navbar />
          <HeroSection />
          <Highlights />
          <ParallaxSection offset={isMobile ? 14 : 30}>
            <FeaturedEvents />
          </ParallaxSection>
          <WhyAttend />
          <ParallaxSection offset={isMobile ? 10 : 25}>
            <Sponsors />
          </ParallaxSection>
          <FAQSection />
          <CTABanner />
          <Footer />
        </div>
      </PageTransition>

      {/* Sticky bottom announcement bar — outside PageTransition so it's always on top */}
      <AnnouncementBar />
    </>
  );
};

export default Index;
