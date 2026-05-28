import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

const sponsorTiers = [
  { tier: "Title Sponsor", names: ["TechCorp", "InnovateLabs"] },
  {
    tier: "Gold Sponsors",
    names: ["CloudBase", "DevStack", "PixelForge", "DataFlow"],
  },
  {
    tier: "Community Partners",
    names: [
      "GDG Kolkata",
      "MLH",
      "Dev Community",
      "Hack Club",
      "CodeChef",
      "IEEE UEM",
    ],
  },
];

const allSponsors = sponsorTiers.flatMap((t) => t.names);

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
              {[...allSponsors, ...allSponsors].map((name, i) => (
                <span
                  key={i}
                  className="sponsor-marquee-chip glass-card px-6 py-3 mx-3 font-heading text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-105 inline-block shrink-0"
                >
                  {name}
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
                {tier.names.map((name, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
                    whileHover={{ scale: 1.08, rotateY: 5 }}
                    className="glass-card px-6 py-4 hover:border-primary/30 transition-colors shimmer-card"
                    style={{ transformPerspective: 600 }}
                  >
                    <span className="font-heading text-sm md:text-base text-muted-foreground">
                      {name}
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
          <div className="sponsor-cta-shell inline-flex rounded-full border border-white/10 bg-card/70 p-1 shadow-[0_0_45px_rgba(255,80,110,0.18)]">
            <a
              href="#contact"
              className="sponsor-cta-button inline-flex items-center justify-center gap-3 px-6 py-3 text-sm font-semibold ripple-button"
            >
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span className="flex flex-col items-start leading-none">
                <span>Become a Sponsor</span>
                <span className="text-[11px] text-white/70">Partner with our energy</span>
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
