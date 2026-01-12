import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = ({ theme }) => {
  const isDark = theme === "dark";

  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  /* ================= EMPTY CART ================= */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p
          className={`text-lg font-medium ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Your cart is empty
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ================= TITLE ================= */}
      <h1
        className={`text-2xl font-bold mb-6 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Shopping Cart
      </h1>

      {/* ================= CART ITEMS ================= */}
      <div
        className={`rounded-xl border overflow-hidden
          ${
            isDark
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
      >
        {cartItems.map((item, index) => (
          <div
            key={item._id}
            className={`flex justify-between items-center px-5 py-4
              ${
                index !== cartItems.length - 1
                  ? isDark
                    ? "border-b border-slate-700"
                    : "border-b border-slate-200"
                  : ""
              }`}
          >
            <div>
              <h2 className="font-semibold">
                {item.name}
              </h2>
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

            <button
              onClick={() => removeFromCart(item._id)}
              className={`text-sm font-medium transition
                ${
                  isDark
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-600 hover:text-red-500"
                }`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="mt-8 space-y-4">
        <h2
          className={`text-xl font-bold ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          Total: ₹ {total}
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/checkout")}
            className={`px-6 py-2 rounded-lg font-semibold transition
              ${
                isDark
                  ? "bg-white text-black hover:opacity-90"
                  : "bg-slate-900 text-white hover:opacity-90"
              }`}
          >
            Proceed to Checkout
          </button>

          <button
            onClick={clearCart}
            className={`px-6 py-2 rounded-lg font-semibold transition
              ${
                isDark
                  ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "bg-slate-200 text-slate-900 hover:bg-slate-300"
              }`}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
