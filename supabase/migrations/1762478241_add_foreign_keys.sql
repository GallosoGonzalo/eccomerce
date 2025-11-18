-- Migration: add_foreign_keys
-- Created at: 1762478241

-- Add foreign key constraints to cart_items
ALTER TABLE cart_items
ADD CONSTRAINT cart_items_cart_id_fkey
FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE;

ALTER TABLE cart_items
ADD CONSTRAINT cart_items_product_id_fkey
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Add foreign key constraints to products
ALTER TABLE products
ADD CONSTRAINT products_category_id_fkey
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Add foreign key constraints to order_items
ALTER TABLE order_items
ADD CONSTRAINT order_items_order_id_fkey
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Add foreign key constraints to orders
ALTER TABLE orders
ADD CONSTRAINT orders_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE orders
ADD CONSTRAINT orders_shipping_address_id_fkey
FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL;

-- Add foreign key constraints to addresses
ALTER TABLE addresses
ADD CONSTRAINT addresses_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add foreign key constraints to carts
ALTER TABLE carts
ADD CONSTRAINT carts_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;;