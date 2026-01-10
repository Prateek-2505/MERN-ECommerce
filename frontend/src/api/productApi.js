import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

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

// DELETE PRODUCT (ADMIN) ✅ FIX
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
