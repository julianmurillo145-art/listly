import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app", "data", "posted-vehicles.json");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return Response.json(JSON.parse(raw || "[]"), { headers: corsHeaders });
  } catch {
    return Response.json([], { headers: corsHeaders });
  }
}

export async function POST(req) {
  const body = await req.json();
  const vin = body.vin || "";
  const url = body.url || "";

  let posted = [];

  try {
    const raw = await fs.readFile(filePath, "utf8");
    posted = JSON.parse(raw || "[]");
  } catch {
    posted = [];
  }

  if (!posted.some((item) => item.vin === vin || item.url === url)) {
    posted.push({
      vin,
      url,
      postedAt: new Date().toISOString(),
    });

    await fs.writeFile(filePath, JSON.stringify(posted, null, 2));
  }

  return Response.json({ ok: true, posted }, { headers: corsHeaders });
}