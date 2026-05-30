import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductService } from '@/src/services/ProductService';
import { Product, Category } from '@/src/types';
import ProductCard from '@/src/components/luxury/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { Filter, X, LayoutGrid, StretchHorizontal, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';
import { cn } from '@/src/lib/utils';

const CATEGORIES: Category[] = ['Saree', 'Lehenga', 'Gown', 'Kurti Set', 'Dupatta', 'Accessories'];

export default function StylingResultPage() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const occasion = searchParams.get('occasion');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchCuratedProducts = async () => {
      setLoading(true);
      try {
        // Fetch products matching BOTH role and occasion (Intersection)
        const data = await ProductService.getProducts({
          role: role || undefined,
          occasion: occasion || undefined
        });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching curated products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCuratedProducts();
  }, [role, occasion]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category as Category);
      return matchesCategory;
    });
  }, [products, selectedCategories]);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(item => item !== cat) : [...prev, cat]
    );
  };

  const clearCategories = () => setSelectedCategories([]);

  const resultTitle = `${role}'s ${occasion} Ensembles`;
  const resultDescription = role === 'Bride' 
    ? `Exquisite masterpieces curated for your once-in-a-lifetime ${occasion} moment.`
    : `Sophisticated styling options for the ${role} attending the ${occasion}.`;

  return (
    <div className="min-h-screen bg-[#FDF8F1] pt-24 md:pt-32 pb-24">
      <div className="global-container space-y-12">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-secondary text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            <Sparkles className="h-3 w-3" /> Curated Experience
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif text-primary leading-tight"
            >
              {resultTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-sm md:text-lg font-light max-w-2xl mx-auto italic"
            >
              "{resultDescription}"
            </motion.p>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground pt-4">
            <span>Step 1: {role}</span>
            <ChevronRight className="h-3 w-3" />
            <span>Step 2: {occasion}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-secondary">Step 3: Discover</span>
          </div>
        </div>

        {/* Refinement Bar */}
        <div className="bg-white border border-[#E5D5D5] shadow-sm rounded-2xl p-6 md:p-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
              <Filter className="h-4 w-4" /> Refine by Category
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-2 transition-all rounded-lg", viewMode === 'grid' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-beige/20")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-2 transition-all rounded-lg", viewMode === 'list' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-beige/20")}
              >
                <StretchHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-full transition-all duration-300 border shadow-sm",
                  selectedCategories.includes(cat)
                    ? "bg-primary border-primary text-white shadow-lg -translate-y-0.5"
                    : "bg-white border-[#E5D3B3]/40 text-primary hover:border-primary/40 hover:bg-beige/5"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedCategories.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-muted/30"
              >
                {selectedCategories.map(cat => (
                  <Badge key={cat} variant="secondary" className="bg-secondary/5 text-secondary border-secondary/10 rounded-full px-4 py-1.5 flex items-center gap-2">
                    {cat} <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
                  </Badge>
                ))}
                <Button variant="link" onClick={clearCategories} className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-secondary h-auto p-0 ml-4">Clear Filters</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-secondary" />
            <p className="text-sm font-serif italic text-muted-foreground uppercase tracking-widest">Unveiling your curated looks...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={cn(
            "grid gap-8",
            viewMode === 'grid' ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
          )}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-[#E5D5D5] bg-white rounded-3xl space-y-6">
            <div className="w-20 h-20 bg-[#FDF8F1] rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-10 w-10 text-secondary/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-primary">No Matching Masterpieces</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">We couldn't find exact matches for this specific combination. Try adjusting your category filters or explore our complete collection.</p>
            </div>
            <Link to="/category/all">
              <Button className="bg-primary hover:bg-secondary text-white px-10 h-14 rounded-none uppercase tracking-widest font-bold shadow-lg mt-4">
                Explore All Ensembles
              </Button>
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pt-20 text-center border-t border-[#E5D5D5]">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-8">Not what you were looking for?</p>
          <Link to="/">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-10 h-14 rounded-none uppercase tracking-widest font-bold transition-all duration-500">
              Restart Styling Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
