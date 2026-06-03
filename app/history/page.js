"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("listly_history") || "[]");
    setItems(data);
  }, []);

  const deleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    localStorage.setItem("listly_history", JSON.stringify(updated));
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

  const downloadPhotos = async (item) => {
    const photos = item.photos || [];

    if (!photos.length) {
      alert("No photos saved for this listing.");
      return;
    }

    const res = await fetch("/api/photos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        photos,
        vin: item.vin || "vehicle-photos",
      }),
    });

    if (!res.ok) {
      alert("Could not download photos.");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.vin || "vehicle-photos"}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
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
            <div key={i} className="bg-white border rounded-xl p-4">
              <h2 className="font-semibold text-lg">
                {item.title || "Vehicle Listing"}
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                {item.price || "No price"} • {item.mileage || "N/A"} mi • {item.type} • VIN {item.vin?.slice(-6) || "N/A"}
              </p>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => copyListing(item.listing || "")}
                  className="px-4 py-2 border rounded-xl"
                >
                  Copy Listing
                </button>

                <button
                  onClick={() => downloadPhotos(item)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Download Photos
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