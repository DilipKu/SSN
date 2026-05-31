import { Gift, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Typography';

export const CorporateGifting = () => {
  return (
    <section className="py-24 bg-primary text-secondary-cream maroon-bg-gradient border-y border-primary-gold/30">
      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left text block */}
        <div className="flex-1 space-y-6 text-left">
          <span className="text-primary-gold font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-primary-gold animate-pulse" /> Corporate Partnerships
          </span>
          <Heading level={2} className="text-3xl md:text-5xl font-bold text-white">
            B2B & Festive Corporate Gifting
          </Heading>
          <p className="text-secondary-cream/80 font-inter leading-relaxed">
            Elevate your corporate gifting with custom brass insignia, custom leatherette/velvet box engravings, and sweet selections tailored specifically for premium client satisfaction.
          </p>
          <ul className="space-y-3 font-inter text-sm text-secondary-cream/70 pl-2">
            <li className="flex items-center gap-2">✓ Customized branding and emblem box layouts</li>
            <li className="flex items-center gap-2">✓ Personalized greeting envelopes with wax seals</li>
            <li className="flex items-center gap-2">✓ Safe door-to-door bulk pan-India distributions</li>
          </ul>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button className="w-full sm:w-auto px-8 bg-primary-gold hover:bg-white text-primary font-bold border-none transition-colors shadow-lg">
              Request Bulk Quote
            </Button>
            <Button variant="outline" className="w-full sm:w-auto px-8 border-primary-gold text-primary-gold hover:bg-white/5 flex items-center gap-2">
              <Download className="w-4 h-4" /> Download Catalogue
            </Button>
          </div>
        </div>

        {/* Right mockup visual */}
        <div className="flex-1 relative w-full aspect-square max-w-[420px] rounded-2xl overflow-hidden border border-primary-gold/30 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600" 
            alt="Luxury Hampers Customisation" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
          <div className="absolute bottom-4 right-4 bg-[#1E0C05]/95 border border-primary-gold/30 px-4 py-2.5 rounded-lg backdrop-blur-md">
            <p className="text-primary-gold text-xs font-bold font-playfair">SSN Premium Packaging Mockup</p>
          </div>
        </div>

      </div>
    </section>
  );
};
