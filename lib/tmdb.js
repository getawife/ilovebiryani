export async function fetchTMDB(endpoint) {
    const res = await fetch(
        `https://api.themoviedb.org/3/${endpoint}`,
        {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
            },
            next: { revalidate: 3600 },
        }
    );
    if (!res.ok) throw new Error(`TMDB error: ${endpoint}`);
    return res.json();
}
