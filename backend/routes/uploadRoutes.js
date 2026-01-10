import express from "express";
import multer from "multer";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { uploadProductImage } from "../controllers/uploadController.js";

const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ CORRECT ADMIN-PROTECTED ROUTE
router.post(
  "/product-image",
  protect,
  isAdmin,
  upload.single("image"),
  uploadProductImage
);

export default router;
