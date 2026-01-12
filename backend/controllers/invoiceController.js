import Order from "../models/Order.js";
import { generateInvoice } from "../utils/generateInvoice.js";

export const downloadInvoice = async (req, res) => {
  const order = await Order.findById(
    req.params.id
  ).populate("user", "name email");

  if (!order) {
    return res
      .status(404)
      .json({ message: "Order not found" });
  }

  // 🔐 Only owner or admin
  if (
    req.user.role !== "admin" &&
    order.user._id.toString() !==
      req.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ message: "Unauthorized" });
  }

  // 🔒 Invoice only for PAID orders
  if (!order.isPaid) {
    return res.status(400).json({
      message:
        "Invoice available only after payment",
    });
  }

  generateInvoice(order, res);
};
