import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orderApi";
import axios from "axios";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [checkingStock, setCheckingStock] = useState(true);
  const [stockErrors, setStockErrors] = useState([]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 🔍 CHECK LATEST STOCK ON LOAD
  useEffect(() => {
    const validateStock = async () => {
      const errors = [];

      for (const item of cartItems) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/products/${item._id}`
          );

          const product = res.data.product;

          if (!product || product.stock < item.qty) {
            errors.push(
              `${item.name} has only ${
                product?.stock ?? 0
              } items left`
            );
          }
        } catch {
          errors.push(
            `${item.name} is no longer available`
          );
        }
      }

      setStockErrors(errors);
      setCheckingStock(false);
    };

    if (cartItems.length > 0) {
      validateStock();
    } else {
      setCheckingStock(false);
    }
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Your cart is empty</p>
      </div>
    );
  }

  if (checkingStock) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking latest stock...</p>
      </div>
    );
  }

  const isStockValid = stockErrors.length === 0;

  const placeOrderHandler = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
      }));

      const res = await createOrder(orderItems, token);

      clearCart();
      navigate(`/my-orders/${res.order._id}`);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to place order"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">
          Checkout
        </h1>

        {/* ⚠️ STOCK ISSUES */}
        {!isStockValid && (
          <div className="mb-4 p-4 border border-red-500 rounded text-red-600">
            <p className="font-semibold mb-2">
              Some items in your cart have changed:
            </p>
            <ul className="list-disc pl-6">
              {stockErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between border-b py-3"
          >
            <div>
              <p className="font-semibold">
                {item.name}
              </p>
              <p className="text-sm text-gray-600">
                ₹ {item.price} × {item.qty}
              </p>
            </div>

            <p className="font-semibold">
              ₹ {item.price * item.qty}
            </p>
          </div>
        ))}

        <div className="mt-6 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>

        {/* 🚫 DISABLE PLACE ORDER IF STOCK INVALID */}
        <button
          onClick={placeOrderHandler}
          disabled={!isStockValid}
          className={`mt-6 w-full py-3 rounded text-white ${
            isStockValid
              ? "bg-black"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
