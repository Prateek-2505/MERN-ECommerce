import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { v2 as cloudinary } from "cloudinary";

// CREATE PRODUCT (ADMIN)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      image,
      stock,
    } = req.body;

    if (
      !name ||
      !price ||
      !description ||
      !category ||
      !image ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including stock are required",
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      image,
      stock,
    });

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS (PAGINATION + SEARCH + CATEGORY)
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const search = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};

    const category = req.query.category
      ? { category: req.query.category }
      : {};

    const filter = { ...search, ...category };

    const totalProducts =
      await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      products,
      page,
      totalPages: Math.ceil(
        totalProducts / limit
      ),
      totalProducts,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};

// GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      product,
    });
  } catch {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
};

// UPDATE PRODUCT (ADMIN)
export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        product[key] = updates[key];
      }
    });

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// DELETE PRODUCT (ADMIN)
// 🧨 Deletes non-delivered orders that contain this product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🧹 Delete all NON-delivered orders containing this product
    await Order.deleteMany({
      "orderItems.product": productId,
      status: { $ne: "Delivered" },
    });

    // 🧹 Delete image from Cloudinary if exists
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(
        product.imagePublicId
      );
    }

    // 🧹 Delete product itself
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Product deleted and related non-delivered orders removed",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
