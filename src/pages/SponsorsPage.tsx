import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Mail,
  Server,
  Terminal,
  Award,
  Star,
  Gem,
  Hexagon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";
import { TerminalSubheading } from "@/components/TerminalSubheading";
import { useIsMobile } from "@/hooks/use-mobile";

// ─── Real sponsor data ────────────────────────────────────────────────────────
const sponsorCategories = [
  {
    masterHeading: "Hosting Partners of IGNITIA",
    accent: "from-blue-500 to-cyan-400",
    accentRgb: "59,130,246",
    tiers: [
      {
        tier: "Hosting Partner",
        icon: Server,
        color: "from-blue-500 to-cyan-400",
        accentRgb: "59,130,246",
        benefits: [
          "Logo on website",
          "Hosting credits for participants",
          "Social media mention",
        ],
        sponsors: [
          { name: "Microsoft Student Society UEMK", logo: "/sponsors/MSS.jpeg" },
        ],
      },
      {
        tier: "Hackathon Partner",
        icon: Terminal,
        color: "from-emerald-500 to-green-400",
        accentRgb: "16,185,129",
        benefits: [
          "API access for hackers",
          "Dedicated prize track",
          "Mentorship during hackathon",
        ],
        sponsors: [
          { name: "Crelynex", logo: "/sponsors/CrelyneX.jpg" },
        ],
      },
    ],
  },
  {
    masterHeading: "Event Collaborators",
    accent: "from-violet-500 to-purple-400",
    accentRgb: "139,92,246",
    tiers: [
      {
        tier: "Platform Partners",
        icon: Award,
        color: "from-violet-500 to-purple-400",
        accentRgb: "139,92,246",
        benefits: [
          "Logo on website",
          "Social media shoutout",
          "Community engagement booth",
        ],
        sponsors: [
          { name: "Unstop", logo: "/sponsors/unstop.png" },
          { name: "Hack2skills", logo: "/sponsors/hack2skill.jpeg" },
          { name: "Go Daddy", logo: "/sponsors/GoDaddy.jpg" },
          { name: "Crelynex", logo: "/sponsors/CrelyneX.jpg" },
        ],
      },
    ],
  },
  {
    masterHeading: "Sponsors",
    accent: "from-amber-500 to-yellow-400",
    accentRgb: "245,158,11",
    tiers: [
      {
        tier: "Gold Sponsors",
        icon: Star,
        color: "from-amber-500 to-yellow-400",
        accentRgb: "245,158,11",
        benefits: [
          "Logo on website & posters",
          "Booth space",
          "Social media mention",
          "Certificate branding",
        ],
        sponsors: [
          { name: "Crelynex", logo: "/sponsors/CrelyneX.jpg" },
          { name: "Microsoft Student Society UEMK", logo: "/sponsors/MSS.jpeg" },
        ],
      },
      {
        tier: "Title Sponsors",
        icon: Gem,
        color: "from-primary to-purple-400",
        accentRgb: "139,92,246",
        benefits: [
          "Logo on all materials",
          "Main stage branding",
          "Dedicated booth",
          "Social media features",
          "Opening ceremony mention",
        ],
        sponsors: [
          { name: "Robo Mellotikos", logo: "/sponsors/robo_mellontikos.jpeg" },
          { name: "UGG UEMK", logo: "/sponsors/UGG.jpg" },
          { name: "DS UEMK", logo: "/sponsors/Dsu.png" },
          { name: "Rangrez", logo: "/sponsors/Rangrez.jpeg" },
          { name: "GDG UEMK", logo: "/sponsors/GDG.jpeg" },
          { name: "Innofusion", logo: "/sponsors/Innofusion_updated.jpg" },
          { name: "Diversion", logo: "/sponsors/Diversion.png" },
          { name: "Oratoria", logo: "/sponsors/Oratoria.jpg" },
          { name: "Technologia", logo: "/sponsors/technologia.jpeg" },
          { name: "Symphony", logo: "/sponsors/Symphony.jpg" },
          { name: "Pragya", logo: "/sponsors/Pragya.jpg" },
          { name: "GFG UEMK", logo: "/sponsors/Gfg.jpg" },
          { name: "Driveblaze", logo: "/sponsors/Driveblaze.jpg" },
        ],
      },
    ],
  },
];

// ─── Marquee — all unique sponsors ───────────────────────────────────────────
const allSponsorsUnique = (() => {
  const seen = new Set<string>();
  return sponsorCategories
    .flatMap((c) => c.tiers.flatMap((t) => t.sponsors))
    .filter((s) => {
      if (seen.has(s.name)) return false;
      seen.add(s.name);
      return true;
    });
})();

// ─── Sponsor card ─────────────────────────────────────────────────────────────
const SponsorCard = ({
  sponsor,
  color,
  accentRgb,
  index,
  large = false,
  className = "",
}: {
  sponsor: { name: string; logo: string };
  color: string;
  accentRgb: string;
  index: number;
  large?: boolean;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.07, duration: 0.45 }}
    whileHover={{ y: -6, scale: 1.03 }}
    className={`group relative ${className}`}
  >
    {/* Glow halo on hover */}
    <div
      className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-25 blur-xl transition-all duration-500`}
    />

    <div
      className="relative h-full border border-white/8 bg-[#0B0A10]/80 backdrop-blur-sm rounded-2xl overflow-hidden
                 flex flex-col items-center p-5 transition-all duration-300
                 hover:border-white/20 hover:bg-[#0d0c16]/90"
    >
      {/* Top colour bar */}
      <div
        className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${color} opacity-60`}
      />

      {/* Logo */}
      <div
        className={`w-full flex items-center justify-center bg-white/5 rounded-xl mb-4
                    transition-colors group-hover:bg-white/10 ${large ? "h-36 p-4" : "h-24 p-3"}`}
      >
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Name */}
      <p
        className={`font-heading font-bold text-center text-white/85 leading-tight w-full break-words
                    ${large ? "text-base" : "text-xs sm:text-sm"}`}
      >
        {sponsor.name}
      </p>
    </div>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const SponsorsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-background scanline-overlay overflow-x-hidden"
        ref={containerRef}
      >
        <ParticleField />
        <AnimatedBlobs />
        <ScrollProgress />
        <Navbar />

        {/* ── Hero Header (purple — preserved) ────────────────────────────── */}
        <section className="relative pt-28 pb-12 overflow-hidden w-full">
          {/* Radial purple ambient glow */}
          <div
            className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 60% 40%, rgba(139,92,246,0.22) 0%, transparent 70%)",
            }}
          />

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-[11px] md:text-xs text-primary uppercase tracking-[0.45em] mb-5 font-semibold font-mono flex items-center justify-center gap-2"
          >
            <Hexagon size={13} className="text-primary shrink-0" /> PARTNERS
          </motion.p>

          {/* Main Title — perspective tilt */}
          <div className="relative w-full" style={{ perspective: "800px" }}>
            <motion.div
              initial={{ opacity: 0, rotateX: 12, y: 30 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Depth clone */}
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
                  OUR SPONSORS
                </span>
              </div>

              <h1
                className="font-heading font-black uppercase leading-none tracking-tight w-full text-center relative"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 5.5rem)",
                  transformStyle: "preserve-3d",
                }}
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
                  SPONSORS
                </span>
              </h1>
            </motion.div>
          </div>

          <div className="mt-10 mb-6 flex justify-center w-full px-4 relative z-10">
            <TerminalSubheading 
              text="The visionaries and industry leaders powering the future of technology at Ignitia 2k26."
              className="text-muted-foreground text-sm md:text-base font-medium text-center max-w-2xl"
            />
          </div>
        </section>

        {/* ── Scrolling Marquee ───────────────────────────────────────────── */}
        <div className="relative py-6 overflow-hidden border-y border-white/5">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: isMobile ? 10 : 18, ease: "linear", repeat: Infinity }}
            className="flex whitespace-nowrap"
          >
            {[...allSponsorsUnique, ...allSponsorsUnique].map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 sm:gap-3 mx-3 sm:mx-6 px-3 sm:px-5 py-2 rounded-full border border-white/8 bg-white/[0.03] text-xs sm:text-sm text-muted-foreground font-mono shrink-0 max-w-[200px] sm:max-w-none"
              >
                <img
                  src={s.logo}
                  alt={s.name}
                  className="h-4 sm:h-5 w-auto object-contain rounded opacity-80 shrink-0"
                />
                <span className="truncate">{s.name}</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Category Sections ───────────────────────────────────────────── */}
        <section className="relative z-20 py-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto space-y-36">
            {sponsorCategories.map((category, catIdx) => (
              <div key={catIdx} className="space-y-20">
                {/* Category heading */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-5"
                >
                  <div
                    className={`h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent`}
                  />
                  <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-[0.18em] text-white/70 text-center px-2">
                    {category.masterHeading}
                  </h2>
                  <div
                    className={`h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-transparent`}
                  />
                </motion.div>

                {/* Tiers within category */}
                <div className="space-y-20">
                  {category.tiers.map((tierData, tierIdx) => {
                    const Icon = tierData.icon;
                    const isSingle = tierData.sponsors.length === 1;
                    const isSmall = tierData.sponsors.length <= 2;
                    const isMedium =
                      tierData.sponsors.length >= 3 &&
                      tierData.sponsors.length <= 4;

                    return (
                      <div key={tierIdx} className="relative">
                        {/* Subtle background blob for this tier */}
                        <div
                          className="absolute -inset-8 rounded-3xl opacity-0 pointer-events-none"
                          style={{
                            background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(${tierData.accentRgb},0.04), transparent)`,
                          }}
                        />

                        {/* Tier label */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3 mb-10"
                        >
                          <div
                            className={`p-2 rounded-xl bg-gradient-to-br ${tierData.color} bg-opacity-10 backdrop-blur-sm border border-white/10`}
                          >
                            <Icon className="text-white" size={20} />
                          </div>
                          <h3
                            className={`text-lg md:text-xl font-mono font-bold bg-gradient-to-r ${tierData.color} bg-clip-text text-transparent`}
                          >
                            {tierData.tier}
                          </h3>

                          {/* Scrolling benefits ticker */}
                          <div className="relative overflow-hidden flex-1 h-6 flex items-center ml-4 hidden md:block">
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
                            <motion.div
                              animate={{ x: ["0%", "-50%"] }}
                              transition={{
                                duration: 10,
                                ease: "linear",
                                repeat: Infinity,
                              }}
                              className="flex whitespace-nowrap items-center"
                            >
                              {[
                                ...tierData.benefits,
                                ...tierData.benefits,
                              ].map((b, i) => (
                                <span
                                  key={i}
                                  className="text-xs text-muted-foreground/60 font-mono flex items-center gap-3 mx-5"
                                >
                                  <span
                                    style={{
                                      color: `rgba(${tierData.accentRgb},0.7)`,
                                    }}
                                  >
                                    ✦
                                  </span>
                                  {b}
                                </span>
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Sponsor cards flex grid */}
                        <div
                          className={`flex flex-wrap justify-center gap-5 mx-auto ${
                            isSingle
                              ? "max-w-xs"
                              : isSmall
                              ? "max-w-xl"
                              : isMedium
                              ? "max-w-4xl"
                              : "max-w-7xl"
                          }`}
                        >
                          {tierData.sponsors.map((sponsor, spIdx) => {
                            let cardWidthClass = "";
                            if (isSingle) cardWidthClass = "w-full";
                            else if (isSmall) cardWidthClass = "w-full sm:w-[calc(50%-10px)]";
                            else if (isMedium) cardWidthClass = "w-[calc(50%-10px)] md:w-[calc(25%-15px)]";
                            else cardWidthClass = "w-[calc(50%-10px)] sm:w-[calc(33.333%-14px)] md:w-[calc(25%-15px)] lg:w-[calc(20%-16px)]";

                            return (
                              <SponsorCard
                                key={spIdx}
                                sponsor={sponsor}
                                color={tierData.color}
                                accentRgb={tierData.accentRgb}
                                index={spIdx}
                                large={isSingle || isSmall}
                                className={cardWidthClass}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Become a Sponsor CTA ────────────────────────────────────────── */}
        <section className="relative py-24 overflow-hidden">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)",
            }}
          />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto border border-primary/20 bg-black/40 backdrop-blur-md p-8 md:p-14 rounded-3xl shadow-[0_0_60px_rgba(139,92,246,0.12)]"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/40 rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/40 rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-primary/40 rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary/40 rounded-br-3xl" />

              <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary/70 mb-4">
                Partner with us
              </p>
              <h2 className="text-3xl md:text-5xl font-heading font-black mb-6">
                Want to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                  Sponsor
                </span>{" "}
                Us?
              </h2>
              <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-sm leading-relaxed">
                Join us in shaping the future of technology. Connect with
                1000&nbsp;+ bright minds and showcase your brand to the next
                generation of innovators.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/brochure.pdf"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="hero-primary-button pulse-cta flex items-center justify-center gap-3"
                >
                  <Download size={16} />
                  Download Brochure
                </motion.a>
                <motion.button
                  onClick={() => navigate('/contact')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="hero-secondary-button glow-button-secondary flex items-center justify-center gap-3"
                >
                  <Mail size={16} />
                  Contact Team
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default SponsorsPage;
