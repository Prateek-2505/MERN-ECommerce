import { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "../api/productApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(id, token);
      fetchProducts(); // refresh list
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Products</h1>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="border p-2">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-16 mx-auto"
                />
              </td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">₹ {p.price}</td>
              <td className="border p-2">{p.stock}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => navigate(`/admin/edit-product/${p._id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
