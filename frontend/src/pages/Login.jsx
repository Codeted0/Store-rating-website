// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/auth/login", { email, password });
      const user = response.data.user;

      // Save role and token
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify({ name: user.name, email: user.email }));
      localStorage.setItem("token", response.data.token);

      // Redirect based on role
      navigate(`/${user.role}`); // e.g., "/admin", "/owner", "/user"
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-lg space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login</h2>
            <p className="text-gray-800 text-sm">Sign in to your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-gray-200 p-2 rounded text-gray-800 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-800" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-800 rounded text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-800" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-800 rounded text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-800"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded bg-gray-800 text-white hover:opacity-90 disabled:opacity-50 transition"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>

          {/* Footer */}
          <div className="text-center text-gray-800 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-semibold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
