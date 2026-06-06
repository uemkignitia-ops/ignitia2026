import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Schedule", href: "/schedule" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoPulseKey, setLogoPulseKey] = useState(0);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);
  const hiddenRef = useRef(false);
  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
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
        const delta = y - lastYRef.current;
        const nextScrolled = y > 12;

        // Hide when scrolling down quickly past a threshold, show on scroll up
        let nextHidden = hiddenRef.current;
        if (delta > 8 && y > 80) {
          nextHidden = true;
        } else if (delta < -8) {
          nextHidden = false;
        }

        if (hiddenRef.current !== nextHidden) {
          hiddenRef.current = nextHidden;
          setHidden(nextHidden);
        }

        setIsScrolled(nextScrolled);

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
    if (!isOpen || !isMobile) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (
        mobileNavRef.current?.contains(target) ||
        mobileButtonRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
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
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-transparent bg-background/70 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
          : "border-transparent bg-transparent",
      )}
    >
      <motion.div
        style={{ height: isHome ? navHeight : 64 }}
        className="container mx-auto flex items-center justify-between px-4"
      >
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <motion.span
            style={isHome ? { scale: logoScale, y: logoY } : undefined}
            className="origin-left"
          >
            <motion.div
              key={logoPulseKey}
              initial={
                logoPulseKey
                  ? { opacity: 0.35, scale: 0.72, filter: "blur(8px)" }
                  : false
              }
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="flex items-center gap-2"
            >
              <motion.img src="/ignitia-2d.png" alt="IGNITIA logo" className="h-7 w-7 rounded-full object-cover shadow-[0_0_24px_hsl(270_70%_60%/0.28)]" />
              <motion.span className="font-heading text-lg font-bold gradient-text inline-block md:text-xl">
                IGNITIA '26
              </motion.span>
            </motion.div>
          </motion.span>
        </Link>

        <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-card/55 p-1 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                location.pathname === link.href
                  ? "bg-primary/12 text-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/events"
            className="glow-button text-sm !px-5 !py-2 inline-flex items-center gap-2 pulse-cta"
          >
            Register Now
            <ArrowRight size={14} />
          </Link>
        </div>

        <button
          ref={mobileButtonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-card/60 text-foreground backdrop-blur-xl"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
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
              ref={mobileNavRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              id="mobile-navigation"
              className="fixed right-0 top-0 z-50 h-[100dvh] w-[88vw] max-w-[380px] border-l border-white/10 bg-background/95 backdrop-blur-2xl p-5 flex flex-col overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="font-heading text-base font-semibold gradient-text">IGNITIA '26</span>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.28em] mt-1">Navigation</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation menu"
                  className="text-foreground/90 hover:text-primary transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex flex-col gap-2 pt-6">
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
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors",
                        location.pathname === link.href
                          ? "border-primary/25 bg-primary/12 text-primary"
                          : "border-white/8 bg-white/[0.02] text-muted-foreground hover:border-primary/15 hover:bg-white/[0.04] hover:text-foreground",
                      )}
                    >
                      <span>{link.label}</span>
                      <ArrowRight size={14} className="opacity-60" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="flex-1" />

              <Link
                to="/events"
                onClick={() => setIsOpen(false)}
                className="glow-button text-center text-sm !px-6 !py-3 w-full inline-flex items-center justify-center gap-2"
              >
                Register Now
                <ArrowRight size={14} />
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
