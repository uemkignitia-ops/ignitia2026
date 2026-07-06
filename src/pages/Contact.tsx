import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Instagram } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import ScrollProgress from "@/components/ScrollProgress";

const mapHref =
  "https://www.google.com/maps/place/University+of+Engineering+%26+Management,+Kolkata+(UEM)/@22.5599202,88.4899014,17z/data=!3m1!4b1!4m6!3m5!1s0x3a020b267a3cdc13:0xb3b21d652126f40!8m2!3d22.5599202!4d88.4899014!16s%2Fg%2F11c4pg5gwf?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D";
const mapEmbedSrc =
  "https://www.google.com/maps?q=University+of+Engineering+%26+Management,+Kolkata+(UEM)&z=17&output=embed";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", phone: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
        <ParticleField />
        <AnimatedBlobs />
        <ScrollProgress />
        <Navbar />

        <main className="flex-1 pt-32 pb-20">
          {/* Overlapping Slanted Scrolling Banners */}
          <div className="relative overflow-visible w-full mb-16 md:mb-20">
            {/* Banner 1: Negative Tilt */}
            <div 
              className="relative w-[110vw] left-[-5vw] overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 py-3 md:py-3.5 shadow-[0_10px_30px_rgba(139,92,246,0.35)] z-20"
              style={{ transform: "rotate(-4.5deg)" }}
            >
              <div className="flex whitespace-nowrap animate-marquee">
                <span className="text-xs md:text-sm font-heading font-black uppercase tracking-widest text-white mx-4">
                  ★ IGNITIA '26 IS COMING ★ REGISTER FOR TRACKS NOW ★ SEE YOU AT THE FEST ★ IEM-UEM GROUP ★
                </span>
                <span className="text-xs md:text-sm font-heading font-black uppercase tracking-widest text-white mx-4">
                  ★ IGNITIA '26 IS COMING ★ REGISTER FOR TRACKS NOW ★ SEE YOU AT THE FEST ★ IEM-UEM GROUP ★
                </span>
                <span className="text-xs md:text-sm font-heading font-black uppercase tracking-widest text-white mx-4">
                  ★ IGNITIA '26 IS COMING ★ REGISTER FOR TRACKS NOW ★ SEE YOU AT THE FEST ★ IEM-UEM GROUP ★
                </span>
              </div>
            </div>

            {/* Banner 2: Positive (Opposite) Tilt */}
            <div 
              className="relative w-[110vw] left-[-5vw] overflow-hidden bg-gradient-to-r from-fuchsia-600 to-pink-600 py-3 md:py-3.5 shadow-[0_10px_30px_rgba(236,72,153,0.35)] z-10 -mt-14 md:-mt-16"
              style={{ transform: "rotate(4.5deg)" }}
            >
              <div className="flex whitespace-nowrap animate-marquee" style={{ animationDirection: "reverse" }}>
                <span className="text-xs md:text-sm font-heading font-black uppercase tracking-widest text-white mx-4">
                  ★ THANKS FOR VISITING ★ EXPLORE GENERAL ENQUIRIES ★ DM FOR QUERIES ON INSTAGRAM ★ IGNITIA '26 ★
                </span>
                <span className="text-xs md:text-sm font-heading font-black uppercase tracking-widest text-white mx-4">
                  ★ THANKS FOR VISITING ★ EXPLORE GENERAL ENQUIRIES ★ DM FOR QUERIES ON INSTAGRAM ★ IGNITIA '26 ★
                </span>
                <span className="text-xs md:text-sm font-heading font-black uppercase tracking-widest text-white mx-4">
                  ★ THANKS FOR VISITING ★ EXPLORE GENERAL ENQUIRIES ★ DM FOR QUERIES ON INSTAGRAM ★ IGNITIA '26 ★
                </span>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 max-w-6xl">
            {/* Split Section Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
              {/* Left Column: Glassmorphic Message Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative bg-[#0c0b11]/85 border border-white/10 p-8 md:p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
              >
                {/* Glow effect at corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/45 rounded-tl-2xl m-3 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/45 rounded-br-2xl m-3 pointer-events-none" />

                <h3 className="font-heading font-bold text-2xl text-white tracking-wide mb-6">
                  Send a message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/[0.06] focus:outline-none transition-all duration-300"
                      placeholder="Name"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/[0.06] focus:outline-none transition-all duration-300"
                      placeholder="Phone"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">Email ID</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/[0.06] focus:outline-none transition-all duration-300"
                      placeholder="Email ID"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">Message</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/[0.06] focus:outline-none transition-all duration-300 resize-none"
                      placeholder="Enter your message"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitted}
                      className="glow-button inline-flex items-center justify-center gap-2.5 px-6 py-3 w-fit text-sm font-bold text-white uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-[1.03]"
                    >
                      <span>{submitted ? "Message Sent" : "Send"}</span>
                      <Send size={14} className="opacity-90" />
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Right Column: "Get in touch" details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                className="space-y-8 lg:pt-4"
              >
                <div className="space-y-4">
                  <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-none uppercase">
                    Get in <span className="gradient-text">touch</span>
                  </h1>
                  <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-lg">
                    Have questions about the hackathon? We’re here to help! Whether it’s about registration, rules, schedules, or anything else, feel free to reach out to us.
                  </p>
                </div>

                <div className="space-y-8 mt-10">
                  {/* Address */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">Location</h4>
                      <a
                        href={mapHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-base font-medium text-white/90 hover:text-primary transition-colors block mt-1"
                      >
                        University of Engineering & Management, Kolkata
                        <span className="block text-xs md:text-sm text-muted-foreground mt-0.5">
                          New Town, Action Area III, Kolkata - 700160
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Instagram DM */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
                      <Instagram size={18} className="text-pink-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">Instagram</h4>
                      <a
                        href="https://www.instagram.com/ignitia2k26"
                        target="_blank"
                        rel="noreferrer"
                        className="text-base font-semibold text-pink-400 hover:text-pink-350 transition-colors block mt-1"
                      >
                        Join Instagram / DM for queries
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">Email Address</h4>
                      <a
                        href="mailto:uemk.ignitia@gmail.com"
                        className="text-base font-medium text-white/90 hover:text-primary transition-colors block mt-1 font-mono"
                      >
                        uemk.ignitia@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Organizers Contacts */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono mb-2">Support Hotlines</h4>
                      <div className="flex flex-col gap-3">
                        <a
                          href="tel:+917439115647"
                          className="text-sm font-mono text-white/70 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <span className="text-white/40 text-xs">Snehashish Das:</span>
                          <span className="font-semibold">+91 74391 15647</span>
                        </a>
                        <a
                          href="tel:+917439223022"
                          className="text-sm font-mono text-white/70 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <span className="text-white/40 text-xs">Priyanshu Mitra:</span>
                          <span className="font-semibold">+91 74392 23022</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Google Map Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="mt-16 md:mt-24 border border-white/10 rounded-2xl overflow-hidden h-80 w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <iframe
                src={mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) sepia(50%)" }}
                loading="lazy"
                title="UEM Kolkata Location"
                className="opacity-70 mix-blend-screen"
              />
              <a
                href={mapHref}
                target="_blank"
                rel="noreferrer"
                className="absolute right-4 top-4 font-mono border border-white/15 bg-background/90 px-4 py-2 text-xs font-bold text-white rounded-lg backdrop-blur-md transition-all hover:bg-white/10 uppercase tracking-widest"
              >
                [ Get Directions ]
              </a>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contact;
