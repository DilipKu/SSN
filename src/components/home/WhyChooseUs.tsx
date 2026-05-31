import { ShieldCheck, Award, Sparkles, Gift, Coffee, Truck } from 'lucide-react';
import { Heading, Text } from '../ui/Typography';
import { WHY_CHOOSE_US_ITEMS } from '../../data';
import type { ReactNode } from 'react';

const ICON_MAP: Record<string, ReactNode> = {
  shield: <ShieldCheck className="w-6 h-6 text-primary-gold" />,
  award: <Award className="w-6 h-6 text-primary-gold" />,
  sparkles: <Sparkles className="w-6 h-6 text-primary-gold" />,
  gift: <Gift className="w-6 h-6 text-primary-gold" />,
  coffee: <Coffee className="w-6 h-6 text-primary-gold" />,
  truck: <Truck className="w-6 h-6 text-primary-gold" />,
};

export const WhyChooseUs = () => {
  return (
    <section className="py-24 container mx-auto px-4 md:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mb-3">
          <ShieldCheck className="w-4 h-4 text-primary-gold" /> Our Guarantee
        </span>
        <Heading level={2} className="text-3xl md:text-5xl font-bold text-text-brown luxury-border-gold pb-4">
          Why Sudarshan Sweets?
        </Heading>
        <Text className="text-text-brown/70 font-inter mt-3">
          Every package is handled with exceptional care, bringing together local Indian farming ingredients and generational culinary techniques.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {WHY_CHOOSE_US_ITEMS.map((feature, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl border border-secondary-sand/30 shadow-sm luxury-card-glow text-left space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-2">
              {ICON_MAP[feature.iconKey]}
            </div>
            <h4 className="font-playfair font-bold text-xl text-text-brown">
              {feature.title}
            </h4>
            <p className="text-sm text-text-brown/70 font-inter leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
