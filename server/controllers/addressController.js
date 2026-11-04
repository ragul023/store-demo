import { query } from "../config/db.js";
export async function listAddresses(req, res) {
  const result = await query(
    "SELECT id,label,recipient_name AS name,phone,address_line1,address_line2,landmark,city,state,pincode,is_default FROM user_addresses WHERE user_id=$1 ORDER BY is_default DESC,created_at DESC",
    [req.user.id],
  );
  res.json({ addresses: result.rows });
}
export async function createAddress(req, res) {
  const {
    label = "Home",
    recipientName,
    phone,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    pincode,
    isDefault = false,
  } = req.body;
  if (!recipientName || !phone || !addressLine1 || !city || !state || !pincode)
    return res
      .status(400)
      .json({ message: "Please provide all required address fields." });
  const result = await query(
    `INSERT INTO user_addresses (user_id,label,recipient_name,phone,address_line1,address_line2,landmark,city,state,pincode,is_default) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id,label,recipient_name AS name,phone,address_line1,address_line2,landmark,city,state,pincode,is_default`,
    [
      req.user.id,
      label,
      recipientName,
      phone,
      addressLine1,
      addressLine2 || null,
      landmark || null,
      city,
      state,
      pincode,
      isDefault,
    ],
  );
  res.status(201).json({ address: result.rows[0] });
}
