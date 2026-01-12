import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// ================= FORCE .env LOAD (CRITICAL FIX) =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

// DEBUG (TEMP — REMOVE AFTER IT WORKS)


// ================= DATABASE =================
import connectDB from "./config/db.js";
connectDB();

// ================= ROUTES =================
import invoiceRoutes from "./routes/invoiceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ================= MIDDLEWARE =================
import { protect } from "./middleware/authMiddleware.js";

const app = express();

app.use(express.json());
app.use(cors());

// ================= API ROUTES =================
app.use("/api/invoice", invoiceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// ================= TEST ROUTES =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/test/protected", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
