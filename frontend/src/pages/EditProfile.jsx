import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { uploadAvatarImage  } from "../api/uploadApi";

const EditProfile = () => {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user.avatar);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isChanged =
    name !== user.name ||
    avatarFile ||
    (currentPassword && newPassword);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isChanged) return;

    try {
      setLoading(true);
      const updatedFields = {};

      // 1️⃣ Upload avatar (same as product image)
      if (avatarFile) {
        const uploadRes = await uploadAvatarImage (
          avatarFile,
          token
        );
        updatedFields.avatar = uploadRes.imageUrl;
      }

      // 2️⃣ Name change
      if (name !== user.name) {
        updatedFields.name = name;
      }

      // 3️⃣ Update profile
      if (Object.keys(updatedFields).length > 0) {
        const { data } = await axios.patch(
          "http://localhost:5000/api/users/profile",
          updatedFields,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        updateUser({
          name: data.name,
          avatar: data.avatar,
        });
      }

      // 4️⃣ Change password
      if (currentPassword && newPassword) {
        await axios.patch(
          "http://localhost:5000/api/users/change-password",
          { currentPassword, newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Password changed. Please login again.");
        logout();
        return;
      }

      toast.success("Profile updated");
      navigate("/profile");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Edit Profile
      </h2>

      <form onSubmit={submitHandler} className="space-y-4">
        <div className="flex justify-center">
          <img
            src={preview}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="border-t pt-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border p-2 rounded mb-2"
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          disabled={!isChanged || loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
