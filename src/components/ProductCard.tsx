import React, { memo } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '@/src/types';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/src/components/ui/card';
import { cn } from '@/src/lib/utils';

import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/src/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success("Added to your royal collection");
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group relative block bg-white border border-gold/5 transition-[box-shadow,border-color,transform] duration-700 hover:shadow-2xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image - Large & Immersive */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "h-full w-full object-cover transition-all duration-[800ms] ease-out will-change-transform",
            isHovered ? "scale-[1.08]" : "scale-100"
          )}
          style={{ opacity: isHovered && product.images && product.images[1] ? 0 : 1 }}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        
        {/* Hover Image Swap (if available) */}
        {product.images && product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} detail`}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-all duration-[800ms] ease-out will-change-transform",
              isHovered ? "opacity-100 scale-[1.08]" : "opacity-0 scale-[1.1]"
            )}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Quick Action Overlays */}
        <div className="absolute top-4 right-4 space-y-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
          <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full bg-white/95 border-none shadow-lg hover:bg-primary hover:text-white transition-colors duration-300">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Cinematic Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Quick View Button */}
        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <Button 
            className="w-full bg-white/95 text-primary hover:bg-primary hover:text-white rounded-none h-12 text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl border-none"
            onClick={handleAddToCart}
          >
            Add to Registry
          </Button>
        </div>
      </div>

      {/* Product Details - Minimal & Elegant */}
      <div className="p-6 text-center space-y-2">
        <span className="text-[9px] uppercase tracking-[0.3em] text-secondary font-bold">
          {product.category}
        </span>
        <h3 className="text-lg md:text-xl font-serif text-primary truncate px-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm font-bold text-charcoal tracking-wider">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] text-muted-foreground line-through opacity-50 tracking-wider">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Luxury Border Accent on Hover */}
      <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-all duration-700 pointer-events-none" />
    </Link>
  );
});

export default ProductCard;
