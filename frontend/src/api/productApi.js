import axios from "axios";

const API_URL = "http://localhost:5000/api/products";
const UPLOAD_URL = "http://localhost:5000/api/upload";

// CREATE PRODUCT (ADMIN)
export const createProduct = async (data, token) => {
  const res = await axios.post(
    `${API_URL}/create-product`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// GET ALL PRODUCTS (PUBLIC)
export const getProducts = async () => {
  const res = await axios.get(`${API_URL}/get-products`);
  return res.data;
};

// GET SINGLE PRODUCT (PUBLIC)
export const getProduct = async (id) => {
  const res = await axios.get(`${API_URL}/get-product/${id}`);
  return res.data;
};

// ✅ UPLOAD IMAGE (ADMIN) — FIXED
export const uploadProductImage = async (image, token) => {
  const formData = new FormData();
  formData.append("image", image);

  const res = await axios.post(
    `${UPLOAD_URL}/product-image`, // ✅ MATCHES BACKEND
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// UPDATE PRODUCT (ADMIN - PATCH)
export const updateProduct = async (id, updates, token) => {
  const res = await axios.patch(
    `${API_URL}/update-product/${id}`,
    updates,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// DELETE PRODUCT (ADMIN)
export const deleteProduct = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/delete-product/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
