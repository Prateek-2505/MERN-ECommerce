import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import OrderTimeline from "../components/OrderTimeline";

const STATUS_FLOW = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

const AdminOrderDetails = ({ theme }) => {
  const isDark = theme === "dark";

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(id, token);
      setOrder(data.order);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch order"
      );
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  /* ================= STATES ================= */
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">
          {error}
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className={isDark ? "text-slate-300" : "text-slate-700"}>
          Loading…
        </p>
      </div>
    );
  }

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
  const isDelivered = order.status === "Delivered";
  const isUnpaid = !order.isPaid;

  /* ================= STATUS UPDATE ================= */
  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) return;

    try {
      await updateOrderStatus(id, newStatus, token);
      fetchOrder();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Status update failed"
      );
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Delete this order?"
    );
    if (!confirm) return;

    await deleteOrder(id, token);
    navigate("/admin/orders");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ================= HEADER ================= */}
      <h1
        className={`text-2xl font-bold mb-4 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Order Details
      </h1>

      {/* ================= TIMELINE ================= */}
      <OrderTimeline
        currentStatus={order.status}
        isPaid={order.isPaid}
      />

      {/* ================= SUMMARY ================= */}
      <div
        className={`mt-6 rounded-xl border p-5 mb-6
          ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
      >
        <p>
          <strong>User:</strong>{" "}
          {order.user?.email || "N/A"}
        </p>
        <p>
          <strong>Total:</strong> ₹ {order.totalPrice}
        </p>
        <p>
          <strong>Payment:</strong>{" "}
          {order.isPaid ? "Paid" : "Pending"}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
      </div>

      {/* ================= UNPAID WARNING ================= */}
      {isUnpaid && (
        <div
          className={`mb-6 p-4 rounded-lg border font-medium
            ${
              isDark
                ? "border-red-400 text-red-300 bg-slate-800"
                : "border-red-500 text-red-600 bg-red-50"
            }`}
        >
          ⚠️ This order is unpaid. Shipping and delivery
          are disabled until payment is completed.
        </div>
      )}

      {/* ================= ACTIONS ================= */}
      {!isDelivered ? (
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={order.status}
            onChange={(e) =>
              handleStatusChange(e.target.value)
            }
            className={`p-2 rounded-md border
              ${
                isDark
                  ? "bg-slate-800 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-black"
              }`}
          >
            {STATUS_FLOW.map((status, index) => {
              const isBackward =
                index < currentStatusIndex;

              const isBlockedByPayment =
                isUnpaid &&
                (status === "Shipped" ||
                  status === "Delivered");

              return (
                <option
                  key={status}
                  value={status}
                  disabled={
                    isBackward || isBlockedByPayment
                  }
                >
                  {status}
                </option>
              );
            })}
          </select>

          <button
            onClick={handleDelete}
            className={`px-4 py-2 rounded-lg font-semibold transition
              ${
                isDark
                  ? "bg-red-400 text-black hover:opacity-90"
                  : "bg-red-600 text-white hover:opacity-90"
              }`}
          >
            Delete Order
          </button>
        </div>
      ) : (
        <p
          className={`mt-4 font-semibold ${
            isDark ? "text-green-400" : "text-green-700"
          }`}
        >
          Completed orders cannot be modified
        </p>
      )}
    </div>
  );
};

export default AdminOrderDetails;
