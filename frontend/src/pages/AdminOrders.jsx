import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

const STATUSES = [
  "",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

const AdminOrders = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] =
    useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const status =
    searchParams.get("status") || "";

  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] =
    useState(1);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders(
          token,
          page,
          status
        );
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch {
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, page, status]);

  if (loading)
    return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Manage Orders
      </h1>

      {/* 🔍 STATUS FILTER */}
      <div className="mb-4">
        <select
          value={status}
          onChange={(e) =>
            setSearchParams({
              page: 1,
              status: e.target.value,
            })
          }
          className="border p-2"
        >
          <option value="">
            All Statuses
          </option>
          {STATUSES.filter(Boolean).map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
      </div>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">
                    Order ID
                  </th>
                  <th className="border p-2">
                    User
                  </th>
                  <th className="border p-2">
                    Total
                  </th>
                  <th className="border p-2">
                    Payment
                  </th>
                  <th className="border p-2">
                    Status
                  </th>
                  <th className="border p-2">
                    Date
                  </th>
                  <th className="border p-2">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="text-center"
                  >
                    <td className="border p-2">
                      {order._id.slice(-6)}
                    </td>

                    <td className="border p-2">
                      {order.user?.email ||
                        "N/A"}
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
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
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

          {/* 📄 PAGINATION */}
          <div className="flex gap-2 mt-6">
            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((p) => (
              <button
                key={p}
                onClick={() =>
                  setSearchParams({
                    page: p,
                    status,
                  })
                }
                className={`px-3 py-1 border rounded ${
                  p === page
                    ? "bg-black text-white"
                    : ""
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
