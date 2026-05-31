import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';
import { Button } from '../ui/Button';
import logo from '../../assets/ssn_logo.jpeg';

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const Facebook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const Twitter = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

export const Footer = () => {
  return (
    <footer className="bg-[#150B07] text-secondary-cream pt-20 pb-10 relative overflow-hidden border-t-2 border-primary-gold/40">
      
      {/* Subtle background glow */}
      <div className="absolute left-1/2 -bottom-20 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary-gold/5 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Top Trust Seals Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-secondary-cream/10 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-gold/10 border border-primary-gold/30 flex items-center justify-center text-primary-gold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5 className="font-playfair font-bold text-sm">100% Vegetarian</h5>
              <p className="text-[10px] text-secondary-cream/50 font-inter">Pure vegetarian kitchen</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-gold/10 border border-primary-gold/30 flex items-center justify-center text-primary-gold shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5 className="font-playfair font-bold text-sm">Pure Cow Ghee</h5>
              <p className="text-[10px] text-secondary-cream/50 font-inter">Single source dairy ghee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-gold/10 border border-primary-gold/30 flex items-center justify-center text-primary-gold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5 className="font-playfair font-bold text-sm">Zero Preservatives</h5>
              <p className="text-[10px] text-secondary-cream/50 font-inter">Freshly prepared daily</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-gold/10 border border-primary-gold/30 flex items-center justify-center text-primary-gold shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5 className="font-playfair font-bold text-sm">Trusted Since 1995</h5>
              <p className="text-[10px] text-secondary-cream/50 font-inter">30+ Years sweet legacy</p>
            </div>
          </div>
        </div>

        {/* Footer Links & Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 text-left">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src={logo} alt="SSN Sudarshan Sweets" className="h-16 w-auto object-contain rounded-xl border border-primary-gold/20" />
            </Link>
            <p className="text-secondary-cream/70 font-inter text-sm leading-relaxed max-w-xs">
              Crafting premium luxury confections using handpicked nuts, natural spices, and single-source pure desi ghee following legacy family recipes.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-gold hover:text-[#150B07] hover:border-primary-gold transition-colors duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-gold hover:text-[#150B07] hover:border-primary-gold transition-colors duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-gold hover:text-[#150B07] hover:border-primary-gold transition-colors duration-300">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-bold mb-6 text-primary-gold uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 font-inter text-sm text-secondary-cream/70">
              <li><Link to="/category/all" className="hover:text-primary-gold hover:translate-x-1 inline-block transition-transform duration-300">Explore All Mithai</Link></li>
              <li><Link to="/category/festive" className="hover:text-primary-gold hover:translate-x-1 inline-block transition-transform duration-300">Royal Gift Hampers</Link></li>
              <li><Link to="/about" className="hover:text-primary-gold hover:translate-x-1 inline-block transition-transform duration-300">Our Heritage Story</Link></li>
              <li><Link to="/contact" className="hover:text-primary-gold hover:translate-x-1 inline-block transition-transform duration-300">Contact Concierge</Link></li>
              <li><Link to="/orders" className="hover:text-primary-gold hover:translate-x-1 inline-block transition-transform duration-300">Track My Orders</Link></li>
            </ul>
          </div>

          {/* Store Flagships Locations */}
          <div>
            <h4 className="font-playfair text-lg font-bold mb-6 text-primary-gold uppercase tracking-wider">Store Flagships</h4>
            <ul className="space-y-4 font-inter text-xs text-secondary-cream/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-secondary-cream">Connaught Place Flagship</p>
                  <p className="opacity-80">Block E, Inner Circle, New Delhi, 110001</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-secondary-cream">Galleria Market Store</p>
                  <p className="opacity-80">First Floor, Sector 28, Gurugram, 122002</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-secondary-cream">Sector 18 Flagship</p>
                  <p className="opacity-80">Pocket K, Sector 18 Market, Noida, 201301</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h4 className="font-playfair text-lg font-bold mb-4 text-primary-gold uppercase tracking-wider">Customer Care</h4>
              <ul className="space-y-2.5 font-inter text-sm text-secondary-cream/70">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary-gold" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-gold" />
                  <span>care@sudarshansweets.com</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-2">
              <h5 className="font-inter font-bold text-xs mb-3 text-secondary-cream uppercase tracking-widest">Newsletter Gifting Circle</h5>
              <div className="flex bg-white/5 rounded-xl border border-white/10 p-1 focus-within:border-primary-gold transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="bg-transparent border-none outline-none text-xs px-3 py-2 w-full text-secondary-cream placeholder:text-secondary-cream/40 font-inter"
                />
                <Button className="rounded-lg bg-primary-gold text-[#150B07] hover:bg-white px-4 h-9 text-xs border-none font-bold shrink-0">
                  Join
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Payment partners */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-secondary-cream/40 text-xs font-inter">
            &copy; {new Date().getFullYear()} Sudarshan Sweets & Namkeen. Generational recipes preserved. Made in India.
          </p>
          
          {/* Payment Methods custom graphics/labels */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] text-secondary-cream/30 uppercase tracking-widest font-semibold font-inter mr-2">Secure Payments:</span>
            <div className="text-[10px] font-bold font-inter bg-white/5 px-2.5 py-1 rounded border border-white/10">UPI</div>
            <div className="text-[10px] font-bold font-inter bg-white/5 px-2.5 py-1 rounded border border-white/10">GPay</div>
            <div className="text-[10px] font-bold font-inter bg-white/5 px-2.5 py-1 rounded border border-white/10">Cards</div>
            <div className="text-[10px] font-bold font-inter bg-white/5 px-2.5 py-1 rounded border border-white/10">NetBanking</div>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

