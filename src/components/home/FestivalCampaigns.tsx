import { Gift } from 'lucide-react';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Typography';

export const FestivalCampaigns = () => {
  return (
    <section className="py-24 container mx-auto px-4 md:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-accent-saffron font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mb-3">
          <Gift className="w-4 h-4 text-accent-saffron" /> Festive Special
        </span>
        <Heading level={2} className="text-3xl md:text-5xl font-bold text-text-brown luxury-border-gold pb-4">
          Immersive Festival Campaigns
        </Heading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Box 1: Diwali Gift Hampers */}
        <div className="rounded-3xl overflow-hidden relative min-h-[380px] flex items-end p-8 border border-secondary-sand/50 shadow-xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#24030A]/95 via-[#24030A]/60 to-[#24030A]/20 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=800" 
            alt="Diwali Hampers" 
            className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="relative z-20 text-left max-w-md">
            <span className="px-3 py-1 bg-accent-saffron text-white text-[9px] font-bold tracking-widest uppercase rounded mb-3 inline-block">
              Royal Diwali Hampers
            </span>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-2">
              Exquisite Gold & Brass Diwali Gift Sets
            </h3>
            <p className="text-white/80 text-sm font-inter mb-6 leading-relaxed">
              Gift your loved ones the royal treatment with our premium assortment of dry fruits, custom kaju sweets, and beautifully crafted oil lamps.
            </p>
            <Button className="bg-primary-gold hover:bg-white text-primary font-bold border-none transition-colors">
              Explore Diwali Sets &rarr;
            </Button>
          </div>
        </div>

        {/* Box 2: Raksha Bandhan Hampers */}
        <div className="rounded-3xl overflow-hidden relative min-h-[380px] flex items-end p-8 border border-secondary-sand/50 shadow-xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1005]/95 via-[#1F1005]/60 to-[#1F1005]/20 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" 
            alt="Raksha Bandhan Gifting" 
            className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="relative z-20 text-left max-w-md">
            <span className="px-3 py-1 bg-primary text-secondary-cream text-[9px] font-bold tracking-widest uppercase rounded mb-3 inline-block">
              Rakhi Collections
            </span>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-2">
              Celebrate Sibling Bond with Pure Sweets
            </h3>
            <p className="text-white/80 text-sm font-inter mb-6 leading-relaxed">
              Deluxe boxes packed with velvet-wrapped custom designer threads, pure dry fruit barfis, and rich laddoos.
            </p>
            <Button className="bg-primary-gold hover:bg-white text-primary font-bold border-none transition-colors">
              Explore Rakhi Gifts &rarr;
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
