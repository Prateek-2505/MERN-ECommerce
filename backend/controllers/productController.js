import Product from "../models/Product.js";

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

    // ✅ Validation
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

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      success: true,
      products,
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
    const product = await Product.findById(req.params.id);
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
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      product,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Error updating product",
    });
  }
};

// DELETE PRODUCT (ADMIN)
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
};
