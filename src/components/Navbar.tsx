import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ArrowRight, Menu, X, Lock } from "lucide-react";
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
  const [isLoaded, setIsLoaded] = useState(() => !!(window as any).__IGNITIA_LOADER_DONE__);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);
  const hiddenRef = useRef(false);
  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const { scrollY } = useScroll();
  const navHeight = useSpring(useTransform(scrollY, [0, 110], [84, 76]), {
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
    if (isLoaded) return;
    const onLoaderComplete = () => {
      setIsLoaded(true);
    };
    window.addEventListener("ignitia:loader-complete", onLoaderComplete);
    return () =>
      window.removeEventListener("ignitia:loader-complete", onLoaderComplete);
  }, [isLoaded]);

  const leftLinks = navLinks.slice(0, 4); // Home, About, Events, Schedule
  const rightLinks = navLinks.slice(4); // Gallery, FAQ, Sponsors, Team, Contact

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden || !isLoaded ? -100 : 16, opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 mx-auto z-[110] w-[95%] max-w-7xl border border-white/10 bg-[#050406]/75 backdrop-blur-xl rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-[width,background-color,border-color,box-shadow] duration-300",
          isScrolled
            ? "w-[90%] bg-[#050406]/90 border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
            : "w-[94%]"
        )}
      >
        <motion.div
          style={{ height: isHome ? navHeight : 76 }}
          className="flex items-center justify-between px-6 w-full relative"
        >
          {/* Mobile Logo (left-aligned) */}
          <div className="flex lg:hidden items-center shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img src="/ignitia-2d.png" alt="IGNITIA logo" className="h-7 w-7 rounded-full object-cover shadow-[0_0_24px_hsl(270_70%_60%/0.28)]" />
              <span className="font-['Orbitron'] text-lg font-bold gradient-text whitespace-nowrap tracking-wider">
                IGNITIA '26
              </span>
            </Link>
          </div>

          {/* Mobile: IEM and UEM logos */}
          <div className="flex lg:hidden flex-1 justify-end items-center gap-2.5 sm:gap-4 pr-3 sm:pr-5">
            <img src="/iem-logo.png" alt="IEM" className="h-12 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]" />
            <img src="/uem-logo.png" alt="UEM" className="h-12 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]" />
          </div>

          {/* Desktop Left aligned Section: Lock, IEM/UEM Logos, Left Links, IGNITIA Brand, Right Links */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-4.5 flex-1 justify-start pr-12 lg:pr-16 xl:pr-20">
            {/* Admin Lock Access Icon */}
            <Link
              to="/admin/login"
              className="flex items-center justify-center text-white/40 hover:text-primary active:scale-95 transition-all duration-200 p-2 border border-white/5 hover:border-primary/30 rounded-lg hover:bg-primary/5 hover:shadow-[0_0_10px_rgba(139,92,246,0.15)] min-w-[32px] min-h-[32px] shrink-0"
              title="Admin Login"
            >
              <Lock size={14} />
            </Link>

            {/* Desktop IEM & UEM Logos (side-by-side) */}
            <div className="flex items-center gap-2 shrink-0 border-r border-white/10 pr-4 mr-1">
              <img src="/iem-logo.png" alt="IEM Logo" className="h-14 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.25)]" />
              <img src="/uem-logo.png" alt="UEM Logo" className="h-14 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.25)]" />
            </div>

            {/* First 4 quick links */}
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative py-1 text-xs xl:text-sm font-bold font-['Orbitron'] tracking-wider transition-colors duration-200 nav-link-underline whitespace-nowrap",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* IGNITIA Brand Logo & Text inline with same padding */}
            <Link to="/" className="flex items-center gap-2 shrink-0 mx-1">
              <img src="/ignitia-2d.png" alt="IGNITIA logo" className="h-8 w-8 rounded-full object-cover shadow-[0_0_24px_hsl(270_70%_60%/0.28)]" />
              <span className="font-['Orbitron'] text-sm xl:text-base font-black gradient-text inline-block tracking-widest">
                IGNITIA '26
              </span>
            </Link>

            {/* Remaining quick links */}
            {rightLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative py-1 text-xs xl:text-sm font-bold font-['Orbitron'] tracking-wider transition-colors duration-200 nav-link-underline whitespace-nowrap",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Register Now Button inline with extra left margin for visual emphasis */}
            <Link
              to="/events"
              className="glow-button register-button-orange text-xs xl:text-sm !px-5 !py-2 inline-flex items-center gap-2 pulse-cta shrink-0 font-['Orbitron'] font-extrabold ml-2 tracking-wider"
            >
              Register
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Mobile: Hamburger menu button */}
          <button
            ref={mobileButtonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-card/60 text-foreground backdrop-blur-xl"
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
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="m"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Static Character GIF sticking out on the right side */}
          {location.pathname !== "/faq" && (
            <motion.div
              animate={{ opacity: hidden ? 0 : 1, y: hidden ? -20 : 0 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block absolute top-[-5px] md:top-[0px] right-[-15px] lg:right-[-25px] pointer-events-none z-10"
            >
              <img
                src="/Transparent_gif_flipped.gif"
                alt="Navbar Character"
                className="w-28 md:w-40 lg:w-48 h-auto brightness-110 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]"
              />
            </motion.div>
          )}
        </motion.div>
      </motion.nav>

      <div className="mobile-nav-container" style={{ position: "relative", zIndex: 120 }}>
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="mobile-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[115] bg-black/60 lg:hidden"
                onClick={() => setIsOpen(false)}
              />

              <motion.aside
                key="mobile-menu"
                ref={mobileNavRef}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                id="mobile-navigation"
                className="fixed right-0 top-0 z-[120] h-[100dvh] w-[88vw] max-w-[380px] border-l border-white/10 bg-background/95 p-5 flex flex-col overflow-y-auto lg:hidden"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="font-['Orbitron'] text-base font-bold gradient-text tracking-wider">IGNITIA '26</span>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.28em] mt-1">Menu</p>
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
                          "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors font-['Orbitron'] font-semibold tracking-wider",
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

                <div className="flex-1 min-h-[24px]" />

                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary active:scale-98 transition-colors py-2.5 border border-white/5 bg-white/[0.02] rounded-xl hover:bg-primary/5 hover:border-primary/20 mb-3 shrink-0"
                >
                  <Lock size={14} />
                  <span>Admin Terminal</span>
                </Link>

                <Link
                  to="/events"
                  onClick={() => setIsOpen(false)}
                  className="glow-button register-button-orange text-center text-sm !px-6 !py-3 w-full inline-flex items-center justify-center gap-2 mb-8 mt-4 shrink-0 font-['Orbitron'] font-bold tracking-wider"
                >
                  Register Now
                  <ArrowRight size={14} />
                </Link>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;
