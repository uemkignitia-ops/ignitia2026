import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const sponsorTiers = [
  { tier: "Hosting Partners", sponsors: [{ name: "Vercel", logo: "https://placehold.co/150x60/333/FFF?text=Vercel" }] },
  { tier: "Hackathon Partners", sponsors: [{ name: "Devfolio", logo: "https://placehold.co/150x60/333/FFF?text=Devfolio" }] },
  { tier: "Title Sponsor", sponsors: [{ name: "TechCorp", logo: "https://placehold.co/150x60/333/FFF?text=TechCorp" }, { name: "InnovateLabs", logo: "https://placehold.co/150x60/333/FFF?text=Innovate" }] },
  {
    tier: "Gold Sponsors",
    sponsors: [{ name: "CloudBase", logo: "https://placehold.co/150x60/333/FFF?text=CloudBase" }, { name: "DevStack", logo: "https://placehold.co/150x60/333/FFF?text=DevStack" }, { name: "PixelForge", logo: "https://placehold.co/150x60/333/FFF?text=Pixel" }, { name: "DataFlow", logo: "https://placehold.co/150x60/333/FFF?text=DataFlow" }],
  },
  {
    tier: "Community Partners",
    sponsors: [
      { name: "GDG Kolkata", logo: "https://placehold.co/150x60/333/FFF?text=GDG" },
      { name: "MLH", logo: "https://placehold.co/150x60/333/FFF?text=MLH" },
      { name: "Dev Community", logo: "https://placehold.co/150x60/333/FFF?text=DevComm" },
      { name: "Hack Club", logo: "https://placehold.co/150x60/333/FFF?text=HackClub" },
      { name: "CodeChef", logo: "https://placehold.co/150x60/333/FFF?text=CodeChef" },
      { name: "IEEE UEM", logo: "https://placehold.co/150x60/333/FFF?text=IEEE" },
    ],
  },
];

const allSponsors = sponsorTiers.flatMap((t) => t.sponsors);

const Sponsors = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sectionY = useTransform(scrollYProgress, [0, 1], [30, -24]);

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
          {sponsorTiers.map((tier, ti) => (
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
              <div className="flex flex-wrap justify-center gap-4">
                {tier.sponsors.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
                    whileHover={{ scale: 1.08, rotateY: 5 }}
                    className="glass-card p-4 flex flex-col items-center gap-4 hover:border-primary/30 transition-colors shimmer-card min-w-[180px]"
                    style={{ transformPerspective: 600 }}
                  >
                    <div className="bg-white rounded-lg p-3 w-full flex items-center justify-center h-28">
                      <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="font-heading text-sm md:text-base text-muted-foreground font-bold">
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
          <a
            href="#contact"
            className="glow-button-secondary text-sm ripple-button"
          >
            Become a Sponsor
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Sponsors;
