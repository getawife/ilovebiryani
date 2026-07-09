import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const type = searchParams.get('type') || 'all';
    const genre = searchParams.get('genre') || 'all';
    const year = searchParams.get('year') || 'all';
    const country = searchParams.get('country') || 'all';
    const language = searchParams.get('language') || 'all';
    const rating = searchParams.get('rating') || 'all';

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

        if (!res.ok) {
            return NextResponse.json({ results: [] }, { status: res.status });
        }

        const data = await res.json();

        let filteredResults = (data.results || []).filter(
            item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
        );

        if (type !== 'all') {
            filteredResults = filteredResults.filter(item => item.media_type === type);
        }

        if (genre !== 'all') {
            const genreMap = {
                action: 28,
                adventure: 12,
                comedy: 35,
                drama: 18,
                'sci-fi': 878,
                horror: 27,
                thriller: 53
            };
            const targetGenreId = genreMap[genre.toLowerCase()];
            if (targetGenreId) {
                filteredResults = filteredResults.filter(item =>
                    item.genre_ids && item.genre_ids.includes(targetGenreId)
                );
            }
        }

        if (year !== 'all') {
            filteredResults = filteredResults.filter(item => {
                const releaseDate = item.release_date || item.first_air_date || '';
                const itemYear = releaseDate.split('-')[0];

                if (year === '2020s') return itemYear >= 2000 && itemYear <= 2029;
                if (year === '2010s') return itemYear >= 2010 && itemYear <= 2019;
                return itemYear === year;
            });
        }

        if (country !== 'all') {
            filteredResults = filteredResults.filter(item =>
                item.origin_country && item.origin_country.includes(country.toUpperCase())
            );
        }

        if (language !== 'all') {
            filteredResults = filteredResults.filter(item =>
                item.original_language === language.toLowerCase()
            );
        }

        if (rating !== 'all') {
            const minRating = parseFloat(rating);
            filteredResults = filteredResults.filter(item =>
                item.vote_average && item.vote_average >= minRating
            );
        }

        return NextResponse.json({ results: filteredResults });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}