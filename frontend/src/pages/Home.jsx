import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/productApi";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSearch = searchParams.get("search") || "";

  const [input, setInput] = useState(activeSearch);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(1, activeSearch);
        setProducts(data.products);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(
      input.trim()
        ? { search: input.trim() }
        : {}
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading products...
        </p>
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
      {/* 🔍 SEARCH BAR (SUBMIT ONLY) */}
      <form
        onSubmit={handleSearchSubmit}
        className="max-w-3xl mx-auto mb-6 bg-white p-4 rounded shadow flex gap-2"
      >
        <input
          type="text"
          placeholder="Search products by name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 p-3 rounded text-lg focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          type="submit"
          className="bg-black text-white px-6 rounded"
        >
          Search
        </button>
      </form>

      <h1 className="text-3xl font-bold mb-6 text-center">
        Latest Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">
          No products found
        </p>
      ) : (
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
      )}
    </div>
  );
};

export default Home;
