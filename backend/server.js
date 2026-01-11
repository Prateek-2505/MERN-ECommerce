import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load env variables FIRST
dotenv.config();

console.log("API KEY CHECK →", process.env.CLOUDINARY_API_KEY);

// import "./config/cloudinary.js";



// DB
import connectDB from "./config/db.js";
connectDB();

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Middleware
import { protect } from "./middleware/authMiddleware.js";

const app = express();


import orderRoutes from "./routes/orderRoutes.js";



// Core middlewares
app.use(express.json());
app.use(cors());

// Routes


import userRoutes from "./routes/userRoutes.js";

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// Test routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/test/protected", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
