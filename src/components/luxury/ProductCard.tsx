import React, { useRef, useEffect, useState } from 'react';
import { Product } from '@/src/types';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { useWishlist } from '@/src/contexts/WishlistContext';
import { useCart } from '@/src/contexts/CartContext';

/**
 * PERF FIX: Replaced `motion.div whileInView` (Framer Motion JS animation) with a
 * pure CSS IntersectionObserver approach.
 *
 * Root cause: Every ProductCard rendered on screen was using Framer Motion's
 * `whileInView` which spins up a JS-driven animation for EACH card. With 8+ cards
 * visible on the home page, this creates 8+ simultaneous Framer Motion animation
 * loops running on the main thread during scroll — a direct cause of jank.
 *
 * Fix: Use IntersectionObserver (runs off-thread) to toggle a CSS class that
 * triggers a CSS keyframe animation (runs on compositor thread). Zero JS during scroll.
 */

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // once: true equivalent
        }
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col w-full bg-white product-card-enter"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
        /* PERF: Using CSS transition (compositor) instead of Framer Motion JS animation */
        willChange: 'opacity, transform',
      }}
      onTransitionEnd={(e) => {
        // Clean up willChange after animation completes to free GPU memory
        if (isVisible && e.propertyName === 'transform') {
          (e.currentTarget as HTMLDivElement).style.willChange = 'auto';
        }
      }}
    >
      {/* Hover lift — pure CSS, GPU transform only, no repaint */}
      <style>{`
        .product-card-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
      `}</style>
      <div
        className="product-card-lift relative flex flex-col w-full h-full"
        style={{ transition: 'transform 400ms ease, box-shadow 400ms ease' }}
      >
        {/* Product Image Area */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F6F2]">
          <Link to={`/product/${product.id}`} className="block h-full w-full">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-primary/10" />
              </div>
            )}
          </Link>

          {/* Wishlist Icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 rounded-full shadow-sm hover:bg-white group/heart"
            style={{ transition: 'background-color 200ms ease' }}
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? 'fill-secondary text-secondary' : 'text-primary'
              }`}
              style={{ transition: 'color 200ms ease, fill 200ms ease' }}
            />
          </button>

          {/* Quick Actions Overlay */}
          <div
            className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 bg-gradient-to-t from-black/20 to-transparent"
            style={{ transition: 'transform 400ms ease' }}
          >
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product, 1);
                }}
                className="flex-grow bg-white text-primary hover:bg-secondary hover:text-white rounded-none border-none text-[10px] uppercase tracking-widest font-bold h-10 shadow-xl"
                style={{ transition: 'background-color 200ms ease, color 200ms ease' }}
              >
                <ShoppingBag className="mr-2 h-3.5 w-3.5" /> Add to Bag
              </Button>
              <Link to={`/product/${product.id}`} className="p-2.5 bg-white/95 hover:bg-white text-primary shadow-xl" style={{ transition: 'background-color 200ms ease' }}>
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Subtle Badge */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {product.isNewArrival && (
              <span className="bg-[#B4846C] text-white text-[8px] uppercase tracking-widest px-2 py-1 font-bold">
                New Arrival
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-primary/90 text-white text-[8px] uppercase tracking-widest px-2 py-1 font-bold">
                Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase tracking-[0.2em] text-secondary font-bold">
              {product.category}
            </span>
            <Link to={`/product/${product.id}`} className="block">
              <h3 className="text-sm md:text-base font-serif text-primary group-hover:text-secondary truncate leading-snug" style={{ transition: 'color 200ms ease' }}>
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center justify-between border-t border-muted pt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through opacity-50">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5 text-secondary">
              <ShoppingBag className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
