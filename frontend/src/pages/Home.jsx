import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Home</h1>

      <p>Authenticated: {String(isAuthenticated)}</p>
      <p>Admin: {String(isAdmin)}</p>
    </div>
  );
};

export default Home;
