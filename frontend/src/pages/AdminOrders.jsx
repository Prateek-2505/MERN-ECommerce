import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders(token);
        setOrders(data.orders);
      } catch (error) {
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Manage Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Payment</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border p-2">
                    {order._id.slice(-6)}
                  </td>

                  <td className="border p-2">
                    {order.user?.email || "N/A"}
                  </td>

                  <td className="border p-2">
                    ₹ {order.totalPrice}
                  </td>

                  {/* ✅ PAYMENT STATUS */}
                  <td className="border p-2">
                    {order.isPaid ? (
                      <span className="text-green-700 font-semibold">
                        Paid
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Unpaid
                      </span>
                    )}
                  </td>

                  <td className="border p-2">
                    {order.status}
                  </td>

                  <td className="border p-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="border p-2">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-blue-600 underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
