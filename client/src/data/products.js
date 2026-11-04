const photo = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const products = [
  { id: 'p101', name: 'The Linen Overshirt', category: 'Men', type: 'Shirts', price: 1890, oldPrice: 2490, badge: 'BESTSELLER', color: 'Oat', sizes: ['S','M','L','XL'], image: photo('photo-1598033129183-c4f50c736f10'), description: 'A breathable linen blend with a relaxed silhouette. Made for sunlit afternoons and everything after.' },
  { id: 'p102', name: 'Everyday Cotton Tee', category: 'Men', type: 'T-shirts', price: 890, oldPrice: null, badge: 'NEW', color: 'Ivory', sizes: ['S','M','L','XL','XXL'], image: photo('photo-1521572163474-6864f9cf17ab'), description: 'The perfect-weight cotton tee, finished with a clean neckline and an easy, everyday fit.' },
  { id: 'p103', name: 'The Sunday Shirt', category: 'Men', type: 'Shirts', price: 1590, oldPrice: 1990, badge: '20% OFF', color: 'Sage', sizes: ['S','M','L','XL'], image: photo('photo-1603252109303-2751441dd157'), description: 'A soft, easy shirt with a little room to move. Wear it buttoned up or thrown over a tee.' },
  { id: 'p104', name: 'Relaxed Pleat Trousers', category: 'Men', type: 'Trousers', price: 2190, oldPrice: null, badge: '', color: 'Stone', sizes: ['28','30','32','34','36'], image: photo('photo-1473966968600-fa801b869a1a'), description: 'An easy drape, thoughtful pleats and a versatile neutral tone make these a wardrobe staple.' },
  { id: 'p201', name: 'Solene Midi Dress', category: 'Women', type: 'Dresses', price: 2490, oldPrice: 3290, badge: 'JUST IN', color: 'Sand', sizes: ['XS','S','M','L'], image: photo('photo-1539008835657-9e8e9680c956'), description: 'A fluid midi dress designed to move with you, from slow mornings to late dinners.' },
  { id: 'p202', name: 'Soft Form Co-ord', category: 'Women', type: 'Co-ord Sets', price: 2890, oldPrice: null, badge: 'NEW', color: 'Butter', sizes: ['XS','S','M','L','XL'], image: photo('photo-1483985988355-763728e1935b'), description: 'A considered two-piece set in a soft, sun-washed shade. Wear together or style separately.' },
  { id: 'p203', name: 'Everyday Wide-Leg Denim', category: 'Women', type: 'Jeans', price: 1990, oldPrice: 2390, badge: 'POPULAR', color: 'Blue', sizes: ['26','28','30','32','34'], image: photo('photo-1541099649105-f69ad21f3246'), description: 'A flattering high-rise waist and a relaxed wide leg. Your new favourite pair, found.' },
  { id: 'p204', name: 'The Sunday Blouse', category: 'Women', type: 'Tops', price: 1690, oldPrice: null, badge: '', color: 'Pearl', sizes: ['XS','S','M','L'], image: photo('photo-1551163943-3f6a855d1153'), description: 'Lightweight, softly structured and endlessly versatile. The art of keeping it simple.' },
  { id: 'p301', name: 'Little Daydream Set', category: 'Kids', type: 'Sets', price: 1290, oldPrice: 1590, badge: 'BESTSELLER', color: 'Peach', sizes: ['2-3Y','4-5Y','6-7Y','8-9Y'], image: photo('photo-1519238263530-99bdd11df2ea'), description: 'A soft and playful set for big adventures and little everyday moments.' },
  { id: 'p302', name: 'Mini Explorer Tee', category: 'Kids', type: 'T-shirts', price: 590, oldPrice: null, badge: 'NEW', color: 'Cream', sizes: ['2-3Y','4-5Y','6-7Y','8-9Y'], image: photo('photo-1503919005314-30d93d07d823'), description: 'Super-soft cotton made for climbing, running, drawing and doing it all again.' },
  { id: 'p303', name: 'Little Bloom Dress', category: 'Kids', type: 'Dresses', price: 1190, oldPrice: 1490, badge: '20% OFF', color: 'Blush', sizes: ['2-3Y','4-5Y','6-7Y','8-9Y'], image: photo('photo-1518831959646-742c3a14ebf7'), description: 'A twirl-ready silhouette with thoughtful details and all-day comfort.' },
  { id: 'p304', name: 'Tiny Weekend Shirt', category: 'Kids', type: 'Shirts', price: 790, oldPrice: null, badge: '', color: 'Blue stripe', sizes: ['2-3Y','4-5Y','6-7Y','8-9Y'], image: photo('photo-1519238263530-99bdd11df2ea'), description: 'A little shirt for big little plans. Lightweight, comfortable and easy to style.' },
];

export const collections = [
  { title: 'The Everyday Edit', subtitle: 'Pieces that make getting dressed feel easy.', image: photo('photo-1483985988355-763728e1935b', 1200), tone: 'everyday' },
  { title: 'Soft Tailoring', subtitle: 'A relaxed take on looking put together.', image: photo('photo-1515886657613-9f3515b0c78f', 1200), tone: 'tailoring' },
  { title: 'Little Moments', subtitle: 'Comfort and colour for their next adventure.', image: photo('photo-1503919005314-30d93d07d823', 1200), tone: 'kids' },
];

export const formatPrice = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
