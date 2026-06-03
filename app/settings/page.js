"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [yelp, setYelp] = useState(
    "https://www.yelp.com/biz/norm-reeves-genesis-of-cerritos-cerritos"
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Settings</h1>

      <div className="bg-white p-6 border rounded-xl max-w-xl">

        <label className="text-sm text-gray-600">
          Yelp Reviews Link
        </label>

        <input
          className="w-full border p-3 rounded-lg mt-2"
          value={yelp}
          onChange={(e) => setYelp(e.target.value)}
        />

        <p className="text-xs text-gray-500 mt-3">
          This link can be used in generated listings for trust signals.
        </p>

      </div>
    </div>
  );
}