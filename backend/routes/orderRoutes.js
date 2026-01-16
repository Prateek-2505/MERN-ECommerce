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

// ================= USER =================

// CREATE ORDER
router.post("/create", protect, createOrder);

// GET MY ORDERS
router.get("/my-orders", protect, getMyOrders);

// GET SINGLE MY ORDER
router.get("/my/:id", protect, getMyOrderById);

// ✅ USER CANCEL ORDER (OWN, UNPAID ONLY)
router.delete("/cancel/:id", protect, deleteOrder);

// ================= ADMIN =================

// ALL ORDERS
router.get("/all", protect, isAdmin, getAllOrders);

// SINGLE ORDER
router.get("/:id", protect, isAdmin, getOrderById);

// UPDATE STATUS
router.put("/update/:id", protect, isAdmin, updateOrderStatus);

// DELETE ORDER (ADMIN)
router.delete("/:id", protect, isAdmin, deleteOrder);

export default router;
