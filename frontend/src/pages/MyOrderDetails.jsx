import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getMyOrderById, deleteOrder } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import OrderTimeline from "../components/OrderTimeline";

const MyOrderDetails = ({ theme }) => {
  const isDark = theme === "dark";

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getMyOrderById(id, token);
      setOrder(data.order);
      setLoading(false);
    };
    fetchOrder();
  }, [id, token]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className={isDark ? "text-slate-300" : "text-slate-700"}>
          Loading…
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">
          Order not found
        </p>
      </div>
    );
  }

  const isShippedOrDelivered =
    order.status === "Shipped" ||
    order.status === "Delivered";

  /* ================= ACTIONS ================= */
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure? This order will be cancelled."
    );
    if (!confirm) return;

    await deleteOrder(order._id, token);
    navigate("/my-orders");
  };

  const handlePayment = () => {
    navigate(`/pay/${order._id}`);
  };

  /* ================= INVOICE DOWNLOAD ================= */
  const downloadInvoice = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/invoice/${order._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `invoice-${order._id}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to download invoice"
      );
    }
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
        paidAt={order.paidAt}
      />

      {/* ================= SUMMARY ================= */}
      <div
        className={`mt-6 rounded-xl border p-5 mb-8
          ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
      >
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Payment:</strong>{" "}
          {order.isPaid
            ? `Paid on ${new Date(
                order.paidAt
              ).toLocaleString()}`
            : "Pending"}
        </p>
        <p>
          <strong>Total:</strong> ₹ {order.totalPrice}
        </p>
        <p>
          <strong>Placed On:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* ================= PAYMENT / INVOICE ================= */}
      <div className="mb-8 flex flex-wrap gap-4">
        {!order.isPaid && (
          <button
            onClick={handlePayment}
            className={`px-4 py-2 rounded-lg font-semibold transition
              ${
                isDark
                  ? "bg-green-400 text-black hover:opacity-90"
                  : "bg-green-600 text-white hover:opacity-90"
              }`}
          >
            Pay Now
          </button>
        )}

        {order.isPaid && (
          <button
            onClick={downloadInvoice}
            className={`px-4 py-2 rounded-lg font-semibold transition
              ${
                isDark
                  ? "bg-blue-400 text-black hover:opacity-90"
                  : "bg-blue-600 text-white hover:opacity-90"
              }`}
          >
            Download Invoice (PDF)
          </button>
        )}
      </div>

      {/* ================= CANCEL ================= */}
      {!isShippedOrDelivered ? (
        <button
          onClick={handleDelete}
          className={`mb-8 px-4 py-2 rounded-lg font-semibold transition
            ${
              isDark
                ? "bg-red-400 text-black hover:opacity-90"
                : "bg-red-600 text-white hover:opacity-90"
            }`}
        >
          Cancel Order
        </button>
      ) : (
        <p
          className={`mb-8 font-medium ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          This order can no longer be cancelled.
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
        className={`rounded-xl border
          ${
            isDark
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
      >
        {order.orderItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex justify-between px-5 py-3
              ${
                idx !== order.orderItems.length - 1
                  ? isDark
                    ? "border-b border-slate-700"
                    : "border-b border-slate-200"
                  : ""
              }`}
          >
            <div>
              <p className="font-medium">
                {item.name}
              </p>
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
        ))}
      </div>
    </div>
  );
};

export default MyOrderDetails;
