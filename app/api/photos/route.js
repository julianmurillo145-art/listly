import JSZip from "jszip";

export async function POST(req) {
  try {
    const { photos, vin } = await req.json();

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return new Response("No photos provided", { status: 400 });
    }

    const zip = new JSZip();
    const folder = zip.folder(vin || "vehicle-photos");

    for (let i = 0; i < photos.length; i++) {
      try {
        const res = await fetch(photos[i], {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://www.genesisofcerritos.com/"
          }
        });

        if (!res.ok) continue;

        const buffer = await res.arrayBuffer();

        folder.file(`photo-${String(i + 1).padStart(2, "0")}.jpg`, buffer);
      } catch {
        continue;
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new Response(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${vin || "vehicle-photos"}.zip"`
      }
    });
  } catch {
    return new Response("Failed to create ZIP", { status: 500 });
  }
}