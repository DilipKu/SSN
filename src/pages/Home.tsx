import React, { useState, useEffect } from 'react';
import Hero from '@/src/components/luxury/Hero';
import OccasionSection from '@/src/components/luxury/OccasionSection';
import WeddingExperienceEngine from '@/src/components/wedding/WeddingExperienceEngine';
import ProductCard from '@/src/components/luxury/ProductCard';
import { ProductService } from '@/src/services/ProductService';
import { Product } from '@/src/types';
import { SAMPLE_PRODUCTS } from '@/src/constants';
import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { ArrowRight, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { Link } from 'react-router-dom';

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [homeContent, setHomeContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Fetch Best Sellers
        const products = await ProductService.getProducts({ isBestSeller: true });
        setBestSellers(products.length > 0 ? products : SAMPLE_PRODUCTS.filter(p => p.isBestSeller));

        // Fetch New Arrivals
        const newProducts = await ProductService.getProducts({ isNewArrival: true });
        setNewArrivals(newProducts.length > 0 ? newProducts : SAMPLE_PRODUCTS.filter(p => p.isNewArrival));

        // Fetch Homepage Settings
        const { data: settings, error } = await supabase
          .from('homepage_settings')
          .select('*')
          .eq('id', 'content')
          .single();

        if (!error && settings) {
          setHomeContent(settings);
        }
      } catch (error) {
        console.error('Error loading homepage data:', error);
        setBestSellers(SAMPLE_PRODUCTS.filter(p => p.isBestSeller));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <Hero slides={homeContent?.hero_slides} />
  {/* New Arrivals - Premium Grid */}
      <section className="section-padding bg-beige/5">
        <div className="global-container">
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-muted pb-8">
              <div className="max-w-2xl space-y-4">
                <span className="text-secondary font-medium tracking-[0.3em] uppercase text-[10px] block">Freshly Unveiled</span>
                <h2 className="text-4xl md:text-5xl font-serif text-primary">The New Arrivals</h2>
                <p className="text-muted-foreground text-lg font-light">
                  Discover the latest additions to our royal collection, straight from the artisan's loom.
                </p>
              </div>
              <Link to="/category/all">
                <Button variant="link" className="text-primary hover:text-secondary group text-xs uppercase tracking-widest font-bold p-0">
                  Shop the New Edit <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 inner-spacing-sm">
                {newArrivals.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
       {/* Best Sellers - Premium Grid */}
      <section className="section-padding bg-white">
        <div className="global-container">
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-muted pb-8">
              <div className="max-w-2xl space-y-4">
                <span className="text-secondary font-medium tracking-[0.3em] uppercase text-[10px] block">Most Loved</span>
                <h2 className="text-4xl md:text-5xl font-serif text-primary">The Kirdaar Best Seller</h2>
                <p className="text-muted-foreground text-lg font-light">
                  Iconic silhouettes, cherished by brides and families across the globe.
                </p>
              </div>
              <Link to="/category/all">
                <Button variant="link" className="text-primary hover:text-secondary group text-xs uppercase tracking-widest font-bold p-0">
                  View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 inner-spacing-sm">
                {bestSellers.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Shop by Occasion - Premium Editorial Grid */}
      <OccasionSection
        title={homeContent?.occasions_title}
        subtitle={homeContent?.occasions_subtitle}
      />

      {/* Wedding Experience Engine */}
      <WeddingExperienceEngine title={homeContent?.experience_title} />

     

    

      {/* Heritage Collection - Structured Editorial */}
      <section className="section-padding bg-[#FDF8F1]">
        <div className="global-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            {/* PERF FIX: Single whileInView wrapper instead of 2 separate ones.
                Cuts IntersectionObserver instances in half for this section. */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-[500px] space-y-10"
            >
              <div className="space-y-4">
                <span className="text-secondary font-medium tracking-[0.3em] uppercase text-[10px] block">Artisanal Excellence</span>
                <h2 className="text-5xl md:text-7xl font-serif text-primary leading-[1.1]">
                  {homeContent?.campaign_title || 'The Heritage Zardosi Edit'}
                </h2>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed font-light italic">
                {homeContent?.campaign_description || '"Every thread carries a legacy. Every motif whispers a secret from the royal courts of old. This collection is our tribute to the timeless art of hand-embroidery, meticulously crafted in Varanasi."'}
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/70">
                  <div className="w-8 h-[1px] bg-secondary" />
                  Real Gold Zari Weaving
                </div>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/70">
                  <div className="w-8 h-[1px] bg-secondary" />
                  Hand-crafted by Master Artisans
                </div>
              </div>

              <Link to="/category/all">
                <Button className="bg-primary hover:bg-primary/90 text-white px-12 h-14 text-[10px] uppercase tracking-[0.2em] font-bold rounded-none shadow-xl" style={{ transition: 'background-color 200ms ease' }}>
                  Discover the Collection
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] overflow-hidden shadow-2xl"
            >
              <img
                src={homeContent?.campaign_images?.[0] || "https://images.pexels.com/photos/18166782/pexels-photo-18166782.jpeg"}
                alt="Heritage Detail"
                className="h-full w-full object-cover hover:scale-105"
                style={{ transition: 'transform 1000ms ease' }}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials - GPU-optimized Marquee */}
      {/* PERF FIX: Added contain:paint+layout so the marquee's overflow doesn't
          invalidate the parent paint region during animation. */}
      <section className="section-padding bg-white" style={{ contain: 'paint', overflow: 'hidden' }}>
        <div className="space-y-16">
          <div className="text-center space-y-4 px-4">
            <span className="text-secondary font-medium tracking-[0.3em] uppercase text-[10px] block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary">Kirdaar Stories</h2>
            <div className="w-12 h-[1px] bg-secondary mx-auto mt-4" />
          </div>

          <div className="relative flex overflow-x-hidden">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                /* PERF: GPU-accelerated via transform keyframe (compositor thread).
                   will-change scoped tightly. Force layer with translateZ. */
                animation: marquee 40s linear infinite;
                will-change: transform;
                transform: translateZ(0);
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>
            <div className="flex whitespace-nowrap gap-8 py-10 animate-marquee w-max">
              {[
                { name: 'Ananya Sharma', role: 'Mumbai Bride', text: 'The attention to detail in my wedding lehenga was beyond anything I could have imagined. I truly felt like the protagonist of my own story.' },
                { name: 'Megha Kapoor', role: 'Delhi Bride', text: 'Finding a Kirdaar that matches your soul is rare. The team here understood my vision perfectly and delivered a masterpiece that I will cherish forever.' },
                { name: 'Priyanka Chopra', role: 'Celebrity Guest', text: 'Exquisite craftsmanship meets modern sensibility. Every piece tells a story of heritage and luxury. Highly recommended for every royal celebration.' },
                { name: 'Riya Mehra', role: 'London Bride', text: 'Ordering from across the globe was seamless. The video consultations and the final fit were absolutely perfect for my big day.' },
                { name: 'Sneha Gupta', role: 'Dubai Stylist', text: 'The collection perfectly blends traditional embroidery with modern silhouettes. It\'s my go-to for clients who seek timeless elegance.' },
                { name: 'Ishita Varma', role: 'Kolkata Bride', text: 'A truly royal experience. The fabric quality and the intricate zardosi work are unparalleled in the luxury market today.' }
              ].flatMap((item, _, arr) => [item, item]).map((testimonial, i) => (
                <div
                  key={i}
                  className="w-[300px] md:w-[380px] flex-shrink-0 bg-[#FDF8F1] border border-secondary/10 p-8 md:p-10 text-center space-y-6 luxury-shadow"
                >
                  <div className="flex justify-center gap-1 text-secondary/60">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-2 w-2 fill-current" />)}
                  </div>
                  <p className="italic font-light leading-relaxed text-primary text-sm whitespace-normal h-24 flex items-center justify-center">
                    "{testimonial.text}"
                  </p>
                  <div className="pt-4 border-t border-secondary/10">
                    <h4 className="font-serif text-primary text-lg">{testimonial.name}</h4>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-secondary font-bold mt-1">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}