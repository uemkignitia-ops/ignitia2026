import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import BackgroundEffects from "@/components/BackgroundEffects";
import ScrollProgress from "@/components/ScrollProgress";
import SphereGallery from "@/components/SphereGallery";
import { TerminalSubheading } from "@/components/TerminalSubheading";
import { ImageGallery } from "@/components/ui/image-gallery";
import { PhotoGallery } from "@/components/ui/gallery";

// ─── Placeholder data ────────────────────────────────────────────────────────
const makePlaceholders = (category: string, src: string) =>
  Array.from({ length: 6 }, (_, i) => ({
    src,
    title: `${category} — Coming Soon`,
    category,
    isPlaceholder: true,
    id: `ph-${category}-${i}`,
  }));

const CATEGORY_PLACEHOLDERS: Record<string, any[]> = {
  Events:   makePlaceholders("Events",   "/gallery-placeholders/events.png"),
  Coding:   makePlaceholders("Coding",   "/gallery-placeholders/coding.png"),
  Gaming:   makePlaceholders("Gaming",   "/gallery-placeholders/gaming.png"),
  Cultural: makePlaceholders("Cultural", "/gallery-placeholders/cultural.png"),
  Robotics: makePlaceholders("Robotics", "/gallery-placeholders/robotics.png"),
};

const ALL_PLACEHOLDERS = Object.values(CATEGORY_PLACEHOLDERS).flat();

// ─── Component ───────────────────────────────────────────────────────────────
const Gallery = () => {
  const [activeView, setActiveView]           = useState<"sphere" | "explore">("sphere");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [galleryList, setGalleryList]         = useState<any[]>([]);
  const [selected, setSelected]               = useState<any | null>(null);

  // Track whether the user has scrolled to the bottom of the modal
  const [atModalBottom, setAtModalBottom]     = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCloseCategory = useCallback(() => {
    setSelectedCategory(null);
    setAtModalBottom(false);
  }, []);

  useEffect(() => {
    import("@/lib/datastore").then((m) => {
      m.getGallery().then((items: any[]) => setGalleryList(items));
    });
  }, []);

  // Lock body scroll when modal is open and hide Navbar / Footer
  useEffect(() => {
    if (selectedCategory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedCategory]);

  // Detect when modal scroll reaches the bottom
  const handleModalScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setAtModalBottom(nearBottom);
  }, []);

  // Reset bottom state when category changes
  useEffect(() => { setAtModalBottom(false); }, [selectedCategory]);

  // Filtered list with placeholder fallback
  const realFiltered =
    selectedCategory === "All Stories"
      ? galleryList
      : selectedCategory
        ? galleryList.filter((i: any) => i.category === selectedCategory)
        : [];

  const isEmptyCategory = realFiltered.length === 0;

  const fallbackItems =
    selectedCategory === "All Stories"
      ? ALL_PLACEHOLDERS
      : selectedCategory
        ? (CATEGORY_PLACEHOLDERS[selectedCategory] ?? ALL_PLACEHOLDERS)
        : [];

  const filtered = isEmptyCategory ? fallbackItems : realFiltered;

  // Whether the modal is currently open at all
  const isModalOpen = !!selectedCategory;

  return (
    <div className="min-h-screen bg-transparent relative citadel-theme">
      <BackgroundEffects />
      <PageTransition>
        <ScrollProgress />

        {/*
          Navbar: hidden while modal is open so it doesn't bleed through.
          We use CSS pointer-events + opacity rather than unmounting so the
          layout doesn't shift.
        */}
        <div
          className="transition-opacity duration-200"
          style={{ opacity: isModalOpen ? 0 : 1, pointerEvents: isModalOpen ? "none" : "auto" }}
        >
          <Navbar />
        </div>

        {/* ─── Hero Header ──────────────────────────────────────────── */}
        <section className="relative pt-28 pb-0 overflow-hidden w-full">
          <div
            className="absolute inset-x-0 top-0 h-[400px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(168,85,247,0.15) 0%, transparent 70%)" }}
          />

          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full flex justify-center z-[36] pointer-events-none text-center mb-4">
                <h1 className="hero-title-block leading-[0.82] select-none text-center mb-0">
                  <span className="ignitia-citadel-title mx-auto" data-text="GALLERY">
                    <span>G</span><span>A</span><span>L</span><span>L</span><span>E</span><span>R</span><span>Y</span>
                  </span>
                </h1>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 mb-0 flex flex-col items-center gap-6 relative z-10 pb-12 px-4">
            <div className="w-full flex justify-center">
              <TerminalSubheading
                text="Highlighted moments from IGNITIA"
                className="text-muted-foreground text-sm md:text-base font-medium text-center"
              />
            </div>

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
                  className={`relative px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-full transition-colors z-10 ${
                    activeView === view ? "text-white" : "text-muted-foreground hover:text-white"
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

        {/* ─── View Panels ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeView === "sphere" ? (
            <motion.div key="sphere-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <section className="py-12 pb-32 md:pb-12 relative overflow-hidden min-h-[50vh] flex justify-center items-center w-full px-0">
                <div className="w-full"><SphereGallery /></div>
              </section>
            </motion.div>
          ) : (
            <motion.div key="explore-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
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

        {/*
          Footer:
          - When modal is closed: always visible
          - When modal is open: hidden (opacity 0, pointer-events none) UNLESS user
            has scrolled to the bottom of the modal
        */}
        <div
          className="transition-opacity duration-300"
          style={{
            opacity: isModalOpen && !atModalBottom ? 0 : 1,
            pointerEvents: isModalOpen && !atModalBottom ? "none" : "auto",
          }}
        >
          <Footer />
        </div>

        {/* ─── Category / All Stories Modal ─────────────────────────────
            z-[130] → above Navbar z-[120] and mobile drawer z-[120]
        ──────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[130] flex flex-col overflow-hidden"
              style={{ background: "hsl(var(--background) / 0.98)", backdropFilter: "blur(24px)" }}
            >
              {/* ── HEADER: centered title + X right beside it ── */}
              <div className="flex-shrink-0 flex items-center justify-center gap-3 px-4 py-3 sm:py-4 border-b border-white/8 bg-background/90 backdrop-blur-md"
                style={{ paddingTop: `max(16px, env(safe-area-inset-top, 16px))` }}
              >
                {/* Category title — centred */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-heading font-bold gradient-text leading-none">
                    {selectedCategory}
                  </h2>
                </div>

                {/* Close — large tap target, right next to title */}
                <button
                  onClick={handleCloseCategory}
                  className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white shadow-lg active:scale-90 hover:bg-white/20 transition-all"
                  aria-label="Close"
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
              </div>



              {/* ── Scrollable photo grid ── */}
              <div
                ref={scrollRef}
                onScroll={handleModalScroll}
                className="flex-1 overflow-y-auto overscroll-contain px-2 sm:px-4 md:px-8 pt-3 pb-10"
              >
                <ImageGallery
                  items={filtered}
                  isPlaceholder={isEmptyCategory}
                  onImageClick={(item) => {
                    if (!(item as any).isPlaceholder) setSelected(item);
                  }}
                />

                {/* Footer peek at bottom of modal scroll */}
                {atModalBottom && (
                  <div className="mt-6 pt-4 border-t border-white/8 text-center text-[10px] text-muted-foreground/50 pb-4">
                    © IGNITIA '26 · IEM-UEM Group, UEM Kolkata
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Individual Image Lightbox ─────────────────────────────── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-[140] bg-background/92 backdrop-blur-xl flex items-center justify-center p-3 sm:p-8"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-3 sm:p-6 max-w-4xl w-full text-center relative"
              >
                {/* Close — top-right, large tap target */}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white shadow-lg active:scale-90 hover:bg-white/20 transition-all"
                  aria-label="Close"
                >
                  <X size={15} strokeWidth={2.5} />
                </button>

                <div className="w-full aspect-video max-h-[70vh] rounded-lg overflow-hidden mb-3 bg-card border border-border/40">
                  <img src={selected.src} alt={selected.title} className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] sm:text-xs text-primary uppercase tracking-wider font-semibold">
                  {selected.category}
                </span>
                <h2 className="font-heading text-sm sm:text-lg font-bold text-foreground mt-1 line-clamp-2">
                  {selected.title}
                </h2>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </PageTransition>
    </div>
  );
};

export default Gallery;
