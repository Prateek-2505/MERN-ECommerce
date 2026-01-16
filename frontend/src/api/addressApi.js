import axios from "axios";

const API_URL = "http://localhost:5000/api/addresses";

// GET SAVED ADDRESSES
export const getMyAddresses = async (token) => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// CREATE ADDRESS
export const createAddress = async (address, token) => {
  const res = await axios.post(API_URL, address, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
