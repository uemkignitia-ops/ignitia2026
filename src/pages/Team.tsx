import { useState, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Users, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import ScrollProgress from "@/components/ScrollProgress";
import { TerminalSubheading } from "@/components/TerminalSubheading";

export interface Member {
  name: string;
  role: string;
  initials: string;
  linkedin: string;
  instagram: string;
  department?: string;
  bio?: string;
  expertise?: string[];
  photoUrl?: string;
}

// Dynamic data hooks will load conenvors dynamically from getTeam()

// Ornate card holder component matching the Citadel design theme
const TeamCard = memo(({ member, theme }: { member: Member; theme: "red" | "blue" | "green" | "purple" }) => {
  const themeMap = {
    red: {
      glowColor: "rgba(239, 68, 68, 0.18)",
      circleBg: "bg-gradient-to-tr from-red-950/40 via-red-900/20 to-transparent",
      circleGlow: "shadow-[0_0_15px_rgba(239, 68, 68, 0.3)]",
    },
    blue: {
      glowColor: "rgba(59, 130, 246, 0.18)",
      circleBg: "bg-gradient-to-tr from-blue-950/40 via-blue-900/20 to-transparent",
      circleGlow: "shadow-[0_0_15px_rgba(59, 130, 246, 0.3)]",
    },
    green: {
      glowColor: "rgba(16, 185, 129, 0.18)",
      circleBg: "bg-gradient-to-tr from-emerald-950/40 via-emerald-900/20 to-transparent",
      circleGlow: "shadow-[0_0_15px_rgba(16, 185, 129, 0.3)]",
    },
    purple: {
      glowColor: "rgba(168, 85, 247, 0.18)",
      circleBg: "bg-gradient-to-tr from-purple-950/40 via-purple-900/20 to-transparent",
      circleGlow: "shadow-[0_0_15px_rgba(168, 85, 247, 0.3)]",
    },
  };

  const style = themeMap[theme];

  return (
    <div className="group relative w-64 h-[380px] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 select-none border border-purple-500/20 cursor-pointer"
      style={{
        background: `radial-gradient(circle at center, rgba(17,17,22,0.98) 30%, ${style.glowColor} 100%)`,
        boxShadow: `0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.6)`,
      }}
    >
      <style>{`
        @keyframes borderCrawl {
          0% {
            stroke-dashoffset: 1272;
            opacity: 0;
          }
          4% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          76% {
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }
        .lightning-border-path {
          stroke-dasharray: 200 1072;
          animation: borderCrawl 4s linear infinite;
        }
      `}</style>

      {/* Crawling Lightning Violet Border */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-xl z-20" viewBox="0 0 256 380" fill="none">
        <defs>
          <linearGradient id="violet-lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        {/* Base static faint violet outer border */}
        <rect x="2" y="2" width="252" height="376" rx="10" stroke="#a855f7" strokeWidth="1" opacity="0.2" />
        {/* Animated crawling lightning stroke */}
        <rect
          x="2"
          y="2"
          width="252"
          height="376"
          rx="10"
          stroke="url(#violet-lightning-gradient)"
          strokeWidth="3"
          className="lightning-border-path"
          style={{
            filter: "drop-shadow(0 0 5px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 10px rgba(168, 85, 247, 0.4))",
          }}
        />
      </svg>

      {/* Decorative Gold Inner Borders */}
      <div className="absolute inset-1.5 border border-amber-500/25 rounded-lg pointer-events-none z-10" />
      <div className="absolute inset-3.5 border-2 border-amber-500/40 rounded-lg pointer-events-none z-10" />

      {/* Lightning Hover Glow Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-amber-400/5 to-transparent rotate-45 translate-y-[-50%] animate-pulse" />
        </div>
      </div>

      {/* Top Ornate Lightning Deco */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 text-amber-500/80 group-hover:text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-colors duration-300 z-10">
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <polygon points="12,1 6,13 11,13 9,23 18,11 13,11" />
        </svg>
      </div>

      {/* Bottom Ornate Lightning Deco */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 text-amber-500/80 group-hover:text-amber-400 rotate-180 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-colors duration-300 z-10">
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <polygon points="12,1 6,13 11,13 9,23 18,11 13,11" />
        </svg>
      </div>

      {/* Corner Corner Accents (Cyberpunk / Fantasy corners) */}
      <div className="absolute top-3.5 left-3.5 w-3 h-3 border-t-2 border-l-2 border-amber-500/80 z-10" />
      <div className="absolute top-3.5 right-3.5 w-3 h-3 border-t-2 border-r-2 border-amber-500/80 z-10" />
      <div className="absolute bottom-3.5 left-3.5 w-3 h-3 border-b-2 border-l-2 border-amber-500/80 z-10" />
      <div className="absolute bottom-3.5 right-3.5 w-3 h-3 border-b-2 border-r-2 border-amber-500/80 z-10" />

      {/* Profile Photo in Gold Circle */}
      <div className="flex justify-center mt-12">
        <div className={`relative w-28 h-28 rounded-full border-4 border-amber-500/90 p-1 overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${style.circleGlow}`}
          style={{ background: style.circleBg }}
        >
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-black/60">
              <span className="font-heading font-black text-2xl text-white/90 tracking-normal select-none">
                {member.initials}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Banner / Plaque box */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[85%]">
        <div className="relative py-2 px-3 bg-[#0d0a0e] border-2 border-amber-500/70 rounded-md flex flex-col justify-center items-center shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {/* Plaque side tabs */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-3 bg-amber-500/80 border-r border-black" />
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-3 bg-amber-500/80 border-l border-black" />

          <h4 className="font-heading font-bold text-xs tracking-wider text-white uppercase text-center w-full truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {member.name}
          </h4>
          {member.role && (
            <span className="font-mono text-[9px] text-amber-500 uppercase tracking-widest font-semibold mt-0.5 text-center truncate w-full">
              {member.role}
            </span>
          )}
        </div>
      </div>

      {/* LinkedIn Link */}
      {member.linkedin && member.linkedin !== "#" && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10" onClick={(e) => e.stopPropagation()}>
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full border border-amber-500/50 bg-[#0e0c0f] hover:bg-amber-500/90 text-amber-500 hover:text-black flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
});
TeamCard.displayName = "TeamCard";

// Modal card for member details (opens on card click)
const MemberCard = memo(
  ({
    member,
    colorHsl,
    onClose,
  }: {
    member: Member;
    colorHsl: string;
    onClose: () => void;
  }) => {
    // Determine if any detail info exists — drives centered vs detail layout
    const hasRole = !!(member.role && member.role.trim());
    const hasBio = !!(member.bio && member.bio.trim());
    const hasExpertise = !!(member.expertise && member.expertise.length > 0);
    const hasDepartment = !!(member.department && member.department.trim());
    const hasLinkedin = !!(member.linkedin && member.linkedin !== "#" && member.linkedin.trim());
    const hasDetails = hasRole || hasBio || hasExpertise || hasDepartment || hasLinkedin;

    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Card Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-xs sm:max-w-md rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden"
          style={{
            background: `linear-gradient(160deg, hsl(${colorHsl} / 0.08) 0%, hsl(0 0% 5% / 0.97) 40%, hsl(0 0% 4% / 0.99) 100%)`,
            boxShadow: `0 24px 80px hsl(${colorHsl} / 0.15), 0 0 0 1px hsl(${colorHsl} / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.05)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="h-1.5 w-full"
            style={{
              background: `linear-gradient(90deg, hsl(${colorHsl} / 0.6), hsl(${colorHsl} / 0.2), hsl(${colorHsl} / 0.6))`,
            }}
          />

          <div className={`p-5 sm:p-8 flex flex-col ${!hasDetails ? "items-center text-center" : ""}`}>
            {/* Avatar + name — always centered */}
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mb-3 sm:mb-4 overflow-hidden border"
                style={{
                  borderColor: `hsl(${colorHsl} / 0.3)`,
                  boxShadow: `0 0 40px hsl(${colorHsl} / 0.15)`,
                }}
              >
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading font-black text-2xl sm:text-4xl text-white/90">
                    {member.initials || member.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)}
                  </span>
                )}
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-1 text-center">
                {member.name}
              </h3>
              {hasRole && (
                <p className="text-white/40 text-[11px] sm:text-sm font-medium uppercase tracking-wider text-center mb-2">
                  {member.role}
                </p>
              )}
              {hasDepartment && (
                <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest text-center">
                  {member.department}
                </p>
              )}
            </div>

            {/* Details section — only shown if any detail exists */}
            {hasDetails && (
              <div className="space-y-4">
                {hasBio && (
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-primary/80 mb-1.5">
                      Bio / Objective
                    </h4>
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-sans">
                      {member.bio}
                    </p>
                  </div>
                )}

                {hasExpertise && (
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-primary/80 mb-1.5">
                      Expertise Areas
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {member.expertise!.map((exp, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] sm:text-[10.5px] font-mono px-2 py-0.5 sm:py-1 rounded bg-white/5 border border-white/5 text-white/80"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hasLinkedin && (
                  <div>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-mono text-primary/70 hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Linkedin className="w-3 h-3" />
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all cursor-pointer"
          >
            ×
          </button>
        </motion.div>
      </div>
    );
  }
);
MemberCard.displayName = "MemberCard";

const Team = () => {
  const [activeCard, setActiveCard] = useState<{
    member: Member;
    colorHsl: string;
  } | null>(null);
  const [teamList, setTeamList] = useState<any[]>([]);

  useEffect(() => {
    import("@/lib/datastore").then((m) => {
      m.getTeam().then(setTeamList);
    });
  }, []);

  const leadConvenors = teamList.filter((m) => m.section === "leads");
  const organizers = teamList.filter((m) => m.section === "organizers");
  const coreMembers = teamList.filter((m) => m.section === "core");
  const domainLeads = teamList.filter((m) => m.section === "domain");

  const handleOpenCard = useCallback((member: Member, colorHsl: string) => {
    setActiveCard({ member, colorHsl });
  }, []);

  const handleCloseCard = useCallback(() => {
    setActiveCard(null);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background selection:bg-primary/30 relative">
        <ParticleField />
        <ScrollProgress />
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-28 pb-0 overflow-hidden w-full">
          {/* Radial purple ambient glow behind title */}
          <div
            className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(139,92,246,0.22) 0%, transparent 70%)",
            }}
          />

          {/* Eyebrow pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-5"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/5 backdrop-blur-md">
              <Users size={13} className="text-primary shrink-0" />
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-primary/90 font-semibold">
                Meet The Minds
              </span>
            </div>
          </motion.div>

          {/* Main Title — perspective tilt */}
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
                  OUR TEAM
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
                  TEAM
                </span>
              </h1>
            </motion.div>
          </div>

          {/* Subtitle */}
          <div className="mt-8 mb-0 flex flex-col items-center gap-3 relative z-10 pb-10">
            <div className="w-full flex justify-center px-4">
              <TerminalSubheading 
                text="A dedicated group of visionaries, planners, and creators shaping IGNITIA '26"
                className="text-muted-foreground text-sm md:text-base font-medium text-center max-w-2xl"
              />
            </div>
          </div>
        </section>

        {/* Team Grid Row Layout */}
        <section className="relative z-10 pb-32 max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Row 1: LEAD CONVENORS */}
          {leadConvenors.length > 0 && (
            <div className="flex flex-col items-center mb-24">
              <div className="flex flex-col items-center justify-center mb-12 relative">
                <div className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent -top-4" />
                <h2 className="font-heading font-black text-2xl md:text-3xl tracking-[0.25em] text-center uppercase text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.45)]">
                  LEAD CONVENORS
                </h2>
                <div className="w-16 h-0.5 bg-amber-500/60 mt-2 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-14 w-full">
                {leadConvenors.map((member) => (
                  <div key={member.name} onClick={() => handleOpenCard(member, "0 100% 50%")}>
                    <TeamCard member={member} theme="red" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: ORGANIZERS */}
          {organizers.length > 0 && (
            <div className="flex flex-col items-center mb-24">
              <div className="flex flex-col items-center justify-center mb-12 relative">
                <div className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent -top-4" />
                <h2 className="font-heading font-black text-2xl md:text-3xl tracking-[0.25em] text-center uppercase text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.45)]">
                  ORGANIZERS
                </h2>
                <div className="w-16 h-0.5 bg-amber-500/60 mt-2 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-14 w-full">
                {organizers.map((member) => (
                  <div key={member.name} onClick={() => handleOpenCard(member, "217 91% 60%")}>
                    <TeamCard member={member} theme="blue" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row 3: CORE MEMBERS */}
          {coreMembers.length > 0 && (
            <div className="flex flex-col items-center mb-24">
              <div className="flex flex-col items-center justify-center mb-12 relative">
                <div className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent -top-4" />
                <h2 className="font-heading font-black text-2xl md:text-3xl tracking-[0.25em] text-center uppercase text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.45)]">
                  CORE MEMBERS
                </h2>
                <div className="w-16 h-0.5 bg-amber-500/60 mt-2 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 w-full">
                {coreMembers.map((member) => (
                  <div key={member.name} onClick={() => handleOpenCard(member, "142 71% 45%")}>
                    <TeamCard member={member} theme="green" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row 4: DOMAIN LEADS */}
          {domainLeads.length > 0 && (
            <div className="flex flex-col items-center mb-20">
              <div className="flex flex-col items-center justify-center mb-12 relative">
                <div className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent -top-4" />
                <h2 className="font-heading font-black text-2xl md:text-3xl tracking-[0.25em] text-center uppercase text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.45)]">
                  DOMAIN LEADS
                </h2>
                <div className="w-16 h-0.5 bg-amber-500/60 mt-2 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-14 w-full">
                {domainLeads.map((member) => (
                  <div key={member.name} onClick={() => handleOpenCard(member, "270 70% 60%")}>
                    <TeamCard member={member} theme="purple" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

        {/* Detail Window popup */}
        <AnimatePresence mode="wait">
          {activeCard && (
            <MemberCard
              member={activeCard.member}
              colorHsl={activeCard.colorHsl}
              onClose={handleCloseCard}
            />
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Team;