import Link from 'next/link';
import Header from '../components/header';
import { Film } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';

async function fetchTMDB(endpoint) {
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

export default async function MoviesPage() {
    try {
        const popularData = await fetchTMDB('movie/popular?language=en-US&page=1');
        const popularMovies = popularData.results || [];

        return (
            <div className="min-h-screen bg-[#0a0f0a] text-[#e8ddd0] flex flex-col font-sans selection:bg-[#2d9b4e]/30 selection:text-white">
                <Header />

                <main className="flex-1 relative pt-6">
                    {/* SVG Noise Grain Overlay */}
                    <div
                        className="fixed inset-0 pointer-events-none opacity-[0.015] z-10 bg-[size:256px_256px] bg-repeat"
                        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')" }}
                    />

                    <div className="max-w-[1400px] mx-auto px-6 pb-16 relative z-20">
                        {/* Heading Section */}
                        <div className="mb-8">
                            <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#e8ddd0] tracking-wide flex items-center gap-3">
                                <Film size={32} className="text-[#2d9b4e]" />
                                Films
                            </h1>
                            <p className="text-sm text-[#e8ddd0]/40 italic mt-1">
                                Discover your next favorite film
                            </p>
                        </div>

                        {/* Movies Grid Component */}
                        <MovieGrid
                            items={popularMovies}
                            type="movie"
                        />
                    </div>
                </main>

                <Footer />
            </div>
        );
    } catch (error) {
        return (
            <div className="min-h-screen bg-[#0a0f0a] text-[#e8ddd0] flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-content-center p-8">
                    <div className="text-center">
                        <Film size={48} className="text-[#2d9b4e] opacity-30 mx-auto mb-4" />
                        <p className="text-sm text-[#e8ddd0]/40 italic">
                            Could not load films. Please try again later.
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}

function Footer() {
    return (
        <footer className="border-t border-[#96c896]/5 px-6 py-10 text-center bg-gradient-to-b from-transparent to-[#0a0f0a]/90 relative z-20">
            <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-2">
                <Link href="/" className="inline-flex items-baseline gap-[0.1rem] no-underline mb-1 group">
                    <span className="text-2xl font-bold text-[#2d9b4e] tracking-widest transition-colors duration-200 group-hover:text-[#39c262]">ILOVE</span>
                    <span className="text-2xl font-normal text-[#e8ddd0] tracking-widest">BIRYANI</span>
                </Link>
                <p className="text-[0.7rem] text-[#e8ddd0]/20 mt-1 tracking-wider">
                    Data from{" "}
                    <a
                        href="https://www.themoviedb.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2d9b4e] no-underline transition-colors duration-200 hover:text-[#39c262] hover:underline"
                    >
                        TMDB
                    </a>
                    <span className="inline-block mx-2 opacity-30">·</span>
                    All content provided by third parties
                </p>
            </div>
        </footer>
    );
}