// ✅ This API route fetches & proxies any image safely.
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get('url')
  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 })
  }

  try {
    const res = await fetch(imageUrl)
    if (!res.ok) throw new Error('Image fetch failed')

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // cache for 1 day
      },
    })
  } catch (err) {
    console.error('Image proxy error:', err)
    return NextResponse.json({ error: 'Could not fetch image' }, { status: 500 })
  }
}
