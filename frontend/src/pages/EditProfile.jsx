import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { uploadAvatarImage } from "../api/uploadApi";

const EditProfile = ({ theme }) => {
  const isDark = theme === "dark";

  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user.avatar);
  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [loading, setLoading] = useState(false);

  const isChanged =
    name !== user.name ||
    avatarFile ||
    (currentPassword && newPassword);

  /* ================= HANDLERS ================= */
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

      // 1️⃣ Upload avatar
      if (avatarFile) {
        const uploadRes = await uploadAvatarImage(
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

      // 4️⃣ Change password (force logout)
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

        toast.success(
          "Password changed. Please login again."
        );
        logout();
        return;
      }

      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div
        className={`p-6 rounded-xl border
          ${
            isDark
              ? "bg-slate-900 border-slate-600"
              : "bg-white border-slate-200"
          }`}
      >
        <h2
          className={`text-xl font-semibold mb-6 text-center ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          Edit Profile
        </h2>

        <form
          onSubmit={submitHandler}
          className="space-y-4"
        >
          {/* AVATAR */}
          <div className="flex justify-center">
            <img
              src={preview}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className={`w-full text-sm ${
              isDark
                ? "text-slate-300"
                : "text-slate-700"
            }`}
          />

          {/* NAME */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 rounded border outline-none
              ${
                isDark
                  ? "bg-slate-700 border-slate-500 text-slate-100"
                  : "bg-white border-slate-300 text-black"
              }`}
          />

          {/* PASSWORD SECTION */}
          <div className="border-t pt-4 space-y-2">
            <input
              type="password"
              placeholder="Current Password"
              className={`w-full p-2 rounded border outline-none
                ${
                  isDark
                    ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                    : "bg-white border-slate-300"
                }`}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className={`w-full p-2 rounded border outline-none
                ${
                  isDark
                    ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                    : "bg-white border-slate-300"
                }`}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={!isChanged || loading}
            className={`w-full py-2 rounded font-semibold transition
              ${
                isDark
                  ? "bg-slate-100 text-black hover:bg-white"
                  : "bg-black text-white hover:opacity-90"
              } disabled:opacity-50`}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
