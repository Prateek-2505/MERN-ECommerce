import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/products"
          className="border p-6 rounded hover:shadow transition"
        >
          <h2 className="text-xl font-semibold">Manage Products</h2>
          <p className="text-gray-600 mt-2">
            View, edit, and delete products
          </p>
        </Link>

        <Link
          to="/admin/create-product"
          className="border p-6 rounded hover:shadow transition"
        >
          <h2 className="text-xl font-semibold">Add Product</h2>
          <p className="text-gray-600 mt-2">
            Create a new product
          </p>
        </Link>

        <Link
          to="/admin/orders"
          className="border p-6 rounded hover:shadow transition"
        >
          <h2 className="text-xl font-semibold">Manage Orders</h2>
          <p className="text-gray-600 mt-2">
            View and update customer orders
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
