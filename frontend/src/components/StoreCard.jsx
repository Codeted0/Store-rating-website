import React from "react";
import AddRatingForm from "./AddRatingForm";

const StoreCard = ({ store }) => {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-300 flex flex-col justify-between">
      <div>
        <h2 className="font-bold text-lg">{store.name}</h2>
        <p className="text-gray-600 mt-1">{store.description}</p>
        <p className="mt-2 font-medium">Rating: {store.rating || 0}</p>
      </div>
      <AddRatingForm storeId={store.id} />
    </div>
  );
};

export default StoreCard;
