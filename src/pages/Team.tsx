import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Linkedin, Instagram } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";
import { EnergySymbol } from "@/components/FloatingTechElements";

// ── RA.One corner bracket (top-left)
const CornerBracket = ({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    style={flip ? { transform: "scale(-1,-1)" } : undefined}
  >
    <path
      d="M2 2 L18 2 L18 6 L6 6 L6 18 L2 18 Z"
      fill="hsl(0 95% 60% / 0.4)"
      stroke="hsl(0 95% 60%)"
      strokeWidth="0.8"
    />
  </svg>
);

const teamSections = [
  {
    title: "Convenor",
    role_color: "from-red-500 to-orange-500",
    members: [
      {
        name: "Priyanshu",
        role: "Convenor",
        initials: "P",
        linkedin: "#",
        instagram: "#",
        class: "LEGENDARY",
      },
    ],
  },
  {
    title: "Event Heads",
    role_color: "from-red-600 to-red-400",
    members: [
      {
        name: "Aranya Rath",
        role: "Event Head",
        initials: "AR",
        linkedin: "#",
        instagram: "#",
        class: "EPIC",
      },
      {
        name: "Soumalika Chakraborty",
        role: "Event Head",
        initials: "SC",
        linkedin: "#",
        instagram: "#",
        class: "EPIC",
      },
    ],
  },
  {
    title: "Core Team",
    role_color: "from-orange-600 to-red-500",
    members: [
      {
        name: "Anamika",
        role: "Core Team",
        initials: "A",
        linkedin: "#",
        instagram: "#",
        class: "RARE",
      },
      {
        name: "Subhamita",
        role: "Core Team",
        initials: "S",
        linkedin: "#",
        instagram: "#",
        class: "RARE",
      },
      {
        name: "Pratistha",
        role: "Core Team",
        initials: "P",
        linkedin: "#",
        instagram: "#",
        class: "RARE",
      },
      {
        name: "Salmoli",
        role: "Core Team",
        initials: "S",
        linkedin: "#",
        instagram: "#",
        class: "RARE",
      },
      {
        name: "Tanisha",
        role: "Core Team",
        initials: "T",
        linkedin: "#",
        instagram: "#",
        class: "RARE",
      },
    ],
  },
  {
    title: "Domain Lead",
    role_color: "from-red-700 to-red-500",
    members: [
      {
        name: "To Be Added",
        role: "Domain Lead",
        initials: "?",
        linkedin: "#",
        instagram: "#",
        class: "TBA",
      },
    ],
  },
  {
    title: "Coordinator",
    role_color: "from-red-800 to-orange-600",
    members: [
      {
        name: "To Be Added",
        role: "Coordinator",
        initials: "?",
        linkedin: "#",
        instagram: "#",
        class: "TBA",
      },
    ],
  },
];

type Member = {
  name: string;
  role: string;
  initials: string;
  linkedin: string;
  instagram: string;
  class: string;
};

const classColors: Record<string, string> = {
  LEGENDARY: "text-yellow-400 bg-yellow-900/30 border-yellow-700/50",
  EPIC: "text-red-300 bg-red-900/30 border-red-700/50",
  RARE: "text-orange-300 bg-orange-900/30 border-orange-700/50",
  TBA: "text-gray-400 bg-gray-900/30 border-gray-700/50",
};

const MemberCard = ({
  member,
  index,
}: {
  member: Member;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [0.85, 1]), {
    stiffness: 120,
    damping: 20,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      whileHover={{ y: -10 }}
      className="char-select-card group relative cursor-pointer"
    >
      {/* Corner brackets – visible always on hover */}
      <CornerBracket className="absolute top-0 left-0 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
      <CornerBracket
        flip
        className="absolute bottom-0 right-0 opacity-40 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Class badge top-right */}
      <span
        className={`absolute top-2 right-2 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${classColors[member.class] || classColors.RARE}`}
      >
        {member.class}
      </span>

      {/* Hover selection overlay */}
      <div className="selection-indicator rounded-xl" />

      <div className="relative z-10 p-5 text-center">
        {/* Avatar with arc-reactor glow */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-900/60 to-black flex items-center justify-center border-2 border-red-800/40 group-hover:border-red-500/80 transition-all duration-300">
            <span className="font-heading text-xl font-bold text-red-300">
              {member.initials}
            </span>
          </div>
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full border border-red-500/0 group-hover:border-red-500/60 transition-all duration-500 group-hover:shadow-[0_0_20px_hsl(0_95%_50%/0.4)]" />
          {/* Small energy symbol at bottom-right of avatar */}
          <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <EnergySymbol size={18} />
          </div>
        </div>

        <h3 className="font-heading text-base font-semibold text-foreground">
          {member.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 mb-4">{member.role}</p>

        {/* Social links */}
        <div className="flex items-center justify-center gap-3">
          <motion.a
            href={member.linkedin}
            whileHover={{ scale: 1.2 }}
            className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400 hover:border-red-500 hover:text-red-300 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <Linkedin size={14} />
          </motion.a>
          <motion.a
            href={member.instagram}
            whileHover={{ scale: 1.2 }}
            className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400 hover:border-red-500 hover:text-red-300 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <Instagram size={14} />
          </motion.a>
        </div>
      </div>

      {/* Bottom bar — like a health/power bar in character select */}
      <div className="relative z-10 mx-4 mb-3 h-0.5 rounded-full bg-red-950/60 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
          initial={{ width: "0%" }}
          whileInView={{ width: member.class === "LEGENDARY" ? "100%" : member.class === "EPIC" ? "80%" : member.class === "RARE" ? "60%" : "30%" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

const Team = () => (
  <PageTransition>
    <div className="min-h-screen bg-background scanline-overlay">
      <ParticleField />
      <AnimatedBlobs />
      <ScrollProgress />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-16">
        {/* Viewport-centered glow behind heading */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              "radial-gradient(circle at 50vw 50vh, hsl(0 95% 70% / 0.38) 0%, hsl(0 95% 60% / 0.24) 18%, hsl(0 80% 40% / 0.12) 36%, transparent 58%)",
            filter: "blur(70px)",
            zIndex: 0,
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <EnergySymbol size={28} />
            <span className="text-sm text-red-400 uppercase tracking-widest font-semibold">
              The Squad
            </span>
            <EnergySymbol size={28} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="font-heading text-5xl md:text-7xl font-bold mb-4"
          >
            Our <span className="gradient-text">Team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            The people behind IGNITIA'26 — organizers, creators, and dreamers.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto space-y-20">
          {teamSections.map((section) => (
            <div key={section.title}>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-8 flex items-center gap-4"
              >
                <div>
                  <p className="text-sm text-primary uppercase tracking-widest mb-1">
                    {section.title}
                  </p>
                  <div className={`h-[2px] w-16 bg-gradient-to-r ${section.role_color}`} />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-red-800/20 to-transparent" />
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {section.members.map((member, i) => (
                  <MemberCard key={member.name + i} member={member} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  </PageTransition>
);

export default Team;
