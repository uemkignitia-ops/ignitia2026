import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";
import { TerminalSubheading } from "@/components/TerminalSubheading";

const mapHref =
  "https://www.google.com/maps/place/University+of+Engineering+%26+Management,+Kolkata+(UEM)/@22.5599202,88.4899014,17z/data=!3m1!4b1!4m6!3m5!1s0x3a020b267a3cdc13:0xb3b21d652126f40!8m2!3d22.5599202!4d88.4899014!16s%2Fg%2F11c4pg5gwf?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D";
const mapEmbedSrc =
  "https://www.google.com/maps?q=University+of+Engineering+%26+Management,+Kolkata+(UEM)&z=17&output=embed";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background scanline-overlay overflow-x-hidden">
        <ParticleField />
        <AnimatedBlobs />
        <ScrollProgress />
        <Navbar />

        <main className="flex-1">
          <section className="relative pt-28 pb-12 overflow-hidden w-full">
            {/* Radial purple ambient glow behind title */}
            <div
              className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 50% at 60% 40%, rgba(139,92,246,0.18) 0%, transparent 70%)",
              }}
            />

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-[11px] md:text-xs text-primary uppercase tracking-[0.45em] mb-5 font-semibold font-mono flex items-center justify-center gap-2"
            >
              <Mail size={14} className="text-primary" /> CONTACT US
            </motion.p>

            {/* Main Title — full-width, centered, perspective tilt */}
            <div className="relative w-full" style={{ perspective: "800px" }}>
              <motion.div
                initial={{ opacity: 0, rotateX: 12, y: 30 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Shadow/depth clone */}
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
                  style={{ transform: "translateZ(-40px) translateY(12px)" }}
                >
                  <span
                    className="font-heading font-black uppercase leading-none tracking-tight text-center w-full"
                    style={{
                      fontSize: "clamp(2.5rem, 10vw, 5.5rem)",
                      color: "rgba(88,28,235,0.25)",
                      filter: "blur(8px)",
                    }}
                  >
                    GET IN TOUCH
                  </span>
                </div>

                {/* Actual title */}
                <h1
                  className="font-heading font-black uppercase leading-none tracking-tight w-full text-center relative"
                  style={{ fontSize: "clamp(2.5rem, 10vw, 5.5rem)", transformStyle: "preserve-3d" }}
                >
                  {/* GET IN — dimmer, lighter weight */}
                  <span
                    className="inline-block mr-[0.15em]"
                    style={{
                      color: "rgba(255,255,255,0.28)",
                      fontWeight: 300,
                      textShadow: "0 2px 20px rgba(139,92,246,0.1)",
                    }}
                  >
                    GET IN
                  </span>

                  {/* TOUCH — full white with 3D purple bloom */}
                  <span
                    className="inline-block relative"
                    style={{
                      color: "#ffffff",
                      textShadow: [
                        "0 0 60px rgba(139,92,246,0.9)",
                        "0 0 120px rgba(139,92,246,0.5)",
                        "0 2px 0 rgba(88,28,235,0.6)",
                        "0 4px 0 rgba(68,14,180,0.4)",
                        "0 8px 20px rgba(0,0,0,0.6)",
                      ].join(", "),
                    }}
                  >
                    TOUCH
                  </span>
                </h1>
              </motion.div>
            </div>

            <div className="mt-10 mb-6 flex justify-center w-full px-4 relative z-10">
              <TerminalSubheading 
                text="We're here to help — for general enquiries, partnerships, or media requests, drop us a message."
                className="text-muted-foreground text-base md:text-lg font-medium text-center max-w-2xl"
              />
            </div>
          </section>

          <section className="section-padding">
            <div className="container mx-auto max-w-5xl">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                <div className="space-y-5">
                  <div className="relative overflow-hidden border border-primary/20 bg-black/60 p-5 md:p-6 transition-all duration-300 hover:border-primary/60 group" style={{ clipPath: "polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}>
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(139,92,246,1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <div className="absolute left-0 top-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                        <Mail size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-1">Email Address</div>
                        <a
                          href="mailto:ignitia@uem.edu.in"
                          className="text-sm font-mono text-white/70 transition-colors duration-200 hover:text-white"
                        >
                          ignitia@uem.edu.in
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden border border-primary/20 bg-black/60 p-5 md:p-6 transition-all duration-300 hover:border-primary/60 group" style={{ clipPath: "polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}>
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(139,92,246,1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <div className="absolute left-0 top-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                        <Phone size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-1">Phone Number</div>
                        <a
                          href="tel:+919876543210"
                          className="text-sm font-mono text-white/70 transition-colors duration-200 hover:text-white"
                        >
                          +91 98765 43210
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden border border-primary/20 bg-black/60 p-5 md:p-6 transition-all duration-300 hover:border-primary/60 group" style={{ clipPath: "polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}>
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(139,92,246,1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <div className="absolute left-0 top-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                        <MapPin size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-1">Location</div>
                        <a
                          href={mapHref}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-mono text-white/70 transition-colors duration-200 hover:text-white"
                        >
                          UEM Kolkata, New Town
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="group relative mt-4 hidden overflow-hidden border-2 border-primary/30 bg-black/80 h-64 transition-all duration-300 hover:border-primary/80 lg:block shadow-[0_0_30px_rgba(139,92,246,0.15)]" style={{ clipPath: "polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}>
                    <div className="absolute inset-0 pointer-events-none bg-primary/10 animate-pulse z-10" />
                    
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary z-20 m-2" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary z-20 m-2" />
                    
                    <iframe
                      src={mapEmbedSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) sepia(50%)" }}
                      loading="lazy"
                      title="UEM Kolkata Location"
                      className="opacity-80 mix-blend-screen"
                    />
                    <a
                      href={mapHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open UEM Kolkata map"
                      className="absolute right-4 top-4 z-30 font-mono border border-primary/50 bg-black/80 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur-md transition-all hover:bg-primary/20 shadow-[0_0_10px_rgba(139,92,246,0.3)] uppercase tracking-widest"
                    >
                      [ Get Directions ]
                    </a>
                  </div>
                </div>

                <div className="relative border border-primary/20 bg-black/80 p-6 md:p-8 lg:min-h-[100%] shadow-[0_0_30px_rgba(139,92,246,0.1)] group" style={{ clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 0 100%)" }}>
                  <div className="absolute top-0 right-0 w-[42.4px] h-[42.4px] bg-primary/20 origin-bottom-left rotate-45 -translate-y-full" />
                  
                  <div className="mb-8">
                    <TerminalSubheading 
                      text="Send us a message"
                      className="font-mono text-xl md:text-2xl font-bold text-primary uppercase"
                    />
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="text-xs font-mono text-primary/70 uppercase tracking-[0.2em] mb-2 block">&gt; Full Name</label>
                      <input className="w-full px-4 py-3 bg-white/[0.02] border-b-2 border-primary/30 text-white font-mono placeholder:text-white/20 focus:border-primary focus:outline-none focus:bg-primary/5 transition-all" placeholder="ENTER NAME_" required />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-primary/70 uppercase tracking-[0.2em] mb-2 block">&gt; Email Address</label>
                      <input type="email" className="w-full px-4 py-3 bg-white/[0.02] border-b-2 border-primary/30 text-white font-mono placeholder:text-white/20 focus:border-primary focus:outline-none focus:bg-primary/5 transition-all" placeholder="ENTER EMAIL_" required />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-primary/70 uppercase tracking-[0.2em] mb-2 block">&gt; Message</label>
                      <textarea rows={5} className="w-full px-4 py-3 bg-white/[0.02] border-b-2 border-primary/30 text-white font-mono placeholder:text-white/20 focus:border-primary focus:outline-none focus:bg-primary/5 transition-all resize-none" placeholder="ENTER MESSAGE_" required />
                    </div>
                    <button type="submit" className="w-full font-mono font-bold uppercase tracking-widest text-sm inline-flex items-center justify-center gap-3 px-6 py-4 border border-primary text-primary hover:bg-primary hover:text-black transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]">
                      <Send size={16} /> {submitted ? "MESSAGE SENT" : "SEND MESSAGE"}
                    </button>
                  </form>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-white/8 bg-card/45 h-64 transition-all duration-200 hover:border-primary/25 hover:shadow-[0_20px_60px_rgba(255,83,48,0.12)] lg:hidden">
                    <iframe
                      src={mapEmbedSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                      loading="lazy"
                      title="UEM Kolkata Location"
                    />
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open UEM Kolkata map"
                    className="absolute right-3 top-3 rounded-full border border-primary/30 bg-background/80 px-3 py-1 text-[11px] font-semibold text-primary backdrop-blur-md transition-colors hover:bg-primary hover:text-white"
                  >
                    Open Maps
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contact;
