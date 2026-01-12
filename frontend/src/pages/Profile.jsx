import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const FALLBACK_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Profile = ({ theme }) => {
  const isDark = theme === "dark";

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      await axios.delete(
        "http://localhost:5000/api/users/delete-account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { password },
        }
      );

      toast.success("Account deleted");
      logout();
      navigate("/register");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
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
          className={`text-2xl font-semibold mb-6 text-center ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          My Profile
        </h2>

        {/* AVATAR */}
        <div className="flex justify-center mb-4">
          <img
            src={user.avatar || FALLBACK_AVATAR}
            onError={(e) =>
              (e.currentTarget.src = FALLBACK_AVATAR)
            }
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>

        {/* DETAILS */}
        <div
          className={`space-y-2 text-sm ${
            isDark ? "text-slate-200" : "text-slate-700"
          }`}
        >
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
        </div>

        {/* EDIT */}
        <Link
          to="/profile/edit"
          className={`block mt-6 text-center py-2 rounded font-semibold transition
            ${
              isDark
                ? "bg-slate-100 text-black hover:bg-white"
                : "bg-black text-white hover:opacity-90"
            }`}
        >
          Edit Profile
        </Link>

        {/* DELETE ACCOUNT */}
        <div className="mt-6 border-t pt-4">
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Delete Account
            </button>
          ) : (
            <form onSubmit={handleDelete}>
              <input
                type="password"
                placeholder="Confirm password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className={`w-full p-2 rounded border mb-2 outline-none
                  ${
                    isDark
                      ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
                      : "bg-white border-slate-300"
                  }`}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
