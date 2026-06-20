import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Text } from '../ui/Typography';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  secondaryImage?: string;
  badge?: string;
  tags?: string[];
  isVegetarian?: boolean;
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onQuickView, onAddToCart }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      alert(`Added ${product.name} to cart!`);
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      alert(`Quick View for ${product.name}`);
    }
  };

  // Default secondary image fallback to make sure image swap works even if not provided
  const secondaryImg = product.secondaryImage || product.image;

  return (
    <Link to={`/product/${product.id}`} className="block h-full group">
      <Card 
        className="flex flex-col h-full bg-white border border-secondary-sand/40 overflow-hidden rounded-2xl luxury-card-glow transition-all duration-300 relative"
        hoverEffect={true}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Hover zoom and Image swap */}
        <div className="relative aspect-square overflow-hidden bg-secondary-sand/10 flex-shrink-0">
          
          {/* Main Product Image */}
          <img 
            src={product.image} 
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              product.secondaryImage && isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />

          {/* Secondary Hover Image (Fade In) */}
          {product.secondaryImage && (
            <img 
              src={secondaryImg} 
              alt={`${product.name} Alternate`}
              className={`w-full h-full object-cover absolute inset-0 transition-all duration-700 ease-out ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}
          
          {/* Top-Left Stickers / Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {product.badge && (
              <span className="px-3 py-1 bg-primary text-secondary-cream text-[10px] font-bold uppercase tracking-widest rounded-md shadow-md border border-primary-gold/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary-gold" />
                {product.badge}
              </span>
            )}
            {product.tags && product.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-secondary-cream/90 backdrop-blur-sm text-text-brown text-[9px] font-medium tracking-wide rounded border border-secondary-sand/50">
                {tag}
              </span>
            ))}
          </div>

          {/* Veg indicator dot */}
          {product.isVegetarian && (
            <div className="absolute bottom-3 left-3 w-5 h-5 bg-white/90 backdrop-blur-sm rounded-md flex items-center justify-center border border-green-600 shadow-md z-20">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
            </div>
          )}

          {/* Luxury Hover Quick Actions Overlay */}
          <div className="absolute inset-0 bg-primary-gold/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
            <button 
              onClick={handleWishlist}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-all duration-300 ${
                isWishlisted 
                  ? 'bg-primary text-secondary-cream border-primary' 
                  : 'bg-white text-text-brown hover:text-primary hover:bg-secondary-cream border-secondary-sand/30'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            <button 
              onClick={handleQuickViewClick}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-secondary-sand/30 text-text-brown hover:text-primary hover:bg-secondary-cream transition-all duration-300"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5 flex flex-col flex-grow bg-white">
          <div className="flex items-center justify-between mb-2">
            {/* Stars rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center text-accent-saffron">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <Text variant="small" className="text-text-brown/70 text-xs font-semibold">{product.rating}</Text>
              <span className="text-[11px] text-text-brown/40 font-inter">({product.reviews})</span>
            </div>

            {/* Pure Ghee tag */}
            <span className="text-[9px] font-bold text-primary-gold bg-primary/5 px-2 py-0.5 rounded border border-primary-gold/10 font-inter tracking-wider uppercase">
              Pure Ghee
            </span>
          </div>
          
          <h3 className="font-playfair text-lg font-bold text-text-brown mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Price & Quick Add Column */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-secondary-sand/20">
            <div className="flex flex-col">
              <span className="font-inter font-extrabold text-xl text-primary">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-text-brown/40 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-[10px] text-green-700 bg-green-50 px-1 py-0.2 rounded font-bold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                  </span>
                </div>
              )}
            </div>

            {/* <button 
              onClick={handleQuickAdd}
              className="h-10 px-4 bg-primary text-secondary-cream hover:bg-primary-gold hover:text-primary transition-all duration-300 rounded-xl shadow-md flex items-center gap-2 text-xs font-bold font-inter tracking-wider uppercase border border-primary/20 hover:border-primary-gold/20"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button> */}
          </div>
        </div>
      </Card>
    </Link>
  );
};

