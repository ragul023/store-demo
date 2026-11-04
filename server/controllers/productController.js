import { pool, query } from '../config/db.js';

const productSelect = `
  SELECT p.id, p.slug, p.name, p.description, p.price::float AS price,
         p.compare_at_price::float AS "oldPrice", p.badge, p.color_label AS color,
         c.name AS category, COALESCE(sc.name, p.category_label) AS type,
         p.image_url AS image, p.is_active AS active,
         COALESCE((SELECT json_agg(ps.size_label ORDER BY ps.sort_order) FROM product_sizes ps WHERE ps.product_id = p.id), '[]'::json) AS sizes
  FROM products p
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
`;

export async function listProducts(req, res) {
  const values = [];
  const conditions = ['p.is_active = true'];
  if (req.query.category && req.query.category.toLowerCase() !== 'all') {
    values.push(req.query.category.toLowerCase());
    conditions.push(`lower(c.slug) = $${values.length}`);
  }
  if (req.query.search) {
    values.push(`%${req.query.search.trim()}%`);
    conditions.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length} OR c.name ILIKE $${values.length})`);
  }
  if (req.query.sale === 'true') conditions.push('p.compare_at_price IS NOT NULL AND p.compare_at_price > p.price');
  const result = await query(`${productSelect} WHERE ${conditions.join(' AND ')} ORDER BY p.created_at DESC`, values);
  res.json({ products: result.rows });
}

export async function getProduct(req, res) {
  const result = await query(`${productSelect} WHERE p.id = $1 AND p.is_active = true`, [req.params.id]);
  if (!result.rowCount) return res.status(404).json({ message: 'Product not found.' });
  res.json({ product: result.rows[0] });
}

export async function createProduct(req, res) {
  const { name, description, price, oldPrice, category, type, color, image, badge, sizes = [] } = req.body;
  if (!name || !price || !category || !image) return res.status(400).json({ message: 'Name, price, category and image are required.' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cat = await client.query('SELECT id FROM categories WHERE slug = lower($1)', [category]);
    if (!cat.rowCount) throw Object.assign(new Error('Unknown category.'), { statusCode: 400 });
    const sub = await client.query('SELECT id FROM subcategories WHERE category_id = $1 AND lower(name) = lower($2)', [cat.rows[0].id, type || 'General']);
    const inserted = await client.query(
      `INSERT INTO products (name, description, price, compare_at_price, category_id, subcategory_id, category_label, color_label, image_url, badge)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      [name, description || '', price, oldPrice || null, cat.rows[0].id, sub.rows[0]?.id || null, type || 'General', color || 'Default', image, badge || null]
    );
    for (const [index, size] of sizes.entries()) await client.query('INSERT INTO product_sizes (product_id, size_label, sort_order) VALUES ($1,$2,$3)', [inserted.rows[0].id, size, index]);
    await client.query('COMMIT');
    res.status(201).json({ id: inserted.rows[0].id, message: 'Product created.' });
  } catch (error) {
    await client.query('ROLLBACK'); throw error;
  } finally { client.release(); }
}

export async function deleteProduct(req, res) {
  const result = await query('UPDATE products SET is_active = false, updated_at = now() WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rowCount) return res.status(404).json({ message: 'Product not found.' });
  res.json({ message: 'Product archived.' });
}
