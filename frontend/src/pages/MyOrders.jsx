import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

const MyOrders = ({ theme }) => {
  const isDark = theme === "dark";
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getMyOrders(token);
      setOrders(data.orders);
    };
    fetchOrders();
  }, [token]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order._id
          .slice(-6)
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ||
        order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const activeOrders = filteredOrders.filter(
    (o) => o.status !== "Delivered"
  );
  const completedOrders = filteredOrders.filter(
    (o) => o.status === "Delivered"
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* ================= HEADER ================= */}
      <h1
        className={`text-2xl font-bold mb-6 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        My Orders
      </h1>

      {/* ================= SEARCH + FILTER ================= */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full sm:w-2/3 px-4 py-2 rounded-lg border outline-none
            ${
              isDark
                ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`w-full sm:w-1/3 px-3 py-2 rounded-lg border
            ${
              isDark
                ? "bg-slate-800 border-slate-600 text-white"
                : "bg-white border-slate-300 text-black"
            }`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* ================= ACTIVE ORDERS ================= */}
      <h2
        className={`text-lg font-semibold mb-3 ${
          isDark ? "text-slate-200" : "text-slate-800"
        }`}
      >
        Active Orders
      </h2>

      {activeOrders.length === 0 ? (
        <p className={isDark ? "text-slate-400" : "text-slate-600"}>
          No active orders
        </p>
      ) : (
        <div className="space-y-3 mb-8">
          {activeOrders.map((order) => (
            <Link
              key={order._id}
              to={`/my-orders/${order._id}`}
              className={`block rounded-xl border p-4 transition
                ${
                  isDark
                    ? "bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-100"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900"
                }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    Order ID: {order._id.slice(-6)}
                  </p>
                  <p className="text-sm opacity-80">
                    ₹ {order.totalPrice}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ================= COMPLETED ORDERS ================= */}
      <h2
        className={`text-lg font-semibold mb-3 ${
          isDark ? "text-slate-200" : "text-slate-800"
        }`}
      >
        Completed Orders
      </h2>

      {completedOrders.length === 0 ? (
        <p className={isDark ? "text-slate-400" : "text-slate-600"}>
          No completed orders
        </p>
      ) : (
        <div className="space-y-3">
          {completedOrders.map((order) => (
            <Link
              key={order._id}
              to={`/my-orders/${order._id}`}
              className={`block rounded-xl border p-4 transition
                ${
                  isDark
                    ? "bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-100"
                    : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-900"
                }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    Order ID: {order._id.slice(-6)}
                  </p>
                  <p className="text-sm opacity-80">
                    ₹ {order.totalPrice}
                  </p>
                </div>
                <span className="font-semibold text-green-500">
                  Delivered
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
