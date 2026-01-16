import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import apiClient from "../api/apiClient";
import { logoutUser } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * ===============================
   * RESTORE SESSION ON APP LOAD
   * ===============================
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // 1️⃣ Refresh access token
        const refreshRes = await apiClient.post(
          "/auth/refresh-token"
        );

        const newToken = refreshRes.data.token;

        // 2️⃣ Set token (memory)
        setToken(newToken);

        // 3️⃣ Set default Authorization header
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;

        // 4️⃣ Fetch current user
        const userRes = await apiClient.get(
          "/users/profile"
        );

        setUser(userRes.data.user);
      } catch (error) {
        // Not logged in or refresh failed
        setUser(null);
        setToken(null);
        delete apiClient.defaults.headers.common[
          "Authorization"
        ];
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    /**
     * 🔔 GLOBAL LOGOUT EVENT
     */
    const logoutHandler = () => {
      handleLogout();
    };

    window.addEventListener(
      "auth-logout",
      logoutHandler
    );

    return () => {
      window.removeEventListener(
        "auth-logout",
        logoutHandler
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * ===============================
   * LOGIN
   * ===============================
   */
  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);

    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  };

  /**
   * ===============================
   * LOGOUT
   * ===============================
   */
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore network errors
    }

    setUser(null);
    setToken(null);

    delete apiClient.defaults.headers.common[
      "Authorization"
    ];
  };

  /**
   * ===============================
   * UPDATE USER (PROFILE EDIT)
   * ===============================
   */
  const updateUser = (updatedFields) => {
    setUser((prev) =>
      prev ? { ...prev, ...updatedFields } : prev
    );
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
        login,
        logout: handleLogout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);
