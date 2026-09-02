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
        `movie/${heroMovie.id}/images?include_image_language=en,null`
      );
      const titleLogo = heroImages.logos?.find(
        (logo) => logo.iso_639_1 === "en" || logo.iso_639_1 === null
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
        <div className="absolute top-0 left-0 right-0 h-[80vh] min-h-[550px] -z-20 overflow-hidden pointer-events-none">
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            className="object-cover object-[center_20%] brightness-[0.45] saturate-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070907]/40 to-[#070907] to-[98%]" />
        </div>
      )}

      {backdrop && (
        <div
          className="absolute top-0 left-0 right-0 h-[90vh] bg-[length:100%_auto] bg-[center_-10%] blur-[140px] opacity-12 saturate-150 pointer-events-none -z-10"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
      )}

      <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-gradient-to-r from-[#070907]/60 via-transparent to-transparent pointer-events-none -z-10" />

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
    <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 pt-10 sm:pt-20 pb-12 sm:pb-16 flex flex-col justify-end">
      <div className="max-w-[680px]">
        {logoUrl ? (
          <div className="relative h-[80px] sm:h-[120px] max-w-[85%] mb-4">
            <Image
              src={logoUrl}
              alt={title}
              fill
              className="object-contain object-left-bottom"
            />
          </div>
        ) : (
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f3ede2] leading-[0.95] mb-4">
            {title}
          </h1>
        )}

        <div className="flex items-center gap-3 text-xs font-semibold text-[#9e988f] mb-4">
          {rating && rating !== "0.0" && (
            <span className="text-amber-400 font-bold">★ {rating}</span>
          )}
          {year && <span>{year}</span>}
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-[#9e988f] mb-6 line-clamp-3 sm:line-clamp-4">
          {overview}
        </p>

        <div className="flex items-center gap-3">
          <Link
            href={`/watch/movie/${movie.id}`}
            className="btn-cinema-primary"
          >
            <Play size={16} fill="currentColor" /> Watch Now
          </Link>
        </div>
      </div>
    </div>
  );
}
