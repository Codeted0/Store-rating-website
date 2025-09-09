import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(response.data); // backend should return array of stores
      } catch (err) {
        console.error(err);
        alert("Failed to fetch stores");
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <ul>
        {stores.map((store) => (
          <li key={store.id}>
            {store.name} — {store.address} — Rating: {store.rating || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}
