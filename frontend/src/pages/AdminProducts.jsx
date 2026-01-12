import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  deleteProduct,
  getProducts,
} from "../api/productApi";
import { useAuth } from "../context/AuthContext";

const AdminProducts = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] =
    useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search =
    searchParams.get("search") || "";
  const category =
    searchParams.get("category") || "";

  const [products, setProducts] =
    useState([]);
  const [totalPages, setTotalPages] =
    useState(1);
  const [loading, setLoading] =
    useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getProducts(
        page,
        search,
        category
      );
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch {
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, category]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );
    if (!confirmDelete) return;

    await deleteProduct(id, token);
    fetchProducts();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Admin Products
      </h1>

      {/* 🔍 SEARCH + CATEGORY */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) =>
            setSearchParams({
              page: 1,
              search: e.target.value,
              category,
            })
          }
          className="border p-2 w-1/3"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setSearchParams({
              page: 1,
              search,
              category: e.target.value,
            })
          }
          className="border p-2 w-1/4"
        />
      </div>

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
              <td className="border p-2">
                {p.name}
              </td>
              <td className="border p-2">
                ₹ {p.price}
              </td>
              <td className="border p-2">
                {p.stock}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() =>
                    navigate(
                      `/admin/edit-product/${p._id}`
                    )
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(p._id)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                search,
                category,
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
    </div>
  );
};

export default AdminProducts;
