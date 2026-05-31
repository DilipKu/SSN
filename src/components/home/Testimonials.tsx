import { Heart, Star } from 'lucide-react';
import { Heading } from '../ui/Typography';
import { TESTIMONIALS } from '../../data';

export const Testimonials = () => {
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
        {TESTIMONIALS.map((test, i) => (
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
