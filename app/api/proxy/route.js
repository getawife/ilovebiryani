import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) return NextResponse.json({ error: 'Missing URL' }, { status: 400 });

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Referer': 'https://vidsrc.to/',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const body = await response.text();

        // Create a new response with corrected headers
        return new NextResponse(body, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}