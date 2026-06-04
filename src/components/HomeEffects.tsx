import MouseSpotlight from "@/components/MouseSpotlight";
import ParticleField from "@/components/ParticleField";
import ShootingStars from "@/components/ShootingStars";
import CursorTrail from "@/components/CursorTrail";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import IgnitiaLogoArtifacts3D from "@/components/IgnitiaLogoArtifacts3D";
import { useIsMobile } from "@/hooks/use-mobile";

const HomeEffects = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <>
      <MouseSpotlight />
      <CursorTrail />
      <IgnitiaLogoArtifacts3D />
      <ParticleField />
      <ShootingStars />
      <AnimatedBlobs />
    </>
  );
};

export default HomeEffects;
