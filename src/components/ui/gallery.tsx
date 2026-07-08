import { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Per-category placeholder images (generated, served as static assets)
const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  Events:   "/gallery-placeholders/events.png",
  Coding:   "/gallery-placeholders/coding.png",
  Gaming:   "/gallery-placeholders/gaming.png",
  Cultural: "/gallery-placeholders/cultural.png",
  Robotics: "/gallery-placeholders/robotics.png",
};

const CATEGORY_DEFS = [
  { id: 1, order: 0, xDesktop: -320, xTablet: -220, xMobile: -110, y: "15px", zIndex: 50, direction: "left"  as Direction, category: "Events"   },
  { id: 2, order: 1, xDesktop: -160, xTablet: -110, xMobile: -55,  y: "32px", zIndex: 40, direction: "left"  as Direction, category: "Coding"   },
  { id: 3, order: 2, xDesktop:    0, xTablet:    0, xMobile:   0,  y: "8px",  zIndex: 30, direction: "right" as Direction, category: "Gaming"   },
  { id: 4, order: 3, xDesktop:  160, xTablet:  110, xMobile:  55,  y: "22px", zIndex: 20, direction: "right" as Direction, category: "Cultural" },
  { id: 5, order: 4, xDesktop:  320, xTablet:  220, xMobile: 110,  y: "44px", zIndex: 10, direction: "left"  as Direction, category: "Robotics" },
];

export const PhotoGallery = ({
  animationDelay = 0.5,
  onCategorySelect,
}: {
  animationDelay?: number;
  onCategorySelect?: (category: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded]   = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  // Map of category -> real image src from datastore (falls back to placeholder)
  const [categorySrcs, setCategorySrcs] = useState<Record<string, string>>(
    Object.fromEntries(CATEGORY_DEFS.map((c) => [c.category, CATEGORY_PLACEHOLDERS[c.category]]))
  );

  // Load first real image per category from datastore
  useEffect(() => {
    import("@/lib/datastore").then((m) => {
      m.getGallery().then((items: any[]) => {
        if (!items || items.length === 0) return;
        const updated: Record<string, string> = {};
        for (const cat of CATEGORY_DEFS) {
          const match = items.find((i: any) => i.category === cat.category);
          if (match?.src) {
            // Apply Cloudinary optimisation if applicable
            import("@/lib/cloudinary").then(({ getOptimizedUrl }) => {
              updated[cat.category] = getOptimizedUrl(match.src);
              setCategorySrcs((prev) => ({ ...prev, [cat.category]: updated[cat.category] }));
            });
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), animationDelay * 1000);
    const animationTimer  = setTimeout(() => setIsLoaded(true),  (animationDelay + 0.4) * 1000);
    return () => { clearTimeout(visibilityTimer); clearTimeout(animationTimer); };
  }, [animationDelay]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const photoWidth  = isMobile ? 140 : isTablet ? 190 : 240;
  const photoHeight = isMobile ? 190 : isTablet ? 260 : 320;

  const getX = (d: { xDesktop: number; xTablet: number; xMobile: number }) =>
    `${isMobile ? d.xMobile : isTablet ? d.xTablet : d.xDesktop}px`;

  const containerVariants = {
    hidden:  { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const photoVariants = {
    hidden:  () => ({ x: 0, y: 0, rotate: 0, scale: 1 }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 70, damping: 12, mass: 1, delay: custom.order * 0.15 },
    }),
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden">
      <div className="mt-8 flex-shrink-0">
        <h3 className="z-20 mx-auto max-w-2xl justify-center font-heading bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text py-3 text-center text-4xl text-transparent dark:bg-gradient-to-r dark:from-white dark:via-slate-200 dark:to-white dark:bg-clip-text md:text-5xl font-bold">
          Explore The <span className="text-primary"> Memories</span>
        </h3>
        <p className="lg:text-md my-2 text-center text-xs font-light uppercase tracking-widest text-slate-600 dark:text-slate-400 font-mono">
          A Journey Through Visual Stories
        </p>
      </div>

      <div className="relative flex-1 w-full items-center justify-center lg:flex pt-12 pb-24">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative transition-all duration-300" style={{ height: photoHeight, width: photoWidth }}>
              {[...CATEGORY_DEFS].reverse().map((cat) => (
                <motion.div
                  key={cat.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: cat.zIndex }}
                  variants={photoVariants}
                  custom={{ x: getX(cat), y: cat.y, order: cat.order }}
                >
                  <Photo
                    width={photoWidth}
                    height={photoHeight}
                    src={categorySrcs[cat.category]}
                    placeholder={CATEGORY_PLACEHOLDERS[cat.category]}
                    alt={cat.category}
                    direction={cat.direction}
                    label={cat.category}
                    onClick={() => onCategorySelect?.(cat.category)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex w-full justify-center pb-8 mt-4 flex-shrink-0">
        <Button
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
          onClick={() => onCategorySelect?.("All Stories")}
        >
          View All Stories
        </Button>
      </div>
    </div>
  );
};

function getRandomNumberInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

type Direction = "left" | "right";

export const Photo = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  label,
  placeholder,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  label?: string;
  placeholder?: string;
  onClick?: () => void;
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [imgSrc, setImgSrc]     = useState(src);
  const [loaded, setLoaded]     = useState(false);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  // Re-sync when src updates (e.g., after datastore fetch swaps placeholder → real)
  useEffect(() => {
    setImgSrc(src);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    const randomRotation =
      getRandomNumberInRange(2, 6) * (direction === "left" ? -1 : 1);
    setRotation(randomRotation);
  }, [direction]);

  function handleMouse(event: {
    currentTarget: { getBoundingClientRect: () => any };
    clientX: number;
    clientY: number;
  }) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  const handleError = () => {
    if (placeholder && imgSrc !== placeholder) setImgSrc(placeholder);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.1, zIndex: 9999 }}
      whileHover={{
        scale: 1.05,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{ scale: 1.1, zIndex: 9999 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing group"
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      onClick={onClick}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-white/10">
        {/* Shimmer while image loads */}
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 animate-pulse rounded-xl" />
        )}
        <img
          className={cn(
            "object-cover w-full h-full pointer-events-none transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
          src={imgSrc}
          alt={alt}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
        {/* Category label overlay */}
        {label && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 bg-gradient-to-t from-black/70 via-transparent to-transparent">
            <span className="text-white font-bold text-base md:text-lg font-heading tracking-wide drop-shadow-lg select-none">
              {label}
            </span>
          </div>
        )}
        {/* Hover click hint */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
          <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
