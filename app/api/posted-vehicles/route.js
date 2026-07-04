import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
});
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS posted_vehicles (
      id SERIAL PRIMARY KEY,
      vin TEXT UNIQUE,
      url TEXT UNIQUE NOT NULL,
      posted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function GET() {
  await ensureTable();

  const vehicles = await sql`
    SELECT vin, url, posted_at AS "postedAt"
    FROM posted_vehicles
    ORDER BY posted_at DESC
  `;

  return Response.json(vehicles, {
  headers: corsHeaders,
});
}

export async function POST(req) {
  await ensureTable();

  const body = await req.json();
  const vin = body.vin || "";
  const url = body.url || "";

  if (!url) {
    return Response.json(
  { error: "Missing url" },
  { status: 400, headers: corsHeaders }
);
  }

  await sql`
    INSERT INTO posted_vehicles (vin, url)
    VALUES (${vin}, ${url})
    ON CONFLICT (url) DO NOTHING
  `;

  const vehicles = await sql`
    SELECT vin, url, posted_at AS "postedAt"
    FROM posted_vehicles
    ORDER BY posted_at DESC
  `;

  return Response.json(
  { ok: true, posted: vehicles },
  { headers: corsHeaders }
);
}