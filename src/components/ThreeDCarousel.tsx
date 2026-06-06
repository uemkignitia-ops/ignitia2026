import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers, HelpCircle } from "lucide-react";

interface Member {
  name: string;
  role: string;
  initials: string;
  linkedin: string;
  instagram: string;
  department?: string;
  bio?: string;
  expertise?: string[];
}

interface TeamSection {
  title: string;
  role_color: string;
  members: Member[];
}

interface ThreeDCarouselProps {
  sections: TeamSection[];
  convenors: Member[];
  onOpenMemberCard: (member: Member, colorHsl: string) => void;
  orbitColors: string[];
}

export const ThreeDCarousel = ({ sections, convenors, onOpenMemberCard, orbitColors }: ThreeDCarouselProps) => {
  const carouselData = useMemo(() => {
    const leadershipSection: TeamSection = {
      title: "Leadership",
      role_color: "from-amber-400 to-orange-500",
      members: convenors,
    };
    return [leadershipSection, ...sections];
  }, [sections, convenors]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoRotateTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = carouselData.length;

  // Track window resizing safely inside React Lifecycle hook context to prevent layout shifting
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleCheckMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleCheckMobile();
    window.addEventListener("resize", handleCheckMobile);
    return () => window.removeEventListener("resize", handleCheckMobile);
  }, []);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % count);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + count) % count);

  useEffect(() => {
    if (!isHovered) {
      autoRotateTimer.current = setInterval(() => {
        handleNext();
      }, 3000);
    }
    return () => {
      if (autoRotateTimer.current) clearInterval(autoRotateTimer.current);
    };
  }, [isHovered, count]);

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto py-12 flex flex-col items-center justify-center overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Section Badge */}
      <div className="flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md z-20">
        <Layers size={13} className="text-orange-500" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/90 font-bold">
          Team Divisions view
        </span>
      </div>

      {/* Outer Viewport Container */}
      <div className="relative w-full h-[390px] sm:h-[430px] flex items-center justify-center">
        
        {/* The Anchor Track Frame Container */}
        <motion.div 
          className="absolute flex gap-4 sm:gap-6 items-center w-[260px] sm:w-[340px]"
          animate={{ 
            x: `calc(${activeIndex * -100}% - ${activeIndex * (isMobile ? 16 : 24)}px)` 
          }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        >
          {carouselData.map((section, idx) => {
            const isSelected = activeIndex === idx;
            const hslColor = idx === 0 ? "24 100% 55%" : orbitColors[idx - 1] || "24 90% 55%";

            return (
              <motion.div
                key={section.title}
                className="w-[260px] h-[340px] sm:w-[340px] sm:h-[390px] rounded-2xl border flex flex-col justify-between items-stretch shrink-0 transition-all duration-300"
                animate={{
                  scale: isSelected ? 1 : 0.88,
                  opacity: isSelected ? 1 : 0.3,
                }}
                style={{
                  background: isSelected 
                    ? `linear-gradient(160deg, hsl(${hslColor} / 0.15) 0%, #070707 65%)`
                    : `#030303`,
                  borderColor: isSelected ? `hsl(${hslColor} / 0.5)` : "rgba(255,255,255,0.06)",
                  boxShadow: isSelected 
                    ? `0 30px 65px -15px hsl(${hslColor} / 0.3), inset 0 1px 1px rgba(255,255,255,0.1)` 
                    : "none",
                  pointerEvents: isSelected ? "auto" : "none",
                }}
              >
                {/* Colored Top Glow Strip */}
                <div 
                  className="h-1 w-1/3 mx-auto rounded-b-full shrink-0 transition-all duration-300"
                  style={{ 
                    background: `hsl(${hslColor})`,
                    boxShadow: isSelected ? `0 2px 12px hsl(${hslColor} / 0.6)` : 'none'
                  }}
                />

                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between min-h-0">
                  <div className="flex flex-col min-h-0">
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide mb-0.5 text-center sm:text-left">
                      {section.title}
                    </h3>
                    <p className="text-[9px] font-mono tracking-widest text-white/50 font-bold uppercase mb-4 text-center sm:text-left">
                      {section.members.length} {section.members.length === 1 ? "Operative" : "Division Operatives"}
                    </p>

                    {/* Team List Box Layout */}
                    <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar min-h-0 flex-grow max-h-[170px] sm:max-h-[210px]">
                      {section.members.map((member, mIdx) => (
                        <button
                          key={mIdx}
                          disabled={!isSelected}
                          onClick={() => onOpenMemberCard(member, hslColor)}
                          className="w-full text-left p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.12] transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center font-heading text-xs font-black text-white shrink-0"
                              style={{ 
                                background: `radial-gradient(circle, hsl(${hslColor} / 0.25) 0%, transparent 100%)`, 
                                border: `1px solid hsl(${hslColor} / 0.4)` 
                              }}
                            >
                              {member.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors truncate">{member.name}</p>
                              <p className="text-[10px] text-white/50 font-medium truncate">{member.role}</p>
                            </div>
                          </div>
                          <HelpCircle size={13} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-[9px] text-center font-mono font-bold tracking-widest text-white/20 border-t border-white/5 pt-3 mt-2 shrink-0">
                    TEAM IGNITIA '26
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Manual Controls / Navigation Elements */}
      <div className="flex items-center gap-5 mt-6 z-20">
        <button
          onClick={() => { handlePrev(); setIsHovered(true); }}
          className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-90 cursor-pointer shadow-md shadow-black/50"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {carouselData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveIndex(idx); setIsHovered(true); }}
              className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: activeIndex === idx ? "20px" : "6px",
                background: activeIndex === idx ? "hsl(45 95% 55%)" : "rgba(255,255,255,0.15)"
              }}
            />
          ))}
        </div>

        <button
          onClick={() => { handleNext(); setIsHovered(true); }}
          className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-90 cursor-pointer shadow-md shadow-black/50"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};