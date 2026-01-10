import express from "express";
import {
  registerUser,
  loginUser,
  testAuth,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/test", protect, testAuth);

// 🔴 Admin test route
router.get("/admin-test", protect, admin, (req, res) => {
  res.json({
    message: "Admin access granted",
    user: req.user,
  });
});

export default router;
