import User from "../models/User.js";
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

/* ================= UPDATE PROFILE (PATCH) ================= */
export const updateProfile = async (req, res) => {
  const { name, avatar } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update name
  if (name !== undefined) {
    user.name = name;
  }

  // Update avatar + delete old one
  if (avatar !== undefined && avatar !== user.avatar) {
    // 🧹 delete old avatar if not default
    if (
      user.avatar &&
      !user.avatar.includes("flaticon.com")
    ) {
      const publicId = user.avatar
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(publicId);
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

/* ================= DELETE ACCOUNT ================= */
export const deleteAccount = async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ message: "Password incorrect" });
  }

  // 🧹 delete avatar if not default
  if (
    user.avatar &&
    !user.avatar.includes("flaticon.com")
  ) {
    const publicId = user.avatar
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];

    await cloudinary.uploader.destroy(publicId);
  }

  await user.deleteOne();

  res.status(200).json({ success: true });
};
