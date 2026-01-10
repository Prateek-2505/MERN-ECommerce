import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadProductImage } from "../api/uploadApi";
import { createProduct } from "../api/productApi";

const CreateProduct = () => {
  const { token } = useAuth();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!imageFile) {
        throw new Error("Image is required");
      }

      // 1️⃣ Upload single image
      const uploadRes = await uploadProductImage(imageFile, token);

      // 2️⃣ Create product with stock
      await createProduct(
        {
          name: form.name,
          price: Number(form.price),
          description: form.description,
          category: form.category,
          stock: Number(form.stock),
          image: uploadRes.imageUrl,
        },
        token
      );

      setMessage("Product created successfully");
      setForm({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
      });
      setImageFile(null);
    } catch (error) {
      setMessage(error.message || "Product creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-lg space-y-4"
      >
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* SINGLE IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default CreateProduct;
