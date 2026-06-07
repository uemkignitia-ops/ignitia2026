import { useState, useRef } from "react";
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
import { ImageGallery } from "@/components/ui/image-gallery";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery-2";
import { PhotoGallery } from "@/components/ui/gallery";

const galleryItems = [
  // Events
  {
    title: "Opening Ceremony 2025",
    category: "Events",
    src: "https://placehold.co/1920x1080/1e1e24/a2a2a2?text=Events+1",
  },
  {
    title: "Prize Distribution",
    category: "Events",
    src: "https://placehold.co/1080x1920/222233/a2a2a2?text=Events+2",
  },
  {
    title: "Audience at Main Stage",
    category: "Events",
    src: "https://placehold.co/1920x1080/1a1a2e/a2a2a2?text=Events+3",
  },
  {
    title: "Guest Speaker Session",
    category: "Events",
    src: "https://placehold.co/1080x1920/1e1e24/a2a2a2?text=Events+4",
  },
  {
    title: "Closing Ceremony",
    category: "Events",
    src: "https://placehold.co/1920x1080/2a2a35/a2a2a2?text=Events+5",
  },

  // Coding
  {
    title: "Hackathon in Progress",
    category: "Coding",
    src: "https://placehold.co/1920x1080/16213e/a2a2a2?text=Coding+1",
  },
  {
    title: "Workshop Session",
    category: "Coding",
    src: "https://placehold.co/1080x1920/0f3460/a2a2a2?text=Coding+2",
  },
  {
    title: "Late Night Debugging",
    category: "Coding",
    src: "https://placehold.co/1920x1080/1a1a2e/a2a2a2?text=Coding+3",
  },
  {
    title: "Code Review",
    category: "Coding",
    src: "https://placehold.co/1080x1920/222233/a2a2a2?text=Coding+4",
  },
  {
    title: "Project Presentation",
    category: "Coding",
    src: "https://placehold.co/1920x1080/1e1e24/a2a2a2?text=Coding+5",
  },

  // Gaming
  {
    title: "Gaming Tournament",
    category: "Gaming",
    src: "https://placehold.co/1920x1080/2a0944/a2a2a2?text=Gaming+1",
  },
  {
    title: "Esports Arena",
    category: "Gaming",
    src: "https://placehold.co/1080x1920/3b185f/a2a2a2?text=Gaming+2",
  },
  {
    title: "VR Experience",
    category: "Gaming",
    src: "https://placehold.co/1920x1080/a12568/a2a2a2?text=Gaming+3",
  },
  {
    title: "Console Freeplay",
    category: "Gaming",
    src: "https://placehold.co/1080x1920/1e1e24/a2a2a2?text=Gaming+4",
  },
  {
    title: "Final Showdown",
    category: "Gaming",
    src: "https://placehold.co/1920x1080/222233/a2a2a2?text=Gaming+5",
  },

  // Cultural
  {
    title: "Cultural Night",
    category: "Cultural",
    src: "https://placehold.co/1920x1080/3f0071/a2a2a2?text=Cultural+1",
  },
  {
    title: "Team Spirit",
    category: "Cultural",
    src: "https://placehold.co/1080x1920/fb3640/a2a2a2?text=Cultural+2",
  },
  {
    title: "Dance Performance",
    category: "Cultural",
    src: "https://placehold.co/1920x1080/1a1a2e/a2a2a2?text=Cultural+3",
  },
  {
    title: "Music Band Live",
    category: "Cultural",
    src: "https://placehold.co/1080x1920/222233/a2a2a2?text=Cultural+4",
  },
  {
    title: "Art Exhibition",
    category: "Cultural",
    src: "https://placehold.co/1920x1080/0f3460/a2a2a2?text=Cultural+5",
  },
];

const galleryCategories: GalleryItem[] = [
  { image: "https://placehold.co/800x600/1e1e24/a2a2a2?text=Events", text: "Events", category: "Events" },
  { image: "https://placehold.co/800x600/16213e/a2a2a2?text=Coding", text: "Coding", category: "Coding" },
  { image: "https://placehold.co/800x600/2a0944/a2a2a2?text=Gaming", text: "Gaming", category: "Gaming" },
  { image: "https://placehold.co/800x600/3f0071/a2a2a2?text=Cultural", text: "Cultural", category: "Cultural" },
  { image: "https://placehold.co/800x600/0f3460/a2a2a2?text=Robotics", text: "Robotics", category: "Robotics" },
];

const Gallery = () => {
  const [activeView, setActiveView] = useState<"sphere" | "explore">("sphere");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<(typeof galleryItems)[0] | null>(null);

  const filtered = selectedCategory === "All Stories"
    ? galleryItems
    : selectedCategory
      ? galleryItems.filter((i) => i.category === selectedCategory)
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
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] md:text-xs text-orange-500 uppercase tracking-[0.4em] mb-3 font-semibold font-mono"
            >
              MEMORIES & MOMENTS — IGNITIA &apos;26
            </motion.p>
            <div className="relative inline-block mb-3 px-4">
              {/* Futuristic Cyber brackets */}
              <div className="absolute left-0 -top-2 w-3 h-3 border-t-2 border-l-2 border-orange-500/50" />
              <div className="absolute right-0 -top-2 w-3 h-3 border-t-2 border-r-2 border-orange-500/50" />
              <div className="absolute left-0 -bottom-2 w-3 h-3 border-b-2 border-l-2 border-orange-500/50" />
              <div className="absolute right-0 -bottom-2 w-3 h-3 border-b-2 border-r-2 border-orange-500/50" />

              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="font-heading text-5xl md:text-7xl font-black tracking-wider uppercase mb-0"
              >
                <span className="text-white/40 font-light mr-3 select-none">OUR</span>
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-pulse">
                  GALLERY
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-sm max-w-xl mx-auto font-medium mb-12"
            >
              Moments from previous editions of IGNITIA
            </motion.p>

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
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] z-[-1]"
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
              <section className="py-12 relative overflow-hidden">
                <div className="container mx-auto">
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
