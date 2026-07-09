import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';

    try {
        const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;

        const res = await fetch(url, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
            },
        });

        if (!res.ok) {
            return NextResponse.json({ results: [], total_pages: 1 });
        }

        const data = await res.json();
        return NextResponse.json({
            results: data.results || [],
            total_pages: data.total_pages || 1,
            page: data.page || 1
        });
    } catch (error) {
        return NextResponse.json({ results: [], total_pages: 1 });
    }
}