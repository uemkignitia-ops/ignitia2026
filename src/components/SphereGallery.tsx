import SphereImageGrid, { ImageData } from "@/components/ui/img-sphere";
import React from 'react';

// ==========================================
// EASY CONFIGURATION - Edit these values to customize the component
// ==========================================

// Image data using project assets - placeholders for now
const BASE_IMAGES: Omit<ImageData, 'id'>[] = Array.from({ length: 12 }).map((_, i) => ({
  src: `https://placehold.co/400x400/1e1e24/a2a2a2?text=Image+${i + 1}`,
  alt: `Placeholder ${i + 1}`,
  title: `Placeholder Image ${i + 1}`,
  description: "This is a placeholder image. Replace with actual gallery photo later."
}));

// Generate more images by repeating the base set
const IMAGES: ImageData[] = [];
for (let i = 0; i < 60; i++) {
  const baseIndex = i % BASE_IMAGES.length;
  const baseImage = BASE_IMAGES[baseIndex];
  IMAGES.push({
    id: `img-${i + 1}`,
    ...baseImage,
    alt: `${baseImage.alt} (${Math.floor(i / BASE_IMAGES.length) + 1})`
  });
}

// Component configuration - easily adjustable
interface SphereConfig {
  containerSize: number;
  sphereRadius: number;
  dragSensitivity: number;
  momentumDecay: number;
  maxRotationSpeed: number;
  baseImageScale: number;
  hoverScale: number;
  perspective: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
}

const CONFIG: SphereConfig = {
  containerSize: 950,          // Container size in pixels (increased slightly)
  sphereRadius: 340,           // Virtual sphere radius (increased slightly)
  dragSensitivity: 0.8,        // Mouse drag sensitivity (0.1 - 2.0)
  momentumDecay: 0.96,         // How fast momentum fades (0.8 - 0.99)
  maxRotationSpeed: 6,         // Maximum rotation speed (1 - 10)
  baseImageScale: 0.16,        // Base image size
  hoverScale: 1.3,             // Hover scale multiplier
  perspective: 1200,           // CSS perspective value (adjusted for larger size)
  autoRotate: true,            // Enable/disable auto rotation
  autoRotateSpeed: 0.2         // Auto rotation speed
};

export default function SphereGallery() {
  const [windowWidth, setWindowWidth] = React.useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to ensure correct sizing on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const mobileContainerSize = Math.min(windowWidth, 380);
  const mobileSphereRadius = mobileContainerSize * 0.44;

  const dynamicConfig = {
    ...CONFIG,
    containerSize: isMobile ? mobileContainerSize : isTablet ? 650 : CONFIG.containerSize,
    sphereRadius: isMobile ? mobileSphereRadius : isTablet ? 250 : CONFIG.sphereRadius,
    baseImageScale: isMobile ? 0.15 : isTablet ? 0.13 : CONFIG.baseImageScale,
  };

  return (
    <div className="w-full flex justify-center items-center overflow-hidden relative px-0">
      <SphereImageGrid
        images={IMAGES}
        {...dynamicConfig}
      />
    </div>
  );
}
