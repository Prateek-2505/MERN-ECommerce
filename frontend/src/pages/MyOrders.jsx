import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

const MyOrders = ({ theme }) => {
  const isDark = theme === "dark";
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getMyOrders(token);
      setOrders(data.orders);
    };

    fetchOrders();
  }, [token]);

  const activeOrders = orders.filter(
    (o) => o.status !== "Delivered"
  );
  const completedOrders = orders.filter(
    (o) => o.status === "Delivered"
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ================= TITLE ================= */}
      <h1
        className={`text-2xl font-bold mb-8 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        My Orders
      </h1>

      {/* ================= ACTIVE ORDERS ================= */}
      <h2
        className={`text-lg font-semibold mb-3 ${
          isDark ? "text-slate-200" : "text-slate-800"
        }`}
      >
        Active Orders
      </h2>

      {activeOrders.length === 0 ? (
        <p
          className={`mb-6 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
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
                    ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    Order ID: {order._id.slice(-6)}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark
                        ? "text-slate-300"
                        : "text-slate-600"
                    }`}
                  >
                    Total: ₹ {order.totalPrice}
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full
                    ${
                      isDark
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
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
        <p
          className={`${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          No completed orders
        </p>
      ) : (
        <div className="space-y-3">
          {completedOrders.map((order) => (
            <div
              key={order._id}
              className={`rounded-xl border p-4
                ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-slate-100"
                    : "bg-slate-100 border-slate-200 text-slate-900"
                }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    Order ID: {order._id.slice(-6)}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark
                        ? "text-slate-300"
                        : "text-slate-600"
                    }`}
                  >
                    Total: ₹ {order.totalPrice}
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full
                    ${
                      isDark
                        ? "bg-green-400/10 text-green-400"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  Delivered
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
