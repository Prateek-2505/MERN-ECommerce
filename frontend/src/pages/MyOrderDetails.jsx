import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyOrderById } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import OrderTimeline from "../components/OrderTimeline";
import PaymentStatusBadge from "../components/PaymentStatusBadge";

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Order Details</h1>

      <OrderTimeline currentStatus={order.status} />

      <div className="border p-4 rounded mb-6 space-y-2">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Total:</strong> ₹ {order.totalPrice}</p>
        <p className="flex items-center gap-2">
          <strong>Payment:</strong>
          <PaymentStatusBadge isPaid={order.isPaid} />
        </p>
      </div>

      {!order.isPaid && (
        <button
          onClick={() => navigate(`/pay/${order._id}`)}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Pay Now
        </button>
      )}

      <h2 className="text-xl font-semibold mb-2">Items</h2>

      {order.orderItems.map((item, idx) => (
        <div key={idx} className="flex justify-between border-b py-2">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">
              ₹ {item.price} × {item.qty}
            </p>
          </div>

          <p className="font-semibold">₹ {item.price * item.qty}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrderDetails;
