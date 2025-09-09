import { useState, useEffect, useMemo } from "react";
import axios from "../api/axios"; // your axios instance
import {
  Search,
  MapPin,
  Star,
  ArrowUpDown,
  Filter,
  Store,
  TrendingUp,
} from "lucide-react";
import RatingModal from "../components/RatingModal";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedStore, setSelectedStore] = useState(null);
  const [tempRating, setTempRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch stores from backend
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("/stores");
        setStores(response.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch stores");
      }
    };
    fetchStores();
  }, []);

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setTempRating(store.userRating || 0);
    setIsModalOpen(true);
  };

  const handleRatingSubmit = async (rating, confirm) => {
    if (confirm) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `/ratings/${selectedStore.id}`,
          { rating },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStores((prev) =>
          prev.map((store) =>
            store.id === selectedStore.id
              ? {
                  ...store,
                  userRating: rating,
                  avgRating: response.data.avgRating,
                  totalRatings: response.data.totalRatings,
                }
              : store
          )
        );
        setIsModalOpen(false);
      } catch (err) {
        console.error(err);
        alert("Failed to update rating");
      }
    } else {
      setTempRating(rating); // hover or temp selection
    }
  };
  // Derived categories
  const categories = ["all", ...new Set(stores.map((store) => store.category))];

  // Filter & sort logic
  const filteredAndSortedStores = useMemo(() => {
    let filtered = stores.filter((store) => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || store.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.avgRating - a.avgRating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [stores, searchTerm, sortBy, filterCategory]);

  // Add/update rating

  // Helper to render stars
  const renderStars = (rating, filled = true, size = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`${size} ${
              filled && index < Math.floor(rating)
                ? "text-amber-400 fill-current"
                : filled && index < rating
                ? "text-amber-400 fill-current opacity-50"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div>
              {/* <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Store Dashboard
              </h1> */}
              <p className="text-slate-800 flex items-center gap-2">
                <Store className="w-4 h-4" />
                Discover and rate local businesses
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {stores.length}
                </div>
                <div className="text-sm text-slate-500">Total Stores</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stores by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="lg:w-52">
              <div className="relative">
                <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredAndSortedStores.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {stores.length}
            </span>{" "}
            stores
          </p>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Store Header with gradient background */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full translate-y-8 -translate-x-8"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                        🛒
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-lg leading-tight">
                          {store.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                </div>
              </div>

              <div className="p-6">
                {/* Address */}
                <div className="flex items-start gap-2 mb-6">
                  <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {store.address}
                  </p>
                </div>

                {/* Rating Section */}
                <div className="space-y-4 mb-6">
                  {/* User Rating */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <div className="text-xs font-medium text-slate-500 mb-1">
                        Your Rating
                      </div>
                      {store.userRating ? (
                        <div className="flex items-center gap-2">
                          {renderStars(store.userRating, true, "w-4 h-4")}
                          <span className="text-sm font-bold text-slate-700">
                            {store.userRating}/5
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {renderStars(0, false, "w-4 h-4")}
                          <span className="text-xs text-slate-400">
                            Not rated
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Average Rating Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3">
                    <div className="text-xs font-medium text-blue-700 mb-1">
                      Store Average
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {renderStars(store.avgRating, true, "w-4 h-4")}
                        <span className="text-sm font-bold text-blue-800">
                          {store.avgRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {store.totalRatings} reviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add/Update Rating Button */}
                <button
                  onClick={() => openRatingModal(store)}
                  className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                    store.userRating
                      ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-200"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {store.userRating ? "Update Rating" : "Add Rating"}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* ⭐ Rating Modal */}
        <RatingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          store={selectedStore}
          currentRating={tempRating}
          onSubmit={handleRatingSubmit}
        />
        {/* No Results */}
        {filteredAndSortedStores.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              No stores found
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms or filters to discover more stores
              in your area.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
