import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getMyOrderById, deleteOrder } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import OrderTimeline from "../components/OrderTimeline";

const MyOrderDetails = () => {
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  const isShippedOrDelivered =
    order.status === "Shipped" ||
    order.status === "Delivered";

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

  // ✅ CORRECT INVOICE DOWNLOAD (AUTH SAFE)
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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        Order Details
      </h1>

      <OrderTimeline
        currentStatus={order.status}
        isPaid={order.isPaid}
        paidAt={order.paidAt}
      />

      <div className="border p-4 rounded mb-6">
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

      {/* 💳 PAYMENT / INVOICE ACTIONS */}
      <div className="mb-6 flex gap-4">
        {!order.isPaid && (
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Pay Now
          </button>
        )}

        {order.isPaid && (
          <button
            onClick={downloadInvoice}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download Invoice (PDF)
          </button>
        )}
      </div>

      {/* ❌ DELETE BLOCKED WHEN SHIPPED */}
      {!isShippedOrDelivered ? (
        <button
          onClick={handleDelete}
          className="mb-6 bg-red-600 text-white px-4 py-2 rounded"
        >
          Cancel Order
        </button>
      ) : (
        <p className="mb-6 text-gray-500 font-medium">
          This order can no longer be cancelled.
        </p>
      )}

      <h2 className="text-xl font-semibold mb-2">
        Items
      </h2>

      {order.orderItems.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between border-b py-2"
        >
          <div>
            <p className="font-medium">
              {item.name}
            </p>
            <p className="text-sm text-gray-600">
              ₹ {item.price} × {item.qty}
            </p>
          </div>

          <p className="font-semibold">
            ₹ {item.price * item.qty}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyOrderDetails;
