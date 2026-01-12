import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

/* ================= GET PROFILE ================= */
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.status(200).json({
    success: true,
    user,
  });
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  const { name, avatar } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name !== undefined) user.name = name;

  if (avatar && avatar !== user.avatar) {
    if (
      user.avatar &&
      !user.avatar.includes("flaticon.com")
    ) {
      try {
        const publicId = user.avatar
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn("Avatar delete failed:", err.message);
      }
    }
    user.avatar = avatar;
  }

  await user.save();

  res.status(200).json({
    success: true,
    name: user.name,
    avatar: user.avatar,
  });
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    return res
      .status(400)
      .json({ message: "Current password incorrect" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.status(200).json({ success: true });
};

/* ================= DELETE ACCOUNT (ADVANCED CLEANUP) ================= */
export const deleteAccount = async (req, res) => {
  try {
    const password = req.body?.password;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password incorrect",
      });
    }

    // 🔄 HANDLE ORDERS
    const orders = await Order.find({ user: user._id });

    for (const order of orders) {
      // ❌ NOT DELIVERED → DELETE + RESTORE STOCK
      if (order.status !== "Delivered") {
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock += item.qty;
            await product.save();
          }
        }
        await order.deleteOne();
      }
      // ✅ DELIVERED → KEEP ORDER, REMOVE USER
      else {
        order.user = null;
        await order.save();
      }
    }

    // 🧹 DELETE AVATAR (BEST EFFORT)
    if (
      user.avatar &&
      !user.avatar.includes("flaticon.com")
    ) {
      try {
        const publicId = user.avatar
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn("Avatar delete failed:", err.message);
      }
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Account deleted, orders cleaned up correctly",
    });
  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
