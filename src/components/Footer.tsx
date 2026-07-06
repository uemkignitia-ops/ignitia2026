import { motion } from "framer-motion";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Footer = () => (
  <footer className="relative z-[100] overflow-visible border-t border-white/10 bg-background/85 backdrop-blur-xl">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.15),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,215,0,0.06),transparent_24%)] overflow-hidden" />

    {/* Character standing on the footer line */}
    <div className="absolute bottom-full left-4 md:left-12 z-20 pointer-events-none translate-y-6 md:translate-y-10">
      <img
        src="/footer-character-transparent.gif"
        alt="IGNITIA Character"
        className="h-[80px] md:h-[280px] w-auto object-contain opacity-90 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
      />
    </div>

    <div className="container relative z-10 mx-auto px-4 py-16 md:py-20">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1.2fr_0.8fr] lg:gap-x-10 xl:gap-x-14"
      >
        <motion.div variants={fadeUp} className="space-y-5">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src="/ignitia-2d.png"
              alt="IGNITIA logo"
              className="h-12 w-12 rounded-full object-cover shadow-[0_0_30px_hsl(270_70%_60%/0.22)]"
            />
            <div>
              <span className="block font-heading text-2xl font-bold gradient-text">
                IGNITIA '26
              </span>
              <span className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                IEM-UEM group, UEM Kolkata
              </span>
            </div>
          </Link>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            A flagship multi-domain celebration of technology, creativity, and
            student innovation.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
            {[
              { icon: DiscordIcon, label: "Discord", url: "https://discord.gg/shUKTMPMTj" },
              { icon: Instagram, label: "ignitia2k26", url: "https://www.instagram.com/ignitia2k26" },
              { icon: Facebook, label: "Ignitia", url: "https://www.facebook.com/people/Ignitia/61573281091277/" },
              { icon: Linkedin, label: "Ignitia2k26", url: "https://www.linkedin.com/company/ignitia2k26" },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-card/60 text-muted-foreground transition-colors hover:text-white hover:border-white/20"
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-4">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
            Quick Links
          </h4>
          <div className="flex flex-col gap-3">
            {[
              { label: "About", to: "/about" },
              { label: "Events", to: "/events" },
              { label: "Schedule", to: "/schedule" },
              { label: "Gallery", to: "/gallery" },
              { label: "FAQ", to: "/faq" },
              { label: "Sponsors", to: "/sponsors" },
              { label: "Team", to: "/team" },
            ].map((link) => (
              <motion.div key={link.label} whileHover={{ x: 4 }}>
                <Link
                  to={link.to}
                  className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowRight size={14} />
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-4">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
            Events
          </h4>
          <div className="flex flex-col gap-3">
            {[
              "IGNISYS",
              "Quizophonia",
              "Battlegrounds Mobile India",
              "Evade-X",
              "Pixel Prophecy",
              "Circuit Crawl",
            ].map((event) => (
              <motion.div key={event} whileHover={{ x: 4 }}>
                <Link
                  to="/events"
                  className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowRight size={14} />
                  {event}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-4">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
            Contact
          </h4>
          <div className="flex flex-col gap-3">
            <motion.a
              whileHover={{ x: 4 }}
              href="mailto:uemk.ignitia@gmail.com"
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-card/60 text-primary">
                <Mail size={14} />
              </span>
              <span>uemk.ignitia@gmail.com</span>
            </motion.a>
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-start gap-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-card/60 text-primary shrink-0">
                <Phone size={14} />
              </span>
              <div className="flex flex-col gap-2.5 pt-1.5">
                <a href="tel:+917439115647" className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="text-white/80 min-w-[120px]">Snehashish Das:</span>
                  <span className="whitespace-nowrap">+91 74391 15647</span>
                </a>
                <a href="tel:+917439223022" className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="text-white/80 min-w-[120px]">Priyanshu Mitra:</span>
                  <span className="whitespace-nowrap">+91 74392 23022</span>
                </a>
                <a href="tel:+918274090864" className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="text-white/80 min-w-[120px]">Aranya Rath:</span>
                  <span className="whitespace-nowrap">+91 82740 90864</span>
                </a>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-card/60 text-primary">
                <MapPin size={14} />
              </span>
              <span>University of Engineering & Management, Kolkata</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-4">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
            <span className="text-primary">*</span> Web Dev Team
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground font-mono">
            <li><span className="text-primary/50 mr-1">1.</span> <a href="https://www.linkedin.com/in/diptodeep-biswas/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Diptodeep Biswas</a></li>
            <li><span className="text-primary/50 mr-1">2.</span> <a href="https://www.linkedin.com/in/aranya-rath-275a5628a/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Aranya Rath</a></li>
            <li><span className="text-primary/50 mr-1">3.</span> <a href="https://www.linkedin.com/in/tridibesh-sen/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Tridibesh Sen</a></li>
            <li><span className="text-primary/50 mr-1">4.</span> <a href="https://www.linkedin.com/in/rony-roy-813bb5335/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Rony Roy</a></li>
            <li><span className="text-primary/50 mr-1">5.</span> <a href="https://www.linkedin.com/in/daliya-paul-4b80393a9/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Daliya Paul</a></li>
            <li><span className="text-primary/50 mr-1">6.</span> <a href="https://www.linkedin.com/in/harsit-kedia/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Harsit Kedia</a></li>
          </ul>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-muted-foreground origin-center"
      >
        © 2026 IGNITIA '26 · Built for students, powered by the IEM-UEM group,
        UEM Kolkata. <span className="text-primary">*</span>
      </motion.div>
    </div>
  </footer>
);

export default Footer;
