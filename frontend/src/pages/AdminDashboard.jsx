import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Product */}
        <Link
          to="/admin/create-product"
          className="bg-white p-6 rounded shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Create Product
          </h2>
          <p className="text-gray-600">
            Add new products to the store
          </p>
        </Link>

        {/* View Products */}
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Manage Products
          </h2>
          <p className="text-gray-600">
            View, edit or delete products
          </p>
        </Link>

        {/* Future */}
        <div className="bg-white p-6 rounded shadow opacity-60">
          <h2 className="text-xl font-semibold mb-2">
            Orders
          </h2>
          <p className="text-gray-600">
            Coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
