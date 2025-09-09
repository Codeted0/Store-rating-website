import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Welcome to Store Ratings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Normal User */}
        <button
          className="bg-green-500 text-white p-4 rounded hover:bg-green-600 transition w-64"
          onClick={() => navigate("/login")}
        >
          Get Started as User
        </button>

        {/* Store Owner */}
        <button
          className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 transition w-64"
          onClick={() => navigate("/login")}
        >
          Login as Owner
        </button>

        {/* Admin */}
        <button
          className="bg-red-500 text-white p-4 rounded hover:bg-red-600 transition w-64"
          onClick={() => navigate("/login")}
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
}
