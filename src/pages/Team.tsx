import { useState, useCallback, useRef, useEffect, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Users, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import ScrollProgress from "@/components/ScrollProgress";

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

const sunMember: Member = {
  name: "Priyanshu",
  role: "Convenor",
  initials: "P",
  linkedin: "#",
  instagram: "#",
  department: "Leadership",
  bio: "Visionary leader driving IGNITIA '26 towards innovation and excellence.",
  expertise: ["Event Strategy", "Team Management", "Vision Setting"]
};

// Team sections used for orbital views (4 orbits; Convenor is the sun)
const teamSections = [
  {
    title: "Event Heads",
    role_color: "from-orange-400 to-pink-500",
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
        expertise: ["Stakeholder Management", "Resource Planning", "Timeline Management"],
      },
    ],
  },
  {
    title: "Core Team",
    role_color: "from-rose-400 to-red-500",
    members: [
      {
        name: "Anamika",
        role: "Core Team",
        initials: "A",
        linkedin: "#",
        instagram: "#",
        department: "Core Operations",
        bio: "Driving core operational excellence and team coordination.",
        expertise: ["Coordination", "Process Management", "Leadership"],
      },
      {
        name: "Subhamita",
        role: "Core Team",
        initials: "S",
        linkedin: "#",
        instagram: "#",
        department: "Core Operations",
        bio: "Ensuring seamless communication and task execution.",
        expertise: ["Communication", "Task Management", "Documentation"],
      },
      {
        name: "Pratistha",
        role: "Core Team",
        initials: "P",
        linkedin: "#",
        instagram: "#",
        department: "Core Operations",
        bio: "Strategic planning and process optimization.",
        expertise: ["Strategy", "Process Optimization", "Planning"],
      },
      {
        name: "Salmoli",
        role: "Core Team",
        initials: "S",
        linkedin: "#",
        instagram: "#",
        department: "Core Operations",
        bio: "Maintaining quality standards and operational excellence.",
        expertise: ["Quality Assurance", "Analysis", "Coordination"],
      },
      {
        name: "Tanisha",
        role: "Core Team",
        initials: "T",
        linkedin: "#",
        instagram: "#",
        department: "Core Operations",
        bio: "Converting ideas into actionable plans and execution.",
        expertise: ["Execution", "Implementation", "Timeline Management"],
      },
    ],
  },
  {
    title: "Domain Leads",
    role_color: "from-violet-400 to-indigo-500",
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
    role_color: "from-sky-400 to-blue-500",
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

// derive orbits from the current `teamSections` so every member becomes a planet
const _orbitColors = ["24 90% 55%", "12 85% 52%", "340 75% 58%", "270 65% 60%", "200 70% 55%", "160 70% 55%"];
const orbits: OrbitData[] = teamSections.map((sec, idx) => ({
  label: sec.title,
  badge: sec.title,
  radius: 120 + idx * 90,
  speed: 30 + idx * 18,
  reverse: idx % 2 === 1,
  colorHsl: _orbitColors[idx] || "200 70% 55%",
  // preserve full member object so the detailed card receives bio/department/expertise
  members: sec.members.map((m) => ({ ...m } as Member)),
}));

// Modal card for member details (opens on planet click)

const MemberCard = memo(({ member, colorHsl, onClose }: { member: Member; colorHsl: string; onClose: () => void }) => (
  <div
    className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    onClick={onClose}
  >
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

    {/* Card */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative w-full max-w-md rounded-3xl border border-white/10 overflow-hidden"
      style={{
        background: `linear-gradient(160deg, hsl(${colorHsl} / 0.08) 0%, hsl(0 0% 5% / 0.97) 40%, hsl(0 0% 4% / 0.99) 100%)`,
        boxShadow: `0 24px 80px hsl(${colorHsl} / 0.15), 0 0 0 1px hsl(${colorHsl} / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.05)`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top gradient accent */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, hsl(${colorHsl} / 0.6), hsl(${colorHsl} / 0.2), hsl(${colorHsl} / 0.6))` }}
      />

      <div className="p-8 flex flex-col">
        {/* Avatar & Header */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center mb-4"
            style={{
              background: `radial-gradient(circle at 35% 30%, hsl(${colorHsl} / 0.3), hsl(${colorHsl} / 0.08) 70%)`,
              border: `2px solid hsl(${colorHsl} / 0.3)`,
              boxShadow: `0 0 40px hsl(${colorHsl} / 0.15), inset 0 0 20px hsl(${colorHsl} / 0.05)`,
            }}
          >
            <span className="font-heading font-black text-4xl text-white/90">{member.initials}</span>
          </div>

          {/* Name & Role */}
          <h3 className="font-heading font-bold text-2xl text-white mb-1 text-center">{member.name}</h3>
          <p className="text-white/40 text-sm font-medium uppercase tracking-wider text-center mb-2">{member.role}</p>
          {member.department && (
            <p 
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-center"
              style={{
                background: `hsl(${colorHsl} / 0.15)`,
                color: `hsl(${colorHsl})`
              }}
            >
              {member.department}
            </p>
          )}
        </div>

        {/* Divider */}
        <div
          className="w-12 h-px mx-auto mb-6"
          style={{ background: `linear-gradient(90deg, transparent, hsl(${colorHsl} / 0.3), transparent)` }}
        />

        {/* Bio */}
        {member.bio && (
          <div className="mb-6">
            <p className="text-white/70 text-center text-sm leading-relaxed">
              {member.bio}
            </p>
          </div>
        )}

        {/* Expertise Tags */}
        {member.expertise && member.expertise.length > 0 && (
          <div className="mb-6">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 text-center">Expertise</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {member.expertise.map((exp, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                  style={{
                    background: `hsl(${colorHsl} / 0.08)`,
                    borderColor: `hsl(${colorHsl} / 0.2)`,
                    color: `hsl(${colorHsl})`
                  }}
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div
          className="w-12 h-px mx-auto mb-6"
          style={{ background: `linear-gradient(90deg, transparent, hsl(${colorHsl} / 0.3), transparent)` }}
        />

        {/* Socials */}
        <div className="flex items-center gap-3 justify-center flex-wrap">
          <a
            href={member.linkedin}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border"
            style={{
              background: "hsl(210 80% 55% / 0.08)",
              borderColor: "hsl(210 80% 55% / 0.2)",
              color: "hsl(210 80% 65%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Linkedin size={14} />
            LinkedIn
            <ExternalLink size={11} className="opacity-50" />
          </a>
          <a
            href={member.instagram}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border"
            style={{
              background: "hsl(330 70% 55% / 0.08)",
              borderColor: "hsl(330 70% 55% / 0.2)",
              color: "hsl(330 70% 65%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Instagram size={14} />
            Instagram
            <ExternalLink size={11} className="opacity-50" />
          </a>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all text-lg"
      >
        ×
      </button>
    </motion.div>
  </div>
));
MemberCard.displayName = "MemberCard";

// orbit path component (SVG circles with labels)

const OrbitPath = memo(({ radius, colorHsl, label, scaleFactor }: {
  radius: number;
  colorHsl: string;
  label: string;
  scaleFactor: number;
}) => {
  const r = radius * scaleFactor;
  return (
    <>
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
      {/* Ring path */}
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
      {/* Label at top of ring */}
      <text
        x="0"
        y={-r - 10}
        textAnchor="middle"
        fill={`hsl(${colorHsl} / 0.58)`}
        fontSize={Math.max(scaleFactor * 10, 7)}
        fontFamily="monospace"
        style={{ textTransform: "uppercase", letterSpacing: "0.15em" }}
      >
        {label}
      </text>
    </>
  );
});
OrbitPath.displayName = "OrbitPath";

const PLANET_KEYFRAME_CACHE = new Map<string, string>();

function getOrbitKeyframeName(id: string, radius: number, startAngle: number, reverse: boolean): string {
  const key = `${id}-${radius}-${startAngle}-${reverse}`;
  if (PLANET_KEYFRAME_CACHE.has(key)) return PLANET_KEYFRAME_CACHE.get(key)!;

  const safeId = id.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "") || "planet";
  const name = `orbit-${safeId}-${Math.round(radius)}-${Math.round(startAngle)}`;

  // Check if stylesheet already has this
  const existingSheets = document.styleSheets;
  for (let i = 0; i < existingSheets.length; i++) {
    try {
      const rules = existingSheets[i].cssRules;
      for (let j = 0; j < rules.length; j++) {
        if (rules[j] instanceof CSSKeyframesRule && (rules[j] as CSSKeyframesRule).name === name) {
          PLANET_KEYFRAME_CACHE.set(key, name);
          return name;
        }
      }
    } catch {
      // Cross-origin stylesheet, skip
    }
  }

  const dir = reverse ? -1 : 1;
  const fromAngle = startAngle;
  const toAngle = startAngle + (360 * dir);
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

const Planet = memo(({
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
  const ref = useRef<HTMLDivElement>(null);

  // Generate a unique keyframe for this orbit path
  const animName = useMemo(
    () => getOrbitKeyframeName(`${member.initials}-${member.name}`, orbitRadius, startAngle, reverse),
    [member.initials, member.name, startAngle, orbitRadius, reverse]
  );

  return (
    <div
      ref={ref}
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
        onClick={(e) => { e.stopPropagation(); onOpenCard(member, colorHsl); }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-full rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, hsl(${colorHsl} / 0.4), hsl(${colorHsl} / 0.1) 70%, hsl(${colorHsl} / 0.03))`,
          border: `1.5px solid hsl(${colorHsl} / ${isHovered ? 0.6 : 0.3})`,
          animation: "planet-glow 3s ease-in-out infinite",
          backdropFilter: "blur(8px)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
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

      {/* Hover label (name below planet) */}
      {isHovered && (
        <div
          className="absolute left-1/2 top-full mt-2 whitespace-nowrap pointer-events-none"
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
            <p className="text-white font-heading font-semibold text-xs leading-tight">{member.name}</p>
            <p className="text-white/40 text-[10px] font-medium">{member.role}</p>
          </div>
        </div>
      )}
    </div>
  );
});
Planet.displayName = "Planet";

// sun node in the center (convenor)

const SunNode = memo(({ member, size, onOpenCard }: {
  member: Member;
  size: number;
  onOpenCard: (member: Member, colorHsl: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenCard(member, "24 100% 55%");
  }, [onOpenCard, member]);

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
      {/* Corona glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 2,
          height: size * 2,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, hsl(24 100% 55% / 0.1) 0%, transparent 70%)",
          animation: "sun-corona 4s ease-in-out infinite",
        }}
      />

      {/* Sun body */}
      <button
        onClick={handleClick}
        className="relative w-full h-full rounded-full flex flex-col items-center justify-center cursor-pointer focus:outline-none"
        style={{
          background: "radial-gradient(circle at 35% 30%, hsl(35 100% 70% / 0.35), hsl(24 100% 50% / 0.18) 60%, hsl(0 80% 45% / 0.08))",
          border: `2px solid hsl(24 100% 55% / ${isHovered ? 0.6 : 0.35})`,
          animation: "sun-pulse 3s ease-in-out infinite",
          backdropFilter: "blur(12px)",
          transition: "transform 0.25s ease, border-color 0.25s ease",
          transform: isHovered ? "scale(1.08)" : "scale(1)",
        }}
        aria-label={`${member.name} — ${member.role}. Click to view details.`}
      >
        <span
          className="font-heading font-black text-white/90 select-none"
          style={{ fontSize: Math.max(size * 0.32, 16) }}
        >
          {member.initials}
        </span>
        <span
          className="text-white/40 font-medium uppercase tracking-widest mt-0.5"
          style={{ fontSize: Math.max(size * 0.1, 7) }}
        >
          {member.role}
        </span>
      </button>

      {/* Hover label */}
      {isHovered && (
        <div
          className="absolute left-1/2 top-full mt-2 whitespace-nowrap pointer-events-none"
          style={{
            transform: "translateX(-50%)",
            animation: "tooltip-in 0.15s ease-out forwards",
          }}
        >
          <div
            className="px-3 py-1.5 rounded-lg text-center backdrop-blur-xl border border-white/10"
            style={{
              background: "linear-gradient(135deg, hsl(24 100% 55% / 0.15), hsl(0 0% 5% / 0.9))",
              boxShadow: "0 4px 16px hsl(24 100% 55% / 0.15)",
            }}
          >
            <p className="text-white font-heading font-semibold text-xs">{member.name}</p>
            <p className="text-white/40 text-[10px]">Click to view</p>
          </div>
        </div>
      )}
    </div>
  );
});
SunNode.displayName = "SunNode";

// stars decorating the background

const starPositions = Array.from({ length: 50 }, (_, i) => ({
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: (i % 3) + 1,
  delay: (i * 0.7) % 4,
  duration: 2 + (i % 3),
}));

const StarField = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
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

// solar system component for all orbital animations and interactions

const SolarSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(0.6);
  const [activeCard, setActiveCard] = useState<{ member: Member; colorHsl: string } | null>(null);

  const outermostRadius = useMemo(() => Math.max(...orbits.map((o) => o.radius)), []);

  const handleOpenCard = useCallback((member: Member, colorHsl: string) => {
    setActiveCard({ member, colorHsl });
  }, []);

  const handleCloseCard = useCallback(() => {
    setActiveCard(null);
  }, []);

  // Responsive scaling via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const computeScale = () => {
      const w = el.clientWidth;
      const padding = 30;
      const availableRadius = (w / 2) - padding;
      const factor = Math.min(availableRadius / outermostRadius, 1);
      setScaleFactor(Math.max(factor, 0.22));
    };

    computeScale();

    const ro = new ResizeObserver(computeScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [outermostRadius]);

  const sunSize = Math.max(Math.round(90 * scaleFactor), 40);
  const systemHeight = Math.max((outermostRadius * scaleFactor * 2) + 80, 280);

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full mx-auto"
        style={{
          height: systemHeight,
          maxWidth: 1000,
        }}
        onClick={handleCloseCard}
      >
        <StarField />

        {/* SVG orbit paths (centered) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: "visible" }}
        >
          <g transform={`translate(${containerRef.current?.clientWidth ? containerRef.current.clientWidth / 2 : 500}, ${systemHeight / 2})`}>
            {orbits.map((orbit) => (
              <OrbitPath
                key={orbit.label}
                radius={orbit.radius}
                colorHsl={orbit.colorHsl}
                label={orbit.label}
                scaleFactor={scaleFactor}
              />
            ))}
          </g>
        </svg>

        {/* Planet nodes — independently positioned & animated */}
        {orbits.map((orbit, orbitIndex) => {
          const scaledRadius = orbit.radius * scaleFactor;
          const baseSize = orbit.radius <= 180 ? 52 : orbit.radius <= 300 ? 44 : 38;
          const nodeSize = Math.max(Math.round(baseSize * Math.min(scaleFactor, 1)), 26);
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
              onOpenCard={handleOpenCard}
            />
          ));
        })}

        {/* Sun */}
        <SunNode
          member={sunMember}
          size={sunSize}
          onOpenCard={handleOpenCard}
        />
      </div>

      {/* Member detail card (modal) */}
      {activeCard && (
        <MemberCard
          member={activeCard.member}
          colorHsl={activeCard.colorHsl}
          onClose={handleCloseCard}
        />
      )}
    </>
  );
};

// team page combining hero section and solar system component

const Team = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background selection:bg-primary/30">
        <ParticleField />
        <ScrollProgress />
        <Navbar />

        {/* Hero Section */}
        <section className="relative flex items-center justify-center pt-28 pb-6 sm:pt-32 sm:pb-10 md:pt-40 md:pb-14">
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
                <span className="text-white/40 font-light mr-2 sm:mr-4 select-none">OUR</span>
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
                A dedicated group of visionaries, planners, and creators shaping IGNITIA '26.
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
            <SolarSystem />
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Team;
