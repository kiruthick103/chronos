-- =============================================
-- CHRONOLUX WATCHES - FULL SUPABASE SETUP
-- =============================================

-- =============================================
-- 1. CREATE TABLES (if they don't exist)
-- =============================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  rating NUMERIC DEFAULT 5,
  reviews INTEGER DEFAULT 0,
  category TEXT,
  style TEXT,
  image TEXT,
  water INTEGER,
  movement TEXT,
  gender TEXT,
  feature TEXT,
  description TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  address_line1 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  subtotal NUMERIC,
  shipping NUMERIC,
  total NUMERIC,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers table
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  discount NUMERIC DEFAULT 0,
  end_time BIGINT,
  description TEXT,
  watch_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL, -- Keep as TEXT for backward compatibility
  reviewer_name TEXT,
  rating NUMERIC,
  title TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- Keep as TEXT for backward compatibility
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- Keep as TEXT for backward compatibility
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. DROP EXISTING POLICIES
-- =============================================
DROP POLICY IF EXISTS "Everyone can read products" ON products;
DROP POLICY IF EXISTS "Only admins can manage products" ON products;
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can read their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Only admins can manage orders" ON orders;
DROP POLICY IF EXISTS "Users can read their order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert their order items" ON order_items;
DROP POLICY IF EXISTS "Everyone can read offers" ON offers;
DROP POLICY IF EXISTS "Only admins can manage offers" ON offers;
DROP POLICY IF EXISTS "Everyone can read reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Users can read their cart" ON carts;
DROP POLICY IF EXISTS "Users can manage their cart" ON carts;
DROP POLICY IF EXISTS "Users can read their wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can manage their wishlist" ON wishlists;

-- =============================================
-- 4. CREATE RLS POLICIES
-- =============================================

-- =============================================
-- PRODUCTS POLICIES
-- =============================================
CREATE POLICY "Public read access to products"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- =============================================
-- PROFILES POLICIES
-- =============================================
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- =============================================
-- ADDRESSES POLICIES
-- =============================================
CREATE POLICY "Users can view their own addresses"
  ON addresses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON addresses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- ORDERS POLICIES
-- =============================================
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders"
  ON orders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- =============================================
-- ORDER ITEMS POLICIES
-- =============================================
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order items"
  ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM orders
      WHERE orders.id = order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- =============================================
-- OFFERS POLICIES
-- =============================================
CREATE POLICY "Public read access to offers"
  ON offers
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage offers"
  ON offers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- =============================================
-- REVIEWS POLICIES
-- =============================================
CREATE POLICY "Public read access to reviews"
  ON reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- CARTS POLICIES
-- =============================================
CREATE POLICY "Public access to cart by session_id"
  ON carts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- WISHLISTS POLICIES
-- =============================================
CREATE POLICY "Public access to wishlist by session_id"
  ON wishlists
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- 5. CREATE TRIGGERS AND FUNCTIONS
-- =============================================

-- Function to handle new user sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 6. ENABLE REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS products;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS orders;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS offers;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS carts;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS wishlists;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS reviews;

-- =============================================
-- 7. SET DEMO ADMIN USER (if exists)
-- =============================================
DO $$
DECLARE
  v_uid UUID;
BEGIN
  SELECT id INTO v_uid
  FROM auth.users
  WHERE email = 'kiruthick3238q@gmail.com'
  LIMIT 1;

  IF v_uid IS NOT NULL THEN
    INSERT INTO profiles (id, is_admin, full_name)
    VALUES (v_uid, true, 'Admin User')
    ON CONFLICT (id) DO UPDATE SET is_admin = true;
  END IF;
END $$;

-- =============================================
-- COMPLETE!
-- =============================================
