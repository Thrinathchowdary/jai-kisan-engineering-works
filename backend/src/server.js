import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Product } from "./models/Product.js";
import { requireAdmin } from "./middleware/auth.js";
import { normalizeProduct, validateProduct } from "./validation.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins, credentials: false }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  }),
);

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });
  if (
    !process.env.ADMIN_EMAIL ||
    !process.env.ADMIN_PASSWORD_HASH ||
    !process.env.JWT_SECRET
  )
    return res
      .status(503)
      .json({ message: "Admin authentication is not configured" });
  const validEmail =
    email.trim().toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase();
  const validPassword = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH,
  );
  if (!validEmail || !validPassword)
    return res.status(401).json({ message: "Invalid email or password" });
  const token = jwt.sign(
    { role: "admin", email: process.env.ADMIN_EMAIL },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  );
  return res.json({ token, admin: { email: process.env.ADMIN_EMAIL } });
});

app.get("/api/products", async (_req, res, next) => {
  try {
    const products = await Product.find()
      .sort({ legacyId: 1, createdAt: 1 })
      .lean();
    return res.json(
      products.map(({ _id, ...product }) => ({
        ...product,
        id: product.legacyId || _id,
      })),
    );
  } catch (error) {
    return next(error);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    const query = mongoose.isValidObjectId(req.params.id)
      ? {
          $or: [
            { legacyId: Number(req.params.id) || -1 },
            { _id: req.params.id },
          ],
        }
      : { legacyId: Number(req.params.id) || -1 };
    const product = await Product.findOne(query).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    const { _id, ...result } = product;
    return res.json({ ...result, id: result.legacyId || _id });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/products", requireAdmin, async (req, res, next) => {
  try {
    const errors = validateProduct(req.body);
    if (Object.keys(errors).length)
      return res
        .status(422)
        .json({ message: "Please correct the product fields", errors });
    const product = await Product.create(normalizeProduct(req.body));
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
});

app.put("/api/products/:id", requireAdmin, async (req, res, next) => {
  try {
    const errors = validateProduct(req.body);
    if (Object.keys(errors).length)
      return res
        .status(422)
        .json({ message: "Please correct the product fields", errors });
    const query = mongoose.isValidObjectId(req.params.id)
      ? {
          $or: [
            { legacyId: Number(req.params.id) || -1 },
            { _id: req.params.id },
          ],
        }
      : { legacyId: Number(req.params.id) || -1 };
    const product = await Product.findOneAndUpdate(
      query,
      normalizeProduct(req.body),
      { new: true, runValidators: true },
    ).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/products/:id", requireAdmin, async (req, res, next) => {
  try {
    const query = mongoose.isValidObjectId(req.params.id)
      ? {
          $or: [
            { legacyId: Number(req.params.id) || -1 },
            { _id: req.params.id },
          ],
        }
      : { legacyId: Number(req.params.id) || -1 };
    const deleted = await Product.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: "Unexpected server error" });
});

async function start() {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET)
    throw new Error("MONGODB_URI and JWT_SECRET are required");
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () =>
    console.log(`Jai Kisan API listening on port ${port}`),
  );
}

start().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
