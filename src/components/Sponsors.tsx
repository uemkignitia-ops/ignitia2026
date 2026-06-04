import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const sponsorTiers = [
  { tier: "Hosting Partners", sponsors: [{ name: "Vercel", logo: "/sponsors/CrelyneX.jpg" }] },
  { tier: "Hackathon Partners", sponsors: [{ name: "Devfolio", logo: "/sponsors/CrelyneX.jpg" }] },
  {
    tier: "Title Sponsor",
    sponsors: [
      { name: "TechCorp", logo: "/sponsors/MSS.jpeg" },
      { name: "InnovateLabs", logo: "/sponsors/CrelyneX.jpg" },
    ],
  },
  {
    tier: "Gold Sponsors",
    sponsors: [
      { name: "Crelynex", logo: "/sponsors/CrelyneX.jpg" },
      { name: "Microsoft Student Society UEMK", logo: "/sponsors/MSS.jpeg" },
    ],
  },
  {
    tier: "Community Partners",
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
];

const desktopSponsorTiers = [
  {
    tier: "Hosting partner",
    sponsors: [{ name: "Microsoft Student Society UEMK", logo: "/sponsors/MSS.jpeg" }],
  },
  {
    tier: "Hackathon Partner",
    sponsors: [{ name: "Crelynex", logo: "/sponsors/CrelyneX.jpg" }],
  },
  {
    tier: "Platform Partners",
    sponsors: [
      { name: "Unstop", logo: "/sponsors/unstop.png" },
      { name: "Hack2skills", logo: "/sponsors/hack2skill.jpeg" },
      { name: "Go Daddy", logo: "/sponsors/GoDaddy.jpg" },
      { name: "Crelynex", logo: "/sponsors/CrelyneX.jpg" },
    ],
  },
  {
    tier: "Gold Sponsers",
    sponsors: [
      { name: "Crelynex", logo: "/sponsors/CrelyneX.jpg" },
      { name: "Microsoft Student Society UEMK", logo: "/sponsors/MSS.jpeg" },
    ],
  },
  {
    tier: "Title Sponsers",
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
];

const Sponsors = ({ centerOnMobile = false }: { centerOnMobile?: boolean }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sectionY = useTransform(scrollYProgress, [0, 1], [30, -24]);

  const isMobile = useIsMobile();
  const tierData = desktopSponsorTiers;
  const allSponsors = useMemo(() => {
    const sponsors = tierData.flatMap((tier) => tier.sponsors);
    const seen = new Set<string>();
    return sponsors.filter((s) => {
      if (seen.has(s.name)) {
        return false;
      }
      seen.add(s.name);
      return true;
    });
  }, [tierData]);

  return (
    <section
      id="sponsors"
      ref={sectionRef}
      className="section-padding overflow-hidden"
    >
      <motion.div style={{ y: sectionY }} className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-neon-cyan uppercase tracking-widest mb-2">
            Backed By The Best
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            Sponsors & <span className="gradient-text">Partners</span>
          </h2>
        </motion.div>

        {/* Marquee */}
        <div className="relative mb-12">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              className="flex whitespace-nowrap"
            >
              {[...allSponsors, ...allSponsors].map((s, i) => (
                <span
                  key={i}
                  className="sponsor-marquee-chip glass-card px-6 py-3 mx-3 font-heading text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3 shrink-0"
                >
                  <img src={s.logo} alt={s.name} className="h-6 w-auto object-contain rounded" />
                  {s.name}
                </span>
              ))}
            </motion.div>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
        </div>

        <div className="space-y-12">
          {tierData.map((tier, ti) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ti * 0.1 }}
            >
              <p className="text-center text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                {tier.tier}
              </p>
              <div
                className={`${
                  isMobile
                    ? "grid grid-cols-2 gap-4 justify-items-center mx-auto"
                    : tier.tier === "Hosting partner" || tier.tier === "Hackathon Partner"
                      ? "grid grid-cols-1 lg:max-w-[340px] mx-auto justify-items-center"
                      : tier.tier === "Platform Partners"
                        ? "grid grid-cols-2 lg:grid-cols-4 lg:max-w-[1040px] mx-auto justify-items-center"
                        : tier.tier === "Gold Sponsers"
                          ? "grid grid-cols-2 lg:max-w-[560px] mx-auto justify-items-center"
                          : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:max-w-[1200px] mx-auto justify-items-center"
                }`}
              >
                {tier.sponsors.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
                    whileHover={{ scale: 1.08, rotateY: 5 }}
                    className={`glass-card p-4 flex flex-col items-center gap-3 hover:border-primary/30 transition-colors shimmer-card ${
                      isMobile
                        ? `w-full max-w-[170px] ${
                            tier.sponsors.length === 1 ||
                            (tier.tier === "Title Sponsers" && i === tier.sponsors.length - 1)
                              ? "col-span-2 justify-self-center max-w-[220px]"
                              : ""
                          }`
                        : tier.tier === "Hosting partner"
                          ? "w-full max-w-[260px]"
                          : tier.tier === "Hackathon Partner"
                            ? "w-full max-w-[260px]"
                            : tier.tier === "Platform Partners"
                              ? "w-full max-w-[220px] lg:max-w-[240px]"
                              : tier.tier === "Gold Sponsers"
                                ? "w-full max-w-[220px] lg:max-w-[240px]"
                                : `w-full max-w-[210px] lg:max-w-[220px] ${
                                    i >= tier.sponsors.length - 3
                                      ? i === tier.sponsors.length - 3
                                        ? "lg:col-start-2"
                                        : i === tier.sponsors.length - 2
                                          ? "lg:col-start-3"
                                          : "lg:col-start-4"
                                      : ""
                                  }`
                    } ${
                      isMobile && tier.sponsors.length > 2 && i % 2 === 0
                        ? "translate-x-1.5"
                        : ""
                    } ${
                      isMobile && tier.sponsors.length > 2 && i % 2 === 1
                        ? "-translate-x-1.5"
                        : ""
                    }`}
                    style={{ transformPerspective: 600 }}
                  >
                    <div className={`rounded-lg p-3 w-full flex items-center justify-center ${isMobile && centerOnMobile ? 'h-20' : 'h-28'}`}>
                      <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="font-heading text-sm md:text-base text-muted-foreground font-bold text-center">
                      {s.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex">
            <a
              href="#contact"
              className="hero-explore-outline pulse-cta cta-sweep inline-flex items-center justify-center gap-3 ripple-button"
            >
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-secondary opacity-60" />
              <span className="flex flex-col items-start leading-none">
                <span>Become a Sponsor</span>
                <span className="text-[11px] text-orange-200/65">Partner with our energy</span>
              </span>
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Sponsors;
