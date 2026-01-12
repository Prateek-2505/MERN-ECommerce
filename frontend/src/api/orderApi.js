import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// CREATE ORDER
export const createOrder = async (
  orderItems,
  token
) => {
  const res = await axios.post(
    `${API_URL}/create`,
    { orderItems },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// USER – ALL ORDERS
export const getMyOrders = async (token) => {
  const res = await axios.get(
    `${API_URL}/my-orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// USER – SINGLE ORDER
export const getMyOrderById = async (
  id,
  token
) => {
  const res = await axios.get(
    `${API_URL}/my/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ✅ ADMIN – PAGINATION + FILTER
export const getAllOrders = async (
  token,
  page = 1,
  status = ""
) => {
  const res = await axios.get(
    `${API_URL}/all?page=${page}&status=${status}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ADMIN – SINGLE ORDER
export const getOrderById = async (
  id,
  token
) => {
  const res = await axios.get(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ADMIN – UPDATE STATUS
export const updateOrderStatus = async (
  id,
  status,
  token
) => {
  const res = await axios.put(
    `${API_URL}/update/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ADMIN – DELETE ORDER
export const deleteOrder = async (
  id,
  token
) => {
  const res = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
