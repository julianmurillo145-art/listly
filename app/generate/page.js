"use client";

import { useState } from "react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [type, setType] = useState("Used");
  const [output, setOutput] = useState("");

  const extractMeta = (html, name) => {
    const regex = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
    return html.match(regex)?.[1] || "";
  };

  const generate = () => {
    const title =
      extractMeta(source, "og:title") ||
      "Vehicle Listing";

    const description =
      extractMeta(source, "description") ||
      extractMeta(source, "og:description") ||
      "";

    const image =
      extractMeta(source, "og:image");

    const price = description.match(/\$[\d,]+/)?.[0] || "Contact for price";

    const listing = `
${type.toUpperCase()} MARKETPLACE LISTING

${title}

Price: ${price}

Details:
${description}

Vehicle URL:
${url}

${image ? `Photo: ${image}` : ""}

Message for pricing, availability, and test drive scheduling.
`;

    setOutput(listing);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-semibold mb-2">Generate Listing</h1>

      <p className="text-gray-500 mb-8">
        Paste the vehicle URL and page source to generate a Marketplace-ready listing.
      </p>

      <div className="bg-white p-6 rounded-2xl border space-y-4">
        <input
          className="w-full p-4 border rounded-xl"
          placeholder="Paste vehicle URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <textarea
          className="w-full p-4 border rounded-xl h-48"
          placeholder="Paste page source here..."
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

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
              onClick={() => navigator.clipboard.writeText(output)}
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