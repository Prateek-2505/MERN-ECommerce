import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

// ✅ PATCH for partial updates
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

export default router;
