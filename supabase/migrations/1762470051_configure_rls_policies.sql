-- Migration: configure_rls_policies
-- Created at: 1762470051

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role', 'authenticated'));

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id OR auth.role() = 'service_role');

-- Categories policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow insert via edge function" ON categories
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Service role can update categories" ON categories
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete categories" ON categories
  FOR DELETE USING (auth.role() = 'service_role');

-- Products policies (public read, admin write)
CREATE POLICY "Active products are viewable by everyone" ON products
  FOR SELECT USING (active = true OR auth.role() = 'service_role');

CREATE POLICY "Allow insert via edge function" ON products
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Service role can update products" ON products
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete products" ON products
  FOR DELETE USING (auth.role() = 'service_role');

-- Carts policies
CREATE POLICY "Users can view own cart" ON carts
  FOR SELECT USING (user_id = auth.uid() OR session_id IS NOT NULL);

CREATE POLICY "Allow cart creation via edge function" ON carts
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can update own cart" ON carts
  FOR UPDATE USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can delete own cart" ON carts
  FOR DELETE USING (user_id = auth.uid() OR auth.role() = 'service_role');

-- Cart items policies
CREATE POLICY "Users can view own cart items" ON cart_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL))
  );

CREATE POLICY "Allow cart items creation via edge function" ON cart_items
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can update own cart items" ON cart_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Users can delete own cart items" ON cart_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
    OR auth.role() = 'service_role'
  );

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Allow order creation via edge function" ON orders
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Service role can update orders" ON orders
  FOR UPDATE USING (auth.role() = 'service_role');

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Allow order items creation via edge function" ON order_items
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Addresses policies
CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role', 'authenticated'));

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE USING (user_id = auth.uid() OR auth.role() = 'service_role');
;