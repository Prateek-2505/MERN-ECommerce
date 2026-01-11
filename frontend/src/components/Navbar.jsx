import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        MERN Store
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        {/* Cart */}
        <Link to="/cart" className="relative hover:text-gray-300 transition">
          Cart
          {cartCount > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Logged Out */}
        {!isAuthenticated && (
          <>
            <Link to="/login" className="hover:text-gray-300 transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300 transition">
              Register
            </Link>
          </>
        )}

        {/* Logged In */}
        {isAuthenticated && (
          <>
            {/* User */}
            <Link to="/my-orders" className="hover:text-gray-300 transition">
              My Orders
            </Link>

            {/* Admin */}
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-gray-300 transition"
                >
                  Admin Dashboard
                </Link>

                <Link
                  to="/admin/products"
                  className="hover:text-gray-300 transition"
                >
                  Products
                </Link>
              </>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition"
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
