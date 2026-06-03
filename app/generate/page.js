"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [vehicleData, setVehicleData] = useState("");
  const [type, setType] = useState("Used");
  const [output, setOutput] = useState("");

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");

  if (data) {
    const decoded = decodeURIComponent(data);
    setVehicleData(decoded);

    try {
      const car = JSON.parse(decoded);

      const listing = `
${type.toUpperCase()} MARKETPLACE LISTING

${car.title || "Vehicle Listing"}

Price: ${car.price || "Contact for price"}
VIN: ${car.vin || "Available upon request"}

Details:
${car.description || ""}

Vehicle URL:
${car.url || ""}

${car.image ? `Photo: ${car.image}` : ""}

Message for pricing, availability, and test drive scheduling.
`;

      setOutput(listing);
    } catch {
      setOutput("Could not read vehicle data.");
    }
  }
}, []);

  const generate = () => {
    let car = {};

    try {
      car = JSON.parse(vehicleData);
    } catch {
      setOutput("Could not read vehicle data. Make sure the bookmarklet copied valid data.");
      return;
    }

    const listing = `
${type.toUpperCase()} MARKETPLACE LISTING

${car.title || "Vehicle Listing"}

Price: ${car.price || "Contact for price"}
VIN: ${car.vin || "Available upon request"}

Details:
${car.description || ""}

Vehicle URL:
${car.url || ""}

${car.image ? `Photo: ${car.image}` : ""}

Message for pricing, availability, and test drive scheduling.
`;

    setOutput(listing);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-semibold mb-2">Generate Listing</h1>

      <p className="text-gray-500 mb-8">
        Paste vehicle data or use the Listly bookmarklet.
      </p>

      <div className="bg-white p-6 rounded-2xl border space-y-4">
        <textarea
          className="w-full p-4 border rounded-xl h-48"
          placeholder="Vehicle data will appear here..."
          value={vehicleData}
          onChange={(e) => setVehicleData(e.target.value)}
        />

        <div className="flex gap-2">
          {["New", "Used", "CPO"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-5 py-2 rounded-full border ${
                type === t ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          className="w-full bg-black text-white p-4 rounded-xl"
        >
          Generate Marketplace Listing
        </button>
      </div>

      {output && (
        <div className="mt-8 bg-white border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Generated Listing</h2>

            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
            >
              Copy
            </button>
          </div>

          <pre className="whitespace-pre-wrap text-sm text-gray-700">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}