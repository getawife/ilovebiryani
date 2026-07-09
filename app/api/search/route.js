
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
            }
        });

        const data = await res.json();

        // Return the full data structure that header expects
        // Filter but keep the original structure
        const filteredResults = (data.results || [])
            .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path);

        return NextResponse.json({ results: filteredResults });
    } catch (error) {
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}