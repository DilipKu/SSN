import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const SLIDES = [
  {
    image: 'https://images.pexels.com/photos/31832653/pexels-photo-31832653.jpeg',
    title: 'Crafted For\nYour Story',
    subtitle: 'Every thread carries a legacy. Experience the timeless art of hand-embroidery, meticulously crafted for the moments that define you.',
    link: '/category/lehenga'
  },
  {
    image: 'https://images.pexels.com/photos/36308152/pexels-photo-36308152.jpeg',
    title: 'The Heritage\nZardosi Edit',
    subtitle: 'A tribute to royal craftsmanship. Discover silhouettes that whisper secrets of ancient courts and artisanal mastery.',
    link: '/category/saree'
  },
  {
    image: 'https://images.pexels.com/photos/36102587/pexels-photo-36102587.jpeg',
    title: 'Your Legacy\nIn Silk',
    subtitle: 'Step into a world where heritage meets modern luxury. Authentic couture designed for your most cherished celebrations.',
    link: '/category/gown'
  },
];

interface HeroProps {
  slides?: any[];
}

export default function Hero({ slides }: HeroProps) {
  const displaySlides = (slides && slides.length > 0) ? slides : SLIDES;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-charcoal silk-texture">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={2500}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} !bg-white !opacity-20 hover:!opacity-100 transition-all duration-500 !w-12 !h-[1px] !rounded-none"></span>`;
          },
        }}
        className="h-full w-full"
      >
        {displaySlides.map((slide, index) => (
          <SwiperSlide key={slide.id || index} className="relative h-full w-full">
            {({ isActive }) => (
              <div className="relative h-full w-full flex items-center">
                {/* Cinematic Background
                    PERF FIX: willChange only on the ACTIVE slide.
                    Previously all slides had willChange simultaneously,
                    uploading 3 full-screen textures to GPU. Now only 1. */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className={cn(
                      "h-full w-full",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                      transform: isActive ? 'scale(1.05)' : 'scale(1.2)',
                      transition: isActive
                        ? 'transform 10s linear, opacity 2s ease-out'
                        : 'none',
                      willChange: isActive ? 'transform' : 'auto',
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      fetchpriority={index === 0 ? "high" : "auto"}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-transparent to-transparent md:block hidden" />
                </div>

                {/* Content */}
                <div className="global-container relative z-10 w-full pt-[220px] md:pt-[280px] pb-20 md:pb-32">
                  <div className="max-w-[700px] text-center md:text-left space-y-10">
                    <div className="space-y-6">
                      <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
                        transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl lg:text-8xl text-white font-serif leading-[1.1] tracking-tight whitespace-pre-line"
                      >
                        {slide.title}
                      </motion.h1>
                    </div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                      transition={{ duration: 1, delay: 1 }}
                      className="text-white/70 text-base md:text-xl font-light leading-relaxed tracking-wide max-w-lg mx-auto md:mx-0 italic font-serif"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
                      transition={{ duration: 1, delay: 1.3 }}
                      className="flex flex-col md:flex-row gap-6 pt-6 items-center md:items-start"
                    >
                      <Link to={slide.link || '/category/all'} className="w-full md:w-auto">
                        <Button
                          className="bg-white hover:bg-white/90 text-charcoal w-full md:w-auto px-12 h-16 text-[10px] uppercase tracking-[0.3em] font-bold rounded-none luxury-button"
                        >
                          Explore Collection
                        </Button>
                      </Link>

                      <Link to="/occasions" className="w-full md:w-auto">
                        {/* PERF FIX: Removed backdrop-blur-sm — was creating a compositing
                            sub-layer inside the hero, forcing extra GPU compositing work.
                            Replaced with a solid semi-transparent border button. */}
                        <Button
                          className="bg-transparent border border-white/40 text-white hover:bg-white hover:text-charcoal w-full md:w-auto px-12 h-16 text-[10px] uppercase tracking-[0.3em] font-bold rounded-none"
                          style={{ transition: 'background-color 300ms ease, color 300ms ease' }}
                        >
                          View Occasion
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .swiper-pagination {
          bottom: 60px !important;
          left: 40px !important;
          width: auto !important;
          display: flex;
          gap: 12px;
        }
        @media (max-width: 768px) {
          .swiper-pagination {
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
        }
        .swiper-pagination-bullet {
          margin: 0 !important;
        }
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          background: #FFFFFF !important;
          width: 60px !important;
        }
      `}</style>
    </section>
  );
}
