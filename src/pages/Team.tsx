import { useState, useCallback, useRef, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Instagram, Users, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import ScrollProgress from "@/components/ScrollProgress";
import { ThreeDCarousel } from "@/components/ThreeDCarousel";

// Data structures for team members and orbits

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

interface OrbitData {
  label: string;
  badge: string;
  members: Member[];
  radius: number;
  speed: number;
  reverse: boolean;
  colorHsl: string;
}

const convenorsList: Member[] = [
  {
    name: "Snehashish Das",
    role: "Lead Convenor",
    initials: "SD",
    linkedin: "#",
    instagram: "#",
    department: "Leadership",
    bio: "Visionary leader driving IGNITIA '26 towards innovation and excellence.",
    expertise: ["Event Strategy", "Team Management", "Vision Setting"],
  },
  {
    name: "Priyanshu Mitra",
    role: "Convenor",
    initials: "PM",
    linkedin: "#",
    instagram: "#",
    department: "Leadership",
    bio: "Steering global event structures and core alignments for IGNITIA '26.",
    expertise: ["Operations", "Strategic Planning", "Public Relations"],
  },
];

const ConvenorListCard = memo(
  ({
    convenors,
    colorHsl,
    onSelectMember,
    onClose,
  }: {
    convenors: Member[];
    colorHsl: string;
    onSelectMember: (member: Member) => void;
    onClose: () => void;
  }) => (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative w-full max-w-xs sm:max-w-md rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, hsl(${colorHsl} / 0.08) 0%, hsl(0 0% 5% / 0.97) 40%, hsl(0 0% 4% / 0.99) 100%)`,
          boxShadow: `0 24px 80px hsl(${colorHsl} / 0.15), 0 0 0 1px hsl(${colorHsl} / 0.1)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, hsl(${colorHsl} / 0.6), hsl(${colorHsl} / 0.2), hsl(${colorHsl} / 0.6))`,
          }}
        />

        <div className="p-6 sm:p-8 flex flex-col">
          <div className="text-center mb-5">
            <h3 className="font-heading font-bold text-2xl text-white mb-1 uppercase tracking-wide">
              CONVENORS
            </h3>
            <p className="text-white/40 text-[10px] md:text-xs font-mono uppercase tracking-widest">
              Leadership Council
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {convenors.map((convenor, idx) => (
              <button
                key={idx}
                onClick={() => onSelectMember(convenor)}
                className="w-full text-left p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200 group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-heading font-bold text-white/90 border text-sm"
                    style={{
                      background: `radial-gradient(circle, hsl(${colorHsl} / 0.2), transparent)`,
                      borderColor: `hsl(${colorHsl} / 0.3)`,
                    }}
                  >
                    {convenor.initials}
                  </div>
                  <div>
                    <h4 className="text-white font-heading font-semibold text-base group-hover:text-orange-400 transition-colors">
                      {convenor.name}
                    </h4>
                    <p className="text-white/40 text-xs">{convenor.role}</p>
                  </div>
                </div>
                <ExternalLink
                  size={14}
                  className="text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all"
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all cursor-pointer"
        >
          ×
        </button>
      </motion.div>
    </div>
  ),
);
ConvenorListCard.displayName = "ConvenorListCard";

// Team sections used for orbital views (4 orbits; Convenor is the sun)
const teamSections = [
  {
    title: "Event Heads",
    role_color: "from-violet-500 to-indigo-500",
    members: [
      {
        name: "Aranya Rath",
        role: "Event Head",
        initials: "AR",
        linkedin: "#",
        instagram: "#",
        department: "Event Operations",
        bio: "Orchestrating seamless event experiences with meticulous planning and creative execution.",
        expertise: ["Event Coordination", "Logistics", "Creative Planning"],
      },
      {
        name: "Soumalika Chakraborty",
        role: "Event Head",
        initials: "SC",
        linkedin: "#",
        instagram: "#",
        department: "Event Operations",
        bio: "Bringing ideas to life through strategic planning and innovative execution.",
        expertise: [
          "Stakeholder Management",
          "Resource Planning",
          "Timeline Management",
        ],
      },
    ],
  },
  {
    title: "Core Team",
    role_color: "from-rose-400 to-red-500",
    members: [
      {
        name: "Anamika Mallick",
        role: "Core Team",
        initials: "AM",
        linkedin: "#",
        instagram: "#",
        department: "Core Operations",
        bio: "Driving core operational excellence and team coordination.",
        expertise: ["Coordination", "Process Management", "Leadership"],
      },
      {
        name: "Anjanika Paul",
        role: "Core Team",
        initials: "AP",
        linkedin: "#",
        instagram: "#",
        department: "Core Operations",
        bio: "Strategic planning and process optimization.",
        expertise: ["Strategy", "Process Optimization", "Planning"],
      },
      {
        name: "Soham Ray",
        role: "Core Team",
        initials: "SR",
        linkedin: "#",
        instagram: "#",
        department: "Core Operations",
        bio: "Converting ideas into actionable plans and execution.",
        expertise: ["Execution", "Implementation", "Timeline Management"],
      },
      {
        name: "Subhamita Adhikari",
        role: "Core Team",
        initials: "SA",
        linkedin: "#",
        instagram: "#",
        department: "Core Operations",
        bio: "Ensuring seamless communication and task execution.",
        expertise: ["Communication", "Task Management", "Documentation"],
      },
    ],
  },
  {
    title: "Domain Leads",
    role_color: "from-orange-400 to-pink-500",
    members: [
      {
        name: "To Be Added",
        role: "Domain Lead",
        initials: "?",
        linkedin: "#",
        instagram: "#",
        department: "Domain Leadership",
        bio: "Leading specialized domain tracks and initiatives.",
        expertise: ["Domain Expertise", "Leadership", "Innovation"],
      },
    ],
  },
  {
    title: "Coordinators",
    role_color: "from-cyan-400 via-sky-400 to-blue-400",
    members: [
      {
        name: "To Be Added",
        role: "Coordinator",
        initials: "?",
        linkedin: "#",
        instagram: "#",
        department: "Support & Coordination",
        bio: "Supporting event execution and volunteer coordination.",
        expertise: ["Coordination", "Logistics", "Support"],
      },
    ],
  },
];

const _orbitColors = [
  "270 65% 60%",  // Orbit 1: Event Heads
  "12 85% 52%",   // Orbit 2: Core Team
  "340 80% 60%",   // Orbit 3: Domain Leads
  "190 85% 55%",  // Orbit 4: Coordinators
  "200 70% 55%",  
  "160 70% 55%",
];

const orbits: OrbitData[] = teamSections.map((sec, idx) => ({
  label: sec.title,
  badge: sec.title,
  radius: 120 + idx * 90,
  speed: 30 + idx * 18,
  reverse: idx % 2 === 1,
  colorHsl: _orbitColors[idx] || "200 70% 55%",
  members: sec.members.map((m) => ({ ...m }) as Member),
}));

// Modal card for member details (opens on planet click)
const MemberCard = memo(
  ({
    member,
    colorHsl,
    onClose,
  }: {
    member: Member;
    colorHsl: string;
    onClose: () => void;
  }) => (
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

      {/* Card Body - Optimized max-w-xs for mobile, max-w-md for PC */}
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

        {/* Condensed padding on mobile (p-5), original padding on PC (sm:p-8) */}
        <div className="p-5 sm:p-8 flex flex-col">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            {/* Shrunk avatar from w-28/h-28 to w-20/h-20 on mobile */}
            <div
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mb-3 sm:mb-4"
              style={{
                background: `radial-gradient(circle at 35% 30%, hsl(${colorHsl} / 0.3), hsl(${colorHsl} / 0.08) 70%)`,
                border: `2px solid hsl(${colorHsl} / 0.3)`,
                boxShadow: `0 0 40px hsl(${colorHsl} / 0.15), inset 0 0 20px hsl(${colorHsl} / 0.05)`,
              }}
            >
              <span className="font-heading font-black text-2xl sm:text-4xl text-white/90">
                {member.initials}
              </span>
            </div>

            {/* Adjusted typography sizes for mobile */}
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-1 text-center">
              {member.name}
            </h3>
            <p className="text-white/40 text-[11px] sm:text-sm font-medium uppercase tracking-wider text-center mb-2">
              {member.role}
            </p>
            {member.department && (
              <p
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-center"
                style={{
                  background: `hsl(${colorHsl} / 0.15)`,
                  color: `hsl(${colorHsl})`,
                }}
              >
                {member.department}
              </p>
            )}
          </div>

          <div
            className="w-12 h-px mx-auto mb-4 sm:mb-6"
            style={{
              background: `linear-gradient(90deg, transparent, hsl(${colorHsl} / 0.3), transparent)`,
            }}
          />

          {member.bio && (
            <div className="mb-4 sm:mb-6">
              <p className="text-white/70 text-center text-xs sm:text-sm leading-relaxed">
                {member.bio}
              </p>
            </div>
          )}

          {member.expertise && member.expertise.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <p className="text-white/40 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 text-center">
                Expertise
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                {member.expertise.map((exp, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border"
                    style={{
                      background: `hsl(${colorHsl} / 0.08)`,
                      borderColor: `hsl(${colorHsl} / 0.2)`,
                      color: `hsl(${colorHsl})`,
                    }}
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            className="w-12 h-px mx-auto mb-4 sm:mb-6"
            style={{
              background: `linear-gradient(90deg, transparent, hsl(${colorHsl} / 0.3), transparent)`,
            }}
          />

          <div className="flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 border"
              style={{
                background: "hsl(210 80% 55% / 0.08)",
                borderColor: "hsl(210 80% 55% / 0.2)",
                color: "hsl(210 80% 65%)",
              }}
            >
              <Linkedin size={12} className="sm:w-[14px] sm:h-[14px]" />
              LinkedIn
              <ExternalLink
                size={10}
                className="opacity-50 sm:w-[11px] sm:h-[11px]"
              />
            </a>
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 border"
              style={{
                background: "hsl(330 70% 55% / 0.08)",
                borderColor: "hsl(330 70% 55% / 0.2)",
                color: "hsl(330 70% 65%)",
              }}
            >
              <Instagram size={12} className="sm:w-[14px] sm:h-[14px]" />
              Instagram
              <ExternalLink
                size={10}
                className="opacity-50 sm:w-[11px] sm:h-[11px]"
              />
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all text-base sm:text-lg cursor-pointer"
        >
          ×
        </button>
      </motion.div>
    </div>
  ),
);
MemberCard.displayName = "MemberCard";

// orbit path component (SVG circles with labels)
const OrbitPath = memo(
  ({
    radius,
    colorHsl,
    label,
    scaleFactor,
    centerX,
    centerY,
  }: {
    radius: number;
    colorHsl: string;
    label: string;
    scaleFactor: number;
    centerX: number;
    centerY: number;
  }) => {
    const r = radius * scaleFactor;
    return (
      <g transform={`translate(${centerX}, ${centerY})`}>
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="hsl(0 0% 100% / 0.06)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 6px hsl(0 0% 100% / 0.08))" }}
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="hsl(0 0% 100% / 0.24)"
          strokeWidth="1.1"
          strokeDasharray="7 7"
          style={{ animation: "ring-dash 10s linear infinite" }}
        />
        <text
          x="0"
          y={-r - 10}
          textAnchor="middle"
          fill={`hsl(${colorHsl} / 0.58)`}
          fontSize={Math.max(scaleFactor * 10, 8)}
          fontFamily="monospace"
          className="uppercase tracking-[0.15em] font-bold select-none"
        >
          {label}
        </text>
      </g>
    );
  },
);
OrbitPath.displayName = "OrbitPath";

const PLANET_KEYFRAME_CACHE = new Map<string, string>();

function getOrbitKeyframeName(
  id: string,
  radius: number,
  startAngle: number,
  reverse: boolean,
): string {
  const key = `${id}-${radius}-${startAngle}-${reverse}`;
  if (PLANET_KEYFRAME_CACHE.has(key)) return PLANET_KEYFRAME_CACHE.get(key)!;

  const safeId =
    id.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "") || "planet";
  const name = `orbit-${safeId}-${Math.round(radius)}-${Math.round(startAngle)}`;

  if (typeof window === "undefined") return name;

  const dir = reverse ? -1 : 1;
  const fromAngle = startAngle;
  const toAngle = startAngle + 360 * dir;
  const css = `
    @keyframes ${name} {
      from { transform: rotate(${fromAngle}deg) translateX(${radius}px) rotate(${-fromAngle}deg); }
      to   { transform: rotate(${toAngle}deg) translateX(${radius}px) rotate(${-toAngle}deg); }
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  PLANET_KEYFRAME_CACHE.set(key, name);
  return name;
}

interface PlanetProps {
  member: Member;
  orbitRadius: number;
  startAngle: number;
  speed: number;
  reverse: boolean;
  colorHsl: string;
  nodeSize: number;
  onOpenCard: (member: Member, colorHsl: string) => void;
}

const Planet = memo(
  ({
    member,
    orbitRadius,
    startAngle,
    speed,
    reverse,
    colorHsl,
    nodeSize,
    onOpenCard,
  }: PlanetProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const animName = useMemo(
      () =>
        getOrbitKeyframeName(
          `${member.initials}-${member.name}`,
          orbitRadius,
          startAngle,
          reverse,
        ),
      [member.initials, member.name, startAngle, orbitRadius, reverse],
    );

    return (
      <div
        className="absolute z-20"
        style={{
          left: "50%",
          top: "50%",
          width: nodeSize,
          height: nodeSize,
          marginLeft: -nodeSize / 2,
          marginTop: -nodeSize / 2,
          transformStyle: "preserve-3d",
          animationName: animName,
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenCard(member, colorHsl);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full h-full rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsl(${colorHsl} / 0.4), hsl(${colorHsl} / 0.1) 70%, hsl(${colorHsl} / 0.03))`,
            border: `1.5px solid hsl(${colorHsl} / ${isHovered ? 0.6 : 0.3})`,
            animation: "planet-glow 3s ease-in-out infinite",
            backdropFilter: "blur(8px)",
            transition:
              "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
            transform: isHovered ? "scale(1.2)" : "scale(1)",
            boxShadow: isHovered
              ? `0 0 30px hsl(${colorHsl} / 0.4), 0 0 60px hsl(${colorHsl} / 0.15)`
              : `0 0 12px hsl(${colorHsl} / 0.1)`,
          }}
          aria-label={`${member.name} — ${member.role}. Click to view details.`}
        >
          <span
            className="font-heading font-bold text-white/90 select-none"
            style={{ fontSize: Math.max(nodeSize * 0.36, 10) }}
          >
            {member.initials}
          </span>
        </button>

        {isHovered && (
          <div
            className="absolute left-1/2 top-full mt-2 whitespace-nowrap pointer-events-none z-50"
            style={{
              transform: "translateX(-50%)",
              animation: "tooltip-in 0.15s ease-out forwards",
            }}
          >
            <div
              className="px-3 py-1.5 rounded-lg text-center backdrop-blur-xl border border-white/10"
              style={{
                background: `linear-gradient(135deg, hsl(${colorHsl} / 0.15), hsl(0 0% 5% / 0.9))`,
                boxShadow: `0 4px 16px hsl(${colorHsl} / 0.15)`,
              }}
            >
              <p className="text-white font-heading font-semibold text-xs leading-tight">
                {member.name}
              </p>
              <p className="text-white/40 text-[10px] font-medium">
                {member.role}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
);
Planet.displayName = "Planet";

// sun node in the center for convenor
const SunNode = memo(
  ({
    convenors,
    size,
    onOpenList,
  }: {
    convenors: Member[];
    size: number;
    onOpenList: (colorHsl: string) => void;
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onOpenList("24 100% 55%");
      },
      [onOpenList],
    );

    return (
      <div
        className="absolute z-30"
        style={{
          width: size,
          height: size,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 2,
            height: size * 2,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, hsl(24 100% 55% / 0.1) 0%, transparent 70%)",
            animation: "sun-corona 4s ease-in-out infinite",
          }}
        />

        <button
          onClick={handleClick}
          className="relative w-full h-full rounded-full flex flex-col items-center justify-center cursor-pointer focus:outline-none"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, hsl(35 100% 70% / 0.35), hsl(24 100% 50% / 0.18) 60%, hsl(0 80% 45% / 0.08))",
            border: `2px solid hsl(24 100% 55% / ${isHovered ? 0.6 : 0.35})`,
            animation: "sun-pulse 3s ease-in-out infinite",
            backdropFilter: "blur(12px)",
            transition: "transform 0.25s ease, border-color 0.25s ease",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}
          aria-label="Convenors Directory"
        >
          {/* Silhouette Icon - Styled with explicit mobile-to-desktop tracking margins */}
          <Users
            size={Math.max(size * 0.26, 16)}
            className="text-white/90 mb-1 sm:mb-0.5 shrink-0"
          />

          {/* Desktop Only String - Pure text with absolutely no ellipsis restrictions */}
          <span
            className="hidden sm:block text-white font-heading font-black tracking-wider uppercase whitespace-nowrap"
            style={{ fontSize: Math.max(size * 0.12, 9) }}
          >
            CONVENORS
          </span>

          {/* Nodes text - Styled with separate typography layers to keep mobile crisp and spacious */}
          <span
            className="text-white/40 font-mono font-bold uppercase tracking-wide text-[7.5px] sm:font-medium sm:tracking-normal mt-0.5 sm:mt-0.5"
            style={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? undefined : Math.max(size * 0.09, 7) }}
          >
            {convenors.length} {convenors.length === 1 ? "NODE" : "NODES"}
          </span>
        </button>

        {isHovered && (
          <div
            className="absolute left-1/2 top-full mt-2 whitespace-nowrap pointer-events-none z-50"
            style={{
              transform: "translateX(-50%)",
              animation: "tooltip-in 0.15s ease-out forwards",
            }}
          >
            <div
              className="px-3 py-1.5 rounded-lg text-center backdrop-blur-xl border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, hsl(24 100% 55% / 0.15), hsl(0 0% 5% / 0.9))",
                boxShadow: "0 4px 16px hsl(24 100% 55% / 0.15)",
              }}
            >
              <p className="text-white font-heading font-semibold text-xs">
                Convenors Office
              </p>
              <p className="text-white/40 text-[10px]">Click to view details</p>
            </div>
          </div>
        )}
      </div>
    );
  },
);
SunNode.displayName = "SunNode";

// Background twinkly StarField implementation
const starPositions = Array.from({ length: 50 }, (_, i) => ({
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: (i % 3) + 1,
  delay: (i * 0.7) % 4,
  duration: 2 + (i % 3),
}));

const StarField = memo(() => (
  <div
    className="absolute inset-0 overflow-hidden pointer-events-none"
    aria-hidden="true"
  >
    {starPositions.map((star, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          left: star.left,
          top: star.top,
          width: star.size,
          height: star.size,
          opacity: 0.3,
          animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
        }}
      />
    ))}
  </div>
));
StarField.displayName = "StarField";

// Solar system view container configuration
interface SolarSystemProps {
  onOpenCard: (member: Member, colorHsl: string) => void;
  onOpenConvenorsList: (colorHsl: string) => void;
}

// properly destructuring parameters out of the props array context
const SolarSystem = ({ onOpenCard, onOpenConvenorsList }: SolarSystemProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(0.6);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  const outermostRadius = useMemo(
    () => Math.max(...orbits.map((o) => o.radius)),
    [],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const computeScale = () => {
      const w = el.clientWidth;
      const padding = 30;
      const availableRadius = w / 2 - padding;
      const factor = Math.min(availableRadius / outermostRadius, 1);
      const computedScale = Math.max(factor, 0.22);

      setScaleFactor(computedScale);
      setDimensions({
        width: w,
        height: Math.max(outermostRadius * computedScale * 2 + 80, 280),
      });
    };

    computeScale();
    const ro = new ResizeObserver(computeScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [outermostRadius]);

  const sunSize = Math.max(Math.round(90 * scaleFactor), 40);

  return (
    <div
      ref={containerRef}
      className="relative w-full mx-auto select-none"
      style={{
        height: dimensions.height,
        maxWidth: 1000,
      }}
    >
      <StarField />

      {/* Static SVG paths overlaying elements perfectly */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        {orbits.map((orbit) => (
          <OrbitPath
            key={orbit.label}
            radius={orbit.radius}
            colorHsl={orbit.colorHsl}
            label={orbit.label}
            scaleFactor={scaleFactor}
            centerX={dimensions.width / 2}
            centerY={dimensions.height / 2}
          />
        ))}
      </svg>

      {/* Planet renders and nodes mapping context */}
      {orbits.map((orbit, orbitIndex) => {
        const scaledRadius = orbit.radius * scaleFactor;
        const baseSize =
          orbit.radius <= 180 ? 52 : orbit.radius <= 300 ? 44 : 38;
        const nodeSize = Math.max(
          Math.round(baseSize * Math.min(scaleFactor, 1)),
          26,
        );
        const angleStep = 360 / orbit.members.length;
        const orbitPhase = (360 / orbits.length) * orbitIndex;

        return orbit.members.map((member, i) => (
          <Planet
            key={`${orbit.label}-${member.name}-${i}`}
            member={member}
            orbitRadius={scaledRadius}
            startAngle={(angleStep * i + orbitPhase) % 360}
            speed={orbit.speed}
            reverse={orbit.reverse}
            colorHsl={orbit.colorHsl}
            nodeSize={nodeSize}
            onOpenCard={onOpenCard}
          />
        ));
      })}

      <SunNode
        convenors={convenorsList}
        size={sunSize}
        onOpenList={onOpenConvenorsList}
      />
    </div>
  );
};

// Unified Core Team Component System View
const Team = () => {
  const [activeCard, setActiveCard] = useState<{
    member: Member;
    colorHsl: string;
  } | null>(null);

  const [isConvenorListOpen, setIsConvenorListOpen] = useState(false);
  const [convenorColor, setConvenorColor] = useState("24 100% 55%");

  const handleOpenCard = useCallback((member: Member, colorHsl: string) => {
    setActiveCard({ member, colorHsl });
  }, []);

  const handleCloseCard = useCallback(() => {
    setActiveCard(null);
  }, []);

  const handleOpenConvenorsList = useCallback((colorHsl: string) => {
    setConvenorColor(colorHsl);
    setIsConvenorListOpen(true);
  }, []);

  const handleCloseConvenorsList = useCallback(() => {
    setIsConvenorListOpen(false);
  }, []);

  const handleSelectConvenor = useCallback((member: Member) => {
    setIsConvenorListOpen(false);
    setActiveCard({ member, colorHsl: convenorColor });
  }, [convenorColor]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background selection:bg-primary/30">
        <ParticleField />
        <ScrollProgress />
        <Navbar />

        {/* Hero Section */}
        <section className="relative flex items-center justify-center pt-28 pb-16 sm:pt-32 sm:pb-24 md:pt-40 md:pb-36">
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-4 sm:mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
                <Users size={14} className="text-primary" />
                <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-primary/90 font-semibold">
                  Meet The Minds
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-wider uppercase mb-0">
                <span className="text-white/40 font-light mr-2 sm:mr-4 select-none">
                  OUR
                </span>
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  TEAM
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-3 sm:mt-5 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground font-medium px-2"
              >
                A dedicated group of visionaries, planners, and creators shaping IGNITIA '26
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-2 text-[9px] sm:text-[10px] text-white/15 font-mono tracking-widest uppercase"
              >
                Hover or tap a planet to explore
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Orbital System */}
        <section className="relative z-10 pb-12 sm:pb-20 md:pb-32">
          <div className="w-full px-1 sm:px-4">
            <SolarSystem 
              onOpenCard={handleOpenCard} 
              onOpenConvenorsList={handleOpenConvenorsList}
            />
          </div>
        </section>

        {/* 3D Carousel system */}
        <section className="relative z-10 pb-24 md:pb-36 overflow-hidden">
          <ThreeDCarousel
            sections={teamSections}
            convenors={convenorsList} 
            onOpenMemberCard={handleOpenCard}
            orbitColors={_orbitColors}
          />
        </section>

        {/* Multi-Window Controller Layer */}
        <AnimatePresence mode="wait">
          {isConvenorListOpen && (
            <ConvenorListCard
              convenors={convenorsList}
              colorHsl={convenorColor}
              onSelectMember={handleSelectConvenor}
              onClose={handleCloseConvenorsList}
            />
          )}

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