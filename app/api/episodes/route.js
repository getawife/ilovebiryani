import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const showId = searchParams.get("showId");
    const season = searchParams.get("season");

    if (!showId || !season) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const url = `https://api.themoviedb.org/3/tv/${showId}/season/${season}?language=en-US`;
        const res = await fetch(url, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`, // Securely uses your existing server token!
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch from TMDB" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data.episodes || []);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}