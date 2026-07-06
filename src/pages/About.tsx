import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import BackgroundEffects from "@/components/BackgroundEffects";
import { Cpu, Globe, Lightbulb, Users, Facebook, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { TerminalSubheading } from "@/components/TerminalSubheading";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const clubs = [
  { name: "IEM-UEM group", role: "Lead Organizer", icon: Cpu },
  { name: "Microsoft Student Society UEMK", role: "Hosting Partner", icon: Globe },
  { name: "Department of CSE (IOT,CS,BT)", role: "Knowledge Partner", icon: Lightbulb },
];

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const About = () => {

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden relative citadel-theme">
      <BackgroundEffects />
      <PageTransition>
        <ScrollProgress />
        <Navbar />

        {/* Hero Section — static floating mascot */}
        <section className="relative min-h-screen w-full overflow-hidden flex items-center">

          {/* HUD frame */}
          <div className="absolute inset-6 md:inset-10 border border-white/[0.02] pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-secondary/60" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-secondary/60" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-secondary/60" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-secondary/60" />
          </div>

          {/* Main Content Container */}
          <div className="relative z-30 container mx-auto px-6 md:px-16 lg:px-20 flex flex-col md:flex-row items-center justify-between w-full mt-24 md:mt-0 gap-8 md:gap-0">
            {/* Left: text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-5 max-w-lg w-full flex-1"
            >
              <p className="text-[10px] md:text-xs text-primary uppercase tracking-[0.4em] font-semibold font-mono flex items-center gap-2">
                <Cpu size={14} className="text-primary" /> OUR STORY &amp; VISION
              </p>

              <h1 className="hero-title-block leading-[0.82] select-none">
                <span 
                  className="ignitia-citadel-title" 
                  data-text="ABOUT US"
                  style={{ fontSize: "clamp(3.2rem, 9.5vw, 9.8rem)" }}
                >
                  <span>A</span><span>B</span><span>O</span><span>U</span><span>T</span>
                  <span>&nbsp;</span>
                  <span>U</span><span>S</span>
                </span>
              </h1>

              <p className="text-muted-foreground text-sm max-w-md font-medium leading-relaxed">
                The flagship multi-domain event organized by the IEM-UEM group
                at UEM Kolkata — where innovation, creativity, and
                competition converge.
              </p>

              {/* Social links */}
              <div className="flex gap-3 pt-2">
                {[
                  { icon: DiscordIcon, href: "https://discord.gg/shUKTMPMTj" },
                  { icon: Instagram, href: "https://www.instagram.com/ignitia2k26" },
                  { icon: Facebook, href: "https://www.facebook.com/people/Ignitia/61573281091277/" },
                  { icon: Linkedin, href: "https://www.linkedin.com/company/ignitia2k26" },
                ].map((soc, i) => (
                  <motion.a
                    key={i}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-card/60 text-muted-foreground transition-colors hover:text-white hover:border-white/20"
                  >
                    <soc.icon size={18} />
                  </motion.a>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/events" className="register-button-orange flex items-center gap-2 transition-all text-white px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wider">
                  REGISTER NOW <ArrowRight size={14} />
                </Link>
                <Link to="/events" className="border border-white/10 hover:border-white/30 bg-black/20 flex items-center justify-center text-white px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wider transition-all">
                  VIEW EVENTS
                </Link>
              </div>
            </motion.div>

            {/* Right: Floating mascot */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end pointer-events-none mt-2 md:mt-0 z-[25]">
              <div className="relative w-[240px] sm:w-[280px] lg:w-[370px] xl:w-[420px] translate-y-0 md:translate-y-[40px] md:translate-x-8 lg:translate-x-20 xl:translate-x-32">
                <div className="animate-mascot-float">
                  <img
                    src="/images/Mascot.png"
                    alt="IGNITIA Mascot"
                    className="w-full h-auto object-contain select-none drop-shadow-[0_0_35px_rgba(0,245,255,0.38)] drop-shadow-[0_0_55px_rgba(168,85,247,0.22)]"
                    draggable={false}
                  />
                </div>
                {/* Floor glow */}
                <div className="absolute left-1/2 bottom-[-2%] h-20 w-[110%] -translate-x-1/2 rounded-full bg-fuchsia-300/20 blur-3xl opacity-90" />
                <div className="absolute left-[28%] bottom-[1%] h-16 w-[55%] -translate-x-1/2 rounded-full bg-purple-400/25 blur-2xl animate-smoke-left" />
                <div className="absolute left-[48%] bottom-[-1%] h-20 w-[70%] -translate-x-1/2 rounded-full bg-white/15 blur-3xl animate-smoke-center" />
                <div className="absolute left-[68%] bottom-[1%] h-16 w-[55%] -translate-x-1/2 rounded-full bg-fuchsia-300/25 blur-2xl animate-smoke-right" />
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-50" />
        </section>

        {/* Vision panel */}
        <section className="section-padding relative z-30 bg-transparent">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="border border-white/10 bg-black/50 backdrop-blur-md p-6 md:p-8 relative"
                style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
              >
                <div className="absolute top-0 right-0 w-5 h-5 bg-primary/40" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                <div className="absolute bottom-0 left-0 w-5 h-5 bg-primary/40" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />

                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-primary uppercase">Our Vision</span>
                </div>

                <TerminalSubheading
                  text="Igniting the Next Generation of Innovators."
                  className="font-mono text-xl md:text-2xl font-bold tracking-tight mb-4 text-white"
                />

                <div className="grid md:grid-cols-1 gap-4 text-xs text-white/60 leading-relaxed font-mono">
                  <p className="border-l border-primary/20 pl-2">
                    IGNITIA &apos;26 aims to create a vibrant ecosystem where students
                    from diverse backgrounds come together to learn, compete, and
                    innovate.
                  </p>
                  <p className="border-l border-primary/20 pl-2">
                    From high-stakes coding battles to creative cultural
                    showcases, every event is designed to push boundaries and
                    inspire the next wave of tech leaders.
                  </p>
                </div>
              </div>

              {/* Stats panel */}
              <div className="border border-white/10 bg-black/50 backdrop-blur-md p-6 md:p-8 relative"
                style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
              >
                <div className="absolute top-0 right-0 w-5 h-5 bg-fuchsia-500/40" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                <div className="absolute bottom-0 left-0 w-5 h-5 bg-fuchsia-500/40" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />

                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-fuchsia-400/80 uppercase">Key Metrics</span>
                </div>

                <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  By The{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-400">
                    Numbers
                  </span>
                </h2>

                <div className="space-y-3 font-mono">
                  {[
                    { label: "PRIZE POOL", value: "₹2,00,000+", pct: 90, color: "from-primary to-pink-500" },
                    { label: "EXPECTED FOOTFALL", value: "1000+ Participants", pct: 85, color: "from-purple-500 to-indigo-500" },
                    { label: "COLLABORATING COLLEGES", value: "50+ Colleges", pct: 75, color: "from-fuchsia-400 to-purple-400" },
                    { label: "COMPETITIVE ARENAS", value: "12+ Events", pct: 60, color: "from-yellow-500 to-primary" },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[10px] md:text-xs">
                        <span className="text-white/45">{stat.label}</span>
                        <span className="text-white font-bold">{stat.value}</span>
                      </div>
                      <div className="h-[3px] bg-white/10 w-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-1000`}
                          style={{ width: `${stat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clubs */}
        <section className="section-padding relative z-30 bg-transparent">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs text-primary uppercase tracking-[0.3em] font-mono mb-2">
                COLLABORATING SOCIETIES
              </p>
              <TerminalSubheading
                text="Powered by Community"
                className="font-mono text-2xl md:text-3xl font-bold text-foreground"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {clubs.map((club) => {
                const Icon = club.icon;
                return (
                  <div
                    key={club.name}
                    className="relative group bg-card/40 backdrop-blur-md p-6 text-center border border-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden cursor-pointer"
                    style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))" }}
                  >
                    <div className="absolute top-0 right-0 w-4 h-4 bg-primary/20 group-hover:bg-primary/40 transition-colors" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 bg-primary/20 group-hover:bg-primary/40 transition-colors" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />

                    <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} className="text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-mono text-base font-bold text-white/90 mb-1 tracking-wide relative z-10">
                      {club.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-primary/60 font-mono relative z-10">{club.role}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* IEM-UEM group */}
        <section className="section-padding relative z-30 bg-transparent">
          <div className="container mx-auto">
            <div className="glass-card bg-card/75 backdrop-blur-2xl p-8 md:p-12 max-w-4xl mx-auto text-center shimmer-card border border-white/5 relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/30" />

              <Users className="text-primary mx-auto mb-4" size={40} />
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                IEM-UEM Group
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                The IEM-UEM group is a thriving ecosystem of education and
                innovation, fostering excellence in engineering, management,
                and science across their various campuses.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                IGNITIA is their flagship annual event, bringing together the
                best minds from across the region to compete, learn, and
                celebrate technology.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </PageTransition>
    </div>
  );
};

export default About;
