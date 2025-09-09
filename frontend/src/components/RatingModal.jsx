import { Star } from "lucide-react";

export default function RatingModal({ isOpen, onClose, store, currentRating, onSubmit }) {
  if (!isOpen || !store) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Rate {store.name}</h2>
        
        {/* Star Selector */}
        <div className="flex justify-center mb-6 gap-2">
          {[1,2,3,4,5].map(star => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer ${
                star <= currentRating ? "text-amber-400 fill-current" : "text-slate-300"
              }`}
              onMouseEnter={() => onSubmit(star, false)} // temp rating
              onClick={() => onSubmit(star, true)} // confirm rating
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
