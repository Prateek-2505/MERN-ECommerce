import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/token.js";

/**
 * =========================
 * REGISTER
 * =========================
 */
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { password: _, ...safeUser } = user.toObject();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * =========================
 * LOGIN
 * =========================
 */
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 🔐 Store refresh token (rotation-ready)
    user.refreshToken = refreshToken;
    await user.save();

    sendRefreshTokenCookie(res, refreshToken);

    const { password: _, refreshToken: __, ...safeUser } =
      user.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser, // 🔥 frontend unchanged
      token: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * =========================
 * REFRESH TOKEN
 * =========================
 */
export const refreshTokenController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // 🔁 Rotate refresh token
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    sendRefreshTokenCookie(res, newRefreshToken);

    res.json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(403).json({
      success: false,
      message: "Refresh token expired",
    });
  }
};

/**
 * =========================
 * LOGOUT
 * =========================
 */
export const logoutController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const user = await User.findOne({
        refreshToken: token,
      });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    clearRefreshTokenCookie(res);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
