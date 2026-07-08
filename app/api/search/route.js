import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

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

        const filteredResults = (data.results || [])
            .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
            .map(item => ({
                id: item.id,
                title: item.title || item.name,
                type: item.media_type,
                year: (item.release_date || item.first_air_date || '').split('-')[0],
                poster: `https://image.tmdb.org/t/p/w200${item.poster_path}`
            }));

        return NextResponse.json({ results: filteredResults });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: 500 });
    }
}