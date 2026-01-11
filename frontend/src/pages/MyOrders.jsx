import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getMyOrders(token);
      setOrders(data.orders);
    };
    fetchOrders();
  }, [token]);

  const active = orders.filter(o => o.status !== "Delivered");
  const completed = orders.filter(o => o.status === "Delivered");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <h2 className="text-lg font-semibold mb-2">Active Orders</h2>
      {active.map(order => (
        <Link
          key={order._id}
          to={`/my-orders/${order._id}`}
          className="block border p-4 mb-3 rounded"
        >
          <p>Status: {order.status}</p>
          <p>Total: ₹ {order.totalPrice}</p>
        </Link>
      ))}

      <h2 className="text-lg font-semibold mt-6 mb-2">
        Completed Orders
      </h2>
      {completed.map(order => (
        <div
          key={order._id}
          className="border p-4 mb-3 rounded bg-gray-100"
        >
          <p>Status: Delivered</p>
          <p>Total: ₹ {order.totalPrice}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
