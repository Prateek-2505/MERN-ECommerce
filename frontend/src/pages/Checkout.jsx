import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orderApi";
import { getProduct } from "../api/productApi";

const Checkout = ({ theme }) => {
  const isDark = theme === "dark";

  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [checkingStock, setCheckingStock] = useState(true);
  const [stockErrors, setStockErrors] = useState([]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ================= STOCK VALIDATION ================= */
  useEffect(() => {
    const validateStock = async () => {
      setCheckingStock(true);
      setStockErrors([]);

      const errors = [];

      for (const item of cartItems) {
        try {
          // ✅ Use SAME API helper as rest of app
          const data = await getProduct(item._id);
          const product = data.product;

          if (!product) {
            errors.push(`${item.name} is no longer available`);
            continue;
          }

          if (product.stock < item.qty) {
            errors.push(
              `${item.name} has only ${product.stock} items left`
            );
          }
        } catch {
          // ❗ Network error should NOT auto-fail checkout
          console.warn(`Stock check skipped for ${item.name}`);
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

  /* ================= EMPTY CART ================= */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className={isDark ? "text-slate-300" : "text-slate-700"}>
          Your cart is empty
        </p>
      </div>
    );
  }

  /* ================= CHECKING STOCK ================= */
  if (checkingStock) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className={isDark ? "text-slate-300" : "text-slate-700"}>
          Checking latest stock…
        </p>
      </div>
    );
  }

  const isStockValid = stockErrors.length === 0;

  /* ================= PLACE ORDER ================= */
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        className={`rounded-xl border p-6 shadow-sm
          ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
      >
        <h1 className="text-2xl font-bold mb-6">
          Checkout
        </h1>

        {/* ================= STOCK ERRORS ================= */}
        {!isStockValid && (
          <div
            className={`mb-6 p-4 rounded-lg border
              ${
                isDark
                  ? "border-red-400 text-red-300 bg-slate-800"
                  : "border-red-500 text-red-600 bg-red-50"
              }`}
          >
            <p className="font-semibold mb-2">
              Some items in your cart have changed:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              {stockErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ================= ITEMS ================= */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className={`flex justify-between pb-3
                ${
                  isDark
                    ? "border-b border-slate-700"
                    : "border-b border-slate-200"
                }`}
            >
              <div>
                <p className="font-semibold">
                  {item.name}
                </p>
                <p
                  className={`text-sm ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-600"
                  }`}
                >
                  ₹ {item.price} × {item.qty}
                </p>
              </div>

              <p className="font-semibold">
                ₹ {item.price * item.qty}
              </p>
            </div>
          ))}
        </div>

        {/* ================= TOTAL ================= */}
        <div className="mt-6 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>

        {/* ================= PLACE ORDER ================= */}
        <button
          onClick={placeOrderHandler}
          disabled={!isStockValid}
          className={`mt-6 w-full py-3 rounded-lg font-semibold transition
            ${
              isStockValid
                ? isDark
                  ? "bg-white text-black hover:opacity-90"
                  : "bg-slate-900 text-white hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed text-white"
            }`}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
