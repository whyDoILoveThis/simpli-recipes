import { NextRequest } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    console.log("RAW BODY:", bodyText);
    const { term } = JSON.parse(bodyText);

    if (!term || typeof term !== "string") {
      return new Response(JSON.stringify({ error: "Invalid term" }), { status: 400 });
    }

    const encodedTerm = encodeURIComponent(term.trim().toLowerCase().replace(/\s+/g, ""));
    console.log("Encoded Term:", encodedTerm);

    const searchUrl = `https://www.bing.com/images/search?q=${encodedTerm}`;
    console.log("Search URL:", searchUrl);
    
    const html = await fetch(searchUrl).then(res => res.text());
    const $ = cheerio.load(html);

    const images: string[] = [];

    $("a.iusc").each((_, el) => {
      const m = $(el).attr("m");
      if (m) {
        try {
          const meta = JSON.parse(m);
          if (meta.murl) images.push(meta.murl);
        } catch {}
      }
    });

    return Response.json(images.slice(0, 20));
  } catch (err) {
    console.error("Bing scrape failed:", err);
    return new Response(JSON.stringify({ error: "Bing scrape failed" }), { status: 500 });
  }
}
