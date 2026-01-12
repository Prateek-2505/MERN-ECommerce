import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllOrders } from "../api/orderApi";
import { getProducts } from "../api/productApi";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = ({ theme }) => {
  const isDark = theme === "dark";
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // 1️⃣ PRODUCTS COUNT
        const productsData = await getProducts(1);
        const productsCount =
          productsData.products?.length || 0;

        // 2️⃣ ORDERS + REVENUE
        const ordersData = await getAllOrders(
          token,
          1,
          ""
        );

        const orders = ordersData.orders || [];

        const revenue = orders
          .filter((o) => o.isPaid)
          .reduce(
            (sum, o) => sum + o.totalPrice,
            0
          );

        setStats({
          products: productsCount,
          orders: orders.length,
          revenue,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  /* ================= SKELETON ================= */
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-60 mb-8 rounded bg-slate-300/30 animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`h-20 rounded-xl animate-pulse ${
                isDark ? "bg-slate-800" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`h-28 rounded-xl animate-pulse ${
                isDark ? "bg-slate-800" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ================= HEADER ================= */}
      <h1
        className={`text-2xl font-bold mb-8 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Admin Dashboard
      </h1>

      {/* ================= REAL STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div
          className={`rounded-xl border p-4 text-center
            ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-100"
                : "bg-white border-slate-200 text-slate-900"
            }`}
        >
          <p className="text-sm opacity-70">
            Products
          </p>
          <p className="text-xl font-bold mt-1">
            {stats.products}
          </p>
        </div>

        <div
          className={`rounded-xl border p-4 text-center
            ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-100"
                : "bg-white border-slate-200 text-slate-900"
            }`}
        >
          <p className="text-sm opacity-70">
            Orders
          </p>
          <p className="text-xl font-bold mt-1">
            {stats.orders}
          </p>
        </div>

        <div
          className={`rounded-xl border p-4 text-center
            ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-100"
                : "bg-white border-slate-200 text-slate-900"
            }`}
        >
          <p className="text-sm opacity-70">
            Revenue
          </p>
          <p className="text-xl font-bold mt-1">
            ₹ {stats.revenue}
          </p>
        </div>
      </div>

      {/* ================= ACTION CARDS ================= */}
      <div className="space-y-6">
        <Link
          to="/admin/products"
          className={`flex items-center justify-between rounded-xl border p-6 transition
            ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
            }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">📦</span>
            <div>
              <h2 className="text-lg font-semibold">
                Manage Products
              </h2>
              <p className="text-sm opacity-70">
                View, edit, and delete products
              </p>
            </div>
          </div>
          <span className="text-xl opacity-60">
            →
          </span>
        </Link>

        <Link
          to="/admin/create-product"
          className={`flex items-center justify-between rounded-xl border p-6 transition
            ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
            }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">➕</span>
            <div>
              <h2 className="text-lg font-semibold">
                Add New Product
              </h2>
              <p className="text-sm opacity-70">
                Create and publish a new product
              </p>
            </div>
          </div>
          <span className="text-xl opacity-60">
            →
          </span>
        </Link>

        <Link
          to="/admin/orders"
          className={`flex items-center justify-between rounded-xl border p-6 transition
            ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
            }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🧾</span>
            <div>
              <h2 className="text-lg font-semibold">
                Manage Orders
              </h2>
              <p className="text-sm opacity-70">
                Process, ship, and complete orders
              </p>
            </div>
          </div>
          <span className="text-xl opacity-60">
            →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
