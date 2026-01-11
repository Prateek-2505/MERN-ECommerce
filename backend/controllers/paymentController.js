import crypto from "crypto";
import Order from "../models/Order.js";
import { getRazorpayInstance } from "../config/razorpay.js";

// CREATE RAZORPAY ORDER
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Order already paid" });
    }

    // ✅ CREATE INSTANCE HERE (CRITICAL FIX)
    const razorpay = getRazorpayInstance();

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalPrice * 100, // paise
      currency: "INR",
      receipt: order._id.toString(),
    });

    res.json({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Razorpay order creation failed" });
  }
};

// VERIFY PAYMENT
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findById(orderId);

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    };

    await order.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment verification error" });
  }
};
