import { Award } from 'lucide-react';
import { Heading } from '../ui/Typography';

export const HeritageStory = () => {
  return (
    <section className="py-24 bg-[#FAF5EE] border-y border-secondary-sand/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Images collage */}
          <div className="flex-1 relative w-full aspect-square max-w-[450px]">
            <div className="w-full h-full rounded-2xl overflow-hidden border border-secondary-sand shadow-lg relative">
              <img 
                src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=800" 
                alt="Heritage Halwai kitchen" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-color"></div>
            </div>
            {/* Floating mini legacy image */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-xl overflow-hidden border-4 border-white shadow-xl hidden sm:block">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=300" 
                alt="Classic Sweet Shop" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Right story text */}
          <div className="flex-1 space-y-6 text-left">
            <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary-gold" /> Since 1995
            </span>
            <Heading level={2} className="text-3xl md:text-5xl font-bold text-text-brown">
              Our Traditional Heritage
            </Heading>
            <p className="text-text-brown/80 font-inter leading-relaxed">
              Deeply rooted in the authentic flavors of old New Delhi, Sudarshan Sweets & Namkeen began in a humble corner store with a single conviction: <strong>celebration requires absolute purity</strong>. 
            </p>
            <p className="text-text-brown/80 font-inter leading-relaxed">
              For over three decades, our master Halwais have blended handpicked nuts, milk-solids, and single-source pure desi ghee following complex recipe manuscripts. Today, we package this heritage with modern sanitary perfection, sending sweet memories to thousands of homes across India.
            </p>
            
            {/* Legacy timeline indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-secondary-sand/40">
              <div>
                <h5 className="font-playfair font-bold text-xl text-primary">1995</h5>
                <p className="text-xs text-text-brown/60 font-inter mt-1">First storefront opened in Delhi</p>
              </div>
              <div>
                <h5 className="font-playfair font-bold text-xl text-primary">50+</h5>
                <p className="text-xs text-text-brown/60 font-inter mt-1">Traditional sweet recipes preserved</p>
              </div>
              <div>
                <h5 className="font-playfair font-bold text-xl text-primary">100%</h5>
                <p className="text-xs text-text-brown/60 font-inter mt-1">Chemical-free pure preparation</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
