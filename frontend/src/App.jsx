import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import UpdatePassword from "./pages/UpdatePassword";

export default function App() {
  const role = localStorage.getItem("role"); // get logged-in user role
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <Router>
      <Routes>
        {/* Landing / Home page */}
        <Route
          path="/"
          element={role ? <Navigate to={`/${role}`} /> : <Home />}
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={role ? <Navigate to={`/${role}`} /> : <Login />}
        />
        <Route
          path="/signup"
          element={role ? <Navigate to={`/${role}`} /> : <Signup />}
        />

        {/* Protected routes inside MainLayout */}
        <Route element={<MainLayout user={user} />}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Add Update Password route here */}
          <Route
            path="/update-password"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner", "user"]}>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={role ? `/${role}` : "/"} />} />
      </Routes>
    </Router>
  );
}
