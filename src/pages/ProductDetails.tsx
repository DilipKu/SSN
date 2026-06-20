import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Heading, Text } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { 
  Heart, ShoppingBag, Star, ShieldCheck, Truck, ChevronRight, 
  Flame, Award, Gift, Sparkles, Video, RotateCw, Plus, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock product data for PDP
const MOCK_PRODUCT = {
  id: '1',
  name: 'Premium Kaju Katli (Pure Ghee)',
  price: 850,
  originalPrice: 950,
  rating: 4.8,
  reviews: 124,
  description: 'Our signature Kaju Katli is crafted with handpicked premium cashews, pure desi ghee, and the perfect touch of sweetness. Each diamond is delicately adorned with pure silver vark (varq), making it the ultimate symbol of celebration and luxury gifting.',
  images: [
    'https://images.unsplash.com/photo-1620352520334-d022b7dc0ce5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1594895786196-85ddbd8750a9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1605651662908-11baecb59cf8?auto=format&fit=crop&q=80&w=800'
  ],
  ingredients: 'Premium Cashews, Sugar, Pure Desi Ghee, Silver Vark',
  shelfLife: '15 Days from date of manufacture',
  isVegetarian: true,
};

// Similar products mock
const MOCK_SIMILAR_SWEETS = [
  {
    id: '2',
    name: 'Royal Motichoor Ladoo Box',
    price: 450,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1605651662908-11baecb59cf8?auto=format&fit=crop&q=80&w=400',
    badge: 'Bestseller',
    isVegetarian: true,
  },
  {
    id: '3',
    name: 'Assorted Dry Fruit Mithai Box',
    price: 1200,
    originalPrice: 1500,
    rating: 5.0,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1594895786196-85ddbd8750a9?auto=format&fit=crop&q=80&w=400',
    badge: 'Luxury Gift Box',
    isVegetarian: true,
  },
  {
    id: '4',
    name: 'Navratna Namkeen Mixture',
    price: 250,
    rating: 4.6,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&q=80&w=400',
    isVegetarian: true,
  }
];

export const ProductDetails = () => {
  useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState('500g');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'gifting'>('details');

  // Video / 360 modal states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [show360Modal, setShow360Modal] = useState(false);

  // Combo builder states
  const [includeNamkeen, setIncludeNamkeen] = useState(true);
  const [includeLadoo, setIncludeLadoo] = useState(false);

  const calculateComboTotal = () => {
    let total = MOCK_PRODUCT.price * quantity;
    if (includeNamkeen) total += 250;
    if (includeLadoo) total += 450;
    return total;
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary-cream">
      <Navbar />
      
      <main className="flex-grow pb-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 md:px-8 py-6 flex items-center text-xs sm:text-sm font-inter text-text-brown/60">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to="/category/sweets" className="hover:text-primary transition-colors">Premium Sweets</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-text-brown font-semibold line-clamp-1">{MOCK_PRODUCT.name}</span>
        </div>

        <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Image Gallery Column */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-md border border-secondary-sand/40 group">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={MOCK_PRODUCT.images[activeImage]} 
                alt={MOCK_PRODUCT.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Top-Left vegetarian dot */}
              {MOCK_PRODUCT.isVegetarian && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-md border border-green-600 z-10">
                  <div className="w-3.5 h-3.5 bg-green-600 rounded-full"></div>
                </div>
              )}

              {/* Bottom Interactive overlays (video review and 360 preview) */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-10 px-4">
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="px-4 py-2 bg-white/95 hover:bg-primary hover:text-white transition-all text-xs font-bold font-inter text-text-brown rounded-full shadow-lg border border-secondary-sand/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-primary-gold" /> Watch Video
                </button>
                <button 
                  onClick={() => setShow360Modal(true)}
                  className="px-4 py-2 bg-white/95 hover:bg-primary hover:text-white transition-all text-xs font-bold font-inter text-text-brown rounded-full shadow-lg border border-secondary-sand/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4 text-primary-gold animate-spin-slow" /> 360° Preview
                </button>
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {MOCK_PRODUCT.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImage === idx ? 'border-primary shadow-lg scale-95' : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
 
          {/* Product Info Column */}
          <div className="w-full lg:w-1/2 flex flex-col text-left">
            {/* Urgency & ratings */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-accent-red/10 text-accent-red text-xs font-bold font-inter rounded-lg flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse" /> Trending: 42 sold today
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-accent-saffron">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'opacity-30'}`} />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold font-inter text-text-brown/70">{MOCK_PRODUCT.rating} ({MOCK_PRODUCT.reviews} reviews)</span>
              </div>
            </div>
            
            <Heading level={1} className="text-3xl md:text-5xl font-bold mb-4">{MOCK_PRODUCT.name}</Heading>
            
            <div className="flex items-end gap-3 mb-6 border-b border-secondary-sand/30 pb-6">
              <span className="font-inter font-black text-3xl text-primary">₹{MOCK_PRODUCT.price}</span>
              {MOCK_PRODUCT.originalPrice && (
                <span className="font-inter text-lg text-text-brown/40 line-through mb-0.5">₹{MOCK_PRODUCT.originalPrice}</span>
              )}
              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full mb-0.5 ml-2 font-inter">INCL. OF ALL TAXES</span>
            </div>

            <Text variant="lead" className="text-base text-text-brown/80 mb-8 leading-relaxed font-inter">
              {MOCK_PRODUCT.description}
            </Text>

            {/* Premium Badges Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-white p-3 rounded-xl border border-secondary-sand/40 flex flex-col items-center justify-center text-center">
                <Award className="w-5 h-5 text-primary-gold mb-1" />
                <span className="text-[10px] font-bold text-text-brown uppercase tracking-wider font-inter">Pure Desi Ghee</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-secondary-sand/40 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-5 h-5 text-primary-gold mb-1" />
                <span className="text-[10px] font-bold text-text-brown uppercase tracking-wider font-inter">Fresh Daily</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-secondary-sand/40 flex flex-col items-center justify-center text-center">
                <Gift className="w-5 h-5 text-primary-gold mb-1" />
                <span className="text-[10px] font-bold text-text-brown uppercase tracking-wider font-inter">Perfect Gifting</span>
              </div>
            </div>

            {/* Weight Selection */}
            <div className="mb-8">
              <h4 className="font-playfair font-bold text-lg mb-3 text-text-brown">Select Box Weight</h4>
              <div className="flex flex-wrap gap-3">
                {['250g', '500g', '1kg', '2kg'].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    className={`px-6 py-2.5 rounded-xl font-inter text-sm font-semibold transition-all border cursor-pointer ${
                      weight === w 
                        ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                        : 'border-secondary-sand bg-white text-text-brown/70 hover:border-primary/50'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-secondary-sand/30">
              {/* Quantity */}
              <div className="flex items-center bg-white border border-secondary-sand rounded-xl overflow-hidden shrink-0 h-12">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center font-bold text-text-brown hover:bg-secondary-cream transition-colors cursor-pointer"
                >-</button>
                <span className="w-12 text-center font-inter font-bold text-base">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-full flex items-center justify-center font-bold text-text-brown hover:bg-secondary-cream transition-colors cursor-pointer"
                >+</button>
              </div>
              
              {/* <Button size="lg" className="flex-1 h-12 text-base font-bold bg-primary hover:bg-primary-gold hover:text-primary text-secondary-cream border-none shadow-xl shadow-primary/25 flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Add to Royal Cart
              </Button> */}
              
              <Button 
                size="icon" 
                variant="secondary" 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`h-12 w-12 shrink-0 rounded-xl border transition-all ${
                  isWishlisted ? 'bg-primary text-secondary-cream border-primary' : 'bg-white text-text-brown hover:bg-secondary-cream border-secondary-sand'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-secondary-sand/30 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary-gold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-playfair font-bold text-sm">Hygienic Seals</span>
                  <span className="font-inter text-[11px] text-text-brown/50 leading-tight">Sanitised & Vacuum Packed</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-secondary-sand/30 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary-gold shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-playfair font-bold text-sm">Express Shipping</span>
                  <span className="font-inter text-[11px] text-text-brown/50 leading-tight">Pan-India Fresh Delivery</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER / COMBO BUILDER */}
        <section className="container mx-auto px-4 md:px-8 mt-20 text-left">
          <div className="bg-white rounded-3xl shadow-md border border-secondary-sand/40 p-6 md:p-10">
            <h3 className="font-playfair text-2xl font-bold border-b border-secondary-sand/20 pb-4 mb-6 text-primary flex items-center gap-2">
              <Gift className="w-6 h-6 text-primary-gold animate-bounce" /> Frequently Bought Together
            </h3>
            
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Product items list */}
              <div className="flex-1 flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start">
                
                {/* Product 1: Kaju Katli */}
                <div className="flex flex-col items-center w-28 text-center space-y-1">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-secondary-sand/50 shadow-sm">
                    <img src={MOCK_PRODUCT.images[0]} alt="Kaju Katli" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[11px] font-bold font-playfair truncate w-full text-text-brown">{MOCK_PRODUCT.name}</p>
                  <p className="text-xs font-bold text-primary font-inter">₹{MOCK_PRODUCT.price}</p>
                </div>

                <Plus className="w-5 h-5 text-text-brown/40 shrink-0" />

                {/* Product 2: Namkeen Mixture */}
                <div className={`flex flex-col items-center w-28 text-center space-y-1 transition-opacity ${includeNamkeen ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-secondary-sand/50 shadow-sm">
                    <img src="https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&q=80&w=150" alt="Namkeen" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[11px] font-bold font-playfair truncate w-full text-text-brown">Navratna Namkeen</p>
                  <p className="text-xs font-bold text-primary font-inter">₹250</p>
                </div>

                <Plus className="w-5 h-5 text-text-brown/40 shrink-0" />

                {/* Product 3: Ladoo Box */}
                <div className={`flex flex-col items-center w-28 text-center space-y-1 transition-opacity ${includeLadoo ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-secondary-sand/50 shadow-sm">
                    <img src="https://images.unsplash.com/photo-1605651662908-11baecb59cf8?auto=format&fit=crop&q=80&w=150" alt="Motichoor Ladoo" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[11px] font-bold font-playfair truncate w-full text-text-brown">Motichoor Ladoo</p>
                  <p className="text-xs font-bold text-primary font-inter">₹450</p>
                </div>

              </div>

              {/* Selector checkboxes and checkout card */}
              <div className="w-full lg:w-80 p-6 bg-secondary-cream/50 rounded-2xl border border-secondary-sand/30 flex flex-col justify-between shrink-0 space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-bold font-inter text-text-brown/80 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={true} 
                      disabled 
                      className="w-4 h-4 accent-primary rounded border-secondary-sand cursor-not-allowed" 
                    />
                    <span>This Item (₹{MOCK_PRODUCT.price})</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold font-inter text-text-brown/80 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={includeNamkeen} 
                      onChange={(e) => setIncludeNamkeen(e.target.checked)} 
                      className="w-4 h-4 accent-primary rounded border-secondary-sand cursor-pointer" 
                    />
                    <span>Add Navratna Namkeen (+₹250)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold font-inter text-text-brown/80 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={includeLadoo} 
                      onChange={(e) => setIncludeLadoo(e.target.checked)} 
                      className="w-4 h-4 accent-primary rounded border-secondary-sand cursor-pointer" 
                    />
                    <span>Add Motichoor Ladoo (+₹450)</span>
                  </label>
                </div>
                
                <div className="border-t border-secondary-sand/30 pt-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-inter">
                    <span>Combo Price:</span>
                    <span className="font-extrabold text-lg text-primary">₹{calculateComboTotal()}</span>
                  </div>
                  {/* <Button className="w-full bg-primary hover:bg-primary-gold hover:text-primary text-white font-bold text-xs uppercase py-2.5 rounded-xl border-none shadow-md">
                    Add Selected Combo
                  </Button> */}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Product Details Tabs (Ingredients, Gifting, Reviews) */}
        <div className="container mx-auto px-4 md:px-8 mt-12 text-left">
          <div className="bg-white rounded-3xl shadow-sm border border-secondary-sand/40 overflow-hidden">
            {/* Tabs Headers */}
            <div className="flex bg-secondary-sand/20 border-b border-secondary-sand/30 font-playfair font-bold text-sm sm:text-base">
              <button 
                onClick={() => setActiveTab('details')}
                className={`px-6 py-4 border-b-2 cursor-pointer transition-colors ${activeTab === 'details' ? 'border-primary text-primary bg-white' : 'border-transparent text-text-brown/60 hover:text-primary'}`}
              >
                Ingredients & Specs
              </button>
              <button 
                onClick={() => setActiveTab('gifting')}
                className={`px-6 py-4 border-b-2 cursor-pointer transition-colors ${activeTab === 'gifting' ? 'border-primary text-primary bg-white' : 'border-transparent text-text-brown/60 hover:text-primary'}`}
              >
                Gifting Details
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 border-b-2 cursor-pointer transition-colors ${activeTab === 'reviews' ? 'border-primary text-primary bg-white' : 'border-transparent text-text-brown/60 hover:text-primary'}`}
              >
                Reviews ({MOCK_PRODUCT.reviews})
              </button>
            </div>
            
            {/* Tabs Content */}
            <div className="p-6 md:p-10 font-inter text-sm sm:text-base text-text-brown/85">
              
              {activeTab === 'details' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-playfair font-bold text-lg mb-4 text-primary">Ingredients Breakdown</h4>
                    {/* Visual cards representing premium ingredients */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {['Handpicked Cashews', 'Pure Cow Ghee', 'Silver Vark Foil', 'Organic Sugar'].map((ing, i) => (
                        <div key={i} className="flex items-center gap-2 bg-secondary-cream/40 p-2.5 rounded-xl border border-secondary-sand/30">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-xs font-bold font-inter text-text-brown/80">{ing}</span>
                        </div>
                      ))}
                    </div>
                    
                    <h5 className="font-bold text-xs uppercase tracking-wider text-text-brown/50 mb-2">Shelf Life</h5>
                    <p className="text-text-brown/80 text-sm mb-4">{MOCK_PRODUCT.shelfLife}</p>
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-lg mb-4 text-primary">Storage Instructions</h4>
                    <p className="text-text-brown/80 text-sm leading-relaxed mb-6">
                      Keep in a dry environment shielded from hot sunrays. Once unsealed, transfer sweets into an air-tight container. Refrigeration is recommended to retain the crunch and freshness of ghee.
                    </p>
                    
                    <h5 className="font-bold text-xs uppercase tracking-wider text-text-brown/50 mb-2">Dietary Preference</h5>
                    <p className="text-text-brown/80 text-sm font-bold text-green-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-600"></span> 100% Pure Vegetarian product
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'gifting' && (
                <div className="space-y-6 max-w-3xl">
                  <h4 className="font-playfair font-bold text-xl text-primary">Royal Sweets Packaging Service</h4>
                  <p className="text-text-brown/80 text-sm leading-relaxed">
                    Every luxury collection box is wrapped in traditional textured paper boards, tied with gold ribbons, and tucked safely inside a custom velvet gift bag.
                  </p>
                  <ul className="space-y-3 text-sm text-text-brown/80">
                    <li className="flex items-center gap-2">✓ Custom handwritten message cards available at checkout</li>
                    <li className="flex items-center gap-2">✓ Double vacuum sealed to lock in flavor and avoid silver leaf damage</li>
                    <li className="flex items-center gap-2">✓ Eco-friendly premium paper bag container included</li>
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Reviews summary bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-secondary-cream/30 p-6 rounded-2xl border border-secondary-sand/30">
                    <div className="text-center shrink-0">
                      <h4 className="font-playfair font-bold text-4xl text-primary">4.8</h4>
                      <p className="text-xs text-text-brown/50 font-inter mt-1">out of 5 stars</p>
                    </div>
                    <div className="flex-grow space-y-2 w-full">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-right">{stars}</span>
                          <Star className="w-3 h-3 fill-accent-saffron text-accent-saffron" />
                          <div className="flex-grow h-2 bg-secondary-sand/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-gold" 
                              style={{ width: stars === 5 ? '80%' : stars === 4 ? '15%' : '5%' }}
                            ></div>
                          </div>
                          <span className="w-8 text-right text-text-brown/50">{stars === 5 ? '98' : stars === 4 ? '18' : '8'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual reviews */}
                  <div className="space-y-6 pt-4">
                    {[
                      { name: 'Kunal Kapoor', stars: 5, date: '2 weeks ago', text: 'Stunning packaging and the Kaju Katli was extremely soft and fresh. Pure desi ghee taste was prominent. Highly recommend!' },
                      { name: 'Shreya Mehta', stars: 4, date: '1 month ago', text: 'Delicious and clean preparation. The cashew richness is genuine. Delivery took 3 days to Mumbai, arrived completely fresh.' }
                    ].map((rev, i) => (
                      <div key={i} className="border-b border-secondary-sand/20 pb-6 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-text-brown">{rev.name}</span>
                          <span className="text-text-brown/40">{rev.date}</span>
                        </div>
                        <div className="flex text-accent-saffron">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`w-3.5 h-3.5 ${idx < rev.stars ? 'fill-current' : 'opacity-20'}`} />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-text-brown/85">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* SIMILAR DELICACIES CAROUSEL */}
        <section className="container mx-auto px-4 md:px-8 mt-20 text-left">
          <div className="mb-12">
            <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-primary-gold" /> More Delights
            </span>
            <Heading level={2} className="text-2xl sm:text-4xl font-bold text-text-brown">
              Similar Sweet Delicacies
            </Heading>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_SIMILAR_SWEETS.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

      </main>

      {/* Watch Video Modal (Placeholder) */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full relative border border-secondary-sand/30 shadow-2xl space-y-4"
            >
              <h3 className="font-playfair font-bold text-xl text-primary">Sudarshan Sweets Production Kitchen Video</h3>
              <div className="aspect-video rounded-xl bg-black flex items-center justify-center text-white font-inter text-xs relative overflow-hidden">
                {/* Embedded placeholder photo */}
                <img src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform"><Video className="w-6 h-6 text-white" /></div>
                  <span>Generational Halwais crafting Kaju Katli (Demo)</span>
                </div>
              </div>
              <p className="text-xs text-text-brown/70 font-inter">
                Watch our clean, chemical-free sweet preparation facility highlighting hand-selection of quality dry fruits.
              </p>
              <Button onClick={() => setShowVideoModal(false)} className="w-full bg-primary hover:bg-primary-gold hover:text-primary text-white border-none rounded-xl">
                Close Video Player
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 360 Preview Modal (Placeholder) */}
      <AnimatePresence>
        {show360Modal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full relative border border-secondary-sand/30 shadow-2xl space-y-4"
            >
              <h3 className="font-playfair font-bold text-xl text-primary">3D Sweet Platter Preview</h3>
              <div className="aspect-square max-w-[280px] mx-auto rounded-full bg-secondary-cream flex items-center justify-center border border-secondary-sand/60 relative overflow-hidden animate-[spin_30s_linear_infinite]">
                <img src={MOCK_PRODUCT.images[0]} className="w-48 h-48 rounded-full object-cover border border-primary-gold" />
              </div>
              <p className="text-xs text-text-brown/70 font-inter text-center">
                Drag to rotate the luxury brass plate and view the presentation (3D Demo).
              </p>
              <Button onClick={() => setShow360Modal(false)} className="w-full bg-primary hover:bg-primary-gold hover:text-primary text-white border-none rounded-xl">
                Close 360 Player
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="fixed bottom-16 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-secondary-sand/35 z-30 flex items-center justify-between px-6 lg:hidden shadow-lg">
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-text-brown truncate max-w-[160px] font-playfair">{MOCK_PRODUCT.name}</span>
          <span className="text-sm font-black text-primary font-inter">₹{MOCK_PRODUCT.price}</span>
        </div>
        {/* <button 
          onClick={() => alert(`Added ${MOCK_PRODUCT.name} to cart!`)}
          className="h-10 px-5 bg-primary hover:bg-primary-gold hover:text-primary text-secondary-cream font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all duration-300 border border-primary/20 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button> */}
      </div>

      <Footer />
    </div>
  );
};

