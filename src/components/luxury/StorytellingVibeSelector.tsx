import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { cn } from '@/src/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const VIBES = [
  {
    title: 'Sherwani',
    image: 'https://images.pexels.com/photos/12713393/pexels-photo-12713393.jpeg',
    link: '/category/sherwani'
  },
  {
    title: 'Indo Western',
    image: 'https://images.pexels.com/photos/32293226/pexels-photo-32293226.jpeg',
    link: '/category/indo-western'
  },
  {
    title: 'Lehenga',
    image: 'https://images.pexels.com/photos/11729317/pexels-photo-11729317.jpeg',
    link: '/category/lehenga'
  },
  {
    title: 'Jodhpuri',
    image: 'https://images.pexels.com/photos/19880112/pexels-photo-19880112.jpeg',
    link: '/category/jodhpuri'
  },
  {
    title: 'Kurta Jacket Set',
    image: 'https://images.pexels.com/photos/12769890/pexels-photo-12769890.jpeg',
    link: '/category/kurta-jacket'
  },
  {
    title: 'Kurta Set',
    image: 'https://images.pexels.com/photos/36308152/pexels-photo-36308152.jpeg',
    link: '/category/kurta-set'
  },
  {
    title: 'Short Kurta',
    image: 'https://images.pexels.com/photos/36102587/pexels-photo-36102587.jpeg',
    link: '/category/short-kurta'
  },
  {
    title: 'Saree',
    image: 'https://images.pexels.com/photos/11269931/pexels-photo-11269931.jpeg',
    link: '/category/saree'
  }
];

export default function StorytellingVibeSelector() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="pt-2 pb-0 bg-[#FDFBF7] silk-texture overflow-hidden relative">
      <div className="global-container px-8 md:px-24">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-serif text-[#1A1A1A] uppercase tracking-[0.3em]"
          >
            What's Your Vibe?
          </motion.h2>
        </div>

        {/* Swiper Container */}
        <div className="relative px-4 md:px-0">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1.2}
            loop={true}
            centeredSlides={false}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 4 },
            }}
            className="vibe-swiper !overflow-visible"
          >
            {VIBES.map((vibe, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link to={vibe.link} className="block group">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[10rem] border-[3px] border-[#D4AF37]/30 shadow-xl transition-all duration-700 group-hover:shadow-2xl group-hover:border-[#D4AF37]/60">
                      {/* Image Layer */}
                      <img
                        src={vibe.image}
                        alt={vibe.title}
                        className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Deep Bottom Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-90 transition-opacity duration-700" />
                      
                      {/* Arched Inner Border Overlay (Enhanced) */}
                      <div className="absolute inset-2 border-[1.5px] border-white/20 rounded-t-[10rem] pointer-events-none" />

                      {/* Content Overlay */}
                      <div className="absolute bottom-10 left-0 right-0 text-center px-6">
                        <h3 className="text-xl md:text-2xl font-serif text-white uppercase tracking-widest leading-tight transition-transform duration-500 group-hover:-translate-y-2">
                          {vibe.title}
                        </h3>
                        <div className="w-8 h-[1px] bg-white/40 mx-auto mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button 
            ref={prevRef}
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-500 disabled:opacity-30 group"
          >
            <ChevronLeft className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <button 
            ref={nextRef}
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-500 disabled:opacity-30 group"
          >
            <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        .vibe-swiper .swiper-slide {
          transition: all 0.5s ease;
        }
        .vibe-swiper .swiper-slide-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
