import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Star, MapPin, Eye, EyeOff, Search, Award } from "lucide-react";

export default function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/owner/store", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        const avgRating =
          data.ratings.length > 0
            ? (
                data.ratings.reduce((a, r) => a + r.ratingValue, 0) /
                data.ratings.length
              ).toFixed(1)
            : 0;

        setStore({
          id: data.id,
          name: data.name,
          address: data.address,
          averageRating: parseFloat(avgRating),
          ratings: data.ratings.map((r) => ({
            id: r.id,
            userName: r.user.name,
            userEmail: r.user.email,
            rating: r.ratingValue,
            comment: r.comment || "No comment",
            date: r.createdAt,
          })),
        });
      } catch (err) {
        console.error(err);
        alert("Failed to fetch your store");
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-amber-400 fill-current"
            : "text-slate-300"
        }`}
      />
    ));

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/users/update-password",
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Password updated successfully!");
      setNewPassword("");
      setShowPasswordModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading your dashboard...
      </div>
    );
  }

  if (!store) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
        <p className="text-slate-600">No store found for this owner.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          <div>
            <div className="flex items-center mt-1 mb-4">
            {" "}
            <Award className="w-6 h-6 text-blue-600 mr-2" />{" "}
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              Your Store
            </span>{" "}
          </div>
            <h1 className="text-2xl font-bold text-slate-900">{store.name}</h1>
            <div className="flex items-center text-slate-600 mt-2">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{store.address}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 text-center min-w-[200px]">
            <div className="flex items-center justify-center mb-2">
              {renderStars(store.averageRating)}
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {store.averageRating}
            </div>
            <div className="text-sm text-slate-600">Average Rating</div>
            <div className="text-xs text-slate-500 mt-1">
              Based on {store.ratings.length} reviews
            </div>
          </div>

          {/* <div className="flex gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Update Password
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div> */}
        </div>

        {/* User Ratings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              User Ratings & Reviews
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {store.ratings
                  .filter(
                    (r) =>
                      r.userName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      r.userEmail
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((rating) => (
                    <tr key={rating.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">{rating.userName}</td>
                      <td className="px-6 py-4">{rating.userEmail}</td>
                      <td className="px-6 py-4">
                        {renderStars(rating.rating)}
                      </td>
                      <td className="px-6 py-4">{rating.comment}</td>
                      <td className="px-6 py-4">
                        {new Date(rating.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {store.ratings.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No ratings available yet.
              </div>
            )}
          </div>
        </div>

        {/* Password Update Modal */}
        {/* {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Update Password
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePasswordUpdate}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword("");
                    setShowPassword(false);
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
