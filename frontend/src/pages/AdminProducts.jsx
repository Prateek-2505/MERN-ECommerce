import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../api/productApi";
import { useAuth } from "../context/AuthContext";

const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data.products);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id, token);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="grid gap-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{p.name}</h2>
              <p>₹{p.price}</p>
            </div>

            <button
              onClick={() => handleDelete(p._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
