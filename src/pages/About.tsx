import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import BackgroundEffects from "@/components/BackgroundEffects";
import { Cpu, Terminal, Lightbulb, Users, Facebook, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { TerminalSubheading } from "@/components/TerminalSubheading";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const clubs = [
  { name: "IEM-UEM group", role: "Lead Organizer", icon: Cpu },
  { name: "Microsoft Student Society UEMK", role: "Hosting Partner", icon: Terminal },
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
                <div className="absolute left-1/2 bottom-[-2%] h-20 w-[110%] -translate-x-1/2 rounded-full bg-orange-300/20 blur-3xl opacity-90" />
                <div className="absolute left-[28%] bottom-[1%] h-16 w-[55%] -translate-x-1/2 rounded-full bg-purple-400/25 blur-2xl animate-smoke-left" />
                <div className="absolute left-[48%] bottom-[-1%] h-20 w-[70%] -translate-x-1/2 rounded-full bg-white/15 blur-3xl animate-smoke-center" />
                <div className="absolute left-[68%] bottom-[1%] h-16 w-[55%] -translate-x-1/2 rounded-full bg-orange-300/25 blur-2xl animate-smoke-right" />
              </div>
            </div>
          </div>


        </section>

        {/* Vision & Metrics Panel */}
        <section className="section-padding relative z-30 bg-transparent">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 items-stretch">

              {/* Vision Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border border-white/[0.08] bg-[#09080d]/65 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-sans font-semibold text-xs tracking-[0.2em] text-primary uppercase">Our Vision</span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Igniting the Next Generation of Innovators.
                  </h2>

                  <div className="space-y-4 text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
                    <p>
                      IGNITIA &apos;26 aims to create a vibrant ecosystem where students
                      from diverse backgrounds come together to learn, compete, and
                      innovate.
                    </p>
                    <p>
                      From high-stakes coding battles to creative cultural
                      showcases, every event is designed to push boundaries and
                      inspire the next wave of tech leaders.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Key Metrics Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="border border-white/[0.08] bg-[#09080d]/65 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="font-sans font-semibold text-xs tracking-[0.2em] text-orange-400 uppercase">Key Metrics</span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-6 md:mb-8">
                    By The Numbers
                  </h2>

                  <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {[
                      { label: "PRIZE POOL", value: "₹2.0L+", color: "text-primary" },
                      { label: "EXPECTED FOOTFALL", value: "1000+", color: "text-orange-400" },
                      { label: "COLLABORATING COLLEGES", value: "50+", color: "text-purple-400" },
                      { label: "COMPETITIVE ARENAS", value: "12+", color: "text-amber-500" },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <span className="block text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider text-white/40 uppercase">
                          {stat.label}
                        </span>
                        <span className={`block text-2xl sm:text-3xl font-black tracking-tight ${stat.color}`}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Collaborating Societies */}
        <section className="section-padding relative z-30 bg-transparent">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12 sm:mb-16 space-y-3">
              <p className="text-xs text-primary uppercase tracking-[0.3em] font-sans font-semibold">
                COLLABORATING SOCIETIES
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Powered by Community
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {clubs.map((club, idx) => {
                const Icon = club.icon;
                const descriptions = [
                  "Leading the coordination, scheduling, and overall execution of IGNITIA '26.",
                  "Fostering technological innovation, workshops, and technical support.",
                  "Providing domain expertise, knowledge tracks, and academic alignment."
                ];
                return (
                  <motion.div
                    key={club.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative group bg-[#09080d]/50 backdrop-blur-md p-6 sm:p-8 border border-white/[0.06] hover:border-primary/45 rounded-2xl transition-all duration-300 flex flex-col justify-between text-center"
                  >
                    <div>
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-5 sm:mb-6 mx-auto group-hover:scale-105 group-hover:border-primary/30 transition-all duration-300">
                        <Icon size={20} className="text-primary/80 group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="font-heading text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2 tracking-wide">
                        {club.name}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-primary/70 font-sans font-semibold mb-3 sm:mb-4">{club.role}</p>
                      <p className="text-xs text-white/55 leading-relaxed font-sans">{descriptions[idx]}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* IEM-UEM group Editorial Block */}
        <section className="section-padding relative z-30 bg-transparent">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border border-white/[0.08] bg-[#09080d]/65 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                <Users className="text-primary/80 mx-auto" size={32} />
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  IEM-UEM Group
                </h2>
                <div className="space-y-4 text-white/70 text-xs sm:text-sm md:text-base leading-relaxed font-sans">
                  <p>
                    The IEM-UEM group is a thriving ecosystem of education and
                    innovation, fostering excellence in engineering, management,
                    and science across their various campuses.
                  </p>
                  <p>
                    IGNITIA is their flagship annual event, bringing together the
                    best minds from across the region to compete, learn, and
                    celebrate technology.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </PageTransition>
    </div>
  );
};

export default About;
