import express from "express";
import {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
} from "../controllers/authController.js";

const router = express.Router();

// AUTH
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

export default router;
