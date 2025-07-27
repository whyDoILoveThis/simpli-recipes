// ✅ utils for fetching images from your Bing scraper API

export const getBingImages = async (term: string): Promise<string[]> => {
  if (!term || typeof term !== "string") return [];

  try {
    const res = await fetch("/api/bing-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ term }),
    });

    if (!res.ok) throw new Error("Failed to fetch images");

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("getBingImages error:", err);
    return [];
  }
};
