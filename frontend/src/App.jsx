import { BrowserRouter, Routes, Route } from "react-router-dom";

// ================= PUBLIC PAGES =================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

// ================= USER PAGES =================
import MyOrders from "./pages/MyOrders";
import MyOrderDetails from "./pages/MyOrderDetails";
import PaymentPage from "./pages/PaymentPage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

// ================= ADMIN PAGES =================
import AdminDashboard from "./pages/AdminDashboard";
import CreateProduct from "./pages/CreateProduct";
import AdminProducts from "./pages/AdminProducts";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";

// ================= COMPONENTS =================
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// ================= CONTEXT =================
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ================= CHECKOUT ================= */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* ================= USER PROFILE ================= */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            {/* ================= USER ORDERS ================= */}
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-orders/:id"
              element={
                <ProtectedRoute>
                  <MyOrderDetails />
                </ProtectedRoute>
              }
            />

            {/* ================= PAYMENT ================= */}
            <Route
              path="/pay/:id"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />

            {/* ================= ADMIN ================= */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/profile"
              element={
                <AdminRoute>
                  <Profile />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/profile/edit"
              element={
                <AdminRoute>
                  <EditProfile />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/create-product"
              element={
                <AdminRoute>
                  <CreateProduct />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/edit-product/:id"
              element={
                <AdminRoute>
                  <AdminEditProduct />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/orders/:id"
              element={
                <AdminRoute>
                  <AdminOrderDetails />
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
