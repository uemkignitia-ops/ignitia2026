import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import BackgroundEffects from "@/components/BackgroundEffects";
import ScrollProgress from "@/components/ScrollProgress";
import SphereGallery from "@/components/SphereGallery";
import { TerminalSubheading } from "@/components/TerminalSubheading";
import { ImageGallery } from "@/components/ui/image-gallery";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery-2";
import { PhotoGallery } from "@/components/ui/gallery";

// Gallery category definitions — images are derived dynamically from the live gallery data
const CATEGORY_DEFS = [
  { text: "Events", category: "Events" },
  { text: "Coding", category: "Coding" },
  { text: "Gaming", category: "Gaming" },
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
    <div className="min-h-screen bg-transparent relative citadel-theme">
      <BackgroundEffects />
      <PageTransition>
        <ScrollProgress />
        <Navbar />

        {/* Hero Header Section */}
        <section className="relative pt-28 pb-0 overflow-hidden w-full">
          {/* Radial ambient glow */}
          <div
            className="absolute inset-x-0 top-0 h-[400px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(168,85,247,0.15) 0%, transparent 70%)",
            }}
          />



          {/* Main GALLERY title */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full flex justify-center z-[36] pointer-events-none text-center mb-4">
                <h1 className="hero-title-block leading-[0.82] select-none text-center mb-0">
                  <span className="ignitia-citadel-title mx-auto" data-text="GALLERY">
                    <span>G</span>
                    <span>A</span>
                    <span>L</span>
                    <span>L</span>
                    <span>E</span>
                    <span>R</span>
                    <span>Y</span>
                  </span>
                </h1>
              </div>
            </motion.div>
          </div>

          {/* Subheading + toggle */}
          <div className="mt-6 mb-0 flex flex-col items-center gap-6 relative z-10 pb-12 px-4">
            <div className="w-full flex justify-center">
              <TerminalSubheading
                text="Highlighted moments from IGNITIA"
                className="text-muted-foreground text-sm md:text-base font-medium text-center"
              />
            </div>

            {/* View Toggle Slider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative inline-flex p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
            >
              {["sphere", "explore"].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view as "sphere" | "explore")}
                  className={`relative px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-full transition-colors z-10 ${activeView === view ? "text-white" : "text-muted-foreground hover:text-white"}`}
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
      </PageTransition>
    </div>
  );
};

export default Gallery;
