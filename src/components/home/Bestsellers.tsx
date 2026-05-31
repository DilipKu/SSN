import { Sparkles } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Typography';
import { BESTSELLER_PRODUCTS } from '../../data';

export const Bestsellers = () => {
  return (
    <section className="py-24 bg-white/40 backdrop-blur-sm border-y border-secondary-sand/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-primary-gold" /> Trending Celebrations
            </span>
            <Heading level={2} className="text-3xl md:text-5xl font-bold text-text-brown">
              Our Exquisite Bestsellers
            </Heading>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-secondary-sand bg-white text-text-brown hover:bg-secondary-cream">
              View All Products
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {BESTSELLER_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
};
