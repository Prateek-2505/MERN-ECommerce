import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 MEMORY storage (REQUIRED for streamifier)
const upload = multer({ storage: multer.memoryStorage() });

// ADMIN — PRODUCT IMAGE
router.post(
  "/product-image",
  protect,
  isAdmin,
  upload.single("image"),
  (req, res, next) => {
    req.uploadFolder = "products";
    next();
  },
  uploadImage
);

// USER — AVATAR IMAGE
router.post(
  "/avatar",
  protect,
  upload.single("image"),
  (req, res, next) => {
    req.uploadFolder = "avatars";
    next();
  },
  uploadImage
);

export default router;
