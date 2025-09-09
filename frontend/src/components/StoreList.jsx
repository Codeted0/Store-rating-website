import React, { useEffect, useState } from "react";
import axios from "axios";
import StoreCard from "./StoreCard";

const StoreList = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      const res = await axios.get("http://localhost:5000/stores");
      setStores(res.data);
    };
    fetchStores();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
};

export default StoreList;
