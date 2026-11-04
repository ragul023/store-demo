import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { config } from "../config/env.js";

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );
}

export async function register(req, res) {
  const { name, email, password, phone } = req.body;
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    return res
      .status(400)
      .json({
        message:
          "Name, valid email and a password of at least 8 characters are required.",
      });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const result = await query(
      `INSERT INTO users (name, email, password_hash, phone) VALUES ($1, lower($2), $3, $4) RETURNING id, name, email, role`,
      [name.trim(), email.trim(), passwordHash, phone || null],
    );
    const user = result.rows[0];
    return res.status(201).json({ user, token: makeToken(user) });
  } catch (error) {
    if (error.code === "23505")
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    throw error;
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const result = await query(
    "SELECT id, name, email, role, password_hash FROM users WHERE email = lower($1)",
    [email.trim()],
  );
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ message: "Email or password is incorrect." });
  delete user.password_hash;
  return res.json({ user, token: makeToken(user) });
}

export async function me(req, res) {
  const result = await query(
    "SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1",
    [req.user.id],
  );
  if (!result.rowCount)
    return res.status(404).json({ message: "User not found." });
  res.json({ user: result.rows[0] });
}
