"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [vehicleData, setVehicleData] = useState("");
  const [type, setType] = useState("Used");
  const [output, setOutput] = useState("");
  const [carInfo, setCarInfo] = useState(null);

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

      try {
        setCarInfo(JSON.parse(decoded));
      } catch {
        setCarInfo(null);
      }
    }
  }, []);

  const cleanDescription = (text = "") => {
    return text
      .replace(/Visit Norm Reeves Genesis of Cerritos.*$/i, "")
      .replace(/#\S+/g, "")
      .trim();
  };

  const titleCase = (text = "") => {
    return text
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace("Awd", "AWD")
      .replace("Fwd", "FWD")
      .replace("Rwd", "RWD")
      .replace("Ev", "EV");
  };

  const parseVehicleData = () => {
    try {
      const car = JSON.parse(vehicleData);
      setCarInfo(car);
      return car;
    } catch {
      setOutput("Could not read vehicle data. Make sure the bookmarklet pasted valid vehicle data.");
      return null;
    }
  };

  const buildPowertrain = (car) => {
    const items = [];

    if (car.drivetrain) items.push(car.drivetrain);
    if (car.transmission) items.push(car.transmission);
    if (car.engine) items.push(car.engine);

    if (!items.length) return "";

    return `Powertrain:
${items.map((item) => `✅ ${item}`).join("\n")}`;
  };

  const buildKeyFeatures = (car) => {
  const features = Array.isArray(car.features) ? car.features : [];
  if (!features.length) return "";

  const priority = [
  "Rubicon",
  "Tow Package",
  "4WD",
  "AWD",
  "Heads-Up Display",
  "Panoramic Roof",
  "Sunroof",
  "Ventilated Seats",
  "Heated Seats",
  "Leather Seats",
  "Navigation",
  "Apple Carplay",
  "Android Auto",
  "Adaptive Cruise Control",
  "Blind Spot Monitor",
  "Backup Camera",
  "Premium Audio",
  "Third Row Seating",
  "Remote Start"
];

  const picked = [];

  priority.forEach((wanted) => {
    const found = features.find((feature) =>
      feature.toLowerCase().includes(wanted.toLowerCase())
    );

    if (found && !picked.includes(found)) picked.push(found);
  });

  features.forEach((feature) => {
    if (picked.length < 5 && !picked.includes(feature)) picked.push(feature);
  });

  return `⭐ Highlights:
${picked.slice(0, 5).map((feature) => `✅ ${titleCase(feature)}`).join("\n")}`;
};

  const generate = () => {
    const car = parseVehicleData();
    if (!car) return;

    const vehicleName = (car.title || "Vehicle Listing")
  .replace(/\b(AWD|RWD|FWD|4WD)\b/gi, "")
  .replace(/\b(Sport Utility|4dr Car|Sedan|Coupe|Convertible|Hatchback|Wagon)\b/gi, "")
  .replace(/\s+/g, " ")
  .trim();
    const description = cleanDescription(car.description);
    const price = car.price || "Message for price";
    const vin = car.vin || "Available upon request";
    const mileage = car.mileage || "Ask for current mileage";
    const exterior = car.exterior || "Ask for exterior color";
    const interior = car.interior || "Ask for interior color";

    const featureBlock = buildKeyFeatures(car);
    const powertrainBlock = buildPowertrain(car);

    const cpoBlock = car.cpo
  ? `🏆 Genesis Certified Pre-Owned Benefits:
✅ 6-Year / 75,000-Mile Limited Warranty*
✅ 10-Year / 100,000-Mile Powertrain Warranty*
✅ 5 Years of Roadside Assistance
✅ 3 Years of Genesis Connected Services

*Coverage calculated from the vehicle's original in-service date.`
  : "";

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
🎨 Exterior: ${exterior}
🪑 Interior: ${interior}
VIN: ${vin}

${featureBlock}

${powertrainBlock}

${leaseNotes ? `Additional Notes:\n${leaseNotes}\n` : ""}

Message me directly for current availability, approval requirements, taxes, fees, and updated incentives.

Lease example is for informational purposes only. Terms, eligibility, taxes, fees, approval, and availability may vary.
`;
    } else {
      listing = `${vehicleName} for sale!

Beautiful ${exterior} exterior with ${interior} interior.

${featureBlock}

${cpoBlock ? `${cpoBlock}\n\n` : ""}Mileage: ${Number(mileage).toLocaleString()}

Free CarFax available upon request.
Cash, financing, and trade-ins welcome.

Call/Text 949-281-8306 or message me here on Facebook.
Se habla español.

Let me know if you are interested!`;
    }

    const finalListing = listing.trim();

setOutput(finalListing);

const history = JSON.parse(
  localStorage.getItem("listly_history") || "[]"
);

const updatedHistory = history.filter((item) => item.vin !== vin);

updatedHistory.unshift({
  title: vehicleName,
  vin,
  price,
  mileage,
  type,
  listing: finalListing,
  photos: car.photos || [],
  createdAt: new Date().toISOString(),
});

localStorage.setItem(
  "listly_history",
  JSON.stringify(updatedHistory)
);
  };

  const copyPhotoLinks = async () => {
    const photos = carInfo?.photos || [];
    if (!photos.length) {
      alert("No photos found.");
      return;
    }

    await navigator.clipboard.writeText(photos.join("\n"));
    alert("Photo links copied!");
  };

  const downloadAllPhotos = async () => {
    const car = carInfo || parseVehicleData();
    const photos = car?.photos || [];

    if (!photos.length) {
      alert("No photos found.");
      return;
    }

    const res = await fetch("/api/photos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        photos,
        vin: car.vin || "vehicle-photos",
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
    a.download = `${car.vin || "vehicle-photos"}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  const copyListing = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert("Listing copied!");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = output;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Listing copied!");
    }
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
          onChange={(e) => {
            setVehicleData(e.target.value);
            try {
              setCarInfo(JSON.parse(e.target.value));
            } catch {
              setCarInfo(null);
            }
          }}
        />

        {carInfo?.photos?.length > 0 && (
  <div className="bg-gray-50 border rounded-xl p-4">
    <p className="font-semibold mb-3">
      Photos Found: {carInfo.photos.length}
    </p>

    <div className="flex gap-2 mb-4">
      <button
        onClick={downloadAllPhotos}
        className="px-4 py-2 rounded-lg bg-black text-white"
      >
        Download All Photos
      </button>

      <button
        onClick={copyPhotoLinks}
        className="px-4 py-2 rounded-lg border bg-white text-black"
      >
        Copy Photo Links
      </button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
      {carInfo.photos.map((photo, index) => (
        <a
          key={index}
          href={photo}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={photo}
            alt={`Vehicle photo ${index + 1}`}
            className="w-full h-28 object-cover rounded-lg border bg-white"
          />
        </a>
      ))}
    </div>
  </div>
)}

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
              onClick={copyListing}
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