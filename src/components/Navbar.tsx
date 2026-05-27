import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Schedule", href: "/schedule" },
  { label: "Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [logoPulseKey, setLogoPulseKey] = useState(0);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);
  const hiddenRef = useRef(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const { scrollY } = useScroll();
  const logoScale = useSpring(useTransform(scrollY, [0, 110], [0.97, 1]), {
    stiffness: 180,
    damping: 30,
  });
  const logoY = useSpring(useTransform(scrollY, [0, 110], [2, 0]), {
    stiffness: 180,
    damping: 30,
  });
  const logoOpacity = useTransform(scrollY, [0, 20, 80], [0.25, 0.7, 1]);
  const navHeight = useSpring(useTransform(scrollY, [0, 110], [68, 64]), {
    stiffness: 180,
    damping: 30,
  });

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const nextHidden = !isHome && y > 100 && y > lastYRef.current;

        if (hiddenRef.current !== nextHidden) {
          hiddenRef.current = nextHidden;
          setHidden(nextHidden);
        }

        lastYRef.current = y;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    const onLoaderComplete = () => setLogoPulseKey((k) => k + 1);
    window.addEventListener("ignitia:loader-complete", onLoaderComplete);
    return () =>
      window.removeEventListener("ignitia:loader-complete", onLoaderComplete);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border"
    >
      <motion.div
        style={{ height: isHome ? navHeight : 64 }}
        className="container mx-auto flex items-center justify-between px-4"
      >
        <Link to="/" className="flex items-center gap-2">
          <motion.span
            style={
              isHome
                ? { scale: logoScale, y: logoY, opacity: logoOpacity }
                : undefined
            }
            className="origin-left"
          >
            <motion.span
              key={logoPulseKey}
              initial={
                logoPulseKey
                  ? { opacity: 0.35, scale: 0.72, filter: "blur(8px)" }
                  : false
              }
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="font-heading text-xl font-bold gradient-text inline-block"
            >
              IGNITIA'26
            </motion.span>
          </motion.span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`nav-link-underline text-sm transition-colors duration-200 ${
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/events"
            className="glow-button text-sm !px-6 !py-2 pulse-cta"
          >
            Register Now
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-foreground relative w-8 h-8 flex items-center justify-center"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="m"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 h-[100dvh] w-[82vw] max-w-[360px] border-l border-glass-border bg-card/95 backdrop-blur-xl p-5 lg:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-glass-border">
                <span className="font-heading text-base font-semibold gradient-text">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation menu"
                  className="text-foreground/90 hover:text-primary transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex flex-col gap-3 pt-5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block rounded-lg px-3 py-2.5 transition-colors ${
                        location.pathname === link.href
                          ? "bg-primary/12 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/8"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/events"
                onClick={() => setIsOpen(false)}
                className="glow-button text-center text-sm !px-6 !py-2 mt-6 w-full"
              >
                Register Now
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
