import { useState, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import ScrollProgress from "@/components/ScrollProgress";
import BackgroundEffects from "@/components/BackgroundEffects";
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
// Ornate card holder component matching the Citadel design theme
const TeamCard = memo(({ member, theme }: { member: Member; theme: "red" | "blue" | "green" | "purple" | "orange" }) => {
  const getCardStyles = (section: string, theme: string) => {
    // Try section key first
    if (section === "leads") {
      return {
        templateUrl: "/teams/leads.png",
        labelColor: "text-[#ff4d4d]",
        glowStyle: "hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.65)]",
      };
    }
    if (section === "organizers") {
      return {
        templateUrl: "/teams/organizers.png",
        labelColor: "text-[#ff8f3d]",
        glowStyle: "hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.65)]",
      };
    }
    if (section === "core") {
      return {
        templateUrl: "/teams/core.png",
        labelColor: "text-[#3b82f6]",
        glowStyle: "hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.65)]",
      };
    }
    if (section === "domain") {
      return {
        templateUrl: "/teams/domain.png",
        labelColor: "text-[#c084fc]",
        glowStyle: "hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.65)]",
      };
    }

    // Fallback to theme
    switch (theme) {
      case "red":
        return {
          templateUrl: "/teams/leads.png",
          labelColor: "text-[#ff4d4d]",
          glowStyle: "hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.65)]",
        };
      case "orange":
        return {
          templateUrl: "/teams/organizers.png",
          labelColor: "text-[#ff8f3d]",
          glowStyle: "hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.65)]",
        };
      case "blue":
        return {
          templateUrl: "/teams/core.png",
          labelColor: "text-[#3b82f6]",
          glowStyle: "hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.65)]",
        };
      case "green":
        return {
          templateUrl: "/teams/core.png",
          labelColor: "text-[#10b981]",
          glowStyle: "hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.65)]",
        };
      case "purple":
      default:
        return {
          templateUrl: "/teams/domain.png",
          labelColor: "text-[#c084fc]",
          glowStyle: "hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.65)]",
        };
    }
  };

  const { templateUrl, labelColor, glowStyle } = getCardStyles(member.section || "", theme);
  const initials = member.initials || member.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

  // Dynamically calculate font sizes based on name and role length to fit within inner borders
  const nameLength = member.name.length;
  const nameFontSize = nameLength > 12
    ? `clamp(8px, ${Math.max(3.2, (5.8 * 12) / nameLength)}cqw, 20px)`
    : "clamp(11px, 5.8cqw, 20px)";

  const roleText = member.role || "MEMBER";
  const roleLength = roleText.length;
  const roleFontSize = roleLength > 15
    ? `clamp(7px, ${Math.max(2.8, (4.8 * 15) / roleLength)}cqw, 16px)`
    : "clamp(9px, 4.8cqw, 16px)";

  const cardImageStyle = {
    top: "9.0%",
    left: "13.5%",
    width: "73.0%",
    height: "61.8%",
  };

  return (
    <div
      className={`group relative w-full aspect-[2/3] transition-all duration-300 hover:-translate-y-2 select-none cursor-pointer filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] ${glowStyle}`}
      style={{ containerType: "inline-size" }}
    >
      {/* Clipped Inner Container to hide the outer glass border of the PNG template */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          clipPath: "inset(5.2% 6.2% 6.2% 6.2% rounded 12px)"
        }}
      >
        {/* Profile Photo Wrapper to prevent image overflowing card frames on hover */}
        <div
          className="absolute overflow-hidden z-0"
          style={{
            ...cardImageStyle,
            clipPath: "polygon(6% 0%, 94% 0%, 100% 6%, 100% 100%, 0% 100%, 0% 6%)"
          }}
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full bg-gradient-to-b from-[#14121d] to-[#09080e] flex items-center justify-center border border-white/5"
            >
              <span className="font-heading font-black text-xl sm:text-2xl tracking-widest text-white/40 group-hover:text-white/60 transition-colors duration-300">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Futuristic respect card frame PNG template */}
        <img
          src={templateUrl}
          alt="Card Frame"
          className="absolute inset-0 w-full h-full object-fill z-10 pointer-events-none"
        />

        {/* Coded text templates and values overlay in a single flexbox to prevent overlapping */}
        <div
          className="absolute z-20 pointer-events-none select-none flex flex-col"
          style={{
            top: "68%",
            left: "clamp(18.5%, 21cqw, 21%)",
            right: "clamp(14%, 16.5cqw, 16.5%)",
            gap: "clamp(8px, 4.5cqw, 18px)"
          }}
        >
          {/* Name section */}
          <div className="flex flex-col justify-start min-w-0">
            <span
              className={`font-extrabold tracking-[0.25em] font-mono leading-none ${labelColor}`}
              style={{ fontSize: "clamp(7.5px, 3.5cqw, 11px)" }}
            >
              NAME
            </span>
            <h4
              className="font-heading font-bold uppercase text-white tracking-[0.05em] leading-tight truncate mt-1"
              style={{ fontSize: nameFontSize }}
            >
              {member.name}
            </h4>
          </div>

          {/* Role section */}
          <div className="flex flex-col justify-start min-w-0">
            <span
              className={`font-extrabold tracking-[0.25em] font-mono leading-none ${labelColor}`}
              style={{ fontSize: "clamp(7.5px, 3.5cqw, 11px)" }}
            >
              ROLE
            </span>
            <p
              className="font-heading font-medium uppercase text-white/90 tracking-[0.05em] leading-tight truncate mt-1"
              style={{ fontSize: roleFontSize }}
            >
              {roleText}
            </p>
          </div>
        </div>

        {/* Premium Sweep Glare Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-30 overflow-hidden">
          <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
        </div>
      </div>

      {/* Permanently centered LinkedIn Link at the bottom (partially overlapping the bottom border on mobile screens) */}
      {member.linkedin && member.linkedin !== "#" && (
        <div
          className="absolute z-40 animate-fade-in bottom-[6%] md:bottom-[7%]"
          style={{ left: "50%", transform: "translateX(-50%)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full border bg-[#0e0c0f] flex items-center justify-center transition-all duration-200 ${labelColor}`}
            style={{
              borderColor: "currentColor",
              boxShadow: "0 0 10px rgba(0,0,0,0.85)",
            }}
            title="LinkedIn Profile"
          >
            <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
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
  const [sectionsList, setSectionsList] = useState<any[]>([]);

  useEffect(() => {
    import("@/lib/datastore").then((m) => {
      m.getTeam().then(setTeamList);
      m.getTeamSections().then(setSectionsList);
    });
  }, []);

  const handleOpenCard = useCallback((member: Member, colorHsl: string) => {
    setActiveCard({ member, colorHsl });
  }, []);

  const handleCloseCard = useCallback(() => {
    setActiveCard(null);
  }, []);

  return (
    <div className="min-h-screen bg-transparent selection:bg-primary/30 relative citadel-theme">
      <BackgroundEffects />
      <PageTransition>
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

          <div className="w-full flex justify-center z-[36] pointer-events-none text-center mt-8 mb-4">
            <h1 className="hero-title-block leading-[0.82] select-none text-center mb-0">
              <span className="ignitia-citadel-title mx-auto" data-text="TEAM">
                <span>T</span>
                <span>E</span>
                <span>A</span>
                <span>M</span>
              </span>
            </h1>
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

          {sectionsList.map((sec) => {
            const members = teamList.filter((m) => m.section === sec.key);
            if (members.length === 0) return null;

            const themeColor = sec.theme || "purple";
            const glowHsl = sec.colorHsl || "270 70% 60%";

            return (
              <div key={sec.key} className="flex flex-col items-center mb-24">
                <div className="flex flex-col items-center justify-center mb-12 relative">
                  <div className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent -top-4" />
                  <h2 className="font-heading font-black text-2xl md:text-3xl tracking-[0.25em] text-center uppercase text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.45)]">
                    {sec.title}
                  </h2>
                  <div className="w-16 h-0.5 bg-amber-500/60 mt-2 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                </div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-8 md:gap-14 w-full">
                  {members.map((member) => (
                    <div
                      key={member.name}
                      onClick={() => handleOpenCard(member, glowHsl)}
                      className="w-[calc(50%-4px)] sm:w-72 md:w-80 max-w-[320px] h-fit"
                    >
                      <TeamCard member={member} theme={themeColor as any} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

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
      </PageTransition>
    </div>
  );
};

export default Team;