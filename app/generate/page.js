"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [vehicleData, setVehicleData] = useState("");
  const [type, setType] = useState("Used");
  const [output, setOutput] = useState("");

  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [dueAtSigning, setDueAtSigning] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("");
  const [annualMiles, setAnnualMiles] = useState("");
  const [leaseNotes, setLeaseNotes] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");

    if (data) {
      const decoded = decodeURIComponent(data);
      setVehicleData(decoded);
    }
  }, []);

  const cleanDescription = (text = "") => {
    return text
      .replace(/Visit Norm Reeves Genesis of Cerritos.*$/i, "")
      .replace(/#\S+/g, "")
      .trim();
  };

  const generate = () => {
    let car = {};

    try {
      car = JSON.parse(vehicleData);
    } catch {
      setOutput("Could not read vehicle data. Make sure the bookmarklet pasted valid vehicle data.");
      return;
    }

    const vehicleName = car.title || "Vehicle Listing";
    const description = cleanDescription(car.description);
    const price = car.price || "Message for price";
    const vin = car.vin || "Available upon request";

    const mileage = car.mileage || "Ask for current mileage";
    const exterior = car.exterior || "Ask for exterior color";
    const interior = car.interior || "Ask for interior color";
    const drivetrain = car.drivetrain || "";
    const transmission = car.transmission || "";
    const engine = car.engine || "";

    let listing = "";

    if (type === "New") {
      listing = `
NEW GENESIS LEASE SPECIAL

${vehicleName}

Lease Example:
💰 ${monthlyPayment || "Message for current monthly payment"}
📄 Term: ${leaseTerm || "See current offer details"}
💵 Due at Signing: ${dueAtSigning || "Message for current due at signing"}
🛣️ Miles: ${annualMiles || "See current mileage allowance"}

Vehicle Details:
Exterior: ${exterior}
Interior: ${interior}
Drivetrain: ${drivetrain || "See vehicle details"}
Transmission: ${transmission || "See vehicle details"}
Engine: ${engine || "See vehicle details"}
VIN: ${vin}

${leaseNotes ? `Additional Notes:\n${leaseNotes}\n` : ""}

Message me directly for current availability, approval requirements, taxes, fees, and updated incentives.

Lease example is for informational purposes only. Terms, eligibility, taxes, fees, approval, and availability may vary.
`;
    } else {
      listing = `
${type.toUpperCase()} MARKETPLACE LISTING

${vehicleName}

💰 Price: ${price}
🛣️ Mileage: ${mileage}
🎨 Exterior: ${exterior}
🪑 Interior: ${interior}
VIN: ${vin}

Vehicle Details:
${drivetrain ? `Drivetrain: ${drivetrain}` : ""}
${transmission ? `Transmission: ${transmission}` : ""}
${engine ? `Engine: ${engine}` : ""}

${description ? `Description:\n${description}` : ""}

This vehicle is available now. Message me directly for availability, pricing, financing options, and test drive scheduling.

Serious inquiries welcome.
`;
    }

    setOutput(listing.trim());
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-semibold mb-2">Generate Listing</h1>

      <p className="text-gray-500 mb-8">
        Use the Listly bookmarklet, choose New / Used / CPO, then generate a Marketplace-ready listing.
      </p>

      <div className="bg-white p-6 rounded-2xl border space-y-4">
        <textarea
          className="w-full p-4 border rounded-xl h-44"
          placeholder="Vehicle data from Listly bookmarklet will appear here..."
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

        {type === "New" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border">
            <input
              className="p-3 border rounded-xl"
              placeholder="Monthly payment, e.g. $199/mo + tax"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
            />

            <input
              className="p-3 border rounded-xl"
              placeholder="Due at signing, e.g. $3,999"
              value={dueAtSigning}
              onChange={(e) => setDueAtSigning(e.target.value)}
            />

            <input
              className="p-3 border rounded-xl"
              placeholder="Lease term, e.g. 24 months"
              value={leaseTerm}
              onChange={(e) => setLeaseTerm(e.target.value)}
            />

            <input
              className="p-3 border rounded-xl"
              placeholder="Annual miles, e.g. 7,500 miles/year"
              value={annualMiles}
              onChange={(e) => setAnnualMiles(e.target.value)}
            />

            <textarea
              className="p-3 border rounded-xl md:col-span-2 h-24"
              placeholder="Optional lease notes, approval, taxes/fees, stock limitations, etc."
              value={leaseNotes}
              onChange={(e) => setLeaseNotes(e.target.value)}
            />
          </div>
        )}

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