import { Ref, forwardRef, useState, useEffect, ImgHTMLAttributes } from "react";
import { motion, useMotionValue } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const PhotoGallery = ({
  animationDelay = 0.5,
  onCategorySelect,
}: {
  animationDelay?: number;
  onCategorySelect?: (category: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    const animationTimer = setTimeout(
      () => {
        setIsLoaded(true);
      },
      (animationDelay + 0.4) * 1000
    );

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    // Call once to ensure correct sizing on mount
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const photoWidth = isMobile ? 140 : isTablet ? 190 : 240;
  const photoHeight = isMobile ? 190 : isTablet ? 260 : 320;

  const getXOffset = (desktop: number, tablet: number, mobile: number) => {
    if (isMobile) return `${mobile}px`;
    if (isTablet) return `${tablet}px`;
    return `${desktop}px`;
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const photoVariants = {
    hidden: () => ({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    }),
    visible: (custom: { x: any; y: any; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  };

  const photos = [
    {
      id: 1,
      order: 0,
      x: getXOffset(-320, -220, -110),
      y: "15px",
      zIndex: 50,
      direction: "left" as Direction,
      src: "https://placehold.co/600x800/1e1e24/a2a2a2?text=Events",
      category: "Events",
    },
    {
      id: 2,
      order: 1,
      x: getXOffset(-160, -110, -55),
      y: "32px",
      zIndex: 40,
      direction: "left" as Direction,
      src: "https://placehold.co/600x800/222233/a2a2a2?text=Coding",
      category: "Coding",
    },
    {
      id: 3,
      order: 2,
      x: "0px",
      y: "8px",
      zIndex: 30,
      direction: "right" as Direction,
      src: "https://placehold.co/600x800/1a1a2e/a2a2a2?text=Gaming",
      category: "Gaming",
    },
    {
      id: 4,
      order: 3,
      x: getXOffset(160, 110, 55),
      y: "22px",
      zIndex: 20,
      direction: "right" as Direction,
      src: "https://placehold.co/600x800/2a2a35/a2a2a2?text=Cultural",
      category: "Cultural",
    },
    {
      id: 5,
      order: 4,
      x: getXOffset(320, 220, 110),
      y: "44px",
      zIndex: 10,
      direction: "left" as Direction,
      src: "https://placehold.co/600x800/16213e/a2a2a2?text=Robotics",
      category: "Robotics",
    },
  ];

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
            <div
              className="relative transition-all duration-300"
              style={{ height: photoHeight, width: photoWidth }}
            >
              {[...photos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{
                    x: photo.x,
                    y: photo.y,
                    order: photo.order,
                  }}
                >
                  <Photo
                    width={photoWidth}
                    height={photoHeight}
                    src={photo.src}
                    alt={photo.category}
                    direction={photo.direction}
                    onClick={() => onCategorySelect?.(photo.category)}
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

const MotionImage = motion(
  forwardRef(function MotionImage(
    props: ImgHTMLAttributes<HTMLImageElement>,
    ref: Ref<HTMLImageElement>
  ) {
    return <img ref={ref} {...props} />;
  })
);

type Direction = "left" | "right";

export const Photo = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  onClick,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  onClick?: () => void;
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

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
      whileDrag={{
        scale: 1.1,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        transform: `rotate(0deg) rotateX(0deg) rotateY(0deg)`,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing"
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      onClick={onClick}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-white/10">
        <MotionImage
          className={cn("object-cover w-full h-full pointer-events-none")}
          src={src}
          alt={alt}
          {...props}
          draggable={false}
        />
      </div>
    </motion.div>
  );
};
