import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";

const faqs = [
  {
    q: "Who can participate in IGNITIA '26?",
    a: "Any college student from across India can participate. Some events are open to individual participants while others require teams.",
  },
  {
    q: "Is there any registration fee?",
    a: "Most events are free to register. A few premium competitions may have a nominal fee. Details will be on each event page.",
  },
  {
    q: "Can students from other colleges join?",
    a: "Absolutely! IGNITIA '26 welcomes students from all colleges. We have 50+ colleges invited.",
  },
  {
    q: "How do teams register?",
    a: "Team leaders can register their team through the registration form. Each member's details will be collected during registration.",
  },
  {
    q: "Will certificates be provided?",
    a: "Yes! All participants will receive participation certificates. Winners get special certificates along with prizes.",
  },
  {
    q: "What should participants bring?",
    a: "Bring your college ID, laptop (for coding/hackathon events), and enthusiasm! Specific requirements will be mentioned on event pages.",
  },
];

const FAQSection = () => (
  <section id="faq" className="relative section-padding overflow-hidden py-32">
    {/* Decorative Background Elements */}
    <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[40rem] font-heading font-black opacity-[0.02] pointer-events-none select-none text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent leading-none">
      ?
    </div>
    
    <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

    <div className="container mx-auto max-w-4xl relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
        
        {/* Left Side: Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-left sticky top-32"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 text-primary shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <MessageCircleQuestion size={24} />
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Any <span className="gradient-text block mt-1">Questions?</span>
          </h2>
          
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
            Everything you need to know about participating in the biggest fest of the year. Can't find your answer? Reach out to us.
          </p>

          <a href="#contact" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider group">
            Contact Support
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.div>

        {/* Right Side: Accordion */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="glass-card px-6 md:px-8 py-2 border border-white/5 hover:border-primary/30 transition-all duration-300 data-[state=open]:border-primary/50 data-[state=open]:bg-white/[0.03]"
                >
                  <AccordionTrigger className="text-left font-heading text-base md:text-lg font-semibold text-white/90 hover:text-primary hover:no-underline [&[data-state=open]]:text-primary">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pt-2 pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

      </div>
    </div>
  </section>
);

export default FAQSection;
