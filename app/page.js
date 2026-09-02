import Link from "next/link";
import Image from "next/image";
import Header from "./components/header";
import Footer from "./components/Footer";
import { Play } from "lucide-react";
import { ContentRow } from "./components/ContentRow";
import { ContinueWatchingRow } from "./components/ContinueWatchingRow";
import { fetchTMDB } from "../lib/tmdb";

export default async function Home() {
  const [trendingData, popularData, topRatedData] = await Promise.all([
    fetchTMDB("trending/movie/week?language=en-US&page=1"),
    fetchTMDB("movie/popular?language=en-US&page=1"),
    fetchTMDB("movie/top_rated?language=en-US&page=1"),
  ]);

  const heroMovie = trendingData.results?.[0];
  const trendingMovies = trendingData.results?.slice(1, 15) || [];
  const popularMovies = popularData.results?.slice(0, 14) || [];
  const topRatedMovies = topRatedData.results?.slice(0, 14) || [];

  let titleLogoPath = null;
  if (heroMovie?.id) {
    try {
      const heroImages = await fetchTMDB(
        `movie/${heroMovie.id}/images?include_image_language=en,null`,
      );
      const titleLogo = heroImages.logos?.find(
        (logo) => logo.iso_639_1 === "en" || logo.iso_639_1 === null,
      );
      titleLogoPath = titleLogo ? titleLogo.file_path : null;
    } catch (error) {
      console.error("Failed to fetch movie logo:", error);
    }
  }

  const serverRows = [
    {
      title: "Trending",
      iconName: "Flame",
      color: "#22c55e",
      data: trendingMovies,
      type: "movie",
    },
    {
      title: "Top Rated",
      iconName: "Trophy",
      color: "#f59e0b",
      data: topRatedMovies,
      type: "movie",
    },
    {
      title: "Popular Right Now",
      iconName: "Popcorn",
      color: "#22c55e",
      data: popularMovies,
      type: "movie",
    },
  ];

  const backdrop = heroMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
    : null;

  return (
    <div className="min-h-screen bg-[#070907] text-[#f3ede2] flex flex-col relative isolate">
      {backdrop && (
        <div className="absolute top-0 left-0 right-0 h-[85vh] min-h-[600px] -z-20 overflow-hidden pointer-events-none">
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            className="object-cover object-[center_20%] brightness-[0.4] saturate-[0.8]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070907]/50 to-[#070907] to-[98%]" />
        </div>
      )}

      {backdrop && (
        <div
          className="absolute top-0 left-0 right-0 h-[90vh] bg-[length:100%_auto] bg-[center_-10%] blur-[140px] opacity-15 saturate-150 pointer-events-none -z-10"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
      )}

      <div className="absolute top-0 left-0 bottom-0 w-2/3 bg-gradient-to-r from-[#070907]/80 via-[#070907]/30 to-transparent pointer-events-none -z-10" />

      <Header />

      <main className="flex-1 relative">
        <HeroBanner movie={heroMovie} logoPath={titleLogoPath} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-20 relative z-10">
          <ContinueWatchingRow />

          {serverRows.map((row) => (
            <ContentRow
              key={row.title}
              title={row.title}
              iconName={row.iconName}
              color={row.color}
              items={row.data}
              type={row.type}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function HeroBanner({ movie, logoPath }) {
  if (!movie) return null;

  const title = movie.title || movie.name;
  const overview = movie.overview || "";
  const logoUrl = logoPath
    ? `https://image.tmdb.org/t/p/w500${logoPath}`
    : null;
  const year = (movie.release_date || "").split("-")[0];
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 pt-12 sm:pt-24 pb-16 sm:pb-20 flex flex-col justify-end">
      <div className="w-full max-w-[850px]">
        {logoUrl ? (
          <div className="relative h-[90px] sm:h-[140px] max-w-[90%] mb-5">
            <Image
              src={logoUrl}
              alt={title}
              fill
              className="object-contain object-left-bottom"
            />
          </div>
        ) : (
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#f3ede2] leading-[0.95] mb-5">
            {title}
          </h1>
        )}

        <div className="flex items-center gap-3 text-sm font-bold text-[#E0E0E0] mb-4">
          {rating && rating !== "0.0" && (
            <span className="card-badge-pill">
              <span className="text-amber-400 font-bold">★ {rating}</span>
            </span>
          )}
          {year && (
            <span className="bg-white/[0.08] border border-white/[0.14] px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#f3ede2]">
              {year}
            </span>
          )}
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-[#E0E0E0] mb-7 line-clamp-3 sm:line-clamp-4 max-w-[760px]">
          {overview}
        </p>

        <div className="flex items-center gap-4">
          <Link
            href={`/watch/movie/${movie.id}`}
            className="btn-cinema-primary"
          >
            <Play size={18} fill="currentColor" /> Watch Now
          </Link>
        </div>
      </div>
    </div>
  );
}
