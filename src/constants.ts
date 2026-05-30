import { Product, Category, Occasion, WeddingRole } from './types';

export const CATEGORIES: Category[] = [
  'Saree',
  'Lehenga',
  'Gown',
  'Kurti Set',
  'Dupatta',
  'Accessories',
];

export const OCCASIONS: Occasion[] = [
  'Wedding',
  'Reception',
  'Engagement',
  'Haldi',
  'Mehendi',
  'Sangeet',
  'Party',
  'Festive',
  'Gala',
];

export interface OccasionCard {
  name: string;
  image: string;
}

export const OCCASION_CARDS: OccasionCard[] = [
  { 
    name: 'Wedding', 
    image: 'https://images.pexels.com/photos/30215055/pexels-photo-30215055.jpeg' 
  },
  { 
    name: 'Reception', 
    image: 'https://images.pexels.com/photos/32293226/pexels-photo-32293226.jpeg' 
  },
  { 
    name: 'Engagement', 
    image: 'https://images.pexels.com/photos/14072957/pexels-photo-14072957.jpeg' 
  },
  { 
    name: 'Haldi', 
    image: 'https://images.pexels.com/photos/30672290/pexels-photo-30672290.jpeg' 
  },
  { 
    name: 'Mehendi', 
    image: 'https://images.pexels.com/photos/28120522/pexels-photo-28120522.jpeg' 
  },
  { 
    name: 'Sangeet', 
    image: 'https://images.pexels.com/photos/18180650/pexels-photo-18180650.jpeg' 
  },
];

export const WEDDING_ROLES: WeddingRole[] = [
  'Bride',
  'Bridesmaid',
  'Family',
  'Guest',
];

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/kirdaarcelebrations?igsh=MTBkMHd3YTVvYjkz",
  facebook: "https://www.facebook.com/share/1AVMEnEacw/",
  youtube: "https://youtube.com/@kirdaarcelebrations?si=X8_1ZPxGW5e5QJxM",
  whatsapp: "https://wa.me/919871434777"
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Royal Crimson Bridal Lehenga',
    description: 'A masterpiece of craftsmanship, this crimson red lehenga features intricate zardosi work and hand-embroidered motifs inspired by Mughal architecture. Perfect for the modern bride who cherishes tradition.',
    price: 185000,
    originalPrice: 225000,
    category: 'Lehenga',
    occasion: ['Wedding', 'Reception'],
    images: [
      'https://images.pexels.com/photos/11729317/pexels-photo-11729317.jpeg',
      'https://images.pexels.com/photos/11729317/pexels-photo-11729317.jpeg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Crimson Red', 'Maroon'],
    fabric: 'Raw Silk',
    stock: 5,
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 124,
    story: "Woven with over 200 hours of manual labor, this piece is a legacy in the making.",
  },
  {
    id: '2',
    name: 'Midnight Banarasi Silk Saree',
    description: 'Exquisite hand-woven Banarasi silk saree in midnight blue with real gold zari borders. A timeless piece that exudes royal elegance.',
    price: 45000,
    originalPrice: 55000,
    category: 'Saree',
    occasion: ['Wedding', 'Gala'],
    images: [
      'https://images.pexels.com/photos/7829303/pexels-photo-7829303.png',
      'https://images.pexels.com/photos/7829303/pexels-photo-7829303.png',
    ],
    sizes: ['Free Size'],
    colors: ['Midnight Blue', 'Emerald Green'],
    fabric: 'Pure Banarasi Silk',
    stock: 12,
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 86,
    story: "Inspired by the ghats of Varanasi, this saree carries the soul of Indian heritage.",
  },
  {
    id: '3',
    name: 'The Emperor Sherwani Set',
    description: 'A regal ivory sherwani with delicate tonal embroidery and velvet accents. Designed for the groom who wants to make a statement.',
    price: 75000,
    originalPrice: 85000,
    category: 'Accessories',
    occasion: ['Wedding', 'Engagement'],
    images: [
      'https://images.pexels.com/photos/12713393/pexels-photo-12713393.jpeg',
      'https://images.pexels.com/photos/12713393/pexels-photo-12713393.jpeg',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Ivory', 'Beige'],
    fabric: 'Silk Jamawar',
    stock: 8,
    isBestSeller: true,
    isNewArrival: true,
    rating: 4.7,
    reviewsCount: 42,
    story: "Fit for royalty, this sherwani blends structure with intricate artistry.",
  },
  {
    id: '4',
    name: 'Golden Glow Sherwani Style Kurta',
    description: 'A premium beige and gold kurta set with a structured fit and royal finish.',
    price: 6500,
    category: 'Kurti Set',
    occasion: ['Engagement', 'Haldi'],
    images: [
      'https://images.pexels.com/photos/19880112/pexels-photo-19880112.jpeg',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Beige', 'Gold'],
    fabric: 'Cotton Silk',
    stock: 10,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.6,
    reviewsCount: 8,
    story: 'A silhouette that commands respect and celebrates heritage.',
  },
  {
    id: '5',
    name: 'Pastel Pink Floral Lehenga',
    description: 'A romantic pastel pink lehenga with delicate floral embroidery and a lightweight dupatta.',
    price: 45000,
    originalPrice: 55000,
    category: 'Lehenga',
    occasion: ['Engagement', 'Mehendi'],
    images: [
      'https://images.pexels.com/photos/5721527/pexels-photo-5721527.jpeg',
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Pastel Pink'],
    fabric: 'Organza',
    stock: 8,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 15,
    story: 'Soft hues for the modern bride who loves a touch of nature.',
  },
  {
    id: '6',
    name: 'Ruby Red Kanjeevaram Saree',
    description: 'Traditional Kanjeevaram silk saree with rich gold borders and temple motifs.',
    price: 25000,
    category: 'Saree',
    occasion: ['Wedding', 'Festive'],
    images: [
      'https://images.pexels.com/photos/32878173/pexels-photo-32878173.jpeg',
    ],
    sizes: ['Free Size'],
    colors: ['Ruby Red'],
    fabric: 'Pure Silk',
    stock: 12,
    isBestSeller: true,
    isNewArrival: false,
    rating: 5.0,
    reviewsCount: 32,
    story: 'A timeless classic that passes down through generations.',
  },
  {
    id: '7',
    name: 'Beige Royal Embroidered Kurti Set',
    description: 'A sophisticated beige kurti set featuring intricate floral embroidery and a refined silhouette. Perfect for engagement ceremonies and festive gatherings.',
    price: 12500,
    originalPrice: 15000,
    category: 'Kurti Set',
    occasion: ['Engagement', 'Festive', 'Sangeet'],
    images: [
      'https://images.pexels.com/photos/22064200/pexels-photo-22064200.jpeg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Gold'],
    fabric: 'Chanderi Silk',
    stock: 15,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 12,
    story: 'Elegant craftsmanship meets modern grace in this royal ensemble.',
  }
];
