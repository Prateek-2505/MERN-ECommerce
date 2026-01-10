import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * CREATE PRODUCT (Admin)
 * POST /api/products/create-product
 */
router.post(
  "/create-product",
  protect,
  admin,
  createProduct
);

/**
 * GET ALL PRODUCTS
 * GET /api/products/get-products
 */
router.get(
  "/get-products",
  getProducts
);

/**
 * GET SINGLE PRODUCT
 * GET /api/products/get-product/:id
 */
router.get(
  "/get-product/:id",
  getProductById
);

/**
 * UPDATE PRODUCT (Admin)
 * PATCH /api/products/update-product/:id
 */
router.patch(
  "/update-product/:id",
  protect,
  admin,
  updateProduct
);

/**
 * DELETE PRODUCT (Admin)
 * DELETE /api/products/delete-product/:id
 */
router.delete(
  "/delete-product/:id",
  protect,
  admin,
  deleteProduct
);

export default router;
