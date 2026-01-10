import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN
router.post("/create-product", protect, isAdmin, createProduct);
router.patch("/update-product/:id", protect, isAdmin, updateProduct);
router.delete("/delete-product/:id", protect, isAdmin, deleteProduct);

// PUBLIC
router.get("/get-products", getProducts);
router.get("/get-product/:id", getProduct);

export default router;
