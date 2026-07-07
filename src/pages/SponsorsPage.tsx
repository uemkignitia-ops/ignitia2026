import { useRef, useMemo, useState, useEffect } from "react";
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
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";
import BackgroundEffects from "@/components/BackgroundEffects";
import { TerminalSubheading } from "@/components/TerminalSubheading";
import { useIsMobile } from "@/hooks/use-mobile";

// ─── Real sponsor data templates ──────────────────────────────────────────────
const CATEGORY_TEMPLATES = [
  {
    key: "gold",
    masterHeading: "Gold Sponsors",
    accent: "from-amber-500 to-yellow-400",
    accentRgb: "245,158,11",
    icon: Star,
    color: "from-amber-500 to-yellow-400",
    benefits: [
      "Logo on website & posters",
      "Booth space",
      "Social media mention",
      "Certificate branding",
    ]
  },
  {
    key: "silver",
    masterHeading: "Silver Sponsors",
    accent: "from-slate-400 to-slate-500",
    accentRgb: "148,163,184",
    icon: Award,
    color: "from-slate-400 to-slate-500",
    benefits: [
      "Logo on website",
      "Banner space",
      "Social media shoutout",
    ]
  },
  {
    key: "bronze",
    masterHeading: "Bronze Sponsors",
    accent: "from-orange-600 to-orange-800",
    accentRgb: "194,65,12",
    icon: Hexagon,
    color: "from-orange-600 to-orange-800",
    benefits: [
      "Logo on website",
      "Social media thank you",
    ]
  },
  {
    key: "hosting",
    masterHeading: "Hosting Partner",
    accent: "from-blue-500 to-orange-400",
    accentRgb: "59,130,246",
    icon: Server,
    color: "from-blue-500 to-orange-400",
    benefits: [
      "Logo on website",
      "Hosting credits for participants",
      "Social media mention",
    ]
  },
  {
    key: "community",
    masterHeading: "Community Partner",
    accent: "from-violet-500 to-purple-400",
    accentRgb: "139,92,246",
    icon: Users,
    color: "from-violet-500 to-purple-400",
    benefits: [
      "Community outreach",
      "Platform access",
      "Joint promotion",
    ]
  },
  {
    key: "ongoing",
    masterHeading: "Ongoing Sponsors",
    accent: "from-pink-500 to-rose-400",
    accentRgb: "236,72,153",
    icon: Gem,
    color: "from-pink-500 to-rose-400",
    benefits: [
      "Active engagement",
      "Brand visibility",
    ]
  }
];

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
        className="flex-1 flex items-center justify-center p-3 w-full aspect-square max-h-24 sm:max-h-28 mb-4 overflow-hidden rounded-xl bg-white/[0.01]"
      >
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="max-w-full max-h-full object-contain filter group-hover:scale-[1.05] transition-transform duration-500"
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
  const [sponsorsList, setSponsorsList] = useState<any[]>([]);

  useEffect(() => {
    import("@/lib/datastore").then((m) => {
      m.getSponsors().then(setSponsorsList);
    });
  }, []);

  const dynamicCategories = useMemo(() => {
    return CATEGORY_TEMPLATES.map((tpl) => {
      const items = sponsorsList.filter((s) => s.category === tpl.key);
      return {
        masterHeading: tpl.masterHeading,
        accent: tpl.accent,
        accentRgb: tpl.accentRgb,
        tiers: [
          {
            tier: tpl.masterHeading,
            icon: tpl.icon,
            color: tpl.color,
            accentRgb: tpl.accentRgb,
            benefits: tpl.benefits,
            sponsors: items,
          }
        ]
      };
    }).filter(cat => cat.tiers[0].sponsors.length > 0);
  }, [sponsorsList]);

  const allSponsorsUnique = useMemo(() => {
    const seen = new Set<string>();
    return sponsorsList.filter((s) => {
      if (seen.has(s.name)) return false;
      seen.add(s.name);
      return true;
    });
  }, [sponsorsList]);

  return (
    <div
      className="min-h-screen bg-transparent overflow-x-hidden citadel-theme relative"
      ref={containerRef}
    >
      <BackgroundEffects />
      <PageTransition>
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



          {/* Main Title — perspective tilt */}
          <div className="relative w-full" style={{ perspective: "800px" }}>
            <motion.div
              initial={{ opacity: 0, rotateX: 12, y: 30 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="w-full flex justify-center z-[36] pointer-events-none text-center mt-8 mb-4">
                <h1 className="hero-title-block leading-[0.82] select-none text-center mb-0">
                  <span className="ignitia-citadel-title mx-auto" data-text="SPONSORS">
                    <span>S</span>
                    <span>P</span>
                    <span>O</span>
                    <span>N</span>
                    <span>S</span>
                    <span>O</span>
                    <span>R</span>
                    <span>S</span>
                  </span>
                </h1>
              </div>
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
                  alt={(s as any).alt || s.name}
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
            {dynamicCategories.map((category, catIdx) => (
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

                        {/* Continuous loop marquee for benefits description */}
                        {tierData.benefits && tierData.benefits.length > 0 && (
                          <div className="relative overflow-hidden w-full max-w-2xl mx-auto mb-10 h-8 flex items-center">
                            {/* Left & Right fading shadows */}
                            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                            <motion.div
                              animate={{ x: ["0%", "-50%"] }}
                              transition={{
                                duration: 15,
                                ease: "linear",
                                repeat: Infinity,
                              }}
                              className="flex whitespace-nowrap items-center"
                            >
                              {[
                                ...tierData.benefits,
                                ...tierData.benefits,
                                ...tierData.benefits,
                                ...tierData.benefits,
                              ].map((benefit, bIdx) => (
                                <span
                                  key={bIdx}
                                  className="px-3.5 py-1 mx-3 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-['Orbitron'] text-muted-foreground uppercase tracking-widest flex items-center gap-2 shrink-0"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{ backgroundColor: `rgb(${tierData.accentRgb})` }}
                                  />
                                  {benefit}
                                </span>
                              ))}
                            </motion.div>
                          </div>
                        )}

                        {/* Sponsor cards flex grid */}
                        <div
                          className={`flex flex-wrap justify-center gap-5 mx-auto ${isSingle
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
      </PageTransition>
    </div>
  );
};

export default SponsorsPage;
