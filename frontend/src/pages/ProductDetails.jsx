import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api/productApi";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data.product);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || "Product not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded"
        />

        {/* Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-xl text-gray-700">
            ₹ {product.price}
          </p>

          <p className="text-gray-600">
            {product.description}
          </p>

          <p className="text-sm text-gray-500">
            Category: <span className="font-medium">{product.category}</span>
          </p>

          {product.stock > 0 ? (
            <p className="text-green-600 font-semibold">
              In Stock ({product.stock})
            </p>
          ) : (
            <p className="text-red-600 font-semibold">
              Out of Stock
            </p>
          )}

          {/* Future buttons */}
          <button
            disabled={product.stock === 0}
            className="mt-4 bg-black text-white px-6 py-2 rounded disabled:bg-gray-400"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
