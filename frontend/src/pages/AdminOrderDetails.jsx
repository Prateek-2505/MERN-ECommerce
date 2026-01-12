import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import OrderTimeline from "../components/OrderTimeline";

const AdminOrderDetails = () => {
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

  if (error) return <p className="p-6">{error}</p>;
  if (!order) return <p className="p-6">Loading...</p>;

  const isDelivered = order.status === "Delivered";
  const isUnpaid = !order.isPaid;

  const handleStatusChange = async (newStatus) => {
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        Order Details
      </h1>

      {/* ✅ PAYMENT-AWARE TIMELINE */}
      <OrderTimeline
        currentStatus={order.status}
        isPaid={order.isPaid}
      />

      <div className="border p-4 rounded mb-4">
        <p>
          <strong>User:</strong>{" "}
          {order.user?.email}
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

      {/* ⚠️ UNPAID WARNING */}
      {isUnpaid && (
        <p className="mb-4 text-red-600 font-semibold">
          ⚠️ This order is unpaid. Shipping and delivery
          are disabled until payment is completed.
        </p>
      )}

      {!isDelivered && (
        <>
          <select
            value={order.status}
            onChange={(e) =>
              handleStatusChange(e.target.value)
            }
            className="border p-2 mt-2"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">
              Processing
            </option>

            {/* 🚫 DISABLED WHEN UNPAID */}
            <option
              value="Shipped"
              disabled={isUnpaid}
            >
              Shipped
            </option>
            <option
              value="Delivered"
              disabled={isUnpaid}
            >
              Delivered
            </option>
          </select>

          <button
            onClick={async () => {
              const confirm = window.confirm(
                "Delete this order?"
              );
              if (!confirm) return;
              await deleteOrder(id, token);
              navigate("/admin/orders");
            }}
            className="mt-4 ml-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Order
          </button>
        </>
      )}

      {isDelivered && (
        <p className="mt-4 text-green-700 font-semibold">
          Completed orders cannot be modified
        </p>
      )}
    </div>
  );
};

export default AdminOrderDetails;
