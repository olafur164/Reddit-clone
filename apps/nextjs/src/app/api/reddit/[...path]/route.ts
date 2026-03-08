import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'

const API_BASE = 'https://www.reddit.com/'

async function proxy(request: NextRequest, { params }: RouteContext<'/api/reddit/[...path]'>) {
    const path = (await params).path.join('/');

    const { searchParams } = new URL(request.url)

    const url = searchParams.size
        ? `${API_BASE}/${path}?${searchParams}`
        : `${API_BASE}/${path}`

    const response = await fetch(url, {
        method: request.method,
        headers: {
            "User-Agent": "NextJS-Proxy/1.0",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
        body: request.method !== 'GET' ? await request.text() : undefined,
    })


    if (!response.ok) {
        return NextResponse.json(
            { error: `Reddit API error: ${response.status}` },
            { status: response.status }
        );
    }
    const data = await response.json()
    return NextResponse.json(data, {
        status: response.status,
        headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
    })
}

export const GET = proxy;