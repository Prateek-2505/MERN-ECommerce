import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

export const createRazorpayOrder = async (orderId, token) => {
  const res = await axios.post(
    `${API_URL}/razorpay/create-order`,
    { orderId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const verifyRazorpayPayment = async (data, token) => {
  const res = await axios.post(
    `${API_URL}/razorpay/verify`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
