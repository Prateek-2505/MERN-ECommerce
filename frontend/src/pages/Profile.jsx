import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const FALLBACK_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Profile = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    try {
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
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        My Profile
      </h2>

      <div className="flex justify-center mb-4">
        <img
          src={user.avatar || FALLBACK_AVATAR}
          onError={(e) =>
            (e.currentTarget.src = FALLBACK_AVATAR)
          }
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      <div className="space-y-2 text-sm">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
      </div>

      <Link
        to="/profile/edit"
        className="block mt-6 text-center bg-black text-white py-2 rounded"
      >
        Edit Profile
      </Link>

      {/* Danger Zone */}
      <div className="mt-6 border-t pt-4">
        <p className="text-red-600 font-semibold mb-2">
          Danger Zone
        </p>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            Delete Account
          </button>
        ) : (
          <>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border p-2 rounded mb-2"
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
            <button
              onClick={handleDelete}
              className="w-full bg-red-700 text-white py-2 rounded"
            >
              Confirm Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
