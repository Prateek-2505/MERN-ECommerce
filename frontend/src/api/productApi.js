import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createProduct = async (product, token) => {
  const res = await API.post(
    "/products/create-product",
    product,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getAllProducts = async () => {
  const res = await API.get("/products/get-products");
  return res.data;
};

export const deleteProduct = async (id, token) => {
  const res = await API.delete(
    `/products/delete-product/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
