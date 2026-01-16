import apiClient from "./apiClient";

// REGISTER
export const registerUser = async (userData) => {
  const res = await apiClient.post(
    "/auth/register",
    userData
  );
  return res.data;
};

// LOGIN
export const loginUser = async (credentials) => {
  const res = await apiClient.post(
    "/auth/login",
    credentials
  );
  return res.data;
};

// LOGOUT
export const logoutUser = async () => {
  const res = await apiClient.post("/auth/logout");
  return res.data;
};
