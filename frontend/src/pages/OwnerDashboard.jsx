import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function OwnerDashboard() {
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/owner/store", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStore(response.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch your store");
      }
    };

    fetchStore();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      {store && (
        <div>
          <h2 className="text-xl">{store.name}</h2>
          <p>Average Rating: {store.averageRating}</p>
          {/* More store details here */}
        </div>
      )}
    </div>
  );
}
