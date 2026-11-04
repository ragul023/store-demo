import { pool, query } from '../config/db.js';

export async function createOrder(req, res) {
  const { items, addressId, paymentMethod } = req.body;
  if (!Array.isArray(items) || items.length === 0 || !addressId || !['UPI','CARD','COD'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'Items, a saved delivery address and a supported payment method are required.' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const address = await client.query('SELECT id FROM user_addresses WHERE id = $1 AND user_id = $2', [addressId, req.user.id]);
    if (!address.rowCount) { await client.query('ROLLBACK'); return res.status(400).json({ message: 'Delivery address not found.' }); }
    let subtotal = 0;
    const verifiedItems = [];
    for (const item of items) {
      const product = await client.query('SELECT id, name, price FROM products WHERE id = $1 AND is_active = true FOR SHARE', [item.productId]);
      if (!product.rowCount) throw Object.assign(new Error('One of the products is no longer available.'), { statusCode: 400 });
      const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      subtotal += Number(product.rows[0].price) * quantity;
      verifiedItems.push({ ...product.rows[0], quantity, size: String(item.size || '') });
    }
    const shipping = subtotal >= 1999 ? 0 : 99;
    const total = subtotal + shipping;
    const order = await client.query(
      `INSERT INTO orders (user_id, address_id, subtotal, shipping_amount, total_amount, status) VALUES ($1,$2,$3,$4,$5,'confirmed') RETURNING id, order_number`,
      [req.user.id, addressId, subtotal, shipping, total]
    );
    for (const item of verifiedItems) {
      await client.query('INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, size_label) VALUES ($1,$2,$3,$4,$5,$6)', [order.rows[0].id, item.id, item.name, item.price, item.quantity, item.size]);
    }
    await client.query('INSERT INTO payments (order_id, method, status, amount) VALUES ($1,$2,$3,$4)', [order.rows[0].id, paymentMethod, paymentMethod === 'COD' ? 'pending' : 'demo', total]);
    await client.query('COMMIT');
    res.status(201).json({ order: { id: order.rows[0].id, number: order.rows[0].order_number, subtotal, shipping, total, status: 'confirmed' }, demoPayment: paymentMethod !== 'COD' });
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}

export async function listMyOrders(req, res) {
  const result = await query(
    `SELECT o.id, o.order_number, o.status, o.total_amount::float AS total, o.created_at,
      COALESCE(json_agg(json_build_object('name', oi.product_name, 'quantity', oi.quantity, 'size', oi.size_label, 'price', oi.unit_price::float)) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
     FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC`, [req.user.id]
  );
  res.json({ orders: result.rows });
}

export async function listAllOrders(req, res) {
  const result = await query(
    `SELECT o.id, o.order_number, o.status, o.total_amount::float AS total, o.created_at, u.name, u.email
     FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC LIMIT 100`
  );
  res.json({ orders: result.rows });
}
