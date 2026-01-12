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

// ✅ GET PRODUCTS (PAGINATION + SEARCH + CATEGORY)
export const getProducts = async (
  page = 1,
  search = "",
  category = ""
) => {
  const res = await axios.get(
    `${API_URL}/get-products?page=${page}&search=${search}&category=${category}`
  );
  return res.data;
};

// GET SINGLE PRODUCT
export const getProduct = async (id) => {
  const res = await axios.get(
    `${API_URL}/get-product/${id}`
  );
  return res.data;
};

// UPLOAD IMAGE
export const uploadProductImage = async (
  image,
  token
) => {
  const formData = new FormData();
  formData.append("image", image);

  const res = await axios.post(
    `${UPLOAD_URL}/product-image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// UPDATE PRODUCT
export const updateProduct = async (
  id,
  updates,
  token
) => {
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

// DELETE PRODUCT
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
