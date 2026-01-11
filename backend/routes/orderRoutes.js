import express from "express";
import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER
router.post("/create", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/my/:id", protect, getMyOrderById); // ✅ FIX

// ADMIN
router.get("/all", protect, isAdmin, getAllOrders);
router.get("/:id", protect, isAdmin, getOrderById);
router.put("/update/:id", protect, isAdmin, updateOrderStatus);
router.delete("/:id", protect, isAdmin, deleteOrder);

export default router;
