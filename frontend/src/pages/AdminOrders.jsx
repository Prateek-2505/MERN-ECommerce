import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

const STATUSES = [
  "",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

const AdminOrders = ({ theme }) => {
  const isDark = theme === "dark";
  const { token } = useAuth();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const status =
    searchParams.get("status") || "";

  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] =
    useState(1);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders(
          token,
          page,
          status
        );
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch {
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, page, status]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className={isDark ? "text-slate-300" : "text-slate-700"}>
          Loading orders…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ================= HEADER ================= */}
      <h1
        className={`text-2xl font-bold mb-6 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Manage Orders
      </h1>

      {/* ================= STATUS FILTER ================= */}
      <div className="mb-6">
        <select
          value={status}
          onChange={(e) =>
            setSearchParams({
              page: 1,
              status: e.target.value,
            })
          }
          className={`p-2 rounded-md border
            ${
              isDark
                ? "bg-slate-800 border-slate-600 text-white"
                : "bg-white border-slate-300 text-black"
            }`}
        >
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* ================= EMPTY ================= */}
      {orders.length === 0 ? (
        <p className={isDark ? "text-slate-400" : "text-slate-600"}>
          No orders found
        </p>
      ) : (
        <>
          {/* ================= TABLE ================= */}
          <div
            className={`overflow-x-auto rounded-xl border
              ${
                isDark
                  ? "border-slate-700 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
          >
            <table className="w-full text-sm">
              <thead
                className={
                  isDark
                    ? "bg-slate-800 text-slate-200"
                    : "bg-slate-100 text-slate-800"
                }
              >
                <tr>
                  <th className="p-3 text-left">
                    Order ID
                  </th>
                  <th className="p-3 text-left">
                    User
                  </th>
                  <th className="p-3 text-left">
                    Total
                  </th>
                  <th className="p-3 text-left">
                    Payment
                  </th>
                  <th className="p-3 text-left">
                    Status
                  </th>
                  <th className="p-3 text-left">
                    Date
                  </th>
                  <th className="p-3 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`border-t
                      ${
                        isDark
                          ? "border-slate-700"
                          : "border-slate-200"
                      }`}
                  >
                    <td className="p-3">
                      {order._id.slice(-6)}
                    </td>

                    <td className="p-3">
                      {order.user?.email || "N/A"}
                    </td>

                    <td className="p-3">
                      ₹ {order.totalPrice}
                    </td>

                    {/* PAYMENT */}
                    <td className="p-3">
                      {order.isPaid ? (
                        <span
                          className={`font-semibold ${
                            isDark
                              ? "text-green-400"
                              : "text-green-700"
                          }`}
                        >
                          Paid
                        </span>
                      ) : (
                        <span
                          className={`font-semibold ${
                            isDark
                              ? "text-red-400"
                              : "text-red-600"
                          }`}
                        >
                          Unpaid
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      {order.status}
                    </td>

                    <td className="p-3">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className={`font-medium underline
                          ${
                            isDark
                              ? "text-blue-400"
                              : "text-blue-600"
                          }`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((p) => (
              <button
                key={p}
                onClick={() =>
                  setSearchParams({
                    page: p,
                    status,
                  })
                }
                className={`px-3 py-1 rounded-md border font-medium transition
                  ${
                    p === page
                      ? isDark
                        ? "bg-white text-black"
                        : "bg-slate-900 text-white"
                      : isDark
                      ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                      : "border-slate-300 text-slate-900 hover:bg-slate-100"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
