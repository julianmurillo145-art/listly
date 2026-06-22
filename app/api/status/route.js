import fs from "fs";
import path from "path";

const DATA_FILE = path.join(
  process.cwd(),
  "app",
  "data",
  "inventory-history.json"
);

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return Response.json({
        checkedAt: null,
        vehicleCount: 0,
      });
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    return Response.json({
      checkedAt: data.checkedAt,
      vehicleCount: data.vehicles?.length || 0,
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}