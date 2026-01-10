import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        MERN Store
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        {/* Logged Out */}
        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              className="hover:text-gray-300 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:text-gray-300 transition"
            >
              Register
            </Link>
          </>
        )}

        {/* Logged In */}
        {isAuthenticated && (
          <>
            {/* Admin Links */}
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

                <Link
                  to="/admin/create-product"
                  className="hover:text-gray-300 transition"
                >
                  Add Product
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
