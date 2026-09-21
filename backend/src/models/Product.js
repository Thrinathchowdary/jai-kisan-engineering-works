import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    category: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    manufacturer: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    approvedPrice: { type: Number, required: true, min: 0 },
    subsidy50: { type: Number, required: true, min: 0 },
    farmerShare50: { type: Number, required: true, min: 0 },
    subsidy40: { type: Number, required: true, min: 0 },
    farmerShare40: { type: Number, required: true, min: 0 },
    image: { type: String, default: "", trim: true },
  },
  { timestamps: true, versionKey: false },
);

export const Product = mongoose.model("Product", productSchema);
