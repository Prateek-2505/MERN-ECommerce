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

const AdminProducts = ({ theme }) => {
  const isDark = theme === "dark";

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
      setLoading(true);
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className={isDark ? "text-slate-300" : "text-slate-700"}>
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className={`text-2xl font-bold mb-6 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Admin Products
      </h1>

      {/* 🔍 SEARCH + CATEGORY */}
      <div className="flex flex-wrap gap-4 mb-6">
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
          className={`p-2 rounded border w-full sm:w-1/3
            ${
              isDark
                ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
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
          className={`p-2 rounded border w-full sm:w-1/4
            ${
              isDark
                ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
        />
      </div>

      {/* 🧾 TABLE */}
      <div
        className={`overflow-x-auto rounded-xl border
          ${
            isDark
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
      >
        <table className="w-full text-sm">
          <thead
            className={
              isDark
                ? "bg-slate-800 text-slate-200"
                : "bg-slate-100 text-slate-800"
            }
          >
            <tr>
              <th className="p-3 text-left">
                Image
              </th>
              <th className="p-3 text-left">
                Name
              </th>
              <th className="p-3 text-left">
                Price
              </th>
              <th className="p-3 text-left">
                Stock
              </th>
              <th className="p-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className={`border-t
                  ${
                    isDark
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <td className="p-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>

                <td
                  className={`p-3 ${
                    isDark
                      ? "text-slate-100"
                      : "text-slate-900"
                  }`}
                >
                  {p.name}
                </td>

                <td className="p-3">
                  ₹ {p.price}
                </td>

                <td className="p-3">
                  {p.stock}
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/edit-product/${p._id}`
                      )
                    }
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:opacity-90"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(p._id)
                    }
                    className="px-3 py-1 rounded bg-red-600 text-white hover:opacity-90"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📄 PAGINATION */}
      <div className="flex flex-wrap gap-2 mt-6">
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
            className={`px-3 py-1 rounded border font-medium
              ${
                p === page
                  ? isDark
                    ? "bg-white text-black"
                    : "bg-black text-white"
                  : isDark
                  ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                  : "border-slate-300 text-slate-900 hover:bg-slate-100"
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
