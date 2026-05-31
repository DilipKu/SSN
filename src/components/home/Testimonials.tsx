import { Heart, Star } from 'lucide-react';
import { Heading } from '../ui/Typography';

export const Testimonials = () => {
  const testimonials = [
    {
      name: 'Pooja Sharma',
      role: 'Family Customer',
      rating: 5,
      comment: 'SSN Kaju Katli has been a permanent guest at our family functions since 1995. The consistency in taste, richness, and purity is unparalleled. The new packaging feels incredibly royal!',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Aditya Sen',
      role: 'Corporate HR',
      rating: 5,
      comment: 'We ordered over 500 dry fruit hampers for our employee Diwali gifting, and the feedback was phenomenal. Outstanding taste, reliable delivery, and premium corporate presentation.',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Meera Deshmukh',
      role: 'Wedding Planner',
      rating: 5,
      comment: 'The assorted laddus and decorative platters were a massive hit at our client wedding reception. SSN is my go-to luxury Indian confectionery brand without exception.',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    }
  ];

  return (
    <section className="py-24 container mx-auto px-4 md:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mb-3">
          <Heart className="w-4 h-4 text-accent-red" /> Client Reviews
        </span>
        <Heading level={2} className="text-3xl md:text-5xl font-bold text-text-brown luxury-border-gold pb-4">
          Happy Customer Testimonials
        </Heading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((test, i) => (
          <div 
            key={i} 
            className="bg-white p-8 rounded-2xl border border-secondary-sand/30 shadow-sm flex flex-col justify-between text-left space-y-6"
          >
            <div className="space-y-4">
              {/* Rating stars */}
              <div className="flex text-accent-saffron gap-0.5">
                {Array.from({ length: test.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-text-brown/80 text-sm font-inter italic leading-relaxed">
                "{test.comment}"
              </p>
            </div>
            
            {/* Profile card info */}
            <div className="flex items-center gap-3 pt-4 border-t border-secondary-sand/20">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img src={test.img} alt={test.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h5 className="font-playfair font-bold text-sm text-text-brown">{test.name}</h5>
                <p className="text-[10px] text-text-brown/50 font-inter">{test.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
