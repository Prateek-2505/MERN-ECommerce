import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const FALLBACK_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  const canGoBack = window.history.length > 1;

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          disabled={!canGoBack}
          className={`px-3 py-1 rounded border ${
            canGoBack
              ? "border-white hover:bg-white hover:text-black"
              : "border-gray-500 text-gray-500 cursor-not-allowed"
          }`}
        >
          ← Back
        </button>

        <Link to="/" className="text-xl font-bold">
          MERN Store
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Link to="/cart">
          Cart ({cartCount})
        </Link>

        {!isAuthenticated && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {isAuthenticated && user && (
          <>
            {/* MY ORDERS — USER & ADMIN */}
            <Link to="/my-orders">
              My Orders
            </Link>

            {/* PROFILE */}
            <Link
              to="/profile"
              className="flex items-center gap-2"
            >
              <img
                src={user.avatar || FALLBACK_AVATAR}
                onError={(e) =>
                  (e.currentTarget.src = FALLBACK_AVATAR)
                }
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{user.name}</span>
            </Link>

            {/* ADMIN DASHBOARD */}
            {isAdmin && (
              <Link to="/admin/dashboard">
                Admin Dashboard
              </Link>
            )}

            {/* LOGOUT */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-white text-black px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
