import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/productApi";

const Home = ({ theme }) => {
  const isDark = theme === "dark";

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
      input.trim() ? { search: input.trim() } : {}
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className={isDark ? "text-slate-200" : "text-slate-700"}>
          Loading products…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 🔍 SEARCH BAR */}
      <form
        onSubmit={handleSearchSubmit}
        className={`max-w-3xl mx-auto mb-10 flex gap-2 p-4 rounded-xl border shadow-sm
          ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
      >
        <input
          type="text"
          placeholder="Search products by name…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-1 p-3 rounded-md border focus:outline-none focus:ring-2
            ${
              isDark
                ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500"
                : "bg-white border-slate-300 text-black placeholder-slate-500 focus:ring-blue-500"
            }`}
        />

        <button
          type="submit"
          className={`px-6 rounded-md font-medium transition
            ${
              isDark
                ? "bg-white text-black"
                : "bg-slate-900 text-white"
            }`}
        >
          Search
        </button>
      </form>

      <h1
        className={`text-3xl font-bold mb-8 text-center ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Latest Products
      </h1>

      {products.length === 0 ? (
        <p className={isDark ? "text-slate-400 text-center" : "text-slate-600 text-center"}>
          No products seen
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className={`rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden
                ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-slate-100"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-lg truncate">
                  {product.name}
                </h2>

                <p className={isDark ? "text-slate-200" : "text-slate-900"}>
                  ₹ {product.price}
                </p>

                {product.stock > 0 ? (
                  <p className={isDark ? "text-green-400 text-sm" : "text-green-600 text-sm"}>
                    In Stock ({product.stock})
                  </p>
                ) : (
                  <p className={isDark ? "text-red-400 text-sm" : "text-red-600 text-sm"}>
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
