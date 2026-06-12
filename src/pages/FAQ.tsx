import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Database } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";
import { FAQHeroScene } from "@/components/FAQHeroScene";
import { TerminalSubheading } from "@/components/TerminalSubheading";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "Who can participate in IGNITIA '26?",
    a: "IGNITIA '26 is open to all college students across India. Whether you're from UEM Kolkata or any other institution, you're welcome to register and participate.",
    category: "General",
    id: "FILE_01_GEN",
  },
  {
    q: "Is there a registration fee?",
    a: "Most events are free to participate. Some premium events like the Gaming Arena and Hackathon may have a nominal registration fee. Details will be provided on individual event pages.",
    category: "Registration",
    id: "FILE_02_REG",
  },
  {
    q: "Can students from other colleges join?",
    a: "Absolutely! IGNITIA is an inter-college event and we encourage participation from students across Kolkata and beyond.",
    category: "General",
    id: "FILE_03_GEN",
  },
  {
    q: "How do teams register?",
    a: "The team leader registers the team through our registration portal. Team members are added during the registration process with their details.",
    category: "Registration",
    id: "FILE_04_REG",
  },
  {
    q: "Will certificates be provided?",
    a: "Yes! All participants receive participation certificates. Winners receive special achievement certificates along with prizes.",
    category: "Events",
    id: "FILE_05_EVT",
  },
  {
    q: "What should participants bring?",
    a: "Bring your college ID, laptop (for coding/hackathon events), and enthusiasm! Specific requirements will be communicated via email after registration.",
    category: "Logistics",
    id: "FILE_06_LOG",
  },
  {
    q: "Can I participate in multiple events?",
    a: "Yes, as long as the event schedules don't overlap. Check the Schedule page to plan your participation.",
    category: "Events",
    id: "FILE_07_EVT",
  },
  {
    q: "Is accommodation provided?",
    a: "Accommodation is not provided by default, but we can assist outstation students with nearby hostel and PG recommendations.",
    category: "Logistics",
    id: "FILE_08_LOG",
  },
  {
    q: "What are the prizes?",
    a: "The total prize pool exceeds ₹2,00,000. Individual event prizes range from ₹10,000 to ₹35,000. Check each event page for specific prize details.",
    category: "Events",
    id: "FILE_09_EVT",
  },
  {
    q: "How will I receive updates about the event?",
    a: "Follow us on social media and join our WhatsApp/Telegram groups (links shared after registration). Important updates will also be sent via email.",
    category: "General",
    id: "FILE_10_GEN",
  },
];

const categories = ["All Files", "General", "Registration", "Events", "Logistics"];

const categoryColors: Record<string, string> = {
  "General": "280 85% 65%", // Purple
  "Registration": "45 100% 50%", // Gold
  "Events": "270 70% 40%", // Deep Violet
  "Logistics": "285 100% 85%", // White/Purple accent
  "All Files": "0 0% 80%", // Default Gray
};

// Typewriter component with speed and newline support
const TypewriterText = ({ text, speed = 15, onComplete }: { text: string; speed?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className="whitespace-pre-wrap">
      {displayedText}
      <span className="inline-block w-1.5 h-3 ml-1 bg-current animate-pulse" />
    </span>
  );
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("All Files");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState<string | undefined>(undefined);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All Files" || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background scanline-overlay relative overflow-x-hidden">
        <ParticleField />
        <AnimatedBlobs />
        <ScrollProgress />
        <Navbar />

        {/* Data Core Header */}
        <section className="relative pt-28 pb-12 overflow-hidden w-full">
          {/* Radial purple ambient glow behind title */}
          <div
            className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 60% 40%, rgba(139,92,246,0.18) 0%, transparent 70%)",
            }}
          />

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-[11px] md:text-xs text-primary uppercase tracking-[0.45em] mb-5 font-semibold font-mono flex items-center justify-center gap-2"
          >
            <Database size={14} className="text-primary" /> KNOWLEDGE BASE
          </motion.p>

          {/* Main Title — full-width, centered, perspective tilt */}
          <div className="relative w-full" style={{ perspective: "800px" }}>
            <motion.div
              initial={{ opacity: 0, rotateX: 12, y: 30 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
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
                  FAQ CORE
                </span>
              </div>

              {/* Actual title */}
              <h1
                className="font-heading font-black uppercase leading-none tracking-tight w-full text-center relative"
                style={{ fontSize: "clamp(2.5rem, 10vw, 5.5rem)", transformStyle: "preserve-3d" }}
              >
                {/* FAQ — dimmer, lighter weight */}
                <span
                  className="inline-block mr-[0.15em]"
                  style={{
                    color: "rgba(255,255,255,0.28)",
                    fontWeight: 300,
                    textShadow: "0 2px 20px rgba(139,92,246,0.1)",
                  }}
                >
                  FAQ
                </span>

                {/* CORE — full white with 3D purple bloom */}
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
                  CORE
                </span>
              </h1>
            </motion.div>
          </div>

          <div className="mt-10 mb-6 flex justify-center w-full px-4 relative z-10">
            <TerminalSubheading 
              text="Frequently asked questions and details about the event."
              className="text-muted-foreground text-base md:text-lg font-medium text-center max-w-2xl"
            />
          </div>
        </section>

        {/* Hero Interactive Area: Terminal Box + 3 Rays + 3D Model */}
        <section className="relative z-20 w-full mb-16 mt-4 overflow-visible flex justify-center">
          <div className="container max-w-5xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0">

            {/* Left Side: Terminal Box */}
            <div className="relative w-full lg:w-[600px] z-10 shrink-0">

              {/* Glowing Neon Border Wrapper matching the image */}
              <div className="relative p-[2px] rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500 shadow-[10px_0_40px_-10px_rgba(239,68,68,0.5)]">
                <div className="bg-[#0b0614] rounded-[10px] p-5 sm:p-6 h-full relative overflow-hidden group font-mono text-[#CCCCCC]">

                  {/* Windows CMD Header */}
                  <div className="mb-4 text-xs sm:text-sm text-[#CCCCCC]/90 relative z-10">
                    <p className="text-[#ffd700]/80">IGNITIA FAQ Core [Version 2026.1.0]</p>
                    <p>&copy; 2026 IGNITIA &apos;26. Ready to help.</p>
                  </div>

                  {/* CLI Active Search Bar */}
                  <div className="relative flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm z-10">
                    <span className="text-[#9333ea] font-bold mr-2 whitespace-nowrap mb-1 sm:mb-0">C:\ IGNITIA \ FAQ_SEARCH_BAR &gt;</span>
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-[#ffffff] font-mono focus:ring-0 p-0 shadow-none placeholder:text-gray-600"
                        placeholder="Enter query..."
                        spellCheck="false"
                      />
                      {/* Blinking cursor fallback for visual flair when typing */}
                      {searchQuery === "" && (
                        <span className="absolute left-0 w-2 h-4 bg-[#ffd700] animate-pulse pointer-events-none" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* The Magical Golden Spell Ray - Wand to Terminal */}
              <div className="absolute left-[100%] top-0 w-[45vw] xl:w-[40vw] h-full pointer-events-none z-[16] hidden lg:block">
                <svg className="absolute top-0 w-full h-full overflow-visible">
                  <defs>
                    {/* CSS keyframe — all animations flow wand → terminal (one direction) */}
                    <style>{`
                      @keyframes spiralFlow {
                        from { stroke-dashoffset: 0; }
                        to   { stroke-dashoffset: -62; }
                      }
                      @keyframes coreFlow {
                        from { stroke-dashoffset: 0; }
                        to   { stroke-dashoffset: -205; }
                      }
                    `}</style>

                    {/* Soft glow filter for the spiral strands */}
                    <filter id="strand-glow" x="-80%" y="-80%" width="260%" height="260%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Heavy glow for the core beam */}
                    <filter id="core-glow" x="-80%" y="-80%" width="260%" height="260%">
                      <feGaussianBlur stdDeviation="10" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Outer gradient: gold at wand → transparent at terminal */}
                    <linearGradient id="spell-fade" gradientUnits="objectBoundingBox" x1="1" y1="0" x2="0" y2="0">
                      <stop offset="0%" stopColor="#ffd700" stopOpacity="1" />
                      <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.85" />
                      <stop offset="88%" stopColor="#f97316" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
                    </linearGradient>

                    {/* Strand gradient */}
                    <linearGradient id="strand-fade" gradientUnits="objectBoundingBox" x1="1" y1="0" x2="0" y2="0">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                      <stop offset="70%" stopColor="#fde68a" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* === Central thick golden beam (axis of the spiral) === */}
                  <line
                    x1="36%" y1="-70"
                    x2="0" y2="0"
                    stroke="url(#spell-fade)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="200 5"
                    filter="url(#core-glow)"
                    style={{ animation: "coreFlow 1.6s linear infinite" }}
                  />

                  {/* === Strand 1: offset above-right of beam axis === */}
                  {/* Perpendicular offset +8px from center */}
                  <line
                    x1="34.7%" y1="-77"
                    x2="-0.9%" y2="-7"
                    stroke="url(#strand-fade)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="30 30"
                    filter="url(#strand-glow)"
                    style={{ animation: "spiralFlow 1.0s linear infinite" }}
                  />

                  {/* === Strand 2: offset below-left of beam axis (half-period delay = crossing) === */}
                  {/* Perpendicular offset -8px from center */}
                  <line
                    x1="37.3%" y1="-63"
                    x2="0.9%" y2="7"
                    stroke="url(#strand-fade)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="30 30"
                    filter="url(#strand-glow)"
                    style={{ animation: "spiralFlow 1.0s linear infinite", animationDelay: "-0.5s" }}
                  />
                </svg>

              </div>

            </div>

            {/* Right Side: 3D Model */}
            <div className="hidden md:block absolute -right-[2rem] lg:-right-[8rem] -top-[45vh] lg:-top-[62vh] w-[300px] h-[450px] lg:w-[450px] lg:h-[650px] z-[15] pointer-events-none">
              <FAQHeroScene />
            </div>

          </div>
        </section>

        {/* Central Content Area: Categories & FAQ Accordion */}
        <section className="section-padding pt-0 relative z-20">
          <div className="container mx-auto max-w-3xl px-4">

            {/* Category Filter Toggles */}
            <div className="flex justify-center mb-10 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex flex-wrap justify-center gap-1.5 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md max-w-full"
              >
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const color = categoryColors[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`relative px-3 sm:px-5 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors z-10 ${isActive ? "text-white" : "text-muted-foreground hover:text-white"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="faq-category-toggle"
                          className="absolute inset-0 rounded-xl z-[-1]"
                          style={{
                            background: isActive && cat === "All Files"
                              ? `linear-gradient(to right, #ffd700, #9333ea)`
                              : `linear-gradient(135deg, hsl(${color}), hsl(${color} / 0.6))`,
                            boxShadow: isActive && cat === "All Files"
                              ? `0 0 15px rgba(147,51,234,0.4)`
                              : `0 0 15px hsl(${color} / 0.4)`
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      {cat}
                    </button>
                  );
                })}
              </motion.div>
            </div>

            {/* Encrypted Files List */}
            <div className="space-y-4 min-h-[40vh] mb-12">
              <AnimatePresence mode="popLayout">
                {filteredFaqs.length > 0 ? (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                    value={activeItem}
                    onValueChange={setActiveItem}
                  >
                    {filteredFaqs.map((faq) => {
                      const color = categoryColors[faq.category];
                      const isActive = activeItem === faq.id;

                      return (
                        <motion.div
                          key={faq.id}
                          layout
                          initial={{ opacity: 0, y: 20, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                          transition={{ duration: 0.3 }}
                        >
                          <AccordionItem
                            value={faq.id}
                            className={`relative overflow-hidden bg-card/40 backdrop-blur-3xl px-1 sm:px-4 border transition-all duration-300 rounded-lg group`}
                            style={{
                              borderColor: isActive ? `hsl(${color} / 0.5)` : "rgba(255,255,255,0.1)",
                              backgroundColor: isActive ? `hsl(${color} / 0.05)` : undefined,
                              boxShadow: isActive ? `inset 4px 0 0 hsl(${color})` : "none"
                            }}
                          >
                            <AccordionTrigger className="hover:no-underline py-4 sm:py-6 px-4 transition-colors">
                              <div className="flex items-center text-left gap-4 w-full">
                                <Terminal
                                  size={18}
                                  style={{ color: isActive ? `hsl(${color})` : "inherit" }}
                                  className={`${isActive ? "" : "text-muted-foreground group-hover:text-[#ffd700]"}`}
                                />
                                <div className="flex flex-col gap-1">
                                  <span
                                    className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-2"
                                    style={{ color: isActive ? `hsl(${color})` : "rgba(255,255,255,0.4)" }}
                                  >
                                    {faq.id}
                                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: `hsl(${color})` }}></span>
                                    {faq.category}
                                  </span>
                                  <span
                                    className="font-heading text-sm sm:text-base font-semibold"
                                    style={{ color: isActive ? `hsl(${color})` : "white" }}
                                  >
                                    {faq.q}
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-6 pt-2">
                              <div
                                className="pl-8 sm:pl-10 border-l ml-2"
                                style={{ borderColor: `hsl(${color} / 0.2)` }}
                              >
                                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-mono">
                                  {isActive ? (
                                    <TypewriterText text={faq.a} />
                                  ) : (
                                    faq.a
                                  )}
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </motion.div>
                      );
                    })}
                  </Accordion>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-xl bg-black/20"
                  >
                    <Terminal size={48} className="text-[#9333ea]/40 mb-4" />
                    <p className="text-white font-mono text-lg font-bold">NO RECORDS FOUND</p>
                    <p className="text-muted-foreground text-sm mt-2 font-mono">Check spelling or try a broader query.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Support / Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-black/40 border border-[#9333ea]/30 rounded-lg p-8 sm:p-12 backdrop-blur-xl shadow-[0_0_30px_rgba(147,51,234,0.15)] text-center mt-12 overflow-hidden group"
            >
              {/* Cyber UI Details */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffd700]/50 to-transparent opacity-50" />
              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
              <div className="absolute bottom-4 right-4 text-[10px] text-[#9333ea]/60 font-mono">Status: Online</div>

              <Terminal size={32} className="mx-auto text-[#ffd700] mb-4 opacity-80" />

              <h2 className="font-mono text-xl sm:text-2xl font-bold mb-4 uppercase tracking-[0.2em] text-[#9333ea] drop-shadow-[0_0_8px_rgba(147,51,234,0.6)]">
                Still have questions?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-mono">
                If you can't find what you're looking for, feel free to contact our support team.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-sm border border-[#9333ea] bg-[#9333ea]/10 text-[#ffd700] font-mono font-bold hover:bg-[#9333ea] hover:text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] transition-all duration-300 uppercase tracking-[0.1em] text-sm"
              >
                Contact Support
              </Link>
            </motion.div>

          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default FAQ;
