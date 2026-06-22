"use client";

import { useEffect, useState } from "react";

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function InventoryWatchPage() {
  const [status, setStatus] = useState("");
  const [report, setReport] = useState(null);
  useEffect(() => {
  async function loadStatus() {
    const res = await fetch("/api/status");
    const data = await res.json();

    if (data.checkedAt) {
      setReport({
        checkedAt: new Date(data.checkedAt).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        currentCount: data.vehicleCount,
        previousCount: data.vehicleCount,
        priceDrops: [],
        sold: [],
        newInventory: [],
      });
    }
  }

  loadStatus();
}, []);

  const checkInventory = async () => {
    setStatus("Checking inventory...");
    setReport(null);

    try {
      const res = await fetch("/api/inventory-watch");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Inventory check failed");

      setReport(data);
      setStatus("Inventory check complete.");
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Inventory Watch</h1>

      <button
        onClick={checkInventory}
        className="bg-black text-white px-5 py-3 rounded-xl font-semibold"
      >
        Check Inventory
      </button>

      {status && <p>{status}</p>}
{report?.checkedAt && (
  <p className="text-gray-500">
    Last Checked: {report.checkedAt}
  </p>
)}


{report && (
  <div
    className={`border rounded-xl p-4 font-bold text-lg ${
      report.priceDrops.length +
        report.sold.length +
        report.newInventory.length ===
      0
        ? "bg-green-100"
        : "bg-red-100"
    }`}
  >
    {report.priceDrops.length +
      report.sold.length +
      report.newInventory.length ===
    0
      ? "🟢 No Changes Detected"
      : `🔴 ${
          report.priceDrops.length +
          report.sold.length +
          report.newInventory.length
        } Changes Detected`}
  </div>
)}

      {report && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-xl p-4">
              <p className="text-gray-500">Current Inventory</p>
              <p className="text-3xl font-bold">{report.currentCount}</p>
            </div>
            <div className="border rounded-xl p-4">
              <p className="text-gray-500">Previous Inventory</p>
              <p className="text-3xl font-bold">{report.previousCount}</p>
            </div>
          </div>

          <Section title="🔻 Price Drops" items={report.priceDrops}>
            {(car) => (
              <>
                <b>{car.name}</b>
                <p>Stock: {car.stock}</p>
                <p>
                  {money(car.oldPrice)} → {money(car.newPrice)}  
                  {" "}Drop: {money(car.drop)}
                </p>
              </>
            )}
          </Section>

          <Section title="❌ Sold / Removed" items={report.sold}>
            {(car) => (
              <>
                <b>{car.name}</b>
                <p>Stock: {car.stock}</p>
                <p>Last Price: {money(car.lastPrice)}</p>
              </>
            )}
          </Section>

          <Section title="🆕 New Inventory" items={report.newInventory}>
            {(car) => (
              <>
                <b>{car.name}</b>
                <p>Stock: {car.stock}</p>
                <p>Price: {money(car.price)}</p>
              </>
            )}
          </Section>
        </>
      )}
    </main>
  );
}

function Section({ title, items, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3">
        {title} ({items.length})
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-500 border rounded-xl p-4">No changes.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.vin} className="border rounded-xl p-4">
              {children(item)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}