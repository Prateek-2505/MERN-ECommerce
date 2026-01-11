import Order from "../models/Order.js";
import Product from "../models/Product.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items",
      });
    }

    let totalPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      totalPrice += product.price * item.qty;
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.qty;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
    });

    res.status(201).json({ success: true, order });
  } catch {
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};

// USER – MY ORDERS
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({ success: true, orders });
};

// USER – SINGLE ORDER
export const getMyOrderById = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.json({ success: true, order });
};

// ADMIN – ALL ORDERS
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
};

// ADMIN – SINGLE ORDER
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.json({ success: true, order });
};

// ADMIN – UPDATE STATUS (BLOCK UNPAID)
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (!order.isPaid) {
    return res.status(400).json({
      success: false,
      message: "Order must be paid before updating status",
    });
  }

  if (order.status === "Delivered") {
    return res.status(400).json({
      success: false,
      message: "Delivered orders cannot be modified",
    });
  }

  order.status = req.body.status;
  await order.save();

  res.json({ success: true, order });
};

// ADMIN – DELETE ORDER
export const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.status === "Delivered") {
    return res.status(400).json({
      success: false,
      message: "Delivered orders cannot be deleted",
    });
  }

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.qty;
      await product.save();
    }
  }

  await order.deleteOne();

  res.json({
    success: true,
    message: "Order deleted and stock restored",
  });
};
