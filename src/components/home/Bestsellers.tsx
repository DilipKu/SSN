import { Sparkles } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import type { Product } from '../product/ProductCard';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Typography';

const MOCK_BEST_SELLERS: Product[] = [
  {
    id: '1',
    name: 'Premium Kaju Katli (Pure Ghee)',
    price: 850,
    originalPrice: 950,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg',
    secondaryImage: 'https://images.pexels.com/photos/37124553/pexels-photo-37124553.jpeg',
    badge: 'Bestseller',
    tags: ['Pure Ghee', 'Handcrafted', 'Festive Special'],
    isVegetarian: true,
  },
  {
    id: '2',
    name: 'Royal Motichoor Ladoo Box',
    price: 450,
    originalPrice: 499,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg',
    secondaryImage: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg',
    badge: 'Pure Ghee Special',
    tags: ['Traditional', 'Organic Jaggery'],
    isVegetarian: true,
  },
  {
    id: '3',
    name: 'Exotic Dry Fruit & Kesar Roll',
    price: 1200,
    originalPrice: 1400,
    rating: 5.0,
    reviews: 45,
    image: 'https://images.pexels.com/photos/2386158/pexels-photo-2386158.jpeg',
    secondaryImage: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg',
    badge: 'New Arrival',
    tags: ['Sugar Free Available', 'Saffron Infused'],
    isVegetarian: true,
  },
  {
    id: '4',
    name: 'Navratna Namkeen Mixture',
    price: 250,
    originalPrice: 280,
    rating: 4.6,
    reviews: 210,
    image: 'https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg',
    secondaryImage: 'https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg',
    badge: 'Crispy Mixture',
    tags: ['Low Oil', 'Spicy'],
    isVegetarian: true,
  },
];

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
          {MOCK_BEST_SELLERS.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
};
