import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Calendar, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";
import { useIsMobile } from "@/hooks/use-mobile";
import { TerminalSubheading } from "@/components/TerminalSubheading";

const schedule = {
  "Day 1 — Aug 1": [
    {
      time: "09:00 AM",
      title: "Opening Ceremony",
      venue: "Main Auditorium",
      color: "bg-primary",
    },
    {
      time: "10:00 AM",
      title: "Ideathon Kickoff",
      venue: "Hall A",
      color: "bg-neon-cyan",
    },
    {
      time: "10:30 AM",
      title: "Coding Quest — Round 1",
      venue: "Lab Complex",
      color: "bg-secondary",
    },
    {
      time: "12:00 PM",
      title: "Quiz — Prelims",
      venue: "Hall B",
      color: "bg-neon-pink",
    },
    {
      time: "02:00 PM",
      title: "Gaming Arena Opens",
      venue: "Gaming Zone",
      color: "bg-primary",
    },
    {
      time: "03:00 PM",
      title: "Game Dev Hackathon Starts",
      venue: "Innovation Lab",
      color: "bg-neon-cyan",
    },
    {
      time: "05:00 PM",
      title: "Cultural Performances",
      venue: "Open Stage",
      color: "bg-secondary",
    },
    {
      time: "07:00 PM",
      title: "Day 1 Wrap-up",
      venue: "Main Auditorium",
      color: "bg-neon-pink",
    },
  ],
  "Day 2 — Aug 2": [
    {
      time: "09:00 AM",
      title: "Coding Quest — Finals",
      venue: "Lab Complex",
      color: "bg-primary",
    },
    {
      time: "10:00 AM",
      title: "Ideathon Presentations",
      venue: "Hall A",
      color: "bg-neon-cyan",
    },
    {
      time: "11:00 AM",
      title: "Quiz — Finals",
      venue: "Hall B",
      color: "bg-secondary",
    },
    {
      time: "12:00 PM",
      title: "Guess Who",
      venue: "Mystery Zone",
      color: "bg-neon-pink",
    },
    {
      time: "02:00 PM",
      title: "Gaming Finals",
      venue: "Gaming Zone",
      color: "bg-primary",
    },
    {
      time: "03:00 PM",
      title: "Game Dev Submissions",
      venue: "Innovation Lab",
      color: "bg-neon-cyan",
    },
    {
      time: "04:00 PM",
      title: "Cultural Finale",
      venue: "Open Stage",
      color: "bg-secondary",
    },
    {
      time: "06:00 PM",
      title: "Closing Ceremony & Prizes",
      venue: "Main Auditorium",
      color: "bg-neon-pink",
    },
  ],
};

export interface NodeConfig {
  x: number;
  y: number;
  cp1X: number;
  cp1Y: number;
  cp2X: number;
  cp2Y: number;
}

// Organic Path Generator using randomized NodeConfigs
const generateZigzagPath = (layout: NodeConfig[]) => {
  if (layout.length === 0) return "";
  let d = "M 400,0 ";
  for (let i = 0; i < layout.length; i++) {
    const node = layout[i];
    if (i === 0) {
      d += `C 400,60 ${node.x},60 ${node.x},${node.y} `;
    } else {
      d += `C ${node.cp1X},${node.cp1Y} ${node.cp2X},${node.cp2Y} ${node.x},${node.y} `;
    }
  }
  const lastNode = layout[layout.length - 1];
  d += `C ${lastNode.x},${lastNode.y + 80} 400,${lastNode.y + 120} 400,${lastNode.y + 240}`;
  return d;
};

const SvgPath = ({ layout, totalH }: { layout: NodeConfig[]; totalH: number }) => {
  const d = generateZigzagPath(layout);
  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 zigzag-path-svg"
      viewBox={`0 0 800 ${totalH}`}
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Faint base dotted line */}
      <path
        className="zigzag-path-line"
        d={d}
        stroke="url(#zigzag-grad)"
        strokeOpacity="0.2"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="12 8"
        fill="none"
      />
      {/* Solid glowing neon line that fills as you scroll */}
      <path
        id="neon-path-line"
        d={d}
        stroke="url(#zigzag-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        filter="drop-shadow(0 0 8px rgba(147,51,234,0.8))"
      />
      <defs>
        <linearGradient id="zigzag-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="1" />
          <stop offset="50%" stopColor="#9333ea" stopOpacity="1" />
          <stop offset="100%" stopColor="#e9d5ff" stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const ScrambleText = ({ text, isHovered }: { text: string, isHovered: boolean }) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (isHovered) {
      let iterations = 0;
      const interval = setInterval(() => {
        setDisplayText(text.split('').map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iterations) return text[index];
          return String.fromCharCode(33 + Math.floor(Math.random() * 94));
        }).join(''));

        iterations += 1 / 3;
        if (iterations >= text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayText(text);
    }
  }, [isHovered, text]);

  return <>{displayText}</>;
};

interface ScheduleItem {
  time: string;
  title: string;
  venue: string;
  color?: string;
}

const ZigzagNode = ({
  item, index, isRight, totalH, isCrossed, nodeConfig
}: {
  item: ScheduleItem; index: number; isRight: boolean; totalH: number; isCrossed: boolean; nodeConfig: NodeConfig;
}) => {
  const topPercent = (nodeConfig.y / totalH) * 100;
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  // Dot position relative to 800px SVG
  const dotLeft = `${(nodeConfig.x / 800) * 100}%`;

  // Calculate the card's position relative to the dot.
  // Left nodes (isRight=false): Place card to the right of the dot.
  // Right nodes (isRight=true): Place card to the left of the dot.
  const cardStyle = isMobile
    ? { left: '50%', marginLeft: '-140px', marginTop: '32px', width: '280px' }
    : isRight 
      ? { right: `${((800 - nodeConfig.x) / 800) * 100 + 4}%`, width: '320px' } 
      : { left: `${(nodeConfig.x / 800) * 100 + 4}%`, width: '320px' };

  return (
    <div
      className="absolute w-full z-10 pointer-events-none"
      style={{ top: `${topPercent}%` }}
    >
      {/* Node Dot */}
      <div 
        className="absolute w-5 h-5 -mt-2.5 bg-[#0b0614] rounded-full border-[3px] border-[#ffd700] shadow-[0_0_15px_#ffd700] z-30 transition-all duration-500 pointer-events-auto"
        style={{ 
           left: dotLeft,
           transform: 'translateX(-50%)',
           borderColor: isCrossed ? '#9333ea' : '#ffd700',
           boxShadow: isCrossed ? '0 0 20px #9333ea' : '0 0 15px #ffd700',
           scale: isHovered ? 1.2 : 1
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Node Unlock Pulse Rings */}
        {isCrossed && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-[#9333ea]"
          />
        )}
      </div>

      {/* Card — Holographic Glitch Reveal */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02, x: isMobile ? 0 : (isRight ? -5 : 5) }}
        initial={{ opacity: 0, x: isMobile ? 0 : (isRight ? 50 : -50), y: isMobile ? 20 : 0 }}
        animate={isCrossed ? { 
            opacity: 1, 
            x: isMobile ? 0 : [isRight ? 30 : -30, isRight ? -5 : 5, 0],
            y: isMobile ? [10, -5, 0] : 0,
            skewX: [10, -5, 0],
            filter: ["drop-shadow(5px 0px 0px rgba(255,0,0,0.5)) drop-shadow(-5px 0px 0px rgba(0,255,255,0.5)) blur(4px)", "blur(0px)"]
        } : { opacity: 0, x: isMobile ? 0 : (isRight ? 50 : -50), y: isMobile ? 20 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`absolute z-10 pointer-events-auto flex max-w-[85vw] md:max-w-none`}
        style={cardStyle}
      >
        <motion.div
          animate={isCrossed ? { y: [0, -6, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full rounded-xl overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 z-0 bg-[#0b0614]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_75%,#9333ea_100%)] opacity-80"
            />
          </div>

          <div className="absolute inset-[1px] bg-[#0b0614]/90 backdrop-blur-md rounded-xl z-10" />

          <div
            className="absolute inset-0 z-10 opacity-10 mix-blend-overlay pointer-events-none rounded-xl"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
          />

          <motion.div
            animate={isCrossed ? { top: ['-100%', '200%'] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
            className="absolute left-0 w-full h-[50%] bg-gradient-to-b from-transparent via-[#ffd700]/10 to-transparent z-10 pointer-events-none"
          />

          <div className="relative p-4 md:p-5 w-full z-20">
            <motion.div
              animate={isCrossed ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute inset-y-0 w-[2px] ${isMobile ? 'left-0' : (isRight ? "left-0" : "right-0")} bg-gradient-to-b from-[#ffd700] via-[#9333ea] to-transparent`}
            />

            <h4 className="font-heading font-bold text-white/90 text-sm md:text-base mb-2 leading-snug">
              {item.title}
            </h4>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-white/55">
                <Clock size={12} className="text-[#ffd700] shrink-0" />
                <span className="font-mono text-[11px]">
                  <ScrambleText text={item.time} isHovered={isHovered} />
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/55">
                <MapPin size={12} className="text-[#9333ea] shrink-0" />
                <span className="font-body text-[11px]">
                  <ScrambleText text={item.venue} isHovered={isHovered} />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const Schedule = () => {
  const days = Object.keys(schedule);
  const [activeDay, setActiveDay] = useState(days[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [crossedNodes, setCrossedNodes] = useState<Set<number>>(new Set());
  const crossedRef = useRef<Set<number>>(new Set());
  
  const [layoutConfig, setLayoutConfig] = useState<NodeConfig[]>([]);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const currentItems = schedule[activeDay as keyof typeof schedule];
  const itemCount = currentItems.length;

  useEffect(() => {
    // Reset crossed nodes when changing days
    setCrossedNodes(new Set());
    crossedRef.current = new Set();
    
    // Generate mathematically perfect smooth S-curve layout
    const newLayout: NodeConfig[] = [];
    let currentY = 120; // Starting Y
    for (let i = 0; i < itemCount; i++) {
        const isRight = i % 2 !== 0;
        
        // Random X position for the dot (sweep width)
        // Left zone: 80-180 (far left), Right zone: 620-720 (far right)
        const x = isRight ? 620 + Math.random() * 100 : 80 + Math.random() * 100;
        
        let cp1X = 400, cp1Y = 60, cp2X = x, cp2Y = currentY - 60;
        
        if (i > 0) {
            const prev = newLayout[i - 1];
            // Random vertical gap between 220 and 450 (needs more vertical space for big sweeps)
            const gap = 220 + Math.random() * 230;
            currentY = prev.y + gap;
            
            // To guarantee ZERO kinks, the control points must have the exact same X as the node.
            // This forces the curve to cross the node perfectly vertically (tangent dx/dy = 0).
            // We organically randomize the "tension" (how fat the curve loops vertically).
            const tension1 = gap * (0.4 + Math.random() * 0.4); // 40% to 80% of gap height
            const tension2 = gap * (0.4 + Math.random() * 0.4);
            
            cp1X = prev.x;
            cp1Y = prev.y + tension1; // Pulling straight down from previous node
            cp2X = x;
            cp2Y = currentY - tension2; // Pulling straight up from current node
        }

        newLayout.push({ x, y: currentY, cp1X, cp1Y, cp2X, cp2Y });
    }
    
    setLayoutConfig(newLayout);
    if (newLayout.length > 0) {
        setContainerHeight(newLayout[newLayout.length - 1].y + 240);
    } else {
        setContainerHeight(500);
    }
  }, [activeDay, itemCount]);

  useEffect(() => {
    if (layoutConfig.length === 0) return;
    
    const logo = document.getElementById('timeline-logo');
    const path = document.querySelector('.zigzag-path-line') as SVGPathElement;
    const map = containerRef.current;

    if (!logo || !path || !map) return;

    let rafId: number;
    let pathLength = 0;
    let currentPercent = -1;

    try {
      pathLength = path.getTotalLength();
    } catch (e) { return; }

    const svg = path.ownerSVGElement;
    if (!svg) return;

    const moveLogo = () => {
      const mapRect = map.getBoundingClientRect();
      const windowH = window.innerHeight;
      const centerY = windowH / 2;

      let targetPercent = (centerY - mapRect.top) / mapRect.height;
      targetPercent = Math.max(0, Math.min(1, targetPercent));

      if (currentPercent === -1) {
        currentPercent = targetPercent;
      }

      currentPercent += (targetPercent - currentPercent) * 0.08;

      if (svg && svg.viewBox.baseVal.width > 0) {
        const pos = path.getPointAtLength(currentPercent * pathLength);
        const x = pos.x * (map.clientWidth / svg.viewBox.baseVal.width);
        const y = pos.y * (map.clientHeight / svg.viewBox.baseVal.height);

        logo.style.left = `${x}px`;
        logo.style.top = `${y}px`;

        const neonPath = document.getElementById('neon-path-line');
        if (neonPath) {
          neonPath.style.strokeDasharray = String(pathLength);
          neonPath.style.strokeDashoffset = String(pathLength - currentPercent * pathLength);
        }

        const newCrossed = new Set(crossedRef.current);
        let changed = false;
        for (let i = 0; i < itemCount; i++) {
          if (!layoutConfig[i]) continue;
          const ySvgNode = layoutConfig[i].y;
          if (pos.y >= ySvgNode - 20) {
            if (!newCrossed.has(i)) {
              newCrossed.add(i);
              changed = true;
            }
          } else {
            if (newCrossed.has(i)) {
              newCrossed.delete(i);
              changed = true;
            }
          }
        }
        if (changed) {
          crossedRef.current = newCrossed;
          setCrossedNodes(newCrossed);
        }

        if (Math.random() > 0.5) {
          const particle = document.createElement('div');
          particle.className = "absolute w-1.5 h-1.5 rounded-full pointer-events-none z-20";
          particle.style.backgroundColor = Math.random() > 0.5 ? '#ffd700' : '#9333ea';
          particle.style.boxShadow = `0 0 8px ${particle.style.backgroundColor}`;
          particle.style.left = `${x + (Math.random() * 12 - 6)}px`;
          particle.style.top = `${y + (Math.random() * 12 - 6)}px`;
          particle.style.opacity = "0.8";
          particle.style.transition = "all 0.8s cubic-bezier(0.1, 0.8, 0.3, 1)";
          particle.style.transform = "translate(-50%, -50%) scale(1)";

          map.appendChild(particle);

          requestAnimationFrame(() => {
            particle.style.transform = `translate(-50%, calc(-50% - ${20 + Math.random() * 40}px)) scale(0)`;
            particle.style.opacity = "0";
          });

          setTimeout(() => {
            if (map.contains(particle)) {
              map.removeChild(particle);
            }
          }, 800);
        }
      }

      rafId = requestAnimationFrame(moveLogo);
    };

    rafId = requestAnimationFrame(moveLogo);

    return () => cancelAnimationFrame(rafId);
  }, [activeDay, itemCount, layoutConfig]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background scanline-overlay overflow-x-hidden">
        <ParticleField />
        <AnimatedBlobs />
        <ScrollProgress />
        <Navbar />

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
            <Calendar size={14} className="text-primary" /> MASTER PLAN
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
                  EVENT SCHEDULE
                </span>
              </div>

              {/* Actual title */}
              <h1
                className="font-heading font-black uppercase leading-none tracking-tight w-full text-center relative"
                style={{ fontSize: "clamp(2.5rem, 10vw, 5.5rem)", transformStyle: "preserve-3d" }}
              >
                {/* EVENT — dimmer, lighter weight */}
                <span
                  className="inline-block mr-[0.15em]"
                  style={{
                    color: "rgba(255,255,255,0.28)",
                    fontWeight: 300,
                    textShadow: "0 2px 20px rgba(139,92,246,0.1)",
                  }}
                >
                  EVENT
                </span>

                {/* SCHEDULE — full white with 3D purple bloom */}
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
                  SCHEDULE
                </span>
              </h1>
            </motion.div>
          </div>

          <div className="mt-10 mb-6 flex justify-center w-full px-4 relative z-10">
            <TerminalSubheading 
              text="Plan your day and explore the exciting lineup of events at Ignitia 2k26."
              className="text-muted-foreground text-base md:text-lg font-medium text-center max-w-2xl"
            />
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Day tabs */}
            <div className="flex justify-center gap-4 mb-16 relative z-20">
              {days.map((day) => (
                <motion.button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg font-heading font-semibold text-sm transition-all ${activeDay === day
                    ? "bg-[#9333ea]/20 border border-[#9333ea]/50 text-[#e9d5ff] shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    : "bg-white/5 border border-white/10 text-muted-foreground hover:text-white"
                    }`}
                >
                  <Calendar size={14} className="inline mr-2" />
                  {day}
                </motion.button>
              ))}
            </div>

            {/* Zigzag Map Container */}
            <div ref={containerRef} className="relative w-full max-w-4xl mx-auto zigzag-map touch-pan-y" style={{ height: `${containerHeight}px` }}>
              <SvgPath layout={layoutConfig} totalH={containerHeight} />

              <img
                id="timeline-logo"
                src="/phoenix-logo.png"
                alt="Cyber Phoenix Logo"
                className="absolute z-30 pointer-events-none w-10 h-10 object-contain rounded-full bg-[#0b0614] p-1 border-2 border-[#9333ea] shadow-[0_0_15px_rgba(147,51,234,0.6)]"
                style={{ transform: 'translate(-50%, -50%)', top: 0, left: '50%' }}
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = "absolute z-30 pointer-events-none w-8 h-8 rounded-full bg-[#9333ea] border-2 border-white shadow-[0_0_15px_rgba(147,51,234,0.6)] animate-pulse";
                  fallback.style.transform = 'translate(-50%, -50%)';
                  fallback.id = "timeline-logo";
                  e.currentTarget.parentElement?.appendChild(fallback);
                }}
              />

              {layoutConfig.length > 0 && currentItems.map((item, i) => (
                <ZigzagNode
                  key={item.title}
                  item={item}
                  index={i}
                  isRight={i % 2 !== 0}
                  totalH={containerHeight}
                  isCrossed={crossedNodes.has(i)}
                  nodeConfig={layoutConfig[i]}
                />
              ))}
            </div>

            {/* Download CTA at bottom */}
            <div className="text-center mt-24 relative z-20">
              <a href="#"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_30px_rgba(47,143,163,0.5)] transition-all duration-300 font-heading font-bold text-sm uppercase tracking-wider text-white inline-flex items-center gap-3 group">
                <span>Download Full Schedule</span>
                <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
              </a>
            </div>

          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Schedule;
