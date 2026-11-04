-- Aura fashion store schema (PostgreSQL 14+)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(40) DEFAULT 'Home', recipient_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL, address_line1 TEXT NOT NULL, address_line2 TEXT,
  landmark TEXT, city VARCHAR(100) NOT NULL, state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL, is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(60) NOT NULL UNIQUE,
  slug VARCHAR(60) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(90) NOT NULL,
  UNIQUE(category_id, slug)
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id),
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(200) UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  category_label VARCHAR(80) NOT NULL DEFAULT 'General',
  color_label VARCHAR(80) NOT NULL DEFAULT 'Default',
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
  badge VARCHAR(40),
  image_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin (to_tsvector('english', name));

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, alt_text TEXT, sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size_label VARCHAR(20) NOT NULL, sort_order INT NOT NULL DEFAULT 0,
  UNIQUE(product_id, size_label)
);

CREATE TABLE IF NOT EXISTS product_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_label VARCHAR(60) NOT NULL, hex_code CHAR(7),
  UNIQUE(product_id, color_label)
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size_id UUID REFERENCES product_sizes(id) ON DELETE SET NULL,
  color_id UUID REFERENCES product_colors(id) ON DELETE SET NULL,
  sku VARCHAR(80) UNIQUE,
  price_override NUMERIC(10,2) CHECK (price_override IS NULL OR price_override >= 0),
  UNIQUE(product_id, size_id, color_id)
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL UNIQUE REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity_available INT NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(140) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS collection_products (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY(collection_id, product_id)
);

CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  UNIQUE(cart_id, product_id, variant_id)
);

CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL DEFAULT 'My wishlist',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);
CREATE TABLE IF NOT EXISTS wishlist_items (
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(wishlist_id, product_id)
);

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(40) NOT NULL UNIQUE,
  discount_type VARCHAR(15) NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  minimum_order NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_uses INT,
  used_count INT NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(24) NOT NULL UNIQUE DEFAULT ('AUR-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  user_id UUID NOT NULL REFERENCES users(id),
  address_id UUID NOT NULL REFERENCES user_addresses(id),
  status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','out_for_delivery','delivered','cancelled')),
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(180) NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  size_label VARCHAR(20),
  color_label VARCHAR(60)
);
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method VARCHAR(20) NOT NULL CHECK (method IN ('UPI','CARD','COD')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending','demo','paid','failed','refunded')),
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  gateway_reference VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(140), body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id, order_item_id)
);

INSERT INTO categories (name, slug, description, sort_order) VALUES
 ('Men','men','Thoughtful everyday pieces for him.',1),
 ('Women','women','Everyday pieces with a little more feeling.',2),
 ('Kids','kids','Comfort and colour for little adventures.',3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (category_id,name,slug)
SELECT c.id, s.name, s.slug FROM categories c
CROSS JOIN (VALUES
 ('men','Shirts','shirts'),('men','T-shirts','t-shirts'),('men','Trousers','trousers'),
 ('women','Dresses','dresses'),('women','Tops','tops'),('women','Jeans','jeans'),('women','Co-ord Sets','co-ord-sets'),
 ('kids','Sets','sets'),('kids','T-shirts','t-shirts'),('kids','Dresses','dresses'),('kids','Shirts','shirts')
) AS s(category_slug,name,slug) WHERE c.slug=s.category_slug
ON CONFLICT (category_id,slug) DO NOTHING;

-- Demo catalogue; safe to rerun because slugs are unique.
INSERT INTO products (category_id,subcategory_id,name,slug,description,category_label,color_label,price,compare_at_price,badge,image_url)
SELECT c.id, sc.id, d.name, d.slug, d.description, d.type, d.color, d.price, d.old_price, d.badge, d.image_url
FROM (VALUES
 ('men','shirts','The Linen Overshirt','linen-overshirt','A breathable linen blend with a relaxed silhouette. Made for sunlit afternoons and everything after.','Shirts','Oat',1890,2490,'BESTSELLER','https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85'),
 ('men','t-shirts','Everyday Cotton Tee','everyday-cotton-tee','The perfect-weight cotton tee, finished with a clean neckline and an easy, everyday fit.','T-shirts','Ivory',890,NULL,'NEW','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85'),
 ('men','shirts','The Sunday Shirt','the-sunday-shirt','A soft, easy shirt with a little room to move. Wear it buttoned up or thrown over a tee.','Shirts','Sage',1590,1990,'20% OFF','https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=85'),
 ('men','trousers','Relaxed Pleat Trousers','relaxed-pleat-trousers','An easy drape, thoughtful pleats and a versatile neutral tone make these a wardrobe staple.','Trousers','Stone',2190,NULL,NULL,'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=85'),
 ('women','dresses','Solene Midi Dress','solene-midi-dress','A fluid midi dress designed to move with you, from slow mornings to late dinners.','Dresses','Sand',2490,3290,'JUST IN','https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85'),
 ('women','co-ord-sets','Soft Form Co-ord','soft-form-coord','A considered two-piece set in a soft, sun-washed shade. Wear together or style separately.','Co-ord Sets','Butter',2890,NULL,'NEW','https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85'),
 ('women','jeans','Everyday Wide-Leg Denim','everyday-wide-leg-denim','A flattering high-rise waist and a relaxed wide leg. Your new favourite pair, found.','Jeans','Blue',1990,2390,'POPULAR','https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85'),
 ('women','tops','The Sunday Blouse','the-sunday-blouse','Lightweight, softly structured and endlessly versatile. The art of keeping it simple.','Tops','Pearl',1690,NULL,NULL,'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=85'),
 ('kids','sets','Little Daydream Set','little-daydream-set','A soft and playful set for big adventures and little everyday moments.','Sets','Peach',1290,1590,'BESTSELLER','https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85'),
 ('kids','t-shirts','Mini Explorer Tee','mini-explorer-tee','Super-soft cotton made for climbing, running, drawing and doing it all again.','T-shirts','Cream',590,NULL,'NEW','https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=85'),
 ('kids','dresses','Little Bloom Dress','little-bloom-dress','A twirl-ready silhouette with thoughtful details and all-day comfort.','Dresses','Blush',1190,1490,'20% OFF','https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=85'),
 ('kids','shirts','Tiny Weekend Shirt','tiny-weekend-shirt','A little shirt for big little plans. Lightweight, comfortable and easy to style.','Shirts','Blue stripe',790,NULL,NULL,'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85')
) AS d(category_slug,subcategory_slug,name,slug,description,type,color,price,old_price,badge,image_url)
JOIN categories c ON c.slug=d.category_slug
LEFT JOIN subcategories sc ON sc.category_id=c.id AND sc.slug=d.subcategory_slug
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_sizes (product_id,size_label,sort_order)
SELECT p.id, size.size_label, size.sort_order FROM products p
JOIN (VALUES
 ('linen-overshirt',ARRAY['S','M','L','XL']),('everyday-cotton-tee',ARRAY['S','M','L','XL','XXL']),('the-sunday-shirt',ARRAY['S','M','L','XL']),('relaxed-pleat-trousers',ARRAY['28','30','32','34','36']),
 ('solene-midi-dress',ARRAY['XS','S','M','L']),('soft-form-coord',ARRAY['XS','S','M','L','XL']),('everyday-wide-leg-denim',ARRAY['26','28','30','32','34']),('the-sunday-blouse',ARRAY['XS','S','M','L']),
 ('little-daydream-set',ARRAY['2-3Y','4-5Y','6-7Y','8-9Y']),('mini-explorer-tee',ARRAY['2-3Y','4-5Y','6-7Y','8-9Y']),('little-bloom-dress',ARRAY['2-3Y','4-5Y','6-7Y','8-9Y']),('tiny-weekend-shirt',ARRAY['2-3Y','4-5Y','6-7Y','8-9Y'])
) AS s(slug,sizes) ON s.slug=p.slug
CROSS JOIN LATERAL unnest(s.sizes) WITH ORDINALITY AS size(size_label,sort_order)
ON CONFLICT (product_id,size_label) DO NOTHING;

INSERT INTO collections (title,slug,description,image_url,is_featured) VALUES
 ('The Everyday Edit','the-everyday-edit','The reliable favourites. Soft cottons, relaxed shapes and the pieces that just make sense.','https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85',true),
 ('Soft Tailoring','soft-tailoring','A more relaxed way to look put together.','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',true),
 ('Little Moments','little-moments','Comfort-first favourites for little people with very big plans.','https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=1200&q=85',true)
ON CONFLICT (slug) DO NOTHING;
