import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";

export default function Navbar({ onAddUser, onAddStore }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to landing page
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-sm border-b px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        {/* Left side */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Store Rating System</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Add User Button */}
          {onAddUser && (
            <button
              onClick={onAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          )}

          {/* Add Store Button */}
          {onAddStore && (
            <button
              onClick={onAddStore}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Store</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
