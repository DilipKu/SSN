import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Heading, Text } from '../components/ui/Typography';
import { ProductCard } from '../components/product/ProductCard';
import type { Product } from '../components/product/ProductCard';
import { Sparkles, ChevronDown, ChevronUp, SlidersHorizontal, Percent } from 'lucide-react';

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Kaju Katli (Pure Ghee)',
    price: 850,
    originalPrice: 950,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1620352520334-d022b7dc0ce5?auto=format&fit=crop&q=80&w=600',
    secondaryImage: 'https://images.unsplash.com/photo-1594895786196-85ddbd8750a9?auto=format&fit=crop&q=80&w=600',
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
    image: 'https://images.unsplash.com/photo-1605651662908-11baecb59cf8?auto=format&fit=crop&q=80&w=600',
    secondaryImage: 'https://images.unsplash.com/photo-1620352520334-d022b7dc0ce5?auto=format&fit=crop&q=80&w=600',
    badge: 'Pure Ghee Special',
    tags: ['Traditional', 'Organic Jaggery'],
    isVegetarian: true,
  },
  {
    id: '3',
    name: 'Assorted Dry Fruit Mithai Box',
    price: 1200,
    originalPrice: 1500,
    rating: 5.0,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1594895786196-85ddbd8750a9?auto=format&fit=crop&q=80&w=600',
    secondaryImage: 'https://images.unsplash.com/photo-1605651662908-11baecb59cf8?auto=format&fit=crop&q=80&w=600',
    badge: 'Luxury Gift Box',
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
    image: 'https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&q=80&w=600',
    secondaryImage: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600',
    badge: 'Crispy Mixture',
    tags: ['Low Oil', 'Spicy'],
    isVegetarian: true,
  },
  {
    id: '5',
    name: 'Premium Sugar Free Kaju Pista Roll',
    price: 900,
    originalPrice: 1100,
    rating: 4.7,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1594895786196-85ddbd8750a9?auto=format&fit=crop&q=80&w=600',
    secondaryImage: 'https://images.unsplash.com/photo-1620352520334-d022b7dc0ce5?auto=format&fit=crop&q=80&w=600',
    badge: 'Sugar Free',
    tags: ['Diabetic Friendly', 'Pure Cashews'],
    isVegetarian: true,
  },
  {
    id: '6',
    name: 'Royal Kesaria Peda',
    price: 500,
    originalPrice: 550,
    rating: 4.8,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1605651662908-11baecb59cf8?auto=format&fit=crop&q=80&w=600',
    badge: 'Festive Classic',
    tags: ['Pure Mawa', 'Royal Saffron'],
    isVegetarian: true,
  },
];

export const ProductListing = () => {
  const { categoryId } = useParams();
  const [filterAccordions, setFilterAccordions] = useState({
    categories: true,
    dietary: true,
    weight: true,
    occasion: false,
    price: true
  });
  
  const [priceRange, setPriceRange] = useState(2500);

  const toggleAccordion = (section: keyof typeof filterAccordions) => {
    setFilterAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const categoryTitle = categoryId 
    ? categoryId.replace('-', ' ') 
    : 'All Products';

  return (
    <div className="min-h-screen flex flex-col bg-secondary-cream">
      <Navbar />
      
      <main className="flex-grow">
        {/* Premium Category Header Banner */}
        <div className="relative bg-[#1A100B] text-white py-20 border-b border-primary-gold/30 overflow-hidden">
          {/* Decorative mandala shapes */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-gold via-transparent to-transparent"></div>
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-dashed border-primary-gold/10 animate-spin-slow pointer-events-none"></div>

          <div className="container mx-auto px-4 md:px-8 text-center relative z-10 space-y-4">
            <span className="text-primary-gold text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-gold" /> Royal Confections
            </span>
            <Heading level={1} className="capitalize text-4xl sm:text-5xl lg:text-6xl font-bold font-playfair text-secondary-cream">
              {categoryTitle}
            </Heading>
            <Text className="text-secondary-cream/70 max-w-xl mx-auto font-inter text-sm sm:text-base leading-relaxed">
              Indulge in our exquisite collection of premium sweets and traditional savory snacks, vacuum-sealed and shipped fresh.
            </Text>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-10">
          
          {/* Filters Sidebar Upgrade */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-secondary-sand/40 sticky top-28 space-y-6">
              
              <div className="flex items-center justify-between border-b border-secondary-sand/30 pb-3">
                <h3 className="font-playfair font-bold text-lg text-text-brown flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" /> Filter Options
                </h3>
                <button className="text-xs text-primary font-semibold hover:underline">Clear All</button>
              </div>

              {/* Categories Accordion */}
              <div>
                <button 
                  onClick={() => toggleAccordion('categories')}
                  className="w-full flex justify-between items-center font-playfair font-bold text-base text-text-brown mb-3 border-b border-secondary-sand/20 pb-1 cursor-pointer"
                >
                  <span>Categories</span>
                  {filterAccordions.categories ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                </button>
                {filterAccordions.categories && (
                  <ul className="space-y-2.5 font-inter text-sm text-text-brown/80 pl-1">
                    {['Premium Sweets', 'Sugar Free Delights', 'Savory Namkeen', 'Royal Hampers'].map((cat, i) => (
                      <li key={i} className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-primary rounded border-secondary-sand focus:ring-primary cursor-pointer" /> 
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Dietary Accordion */}
              <div>
                <button 
                  onClick={() => toggleAccordion('dietary')}
                  className="w-full flex justify-between items-center font-playfair font-bold text-base text-text-brown mb-3 border-b border-secondary-sand/20 pb-1 cursor-pointer"
                >
                  <span>Dietary Preferences</span>
                  {filterAccordions.dietary ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                </button>
                {filterAccordions.dietary && (
                  <ul className="space-y-2.5 font-inter text-sm text-text-brown/80 pl-1">
                    {['100% Vegetarian', 'Sugar Free', 'No Added Onion/Garlic', 'Gluten Free'].map((diet, i) => (
                      <li key={i} className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-primary rounded border-secondary-sand focus:ring-primary cursor-pointer" />
                        <span>{diet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Weight Accordion */}
              <div>
                <button 
                  onClick={() => toggleAccordion('weight')}
                  className="w-full flex justify-between items-center font-playfair font-bold text-base text-text-brown mb-3 border-b border-secondary-sand/20 pb-1 cursor-pointer"
                >
                  <span>Weight Options</span>
                  {filterAccordions.weight ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                </button>
                {filterAccordions.weight && (
                  <div className="grid grid-cols-2 gap-2 pl-1 pt-1">
                    {['250g', '500g', '1kg', '2kg'].map((w, i) => (
                      <button 
                        key={i} 
                        className="py-1.5 px-3 rounded-lg border border-secondary-sand/60 text-xs font-semibold text-text-brown/80 hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Occasion Accordion */}
              <div>
                <button 
                  onClick={() => toggleAccordion('occasion')}
                  className="w-full flex justify-between items-center font-playfair font-bold text-base text-text-brown mb-3 border-b border-secondary-sand/20 pb-1 cursor-pointer"
                >
                  <span>Special Occasion</span>
                  {filterAccordions.occasion ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                </button>
                {filterAccordions.occasion && (
                  <ul className="space-y-2.5 font-inter text-sm text-text-brown/80 pl-1">
                    {['Diwali Festival', 'Raksha Bandhan', 'Wedding Hampers', 'Puja Special'].map((occ, i) => (
                      <li key={i} className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-primary rounded border-secondary-sand focus:ring-primary cursor-pointer" />
                        <span>{occ}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Price Range Accordion */}
              <div>
                <button 
                  onClick={() => toggleAccordion('price')}
                  className="w-full flex justify-between items-center font-playfair font-bold text-base text-text-brown mb-3 border-b border-secondary-sand/20 pb-1 cursor-pointer"
                >
                  <span>Price Range</span>
                  {filterAccordions.price ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                </button>
                {filterAccordions.price && (
                  <div className="pl-1 space-y-2">
                    <input 
                      type="range" 
                      min="100" 
                      max="5000" 
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-primary h-1.5 bg-secondary-sand rounded-lg cursor-pointer" 
                    />
                    <div className="flex justify-between text-xs font-bold font-inter text-text-brown/70">
                      <span>₹100</span>
                      <span className="text-primary font-extrabold">Under ₹{priceRange}</span>
                      <span>₹5000+</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </aside>

          {/* Product Grid and Banner Showcase */}
          <div className="flex-1 space-y-8">
            
            {/* Promo Combo Banner inside Grid wrapper */}
            <div className="bg-primary/5 border border-primary-gold/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary-gold/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="text-left space-y-2 relative z-10">
                <span className="px-2.5 py-0.5 bg-primary text-secondary-cream text-[9px] font-bold tracking-widest uppercase rounded flex items-center gap-1 w-max">
                  <Percent className="w-3 h-3 text-primary-gold" /> Festive Promo offer
                </span>
                <h4 className="font-playfair font-bold text-xl text-primary">Royal Sweet & Savory Combo Bundle</h4>
                <p className="text-xs text-text-brown/70 max-w-lg font-inter">
                  Add any 1 Sweets box + 1 Namkeen box to cart and unlock an extra 10% instant discount at checkout. No code needed.
                </p>
              </div>
              <button className="bg-primary hover:bg-primary-gold hover:text-primary text-secondary-cream font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md shrink-0">
                Explore Combos
              </button>
            </div>

            {/* Sorting Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-secondary-sand/30 shadow-sm">
              <Text variant="muted" className="text-sm font-semibold">Showing {MOCK_PRODUCTS.length} exquisite delicacies</Text>
              <select className="bg-white border border-secondary-sand/80 rounded-lg px-3 py-1.5 text-xs font-inter font-bold text-text-brown outline-none focus:border-primary cursor-pointer shadow-sm">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
                <option>Customer Rating</option>
              </select>
            </div>
             
            {/* Grid of Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

