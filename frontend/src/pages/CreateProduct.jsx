import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadProductImage } from "../api/uploadApi";
import { createProduct } from "../api/productApi";

const MAX_STOCK = 100;

const CreateProduct = ({ theme }) => {
  const isDark = theme === "dark";
  const { token } = useAuth();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "stock") {
      const numericValue = Math.max(
        0,
        Math.min(Number(value || 0), MAX_STOCK)
      );
      setForm({ ...form, stock: numericValue });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const incrementStock = () => {
    setForm((prev) => ({
      ...prev,
      stock: Math.min(prev.stock + 1, MAX_STOCK),
    }));
  };

  const decrementStock = () => {
    setForm((prev) => ({
      ...prev,
      stock: Math.max(prev.stock - 1, 0),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!imageFile) {
        throw new Error("Image is required");
      }

      // 1️⃣ Upload image
      const uploadRes = await uploadProductImage(
        imageFile,
        token
      );

      // 2️⃣ Create product
      await createProduct(
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          image: uploadRes.imageUrl,
          imagePublicId: uploadRes.publicId,
        },
        token
      );

      setMessage("Product created successfully");
      setForm({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: 0,
      });
      setImageFile(null);
      setPreview(null);
    } catch (error) {
      setMessage(
        error.message || "Product creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className={`text-2xl font-bold mb-6 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        Create Product
      </h1>

      <form
        onSubmit={handleSubmit}
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
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className={`w-full p-2 rounded border outline-none
            ${
              isDark
                ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
          required
        />

        {/* PRICE */}
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className={`w-full p-2 rounded border outline-none
            ${
              isDark
                ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
          required
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
              disabled={form.stock === 0}
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
              value={form.stock}
              onChange={handleChange}
              className={`w-full p-2 text-center rounded border outline-none
                ${
                  isDark
                    ? "bg-slate-700 border-slate-500 text-slate-100"
                    : "bg-white border-slate-300 text-black"
                }`}
              required
            />

            <button
              type="button"
              onClick={incrementStock}
              disabled={form.stock === MAX_STOCK}
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

        {/* CATEGORY */}
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className={`w-full p-2 rounded border outline-none
            ${
              isDark
                ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className={`w-full p-2 rounded border resize-none outline-none
            ${
              isDark
                ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                : "bg-white border-slate-300 text-black"
            }`}
          required
        />

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={`w-full text-sm ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
          required
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
          disabled={loading}
          className={`w-full py-2 rounded font-semibold transition
            ${
              isDark
                ? "bg-slate-100 text-black hover:bg-white"
                : "bg-black text-white hover:opacity-90"
            }`}
        >
          {loading ? "Creating…" : "Create Product"}
        </button>

        {message && (
          <p
            className={`text-sm font-medium ${
              message.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateProduct;
