import Header from "../components/header";
import Footer from "../components/Footer";
import { Tv } from "lucide-react";
import MovieGrid from "../components/MovieGrid";
import { fetchTMDB } from "../../lib/tmdb";
import Image from "next/image";

export const metadata = {
  title: "Series",
};

export default async function TVPage() {
  let popularShows = [];

  try {
    const popularData = await fetchTMDB("tv/popular?language=en-US&page=1");
    popularShows = popularData.results || [];
  } catch (error) {
    console.error("Failed to fetch TV series:", error);
  }

  return (
    <div className="relative min-h-screen bg-[#070907] text-[#f3ede2] flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/biryani.jpg"
          alt="Biryani bg"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[#070907]/50 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070907] via-[#070907]/30 to-[#070907]/90" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20">
          <div className="mb-8 sm:mb-10 border-b border-white/[0.12] pb-6">
            <div className="flex items-center gap-3 mb-2">
              <Tv size={28} className="text-[#F4B942]" />

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider text-[#f3ede2] uppercase">
                Series
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#E0E0E0] max-w-[700px] leading-relaxed">
              Bingeable stories, current favourites, and acclaimed series across
              every genre.
            </p>
          </div>

          <MovieGrid items={popularShows} type="tv" />
        </main>

        <Footer />
      </div>
    </div>
  );
}
