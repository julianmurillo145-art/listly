"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("listly_history") || "[]"
    );
    setItems(data);
  }, []);

  const deleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);

    localStorage.setItem(
      "listly_history",
      JSON.stringify(updated)
    );

    setItems(updated);
  };

  const clearHistory = () => {
    if (!confirm("Delete all saved listings?")) return;

    localStorage.removeItem("listly_history");
    setItems([]);
  };

  const copyListing = async (listing) => {
    await navigator.clipboard.writeText(listing);
    alert("Listing copied!");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">History</h1>

        {items.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-black text-white rounded-xl"
          >
            Delete All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No listings yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-4"
            >
              <h2 className="font-semibold text-lg">
                {item.title || "Vehicle Listing"}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                {item.type}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    copyListing(item.listing || "")
                  }
                  className="px-4 py-2 border rounded-xl"
                >
                  Copy
                </button>

                <button
                  onClick={() => deleteItem(i)}
                  className="px-4 py-2 bg-black text-white rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}