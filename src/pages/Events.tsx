import { useState, useRef } from "react";
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
import { TerminalSubheading } from "@/components/TerminalSubheading";

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

const events = [
  {
    id: "hackathon",
    icon: Zap,
    title: "Hackathon",
    category: "TECHNICAL",
    prize: "₹35K",
    teamSize: "4-6",
    duration: "Hybrid",
    day: "01",
    entryFee: "₹100",
    theme: "orange",
    isWide: true,
    arrowTop: true,
    isTopEvent: true,
    watermark: "01",
    description: "Unleash your coding potential to crack real-world tracks collaboratively.",
    overview: "IGNYSIS is a hybrid hackathon starting with an online 720-hour collaborative build phase and culminating in an offline pitching finale before a jury at IEM Newtown campus.",
    rules: [
      "Teams must consist of 4 to 6 members (inter-college and cross-branch allowed)",
      "Hybrid format: Round 1 is online, Round 2 is offline at IEM Newtown campus",
      "Only the team leader submits the final 5-slide PPT + video solution",
      "Up to 30% of code structure/logic may be prepared in advance"
    ],
    criteria: [
      "Solution Originality & Plagiarism check",
      "Unique Selling Proposition (USP) & Viability",
      "Technical Execution & Logic (up to 30% pre-coded)",
      "Presentation & Q&A Quality (7 mins pitch, 3 mins Q&A)"
    ],
  },
  {
    id: "efootball",
    icon: Gamepad2,
    title: "eFootball Tournament",
    category: "GAMING",
    prize: "₹15K",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "Online",
    day: "Online",
    entryFee: "₹100",
    theme: "purple",
    watermark: "02",
    description: "One Match. One Chance. One Champion. Online single-elimination mobile eFootball tournament.",
    overview: "A fully online, single-elimination mobile eFootball tournament open to 32 participants. Survive each round or go home.",
    rules: [
      "Platform: Mobile (latest eFootball version required)",
      "Single-elimination knockout format for 32 participants",
      "Matches must be screen recorded (Player ID check mandatory)",
      "Winners must submit screenshot proof immediately after the match"
    ],
    criteria: [
      "Top 3 secure cash prizes",
      "All participants receive e-certificates",
      "Strict compliance with fair play (Smart Assist OFF)"
    ],
  },
  {
    id: "bgmi",
    icon: Gamepad2,
    title: "BGMI Tournament",
    category: "GAMING",
    prize: "₹20K",
    teamSize: "Squad (4 Players)",
    teamSizeLabel: "FORMAT",
    duration: "Hybrid",
    day: "02",
    entryFee: "₹100",
    theme: "pink",
    watermark: "03",
    description: "Ultimate BGMI squad tournament. Hybrid format with online qualifiers and offline grand final.",
    overview: "Lock, load, and own the zone. The ultimate BGMI squad tournament at Ignitia '26 — hybrid format with online qualifiers and an offline grand final. Only the strongest survive.",
    rules: [
      "TPP Squad format (Android or iOS; iPads not allowed)",
      "Strictly no GFx tools, controllers, or third-party apps allowed",
      "Emergency Pickup item is strictly prohibited",
      "Qualifiers on 29-30 July (online), Grand Finals on 2 August (offline)"
    ],
    criteria: [
      "BGIS 2026 Points System (10 pts for 1st, 6 for 2nd, etc.)",
      "1 Point per finish/kill",
      "Fair Play compliance (triggers/emulators banned)"
    ],
  },
  {
    id: "blind-coding",
    icon: Code,
    title: "Blind Coding",
    category: "TECHNICAL",
    prize: "₹15K",
    teamSize: "x1",
    teamSizeLabel: "SOLO",
    duration: "Day 2",
    day: "02",
    entryFee: "₹100",
    theme: "teal",
    watermark: "04",
    description: "Code without screen visibility. Pure instinct.",
    overview: "Offline solo competition where participants write code without being able to see their screen. Open to students of any branch from any registered college.",
    rules: [
      "Solo participation — write code without viewing your screen",
      "Allowed programming languages: Python, Java, or C",
      "Once time ends, no further typing or editing is permitted",
      "Strictly no internet, AI tools, or external assistance"
    ],
    criteria: [
      "Amount of correct, functional code completed within the time limit",
      "Number of errors in the submitted code"
    ],
  },
  {
    id: "guess-who",
    icon: HelpCircle,
    title: "Guess Who",
    category: "NON-TECH",
    prize: "₹10K",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "15-20 Mins",
    day: "02",
    entryFee: "₹100",
    theme: "yellow",
    watermark: "05",
    description: "A fast-paced, high-energy Bollywood celebrity guessing challenge.",
    overview: "A fast-paced, high-energy Bollywood celebrity guessing challenge where your eyes do the talking. Zoomed-in visuals flash on screen — from a pair of eyes to an iconic smile to a signature accessory — and you have seconds to name the star before the room does.",
    rules: [
      "No use of phones or external devices to look up answers",
      "Only respond when signalled by the host",
      "Wrong answers do not penalise, but shouting out of turn skips the point",
      "Walk-in participation — no prior team registration needed"
    ],
    criteria: [
      "Speed and accuracy in identifying the celebrity",
      "Highest accumulated score at the end",
      "Tiebreaker rounds in case of level scores"
    ],
  },
  {
    id: "quizophonia",
    icon: Brain,
    title: "Quizophonia",
    category: "TECHNICAL",
    prize: "₹15K",
    teamSize: "1-2",
    teamSizeLabel: "TEAM / SOLO",
    duration: "1 Day",
    day: "01",
    entryFee: "₹100",
    theme: "blue",
    isWide: true,
    leftPoolLayout: true,
    watermark: "06",
    description: "Test your knowledge across tech, science, and pop culture.",
    overview: "A multi-domain quiz spanning 9 creative and technical categories. Open to cross-institute teams and solo participants.",
    rules: [
      "No electronic devices during the quiz — violation = instant disqualification",
      "Quiz Master's decision is final on all matters",
      "Campus code of conduct applies — no smoking/alcohol/prohibited items",
      "Lost property to be deposited at the Ignitia Control Room"
    ],
    criteria: [
      "Accuracy in trivia questions across the 9 domains",
      "Speed and points scored in buzzer/buzzer-free rounds"
    ],
  },
  {
    id: "poster-design",
    icon: Palette,
    title: "Poster Design",
    category: "NON-TECH",
    prize: "₹10K",
    teamSize: "Individual",
    teamSizeLabel: "FORMAT",
    duration: "50 Mins",
    day: "01",
    entryFee: "₹100",
    theme: "pink",
    watermark: "07",
    description: "Draw a Bollywood celebrity chit and design a poster inspired by their aura and signature presence.",
    overview: "Design the icon. Capture the aura. Participants will randomly draw a chit featuring a Bollywood actor or actress and create a poster inspired by their aura and signature presence.",
    rules: [
      "Random chit draw determines your Bollywood celebrity subject",
      "No chit exchanges or pre-made designs allowed",
      "Time limit: 50 minutes to complete and submit",
      "Bring your own design device (laptop, iPad, or tablet)"
    ],
    criteria: [
      "Creativity & representation of the celebrity's aura",
      "Visual aesthetics & composition quality",
      "Overall presentation impact within 50 minutes"
    ],
  },
] as const;

type EventType = typeof events[number];

const InteractiveCardWrapper = ({
  children,
  onClick,
  theme,
  isWide,
}: {
  children: React.ReactNode;
  onClick: () => void;
  theme: typeof themes[keyof typeof themes];
  isWide?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse coordinates (normalized from -0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for buttery smooth physics-based 3D tilting
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { damping: 20, stiffness: 120 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { damping: 20, stiffness: 120 });

  // Custom states for hover coordinate gradients
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates around center (0,0)
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);

    setGlowPos({ x: mouseX, y: mouseY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset tilt on leave
    x.set(0);
    y.set(0);
  };

  // Convert theme text styles to matching spotlight transparent RGBA colors
  const getGlowColor = () => {
    if (theme.iconText.includes("orange")) return "rgba(249, 115, 22, 0.12)";
    if (theme.iconText.includes("purple")) return "rgba(168, 85, 247, 0.12)";
    if (theme.iconText.includes("teal")) return "rgba(20, 184, 166, 0.12)";
    if (theme.iconText.includes("amber") || theme.iconText.includes("yellow")) return "rgba(245, 158, 11, 0.12)";
    if (theme.iconText.includes("pink")) return "rgba(236, 72, 153, 0.12)";
    if (theme.iconText.includes("sky") || theme.iconText.includes("blue")) return "rgba(14, 165, 233, 0.12)";
    return "rgba(255, 255, 255, 0.08)";
  };

  const getBorderGlowColor = () => {
    if (theme.iconText.includes("orange")) return "rgba(249, 115, 22, 0.35)";
    if (theme.iconText.includes("purple")) return "rgba(168, 85, 247, 0.35)";
    if (theme.iconText.includes("teal")) return "rgba(20, 184, 166, 0.35)";
    if (theme.iconText.includes("amber") || theme.iconText.includes("yellow")) return "rgba(245, 158, 11, 0.35)";
    if (theme.iconText.includes("pink")) return "rgba(236, 72, 153, 0.35)";
    if (theme.iconText.includes("sky") || theme.iconText.includes("blue")) return "rgba(14, 165, 233, 0.35)";
    return "rgba(255, 255, 255, 0.2)";
  };

  const getShadowStyle = () => {
    if (!isHovered) return {};
    if (theme.iconText.includes("orange")) return { boxShadow: "0 0 30px rgba(249, 115, 22, 0.18)" };
    if (theme.iconText.includes("purple")) return { boxShadow: "0 0 30px rgba(168, 85, 247, 0.18)" };
    if (theme.iconText.includes("teal")) return { boxShadow: "0 0 30px rgba(20, 184, 166, 0.18)" };
    if (theme.iconText.includes("amber") || theme.iconText.includes("yellow")) return { boxShadow: "0 0 30px rgba(245, 158, 11, 0.18)" };
    if (theme.iconText.includes("pink")) return { boxShadow: "0 0 30px rgba(236, 72, 153, 0.18)" };
    if (theme.iconText.includes("sky") || theme.iconText.includes("blue")) return { boxShadow: "0 0 30px rgba(14, 165, 233, 0.18)" };
    return {};
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...getShadowStyle(),
      }}
      className={`relative group overflow-hidden rounded-[24px] border bg-[#0c0d0e]/85 backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-300 cursor-pointer ${isWide ? "md:col-span-2" : "md:col-span-1"
        } ${theme.border}`}
    >
      {/* Cyber scanlines / tech scan overlay on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%),linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05))] bg-[length:100%_4px,3px_100%] z-0"
      />

      {/* Cyber ambient micro grid details */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 bg-[linear-gradient(to_right,gray_1px,transparent_1px),linear-gradient(to_bottom,gray_1px,transparent_1px)] bg-[size:32px_32px] z-0"
      />

      {/* Magnetic spotlight radial glow inside card */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(400px circle at ${glowPos.x}px ${glowPos.y}px, ${getGlowColor()}, transparent 80%)`,
        }}
      />

      {/* Dynamic Border highlight glow overlay using CSS masking */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 rounded-[24px]"
        style={{
          margin: "-1px",
          border: "2px solid transparent",
          backgroundImage: `radial-gradient(150px circle at ${glowPos.x}px ${glowPos.y}px, ${getBorderGlowColor()}, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />

      {/* Dynamic 3D depth wrapper for inner content */}
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

const EventCard = ({
  event,
  onOpenDetails,
}: {
  event: EventType;
  onOpenDetails: (event: EventType) => void;
}) => {
  const theme = themes[event.theme];
  const IconComponent = event.icon;

  if ("isWide" in event && event.isWide) {
    if ("leftPoolLayout" in event && event.leftPoolLayout) {
      // Quiz-style wide card
      return (
        <InteractiveCardWrapper
          onClick={() => onOpenDetails(event)}
          theme={theme}
          isWide={true}
        >
          {/* Watermark outline text */}
          {"watermark" in event && event.watermark && (
            <div
              style={{ transform: "translateZ(10px)" }}
              className="absolute top-2 right-4 text-[9rem] font-black text-white/[0.02] select-none font-heading tracking-tighter leading-none pointer-events-none"
            >
              {event.watermark}
            </div>
          )}

          {/* Diagonal glow beam */}
          <div className={`absolute right-[10%] top-0 bottom-0 w-[35%] -skew-x-[25deg] bg-gradient-to-r from-transparent ${theme.beam} pointer-events-none blur-sm transition-transform duration-700 group-hover:scale-x-110`} />

          <div className="flex flex-col md:flex-row h-full min-h-[280px]">
            {/* Left Column (only on md and up) */}
            <div
              style={{ transform: "translateZ(15px)" }}
              className="hidden md:flex flex-col justify-center items-center px-10 border-r border-white/5 relative z-10 w-[200px] shrink-0"
            >
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-mono">PRIZE POOL</span>
              <span className={`text-3xl font-extrabold font-heading ${theme.textGlow}`}>
                {event.prize}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-mono">
                DAY {event.day}
              </span>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col justify-between p-8 relative z-10">
              {/* Top Header line */}
              <div className="relative flex items-center justify-between mb-6 w-full">
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/10 -translate-y-1/2" />
                <span
                  style={{ transform: "translateZ(20px)" }}
                  className={`relative z-10 px-3 py-1 text-xs font-semibold tracking-wider border rounded-md ${theme.badge}`}
                >
                  {event.category}
                </span>
              </div>

              {/* Main Content */}
              <div
                style={{ transform: "translateZ(25px)" }}
                className="flex gap-4 items-start mb-6"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border ${theme.iconBg}`}>
                  <IconComponent className={theme.iconText} size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading text-white">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-md">{event.description}</p>
                </div>
              </div>

              {/* Bottom details */}
              <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-auto">
                <div className="flex flex-wrap gap-3 sm:gap-6">
                  <div className="md:hidden">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono">PRIZE</span>
                    <span className={`text-sm font-semibold ${theme.iconText}`}>{event.prize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold font-semibold">TEAM</span>
                    <span className="text-sm font-semibold text-white">{event.teamSize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold font-semibold">DAY</span>
                    <span className="text-sm font-semibold text-white">{event.day}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold">ENTRY FEE</span>
                    <span className="text-sm font-semibold text-white">{event.entryFee}</span>
                  </div>
                </div>
                <button
                  style={{ transform: "translateZ(30px)" }}
                  className={`w-10 h-10 rounded-full border border-white/20 bg-transparent flex items-center justify-center text-white transition-all duration-300 ${theme.arrowHover}`}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </InteractiveCardWrapper>
      );
    } else {
      // Hackathon-style wide card
      return (
        <InteractiveCardWrapper
          onClick={() => onOpenDetails(event)}
          theme={theme}
          isWide={true}
        >
          <div className="w-full h-full p-8 flex flex-col justify-between min-h-[280px]">
            {/* Watermark outline text */}
            {"watermark" in event && event.watermark && (
              <div
                style={{ transform: "translateZ(10px)" }}
                className="absolute top-2 right-4 text-[9rem] font-black text-white/[0.02] select-none font-heading tracking-tighter leading-none pointer-events-none"
              >
                {event.watermark}
              </div>
            )}

            {/* Diagonal glow beam */}
            <div className={`absolute right-[10%] top-0 bottom-0 w-[35%] -skew-x-[25deg] bg-gradient-to-r from-transparent ${theme.beam} pointer-events-none blur-sm transition-transform duration-700 group-hover:scale-x-110`} />

            {/* Top Line & Category & Circle Arrow */}
            <div className="relative flex items-center justify-between mb-8 w-full">
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/10 -translate-y-1/2" />
              <span
                style={{ transform: "translateZ(20px)" }}
                className={`relative z-10 px-3 py-1 text-xs font-semibold tracking-wider border rounded-md ${theme.badge}`}
              >
                {event.category}
              </span>
              <button
                style={{ transform: "translateZ(30px)" }}
                className={`relative z-10 w-10 h-10 rounded-full border border-white/20 bg-[#0c0d0e] flex items-center justify-center text-white transition-all duration-300 ${theme.arrowHover}`}
              >
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Main Body content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
              <div
                style={{ transform: "translateZ(25px)" }}
                className="flex gap-4 items-start"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border ${theme.iconBg}`}>
                  <IconComponent className={theme.iconText} size={28} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold font-heading text-white">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-md">{event.description}</p>
                </div>
              </div>
              {/* Massive Prize Pool info */}
              <div
                style={{ transform: "translateZ(20px)" }}
                className="text-left md:text-right shrink-0"
              >
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono">PRIZE POOL</span>
                <span className={`text-3xl md:text-4xl font-extrabold font-heading ${theme.textGlow}`}>
                  {event.prize}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mt-1 font-mono">TOP EVENT</span>
              </div>
            </div>

            {/* Bottom details */}
            <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5 relative z-10">
              <div className="flex flex-wrap gap-3 sm:gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold">TEAM</span>
                  <span className="text-sm font-semibold text-white">{event.teamSize}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold">DURATION</span>
                  <span className="text-sm font-semibold text-white">{event.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold">DAY</span>
                  <span className="text-sm font-semibold text-white">{event.day}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold">ENTRY FEE</span>
                  <span className="text-sm font-semibold text-white">{event.entryFee}</span>
                </div>
              </div>
              <div className="px-3 py-1 text-xs border border-white/10 rounded text-muted-foreground uppercase tracking-widest font-mono">
                DAY {event.day}
              </div>
            </div>
          </div>
        </InteractiveCardWrapper>
      );
    }
  }

  // Vertical card (Gaming Tournament, Blind Coding, Guess Who, Debates)
  return (
    <InteractiveCardWrapper
      onClick={() => onOpenDetails(event)}
      theme={theme}
      isWide={false}
    >
      <div className="flex flex-col justify-between h-full min-h-[360px] p-6">
        {/* Diagonal glow beam */}
        <div className={`absolute right-[5%] top-0 bottom-0 w-[40%] -skew-x-[20deg] bg-gradient-to-r from-transparent ${theme.beam} pointer-events-none blur-sm transition-transform duration-700 group-hover:scale-x-110`} />

        {/* Watermark outline text */}
        {"watermark" in event && event.watermark && (
          <div
            style={{ transform: "translateZ(10px)" }}
            className="absolute top-2 right-4 text-[9rem] font-black text-white/[0.02] select-none font-heading tracking-tighter leading-none pointer-events-none"
          >
            {event.watermark}
          </div>
        )}

        {/* Top row */}
        <div className="relative z-10 flex justify-between items-start mb-6">
          <span
            style={{ transform: "translateZ(20px)" }}
            className={`text-[10px] font-bold tracking-wider px-2 py-0.5 border rounded uppercase ${theme.badge}`}
          >
            {event.category}
          </span>
          <span className="text-[10px] font-mono border border-white/10 px-2 py-0.5 rounded text-muted-foreground uppercase tracking-widest">
            DAY {event.day}
          </span>
        </div>

        {/* Body content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center mb-6">
          <div
            style={{ transform: "translateZ(25px)" }}
            className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center shrink-0 border ${theme.iconBg}`}
          >
            <IconComponent className={theme.iconText} size={24} />
          </div>
          <h3
            style={{ transform: "translateZ(20px)" }}
            className="text-xl font-bold font-heading text-white mb-2"
          >
            {event.title}
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed">{event.description}</p>
        </div>

        {/* Separator line */}
        <div className="relative z-10 w-full h-[1px] bg-white/5 my-4" />

        {/* Bottom details */}
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-mono">PRIZE</span>
              <span className={`text-xs font-semibold ${theme.iconText}`}>{event.prize}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold">
                {"teamSizeLabel" in event ? event.teamSizeLabel : "TEAM"}
              </span>
              <span className="text-xs font-semibold text-white">{event.teamSize}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-mono">ENTRY FEE</span>
              <span className="text-xs font-semibold text-white">{event.entryFee}</span>
            </div>
          </div>
          <button
            style={{ transform: "translateZ(30px)" }}
            className={`w-8 h-8 rounded-full border border-white/20 bg-transparent flex items-center justify-center text-white transition-all duration-300 ${theme.arrowHover}`}
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </InteractiveCardWrapper>
  );
};

const Events = () => {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [showRulebook, setShowRulebook] = useState<boolean>(false);

  const filteredEvents = activeFilter === "ALL"
    ? events
    : events.filter(e => e.category === activeFilter);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background scanline-overlay overflow-x-hidden">
        <ParticleField />
        <AnimatedBlobs />
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

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-[10px] md:text-xs text-primary uppercase tracking-[0.2em] md:tracking-[0.45em] mb-5 font-semibold font-mono flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4"
          >
            <Swords size={12} className="text-primary shrink-0" />
            <span>COMPETE &amp; CREATE</span>
            <Sparkles size={12} className="text-primary shrink-0" />
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
                  ALL EVENTS
                </span>
              </div>

              {/* Actual title */}
              <h1
                className="font-heading font-black uppercase leading-none tracking-tight w-full text-center relative"
                style={{ fontSize: "clamp(2.5rem, 10vw, 5.5rem)", transformStyle: "preserve-3d" }}
              >
                {/* ALL — dimmer, lighter weight */}
                <span
                  className="inline-block mr-[0.15em]"
                  style={{
                    color: "rgba(255,255,255,0.28)",
                    fontWeight: 300,
                    textShadow: "0 2px 20px rgba(139,92,246,0.1)",
                  }}
                >
                  ALL
                </span>

                {/* EVENTS — full white with 3D purple bloom */}
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
                  EVENTS
                </span>
              </h1>
            </motion.div>
          </div>

          {/* Subtitle + filter bar */}
          <div className="mt-10 mb-0 flex flex-col items-center gap-6 relative z-10 pb-12">
            <div className="w-full flex justify-center">
              <TerminalSubheading
                text="Seven thrilling competitions &middot; UEM Kolkata"
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
                {["ALL", "TECHNICAL", "GAMING", "NON-TECH"].map((filter) => {
                  const isActive = activeFilter === filter;
                  return (
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
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Asymmetrical Grid of Event Cards */}
        <section className="pb-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={event.id}
                  className={event.isWide ? "md:col-span-2 relative" : "md:col-span-1 relative"}
                >
                  {event.id === "hackathon" && (
                    <div className="hidden md:block absolute bottom-full left-[20px] md:left-[50px] -z-10 pointer-events-none -mb-[10px] md:-mb-[15px]">
                      <img
                        src="/download.gif"
                        alt="Sci-Fi Hologram"
                        className="w-28 md:w-40 h-auto"
                      />
                    </div>
                  )}
                  <EventCard
                    event={event}
                    onOpenDetails={setSelectedEvent}
                  />
                </motion.div>
              ))}
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
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => { setSelectedEvent(null); setShowRulebook(false); }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`relative w-full max-w-2xl bg-[#0c0d0e]/95 border rounded-[28px] overflow-hidden max-h-[85vh] flex flex-col ${themes[selectedEvent.theme].border} ${themes[selectedEvent.theme].shadow}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Diagonal color glow in background */}
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full filter blur-[80px] opacity-15 -translate-y-12 translate-x-12 ${themes[selectedEvent.theme].accentGlow}`} />

                {/* Background Phoenix Logo Watermark */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.18] overflow-hidden select-none">
                  <img
                    src="/phoenix-logo.jpg"
                    alt="Phoenix watermark"
                    className="w-full h-full object-cover filter brightness-[0.38] contrast-[1.1]"
                  />
                </div>

                {/* Modal Header */}
                <div className="flex justify-between items-start p-6 md:p-8 border-b border-white/5 relative z-10">
                  <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${themes[selectedEvent.theme].iconBg}`}>
                      {(() => {
                        const Icon = selectedEvent.icon;
                        return <Icon className={themes[selectedEvent.theme].iconText} size={24} />;
                      })()}
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 border rounded uppercase mb-1 inline-block ${themes[selectedEvent.theme].badge}`}>
                        {selectedEvent.category}
                      </span>
                      <h3 className="text-2xl font-bold font-heading text-white">{selectedEvent.title}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedEvent(null); setShowRulebook(false); }}
                    className="p-2 text-muted-foreground hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 relative z-10">
                  {/* Quick Metrics */}
                  <div className="grid grid-cols-3 gap-4 p-4 border border-white/5 bg-[#ffffff02] rounded-2xl">
                    <div className="text-center">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono">PRIZE POOL</span>
                      <span className={`text-base md:text-lg font-bold font-heading ${themes[selectedEvent.theme].iconText}`}>
                        {selectedEvent.prize}
                      </span>
                    </div>
                    <div className="text-center border-x border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono">
                        {"teamSizeLabel" in selectedEvent ? selectedEvent.teamSizeLabel : "TEAM"}
                      </span>
                      <span className="text-base md:text-lg font-bold font-heading text-white">
                        {selectedEvent.teamSize}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono">TIMING</span>
                      <span className="text-sm md:text-base font-bold font-heading text-white">
                        {selectedEvent.duration}
                      </span>
                    </div>
                  </div>

                  {/* Overview */}
                  <div>
                    <h4 className={`text-xs uppercase tracking-wider font-semibold font-mono mb-2 ${themes[selectedEvent.theme].iconText}`}>
                      Overview
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedEvent.overview || selectedEvent.description}
                    </p>
                  </div>

                  {/* Rules & Criteria Grid */}
                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    {/* Rules */}
                    {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                      <div>
                        <h4 className={`text-xs uppercase tracking-wider font-semibold font-mono mb-3 ${themes[selectedEvent.theme].iconText}`}>
                          Rules
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.rules.map((rule, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className={`${themes[selectedEvent.theme].iconText} mt-0.5 shrink-0`}>▸</span>
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Judging Criteria */}
                    {selectedEvent.criteria && selectedEvent.criteria.length > 0 && (
                      <div>
                        <h4 className={`text-xs uppercase tracking-wider font-semibold font-mono mb-3 ${themes[selectedEvent.theme].iconText}`}>
                          Judging Criteria
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.criteria.map((crit, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className={`${themes[selectedEvent.theme].iconText} mt-0.5 shrink-0`}>◆</span>
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 md:p-8 border-t border-white/5 flex gap-4 justify-end relative z-10 bg-[#0c0d0e]/50">
                  <button
                    onClick={() => setShowRulebook(true)}
                    className="px-6 py-3.5 rounded-xl border border-white/10 text-white font-semibold transition-all duration-300 text-center text-sm bg-transparent hover:bg-white/5 hover:border-white/20 shrink-0"
                  >
                    Rulebook
                  </button>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full md:w-auto relative overflow-hidden font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 text-center text-sm ${selectedEvent.theme === "orange" ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]" :
                      selectedEvent.theme === "purple" ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]" :
                        selectedEvent.theme === "teal" ? "bg-teal-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]" :
                          selectedEvent.theme === "yellow" ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]" :
                            selectedEvent.theme === "pink" ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]" :
                              "bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                      }`}
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
              onClick={() => setShowRulebook(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`relative w-full max-w-3xl bg-[#0c0d0e]/98 border rounded-[28px] overflow-hidden max-h-[90vh] flex flex-col ${themes[selectedEvent.theme].border} ${themes[selectedEvent.theme].shadow}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Background Phoenix Logo Watermark */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.18] overflow-hidden select-none">
                  <img
                    src="/phoenix-logo.jpg"
                    alt="Phoenix watermark"
                    className="w-full h-full object-cover filter brightness-[0.38] contrast-[1.1]"
                  />
                </div>
                {/* Header */}
                <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/5 relative z-10">
                  <h3 className={`text-xl md:text-2xl font-bold font-heading ${themes[selectedEvent.theme].iconText}`}>
                    {selectedEvent.id === "hackathon" ? "IGNYSIS — Hackathon Rulebook" :
                      selectedEvent.id === "guess-who" ? "Guess Who — Bollywood Edition" :
                        selectedEvent.id === "efootball" ? "E-Football Ultimate 11 — Tournament" :
                          selectedEvent.id === "bgmi" ? "BGMI — Gaming Tournament Rulebook" :
                            selectedEvent.id === "poster-design" ? "Bollywood Poster Design Challenge" :
                              `${selectedEvent.title} Rulebook`}
                  </h3>
                  <button
                    onClick={() => setShowRulebook(false)}
                    className="p-2 text-muted-foreground hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 relative z-10 text-sm leading-relaxed text-muted-foreground">
                  {selectedEvent.id === "hackathon" ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Eligibility</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Open to students of any department from any registered college/university.</li>
                          <li>Team members can be from different institutions and branches.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Team</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>4 to 6 members per team.</li>
                          <li>Registration fee: ₹99 (early bird) / ₹199 (regular).</li>
                          <li>One student cannot be in more than one team.</li>
                          <li>No team modification after registration (contact POC for emergencies).</li>
                          <li>Bring your own laptop, spike buster, and accessories.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Format</h4>
                        <p className="mb-2">Hybrid hackathon — Round 1 is online, Round 2 is offline at IEM Newtown campus.</p>
                        <div className="mt-3 space-y-3 pl-4 border-l-2 border-orange-500/30">
                          <div>
                            <h5 className="text-white font-semibold text-sm">Round 1 — Crack the Problem</h5>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                              <li>Tracks revealed on 10th June; solve collaboratively within 720 hours.</li>
                              <li>Submit a video solution + presentation before 1st July, 10:00 AM.</li>
                              <li>Register before 20th June to get the full 720-hour window.</li>
                              <li>Only the team leader submits the PPT.</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-white font-semibold text-sm">Round 2 — Final Round (1st August)</h5>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                              <li>Top 25–30 teams present offline before a jury.</li>
                              <li>7 minutes to present + 3 minutes Q&A.</li>
                              <li>Up to 30% of code structure/logic may be prepared in advance.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Submission Format (5 slides)</h4>
                        <ul className="list-decimal pl-5 space-y-1">
                          <li>Team intro</li>
                          <li>Solution overview</li>
                          <li>Unique selling proposition</li>
                          <li>Risks & challenges</li>
                          <li>Approximate running expenses</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">General Rules</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Original ideas only — plagiarism = instant disqualification.</li>
                          <li>Internet allowed for research, not for copying solutions.</li>
                          <li>All team members must be present during the final round.</li>
                          <li>Organizer decisions are final.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Key Dates</h4>
                        <div className="overflow-x-auto border border-white/5 rounded-xl">
                          <table className="w-full text-left border-collapse text-xs text-muted-foreground">
                            <thead>
                              <tr className="bg-white/[0.02] border-b border-white/5 text-white">
                                <th className="p-3 font-semibold">Date</th>
                                <th className="p-3 font-semibold">Milestone</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-muted-foreground">
                              <tr>
                                <td className="p-3 font-mono text-white">5th June</td>
                                <td className="p-3">Registration opens</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-mono text-white">10th June</td>
                                <td className="p-3">Tracks revealed</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-mono text-white">1st July</td>
                                <td className="p-3">Registration + submission deadline</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-mono text-white">5th–7th July</td>
                                <td className="p-3">Round 1 results</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-mono text-white">1st August</td>
                                <td className="p-3">Final round</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Contact</h4>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          <li>Daliya Paul — <span className="font-mono text-white">+91 97487 53104</span></li>
                          <li>Samit Gupta — <span className="font-mono text-white">+91 81000 89301</span></li>
                        </ul>
                      </div>
                    </div>
                  ) : selectedEvent.id === "blind-coding" ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Overview</h4>
                        <p>Offline solo competition where participants write code without being able to see their screen. Open to students of any branch from any registered college.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                          <li><strong>Date:</strong> 2nd August 2026</li>
                          <li><strong>Venue:</strong> IEM Newtown Campus (both rounds)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Eligibility</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Must belong to a registered college/university.</li>
                          <li>Open to all branches.</li>
                          <li>Languages: Python, Java, or C.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Format</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Solo only — no teams.</li>
                          <li>Central registration fee applies.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Format Structure</h4>
                        <div className="pl-4 border-l-2 border-teal-500/30 space-y-3">
                          <div>
                            <h5 className="text-white font-semibold text-sm">Round 1</h5>
                            <p className="text-xs">Participants are judged on overall performance. The top 10 are shortlisted for Round 2.</p>
                          </div>
                          <div>
                            <h5 className="text-white font-semibold text-sm">Round 2 — Final</h5>
                            <p className="text-xs">Top 10 face off. The top 3 finalists are selected as winners.</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Judging Criteria</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Amount of correct, functional code completed within the time limit.</li>
                          <li>Number of errors in the submitted code.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Rules</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Screen must not be viewed until the timer starts.</li>
                          <li>Once time ends, no further typing or edits allowed.</li>
                          <li>No internet, AI tools, or external help — strictly prohibited.</li>
                          <li>No viewing another participant's screen at any point.</li>
                          <li>Any technical issue must be reported to organizers immediately.</li>
                          <li>Organizer decisions are final.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Contact</h4>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          <li>Daliya Paul — <span className="font-mono text-white">+91 97487 53104</span></li>
                          <li>Samit Gupta — <span className="font-mono text-white">+91 81000 89301</span></li>
                        </ul>
                      </div>
                    </div>
                  ) : selectedEvent.id === "quizophonia" ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Overview</h4>
                        <p>A multi-domain quiz spanning 9 categories. Open to cross-institute teams. Solo participants welcome too.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                          <li><strong>Date:</strong> 1st August 2026</li>
                          <li><strong>Venue:</strong> UEM Campus, New Town</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Eligibility</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Must be a registered college/university student.</li>
                          <li>Must be under 25 years of age.</li>
                          <li>Cross-institute teams allowed.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Team</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>1 or 2 members per team (solo allowed).</li>
                          <li>Carry valid college ID card.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Quiz Domains</h4>
                        <p className="px-3 py-2 rounded bg-white/[0.02] border border-white/5 font-medium tracking-wide text-xs inline-block text-white">
                          Music · Innovation · Cinema · Recent Affairs · Online Trends · Space · Olympics · Food · Technology
                        </p>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Rules</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>No electronic devices during the quiz — phones, tablets, smartwatches, calculators all banned; violation = instant disqualification.</li>
                          <li>Quiz Master's decision is final on all matters.</li>
                          <li>Campus code of conduct applies — no smoking, alcohol, or prohibited items on premises.</li>
                          <li>Lost property to be deposited at the Ignitia Control Room; claim with ID the next day.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Contact</h4>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          <li>Arunava Das — <span className="font-mono text-white">+91 80013 86218</span></li>
                          <li>Sneha Priya — <span className="font-mono text-white">+91 78783 96475</span></li>
                        </ul>
                      </div>
                    </div>
                  ) : selectedEvent.id === "efootball" ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Overview</h4>
                        <p>One Match. One Chance. One Champion. A fully online, single-elimination mobile eFootball tournament open to 32 participants. Survive each round or go home.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                          <li><strong>Platform:</strong> Mobile (eFootball — latest version required)</li>
                          <li><strong>Mode:</strong> Completely Online · Single Elimination Knockout</li>
                          <li><strong>Entry Fee:</strong> ₹70 per participant (non-refundable)</li>
                          <li><strong>Awards:</strong> Top 3 get cash prizes · All participants get e-certificates</li>
                        </ul>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-bold font-heading text-base mb-2">Tournament Schedule</h4>
                          <div className="overflow-x-auto border border-white/5 rounded-xl">
                            <table className="w-full text-left border-collapse text-xs text-muted-foreground">
                              <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5 text-white">
                                  <th className="p-2 font-semibold">Date</th>
                                  <th className="p-2 font-semibold">Round</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                <tr>
                                  <td className="p-2 font-mono text-white">28 July</td>
                                  <td className="p-2">Round of 32</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-white">29 July</td>
                                  <td className="p-2">Round of 16</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-white">30 July</td>
                                  <td className="p-2">Quarter Finals</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-white">31 July</td>
                                  <td className="p-2">Semi Finals</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-white">1 August</td>
                                  <td className="p-2">Third Place + Grand Final</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">Daily time slot: 9:30 AM – 11:30 PM</p>
                        </div>

                        <div>
                          <h4 className="text-white font-bold font-heading text-base mb-2">Match Duration</h4>
                          <div className="overflow-x-auto border border-white/5 rounded-xl">
                            <table className="w-full text-left border-collapse text-xs text-muted-foreground">
                              <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5 text-white">
                                  <th className="p-2 font-semibold">Round</th>
                                  <th className="p-2 font-semibold">Duration</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                <tr>
                                  <td className="p-2 text-white">Round of 32</td>
                                  <td className="p-2 font-mono">6 mins</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">Round of 16</td>
                                  <td className="p-2 font-mono">8 mins</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">Quarter Finals</td>
                                  <td className="p-2 font-mono">10 mins</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">Semi Finals onwards</td>
                                  <td className="p-2 font-mono">12 mins</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Match Rules</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Extra time and penalties both ON. Tied matches go to penalties.</li>
                          <li>Home/Away selected randomly.</li>
                          <li>Winners must submit screenshot proof immediately after the match.</li>
                          <li>Dream Team and Model Team both allowed. No team changes once tournament begins.</li>
                          <li>Max 6 substitutions — 5 in 90 mins, 1 additional in extra time.</li>
                          <li>Only registered player IDs permitted.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Fair Play</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Screen record your Player ID before kick-off with opponent's consent.</li>
                          <li>Smart Assist must be OFF throughout.</li>
                          <li>Double Defence only allowed after the 60th in-game minute.</li>
                          <li>Max 8 long balls and max 8 back passes per match.</li>
                          <li>Match fixing, toxicity, harassment, and abusive language result in immediate disqualification.</li>
                          <li>Any malpractice suspicion must be backed by screenshot or screen recording proof.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Connection & Disputes</h4>
                        <div className="pl-4 border-l-2 border-purple-500/30 space-y-2 text-xs">
                          <p><strong>Connection Rules:</strong> Disconnection mid-match rematches begin at remaining time + 2 bonus minutes. 3 disconnections without valid reason = walkover to opponent. Severe lag must be reported within first 3 in-game minutes; complaints after the 10th minute will not be entertained. Screenshot or video proof is mandatory for connection disputes.</p>
                          <p><strong>Disputes:</strong> Admin decisions are final and binding. Protests must be filed within 30 minutes of the incident with supporting proof.</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Contact</h4>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          <li>Souhardya Das — <span className="font-mono text-white">+91 70859 17542</span></li>
                          <li>Sayandip Pandit — <span className="font-mono text-white">+91 89103 85921</span></li>
                          <li>Prachurya Debnath — <span className="font-mono text-white">+91 85971 28380</span></li>
                        </ul>
                      </div>
                    </div>
                  ) : selectedEvent.id === "bgmi" ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Overview</h4>
                        <p>Lock, load, and own the zone. The ultimate BGMI squad tournament at Ignitia '26 — hybrid format with online qualifiers and an offline grand final. Only the strongest survive.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                          <li><strong>Venue:</strong> IEM Newtown, Kolkata (for offline finals)</li>
                          <li><strong>Mode:</strong> Hybrid — Online qualifiers, Offline finals</li>
                          <li><strong>Dates:</strong> 29–30 July (Online, 7:30 PM onwards) · 2 August (Offline, 9:30 AM onwards)</li>
                          <li><strong>Eligibility:</strong> Anyone aged 16+ from any school, college, or organisation</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Team Requirements</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Squad of 4 players (minimum 2 players to compete).</li>
                          <li>One substitute allowed — can only replace before a round starts.</li>
                          <li>Every member must register with their official BGMI ID. No roster changes after registration.</li>
                          <li>Team name must be unique, inoffensive, and logo-free.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Game Settings & Device Restrictions</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Platform:</strong> Android or iOS (iPads strictly not allowed).</li>
                          <li><strong>Mode:</strong> TPP Squad (Ranking: BGIS 2026).</li>
                          <li><strong>Maps:</strong> Erangel, Miramar, Rondo (download all before arriving).</li>
                          <li>No triggers, controllers, or joypads allowed.</li>
                          <li><strong>Emergency Pickup</strong> item is strictly prohibited (violations result in point deduction, match loss, or DQ).</li>
                          <li>No GFx tools or third-party apps (instant team disqualification).</li>
                        </ul>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-bold font-heading text-base mb-2">Match Settings</h4>
                          <div className="overflow-x-auto border border-white/5 rounded-xl">
                            <table className="w-full text-left border-collapse text-xs text-muted-foreground">
                              <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5 text-white">
                                  <th className="p-2 font-semibold">Stage</th>
                                  <th className="p-2 font-semibold">Duration</th>
                                  <th className="p-2 font-semibold">Loot</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                <tr>
                                  <td className="p-2 text-white">League Stage</td>
                                  <td className="p-2 font-mono">~30 mins</td>
                                  <td className="p-2 font-mono">2X</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">Playoffs & Finals</td>
                                  <td className="p-2 font-mono">~30 mins</td>
                                  <td className="p-2 font-mono">3X</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-bold font-heading text-base mb-2">Points Structure</h4>
                          <div className="overflow-x-auto border border-white/5 rounded-xl">
                            <table className="w-full text-left border-collapse text-xs text-muted-foreground">
                              <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5 text-white">
                                  <th className="p-2 font-semibold">Placement</th>
                                  <th className="p-2 font-semibold">Points</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                <tr>
                                  <td className="p-2 text-white">1st</td>
                                  <td className="p-2 font-mono">10 pts</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">2nd</td>
                                  <td className="p-2 font-mono">6 pts</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">3rd</td>
                                  <td className="p-2 font-mono">5 pts</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">4th</td>
                                  <td className="p-2 font-mono">4 pts</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">5th</td>
                                  <td className="p-2 font-mono">3 pts</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">6th</td>
                                  <td className="p-2 font-mono">2 pts</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">7th – 8th</td>
                                  <td className="p-2 font-mono">1 pt</td>
                                </tr>
                                <tr>
                                  <td className="p-2 text-white">9th – 16th</td>
                                  <td className="p-2 font-mono">0 pts</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">Every kill = 1 point</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Tiebreakers</h4>
                        <ol className="list-decimal pl-5 space-y-1 text-xs">
                          <li>Most first-place finishes</li>
                          <li>Total placement points</li>
                          <li>Total kills</li>
                          <li>Placement in most recent match</li>
                        </ol>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-bold font-heading text-base mb-2">Online Mode Rules</h4>
                          <ul className="list-disc pl-5 space-y-1 text-xs">
                            <li>Join room within 5 minutes of announcement.</li>
                            <li>Connection issues/lag do not trigger a rematch.</li>
                            <li>Impersonation leads to a permanent ban.</li>
                            <li>Screen sharing may be requested by admins at any time.</li>
                            <li>Streamers must maintain a minimum 2-minute delay to prevent ghosting.</li>
                            <li>Report violations within 5 minutes of match finish.</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-white font-bold font-heading text-base mb-2">Offline Mode Rules</h4>
                          <ul className="list-disc pl-5 space-y-1 text-xs">
                            <li>Report 30 minutes before match slot; latecomers are disqualified.</li>
                            <li>Strictly no audience coaching or spectators shouting instructions.</li>
                            <li>No food or drinks near gaming stations.</li>
                            <li>Early eliminated teams must disconnect from tournament Wi-Fi.</li>
                            <li>Rehost only if 3+ players disconnect on management Wi-Fi before first circle forms. Mobile data issues do not count.</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">General Policies</h4>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          <li>Wi-Fi provided but keep mobile data backup ready. Charging facilities available.</li>
                          <li>Organizers not responsible for lost, stolen, or damaged devices.</li>
                          <li>All admin decisions are final. Disputes must be raised within 5 minutes.</li>
                          <li>Any unethical conduct results in immediate disqualification.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Contact</h4>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          <li>Soham Roy — <span className="font-mono text-white">+91 89060 14314</span></li>
                          <li>Arpayan Chakraborty — <span className="font-mono text-white">+91 85090 68265</span></li>
                          <li>Sudeshna Sarkar — <span className="font-mono text-white">+91 98676 21693</span></li>
                          <li>Debangshu Sarkar — <span className="font-mono text-white">+91 70749 19071</span></li>
                        </ul>
                      </div>
                    </div>
                  ) : selectedEvent.id === "guess-who" ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Overview</h4>
                        <p>A fast-paced, high-energy Bollywood celebrity guessing challenge where your eyes do the talking. Zoomed-in visuals flash on screen — from a pair of eyes to an iconic smile to a signature accessory — and you have seconds to name the star before the room does. No prep needed. Just vibes, instinct, and a solid knowledge of Bollywood.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                          <li><strong>Date:</strong> Day 2</li>
                          <li><strong>Duration:</strong> 15–20 minutes</li>
                          <li><strong>Venue:</strong> IEM Newtown Campus</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">How It Works</h4>
                        <p className="text-xs mb-2">Each round, a zoomed-in or partially revealed image of a Bollywood celebrity is displayed on the main screen. Participants study the visual and race to be the first to correctly identify the star. Speed and accuracy both matter — shout too early and you might get it wrong, wait too long and someone else takes the point.</p>
                        <h5 className="text-white font-semibold text-xs mt-3 mb-1">What You'll Be Shown:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          <li>Eyes and eyebrows</li>
                          <li>Mouth or smile</li>
                          <li>Hairstyle or hair color</li>
                          <li>Signature accessories — glasses, jewellery, hats, or iconic outfits</li>
                          <li>Partial face reveals that widen with each passing second</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Answering & Scoring</h4>
                        <div className="pl-4 border-l-2 border-amber-500/30 space-y-2 text-xs">
                          <p><strong>Answering:</strong> The host controls when answers are accepted — only respond when signalled. First participant to give the correct answer earns the point for that round. Wrong answers do not penalise, but shouting out of turn may result in the point being skipped.</p>
                          <p><strong>Scoring:</strong> Each correct answer = 1 point. Points accumulate across all rounds. Participant with the highest total score at the end wins. Tiebreaker rounds will be held if scores are level.</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Rules & Fair Play</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>No use of phones or any external device to look up answers — violation leads to immediate disqualification.</li>
                          <li>No shouting over other participants or disrupting the host.</li>
                          <li>Maintain discipline and sportsmanship throughout.</li>
                          <li>The host's decision on correct answers and point allocation is final.</li>
                          <li>Everyone gets an equal opportunity to participate across rounds.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Who Can Participate</h4>
                        <p>Open to all college participants — no registration required beyond the central Ignitia entry. Walk in, find a seat, and play.</p>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Contact</h4>
                        <p className="text-xs">Reach out via the main Ignitia contact channels for any queries about this event.</p>
                      </div>
                    </div>
                  ) : selectedEvent.id === "poster-design" ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Overview</h4>
                        <p>Design the icon. Capture the aura. Participants will randomly draw a chit featuring a Bollywood actor or actress and create a poster inspired by their aura and signature presence. Bring your vision. Design with impact. Celebrate Bollywood. ✨</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                          <li><strong>Duration:</strong> 50 Minutes</li>
                          <li><strong>Participation:</strong> Individual (Solo)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Rules & Guidelines</h4>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Chit Draw:</strong> Each participant will pick one chit randomly. Chits cannot be exchanged.</li>
                          <li><strong>Poster Theme:</strong> Design a poster based only on the assigned celebrity, reflecting their aura, presence, and aesthetic.</li>
                          <li><strong>Time Limit:</strong> Total time is 50 minutes. You must submit before time ends.</li>
                          <li><strong>Devices:</strong> Participants must bring their own charged laptop / iPad / tablet. Any designing device is allowed. No devices will be provided by the organisers.</li>
                          <li><strong>Creative Freedom:</strong> Open to all poster design styles including typography, digital art, collage, editorial, cinematic, etc.</li>
                          <li><strong>Originality:</strong> Design must be created during the event. No pre-made work allowed.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Judging Criteria</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Creativity</li>
                          <li>Visual aesthetics</li>
                          <li>Representation of celebrity's aura</li>
                          <li>Overall presentation</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Awards & Recognition</h4>
                        <div className="px-3 py-2 rounded bg-white/[0.02] border border-white/5 font-medium tracking-wide text-xs inline-block text-white">
                          🏆 Best Poster Design – Winner
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-heading text-base mb-2">Contact</h4>
                        <p className="text-xs">Reach out via the main Ignitia contact channels for any queries about this challenge.</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Footer */}
                <div className="p-6 md:p-8 border-t border-white/5 flex justify-end bg-[#0c0d0e]/50 relative z-10">
                  <button
                    onClick={() => setShowRulebook(false)}
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 text-center text-sm ${selectedEvent.theme === "orange" ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]" :
                      selectedEvent.theme === "purple" ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]" :
                        selectedEvent.theme === "teal" ? "bg-teal-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]" :
                          selectedEvent.theme === "yellow" ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]" :
                            selectedEvent.theme === "pink" ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]" :
                              "bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                      }`}
                  >
                    Got it
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Events;
