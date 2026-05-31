/**
 * SSN Sudarshan Sweets & Namkeen — Central Data Store
 * All mock/list data is defined here and imported by components.
 * Images are sourced from Pexels for visual consistency.
 */

import type { Product } from '../components/product/ProductCard';

// ---------------------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------------------

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Kaju Katli (Pure Ghee)',
    price: 850,
    originalPrice: 950,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg',
    secondaryImage: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg',
    badge: 'Bestseller',
    tags: ['Pure Ghee', 'Handcrafted', 'Festive Special'],
    isVegetarian: true,
  },
  {
    id: '2',
    name: 'Royal Motichoor Ladoo Box',
    price: 450,
    originalPrice: 499,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg',
    secondaryImage: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg',
    badge: 'Pure Ghee Special',
    tags: ['Traditional', 'Organic Jaggery'],
    isVegetarian: true,
  },
  {
    id: '3',
    name: 'Exotic Dry Fruit & Kesar Roll',
    price: 1200,
    originalPrice: 1400,
    rating: 5.0,
    reviews: 45,
    image: 'https://images.pexels.com/photos/2386158/pexels-photo-2386158.jpeg',
    secondaryImage: 'https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg',
    badge: 'New Arrival',
    tags: ['Sugar Free Available', 'Saffron Infused'],
    isVegetarian: true,
  },
  {
    id: '4',
    name: 'Navratna Namkeen Mixture',
    price: 250,
    originalPrice: 280,
    rating: 4.6,
    reviews: 210,
    image: 'https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg',
    secondaryImage: 'https://images.pexels.com/photos/2386158/pexels-photo-2386158.jpeg',
    badge: 'Crispy Mixture',
    tags: ['Low Oil', 'Spicy'],
    isVegetarian: true,
  },
  {
    id: '5',
    name: 'Premium Sugar Free Kaju Pista Roll',
    price: 900,
    originalPrice: 1100,
    rating: 4.7,
    reviews: 65,
    image: 'https://images.pexels.com/photos/37124553/pexels-photo-37124553.jpeg',
    secondaryImage: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg',
    badge: 'Sugar Free',
    tags: ['Diabetic Friendly', 'Pure Cashews'],
    isVegetarian: true,
  },
  {
    id: '6',
    name: 'Royal Kesaria Peda',
    price: 500,
    originalPrice: 550,
    rating: 4.8,
    reviews: 142,
    image: 'https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg',
    secondaryImage: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg',
    badge: 'Festive Classic',
    tags: ['Pure Mawa', 'Royal Saffron'],
    isVegetarian: true,
  },
];

/** Bestselling subset (first 4 products) */
export const BESTSELLER_PRODUCTS: Product[] = MOCK_PRODUCTS.slice(0, 4);

// ---------------------------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------------------------

export interface Category {
  name: string;
  img: string;
  count: string;
  path: string;
}

export const CATEGORIES: Category[] = [
  {
    name: 'Kaju Collection',
    img: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg',
    count: '12 Items',
    path: '/category/kaju-collection',
  },
  {
    name: 'Laddu Collection',
    img: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg',
    count: '18 Items',
    path: '/category/laddu-collection',
  },
  {
    name: 'Bengali Sweets',
    img: 'https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg',
    count: '10 Items',
    path: '/category/bengali-sweets',
  },
  {
    name: 'Sugar Free',
    img: 'https://images.pexels.com/photos/37124553/pexels-photo-37124553.jpeg',
    count: '8 Items',
    path: '/category/sugar-free',
  },
  {
    name: 'Namkeen',
    img: 'https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg',
    count: '24 Items',
    path: '/category/namkeen',
  },
  {
    name: 'Dry Fruits',
    img: 'https://images.pexels.com/photos/2386158/pexels-photo-2386158.jpeg',
    count: '15 Items',
    path: '/category/dry-fruits',
  },
  {
    name: 'Festival Hampers',
    img: 'https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg',
    count: '6 Hampers',
    path: '/category/festive',
  },
  {
    name: 'Corporate Gifting',
    img: 'https://images.pexels.com/photos/36235852/pexels-photo-36235852.jpeg',
    count: 'Custom B2B',
    path: '/category/festive',
  },
];

// ---------------------------------------------------------------------------
// NAVBAR MEGA MENU CATEGORIES
// ---------------------------------------------------------------------------

export interface NavCategory {
  name: string;
  path: string;
  desc: string;
  img: string;
}

export const NAV_CATEGORIES: Record<'sweets' | 'namkeen' | 'gifting', NavCategory[]> = {
  sweets: [
    { name: 'Kaju Collection', path: '/category/kaju-collection', desc: 'Creamy premium cashew delicacies', img: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg' },
    { name: 'Laddu Collection', path: '/category/laddu-collection', desc: 'Golden spheres of pure desi ghee', img: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg' },
    { name: 'Bengali Sweets', path: '/category/bengali-sweets', desc: 'Soft rasgullas and syrupy sandesh', img: 'https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg' },
    { name: 'Sugar Free', path: '/category/sugar-free', desc: 'Guilt-free traditional delights', img: 'https://images.pexels.com/photos/37124553/pexels-photo-37124553.jpeg' },
  ],
  namkeen: [
    { name: 'Premium Mixtures', path: '/category/namkeen', desc: 'Spicy and crunchy mixtures', img: 'https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg' },
    { name: 'Traditional Savories', path: '/category/namkeen', desc: 'Bhujia, sev, and classic snacks', img: 'https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg' },
  ],
  gifting: [
    { name: 'Festival Hampers', path: '/category/festive', desc: 'Curated royal gift hampers', img: 'https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg' },
    { name: 'Corporate Gifting', path: '/category/festive', desc: 'Premium customized B2B sets', img: 'https://images.pexels.com/photos/36235852/pexels-photo-36235852.jpeg' },
  ],
};

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------

export interface Testimonial {
  name: string;
  role: string;
  rating: number;
  comment: string;
  img: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Pooja Sharma',
    role: 'Family Customer',
    rating: 5,
    comment: 'SSN Kaju Katli has been a permanent guest at our family functions since 1995. The consistency in taste, richness, and purity is unparalleled. The new packaging feels incredibly royal!',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  },
  {
    name: 'Aditya Sen',
    role: 'Corporate HR',
    rating: 5,
    comment: 'We ordered over 500 dry fruit hampers for our employee Diwali gifting, and the feedback was phenomenal. Outstanding taste, reliable delivery, and premium corporate presentation.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  },
  {
    name: 'Meera Deshmukh',
    role: 'Wedding Planner',
    rating: 5,
    comment: 'The assorted laddus and decorative platters were a massive hit at our client wedding reception. SSN is my go-to luxury Indian confectionery brand without exception.',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  },
];

// ---------------------------------------------------------------------------
// ABOUT PAGE DATA
// ---------------------------------------------------------------------------

export interface Milestone {
  year: string;
  title: string;
  desc: string;
  img: string;
}

export const MILESTONES: Milestone[] = [
  {
    year: '1995',
    title: 'The First Batch',
    desc: 'Our founder opened a small artisanal shop in Connaught Place, serving hand-rolled laddoos made with pure cow ghee and family recipes.',
    img: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg',
  },
  {
    year: '2005',
    title: 'Preserving Heritage',
    desc: 'Expanding our kitchen to work with regional dairy farmers, securing single-source A2 cow milk and pure organic saffron for our collections.',
    img: 'https://images.pexels.com/photos/2386158/pexels-photo-2386158.jpeg',
  },
  {
    year: '2012',
    title: 'Flagships & Royal Hampers',
    desc: 'Opened state-of-the-art boutiques in Gurugram and Noida, introducing bespoke velvet and brass packaging for royal corporate gifting.',
    img: 'https://images.pexels.com/photos/36235852/pexels-photo-36235852.jpeg',
  },
  {
    year: '2020',
    title: 'The Digital Mithai Boutique',
    desc: 'Launched our nationwide vacuum-sealed shipping network, delivering traditional freshness straight to doorsteps across India.',
    img: 'https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg',
  },
];

export interface CraftStep {
  num: string;
  title: string;
  desc: string;
}

export const CRAFT_STEPS: CraftStep[] = [
  {
    num: '01',
    title: 'Sourcing Pure Ingredients',
    desc: 'We partner directly with farmers in Rajasthan for A2 Desi Ghee and source authentic saffron from Kashmir.',
  },
  {
    num: '02',
    title: 'Traditional Slow-Cooking',
    desc: 'Sweets are cooked slowly in traditional brass vessels (kadhai) to preserve moisture, flavor, and texture.',
  },
  {
    num: '03',
    title: 'Artisanal Hand-Shaping',
    desc: 'Master halwais handcraft, layer, and embellish each piece with hand-sorted almonds, pistachios, and pure vark.',
  },
  {
    num: '04',
    title: 'Aura Packaging & Dispatch',
    desc: 'Placed in vacuum-sealed air-tight trays inside luxury rigid boxes to preserve absolute freshness.',
  },
];

// ---------------------------------------------------------------------------
// WHY CHOOSE US (icons are rendered in the component, not stored here)
// ---------------------------------------------------------------------------

export interface WhyChooseUsItem {
  title: string;
  desc: string;
  iconKey: string; // mapped to icons in the component
}

export const WHY_CHOOSE_US_ITEMS: WhyChooseUsItem[] = [
  { title: '100% Pure Desi Ghee', desc: 'Crafted solely using single-source pure cow ghee for authentic aroma and flavor.', iconKey: 'shield' },
  { title: 'Traditional Recipes', desc: 'Sweets made using secrets and culinary methods passed down for over 30 years.', iconKey: 'award' },
  { title: 'Handmade by Experts', desc: 'Prepared in small batches by generational sweet artisans (Halwais).', iconKey: 'sparkles' },
  { title: 'Premium Royal Gifting', desc: 'Packaged in elegant brass, wood, and velvet textures perfect for gifting.', iconKey: 'gift' },
  { title: 'Hygienic Clean Kitchens', desc: 'Fully sanitised state-of-the-art preparation facility maintaining utmost hygiene.', iconKey: 'coffee' },
  { title: 'Fast Pan-India Delivery', desc: 'Vacuum-sealed shipping to guarantee absolute freshness straight to your doorstep.', iconKey: 'truck' },
];
