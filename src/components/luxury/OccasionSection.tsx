import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { ProductService } from '@/src/services/ProductService';

interface OccasionCardProps {
  occasion: {
    id?: string;
    name: string;
    image: string;
  };
  index: number;
}

/**
 * PERF FIX: Replaced motion.div whileInView with CSS IntersectionObserver
 * Same as ProductCard fix — eliminates JS animation loop per card during scroll.
 */
const OccasionCard = ({ occasion, index }: OccasionCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.96)',
        transition: `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`,
      }}
    >
      <Link
        to={`/category/${occasion.name.toLowerCase()}`}
        className="relative block w-full aspect-[4/5] overflow-hidden rounded-[40px] border-2 border-transparent"
        style={{ transition: 'border-color 300ms ease' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-secondary, #D4AF37)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
      >
        <img
          src={occasion.image}
          alt={occasion.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110"
          style={{ transition: 'transform 700ms ease' }}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90" style={{ transition: 'opacity 400ms ease' }} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-4 pb-6">
          <span className="text-sm md:text-base font-serif tracking-wide text-center">
            {occasion.name}
          </span>
        </div>
      </Link>
    </div>
  );
};

interface OccasionSectionProps {
  title?: string;
  subtitle?: string;
}

export default function OccasionSection({
  title = 'Celebration by Event',
  subtitle = 'Curated Occasions'
}: OccasionSectionProps) {
  const [occasions, setOccasions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOccasions() {
      try {
        const data = await ProductService.getOccasions();
        const transformedData = data.map((occ) => ({
          id: occ.id,
          name: occ.name,
          image: occ.image_url,
        }));
        setOccasions(transformedData);
      } catch (error) {
        console.error('Error loading occasions:', error);
        setOccasions([]);
      } finally {
        setLoading(false);
      }
    }
    loadOccasions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (occasions.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-6">
      <div className="global-container px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col space-y-1">
            {/* PERF FIX: Removed letterSpacing animation — letter-spacing forces
                layout recalculation on every frame (not GPU-acceleratable).
                Now it's just a plain styled span. */}
            <span className="text-secondary font-semibold uppercase text-[9px] tracking-[0.4em] block">
              {subtitle}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-primary">{title}</h2>
          </div>

          <Link to="/category/all">
            <Button variant="link" className="text-primary hover:text-secondary group text-xs uppercase tracking-widest font-bold p-0">
              View All <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1" style={{ transition: 'transform 200ms ease' }} />
            </Button>
          </Link>
        </div>

        {/* Grid Container - Centered Flex approach */}
        <div className="flex flex-wrap justify-center -mx-2 md:-mx-3 py-2">
          {occasions.map((occasion, idx) => (
            <div key={occasion.id || idx} className="px-2 md:px-3 mb-4 md:mb-6 w-1/2 sm:w-1/3 lg:w-1/5">
              <OccasionCard
                occasion={occasion}
                index={idx}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}