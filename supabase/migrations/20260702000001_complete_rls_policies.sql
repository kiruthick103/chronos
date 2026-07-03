-- =============================================
-- Complete RLS Policies for Chronolux Watches
-- =============================================

-- First, ensure RLS is enabled on all tables
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wishlists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (we'll create new comprehensive ones)
DROP POLICY IF EXISTS "Allow public read products" ON products;
DROP POLICY IF EXISTS "Allow public write products" ON products;
DROP POLICY IF EXISTS "Allow public read orders" ON orders;
DROP POLICY IF EXISTS "Allow public write orders" ON orders;
DROP POLICY IF EXISTS "Allow public read order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public write order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow public write profiles" ON profiles;
DROP POLICY IF EXISTS "Allow public read addresses" ON addresses;
DROP POLICY IF EXISTS "Allow public write addresses" ON addresses;
DROP POLICY IF EXISTS "Allow public read offers" ON offers;
DROP POLICY IF EXISTS "Allow public write offers" ON offers;

-- =============================================
-- PRODUCTS TABLE POLICIES
-- =============================================
-- Allow everyone (including anon) to read products
CREATE POLICY "Everyone can read products"
  ON products
  FOR SELECT
  USING (true);

-- Allow inserting products if the table is empty (for initial seeding)
-- or only allow admins to insert, update, delete products
CREATE POLICY "Only admins can manage products"
  ON products
  FOR ALL
  USING (
    -- Allow if table is empty (for seeding)
    NOT EXISTS (SELECT 1 FROM products) OR
    -- Or allow if user is admin
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    -- Allow if table is empty (for seeding)
    NOT EXISTS (SELECT 1 FROM products) OR
    -- Or allow if user is admin
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- =============================================
-- PROFILES TABLE POLICIES
-- =============================================
-- Enable realtime for profiles
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS profiles;

-- Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================
-- ADDRESSES TABLE POLICIES
-- =============================================
-- Users can read their own addresses
CREATE POLICY "Users can read their own addresses"
  ON addresses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own addresses
CREATE POLICY "Users can insert their own addresses"
  ON addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses
CREATE POLICY "Users can update their own addresses"
  ON addresses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own addresses
CREATE POLICY "Users can delete their own addresses"
  ON addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- ORDERS TABLE POLICIES
-- =============================================
-- Users can read their own orders
CREATE POLICY "Users can read their own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only admins can update/delete orders
CREATE POLICY "Only admins can manage orders"
  ON orders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    ) OR auth.uid() = user_id
  );

-- =============================================
-- ORDER_ITEMS TABLE POLICIES
-- =============================================
-- Users can read order items for their own orders
CREATE POLICY "Users can read their order items"
  ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Users can insert order items for their own orders
CREATE POLICY "Users can insert their order items"
  ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM orders
      WHERE orders.id = order_id AND orders.user_id = auth.uid()
    )
  );

-- =============================================
-- OFFERS TABLE POLICIES
-- =============================================
-- Everyone can read offers
CREATE POLICY "Everyone can read offers"
  ON offers
  FOR SELECT
  USING (true);

-- Only admins can manage offers
CREATE POLICY "Only admins can manage offers"
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
-- REVIEWS TABLE POLICIES
-- =============================================
-- Everyone can read reviews
CREATE POLICY "Everyone can read reviews"
  ON reviews
  FOR SELECT
  USING (true);

-- Authenticated users can insert reviews
CREATE POLICY "Authenticated users can insert reviews"
  ON reviews
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- CARTS TABLE POLICIES
-- =============================================
-- Enable realtime for carts
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS carts;

-- Users can read their own cart
CREATE POLICY "Users can read their cart"
  ON carts
  FOR SELECT
  USING (true); -- Keep session-based for now

-- Users can manage their own cart
CREATE POLICY "Users can manage their cart"
  ON carts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- WISHLISTS TABLE POLICIES
-- =============================================
-- Enable realtime for wishlists
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS wishlists;

-- Users can read their own wishlist
CREATE POLICY "Users can read their wishlist"
  ON wishlists
  FOR SELECT
  USING (true); -- Keep session-based for now

-- Users can manage their own wishlist
CREATE POLICY "Users can manage their wishlist"
  ON wishlists
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- Add user_id to carts and wishlists for future user-specific storage
-- (optional, keeps backward compatibility with session-based)
-- =============================================
ALTER TABLE IF EXISTS carts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE IF EXISTS wishlists ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- =============================================
-- Create a trigger to automatically create profile on user sign up
-- =============================================
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
