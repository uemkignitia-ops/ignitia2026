import { useState, useRef, useEffect } from "react";
import { getEvents } from "@/lib/datastore";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Zap,
  Code,
  Brain,
  Gamepad2,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  X,
  Palette,
  Swords,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";
import BackgroundEffects from "@/components/BackgroundEffects";
import { TerminalSubheading } from "@/components/TerminalSubheading";
import { InfoCard } from "@/components/ui/info-card";
import { MeshGradientSVG } from "@/components/ui/shader-svg";

const themes = {
  orange: {
    border: "border-white/5 hover:border-orange-500/50",
    shadow: "hover:shadow-[0_0_40px_rgba(249,115,22,0.12)]",
    iconBg: "bg-orange-500/10 border-orange-500/20",
    iconText: "text-orange-500",
    textGlow: "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]",
    beam: "via-orange-500/10 to-orange-500/5",
    badge: "border-orange-500/30 text-orange-500 bg-orange-500/5",
    accentGlow: "bg-orange-500/5",
    line: "bg-orange-500/25",
    arrowHover: "hover:bg-orange-500/10 hover:border-orange-500/50",
  },
  purple: {
    border: "border-white/5 hover:border-purple-500/50",
    shadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.12)]",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconText: "text-purple-500",
    textGlow: "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
    beam: "via-purple-500/10 to-purple-500/5",
    badge: "border-purple-500/30 text-purple-500 bg-purple-500/5",
    accentGlow: "bg-purple-500/5",
    line: "bg-purple-500/25",
    arrowHover: "hover:bg-purple-500/10 hover:border-purple-500/50",
  },
  teal: {
    border: "border-white/5 hover:border-teal-500/50",
    shadow: "hover:shadow-[0_0_40px_rgba(20,184,166,0.12)]",
    iconBg: "bg-teal-500/10 border-teal-500/20",
    iconText: "text-teal-400",
    textGlow: "text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]",
    beam: "via-teal-500/10 to-teal-500/5",
    badge: "border-teal-500/30 text-teal-400 bg-teal-500/5",
    accentGlow: "bg-teal-500/5",
    line: "bg-teal-500/25",
    arrowHover: "hover:bg-teal-500/10 hover:border-teal-500/50",
  },
  yellow: {
    border: "border-white/5 hover:border-amber-500/50",
    shadow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.12)]",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconText: "text-amber-500",
    textGlow: "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
    beam: "via-amber-500/10 to-amber-500/5",
    badge: "border-amber-500/30 text-amber-500 bg-amber-500/5",
    accentGlow: "bg-amber-500/5",
    line: "bg-amber-500/25",
    arrowHover: "hover:bg-amber-500/10 hover:border-amber-500/50",
  },
  pink: {
    border: "border-white/5 hover:border-pink-500/50",
    shadow: "hover:shadow-[0_0_40px_rgba(236,72,153,0.12)]",
    iconBg: "bg-pink-500/10 border-pink-500/20",
    iconText: "text-pink-500",
    textGlow: "text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]",
    beam: "via-pink-500/10 to-pink-500/5",
    badge: "border-pink-500/30 text-pink-500 bg-pink-500/5",
    accentGlow: "bg-pink-500/5",
    line: "bg-pink-500/25",
    arrowHover: "hover:bg-pink-500/10 hover:border-pink-500/50",
  },
  blue: {
    border: "border-white/5 hover:border-sky-500/50",
    shadow: "hover:shadow-[0_0_40px_rgba(14,165,233,0.12)]",
    iconBg: "bg-sky-500/10 border-sky-500/20",
    iconText: "text-sky-400",
    textGlow: "text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]",
    beam: "via-sky-500/10 to-sky-500/5",
    badge: "border-sky-400/30 text-sky-400 bg-sky-500/5",
    accentGlow: "bg-sky-500/5",
    line: "bg-sky-500/25",
    arrowHover: "hover:bg-sky-500/10 hover:border-sky-500/50",
  },
};

export type EventType = {
  id: string;
  icon: any;
  image?: string;
  coverPhotoUrl?: string;
  title: string;
  category: string;
  prize?: string;
  teamSize: string;
  teamSizeLabel?: string;
  duration: string;
  day: string;
  entryFee: string;
  theme: keyof typeof themes;
  rulebookUrl?: string;
  registrationUrl?: string;
  isWide?: boolean;
  leftPoolLayout?: boolean;
  arrowTop?: boolean;
  isTopEvent?: boolean;
  watermark?: string;
  description: string;
  overview: string;
  rules?: string[];
  criteria?: string[];
  contacts?: { name: string; phone: string; }[];
};

const CENTRAL_REGISTRATION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfvs3XKBQYwTZUh95ci5k6urZkY5ODUBswVJKpR8jplK3odvw/viewform";

const getBorderColor = (theme: string) => {
  if (theme === "orange" || theme === "yellow") return "var(--border-color-1)";
  if (theme === "purple" || theme === "pink") return "var(--border-color-2)";
  return "var(--border-color-3)";
};

const getHoverTextColor = (theme: string) => {
  if (theme === "orange" || theme === "yellow") return "var(--hover-text-color-1)";
  if (theme === "purple" || theme === "pink") return "var(--hover-text-color-2)";
  return "var(--hover-text-color-3)";
};

const getEventImage = (event: EventType) => {
  return "/event-bg.png";
};

const getEventOverlayImage = (event: EventType) => {
  if (event.coverPhotoUrl) return event.coverPhotoUrl;
  const overlayMap: Record<string, string> = {
    "ignisys": "/ignisys.png",
    "quizophonia": "/quizophonia.png",
    "bgmi": "/bgmi.png",
    "evadex": "/evadex.png",
    "efootball": "/efootball.png",
    "blind-coding": "/blind-coding.png",
    "guess-who": "/guess-who.png",
    "cultural-program": "/cultural-program.png",
    "ai-argumentarium": "/ai-argumentarium.png",
    "cineverse": "/cineverse.png",
    "pixel-prophecy": "/pixel-prophecy.png",
    "circuit-crawl": "/Untitled design (1).png",
  };
  return overlayMap[event.id] || undefined;
};

// Lucide icon mapping dictionary
const IconMap: Record<string, any> = {
  Zap,
  Code,
  Brain,
  Gamepad2,
  HelpCircle,
  MessageSquare,
  Palette,
  Swords,
  Sparkles,
};

const Events = () => {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [showRulebook, setShowRulebook] = useState<boolean>(false);
  const [eventsList, setEventsList] = useState<EventType[]>([]);

  useEffect(() => {
    getEvents().then((data) => {
      const PREDEFINED_ORDER = [
        "ignisys",           // Row 1 - wide (Col 1-4)
        "blind-coding",      // Row 1 - normal (Col 5-6)
        "efootball",         // Row 2 - normal (Col 1-2)
        "bgmi",              // Row 2 - wide (Col 3-6)
        "quizophonia",       // Row 3 - wide (Col 1-4)
        "guess-who",         // Row 3 - normal (Col 5-6)
        "pixel-prophecy",    // Row 4 - normal (Col 1-2)
        "ai-argumentarium",  // Row 4 - wide (Col 3-6)
        "cineverse",         // Row 5 - normal (Col 1-2)
        "circuit-crawl",     // Row 5 - normal (Col 3-4)
        "evadex",            // Row 5 - normal (Col 5-6)
        "cultural-program"   // Row 6 - normal (Col 3-4 - centered)
      ];
      const sorted = [...data].sort((a, b) => {
        let idxA = PREDEFINED_ORDER.indexOf(a.id);
        let idxB = PREDEFINED_ORDER.indexOf(b.id);
        if (idxA === -1) idxA = 999;
        if (idxB === -1) idxB = 999;
        return idxA - idxB;
      });
      setEventsList(sorted);
    });
  }, []);

  const filteredEvents = activeFilter === "ALL"
    ? eventsList
    : eventsList.filter(e => e.category === activeFilter);

  return (
    <div className="min-h-screen bg-transparent text-white overflow-x-hidden relative citadel-theme">
      <BackgroundEffects />
      <PageTransition>
        <ScrollProgress />
        <Navbar />

        {/* Hero Header Section */}
        <section className="relative pt-28 pb-0 overflow-hidden w-full">
          {/* Radial purple ambient glow behind title */}
          <div
            className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 60% 40%, rgba(139,92,246,0.18) 0%, transparent 70%)",
            }}
          />



          {/* Main Title & Mascot Row */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 flex items-center justify-between" style={{ perspective: "800px" }}>
            {/* Left side: Mascot (Desktop only) */}
            <div className="hidden md:flex w-[80px] justify-start shrink-0 md:translate-x-28 md:translate-y-20">
              <MeshGradientSVG />
            </div>

            {/* Center: Title */}
            <div className="flex-1 min-w-0 w-full">
              <motion.div
                initial={{ opacity: 0, rotateX: 12, y: 30 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: "preserve-3d" }}
              >
            <div className="w-full flex justify-center z-[36] pointer-events-none text-center mt-8 mb-4">
              <h1 className="hero-title-block leading-[0.82] select-none text-center mb-0">
                <span className="ignitia-citadel-title mx-auto" data-text="EVENTS">
                  <span>E</span>
                  <span>V</span>
                  <span>E</span>
                  <span>N</span>
                  <span>T</span>
                  <span>S</span>
                </span>
              </h1>
            </div>
              </motion.div>
            </div>

            {/* Right side spacer to keep title perfectly centered (Desktop only) */}
            <div className="hidden md:block w-[80px] shrink-0" />
          </div>

          {/* Subtitle + filter bar */}
          <div className="mt-10 mb-0 flex flex-col items-center gap-6 relative z-10 pb-12">
            <div className="w-full flex justify-center">
              <TerminalSubheading
                text="Eleven thrilling competitions &middot; UEM Kolkata"
                className="text-muted-foreground text-base md:text-lg font-medium text-center"
              />
            </div>

            {/* Filter Bar */}
            <div className="w-full px-4 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="border border-white/10 bg-white/[0.04] backdrop-blur-xl p-1.5 rounded-2xl md:rounded-full flex flex-wrap justify-center gap-1.5 items-center shadow-[0_4px_30px_rgba(0,0,0,0.4)] max-w-full"
              >
                {["ALL", "TECHNICAL", "ROBOTICS", "GAMING", "NON-TECH"].map((filter, idx) => {
                  const isActive = activeFilter === filter;
                  const btn = (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 sm:px-4 py-2 rounded-xl md:rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest transition-all duration-300 flex-grow sm:flex-grow-0 text-center ${isActive
                        ? "bg-primary text-white shadow-[0_0_18px_rgba(139,92,246,0.6)]"
                        : "text-muted-foreground hover:text-white hover:bg-white/8"
                        }`}
                    >
                      {filter}
                    </button>
                  );
                  return idx === 3 ? [
                    <div key="break" className="basis-full md:hidden h-0 -my-[3px]" />,
                    btn
                  ] : btn;
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Asymmetrical Grid of Event Cards */}
        <section className="pb-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
          <motion.div
            layout
            className={
              activeFilter === "ROBOTICS"
                ? "flex flex-col md:flex-row flex-wrap justify-center gap-6 overflow-visible"
                : "grid grid-cols-1 md:grid-cols-6 gap-6 overflow-visible"
            }
          >
            <AnimatePresence mode="popLayout">
              {activeFilter !== "GAMING" && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={activeFilter === "ROBOTICS" ? "w-full relative overflow-visible h-full flex flex-col" : "md:col-span-6 relative overflow-visible h-full flex flex-col"}
                >
                  <div
                    onClick={() => window.open(CENTRAL_REGISTRATION_URL, "_blank")}
                    className="w-full h-full min-h-[300px] flex flex-col flex-grow"
                  >
                    <InfoCard
                      image="/event-bg.png"
                      overlayImage="/Untitled design.png"
                      overlayHeight="125%"
                      title="CENTRAL REGISTRATION FORM"
                      description="Pay ₹299 once to participate in all 6 core events: Blind Coding, Guess Who?, Pixel Prophecy, Circuit Crawl, Evade-X, and The AI Argumentarium."
                      prize="Recognitions"
                      entryFee="₹299"
                      format="All 6 Events"
                      day="Aug 1 & 2"
                      borderColor={getBorderColor("orange")}
                      borderBgColor="var(--border-bg-color)"
                      cardBgColor="var(--card-bg-color)"
                      shadowColor="var(--shadow-color)"
                      textColor="var(--text-color)"
                      hoverTextColor={getHoverTextColor("orange")}
                      fontFamily="var(--font-family)"
                      rtlFontFamily="var(--rtl-font-family)"
                      effectBgColor={getBorderColor("orange")}
                      patternColor1="var(--pattern-color1)"
                      patternColor2="var(--pattern-color2)"
                    />
                  </div>
                </motion.div>
              )}

              {filteredEvents.map((event) => {
                const isCulturalInAll = activeFilter === "ALL" && event.id === "cultural-program";
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    key={event.id}
                    className={
                      activeFilter === "ROBOTICS"
                        ? "w-full md:w-[calc(33.333%-16px)] relative overflow-visible h-full flex flex-col"
                        : event.isWide
                          ? "md:col-span-4 relative overflow-visible h-full flex flex-col"
                          : `md:col-span-2 ${
                              isCulturalInAll 
                                ? "md:col-start-3" 
                                : activeFilter === "NON-TECH" && event.id === "cineverse"
                                  ? "md:col-start-2"
                                  : ""
                            } relative overflow-visible h-full flex flex-col`
                    }
                  >

                    <div 
                      onClick={() => event.id !== "cultural-program" && setSelectedEvent(event)} 
                      className="w-full h-full min-h-[300px] flex flex-col flex-grow"
                    >
                      <InfoCard
                        image={getEventImage(event)}
                        overlayImage={getEventOverlayImage(event)}
                        title={event.title}
                        description={event.description}
                        prize={event.prize}
                        format={event.teamSize}
                        entryFee={event.entryFee}
                        day={event.day}
                        customFooterText={event.id === "cultural-program" ? "A stage for performers to showcase their artistic talents in a celebration of youth, energy, and creativity." : undefined}
                        overlayHeight={event.id === "circuit-crawl" ? "80%" : undefined}
                        metadataPaddingLeft={event.id === "ai-argumentarium" ? "60px" : undefined}
                        borderColor={getBorderColor(event.theme)}
                        borderBgColor="var(--border-bg-color)"
                        cardBgColor="var(--card-bg-color)"
                        shadowColor="var(--shadow-color)"
                        textColor="var(--text-color)"
                        hoverTextColor={getHoverTextColor(event.theme)}
                        fontFamily="var(--font-family)"
                        rtlFontFamily="var(--rtl-font-family)"
                        effectBgColor={getBorderColor(event.theme)}
                        patternColor1="var(--pattern-color1)"
                        patternColor2="var(--pattern-color2)"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Detail Modal Popup */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
              onClick={() => { setSelectedEvent(null); setShowRulebook(false); }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-2xl max-h-[90vh] rounded-xl overflow-hidden flex flex-col backdrop-blur-xl bg-[#0B0A10]/95 border border-purple-500/20 shadow-[0_0_60px_rgba(139,92,246,0.15)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative Gold Inner Borders */}
                <div className="absolute inset-1 sm:inset-1.5 border border-amber-500/25 rounded-lg pointer-events-none z-30" />
                <div className="absolute inset-2 sm:inset-3.5 border-2 border-amber-500/40 rounded-lg pointer-events-none z-30" />

                {/* Corner Corner Accents (Cyberpunk / Fantasy corners) */}
                <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-amber-500/80 z-30" />
                <div className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-amber-500/80 z-30" />
                <div className="absolute bottom-2 left-2 sm:bottom-3.5 sm:left-3.5 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-amber-500/80 z-30" />
                <div className="absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-amber-500/80 z-30" />

                {/* Texture/Gradient Video Background */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                >
                  <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[#0c0d0e]/60 z-0 pointer-events-none" />

                {/* Modal Header */}
                <div className="flex justify-between items-start p-5 md:p-8 border-b border-white/5 relative z-10 gap-4">
                  <div className="flex gap-3 md:gap-4 items-center min-w-0 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 overflow-hidden ${themes[selectedEvent.theme].iconBg}`}>
                      {(() => {
                        const overlayImg = getEventOverlayImage(selectedEvent);
                        if (overlayImg) {
                          return <img src={overlayImg} alt={`${selectedEvent.title} logo`} className="w-full h-full object-contain p-1.5" />;
                        }
                        const Icon = IconMap[selectedEvent.icon as string] || Zap;
                        return <Icon className={themes[selectedEvent.theme].iconText} size={24} />;
                      })()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 border rounded uppercase mb-1 inline-block ${themes[selectedEvent.theme].badge}`}>
                        {selectedEvent.category}
                      </span>
                      <h3 className={`text-lg md:text-2xl font-bold font-['Orbitron'] ${themes[selectedEvent.theme].iconText} flex items-center truncate`}>
                        <span className="mr-2">&gt;</span>
                        <span className="truncate">{selectedEvent.title}</span>
                        <span className="w-3 h-6 bg-current animate-pulse inline-block ml-2 mb-[-2px] shrink-0"></span>
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedEvent(null); setShowRulebook(false); }}
                    className="p-2 text-muted-foreground hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 p-5 md:p-8 space-y-6 relative z-10 overflow-y-auto">
                  {/* Quick Metrics */}
                  <div className={`grid ${selectedEvent.prize && selectedEvent.prize !== "N/A" && selectedEvent.prize !== "TBA" ? 'grid-cols-3' : 'grid-cols-2'} gap-2 md:gap-4 p-3 md:p-4 border border-white/5 bg-[#ffffff02] rounded-2xl`}>
                    {selectedEvent.prize && selectedEvent.prize !== "N/A" && selectedEvent.prize !== "TBA" && (
                      <div className="text-center">
                        <span className={`text-[9px] md:text-[10px] uppercase tracking-wider ${themes[selectedEvent.theme].iconText} block font-['Orbitron']`}>PRIZE POOL</span>
                        <span className="text-sm md:text-lg font-bold font-['Orbitron'] text-white">
                          {selectedEvent.prize}
                        </span>
                      </div>
                    )}
                    <div className={`text-center ${selectedEvent.prize && selectedEvent.prize !== "N/A" && selectedEvent.prize !== "TBA" ? 'border-x' : 'border-r'} border-white/5`}>
                      <span className={`text-[9px] md:text-[10px] uppercase tracking-wider ${themes[selectedEvent.theme].iconText} block font-['Orbitron']`}>
                        {"teamSizeLabel" in selectedEvent ? selectedEvent.teamSizeLabel : "TEAM"}
                      </span>
                      <span className="text-sm md:text-lg font-bold font-['Orbitron'] text-white">
                        {selectedEvent.teamSize}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`text-[9px] md:text-[10px] uppercase tracking-wider ${themes[selectedEvent.theme].iconText} block font-['Orbitron']`}>TIMING</span>
                      <span className="text-xs md:text-base font-bold font-['Orbitron'] text-white">
                        {selectedEvent.duration}
                      </span>
                    </div>
                  </div>

                  {/* Overview */}
                  <div>
                    <h4 className={`text-xs uppercase tracking-wider font-semibold font-['Orbitron'] mb-2 ${themes[selectedEvent.theme].iconText}`}>
                      Overview
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed font-['Orbitron']">
                      {selectedEvent.overview || selectedEvent.description}
                    </p>
                  </div>

                  {/* Rules & Criteria Grid */}
                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    {/* Rules */}
                    {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                      <div>
                        <h4 className={`text-xs uppercase tracking-wider font-semibold font-['Orbitron'] mb-3 ${themes[selectedEvent.theme].iconText}`}>
                          Rules
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.rules.map((rule, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className={`${themes[selectedEvent.theme].iconText} mt-0.5 shrink-0`}>▸</span>
                              <span className="font-['Orbitron']">{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Judging Criteria */}
                    {selectedEvent.criteria && selectedEvent.criteria.length > 0 && (
                      <div>
                        <h4 className={`text-xs uppercase tracking-wider font-semibold font-['Orbitron'] mb-3 ${themes[selectedEvent.theme].iconText}`}>
                          Judging Criteria
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.criteria.map((crit, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className={`${themes[selectedEvent.theme].iconText} mt-0.5 shrink-0`}>◆</span>
                              <span className="font-['Orbitron']">{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Contact Persons */}
                  {selectedEvent.contacts && selectedEvent.contacts.length > 0 && (
                    <div className="pt-4 border-t border-white/5">
                      <h4 className={`text-xs uppercase tracking-wider font-semibold font-['Orbitron'] mb-3 ${themes[selectedEvent.theme].iconText}`}>
                        Contact Persons
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedEvent.contacts.map((contact, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 border border-white/5 bg-[#ffffff01] rounded-xl font-['Orbitron'] text-xs text-muted-foreground">
                            <span>{contact.name}</span>
                            <a href={`tel:${contact.phone}`} className={`hover:underline ${themes[selectedEvent.theme].iconText}`}>
                              {contact.phone}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-5 md:p-8 border-t border-white/5 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end relative z-10 bg-[#0c0d0e]/50">
                  <button
                    onClick={() => setShowRulebook(true)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-white/10 text-white font-['Orbitron'] font-semibold uppercase tracking-wider transition-all duration-300 text-center text-sm bg-transparent hover:bg-white/5 hover:border-white/20 shrink-0"
                  >
                    Rulebook
                  </button>
                  <motion.a
                    href={selectedEvent.registrationUrl || "#"}
                    target={selectedEvent.registrationUrl ? "_blank" : undefined}
                    rel={selectedEvent.registrationUrl ? "noopener noreferrer" : undefined}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto relative overflow-hidden font-semibold uppercase tracking-wider px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-center text-sm register-button-orange"
                  >
                    Register Now
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rulebook Modal Popup */}
        <AnimatePresence>
          {selectedEvent && showRulebook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
              onClick={() => setShowRulebook(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-4xl rounded-xl overflow-hidden h-[90vh] flex flex-col backdrop-blur-xl bg-[#0B0A10]/95 border border-purple-500/20 shadow-[0_0_60px_rgba(139,92,246,0.15)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative Gold Inner Borders */}
                <div className="absolute inset-1 sm:inset-1.5 border border-amber-500/25 rounded-lg pointer-events-none z-30" />
                <div className="absolute inset-2 sm:inset-3.5 border-2 border-amber-500/40 rounded-lg pointer-events-none z-30" />

                {/* Corner Corner Accents (Cyberpunk / Fantasy corners) */}
                <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-amber-500/80 z-30" />
                <div className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-amber-500/80 z-30" />
                <div className="absolute bottom-2 left-2 sm:bottom-3.5 sm:left-3.5 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-amber-500/80 z-30" />
                <div className="absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-amber-500/80 z-30" />

                {/* Texture/Gradient Video Background */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                >
                  <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[#0c0d0e]/60 z-0 pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/5 relative z-10 shrink-0 gap-4">
                  <h3 className={`text-base md:text-xl font-bold font-['Orbitron'] ${themes[selectedEvent.theme].iconText} flex items-center min-w-0 flex-1 truncate`}>
                    <span className="mr-2 opacity-80 shrink-0">&gt;</span>
                    <span className="truncate">{selectedEvent.title} — Rulebook</span>
                    <span className="w-2.5 h-5 bg-current animate-pulse inline-block ml-2 mb-[-2px] shrink-0"></span>
                  </h3>
                  <button
                    onClick={() => setShowRulebook(false)}
                    className="p-2 text-muted-foreground hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* PDF Embed */}
                <div className="flex-1 w-full relative z-10">
                  {/* @ts-ignore */}
                  {selectedEvent.rulebookUrl ? (
                    <iframe
                      // @ts-ignore
                      src={selectedEvent.rulebookUrl}
                      className="w-full h-full border-none"
                      allow="autoplay"
                      title={`${selectedEvent.title} Rulebook`}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-['Orbitron']">
                      Rulebook coming soon...
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </PageTransition>
    </div>
  );
};

export default Events;
