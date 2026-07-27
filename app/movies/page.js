import Header from '../components/header';
import Footer from '../components/Footer';
import { Film } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { fetchTMDB } from '../../lib/tmdb';

export default async function MoviesPage() {
    let popularMovies = [];
    try {
        const popularData = await fetchTMDB('movie/popular?language=en-US&page=1');
        popularMovies = popularData.results || [];
    } catch (error) {
        console.error("Failed to fetch movies:", error);
    }

    if (popularMovies.length === 0) {
        return (
            <div className="min-h-screen bg-bg text-[#e8ddd0] flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center p-8">
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

    return (
        <div className="min-h-screen bg-bg text-[#e8ddd0] flex flex-col font-sans selection:bg-[#2d9b4e]/30 selection:text-white">
            <Header />

            <main className="flex-1 relative pt-6">
                {/* SVG Noise Grain Overlay */}
                <div
                    className="fixed inset-0 pointer-events-none opacity-[0.015] z-[1] bg-[size:256px_256px] bg-repeat"
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
}