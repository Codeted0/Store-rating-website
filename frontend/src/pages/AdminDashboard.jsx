import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Search,
  Plus,
  Users,
  Store,
  Star,
  UserPlus,
  Building2,
  BarChart3,
  LogOut,
  Home,
} from "lucide-react";
// import AddStoreModal from "../components/AddStoreModal";
// import AddUserModal from "../components/AddNewModal";
import AddNewModal from "../components/AddNewModal";
// import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState(0); // Total submitted ratings
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    owner: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, storesRes] = await Promise.all([
          axios.get("/users"),
          axios.get("/stores"),
        ]);
        setUsers(usersRes.data);
        setStores(storesRes.data);

        // Optional: calculate total ratings from stores if API provides ratings
        const totalRatings = storesRes.data.reduce(
          (acc, store) => acc + (store.rating || 0),
          0
        );
        setRatings(totalRatings);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch data from server");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.address &&
        user.address.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredStores = stores.filter((store) => {
    // Safely get owner's name as string
    const ownerName =
      store.owner && typeof store.owner === "object"
        ? store.owner.name || ""
        : store.owner || "";

    // Safely get address as string
    const storeAddress =
      store.address && typeof store.address === "object"
        ? `${store.address.street ?? ""}, ${store.address.city ?? ""}`
        : store.address || "";

    return (
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storeAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const handleAddNew = async (type, data) => {
    try {
      if (type === "user" || type === "admin" || type === "owner") {
        await axios.post("/users", { ...data, role: type });
        setUsers([...users, { ...data, role: type }]);
      } else if (type === "store") {
        await axios.post("/stores", data);
        setStores([...stores, data]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add " + type);
    }
  };
  //   const handleAddUser = async () => {
  //     if (
  //       !newUser.name ||
  //       !newUser.email ||
  //       !newUser.password ||
  //       !newUser.address
  //     )
  //       return;
  //     try {
  //       const res = await axios.post("/users", newUser);
  //       setUsers([...users, res.data]);
  //       setNewUser({
  //         name: "",
  //         email: "",
  //         password: "",
  //         address: "",
  //         role: "user",
  //       });
  //       setShowAddUser(false);
  //     } catch (err) {
  //       console.error(err);
  //       alert("Failed to add user");
  //     }
  //   };

  //   const handleAddStore = async () => {
  //     if (!newStore.name || !newStore.address || !newStore.owner) return;
  //     try {
  //       const res = await axios.post("/stores", newStore);
  //       setStores([...stores, res.data]);
  //       setNewStore({ name: "", address: "", owner: "" });
  //       setShowAddStore(false);
  //     } catch (err) {
  //       console.error(err);
  //       alert("Failed to add store");
  //     }
  //   };

  //   const handleLogout = () => {
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("role");
  //     window.location.reload();
  //   };

  const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color} hover:shadow-xl transition-all duration-300 cursor-pointer group`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${color
            .replace("border-l-", "bg-")
            .replace(
              "-500",
              "-100"
            )} group-hover:scale-110 transition-transform`}
        >
          <Icon className={`w-8 h-8 ${color.replace("border-l-", "text-")}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl font-semibold">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs + Add New Button */}
        <div className="flex justify-between items-center mb-8">
          {/* Tabs */}
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSearchTerm("");
                setRoleFilter("");
              }}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                setSearchTerm("");
                setRoleFilter("");
              }}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("stores");
                setSearchTerm("");
                setRoleFilter("");
              }}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "stores"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Stores</span>
            </button>
          </nav>

          {/* Always visible Add New button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>

          {showAddModal && (
            <AddNewModal
              onClose={() => setShowAddModal(false)}
              onSubmit={handleAddNew}
            />
          )}
        </div>

        {/* Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Users"
                  value={users.length}
                  icon={Users}
                  color="border-l-blue-500"
                  onClick={() => setActiveTab("users")}
                />
                <StatCard
                  title="Total Stores"
                  value={stores.length}
                  icon={Building2}
                  color="border-l-green-500"
                  onClick={() => setActiveTab("stores")}
                />
                <StatCard
                  title="Total Ratings"
                  value={ratings}
                  icon={BarChart3}
                  color="border-l-purple-500"
                />
              </div>
            </div>
          </div>
        )}
        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            {/* Search + Sort */}
            <div className="flex justify-between mb-4 items-center">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border rounded-lg w-full max-w-sm"
              />
              <button
                onClick={() => {
                  const sorted = [...filteredUsers].sort((a, b) =>
                    a.name.localeCompare(b.name)
                  );
                  setUsers(sorted);
                }}
                className="ml-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Sort by Name
              </button>
            </div>

            {/* Users Table */}
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Address</th>
                  <th className="py-2 px-4 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.address}</td>
                    <td className="py-2 px-4">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === "stores" && (
          <div>
            {/* Search + Sort */}
            <div className="flex justify-between mb-4 items-center">
              <input
                type="text"
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border rounded-lg w-full max-w-sm"
              />
              <button
                onClick={() => {
                  const sorted = [...filteredStores].sort((a, b) =>
                    a.name.localeCompare(b.name)
                  );
                  setStores(sorted);
                }}
                className="ml-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Sort by Name
              </button>
            </div>

            {/* Stores Table */}
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{store.name}</td>
                  <td className="py-2 px-4">
                    {store.address
                      ? typeof store.address === "string"
                        ? store.address
                        : `${store.address.street ?? ""}, ${
                            store.address.city ?? ""
                          }`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {store.owner
                      ? typeof store.owner === "string"
                        ? store.owner
                        : store.owner.name ?? "N/A"
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {store.rating != null ? store.rating : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </div>
        )}

        {/* Add User Modal */}
        {/* {showAddUser && (
          <AddUserModal
            newUser={newUser}
            setNewUser={setNewUser}
            onClose={() => setShowAddUser(false)}
            onSubmit={handleAddUser}
          />
        )} */}

        {/* Add Store Modal */}
        {/* {showAddStore && (
          <AddStoreModal
            newStore={newStore}
            setNewStore={setNewStore}
            onClose={() => setShowAddStore(false)}
            onSubmit={handleAddStore}
          />
        )} */}
      </div>
    </div>
  );
}
