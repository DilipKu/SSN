-- Kirdaar Celebrations: Supabase Database Schema

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Occasions
CREATE TABLE occasions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  story TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  original_price NUMERIC CHECK (original_price >= price),
  fabric TEXT,
  craftsmanship TEXT,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT TRUE,
  rating NUMERIC DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  styling_tips TEXT[], -- Array of strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Product Occasions (Many-to-Many)
CREATE TABLE product_occasions (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  occasion_id UUID REFERENCES occasions(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, occasion_id)
);

-- 7. Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'Home' CHECK (type IN ('Home', 'Work', 'Other')),
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Cart Items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  selected_size TEXT,
  selected_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, product_id, selected_size, selected_color)
);

-- 9. Wishlist
CREATE TABLE wishlist (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- 10. Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  total_amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'Unpaid' CHECK (payment_status IN ('Paid', 'Unpaid', 'Failed')),
  payment_id TEXT,
  shipping_address JSONB NOT NULL, -- Snapshot of address
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC NOT NULL, -- Snapshot of price
  selected_size TEXT,
  selected_color TEXT
);

-- 12. Wedding Roles
CREATE TABLE wedding_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Product Wedding Roles (Many-to-Many)
CREATE TABLE product_wedding_roles (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  role_id UUID REFERENCES wedding_roles(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, role_id)
);

-- RLS POLICIES

-- Profiles: Users can view and update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Categories & Occasions: Everyone can read, only Admins can mutate
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Admin Mutate Categories" ON categories FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE occasions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Occasions" ON occasions FOR SELECT USING (TRUE);
CREATE POLICY "Admin Mutate Occasions" ON occasions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Wedding Roles: Everyone can read, only Admins can mutate
ALTER TABLE wedding_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Wedding Roles" ON wedding_roles FOR SELECT USING (TRUE);
CREATE POLICY "Admin Mutate Wedding Roles" ON wedding_roles FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Products: Everyone can read, only Admins can mutate
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (TRUE);
CREATE POLICY "Admin Mutate Products" ON products FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT USING (TRUE);
CREATE POLICY "Admin Mutate Product Images" ON product_images FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE product_occasions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Product Occasions" ON product_occasions FOR SELECT USING (TRUE);
CREATE POLICY "Admin Mutate Product Occasions" ON product_occasions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE product_wedding_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Product Wedding Roles" ON product_wedding_roles FOR SELECT USING (TRUE);
CREATE POLICY "Admin Mutate Product Wedding Roles" ON product_wedding_roles FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Cart & Wishlist: Only owners can manage
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- Addresses: Only owners can manage
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

-- Orders: Users view own, Admins view all
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all orders" ON orders FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins manage all order items" ON order_items FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- TRIGGERS for Profile creation on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'display_name', 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- FUNCTIONS for Stock Management
CREATE OR REPLACE FUNCTION decrement_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_order_item_insert
  AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE PROCEDURE decrement_stock_on_order();
