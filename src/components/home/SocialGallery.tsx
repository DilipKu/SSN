import { Heading, Text } from '../ui/Typography';

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export const SocialGallery = () => {
  return (
    <section className="py-24 bg-white/40 border-t border-secondary-sand/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mb-3">
            <Instagram className="w-4 h-4 text-primary-gold" /> Social Highlights
          </span>
          <Heading level={2} className="text-3xl md:text-5xl font-bold text-text-brown">
            Share the Sweetness #SSNSweets
          </Heading>
          <Text className="text-text-brown/70 font-inter mt-3">
            Follow our Instagram feed for a daily peek behind the scenes, festive hamper updates, and customer moments.
          </Text>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1620352520334-d022b7dc0ce5?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1605651662908-11baecb59cf8?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1594895786196-85ddbd8750a9?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&q=80&w=400',
          ].map((img, i) => (
            <div key={i} className="group relative rounded-xl overflow-hidden aspect-square border border-secondary-sand/30 shadow-md">
              <img src={img} alt="Instagram Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <Instagram className="w-8 h-8 text-white drop-shadow-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
