import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Download, Mail, ArrowRight, Star, Gem, Award, Server, Terminal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";

const sponsorCategories = [
  {
    masterHeading: "Hosting partner of IGNITIA",
    tiers: [
      {
        tier: "Hosting partner",
        icon: Server,
        color: "from-blue-500 to-cyan-400",
        benefits: [
          "Logo on website",
          "Hosting credits for participants",
          "Social media mention",
        ],
        sponsors: [
          { name: "Microsoft Student Society", logo: "/sponsors/MSS.jpeg" }
        ],
      },
      {
        tier: "Hackathon Partner",
        icon: Terminal,
        color: "from-green-500 to-emerald-400",
        benefits: [
          "API access for hackers",
          "Dedicated prize track",
          "Mentorship during hackathon",
        ],
        sponsors: [
          { name: "Crelynex", logo: "/sponsors/CrelyneX.jpg" }
        ],
      }
    ]
  },
  {
    masterHeading: "Event Collaborators",
    tiers: [
      {
        tier: "Platform Partners",
        icon: Award,
        color: "from-neon-cyan to-secondary",
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
      }
    ]
  },
  {
    masterHeading: "Sponsers",
    tiers: [
      {
        tier: "Gold Sponsers",
        icon: Star,
        color: "from-secondary to-neon-pink",
        benefits: [
          "Logo on website & posters",
          "Booth space",
          "Social media mention",
          "Certificate branding",
        ],
        sponsors: [
          { name: "Crelynex", logo: "/sponsors/CrelyneX.jpg" },
          { name: "Microsoft Student Society", logo: "/sponsors/MSS.jpeg" }
        ],
      },
      {
        tier: "Title Sponsers",
        icon: Gem,
        color: "from-primary to-neon-cyan",
        benefits: [
          "Logo on all materials",
          "Main stage branding",
          "Dedicated booth",
          "Social media features",
          "Opening ceremony mention",
        ],
        sponsors: [
          { name: "Robo Mellotikos", logo: "/sponsors/robo_mellontikos.jpeg" },
          { name: "Ugg", logo: "/sponsors/UGG.jpg" },
          { name: "Dsu", logo: "/sponsors/Dsu.png" },
          { name: "Rangrez", logo: "/sponsors/Rangrez.jpeg" },
          { name: "Gdg", logo: "/sponsors/GDG.jpeg" },
          { name: "Innofusion", logo: "/sponsors/Innofusion_updated.jpg" },
          { name: "Diversion", logo: "/sponsors/Diversion.png" },
          { name: "Oratoria", logo: "/sponsors/Oratoria.jpg" },
          { name: "Technologia", logo: "/sponsors/technologia.jpeg" },
          { name: "Symphony", logo: "/sponsors/Symphony.jpg" },
          { name: "Pragya", logo: "/sponsors/Pragya.jpg" },
          { name: "Gfg", logo: "/sponsors/Gfg.jpg" },
          { name: "Driveblaze", logo: "/sponsors/Driveblaze.jpg" }
        ],
      }
    ]
  }
];

const SponsorsPage = () => {
  // Pinned horizontal scroll for benefits
  const horizontalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: horizontalRef,
    offset: ["start start", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background scanline-overlay">
        <ParticleField />
        <AnimatedBlobs />
        <ScrollProgress />
        <Navbar />

        <section className="relative min-h-[50vh] flex items-center justify-center pt-16">
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="font-heading text-5xl md:text-7xl font-bold mb-4"
            >
              Our <span className="gradient-text">Sponsors</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground max-w-xl mx-auto"
            >
              The partners and organizations fueling IGNITIA'26.
            </motion.p>
          </div>
        </section>

        {/* Tier cards with scale-in on scroll */}
        <section className="section-padding">
          <div className="container mx-auto space-y-24">
            {sponsorCategories.map((category, catIndex) => (
              <div key={category.masterHeading} className="space-y-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-2 uppercase tracking-tight">
                    <span className="gradient-text">{category.masterHeading}</span>
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full opacity-50" />
                </motion.div>

                <div className="space-y-16">
                  {category.tiers.map((tier, ti) => (
                    <motion.div
                      key={tier.tier}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: ti * 0.1 }}
                    >
                      <div className="text-center mb-6">
                        <tier.icon size={32} className="text-primary mx-auto mb-2" />
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                          {tier.tier}
                        </h2>
                        
                        {/* Horizontal Scrolling Benefits Subheading */}
                        <div className="relative overflow-hidden w-full max-w-4xl mx-auto h-8 flex items-center mb-8">
                          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
                          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
                          <motion.div
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                            className="flex whitespace-nowrap items-center"
                          >
                            {[...tier.benefits, ...tier.benefits].map((b, i) => (
                              <span key={i} className="text-sm text-muted-foreground font-medium flex items-center gap-4 mx-6">
                                <span className="text-neon-cyan">✦</span> {b}
                              </span>
                            ))}
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                        {tier.sponsors.map((s) => (
                          <motion.div
                            key={s.name}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="glass-card p-4 flex flex-col items-center justify-center gap-4 cursor-pointer w-[180px]"
                          >
                            <div className="bg-white rounded-lg p-3 w-full flex items-center justify-center h-28">
                              <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <span className="text-sm text-foreground font-bold tracking-wide text-center">{s.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-12 max-w-2xl mx-auto shimmer-card"
            >
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Become a Sponsor
              </h2>
              <p className="text-muted-foreground mb-6">
                Partner with IGNITIA'26 and reach 1000+ student innovators.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glow-button inline-flex items-center gap-2 text-sm"
                >
                  <Download size={16} /> Download Brochure
                </motion.a>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glow-button-secondary inline-flex items-center gap-2 text-sm"
                >
                  <Mail size={16} /> Contact Us
                </motion.a>
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
