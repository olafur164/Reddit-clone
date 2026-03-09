import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'

const API_BASE = 'https://www.reddit.com/'

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}


async function proxy(request: NextRequest, { params }: RouteContext<'/api/reddit/[...path]'>) {
    const path = (await params).path.join('/');

    const { searchParams } = new URL(request.url)

    const url = searchParams.size
        ? `${API_BASE}/${path}?${searchParams}`
        : `${API_BASE}/${path}`

    const response = await fetch(url, {
        method: request.method,
        headers: {
            'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
        body: request.method !== 'GET' ? await request.text() : undefined,
    })

    if (!response.ok) {
        return NextResponse.json(
            { error: `Reddit API error: ${response.status}` },
            { status: response.status, headers: CORS_HEADERS }
        );
    }
    const data = await response.json()
    return NextResponse.json(data, {
        status: response.status,
        headers: {
            ...CORS_HEADERS,
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
    })
}

export const GET = proxy;