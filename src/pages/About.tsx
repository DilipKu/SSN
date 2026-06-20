import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Heading } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Award,
  Sparkles,
  Gift,
  Heart,
  /* Star, */
  BookOpen,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { MILESTONES, CRAFT_STEPS } from "../data";

export const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" as const },
  };

  const values = [
    {
      title: "Purity Uncompromised",
      desc: "Single-source pure cow ghee, organic jaggery, and premium hand-selected nuts. Zero chemical preservatives.",
      icon: <ShieldCheck className="w-6 h-6 text-primary-gold" />,
    },
    {
      title: "Generational Legacy",
      desc: "Our recipes are sacred culinary secrets, perfected over three decades by traditional master Halwais.",
      icon: <BookOpen className="w-6 h-6 text-primary-gold" />,
    },
    {
      title: "Handcrafted Excellence",
      desc: "Every single piece is shaped, decorated with real silver vark, and inspected by hand for flawless beauty.",
      icon: <Sparkles className="w-6 h-6 text-primary-gold" />,
    },
    {
      title: "Royal Gifting Art",
      desc: "Packaging designed to evoke royal heritage, using rich textures of velvet, wood, and brass finishes.",
      icon: <Gift className="w-6 h-6 text-primary-gold" />,
    },
    {
      title: "Hygienic Cleanliness",
      desc: "Modern ISO-certified state-of-the-art kitchens working in completely sterile environments daily.",
      icon: <CheckCircle2 className="w-6 h-6 text-primary-gold" />,
    },
    {
      title: "Celebration of Love",
      desc: "Confections crafted to sweeten bonds, mark milestones, and elevate life's most cherished celebrations.",
      icon: <Heart className="w-6 h-6 text-primary-gold" />,
    },
  ];

  const craftSteps = CRAFT_STEPS;
  const milestones = MILESTONES;

  return (
    <div className="min-h-screen flex flex-col bg-secondary-cream">
      <Navbar />

      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-secondary-sand/30">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/26988279/pexels-photo-26988279.jpeg"
              alt="Luxury Sweets Heritage"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#150B07]/80 via-[#1E0C05]/65 to-[#150B07]/90 mix-blend-multiply"></div>
            {/* Rotating Decorative Mandala */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-primary-gold/15 rounded-full animate-spin-slow pointer-events-none"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-primary-gold font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-primary-gold" /> Since 1995
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold font-playfair text-secondary-cream leading-tight"
            >
              Our Heritage of <br />
              <span className="text-primary-gold italic font-serif">
                Sweet Traditions
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-secondary-cream/80 max-w-xl mx-auto font-inter font-light leading-relaxed"
            >
              Crafting authentic Indian sweets with absolute purity, passion,
              and time-honored recipes for over three decades.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4"
            >
              <Link to="/category/all">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/95 text-secondary-cream border-none shadow-xl"
                >
                  Explore Collections
                </Button>
              </Link>
              <a href="#story">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 border-primary-gold text-primary-gold hover:bg-primary-gold/10 bg-transparent"
                >
                  Our Story
                </Button>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Our Story (Editorial Layout) */}
        <section id="story" className="py-24 container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Story Image */}
            <motion.div
              {...fadeInUp}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl border border-secondary-sand/30"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1B12]/40 to-transparent z-10"></div>
              <img
                src="https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg"
                alt="Generational Sweets Artisan"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]"
              />
            </motion.div>

            {/* Story Text */}
            <motion.div {...fadeInUp} className="space-y-8">
              <div className="space-y-4">
                <span className="text-primary font-bold text-xs uppercase tracking-widest block">
                  The Halwai Legacy
                </span>
                <Heading
                  level={2}
                  className="text-3xl md:text-5xl font-bold text-text-brown"
                >
                  Handcrafted from the <br />
                  Heart of Connaught Place
                </Heading>
              </div>

              <div className="w-16 h-[2px] bg-primary-gold"></div>

              <p className="text-base text-text-brown/85 font-inter leading-relaxed">
                SSN Sudarshan Sweets began with a singular, passionate promise:
                to revive and preserve the purity of traditional Indian mithai
                making. In an era of mass factory production, we chose the
                slower, more authentic path of handcrafted batch kitchen
                preparation.
              </p>

              <blockquote className="border-l-4 border-primary pl-6 py-2 italic font-serif text-lg text-primary max-w-lg bg-primary/5 rounded-r-xl">
                "Our sweets are not just recipes of ingredients; they are
                emotional stories of family celebrations, passed down through
                generations of master sweet artisans."
              </blockquote>

              <p className="text-base text-text-brown/85 font-inter leading-relaxed">
                Every kaju katli we slice, every laddu we roll, and every
                namkeen mixture we spice contains three decades of passion. We
                remain committed to our heritage recipe standards, ensuring that
                when you open a box of Sudarshan sweets, you receive pure
                celebration.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 3: Heritage Timeline */}
        <section className="py-24 bg-white/40 border-y border-secondary-sand/30 relative">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mb-3">
                <Clock className="w-4 h-4 text-primary-gold" /> Our Timeline
              </span>
              <Heading
                level={2}
                className="text-3xl md:text-5xl font-bold text-text-brown luxury-border-gold pb-4"
              >
                The Journey of Sweet Excellence
              </Heading>
            </div>

            <div className="relative border-l-2 border-primary-gold/30 ml-4 md:mx-auto md:w-max md:border-l-0">
              {/* Central Line for desktop */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-primary-gold/30 -translate-x-1/2 hidden md:block"></div>

              <div className="space-y-16">
                {milestones.map((milestone, idx) => (
                  <motion.div
                    key={idx}
                    {...fadeInUp}
                    className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-4xl mx-auto ${idx % 2 === 0 ? "" : "md:flex-row-reverse"}`}
                  >
                    {/* Glowing Marker */}
                    <div className="absolute left-[-9px] md:left-1/2 top-4 w-4 h-4 rounded-full bg-primary border-4 border-primary-gold z-20 -translate-x-1/2">
                      <div className="absolute inset-0 rounded-full bg-primary-gold animate-ping opacity-75"></div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full md:w-1/2 pl-6 md:pl-0 md:text-right text-left md:even:text-left space-y-3">
                      <span className="font-playfair text-3xl font-bold text-primary block">
                        {milestone.year}
                      </span>
                      <h4 className="font-playfair text-xl font-bold text-text-brown">
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-text-brown/70 font-inter leading-relaxed max-w-md md:ml-auto md:even:ml-0">
                        {milestone.desc}
                      </p>
                    </div>

                    {/* Image Column */}
                    <div className="w-full md:w-1/2">
                      <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md border border-secondary-sand/30">
                        <img
                          src={milestone.img}
                          alt={milestone.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Our Values */}
        <section className="py-24 container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mb-3">
              <Award className="w-4 h-4 text-primary-gold" /> Our Foundation
            </span>
            <Heading
              level={2}
              className="text-3xl md:text-5xl font-bold text-text-brown luxury-border-gold pb-4"
            >
              Values We Sweeten By
            </Heading>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                className="bg-white p-8 rounded-2xl border border-secondary-sand/30 shadow-sm hover:shadow-md luxury-card-glow space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                  {val.icon}
                </div>
                <h4 className="font-playfair font-bold text-xl text-text-brown">
                  {val.title}
                </h4>
                <p className="text-sm text-text-brown/70 font-inter leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 5: How We Craft Our Sweets */}
        <section className="py-24 bg-[#150B07] text-secondary-cream overflow-hidden border-y-2 border-primary-gold/45">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mb-3">
                <Sparkles className="w-4 h-4 text-primary-gold" /> Handcrafted
                Batch Kitchen
              </span>
              <Heading
                level={2}
                className="text-3xl md:text-5xl font-bold text-white luxury-border-gold pb-4"
              >
                The Art of Slow Confectionery
              </Heading>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeInUp} className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-gold/10 border border-primary-gold/30 text-primary-gold text-xs font-semibold uppercase tracking-wider">
                  🔥 100% Pure Desi Ghee & Generational Cooking
                </div>
                <p className="text-secondary-cream/80 text-base leading-relaxed font-inter">
                  We prepare our items daily in copper and brass vessels.
                  Cooking sweets slowly allows ingredients like dry fruits, milk
                  solids (khoya), and pure spices to fuse naturally, locking in
                  moisture and maintaining rich textures.
                </p>

                <div className="space-y-6">
                  {craftSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <span className="font-playfair text-primary-gold font-bold text-xl">
                        {step.num}
                      </span>
                      <div className="space-y-1">
                        <h5 className="font-playfair font-bold text-lg text-white">
                          {step.title}
                        </h5>
                        <p className="text-xs text-secondary-cream/60 font-inter leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="relative aspect-video lg:aspect-square overflow-hidden rounded-2xl border border-primary-gold/20 shadow-2xl"
              >
                <img
                  src="https://images.pexels.com/photos/7133661/pexels-photo-7133661.jpeg"
                  alt="Traditional Sweets Cooking"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#150B07]/80 via-transparent to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 6: Festival & Family Emotions */}
        <section className="py-24 container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6 mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-widest block">
              Sweetening Relationships
            </span>
            <Heading
              level={2}
              className="text-3xl md:text-5xl font-bold text-text-brown"
            >
              An Inseparable Part of Indian Celebrations
            </Heading>
            <div className="w-16 h-[2px] bg-primary-gold mx-auto"></div>
            <p className="text-text-brown/70 font-inter leading-relaxed">
              In India, sweets are not desserts. They are blessings, greetings,
              tokens of love, and pure heritage. We take pride in packaging joy
              for your life’s milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              {...fadeInUp}
              className="group relative h-[350px] rounded-2xl overflow-hidden border border-secondary-sand/50 shadow-md block"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-text-brown/95 via-text-brown/30 to-transparent z-10"></div>
              <img
                src="https://images.pexels.com/photos/20699854/pexels-photo-20699854.jpeg"
                alt="Festive Gifting"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-left space-y-2">
                <span className="text-[10px] text-primary-gold uppercase font-bold tracking-wider">
                  Festivals
                </span>
                <h4 className="font-playfair text-xl font-bold text-white">
                  Diwali & Rakhi Hampers
                </h4>
                <p className="text-xs text-white/70 font-inter font-light">
                  Custom royal platters designed to spread prosperity and light
                  to families.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              className="group relative h-[350px] rounded-2xl overflow-hidden border border-secondary-sand/50 shadow-md block"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-text-brown/95 via-text-brown/30 to-transparent z-10"></div>
              <img
                src="https://images.pexels.com/photos/31746092/pexels-photo-31746092.jpeg"
                alt="Royal Weddings"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-left space-y-2">
                <span className="text-[10px] text-primary-gold uppercase font-bold tracking-wider">
                  Weddings
                </span>
                <h4 className="font-playfair text-xl font-bold text-white">
                  Royal Shagun Boxes
                </h4>
                <p className="text-xs text-white/70 font-inter font-light">
                  Exquisite sweets boxes to welcome guests and celebrate sacred
                  wedding vows.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              className="group relative h-[350px] rounded-2xl overflow-hidden border border-secondary-sand/50 shadow-md block"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-text-brown/95 via-text-brown/30 to-transparent z-10"></div>
              <img
                src="https://images.pexels.com/photos/36235852/pexels-photo-36235852.jpeg"
                alt="Corporate Gifting"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-left space-y-2">
                <span className="text-[10px] text-primary-gold uppercase font-bold tracking-wider">
                  Corporate
                </span>
                <h4 className="font-playfair text-xl font-bold text-white">
                  Premium B2B Gifting
                </h4>
                <p className="text-xs text-white/70 font-inter font-light">
                  Custom branded premium wooden boxes and velvet packages for
                  key partnerships.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 7: Trust & Quality */}
        <section className="py-24 bg-white/40 border-y border-secondary-sand/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeInUp} className="space-y-6">
                <span className="text-primary font-bold text-xs uppercase tracking-widest block">
                  Quality Assured
                </span>
                <Heading
                  level={2}
                  className="text-3xl md:text-5xl font-bold text-text-brown"
                >
                  Our Purity Promise
                </Heading>
                <div className="w-16 h-[2px] bg-primary-gold"></div>
                <p className="text-base text-text-brown/85 font-inter leading-relaxed">
                  Purity is not a slogan for us; it is our brand foundation. We
                  test milk parameters daily in our in-house lab, work only in
                  sterile kitchens, and guarantee 100% vegetarian ingredients.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="p-4 bg-white border border-secondary-sand/35 rounded-xl">
                    <p className="font-playfair font-bold text-primary text-2xl">
                      100%
                    </p>
                    <p className="text-xs text-text-brown/60 uppercase font-semibold font-inter tracking-wider">
                      Desi Ghee
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-secondary-sand/35 rounded-xl">
                    <p className="font-playfair font-bold text-primary text-2xl">
                      Zero
                    </p>
                    <p className="text-xs text-text-brown/60 uppercase font-semibold font-inter tracking-wider">
                      Preservatives
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <div className="bg-white p-6 rounded-2xl border border-secondary-sand/20 shadow-sm text-left">
                  <ShieldCheck className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-playfair font-bold text-lg text-text-brown mb-1">
                    ISO Certified kitchens
                  </h4>
                  <p className="text-xs text-text-brown/60 font-inter leading-relaxed">
                    Top standards in safety and temperature control cooking
                    environments.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-secondary-sand/20 shadow-sm text-left">
                  <Sparkles className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-playfair font-bold text-lg text-text-brown mb-1">
                    Freshly Made Daily
                  </h4>
                  <p className="text-xs text-text-brown/60 font-inter leading-relaxed">
                    We batch cook every morning, ensuring zero shelf-aging of
                    confections.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 8: Testimonials */}
        {/* <section className="py-24 container mx-auto px-4 md:px-8">
           ... testimonials content ...
        </section> */}

        {/* Section 9: CTA Section */}
        <section className="relative py-28 overflow-hidden border-t border-secondary-sand/30">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg"
              alt="Luxury Sweets Display"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E0C05]/95 to-[#5A0B1D]/80 mix-blend-multiply"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl space-y-8">
            <Heading
              level={2}
              className="text-3xl md:text-5xl font-bold text-secondary-cream leading-tight"
            >
              Celebrate Every Occasion with <br />
              <span className="text-primary-gold italic font-serif">
                Authentic Indian Sweetness
              </span>
            </Heading>
            <p className="text-sm md:text-base text-secondary-cream/70 font-inter max-w-xl mx-auto leading-relaxed">
              Order fresh handmade cow ghee confections, dry fruit boxes, or
              customized corporate and wedding hampers delivered vacuum-sealed
              across India.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2">
              <Link to="/category/all" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 bg-primary-gold hover:bg-white hover:text-primary text-[#150B07] border-none font-bold shadow-lg"
                >
                  Shop Premium Sweets
                </Button>
              </Link>
              <Link to="/category/festive" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 border-secondary-cream text-secondary-cream hover:bg-white/10 bg-transparent font-bold"
                >
                  Explore Gift Hampers
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
