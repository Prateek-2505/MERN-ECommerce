import axios from "axios";

export const uploadProductImage = async (file, token) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(
    "http://localhost:5000/api/upload/product-image",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
