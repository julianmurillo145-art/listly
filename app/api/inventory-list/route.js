import fs from "fs";
import path from "path";

const DATA_FILE = path.join(
  process.cwd(),
  "app",
  "data",
  "inventory-history.json"
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return Response.json(
        {
          checkedAt: null,
          vehicles: [],
        },
        { headers: corsHeaders }
      );
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    return Response.json(
      {
        checkedAt: data.checkedAt,
        count: data.vehicles?.length || 0,
        vehicles: data.vehicles || [],
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return Response.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}