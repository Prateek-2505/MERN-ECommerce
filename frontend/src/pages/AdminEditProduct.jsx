import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, updateProduct } from "../api/productApi";
import { uploadProductImage } from "../api/uploadApi";
import { useAuth } from "../context/AuthContext";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: "",
    imagePublicId: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalProduct, setOriginalProduct] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct(id);
      setFormData(data.product);
      setOriginalProduct(data.product);
      setPreview(data.product.image); // ✅ existing image
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setPreview(URL.createObjectURL(file)); // ✅ preview new image
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const updatedFields = {};

    // 1️⃣ Upload new image & delete old one (backend handles delete)
    if (newImage) {
      const uploadRes = await uploadProductImage(newImage, token);
      updatedFields.image = uploadRes.imageUrl;
      updatedFields.imagePublicId = uploadRes.publicId;
    }

    // 2️⃣ Other changed fields
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

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={submitHandler} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2" />
        <input name="price" value={formData.price} onChange={handleChange} className="w-full border p-2" />
        <input name="category" value={formData.category} onChange={handleChange} className="w-full border p-2" />
        <input name="stock" value={formData.stock} onChange={handleChange} className="w-full border p-2" />

        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2" />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {/* ✅ IMAGE PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-40 object-cover border rounded"
          />
        )}

        <button className="w-full bg-black text-white py-2 rounded">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default AdminEditProduct;
