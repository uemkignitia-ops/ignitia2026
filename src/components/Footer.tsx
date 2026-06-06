import { motion } from "framer-motion";
import {
  ArrowRight,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/10 bg-background/85 backdrop-blur-xl">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.15),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,215,0,0.06),transparent_24%)]" />
    <div className="container relative z-10 mx-auto px-4 py-16 md:py-20">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]"
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
          <div className="flex gap-3">
            {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Social link"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-card/60 text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon size={16} />
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
              { label: "Sponsors", to: "/sponsors" },
              { label: "Team", to: "/team" },
              { label: "FAQ", to: "/faq" },
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
              "Ideathon",
              "Coding Quest",
              "Quiz",
              "Gaming Arena",
              "Cultural Fest",
              "Game Dev Hackathon",
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
              href="mailto:ignitia@uem.edu.in"
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-card/60 text-primary">
                <Mail size={14} />
              </span>
              <span>ignitia@uem.edu.in</span>
            </motion.a>
            <motion.a
              whileHover={{ x: 4 }}
              href="tel:+919876543210"
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-card/60 text-primary">
                <Phone size={14} />
              </span>
              <span>+91 98765 43210</span>
            </motion.a>
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-muted-foreground origin-center"
      >
        © 2026 IGNITIA '26 · Built for students, powered by the IEM-UEM group,
        UEM Kolkata.
      </motion.div>
    </div>
  </footer>
);

export default Footer;
