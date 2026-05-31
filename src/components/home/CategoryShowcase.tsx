import { ChevronRight, Sparkles } from "lucide-react";
import { Heading, Text } from "../ui/Typography";

export const CategoryShowcase = () => {
  const categories = [
    {
      name: "Kaju Collection",
      img: "https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg",
      count: "12 Items",
      path: "/category/kaju-collection",
    },
    {
      name: "Laddu Collection",
      img: "https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg",
      count: "18 Items",
      path: "/category/laddu-collection",
    },
    {
      name: "Bengali Sweets",
      img: "https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg",
      count: "10 Items",
      path: "/category/bengali-sweets",
    },
    {
      name: "Sugar Free",
      img: "https://images.pexels.com/photos/37124553/pexels-photo-37124553.jpeg",
      count: "8 Items",
      path: "/category/sugar-free",
    },
    {
      name: "Namkeen",
      img: "https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg",
      count: "24 Items",
      path: "/category/namkeen",
    },
    {
      name: "Dry Fruits",
      img: "https://images.pexels.com/photos/2386158/pexels-photo-2386158.jpeg",
      count: "15 Items",
      path: "/category/dry-fruits",
    },
    {
      name: "Festival Hampers",
      img: "https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg",
      count: "6 Hampers",
      path: "/category/festive",
    },
    {
      name: "Corporate Gifting",
      img: "https://images.pexels.com/photos/36235852/pexels-photo-36235852.jpeg",
      count: "Custom B2B",
      path: "/category/festive",
    },
  ];

  return (
    <section className="py-24 container mx-auto px-4 md:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-primary-gold" /> Explore Collections
        </span>
        <Heading
          level={2}
          className="text-3xl md:text-5xl font-bold text-text-brown mb-4 luxury-border-gold pb-4"
        >
          Shop by Royal Categories
        </Heading>
        <Text className="text-text-brown/70 font-inter mt-3">
          Browse our diverse premium lines of handcrafted sweets, crispy namkeen
          mixtures, and stunning royal gifting hampers.
        </Text>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <a
            key={i}
            href={cat.path}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md border border-secondary-sand/50 block"
          >
            {/* Image background with hover zoom */}
            <div className="absolute inset-0 bg-gradient-to-t from-text-brown/90 via-text-brown/40 to-transparent z-10"></div>
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Text overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
              <div className="text-left">
                <p className="font-playfair text-lg font-bold text-white leading-tight">
                  {cat.name}
                </p>
                <p className="text-[10px] text-primary-gold uppercase font-semibold font-inter mt-1 tracking-wider">
                  {cat.count}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:bg-primary-gold group-hover:text-primary transition-all duration-300">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
