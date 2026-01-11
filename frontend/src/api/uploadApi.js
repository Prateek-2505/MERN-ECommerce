import axios from "axios";

/* ================= PRODUCT IMAGE (ADMIN) ================= */
export const uploadProductImage = async (file, token) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axios.post(
    "http://localhost:5000/api/upload/product-image",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data; // { success, imageUrl }
};

/* ================= AVATAR IMAGE (USER) ================= */
export const uploadAvatarImage = async (file, token) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axios.post(
    "http://localhost:5000/api/upload/avatar",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data; // { success, imageUrl }
};
