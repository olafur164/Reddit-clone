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
            'Content-Type': 'application/json',
        },
        body: request.method !== 'GET' ? await request.text() : undefined,
    })
    console.log('response body', response.body)

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
}

export const GET = proxy;