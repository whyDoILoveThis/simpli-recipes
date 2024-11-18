import { NextResponse } from 'next/server';
import axios from 'axios';
import { start } from 'repl';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const serpApiKey = `${process.env.NEXT_PUBLIC_SERP_API_KEY}`;
    const serpApiUrl = `https://serpapi.com/search.json`;

    const serpApiResponse = await axios.get(serpApiUrl, {
      params: {
        engine: 'google_images',
        q: query,
        api_key: serpApiKey,
        start: start, // Used for pagination
        orientation: 'landscape'
      },
    });

    return NextResponse.json({ data: serpApiResponse.data });
  } catch (error) {
    console.error('Error fetching data from SerpAPI:', error);
    return NextResponse.json({ error: 'Failed to fetch data from SerpAPI' }, { status: 500 });
  }
}
