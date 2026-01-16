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

const FALLBACK_IMAGE =
  "https://via.placeholder.com/80x80?text=No+Image";

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
        <p
          className={
            isDark ? "text-slate-300" : "text-slate-700"
          }
        >
          Loading…
        </p>
      </div>
    );
  }

  const addr = order.shippingAddress;
  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
  const isDelivered = order.status === "Delivered";
  const isUnpaid = !order.isPaid;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) return;
    await updateOrderStatus(id, newStatus, token);
    fetchOrder();
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this order?");
    if (!confirm) return;
    await deleteOrder(id, token);
    navigate("/admin/orders");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1
        className={`text-2xl font-bold mb-4 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Order Details
      </h1>

      <OrderTimeline
        currentStatus={order.status}
        isPaid={order.isPaid}
      />

      {/* ================= SHIPPING ADDRESS ================= */}
      {addr && (
        <div
          className={`mt-6 rounded-xl border p-5 mb-6 text-sm ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-200"
              : "bg-slate-50 border-slate-300 text-slate-700"
          }`}
        >
          <p className="font-semibold mb-2">
            Shipping Address
          </p>
          <p>{addr.fullName}</p>
          <p>{addr.phone}</p>
          <p>
            {addr.addressLine1}
            {addr.addressLine2
              ? `, ${addr.addressLine2}`
              : ""}
          </p>
          <p>
            {addr.city}, {addr.state} {addr.postalCode}
          </p>
          <p>{addr.country}</p>
        </div>
      )}

      {/* ================= SUMMARY ================= */}
      <div
        className={`rounded-xl border p-5 mb-6 ${
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

      {isUnpaid && (
        <div
          className={`mb-6 p-4 rounded-lg border font-medium ${
            isDark
              ? "border-red-400 text-red-300 bg-slate-800"
              : "border-red-500 text-red-600 bg-red-50"
          }`}
        >
          ⚠️ This order is unpaid. Shipping and delivery
          are disabled until payment is completed.
        </div>
      )}

      {!isDelivered ? (
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={order.status}
            onChange={(e) =>
              handleStatusChange(e.target.value)
            }
            className={`p-2 rounded-md border ${
              isDark
                ? "bg-slate-800 border-slate-600 text-white"
                : "bg-white border-slate-300 text-black"
            }`}
          >
            {STATUS_FLOW.map((status, index) => {
              const isBackward =
                index < currentStatusIndex;
              const isBlocked =
                isUnpaid &&
                (status === "Shipped" ||
                  status === "Delivered");

              return (
                <option
                  key={status}
                  value={status}
                  disabled={isBackward || isBlocked}
                >
                  {status}
                </option>
              );
            })}
          </select>

          <button
            onClick={handleDelete}
            className={`px-4 py-2 rounded-lg font-semibold ${
              isDark
                ? "bg-red-400 text-black"
                : "bg-red-600 text-white"
            }`}
          >
            Delete Order
          </button>
        </div>
      ) : (
        <p
          className={`mt-4 mb-8 font-semibold ${
            isDark ? "text-green-400" : "text-green-700"
          }`}
        >
          Completed orders cannot be modified
        </p>
      )}

      {/* ================= ITEMS ================= */}
      <h2
        className={`text-xl font-semibold mb-3 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Items
      </h2>

      <div
        className={`rounded-xl border divide-y ${
          isDark
            ? "border-slate-700 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        {order.orderItems.map((item, idx) => {
          const name =
            item.name ||
            item.product?.name ||
            "Product unavailable";

          return (
            <div
              key={idx}
              className="flex items-center gap-4 px-5 py-3"
            >
              <img
                src={item.image || FALLBACK_IMAGE}
                onError={(e) =>
                  (e.currentTarget.src =
                    FALLBACK_IMAGE)
                }
                className="w-16 h-16 object-cover rounded"
              />

              <div className="flex-1">
                <p className="font-medium">{name}</p>
                <p
                  className={`text-sm ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-600"
                  }`}
                >
                  ₹ {item.price} × {item.qty}
                </p>
              </div>

              <p className="font-semibold">
                ₹ {item.price * item.qty}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrderDetails;
