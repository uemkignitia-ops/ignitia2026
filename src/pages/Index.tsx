import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Highlights from "@/components/Highlights";
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
import IgnitiaLogoArtifacts3D from "@/components/IgnitiaLogoArtifacts3D";
import FloatingTechElements from "@/components/FloatingTechElements";
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
          {isLoaded && <IgnitiaLogoArtifacts3D />}
          {!isMobile && isLoaded && <FloatingTechElements />}
          {!isMobile && <ParticleField />}
          {!isMobile && <ShootingStars />}
          {isLoaded && <AnimatedBlobs />}
          <ScrollProgress />

          {/* Page content */}
          <Navbar />
          <HeroSection />
          <Highlights centerOnMobile />
          <WhyAttend />
          <FAQSection />
          <ParallaxSection offset={isMobile ? 10 : 25}>
            <Sponsors centerOnMobile />
          </ParallaxSection>
          <CTABanner />
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default Index;
