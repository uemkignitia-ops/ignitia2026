import { useState, useRef, useEffect } from "react";
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
  isWide?: boolean;
  leftPoolLayout?: boolean;
  arrowTop?: boolean;
  isTopEvent?: boolean;
  watermark?: string;
  description: string;
  overview: string;
  rules?: string[];
  criteria?: string[];
};

const events: EventType[] = [
  {
    id: "ignisys",
    icon: Zap,
    title: "IGNISYS",
    category: "TECHNICAL",
    prize: "TBD",
    teamSize: "1-4",
    duration: "Hybrid",
    day: "001 & 002",
    entryFee: "Free",
    theme: "orange",
    rulebookUrl: "https://drive.google.com/file/d/1x0szLJB-k8JGOt1MozE0S5vgDmxHTci2/preview",
    isWide: true,
    arrowTop: true,
    isTopEvent: true,
    watermark: "01",
    description: "Collaborate on problem-solving to crack designated tracks and submit an innovative solution.",
    overview: "IGNISYS is a hybrid hackathon where teams collaborate to solve designated tracks. Round 1 features a 720-hour online project window where participants must submit a comprehensive presentation and video detailing their solution. The top 20 qualifying teams will advance to Round 2, culminating in an offline presentation before a jury at the IEM Newtown campus on August 2nd.",
    rules: [
      "Teams must consist of a minimum of 1 and a maximum of 4 participants.",
      "Registration is completely free and open to students from any department of any registered college or university.",
      "Inter-college and cross-branch teams are permitted.",
      "A student cannot be a part of more than one team.",
      "Only the team leader is permitted to submit the final solution in the form of a PPT and video before the deadline.",
      "Internet usage for research is allowed, but direct plagiarism or copied solutions will result in immediate disqualification."
    ],
    criteria: [
      "Originality: Ideas submitted must represent the original work of the team.",
      "Technical Execution: Participants may prepare up to 20% of their code structure or logic at home prior to the final round.",
      "Presentation Quality: The offline pitch requires a 7-minute presentation followed by a 3-minute Q&A session.",
      "Required Structure: Problem Statement, Understanding & Approach, Detailed Solution, System Architecture, Technologies, Innovation Summary, Research/References."
    ],
  },
  {
    id: "efootball",
    icon: Gamepad2,
    title: "E-Football Ultimate 11",
    category: "GAMING",
    prize: "TBD",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "Online",
    day: "001 & 002",
    entryFee: "₹70 / person",
    theme: "purple",
    rulebookUrl: "https://drive.google.com/file/d/1R8xPidpPx2p1QltAYp4CHPAa5jWi2mys/preview",
    watermark: "02",
    description: "One Match. One Chance. One Champion.",
    overview: "A completely online, 32-participant, single-elimination knockout tournament played on the mobile platform of the latest E-Football version.",
    rules: [
      "Solo participation requires a ₹70 non-refundable entry fee.",
      "Extra time and penalties must be set to ON, while \"Smart Assist\" must be turned OFF.",
      "Players are limited to a maximum of 8 long balls and 8 back passes per match.",
      "Dream Teams and Model Teams are allowed, but team changes during the tournament are prohibited."
    ],
    criteria: [
      "Participants advance through a single-elimination knockout format.",
      "If a match is tied, the winner is determined through penalties.",
      "The Top 3 players will receive cash prizes."
    ],
  },
  {
    id: "bgmi",
    icon: Gamepad2,
    title: "Battlegrounds Mobile India",
    category: "GAMING",
    prize: "TBD",
    teamSize: "2 - 4",
    teamSizeLabel: "FORMAT",
    duration: "Hybrid",
    day: "001 & 002",
    entryFee: "₹200 / team",
    theme: "pink",
    rulebookUrl: "https://drive.google.com/file/d/1lLt8tuXtGmcSJPXT94Mpcs_o9Rxtt3SM/preview",
    watermark: "03",
    description: "Squad-based mobile survival tournament.",
    overview: "A hybrid TPP Squad-based BGMI tournament featuring online qualifiers and offline finals. Teams must compete utilizing the BGIS 2026 ranking mechanism across all major maps.",
    rules: [
      "Teams require a minimum of 2 players and a maximum of 4, with 1 optional substitute allowed.",
      "All players must use iOS or Android mobile devices; iPads, tablets, triggers, or external controllers are strictly prohibited.",
      "The use of any third-party application or hack results in an instant ban.",
      "Players are strictly prohibited from picking up or using the \"Emergency Pickup\" item."
    ],
    criteria: [
      "Scoring utilizes a placement point system awarding 10 points for 1st place, scaling down to 0 points for 17th place and below.",
      "Every confirmed finish is worth 1 point.",
      "Ties are broken by total first-place finishes, total placement points, accumulated finishes, and most recent match placement."
    ],
  },
  {
    id: "blind-coding",
    icon: Code,
    title: "Blind Coding",
    category: "TECHNICAL",
    prize: "TBD",
    teamSize: "Solo",
    teamSizeLabel: "SOLO",
    duration: "Offline",
    day: "002",
    entryFee: "TBD",
    theme: "teal",
    rulebookUrl: "https://drive.google.com/file/d/19BRSzJ3Rxb9QDE9D9jui0kho0kjiF1z9/preview",
    watermark: "04",
    description: "Code without screen visibility.",
    overview: "An individual programming challenge conducted in Python, Java, or C where participants must write code without being able to see their screens.",
    rules: [
      "This competition is strictly for individual participants.",
      "Once the timer starts, participants cannot view their own screen or any other participant's screen.",
      "No typing or changes can be made once the time limit ends.",
      "Internet usage and AI tools are strictly prohibited."
    ],
    criteria: [
      "Evaluation is based on how much correct and functional code is completed within the time limit.",
      "The number of errors present in the code will also be judged.",
      "The best 10 participants advance to Round 2, from which the top 3 finalists are chosen."
    ],
  },
  {
    id: "guess-who",
    icon: HelpCircle,
    title: "Guess Who?",
    category: "NON-TECH",
    prize: "TBD",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "Offline (15-20 mins)",
    day: "002",
    entryFee: "TBD",
    theme: "yellow",
    rulebookUrl: "https://drive.google.com/file/d/187w12QZWolU72Lj1Uh8OWfvteZfv65R2/preview",
    watermark: "05",
    description: "Spot it. Guess it. Own it.",
    overview: "A fast-paced, 15 to 20-minute Bollywood guessing challenge. Participants must identify celebrities through zoomed-in visuals, such as eyes, smiles, hairstyles, and iconic accessories.",
    rules: [
      "This is an individual event; no teams, collaboration, or discussion is allowed.",
      "Participants must raise their hand or follow the host's instructions, as only the first valid answer will be considered.",
      "No use of mobile phones or internet access is permitted."
    ],
    criteria: [
      "Correct answers earn points.",
      "The participant with the highest score wins.",
      "In the event of a tie, a tie-breaker round will be conducted."
    ],
  },
  {
    id: "quizophonia",
    icon: Brain,
    title: "Quizophonia",
    category: "NON-TECH",
    prize: "TBD",
    teamSize: "1 - 2",
    teamSizeLabel: "TEAM / SOLO",
    duration: "Offline",
    day: "001",
    entryFee: "₹50 / person",
    theme: "blue",
    rulebookUrl: "https://drive.google.com/file/d/1-h3tIhTGEJRQPEHFksjzG500BSpr6wab/preview",
    isWide: true,
    leftPoolLayout: true,
    watermark: "06",
    description: "Wisdom of domains covering Biz-Tech and more.",
    overview: "A Biz-Tech themed quiz competition open to all registered college or university students below 25 years of age. The quiz spans various areas related to business and technology.",
    rules: [
      "Teams can consist of a maximum of 2 members, but individual participation is also allowed.",
      "Participants must carry a valid identity card.",
      "The use of electronic devices like phones, tablets, or smartwatches is strictly prohibited during the quiz."
    ],
    criteria: [
      "Questions will be evaluated based on accuracy and response time.",
      "Teams or participants with the highest scores in the preliminary rounds will qualify for the next round.",
      "A tie-breaker round will be conducted in case of a tie."
    ],
  },
  {
    id: "pixel-prophecy",
    icon: Palette,
    title: "Pixel Prophecy",
    category: "NON-TECH",
    prize: "TBD",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "Offline (50 mins - 1.5 hrs)",
    day: "002",
    entryFee: "TBD",
    theme: "pink",
    rulebookUrl: "https://drive.google.com/file/d/1ssMOPgn2USMshSZ7Byw7_b3mpMOQuQW2/preview",
    watermark: "07",
    description: "Design the icon. Capture the aura.",
    overview: "An individual poster design competition where participants randomly draw a chit featuring a Bollywood celebrity. Participants must create a poster inspired by that celebrity's aura and signature postures during the event.",
    rules: [
      "This is strictly an individual competition with no pre-designed templates or external work permitted.",
      "Participants must bring their own charged devices (laptop/iPad/tablet) and designing tools.",
      "The rulebook specifies an event duration of 50 minutes, but also notes a total time limit of 1 hour and 30 minutes for submission."
    ],
    criteria: [
      "Shortlisting will be based on creativity and originality.",
      "Judges will look for visual appeal, design quality, and concept storytelling.",
      "The accurate representation of the assigned celebrity's aura is a key evaluation metric."
    ],
  },
  {
    id: "cineverse",
    icon: Palette,
    title: "Cineverse",
    category: "NON-TECH",
    prize: "TBD",
    teamSize: "Any Size",
    teamSizeLabel: "FORMAT",
    duration: "Offline Finals",
    day: "002",
    entryFee: "TBD",
    theme: "orange",
    rulebookUrl: "https://drive.google.com/file/d/1cgB9s2y6E7ivKWrTNvh7DYowvz7QxoAU/preview",
    watermark: "08",
    description: "Short film making competition.",
    overview: "A filmmaking competition where participants create and complete a short film prior to the event, submitting it via Google Drive. The submitted content must be completely original and free from copyright violations.",
    rules: [
      "Teams can consist of any number of members with a flat ₹120 registration fee per team.",
      "The film's duration must be strictly between 4 and 5 minutes.",
      "All participants are required to join the event lobby at least 15 minutes before it starts.",
      "Late submissions will not be considered."
    ],
    criteria: [
      "Shortlisting and evaluation will be based on the film's story, concept, and creativity.",
      "Judges will also score the acting performance and overall presentation/impact."
    ],
  },
  {
    id: "circuit-crawl",
    icon: Zap,
    title: "Circuit Crawl",
    category: "TECHNICAL",
    prize: "TBD",
    teamSize: "Min 5",
    teamSizeLabel: "FORMAT",
    duration: "Offline",
    day: "001 & 002",
    entryFee: "TBD",
    theme: "purple",
    rulebookUrl: "https://drive.google.com/file/d/1WV0U7e-uMVoG4X5nUR5wMHY_aB06ZwLf/preview",
    watermark: "09",
    description: "Every curve holds a challenge.",
    overview: "An autonomous line follower robot competition. Teams must build a mobile machine that can detect and follow predefined paths consisting of either a black line on a white surface or vice versa.",
    rules: [
      "Each team must have a minimum of 5 members.",
      "The robot must be strictly autonomous with no Wi-Fi or Bluetooth communication allowed.",
      "Robot dimensions are restricted to 25 x 25 x 25 cm, and weight must not exceed 1 kg.",
      "Two physical touches are allowed per round; subsequent touches result in a 10-second penalty each."
    ],
    criteria: [
      "Participants are shortlisted in Round 1 based on the completion time of a basic track.",
      "The winner is the team finishing the complex track of Round 2 in the shortest time.",
      "Time bonuses are awarded for checkpoint indications, line inversion indications, and stopping at the end of the track."
    ],
  },
  {
    id: "evadex",
    icon: Swords,
    title: "Evade-X",
    category: "TECHNICAL",
    prize: "TBD",
    teamSize: "2 - 4",
    teamSizeLabel: "FORMAT",
    duration: "Offline",
    day: "001 & 002",
    entryFee: "TBD",
    theme: "teal",
    rulebookUrl: "https://drive.google.com/file/d/19qHWLouS6_GdrPjQ9205eXye4osJx2T9/preview",
    watermark: "10",
    description: "Escape Limits, Embrace Innovation.",
    overview: "A robotics competition challenging teams to design a wired or wireless robot capable of manually operating and navigating through all turns of a specialized track.",
    rules: [
      "Teams must consist of 2 to 4 participants with a registration fee of ₹120 per team.",
      "Robots must not exceed 25 x 25 x 25 cm dimensions or 3.0 kg in weight (with a 10% tolerance allowed for both).",
      "The machine must be electrically powered with a maximum operating voltage of 16.8 volts; Lego kits and IC engines are prohibited.",
      "Only one driver is permitted per bot during a single event."
    ],
    criteria: [
      "The robot that successfully completes the specified task and track in the least amount of time will be declared the winner."
    ],
  },
  {
    id: "ai-argumentarium",
    icon: Brain,
    title: "The AI Argumentarium",
    category: "NON-TECH",
    prize: "TBD",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "Offline",
    day: "002",
    entryFee: "₹100 / person",
    theme: "yellow",
    rulebookUrl: "https://drive.google.com/file/d/1xODG1S779xIJxol8Jbk3Q8wOxFwdI91t/preview",
    isWide: true,
    leftPoolLayout: true,
    watermark: "11",
    description: "Oxford Style Debate (Modified).",
    overview: "Participants will compete as individual speakers in a modified Oxford-style debate. Their stance (For or Against) will be assigned randomly through a lottery system. The debate will be trilingual, permitting English, Bengali, and Hindi, though speakers must stick to one chosen language throughout.",
    rules: [
      "The speaking order alternates between FOR and AGAINST the motion.",
      "Preliminary rounds consist of a 2-minute main speech and a 1-minute rebuttal, while final rounds extend the main speech to 3 minutes.",
      "Prelims motion is released 48 hours prior, and Finals motion is tentatively released 1 hour prior to commencement.",
      "Overreliance on AI-generated content or plagiarism is prohibited and may result in disqualification."
    ],
    criteria: [
      "Marking and qualification will be assessed based on individual performances.",
      "The top 30% of speakers from each stance (FOR and AGAINST) will qualify for the Finals based on their individual scores."
    ],
  },
  {
    id: "cultural-program",
    icon: Sparkles,
    title: "Cultural Program",
    category: "NON-TECH",
    prize: "TBD",
    teamSize: "TBA",
    teamSizeLabel: "FORMAT",
    duration: "TBA",
    day: "TBA",
    entryFee: "TBD",
    theme: "pink",
    rulebookUrl: "",
    watermark: "12",
    description: "Cultural Program Description (Placeholder).",
    overview: "Cultural Program Overview (Placeholder).",
    rules: [
      "Rule 1 Placeholder",
      "Rule 2 Placeholder"
    ],
    criteria: [
      "Criteria 1 Placeholder",
      "Criteria 2 Placeholder"
    ],
  },
];

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

  const getWrapperGradient = () => {
    if (theme.iconText.includes("orange")) return "bg-gradient-to-r from-orange-600 via-orange-400 to-orange-500";
    if (theme.iconText.includes("purple")) return "bg-gradient-to-r from-purple-600 via-purple-400 to-purple-500";
    if (theme.iconText.includes("teal")) return "bg-gradient-to-r from-teal-600 via-teal-400 to-teal-500";
    if (theme.iconText.includes("amber") || theme.iconText.includes("yellow")) return "bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500";
    if (theme.iconText.includes("pink")) return "bg-gradient-to-r from-pink-600 via-pink-400 to-pink-500";
    if (theme.iconText.includes("sky") || theme.iconText.includes("blue")) return "bg-gradient-to-r from-sky-600 via-sky-400 to-sky-500";
    return "bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500";
  };

  return (
    <div className={`relative p-[2px] rounded-[26px] ${getWrapperGradient()} ${isWide ? "md:col-span-2" : "md:col-span-1"}`}>
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
        className={`relative group overflow-hidden rounded-[24px] bg-[#0c0d0e]/85 backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-300 cursor-pointer w-full h-full`}
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
    </div>
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
            {event.prize && event.prize !== "N/A" && event.prize !== "TBA" && (
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
            )}

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
                  {event.prize && event.prize !== "N/A" && event.prize !== "TBA" && (
                    <div className="md:hidden">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono">PRIZE</span>
                      <span className={`text-sm font-semibold ${theme.iconText}`}>{event.prize}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold font-semibold">FORMAT</span>
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
              {event.prize && event.prize !== "N/A" && event.prize !== "TBA" && (
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
              )}
            </div>

            {/* Bottom details */}
            <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5 relative z-10">
              <div className="flex flex-wrap gap-3 sm:gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold">FORMAT</span>
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
            {event.prize && event.prize !== "N/A" && event.prize !== "TBA" && (
              <div>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-mono">PRIZE</span>
                <span className={`text-xs font-semibold ${theme.iconText}`}>{event.prize}</span>
              </div>
            )}
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-mono font-semibold">
                FORMAT
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

const getBorderColor = (theme: string) => {
  if (theme === "orange" || theme === "yellow") return "var(--border-color-1)";
  if (theme === "purple" || theme === "pink") return "var(--border-color-2)";
  return "var(--border-color-3)";
}

const getHoverTextColor = (theme: string) => {
  if (theme === "orange" || theme === "yellow") return "var(--hover-text-color-1)";
  if (theme === "purple" || theme === "pink") return "var(--hover-text-color-2)";
  return "var(--hover-text-color-3)";
}

const getEventImage = (id: string) => {
  if (id === "circuit-crawl") return "/circuit-crawl-bg.png";
  return "/event-bg.png";
};

const getEventOverlayImage = (id: string) => {
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
  };
  return overlayMap[id] || undefined;
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-visible"
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
                  className={event.isWide ? "md:col-span-2 relative overflow-visible" : "md:col-span-1 relative overflow-visible"}
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
                  <div onClick={() => setSelectedEvent(event)} className="w-full h-full min-h-[300px]">
                    <InfoCard
                      image={getEventImage(event.id)}
                      overlayImage={getEventOverlayImage(event.id)}
                      title={event.title}
                      description={event.description}
                      prize={event.prize}
                      format={event.duration}
                      entryFee={event.entryFee}
                      day={event.day}
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
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
              onClick={() => { setSelectedEvent(null); setShowRulebook(false); }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-2xl max-h-[90vh] rounded-[1.5rem] overflow-hidden flex flex-col backdrop-blur-xl bg-[rgba(85,80,110,0.4)] border border-[rgba(164,132,215,0.5)] shadow-[0_0_20px_rgba(123,57,252,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]"
                onClick={(e) => e.stopPropagation()}
              >
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
                        const overlayImg = getEventOverlayImage(selectedEvent.id);
                        if (overlayImg) {
                          return <img src={overlayImg} alt={`${selectedEvent.title} logo`} className="w-full h-full object-contain p-1.5" />;
                        }
                        const Icon = selectedEvent.icon;
                        return <Icon className={themes[selectedEvent.theme].iconText} size={24} />;
                      })()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 border rounded uppercase mb-1 inline-block ${themes[selectedEvent.theme].badge}`}>
                        {selectedEvent.category}
                      </span>
                      <h3 className={`text-lg md:text-2xl font-bold font-mono ${themes[selectedEvent.theme].iconText} flex items-center truncate`}>
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
                        <span className={`text-[9px] md:text-[10px] uppercase tracking-wider ${themes[selectedEvent.theme].iconText} block font-mono`}>PRIZE POOL</span>
                        <span className="text-sm md:text-lg font-bold font-mono text-white">
                          {selectedEvent.prize}
                        </span>
                      </div>
                    )}
                    <div className={`text-center ${selectedEvent.prize && selectedEvent.prize !== "N/A" && selectedEvent.prize !== "TBA" ? 'border-x' : 'border-r'} border-white/5`}>
                      <span className={`text-[9px] md:text-[10px] uppercase tracking-wider ${themes[selectedEvent.theme].iconText} block font-mono`}>
                        {"teamSizeLabel" in selectedEvent ? selectedEvent.teamSizeLabel : "TEAM"}
                      </span>
                      <span className="text-sm md:text-lg font-bold font-mono text-white">
                        {selectedEvent.teamSize}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`text-[9px] md:text-[10px] uppercase tracking-wider ${themes[selectedEvent.theme].iconText} block font-mono`}>TIMING</span>
                      <span className="text-xs md:text-base font-bold font-mono text-white">
                        {selectedEvent.duration}
                      </span>
                    </div>
                  </div>

                  {/* Overview */}
                  <div>
                    <h4 className={`text-xs uppercase tracking-wider font-semibold font-mono mb-2 ${themes[selectedEvent.theme].iconText}`}>
                      Overview
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed font-mono">
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
                              <span className="font-mono">{rule}</span>
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
                              <span className="font-mono">{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 md:p-8 border-t border-white/5 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end relative z-10 bg-[#0c0d0e]/50">
                  <button
                    onClick={() => setShowRulebook(true)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-white/10 text-white font-mono font-semibold uppercase tracking-wider transition-all duration-300 text-center text-sm bg-transparent hover:bg-white/5 hover:border-white/20 shrink-0"
                  >
                    Rulebook
                  </button>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full sm:w-auto relative overflow-hidden font-mono font-semibold uppercase tracking-wider px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-center text-sm ${selectedEvent.theme === "orange" ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]" :
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
              className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
              onClick={() => setShowRulebook(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-4xl rounded-[1.5rem] overflow-hidden h-[90vh] flex flex-col backdrop-blur-xl bg-[rgba(85,80,110,0.4)] border border-[rgba(164,132,215,0.5)] shadow-[0_0_20px_rgba(123,57,252,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]"
                onClick={(e) => e.stopPropagation()}
              >
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
                  <h3 className={`text-base md:text-xl font-bold font-mono ${themes[selectedEvent.theme].iconText} flex items-center min-w-0 flex-1 truncate`}>
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
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      Rulebook coming soon...
                    </div>
                  )}
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
