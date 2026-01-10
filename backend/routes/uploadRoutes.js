import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { uploadProductImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/product-image",
  protect,
  admin,
  upload.single("image"),
  uploadProductImage
);

export default router;
