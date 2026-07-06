import SphereImageGrid, { ImageData } from "@/components/ui/img-sphere";
import React from 'react';

// ==========================================
// EASY CONFIGURATION - Edit these values to customize the component
// ==========================================

// Neutral dark fallback placeholders (no text labels) used when no gallery images exist yet
const FALLBACK_IMAGES: ImageData[] = Array.from({ length: 60 }).map((_, i) => ({
  id: `img-${i + 1}`,
  src: `https://placehold.co/400x400/0c0b10/1a1a2e`,
  alt: `Gallery image ${i + 1}`,
  title: "",
  description: "",
}));

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
  containerSize: 950,          // Container size in pixels
  sphereRadius: 340,           // Virtual sphere radius
  dragSensitivity: 0.8,        // Mouse drag sensitivity (0.1 - 2.0)
  momentumDecay: 0.96,         // How fast momentum fades (0.8 - 0.99)
  maxRotationSpeed: 6,         // Maximum rotation speed (1 - 10)
  baseImageScale: 0.16,        // Base image size
  hoverScale: 1.3,             // Hover scale multiplier
  perspective: 1200,           // CSS perspective value
  autoRotate: true,            // Enable/disable auto rotation
  autoRotateSpeed: 0.2         // Auto rotation speed
};

export default function SphereGallery() {
  const [windowWidth, setWindowWidth] = React.useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [images, setImages] = React.useState<ImageData[]>(FALLBACK_IMAGES);

  // Load real images from the datastore
  React.useEffect(() => {
    import("@/lib/datastore").then((m) => {
      m.getGallery().then((galleryItems) => {
        if (galleryItems && galleryItems.length > 0) {
          // Build ImageData from real gallery items, repeat to fill 60 slots
          const liveImages: ImageData[] = Array.from({ length: 60 }).map((_, i) => {
            const item = galleryItems[i % galleryItems.length];
            return {
              id: `img-${i + 1}`,
              src: item.src,
              alt: item.title || `Gallery image ${i + 1}`,
              title: item.title || "",
              description: item.category || "",
            };
          });
          setImages(liveImages);
        }
        // If gallery is empty, keep neutral FALLBACK_IMAGES
      });
    });
  }, []);

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
        images={images}
        {...dynamicConfig}
      />
    </div>
  );
}
