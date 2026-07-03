-- =============================================
-- CHRONOLUX WATCHES - DATABASE INITIALIZATION AND SECURITY POLICIES
-- Enables Row Level Security (RLS) and defines rules for user data access.
-- Seeds default premium product and offer data if not already present.
-- =============================================

-- 1. CREATE TABLES (if they don't exist)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, -- references profiles(id)
  address_line1 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- references profiles(id)
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

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  reviewer_name TEXT,
  rating NUMERIC,
  title TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS reviews ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE; -- references profiles(id)

CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- references profiles(id)
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- references profiles(id)
  product_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix foreign keys on existing tables if they were referencing auth.users directly
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE IF EXISTS orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
ALTER TABLE IF EXISTS addresses ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE IF EXISTS reviews ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS carts DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
ALTER TABLE IF EXISTS carts ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS wishlists DROP CONSTRAINT IF EXISTS wishlists_user_id_fkey;
ALTER TABLE IF EXISTS wishlists ADD CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 2. DROP OBSOLETE HELPER FUNCTION AND ALL DEPENDENT OBJECTS (policies, etc.)
DROP FUNCTION IF EXISTS public.check_is_admin() CASCADE;

-- 3. BULLETPROOF PURGE OF ALL EXISTING POLICIES IN PUBLIC SCHEMA
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- 4. ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- 5. CREATE COMPREHENSIVE PRODUCTION-READY RLS POLICIES (No recursion, clean direct email checks)

-- PRODUCTS
CREATE POLICY "Public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL 
  USING (auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com') 
  WITH CHECK (auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com');

-- OFFERS
CREATE POLICY "Public read access to offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Admins can manage offers" ON offers FOR ALL 
  USING (auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com') 
  WITH CHECK (auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com');

-- REVIEWS
CREATE POLICY "Public read access to reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_policy" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_policy" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_policy" ON reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "reviews_admin_policy" ON reviews FOR ALL USING (auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com');

-- PROFILES
CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com');
CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_policy" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_policy" ON profiles FOR DELETE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_policy" ON profiles FOR ALL USING (auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com');

-- ADDRESSES
CREATE POLICY "addresses_select_policy" ON addresses FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com');
CREATE POLICY "addresses_insert_policy" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_update_policy" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "addresses_delete_policy" ON addresses FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "addresses_admin_policy" ON addresses FOR ALL USING (auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com');

-- ORDERS
CREATE POLICY "orders_select_policy" ON orders FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com');
CREATE POLICY "orders_insert_policy" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_policy" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "orders_delete_policy" ON orders FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "orders_admin_policy" ON orders FOR ALL USING (auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com');

-- ORDER_ITEMS
CREATE POLICY "order_items_select_policy" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  OR auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com'
);
CREATE POLICY "order_items_insert_policy" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "order_items_delete_policy" ON order_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "order_items_admin_policy" ON order_items FOR ALL USING (auth.jwt() ->> 'email' = 'kiruthick3238q@gmail.com');

-- CARTS
CREATE POLICY "carts_select_policy" ON carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "carts_insert_policy" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "carts_update_policy" ON carts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "carts_delete_policy" ON carts FOR DELETE USING (auth.uid() = user_id);

-- WISHLISTS
CREATE POLICY "wishlists_select_policy" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlists_insert_policy" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlists_update_policy" ON wishlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "wishlists_delete_policy" ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- 6. SEED DATA

-- Products
INSERT INTO products (id, name, brand, price, original_price, rating, reviews, category, style, image, water, movement, gender, feature, description, specs)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Lumiere Classique', 'Chronolux', 4250, 5100, 4.9, 128, 'Dress Watches', 'dress', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop', 30, 'mechanical', 'men', 'Swiss Automatic', 'Elegant Swiss automatic dress watch with sapphire crystal and leather strap.', '{"movement": "ETA 2824-2", "jewels": 25, "waterResistance": "30m", "caseSize": "40mm", "caseMaterial": "Stainless Steel", "crystal": "Sapphire", "bracelet": "Leather"}'),
  ('00000000-0000-0000-0000-000000000002', 'Abyssal Pro 300', 'AquaCraft', 2890, null, 4.8, 94, 'Dive Watches', 'sport', 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=800', 300, 'mechanical', 'men', '300m Diver', 'Professional 300m diver with rotating bezel and screw-down crown.', '{"movement": "Miyota", "jewels": 21, "waterResistance": "300m", "caseSize": "42mm", "caseMaterial": "Titanium", "crystal": "Sapphire", "bracelet": "Steel"}'),
  ('00000000-0000-0000-0000-000000000003', 'Veloce Chrono RS', 'Rapido', 7600, 8200, 4.9, 76, 'Chronographs', 'chrono', 'https://images.pexels.com/photos/15019857/pexels-photo-15019857.jpeg?auto=compress&cs=tinysrgb&w=800', 100, 'mechanical', 'men', 'Racing Chrono', 'Racing chronograph with tachymeter scale and column wheel mechanism.', '{"movement": "Valjoux 7750", "jewels": 27, "waterResistance": "100m", "caseSize": "42mm", "caseMaterial": "Gold Plated", "crystal": "Sapphire", "bracelet": "Leather"}'),
  ('00000000-0000-0000-0000-000000000004', 'Nebula GMT', 'Stellaire', 3400, null, 4.7, 52, 'Smart Luxury', 'smart', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop', 50, 'quartz', 'men', 'Dual Time', 'Dual time zone GMT watch with ceramic bezel and modern design.', '{"movement": "Quartz", "waterResistance": "50m", "caseSize": "44mm", "caseMaterial": "Stainless Steel", "crystal": "Sapphire", "bracelet": "Steel Mesh", "features": "GMT, Date Window"}'),
  ('00000000-0000-0000-0000-000000000005', 'Heritage Tourbillon', 'Maison Vell', 18500, null, 5.0, 23, 'Dress Watches', 'dress', 'https://images.pexels.com/photos/9561398/pexels-photo-9561398.jpeg?auto=compress&cs=tinysrgb&w=800', 30, 'mechanical', 'men', 'Tourbillon', 'Haute horlogerie tourbillon with visible escapement and hand-engraved dial.', '{"movement": "Hand-wound Tourbillon", "jewels": 35, "waterResistance": "30m", "caseSize": "40mm", "caseMaterial": "White Gold", "crystal": "Domed Sapphire", "bracelet": "Alligator Leather"}'),
  ('00000000-0000-0000-0000-000000000006', 'Arctic Expedition', 'NordWatch', 1990, 2400, 4.6, 187, 'Dive Watches', 'sport', 'https://images.pexels.com/photos/280324/pexels-photo-280324.jpeg?auto=compress&cs=tinysrgb&w=800', 200, 'quartz', 'men', 'Expedition', 'Affordable explorer watch with field watch aesthetics and expedition credentials.', '{"movement": "Quartz", "waterResistance": "200m", "caseSize": "43mm", "caseMaterial": "Stainless Steel", "crystal": "Mineral", "bracelet": "NATO Strap", "features": "Date, Luminous Hands"}'),
  ('00000000-0000-0000-0000-000000000007', 'Obsidian Perpetual', 'Noir Atelier', 12000, null, 4.8, 41, 'Chronographs', 'chrono', 'https://images.pexels.com/photos/10414981/pexels-photo-10414981.jpeg?auto=compress&cs=tinysrgb&w=800', 100, 'mechanical', 'men', 'Perpetual', 'Perpetual calendar chronograph with day, date, month complication.', '{"movement": "In-House Manufacture", "jewels": 29, "waterResistance": "100m", "caseSize": "41mm", "caseMaterial": "DLC Coated Steel", "crystal": "Sapphire", "bracelet": "Rubber", "complication": "Perpetual Calendar, Chronograph"}'),
  ('00000000-0000-0000-0000-000000000008', 'Rose Pavé Edition', 'Fleur Fine', 6750, 7500, 4.9, 63, 'Smart Luxury', 'luxury', 'https://images.pexels.com/photos/1136589/pexels-photo-1136589.jpeg?auto=compress&cs=tinysrgb&w=800', 50, 'mechanical', 'women', 'Diamond Set', 'Luxury dress watch with diamond pavé setting and mother-of-pearl dial.', '{"movement": "Automatic", "jewels": 25, "waterResistance": "50m", "caseSize": "36mm", "caseMaterial": "Rose Gold", "crystal": "Sapphire", "bracelet": "Rose Gold", "stones": "Diamonds (2.5ct)"}'),
  ('00000000-0000-0000-0000-000000000009', 'Moonlight Sapphire', 'Stellaire', 5200, null, 4.8, 45, 'Dress Watches', 'dress', 'https://images.unsplash.com/photo-1534131092884-4a0a9d19dff6?auto=compress&cs=tinysrgb&w=800', 30, 'mechanical', 'women', 'Sapphire Crystal', 'Ethereal blue dial reminiscent of moonlit nights. Sapphire crystal case back reveals intricate movement.', '{"movement": "Automatic", "jewels": 25, "waterResistance": "30m", "caseSize": "38mm", "caseMaterial": "Stainless Steel", "crystal": "Sapphire", "bracelet": "Leather"}'),
  ('00000000-0000-0000-0000-000000000010', 'Pearl Elegance', 'Cartier', 8900, null, 4.9, 31, 'Dress Watches', 'dress', 'https://images.pexels.com/photos/10688098/pexels-photo-10688098.png?auto=compress&cs=tinysrgb&w=800', 30, 'quartz', 'women', 'Mother of Pearl', 'Classic luxury watch with a stunning mother of pearl dial and gold case.', '{"movement": "Swiss Quartz", "waterResistance": "30m", "caseSize": "34mm", "caseMaterial": "18K Yellow Gold", "crystal": "Sapphire", "bracelet": "Alligator Leather"}'),
  ('00000000-0000-0000-0000-000000000011', 'Aqua Meridian', 'AquaCraft', 3800, null, 4.7, 56, 'Dive Watches', 'sport', 'https://images.pexels.com/photos/33860152/pexels-photo-33860152.jpeg?auto=compress&cs=tinysrgb&w=800', 200, 'mechanical', 'women', 'Dual Timezone', 'Precision GMT diver with a vibrant blue and black bezel.', '{"movement": "Automatic GMT", "jewels": 24, "waterResistance": "200m", "caseSize": "41mm", "caseMaterial": "Stainless Steel", "crystal": "Sapphire", "bracelet": "Steel"}'),
  ('00000000-0000-0000-0000-000000000012', 'Obsidian Charm', 'Noir Atelier', 4100, null, 4.8, 28, 'Smart Luxury', 'luxury', 'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=800', 50, 'mechanical', 'women', 'Black Diamond', 'Sophisticated black watch with black diamond accents, perfect for evening wear.', '{"movement": "Automatic", "jewels": 21, "waterResistance": "50m", "caseSize": "38mm", "caseMaterial": "Black PVD Steel", "crystal": "Sapphire", "bracelet": "Leather", "stones": "Black Diamonds"}'),
  ('00000000-0000-0000-0000-000000000013', 'Crystal Precision', 'Omega', 5500, null, 4.9, 82, 'Dress Watches', 'dress', 'https://images.pexels.com/photos/13102350/pexels-photo-13102350.jpeg?auto=compress&cs=tinysrgb&w=800', 50, 'mechanical', 'women', 'Co-Axial', 'A timeless masterpiece of precision and style with a clean white dial.', '{"movement": "Co-Axial Automatic", "jewels": 27, "waterResistance": "50m", "caseSize": "39mm", "caseMaterial": "Stainless Steel", "crystal": "Sapphire", "bracelet": "Leather"}'),
  ('00000000-0000-0000-0000-000000000014', 'Emerald Dream', 'Maison Vell', 7200, null, 4.8, 39, 'Smart Luxury', 'luxury', 'https://images.pexels.com/photos/36174613/pexels-photo-36174613.jpeg?auto=compress&cs=tinysrgb&w=800', 50, 'mechanical', 'women', 'Emerald Bezel', 'Luxury timepiece featuring an exquisite emerald green bezel and gold finish.', '{"movement": "Automatic", "jewels": 25, "waterResistance": "38mm", "caseMaterial": "18K Gold Plated", "crystal": "Sapphire", "bracelet": "Gold Link"}'),
  ('00000000-0000-0000-0000-000000000015', 'Sapphire Sport', 'NordWatch', 2990, null, 4.7, 64, 'Dive Watches', 'sport', 'https://images.pexels.com/photos/15210883/pexels-photo-15210883.jpeg?auto=compress&cs=tinysrgb&w=800', 150, 'mechanical', 'women', 'Sport Elegant', 'Sporty yet elegant watch with a deep sapphire blue dial and diamond markers.', '{"movement": "Automatic", "jewels": 23, "waterResistance": "150m", "caseSize": "40mm", "caseMaterial": "Stainless Steel", "crystal": "Sapphire", "bracelet": "Steel", "stones": "Diamond Markers"}')
ON CONFLICT (id) DO NOTHING;

-- Offer
INSERT INTO offers (id, title, subtitle, discount, end_time, description, watch_name, is_active)
VALUES (
  'summer_2025',
  'Summer Prestige',
  'Event 2025',
  20,
  1752399999999,
  'Exclusive savings on over 200 authenticated timepieces. Once gone, these prices never return.',
  'Chronolux Tourbillon',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 7. CLEAN UP DUPLICATE PRODUCTS
DELETE FROM products 
WHERE id NOT IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000007',
  '00000000-0000-0000-0000-000000000008',
  '00000000-0000-0000-0000-000000000009',
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000013',
  '00000000-0000-0000-0000-000000000014',
  '00000000-0000-0000-0000-000000000015'
);

-- 8. TRIGGERS AND FUNCTIONS

-- Create new profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'kiruthick3238q@gmail.com' THEN true ELSE false END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    is_admin = CASE WHEN EXCLUDED.is_admin OR NEW.email = 'kiruthick3238q@gmail.com' THEN true ELSE false END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure realtime is enabled on all appropriate tables
-- Drop from publication first if it exists to avoid errors, then recreate
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE products, orders, offers, profiles, carts, wishlists, reviews;

-- 9. SET DEMO ADMIN USER
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
