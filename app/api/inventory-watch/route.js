import { NextResponse } from "next/server";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL =
  "https://www.genesisofcerritos.com/preowned-vehicles/?_dFR%5Btype%5D%5B0%5D=Pre-Owned&_dFR%5Btype%5D%5B1%5D=Certified%2520Pre-Owned";

function inventoryUrl(pageNumber) {
  if (pageNumber === 1) return BASE_URL;

  return `https://www.genesisofcerritos.com/preowned-vehicles/?_p=${pageNumber}&_dFR%5Btype%5D%5B0%5D=Pre-Owned&_dFR%5Btype%5D%5B1%5D=Certified%2520Pre-Owned`;
}
const CHROME_PROFILE = "C:\\Users\\Julia\\listly\\chrome-profile";

const DATA_FILE = path.join(
  process.cwd(),
  "app",
  "data",
  "inventory-history.json"
);

function extractVehicles(html) {
  const vehicles = [];
  const regex = /data-vehicle=(['"])(.*?)\1/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    try {
      const jsonText = match[2].replace(/&quot;/g, '"');
      const vehicle = JSON.parse(jsonText);

      vehicles.push({
        vin: vehicle.vin,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        trim: vehicle.trim,
        price: Number(vehicle.price || 0),
        stock: vehicle.stock,
      });
    } catch {}
  }

  return vehicles;
}

function readPreviousInventory() {
  if (!fs.existsSync(DATA_FILE)) return [];

  try {
    const saved = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return saved.vehicles || [];
  } catch {
    return [];
  }
}

function saveInventory(vehicles) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        vehicles,
      },
      null,
      2
    )
  );
}

function vehicleName(v) {
  return `${v.year} ${v.make} ${v.model} ${v.trim || ""}`.trim();
}

export async function GET() {
  let context;

  try {
    const previous = readPreviousInventory();

    context = await chromium.launchPersistentContext(CHROME_PROFILE, {
      headless: false,
      channel: "chrome",
    });

    const page = await context.newPage();

    let current = [];

for (let pageNumber = 1; pageNumber <= 10; pageNumber++) {
  const url = inventoryUrl(pageNumber);

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(5000);

  const html = await page.content();
  const vehicles = extractVehicles(html);

  console.log(`Page ${pageNumber}: ${vehicles.length} vehicles`);

  if (vehicles.length === 0) break;

  current.push(...vehicles);
}

current = Array.from(
  new Map(current.map((v) => [v.vin, v])).values()
);

    await context.close();

    const previousByVin = new Map(previous.map((v) => [v.vin, v]));
    const currentByVin = new Map(current.map((v) => [v.vin, v]));

    const sold = previous
      .filter((oldCar) => !currentByVin.has(oldCar.vin))
      .map((v) => ({
        name: vehicleName(v),
        vin: v.vin,
        lastPrice: v.price,
        stock: v.stock,
      }));

    const newInventory = current
      .filter((newCar) => !previousByVin.has(newCar.vin))
      .map((v) => ({
        name: vehicleName(v),
        vin: v.vin,
        price: v.price,
        stock: v.stock,
      }));

    const priceDrops = current
      .filter((car) => {
        const oldCar = previousByVin.get(car.vin);
        return oldCar && Number(car.price) < Number(oldCar.price);
      })
      .map((car) => {
        const oldCar = previousByVin.get(car.vin);

        return {
          name: vehicleName(car),
          vin: car.vin,
          oldPrice: oldCar.price,
          newPrice: car.price,
          drop: oldCar.price - car.price,
          stock: car.stock,
        };
      });

    saveInventory(current);

    return NextResponse.json({
  message: "Inventory checked and saved",
  checkedAt: new Date().toLocaleTimeString([], {
  hour: "numeric",
  minute: "2-digit",
}),
  currentCount: current.length,
  previousCount: previous.length,
  priceDrops,
  sold,
  newInventory,
});
  } catch (error) {
    if (context) await context.close();

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}