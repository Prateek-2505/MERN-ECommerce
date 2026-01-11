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

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        MERN Store
      </Link>

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

            {isAdmin && (
              <Link to="/admin/dashboard">
                Admin Dashboard
              </Link>
            )}

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
