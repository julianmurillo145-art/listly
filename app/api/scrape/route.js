import * as cheerio from "cheerio";

export async function POST(req) {
  const { url } = await req.json();

  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text();

    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    const image =
      $('meta[property="og:image"]').attr("content") ||
      "";

    const priceMatch = description.match(/\$[\d,]+/);
    const price = priceMatch ? priceMatch[0] : "";

    return Response.json({
      title,
      description,
      image,
      price
    });

  } catch (err) {
    return Response.json({
      error: "Failed to scrape page"
    });
  }
}