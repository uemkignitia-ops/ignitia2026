import MouseSpotlight from "@/components/MouseSpotlight";
import ParticleField from "@/components/ParticleField";
import ShootingStars from "@/components/ShootingStars";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import { useIsMobile } from "@/hooks/use-mobile";

const HomeEffects = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <>
      <MouseSpotlight />
      <ShootingStars />
    </>
  );
};

export default HomeEffects;
