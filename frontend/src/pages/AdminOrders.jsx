import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getAllOrders(token);
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

      {/* ACTIVE */}
      <h2 className="text-xl font-semibold mb-3">Active Orders</h2>
      {activeOrders.map((order) => (
        <Link
          key={order._id}
          to={`/admin/orders/${order._id}`}
          className="block border p-4 rounded mb-3 hover:shadow"
        >
          <p><strong>ID:</strong> {order._id}</p>
          <p><strong>User:</strong> {order.user?.email}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </Link>
      ))}

      {/* COMPLETED */}
      <h2 className="text-xl font-semibold mt-8 mb-3">
        Completed Orders
      </h2>
      {completedOrders.map((order) => (
        <div
          key={order._id}
          className="block border p-4 rounded mb-3 bg-gray-100"
        >
          <p><strong>ID:</strong> {order._id}</p>
          <p><strong>User:</strong> {order.user?.email}</p>
          <p><strong>Status:</strong> Delivered</p>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
