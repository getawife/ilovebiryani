import Header from '../components/header';
import Footer from '../components/Footer';
import { Tv } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { fetchTMDB } from '../../lib/tmdb';

export default async function TVPage() {
    const popularData = await fetchTMDB('tv/popular?language=en-US&page=1');
    const popularShows = popularData.results || [];

    return (
        <div className="flex min-h-screen flex-col bg-bg text-[#e8ddd0]">
            <Header />
            <main className="relative flex-1 pt-6">
                {/* SVG Film Grain Noise Overlay */}
                <div
                    className="pointer-events-none fixed inset-0 z-[1] opacity-[0.015] bg-repeat bg-[size:256px_256px]"
                    style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')" }}
                />

                <div className="relative z-[2] mx-auto max-w-[1400px] px-6 pb-16">
                    <div className="mb-8">
                        <h1 className="flex items-center gap-3 font-sans text-[clamp(2rem,4vw,3rem)] font-bold tracking-wide text-[#e8ddd0]">
                            <Tv size={32} className="text-[#2d9b4e]" />
                            Series
                        </h1>
                        <p className="mt-1 text-sm italic text-[rgba(232,221,208,0.4)]">
                            Binge-worthy shows worth your time
                        </p>
                    </div>

                    <MovieGrid
                        items={popularShows}
                        type="tv"
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
}