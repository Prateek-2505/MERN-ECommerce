import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: String,
    brand: String,
    countInStock: Number,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
