import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

// ================= PAGES =================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import MyOrderDetails from "./pages/MyOrderDetails";
import PaymentPage from "./pages/PaymentPage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
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
  const [theme, setTheme] = useState("light");

  return (
    <AuthProvider>
      <CartProvider>
        {/* GLOBAL THEME WRAPPER */}
        <div
          className={
            theme === "dark"
              ? "min-h-screen bg-slate-950 text-slate-100"
              : "min-h-screen bg-slate-50 text-slate-900"
          }
        >
          <BrowserRouter>
            <Toaster position="top-right" />

            {/* NAVBAR */}
            <Navbar theme={theme} setTheme={setTheme} />

            <Routes>
              {/* ================= PUBLIC ================= */}
              <Route path="/" element={<Home theme={theme} />} />

              <Route
                path="/product/:id"
                element={<ProductDetails theme={theme} />}
              />

              <Route
                path="/cart"
                element={<Cart theme={theme} />}
              />

              <Route
                path="/login"
                element={<Login theme={theme} />}
              />

              <Route
                path="/register"
                element={<Register theme={theme} />}
              />

              {/* ================= CHECKOUT ================= */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout theme={theme} />
                  </ProtectedRoute>
                }
              />

              {/* ================= USER PROFILE ================= */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile theme={theme} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile theme={theme} />
                  </ProtectedRoute>
                }
              />

              {/* ================= USER ORDERS ================= */}
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders theme={theme} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-orders/:id"
                element={
                  <ProtectedRoute>
                    <MyOrderDetails theme={theme} />
                  </ProtectedRoute>
                }
              />

              {/* ================= PAYMENT ================= */}
              <Route
                path="/pay/:id"
                element={
                  <ProtectedRoute>
                    <PaymentPage theme={theme} />
                  </ProtectedRoute>
                }
              />

              {/* ================= ADMIN ================= */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard theme={theme} />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts theme={theme} />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/create-product"
                element={
                  <AdminRoute>
                    <CreateProduct theme={theme} />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/edit-product/:id"
                element={
                  <AdminRoute>
                    <AdminEditProduct theme={theme} />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders theme={theme} />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/orders/:id"
                element={
                  <AdminRoute>
                    <AdminOrderDetails theme={theme} />
                  </AdminRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
