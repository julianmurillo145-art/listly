import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/data/posted-vehicles.json");

export async function GET() {
  const raw = await fs.readFile(filePath, "utf8");
  return Response.json(JSON.parse(raw || "[]"));
}

export async function POST(req) {
  const body = await req.json();
  const vin = body.vin;
  const url = body.url;

  const raw = await fs.readFile(filePath, "utf8");
  const posted = JSON.parse(raw || "[]");

  if (!posted.some((item) => item.vin === vin || item.url === url)) {
    posted.push({
      vin,
      url,
      postedAt: new Date().toISOString(),
    });

    await fs.writeFile(filePath, JSON.stringify(posted, null, 2));
  }

  return Response.json({ ok: true, posted });
}