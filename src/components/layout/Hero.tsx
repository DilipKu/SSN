import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import { Sparkles, Award, Gift, ShieldCheck } from "lucide-react";
import launchBanner from "../../assets/launch_banner.jpeg";

export const Hero = () => {
  const showOriginalHero = false;

  const stats = [
    { value: "30+ Years", label: "Royal Heritage" },
    { value: "100% Pure", label: "Desi Ghee & Ingredients" },
    { value: "50K+", label: "Happy Celebrations" },
    { value: "Handcrafted", label: "Traditional Recipes" },
  ];

  if (!showOriginalHero) {
    return (
      <section className="relative w-full bg-[#1E0C05]">
        <img 
          src={launchBanner} 
          alt="SSN Grand Opening Banner" 
          className="w-full h-auto object-cover"
        />
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-secondary-cream py-10 lg:py-20 border-b border-secondary-sand/30">
      {/* Subtle traditional pattern overlay and festive lights */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-gold to-transparent opacity-35"></div>
      </div>

      {/* Decorative Golden Mandala Glow Background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-gold/5 blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        {/* Left Text Content Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary-gold/30 text-primary text-xs font-semibold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-accent-saffron animate-pulse"></span>
            <span>Festive Celebration Collection 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-playfair text-text-brown leading-[1.1] tracking-tight">
            The Taste of <br />
            <span className="text-primary italic font-serif relative">
              Royal Indian Heritage
              <span className="absolute left-0 bottom-1 w-full h-[6px] bg-primary-gold/20 -z-10 rounded-full"></span>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-brown/80 max-w-xl mx-auto lg:mx-0 font-inter leading-relaxed">
            Savor the perfection of handcrafted sweets and savories passed down
            through generations. Crafted with single-source pure desi ghee,
            premium saffron, and organic nuts to bring luxury to every
            celebration.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Button
              size="lg"
              className="w-full sm:w-auto px-10 shadow-xl shadow-primary/25 bg-primary hover:bg-primary/95 text-secondary-cream border-none flex items-center gap-2 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              Shop Premium Mithai{" "}
              <Sparkles className="w-4 h-4 text-primary-gold" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-10 border-primary text-primary hover:bg-primary/5 bg-white/40 backdrop-blur-sm flex items-center gap-2"
            >
              Corporate Hampers <Gift className="w-4 h-4" />
            </Button>
          </div>

          {/* Heritage Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-secondary-sand/50">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="font-playfair font-bold text-2xl text-primary">
                  {stat.value}
                </p>
                <p className="text-xs text-text-brown/60 uppercase tracking-wider font-inter leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Collage / Image Column */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none mt-10 lg:mt-0 flex justify-center items-center">
          {/* Main Visual Frame with rotating mandalas */}
          <div className="relative w-full aspect-square max-w-[450px] sm:max-w-[480px]">
            {/* Background glowing circle */}
            <div className="absolute inset-0 bg-primary-gold/10 rounded-full blur-xl scale-95 animate-pulse-slow"></div>

            {/* Rotating border mandala */}
            <div className="absolute inset-[-15px] rounded-full border border-dashed border-primary-gold/20 animate-spin-slow pointer-events-none"></div>
            <div className="absolute inset-[-5px] rounded-full border border-double border-primary-gold/15 animate-[spin_50s_linear_infinite_reverse] pointer-events-none"></div>

            {/* main high-fidelity background image (Kaju Katli and luxury sweets plating) */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white relative z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1E0C05]/60 to-transparent mix-blend-multiply z-10"></div>
              <img
                src="https://images.pexels.com/photos/26988279/pexels-photo-26988279.jpeg"
                alt="Luxury Sweets Platter"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Floating Card 1: Kaju Katli Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-6 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-secondary-sand/50 flex items-center gap-3 max-w-[200px]"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                <img
                  src="https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg"
                  alt="Kaju Katli"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-playfair font-bold text-xs text-text-brown">
                  Kaju Katli
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-accent-saffron">★ 4.9</span>
                  <span className="text-[9px] text-text-brown/50">(120+)</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2: Ladoo Special */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-16 -right-6 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-secondary-sand/50 flex items-center gap-3 max-w-[200px]"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                <img
                  src="https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg"
                  alt="Motichoor Ladoo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-playfair font-bold text-xs text-text-brown">
                  Motichoor Ladoo
                </p>
                <p className="text-[10px] text-primary font-bold">₹450 / box</p>
              </div>
            </motion.div>

            {/* Floating Badge 3: 100% Pure Desi Ghee */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-6 -left-4 z-20 bg-[#1E0C05] text-white p-4 rounded-2xl shadow-2xl border border-primary-gold/40 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-playfair font-bold text-sm text-primary-gold">
                  100% Pure
                </p>
                <p className="text-[10px] text-secondary-cream/70 uppercase tracking-widest font-inter">
                  Desi Ghee Guarantee
                </p>
              </div>
            </motion.div>

            {/* Floating Badge 4: Handcrafted badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute top-24 -right-10 z-20 bg-white p-3 rounded-full shadow-lg border border-secondary-sand/30 flex items-center justify-center w-14 h-14"
              title="Handcrafted Quality"
            >
              <div className="text-center flex flex-col items-center justify-center text-primary">
                <Award className="w-6 h-6 text-primary-gold" />
                <span className="text-[8px] font-bold font-inter leading-none mt-0.5">
                  Heritage
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
