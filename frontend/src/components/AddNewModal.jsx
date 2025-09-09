import { useState } from "react";
import axiosInstance from "../api/axios.js";

export default function AddNewModal({ onClose, onSubmit }) {
  const [type, setType] = useState("user"); // default tab
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    owner: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = () => {
  //   onSubmit(type, formData);
  //   onClose();
  //   setFormData({ name: "", email: "", password: "", address: "", owner: "" });
  // };
  const handleSubmit = async () => {
    try {
      // Add role based on type (user/admin/owner)
      const payload = { ...formData, role: type };

      if (type === "store") {
        // stores are separate
        await axiosInstance.post("/stores", formData);
      } else {
        // all users go to /users with role
        await axiosInstance.post("/users", payload);
      }

      alert(
        `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`
      );
      onClose();
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        owner: "",
      });
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Something went wrong";
      alert("Failed to add " + type + ": " + message);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
                    bg-black/30 backdrop-blur-sm"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-[450px]">
        {/* Tabs */}
        <div className="flex justify-around mb-4">
          {["user", "owner", "store", "admin"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1 rounded-lg ${
                type === t ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <hr className="mb-4" />

        {/* Dynamic Form Fields */}
        <div className="space-y-3">
          {/* Common fields */}
          {(type === "user" || type === "admin" || type === "owner") && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </>
          )}

          {type === "store" && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Store Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Store Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Store Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="owner"
                placeholder="Owner ID or Name"
                value={formData.owner}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
