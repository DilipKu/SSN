import { Smartphone, Download, QrCode } from 'lucide-react';
import { Heading } from '../ui/Typography';
import logo from '../../assets/ssn_logo.jpeg';

export const AppDownload = () => {
  return (
    <section className="py-20 container mx-auto px-4 md:px-8">
      <div className="bg-secondary-sand/40 border border-secondary-sand/60 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left text column */}
        <div className="flex-1 space-y-6 text-left max-w-xl">
          <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-primary" /> Premium Mobile Experience
          </span>
          <Heading level={2} className="text-3xl md:text-5xl font-bold text-text-brown">
            Order Fresh Sweets via SSN Android & iOS App
          </Heading>
          <p className="text-text-brown/80 font-inter leading-relaxed">
            Enjoy instant notifications on daily batches, express checkout, tracked shipping, and exclusive mobile-only coupon offerings.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#" className="h-12 w-40 bg-[#1E0C05] text-white hover:bg-primary transition-colors rounded-xl flex items-center justify-center gap-2 border border-primary-gold/20 shadow-md">
              <Download className="w-4 h-4 text-primary-gold" />
              <span className="text-left font-inter"><span className="text-[9px] block opacity-75">GET IT ON</span><span className="text-xs font-bold block leading-none">Google Play</span></span>
            </a>
            <a href="#" className="h-12 w-40 bg-[#1E0C05] text-white hover:bg-primary transition-colors rounded-xl flex items-center justify-center gap-2 border border-primary-gold/20 shadow-md">
              <Download className="w-4 h-4 text-primary-gold" />
              <span className="text-left font-inter"><span className="text-[9px] block opacity-75">Download on</span><span className="text-xs font-bold block leading-none">App Store</span></span>
            </a>
          </div>
        </div>

        {/* Right smartphone mockup frame */}
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-8 justify-center">
          {/* CSS Phone Frame */}
          <div className="w-[240px] h-[480px] rounded-[36px] bg-[#1E0C05] border-[6px] border-[#2B1B12] shadow-2xl relative overflow-hidden flex flex-col justify-between shrink-0">
            {/* Speaker top bar */}
            <div className="w-20 h-4 bg-[#2B1B12] rounded-full mx-auto mt-2 z-20"></div>
            {/* Mobile app preview image */}
            <div className="w-full h-full absolute inset-0 z-10 pt-8 pb-4 px-2">
              <div className="bg-secondary-cream w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between p-3 border border-secondary-sand relative">
                <img src={logo} alt="App logo" className="h-6 w-auto mix-blend-multiply self-center" />
                <div className="aspect-[4/3] rounded-lg overflow-hidden my-1">
                  <img src="https://images.unsplash.com/photo-1620352520334-d022b7dc0ce5?auto=format&fit=crop&q=80&w=150" alt="App Sweet Preview" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 text-center">
                  <p className="font-playfair font-bold text-xs text-text-brown">Premium Sweets App</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary text-white inline-block">Order Now</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* QR Code container */}
          <div className="bg-white p-6 rounded-2xl border border-secondary-sand shadow-lg flex flex-col items-center gap-3">
            <QrCode className="w-24 h-24 text-text-brown" />
            <p className="text-xs font-bold font-inter text-text-brown/70">Scan to Download App</p>
          </div>
        </div>

      </div>
    </section>
  );
};
