import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api/productApi";
import { useCart } from "../context/CartContext";

const ProductDetails = ({ theme }) => {
  const isDark = theme === "dark";

  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data.product);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className={isDark ? "text-slate-200" : "text-slate-700"}>
          Loading product…
        </p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">
          {error || "Product not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 rounded-2xl border shadow-sm p-6
          ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
      >
        {/* ================= IMAGE ================= */}
        <div className="flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-[420px] object-cover rounded-xl"
          />
        </div>

        {/* ================= DETAILS ================= */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          <p
            className={`text-2xl font-semibold ${
              isDark ? "text-slate-200" : "text-slate-800"
            }`}
          >
            ₹ {product.price}
          </p>

          <p
            className={`leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {product.description}
          </p>

          <p
            className={`text-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Category:{" "}
            <span className="font-medium">
              {product.category}
            </span>
          </p>

          {/* ================= STOCK ================= */}
          {product.stock > 0 ? (
            <p
              className={`font-semibold ${
                isDark ? "text-green-400" : "text-green-600"
              }`}
            >
              In Stock ({product.stock})
            </p>
          ) : (
            <p
              className={`font-semibold ${
                isDark ? "text-red-400" : "text-red-600"
              }`}
            >
              Out of Stock
            </p>
          )}

          {/* ================= QUANTITY ================= */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3">
              <label className="font-medium">
                Qty:
              </label>

              <select
                value={qty}
                onChange={(e) =>
                  setQty(Number(e.target.value))
                }
                className={`p-2 rounded-md border
                  ${
                    isDark
                      ? "bg-slate-800 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-black"
                  }`}
              >
                {[...Array(product.stock).keys()].map(
                  (x) => (
                    <option
                      key={x + 1}
                      value={x + 1}
                    >
                      {x + 1}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {/* ================= ADD TO CART ================= */}
          <button
            disabled={product.stock === 0}
            onClick={() =>
              addToCart(product, qty)
            }
            className={`mt-6 px-6 py-3 rounded-lg font-semibold transition
              ${
                product.stock === 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : isDark
                  ? "bg-white text-black hover:opacity-90"
                  : "bg-slate-900 text-white hover:opacity-90"
              }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
