import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Facebook, Instagram, Youtube, Mail, ArrowRight, MessageCircle } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Separator } from '@/src/components/ui/separator';
import { SOCIAL_LINKS } from '@/src/constants';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .014 5.398 0 12.037c0 2.125.556 4.197 1.613 6.06L0 24l6.105-1.604a11.83 11.83 0 005.94 1.585h.005c6.634 0 12.032-5.399 12.036-12.041a11.808 11.808 0 00-3.528-8.521z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    collections: [
      { name: 'Bridal Saree', path: '/category/saree' },
      { name: 'Heritage Lehenga', path: '/category/lehenga' },
      { name: 'Evening Gowns', path: '/category/gown' },
      { name: 'Festive Kurti Sets', path: '/category/kurti-set' }
    ],
    services: [
      { name: 'Styling Consultation', path: '/contact' },
      { name: 'Our Heritage', path: '/about' },
      { name: 'FAQs', path: '/faq' },
      { name: 'Shipping & Returns', path: '/shipping' },
      { name: 'Care Instructions', path: '/care' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Refund Policy', path: '/refund' }
    ]
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#FCF8F1] to-[#F5E6D3] text-slate-600 pt-16 pb-4 border-t border-[#E5D5D5] overflow-hidden">
      {/* Decorative Royal Pattern Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="global-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Column 1: Brand Essence */}
          <div className="space-y-6">
            <Link to="/" className="flex flex-col items-start group">
              <span className="text-3xl font-serif font-bold text-primary tracking-[0.25em] uppercase leading-none transition-colors group-hover:text-secondary">
                Kirdaar
              </span>
              <span className="text-[10px] text-secondary tracking-[0.5em] uppercase mt-2 font-bold block">
                Celebrations
              </span>
            </Link>
            <p className="text-sm leading-relaxed font-light text-slate-500 max-w-xs italic">
              "Every thread weaves a story of royalty, every motif a legacy of timeless artisanal excellence."
            </p>
            <div className="space-y-4 pt-2">
              <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
                Gali No.1, Mangal Vihar, Sunhera Rd, Roorkee, UK 247667
              </p>
              <p className="text-xs text-slate-500 tracking-wider">+91 9871434777</p>
              <p className="text-xs text-slate-500 tracking-wider">avneesh.kumar@kirdaarcelebrations.com</p>
            </div>
            <div className="flex gap-6 pt-2">
              {[
                { icon: Instagram, label: 'Instagram', href: SOCIAL_LINKS.instagram },
                { icon: Facebook, label: 'Facebook', href: SOCIAL_LINKS.facebook },
                { icon: Youtube, label: 'Youtube', href: SOCIAL_LINKS.youtube },
                { icon: WhatsAppIcon, label: 'WhatsApp', href: SOCIAL_LINKS.whatsapp }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-primary hover:scale-110 transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="space-y-6">
            <h4 className="text-primary text-[11px] uppercase tracking-[0.4em] font-bold">Collections</h4>
            <ul className="space-y-3">
              {footerLinks.collections.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-6">
            <h4 className="text-primary text-[11px] uppercase tracking-[0.4em] font-bold">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="text-primary text-[11px] uppercase tracking-[0.4em] font-bold">The Inner Circle</h4>
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-widest text-slate-500 italic leading-loose">
                Subscribe to receive early access to masterpieces and exclusive styling insights.
              </p>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="bg-white/40 border-[#E5D5D5] text-primary text-[10px] tracking-[0.2em] rounded-none h-11 px-4 focus-visible:ring-primary/20 placeholder:text-slate-400"
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-11 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 hover:shadow-[0_10px_20px_rgba(128,0,0,0.1)] group">
                  Subscribe Now <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

        </div>

        <Separator className="bg-primary/5 mb-4" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold order-2 md:order-1 text-center md:text-left">
            <p>© {currentYear} Kirdaar Celebrations. Handcrafted legacies of India.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 order-1 md:order-2">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[9px] uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-colors font-bold"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}