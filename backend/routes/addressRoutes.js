import express from "express";
import {
  getMyAddresses,
  createAddress,
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER ADDRESSES
router.get("/", protect, getMyAddresses);
router.post("/", protect, createAddress);

export default router;
