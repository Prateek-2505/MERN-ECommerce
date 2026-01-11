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

  const fetchOrder = async () => {
    const data = await getOrderById(id, token);
    setOrder(data.order);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) return <p className="p-6">Loading...</p>;

  const isDelivered = order.status === "Delivered";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Order Details</h1>

      {/* TIMELINE */}
      <OrderTimeline currentStatus={order.status} />

      <p><strong>User:</strong> {order.user?.email}</p>
      <p><strong>Total:</strong> ₹ {order.totalPrice}</p>
      <p><strong>Status:</strong> {order.status}</p>

      {!isDelivered && (
        <>
          <select
            value={order.status}
            onChange={(e) =>
              updateOrderStatus(id, e.target.value, token).then(fetchOrder)
            }
            className="border p-2 mt-4"
          >
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>

          <button
            onClick={async () => {
              const confirm = window.confirm("Delete this order?");
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
