-- 1. Create offers table if not exists
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  discount NUMERIC DEFAULT 0,
  end_time BIGINT,
  description TEXT,
  watch_name TEXT,
  is_active BOOLEAN DEFAULT true
);

-- 2. Policies for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read products" ON products;
DROP POLICY IF EXISTS "Allow public write products" ON products;
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public write products" ON products FOR ALL USING (true);

-- 3. Policies for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read orders" ON orders;
DROP POLICY IF EXISTS "Allow public write orders" ON orders;
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public write orders" ON orders FOR ALL USING (true);

-- 4. Policies for order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public write order_items" ON order_items;
CREATE POLICY "Allow public read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Allow public write order_items" ON order_items FOR ALL USING (true);

-- 5. Policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow public write profiles" ON profiles;
CREATE POLICY "Allow public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public write profiles" ON profiles FOR ALL USING (true);

-- 6. Policies for addresses table
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read addresses" ON addresses;
DROP POLICY IF EXISTS "Allow public write addresses" ON addresses;
CREATE POLICY "Allow public read addresses" ON addresses FOR SELECT USING (true);
CREATE POLICY "Allow public write addresses" ON addresses FOR ALL USING (true);

-- 7. Policies for offers table
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read offers" ON offers;
DROP POLICY IF EXISTS "Allow public write offers" ON offers;
CREATE POLICY "Allow public read offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Allow public write offers" ON offers FOR ALL USING (true);

-- 8. Enable Realtime database replication for products, orders, and offers
BEGIN;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS products, orders, offers;
  ALTER PUBLICATION supabase_realtime ADD TABLE products;
  ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  ALTER PUBLICATION supabase_realtime ADD TABLE offers;
COMMIT;
