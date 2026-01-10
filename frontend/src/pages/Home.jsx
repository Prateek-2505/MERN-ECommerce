import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Latest Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover rounded-t-lg"
            />

            <div className="p-4 space-y-2">
              <h2 className="font-semibold text-lg">
                {product.name}
              </h2>

              <p className="text-gray-600">
                ₹ {product.price}
              </p>

              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  In Stock ({product.stock})
                </p>
              ) : (
                <p className="text-red-600 font-medium">
                  Out of Stock
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
