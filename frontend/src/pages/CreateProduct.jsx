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
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file)); // ✅ PREVIEW
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
      const uploadRes = await uploadProductImage(imageFile, token);

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
        stock: "",
      });
      setImageFile(null);
      setPreview(null);
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
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" required />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" required />

        <input type="file" accept="image/*" onChange={handleImageChange} required />

        {/* ✅ IMAGE PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-40 object-cover border rounded"
          />
        )}

        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
          {loading ? "Creating..." : "Create Product"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default CreateProduct;
