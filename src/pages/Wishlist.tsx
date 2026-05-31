import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Heading, Text } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, Share2, Sparkles, Gift, ArrowRight, Star, Info } from 'lucide-react';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount?: number;
  occasions: string[];
  badges: {
    handcrafted?: boolean;
    pureGhee?: boolean;
    sugarFree?: boolean;
    festive?: boolean;
  };
}

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 'w1',
    name: 'Premium Kaju Katli (Pure Desi Ghee)',
    price: 850,
    originalPrice: 950,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg',
    stockStatus: 'in_stock',
    occasions: ['Diwali Wishlist', 'Family Favorites'],
    badges: { handcrafted: true, pureGhee: true }
  },
  {
    id: 'w2',
    name: 'Royal Motichoor Ladoo Box',
    price: 450,
    originalPrice: 499,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg',
    stockStatus: 'low_stock',
    stockCount: 3,
    occasions: ['Diwali Wishlist', 'Wedding Collection', 'Family Favorites'],
    badges: { handcrafted: true, pureGhee: true, festive: true }
  },
  {
    id: 'w3',
    name: 'Sugar-Free Dates & Kesar Roll',
    price: 1200,
    originalPrice: 1400,
    rating: 5.0,
    reviews: 45,
    image: 'https://images.pexels.com/photos/37124553/pexels-photo-37124553.jpeg',
    stockStatus: 'in_stock',
    occasions: ['Family Favorites', 'Corporate Gifts'],
    badges: { handcrafted: true, sugarFree: true }
  },
  {
    id: 'w4',
    name: 'Shahi Bengali Rasgulla Tray',
    price: 380,
    originalPrice: 420,
    rating: 4.7,
    reviews: 73,
    image: 'https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg',
    stockStatus: 'in_stock',
    occasions: ['Wedding Collection', 'Family Favorites'],
    badges: { handcrafted: true, festive: true }
  },
  {
    id: 'w5',
    name: 'Royal Roasted Almond Gifting Box',
    price: 1500,
    originalPrice: 1800,
    rating: 4.9,
    reviews: 110,
    image: 'https://images.pexels.com/photos/2386158/pexels-photo-2386158.jpeg',
    stockStatus: 'in_stock',
    occasions: ['Corporate Gifts', 'Diwali Wishlist'],
    badges: { handcrafted: true, pureGhee: false, festive: true }
  }
];

const RECOMMENDED_COMBOS = [
  {
    id: 'rec1',
    name: 'Assorted Kaju & Ladoo Gifting Platter',
    price: 1250,
    originalPrice: 1450,
    image: 'https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg',
    badge: 'Popular Combo'
  },
  {
    id: 'rec2',
    name: 'Dry Fruits & Sugar Free Saffron Roll Combo',
    price: 2400,
    originalPrice: 2800,
    image: 'https://images.pexels.com/photos/36235852/pexels-photo-36235852.jpeg',
    badge: 'Luxury Edit'
  }
];

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [activeTab, setActiveTab] = useState<string>('All Saved');
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const tabs = ['All Saved', 'Diwali Wishlist', 'Wedding Collection', 'Family Favorites', 'Corporate Gifts'];

  const handleRemoveItem = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const handleShareWishlist = () => {
    // Simulate share link copy
    navigator.clipboard.writeText(window.location.href);
    setShareFeedback('Wishlist share link copied to clipboard!');
    setTimeout(() => {
      setShareFeedback(null);
    }, 3000);
  };

  // Filter items based on active occasion tab
  const filteredWishlist = wishlist.filter(item => {
    if (activeTab === 'All Saved') return true;
    return item.occasions.includes(activeTab);
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeOut' as const }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary-cream">
      <Navbar />

      <main className="flex-grow pb-24">
        {/* Section 1: Page Header */}
        <section className="relative py-20 overflow-hidden bg-white/40 border-b border-secondary-sand/30">
          {/* Subtle gold lines background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-primary-gold)_0%,_transparent_65%)]"></div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10 text-center space-y-4 max-w-2xl">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-gold" /> Curated Elegance
            </span>
            <Heading level={1} className="text-3xl md:text-5xl font-bold text-text-brown">My Saved Collections</Heading>
            <Text className="text-text-brown/70 font-inter font-light text-sm md:text-base">
              Your handpicked selections of premium sweets, crispy savories, and traditional hampers ready for your next celebration.
            </Text>
          </div>
        </section>

        {/* Section 2: Occasion Organiser Tabs & Share Trigger */}
        <section className="py-8 container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-secondary-sand/40 pb-6">
            
            {/* Occasion Tabs */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold font-inter tracking-wider transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-primary text-secondary-cream shadow-md' 
                      : 'bg-white border border-secondary-sand text-text-brown/80 hover:bg-secondary-cream'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Share Option */}
            <div className="relative">
              <Button 
                onClick={handleShareWishlist}
                variant="outline" 
                className="border-secondary-sand text-text-brown bg-white flex items-center gap-2 hover:bg-secondary-cream"
              >
                <Share2 className="w-4 h-4 text-primary-gold" /> Share Collection
              </Button>
              <AnimatePresence>
                {shareFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 z-20 bg-[#1E0C05] text-primary-gold text-xs px-4 py-2.5 rounded-xl shadow-lg border border-primary-gold/30 font-inter w-64 text-center font-semibold"
                  >
                    {shareFeedback}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* Section 3: Wishlist Grid or Empty State */}
        <section className="container mx-auto px-4 md:px-8 py-8 text-left">
          <AnimatePresence mode="wait">
            {filteredWishlist.length === 0 ? (
              
              /* Section 4: Empty State Design */
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 bg-white rounded-3xl border border-secondary-sand/35 shadow-xl max-w-xl mx-auto space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-primary/5 mx-auto flex items-center justify-center text-primary-gold">
                  <Heart className="w-10 h-10 fill-current opacity-40" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-playfair font-bold text-2xl text-text-brown">Save Your Sweet Favorites</h4>
                  <p className="text-sm text-text-brown/65 font-inter max-w-md mx-auto leading-relaxed">
                    You haven't saved any confections to your <span className="font-semibold text-primary">{activeTab}</span>. Explore our gourmet catalog to construct your dream celebrations.
                  </p>
                </div>
                <div className="pt-2">
                  <Link to="/category/all">
                    <Button className="bg-primary hover:bg-primary/95 text-secondary-cream border-none h-12 px-8 flex items-center gap-2 mx-auto font-bold shadow-lg">
                      Explore Premium Sweets <ArrowRight className="w-4 h-4 text-primary-gold" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

            ) : (

              /* Wishlist Grid */
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredWishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                    className="bg-white rounded-2xl overflow-hidden border border-secondary-sand/30 shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Card Top: Image & overlays */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary-cream shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                        {item.badges.handcrafted && (
                          <span className="bg-primary text-secondary-cream text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-md border border-primary-gold/20 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-primary-gold fill-primary-gold" /> Handcrafted
                          </span>
                        )}
                        {item.badges.pureGhee && (
                          <span className="bg-[#1E0C05] text-primary-gold text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-md border border-primary-gold/30">
                            🐄 Pure Desi Ghee
                          </span>
                        )}
                        {item.badges.sugarFree && (
                          <span className="bg-emerald-700 text-white text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-md border border-emerald-500/20">
                            🌱 Sugar Free
                          </span>
                        )}
                      </div>

                      {/* Stock level indicators */}
                      {item.stockStatus === 'low_stock' && (
                        <div className="absolute bottom-4 left-4 z-10 bg-accent-red/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md backdrop-blur-sm">
                          <Info className="w-3.5 h-3.5" /> Only {item.stockCount} boxes left!
                        </div>
                      )}
                      
                      {/* Delete icon shortcut overlay */}
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-secondary-sand/50 flex items-center justify-center text-text-brown/65 hover:text-accent-red hover:bg-white transition-all shadow-md"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Card Middle: Text details */}
                    <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-primary-gold">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.floor(item.rating) ? 'fill-current' : 'opacity-30'}`} />
                          ))}
                          <span className="text-[10px] text-text-brown/55 font-bold font-inter ml-1">({item.reviews})</span>
                        </div>
                        <h4 className="font-playfair font-bold text-xl text-text-brown leading-snug group-hover:text-primary transition-colors">
                          {item.name}
                        </h4>
                      </div>

                      <div className="pt-4 border-t border-secondary-sand/20 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-playfair font-bold text-lg text-primary">₹{item.price}</span>
                          <span className="text-xs text-text-brown/40 line-through">₹{item.originalPrice}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-text-brown/50 font-inter">
                          Per 500g box
                        </span>
                      </div>
                    </div>

                    {/* Card Bottom: Actions */}
                    <div className="p-6 pt-0 shrink-0 flex gap-3 border-t border-secondary-sand/15 pt-4">
                      <Button 
                        onClick={() => handleRemoveItem(item.id)}
                        variant="outline" 
                        size="sm" 
                        className="border-secondary-sand text-text-brown/60 hover:text-accent-red hover:bg-red-50/50 shrink-0 w-11 h-11 rounded-xl p-0 flex items-center justify-center"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <Button className="flex-grow bg-primary hover:bg-primary/95 text-secondary-cream border-none h-11 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-primary-gold" /> Move to Cart
                      </Button>
                    </div>

                  </motion.div>
                ))}
              </motion.div>

            )}
          </AnimatePresence>
        </section>

        {/* Section 5: Curated Pairings & Combo Recommendations */}
        <section className="py-16 bg-white/40 border-y border-secondary-sand/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
                <Gift className="w-4 h-4 text-primary-gold" /> Perfect Pairings
              </span>
              <Heading level={2} className="text-2xl md:text-4xl font-bold text-text-brown">
                Recommended Gifting Combos
              </Heading>
              <p className="text-xs md:text-sm text-text-brown/65 font-inter mt-2">
                Elevate your selected confections with our hand-assembled sweet and savory pairings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {RECOMMENDED_COMBOS.map((combo) => (
                <motion.div 
                  key={combo.id}
                  {...fadeInUp}
                  className="bg-white rounded-2xl overflow-hidden border border-secondary-sand/40 shadow-md p-5 flex flex-col sm:flex-row items-center gap-6 hover:shadow-lg transition-all"
                >
                  <div className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden shrink-0 border border-secondary-sand/20">
                    <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left space-y-4 flex-grow">
                    <div className="space-y-1">
                      <span className="bg-primary/5 text-primary text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-primary-gold/15 inline-block">
                        {combo.badge}
                      </span>
                      <h4 className="font-playfair font-bold text-lg text-text-brown">{combo.name}</h4>
                    </div>
                    <div className="flex items-center justify-between gap-4 pt-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-playfair font-bold text-base text-primary">₹{combo.price}</span>
                        <span className="text-xs text-text-brown/40 line-through">₹{combo.originalPrice}</span>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/95 text-secondary-cream border-none font-bold text-xs">
                        Add Combo
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
