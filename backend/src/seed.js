import "dotenv/config";
import mongoose from "mongoose";
import { products } from "../../src/data/products.js";
import { Product } from "./models/Product.js";

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
await mongoose.connect(process.env.MONGODB_URI);

for (const source of products) {
  const { id, ...data } = source;
  await Product.findOneAndUpdate(
    { legacyId: id },
    { ...data, legacyId: id },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

console.log(
  `Seeded ${products.length} products without recalculating any values.`,
);
await mongoose.disconnect();
