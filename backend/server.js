import express from "express";
import mysql from "mysql2";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ------------------ Setup __dirname ------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------ App Setup ------------------
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));

// ------------------ MySQL Connection ------------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "task6",
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// ------------------ PRODUCTS APIs ------------------
app.get("/api/products", (req, res) => {
  const search = req.query.search || "";
  const sql = `
    SELECT * FROM products
    WHERE name LIKE ? OR category LIKE ? OR location LIKE ? OR description LIKE ?
    ORDER BY updated_at DESC
  `;
  const param = `%${search}%`;
  db.query(sql, [param, param, param, param], (err, rows) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    res.json({ ok: true, data: rows });
  });
});

app.get("/api/products/:id", (req, res) => {
  db.query("SELECT * FROM products WHERE id=?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    if (!rows.length) return res.status(404).json({ ok: false, error: "Product not found" });
    res.json({ ok: true, data: rows[0] });
  });
});

app.put("/api/products/:id", (req, res) => {
  const { name, category, price, description, location } = req.body;
  const sql = `
    UPDATE products
    SET name=?, category=?, price=?, description=?, location=?, updated_at=NOW()
    WHERE id=?
  `;
  db.query(sql, [name, category, price, description, location, req.params.id], (err) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    res.json({ ok: true, message: "Product updated successfully" });
  });
});

// ------------------ BUYERS APIs ------------------
app.get("/api/buyers", (req, res) => {
  const search = req.query.search || "";
  const sql = `
    SELECT * FROM buyers
    WHERE name LIKE ? OR email LIKE ? OR location LIKE ? OR phone LIKE ?
    ORDER BY updated_at DESC
  `;
  const param = `%${search}%`;
  db.query(sql, [param, param, param, param], (err, rows) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    res.json({ ok: true, data: rows });
  });
});

app.get("/api/buyers/:id", (req, res) => {
  db.query("SELECT * FROM buyers WHERE id=?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    if (!rows.length) return res.status(404).json({ ok: false, error: "Buyer not found" });
    res.json({ ok: true, data: rows[0] });
  });
});

app.put("/api/buyers/:id", (req, res) => {
  const { name, email, phone, location, notes } = req.body;
  const sql = `
    UPDATE buyers
    SET name=?, email=?, phone=?, location=?, notes=?, updated_at=NOW()
    WHERE id=?
  `;
  db.query(sql, [name, email, phone, location, notes, req.params.id], (err) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    res.json({ ok: true, message: "Buyer updated successfully" });
  });
});

// ------------------ Start Server ------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));