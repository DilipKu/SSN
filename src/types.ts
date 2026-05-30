export type Category = 'Saree' | 'Lehenga' | 'Gown' | 'Kurti Set' | 'Dupatta' | 'Accessories';

export type Occasion = 'Wedding' | 'Reception' | 'Engagement' | 'Haldi' | 'Mehendi' | 'Sangeet' | 'Party' | 'Festive' | 'Gala';

export type WeddingRole = 'Bride' | 'Bridesmaid' | 'Family' | 'Guest';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  occasion: Occasion[];
  weddingRoles?: WeddingRole[];
  images: string[];
  sizes: string[];
  colors: string[];
  fabric: string;
  craftsmanship?: string;
  stock: number;
  isBestSeller: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewsCount: number;
  story: string; // "Every Outfit Has a Kirdaar" storytelling
  stylingTips?: string[];
  relatedProducts?: string[];
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  addresses: Address[];
  role: 'user' | 'admin';
  preferences?: {
    occasions: Occasion[];
    weddingRole?: WeddingRole;
  };
}

export interface Address {
  id: string;
  user_id?: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  type: 'Home' | 'Work' | 'Other';
  is_default: boolean;
  created_at?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid' | 'Failed';
  paymentId?: string;
  address: Address;
  createdAt: string;
}
