import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import AdminDashboard from "../pages/AdminDashboard";
import OwnerDashboard from "../pages/OwnerDashboard";
import UserDashboard from "../pages/UserDashboard";

export default function MainLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // fetch once from localStorage
  console.log(user)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="p-4">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
        </Routes>
      </main>
    </div>  
  );
}

