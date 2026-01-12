import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, updateProduct } from "../api/productApi";
import { uploadProductImage } from "../api/uploadApi";
import { useAuth } from "../context/AuthContext";

const MAX_STOCK = 100;

const AdminEditProduct = ({ theme }) => {
  const isDark = theme === "dark";

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: 0,
    image: "",
    imagePublicId: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalProduct, setOriginalProduct] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct(id);
      setFormData(data.product);
      setOriginalProduct(data.product);
      setPreview(data.product.image);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "stock") {
      const numericValue = Math.max(
        0,
        Math.min(Number(value || 0), MAX_STOCK)
      );
      setFormData({ ...formData, stock: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const incrementStock = () => {
    setFormData((prev) => ({
      ...prev,
      stock: Math.min(prev.stock + 1, MAX_STOCK),
    }));
  };

  const decrementStock = () => {
    setFormData((prev) => ({
      ...prev,
      stock: Math.max(prev.stock - 1, 0),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const updatedFields = {};

    if (newImage) {
      const uploadRes = await uploadProductImage(
        newImage,
        token
      );
      updatedFields.image = uploadRes.imageUrl;
      updatedFields.imagePublicId =
        uploadRes.publicId;
    }

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalProduct[key]) {
        updatedFields[key] = formData[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      alert("No changes made");
      return;
    }

    await updateProduct(id, updatedFields, token);
    navigate("/admin/products");
  };

  /* ================= LOADING ================= */
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
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className={`text-2xl font-bold mb-6 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Edit Product
      </h1>

      <form
        onSubmit={submitHandler}
        className={`space-y-4 p-6 rounded-xl border
          ${
            isDark
              ? "bg-slate-900 border-slate-600"
              : "bg-white border-slate-200"
          }`}
      >
        {/* NAME */}
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className={`w-full p-2 rounded border outline-none
            ${
              isDark
                ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
        />

        {/* PRICE */}
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className={`w-full p-2 rounded border outline-none
            ${
              isDark
                ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
        />

        {/* CATEGORY */}
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className={`w-full p-2 rounded border outline-none
            ${
              isDark
                ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
        />

        {/* STOCK INPUT + PLUS / MINUS */}
        <div>
          <label
            className={`block mb-1 font-medium ${
              isDark ? "text-slate-200" : "text-slate-700"
            }`}
          >
            Stock
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decrementStock}
              disabled={formData.stock === 0}
              className={`px-3 py-2 rounded font-bold text-lg
                ${
                  isDark
                    ? "bg-slate-800 text-white disabled:opacity-40"
                    : "bg-slate-200 text-black disabled:opacity-40"
                }`}
            >
              −
            </button>

            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full p-2 text-center rounded border outline-none
                ${
                  isDark
                    ? "bg-slate-700 border-slate-500 text-slate-100"
                    : "bg-white border-slate-300 text-black"
                }`}
            />

            <button
              type="button"
              onClick={incrementStock}
              disabled={formData.stock === MAX_STOCK}
              className={`px-3 py-2 rounded font-bold text-lg
                ${
                  isDark
                    ? "bg-slate-800 text-white disabled:opacity-40"
                    : "bg-slate-200 text-black disabled:opacity-40"
                }`}
            >
              +
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className={`w-full p-2 rounded border resize-none outline-none
            ${
              isDark
                ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
        />

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={`w-full text-sm ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        />

        {/* IMAGE PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-40 w-full object-cover rounded border border-slate-400"
          />
        )}

        {/* SUBMIT */}
        <button
          className={`w-full py-2 rounded font-semibold transition
            ${
              isDark
                ? "bg-slate-100 text-black hover:bg-white"
                : "bg-black text-white hover:opacity-90"
            }`}
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default AdminEditProduct;
