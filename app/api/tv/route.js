import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const language = searchParams.get('language') || 'en-US';

    try {
        const url = `https://api.themoviedb.org/3/tv/popular?language=${language}&page=${page}`;

        const res = await fetch(url, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}