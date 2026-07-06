import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";
import SphereGallery from "@/components/SphereGallery";
import { TerminalSubheading } from "@/components/TerminalSubheading";
import { ImageGallery } from "@/components/ui/image-gallery";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery-2";
import { PhotoGallery } from "@/components/ui/gallery";

// Gallery category definitions — images are derived dynamically from the live gallery data
const CATEGORY_DEFS = [
  { text: "Events",   category: "Events"   },
  { text: "Coding",   category: "Coding"   },
  { text: "Gaming",   category: "Gaming"   },
  { text: "Cultural", category: "Cultural" },
  { text: "Robotics", category: "Robotics" },
];

// Neutral dark placeholder used when a category has no images yet
const PLACEHOLDER = "https://placehold.co/800x600/0c0b10/1a1a2e";

const Gallery = () => {
  const [activeView, setActiveView] = useState<"sphere" | "explore">("sphere");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [galleryCategories, setGalleryCategories] = useState<GalleryItem[]>(
    // Initial fallback: all neutral dark placeholders
    CATEGORY_DEFS.map((c) => ({ image: PLACEHOLDER, text: c.text, category: c.category }))
  );
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    import("@/lib/datastore").then((m) => {
      m.getGallery().then((items) => {
        setGalleryList(items);
        // Build category cards: use first real image per category, else neutral placeholder
        setGalleryCategories(
          CATEGORY_DEFS.map((c) => {
            const match = items.find((i: any) => i.category === c.category);
            return { image: match ? match.src : PLACEHOLDER, text: c.text, category: c.category };
          })
        );
      });
    });
  }, []);

  const filtered = selectedCategory === "All Stories"
    ? galleryList
    : selectedCategory
      ? galleryList.filter((i) => i.category === selectedCategory)
      : [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background scanline-overlay relative">
        <ParticleField />
        <AnimatedBlobs />
        <ScrollProgress />
        <Navbar />

        {/* Hero Header Section */}
        <section className="relative pt-24 pb-12 flex items-center justify-center min-h-[40vh]">
          <div className="container mx-auto px-4 text-center relative z-10 w-full overflow-hidden">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] md:text-xs text-primary uppercase tracking-[0.4em] mb-5 font-semibold font-mono flex items-center justify-center gap-2"
            >
              <ZoomIn size={14} className="text-primary" /> MEMORIES & MOMENTS
            </motion.p>

            <div className="relative w-full" style={{ perspective: "800px" }}>
              <div style={{ transformStyle: "preserve-3d" }}>
                {/* Shadow/depth clone */}
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
                  style={{ transform: "translateZ(-40px) translateY(12px)" }}
                >
                  <span
                    className="font-heading font-black uppercase leading-none tracking-tight text-center w-full"
                    style={{
                      fontSize: "clamp(2.5rem, 10vw, 5.5rem)",
                      color: "rgba(88,28,235,0.25)",
                      filter: "blur(8px)",
                    }}
                  >
                    OUR GALLERY
                  </span>
                </div>

                {/* Actual title */}
                <h1
                  className="font-heading font-black uppercase leading-none tracking-tight w-full text-center relative"
                  style={{ fontSize: "clamp(2.5rem, 10vw, 5.5rem)", transformStyle: "preserve-3d" }}
                >
                  <span
                    className="inline-block mr-[0.15em]"
                    style={{
                      color: "rgba(255,255,255,0.28)",
                      fontWeight: 300,
                      textShadow: "0 2px 20px rgba(139,92,246,0.1)",
                    }}
                  >
                    OUR
                  </span>

                  <span
                    className="inline-block relative"
                    style={{
                      color: "#ffffff",
                      textShadow: [
                        "0 0 60px rgba(139,92,246,0.9)",
                        "0 0 120px rgba(139,92,246,0.5)",
                        "0 2px 0 rgba(88,28,235,0.6)",
                        "0 4px 0 rgba(68,14,180,0.4)",
                        "0 8px 20px rgba(0,0,0,0.6)",
                      ].join(", "),
                    }}
                  >
                    GALLERY
                  </span>
                </h1>
              </div>
            </div>

            <div className="w-full flex justify-center px-4 mb-12 relative z-10">
              <TerminalSubheading
                text="Highlighted moments from IGNITIA"
                className="text-muted-foreground text-sm font-medium text-center max-w-xl"
              />
            </div>

            {/* View Toggle Slider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative inline-flex p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
            >
              {["sphere", "explore"].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view as "sphere" | "explore")}
                  className={`relative px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors z-10 ${activeView === view ? "text-white" : "text-muted-foreground hover:text-white"
                    }`}
                >
                  {activeView === view && (
                    <motion.div
                      layoutId="gallery-view-toggle"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] z-[-1]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {view === "sphere" ? "Moment Sphere" : "Explore Gallery"}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {activeView === "sphere" ? (
            <motion.div
              key="sphere-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 3D Image Sphere Section */}
              <section className="py-12 pb-32 md:pb-12 relative overflow-hidden min-h-[50vh] flex justify-center items-center w-full px-0">
                <div className="w-full">
                  <SphereGallery />
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="explore-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* PhotoGallery Component */}
              <div className="container mx-auto px-4 relative z-10 mb-20 pt-8">
                <motion.div
                  whileHover={{ scale: 1.01, y: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-background/20 backdrop-blur-md rounded-3xl border border-border/30 shadow-2xl min-h-[500px] md:min-h-[750px] w-full p-4 md:p-8 shimmer-card animated-border-glow"
                >
                  <div className="w-full h-full relative rounded-2xl overflow-hidden border border-border/10 bg-black/10 flex flex-col items-center justify-center py-8">
                    <PhotoGallery onCategorySelect={setSelectedCategory} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Popup Modal (Masonry Grid) */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-3xl flex flex-col pt-24 px-4 pb-8 overflow-y-auto"
            >
              <div className="container mx-auto relative flex-1 max-w-6xl">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="absolute top-0 right-4 z-50 p-3 bg-card border border-border/50 text-muted-foreground hover:text-foreground rounded-full shadow-lg transition-transform hover:scale-110"
                >
                  <X size={24} />
                </button>
                <div className="text-center mb-12 mt-4">
                  <h2 className="text-4xl md:text-5xl font-heading font-bold gradient-text">
                    {selectedCategory}
                  </h2>
                  <p className="text-muted-foreground mt-4">
                    {selectedCategory === "All Stories"
                      ? "Browsing a unified collection of moments across all IGNITIA events."
                      : `Browsing all moments from the ${selectedCategory} events.`}
                  </p>
                </div>

                {/* Prevent clicks in the modal background from closing (optional, usually handled by backdrop if desired) */}
                <div className="mt-8 relative z-10">
                  <ImageGallery items={filtered} onImageClick={(item) => setSelected(item)} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Individual Image Lightbox */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-8"
            >
              <motion.div
                initial={{ scale: 0.7, rotateX: 10 }}
                animate={{ scale: 1, rotateX: 0 }}
                exit={{ scale: 0.7, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-8 max-w-4xl w-full text-center relative"
                style={{ transformPerspective: 800 }}
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-transform hover:scale-110 bg-card p-2 rounded-full shadow-md"
                >
                  <X size={24} />
                </button>
                <div className="w-full h-[60vh] rounded-lg overflow-hidden mb-4 relative bg-card border border-border/50">
                  <img src={selected.src} alt={selected.title} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs text-primary uppercase tracking-wider font-semibold">
                  {selected.category}
                </span>
                <h2 className="font-heading text-2xl font-bold text-foreground mt-1">
                  {selected.title}
                </h2>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Gallery;
