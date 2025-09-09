import React, { useState } from "react";
import axios from "axios";

const AddRatingForm = ({ storeId }) => {
  const [rating, setRating] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:5000/stores/${storeId}/rate`, {
      rating: Number(rating),
    });
    setRating("");
    alert("Rating submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col sm:flex-row items-center gap-2">
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="1-5"
        className="border p-2 rounded w-full sm:w-auto"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">
        Submit
      </button>
    </form>
  );
};

export default AddRatingForm;
