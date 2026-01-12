import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Login = ({ theme }) => {
  const isDark = theme === "dark";

  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      // backend returns { user, token }
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className={`w-full max-w-md p-8 rounded-xl border shadow-sm
          ${
            isDark
              ? "bg-slate-900 border-slate-600"
              : "bg-white border-slate-200"
          }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          Login
        </h2>

        {error && (
          <div
            className={`mb-4 text-sm p-3 rounded
              ${
                isDark
                  ? "bg-red-900/40 text-red-300"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-4 py-2 rounded border outline-none
              ${
                isDark
                  ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-slate-400"
                  : "bg-white border-slate-300 text-black focus:ring-2 focus:ring-black"
              }`}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full px-4 py-2 rounded border outline-none
              ${
                isDark
                  ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-slate-400"
                  : "bg-white border-slate-300 text-black focus:ring-2 focus:ring-black"
              }`}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded font-semibold transition
              ${
                isDark
                  ? "bg-slate-100 text-black hover:bg-white"
                  : "bg-black text-white hover:bg-gray-800"
              } disabled:opacity-50`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
