"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("listly_history") || "[]");
    setItems(data);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">History</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">No listings yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-white border p-4 rounded-xl">
              <p className="font-semibold">{item.type} Listing</p>
              <p className="text-sm text-gray-500">{item.url}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}