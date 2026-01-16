import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const FALLBACK_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Navbar = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  const canGoBack = window.history.length > 1;
  const isDark = theme === "dark";

  return (
    <nav
      className={`sticky top-0 z-50 border-b ${
        isDark
          ? "bg-slate-900 text-slate-100 border-slate-800"
          : "bg-white text-slate-900 border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            disabled={!canGoBack}
            className={`px-3 py-1.5 rounded-md border text-sm transition ${
              isDark
                ? "border-slate-700 hover:bg-slate-800 disabled:opacity-40"
                : "border-slate-300 hover:bg-slate-100 disabled:opacity-40"
            }`}
          >
            ← Back
          </button>

          <Link to="/" className="text-lg font-bold">
            Cart<span className="text-blue-600">ify</span>
          </Link>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-4 text-sm">
          {/* THEME TOGGLE (ICON ONLY) */}
          <button
            onClick={() =>
              setTheme(isDark ? "light" : "dark")
            }
            title={
              isDark
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
            }
            className={`text-xl transition ${
              isDark
                ? "text-yellow-300 hover:text-yellow-200"
                : "text-slate-700 hover:text-black"
            }`}
          >
            {isDark ? "🌞" : "🌙"}
          </button>

          {/* CART */}
          <Link to="/cart">
            Cart ({cartCount})
          </Link>

          {/* GUEST */}
          {!isAuthenticated && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {/* AUTHENTICATED */}
          {isAuthenticated && user && (
            <>
              <Link to="/my-orders">My Orders</Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="font-semibold text-blue-600"
                >
                  Admin Panel
                </Link>
              )}

              {/* PROFILE */}
              <Link
                to="/profile"
                className="flex items-center gap-2 ml-3"
              >
                <img
                  src={user.avatar || FALLBACK_AVATAR}
                  onError={(e) =>
                    (e.currentTarget.src =
                      FALLBACK_AVATAR)
                  }
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">
                  {user.name}
                </span>
              </Link>

              {/* LOGOUT */}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="px-3 py-1.5 rounded bg-red-600 text-white ml-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
