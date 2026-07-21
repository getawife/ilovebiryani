import Link from 'next/link';
import Image from 'next/image';
import Header from './components/header';
import { Flame, Tv, Trophy, Popcorn, Play, History } from 'lucide-react';
import { ContentRow } from './components/ContentRow';
import { ContinueWatchingRow } from './components/ContinueWatchingRow';
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

export default async function Home() {
  const [trendingData, popularData, topRatedData, trendingTVData] = await Promise.all([
    fetchTMDB('trending/movie/week?language=en-US&page=1'),
    fetchTMDB('movie/popular?language=en-US&page=1'),
    fetchTMDB('movie/top_rated?language=en-US&page=1'),
    fetchTMDB('trending/tv/day?language=en-US&page=1'),
  ]);

  const heroMovie = trendingData.results[0];
  const trendingMovies = trendingData.results.slice(1, 13);
  const popularMovies = popularData.results.slice(0, 12);
  const topRatedMovies = topRatedData.results.slice(0, 12);
  const trendingTV = trendingTVData.results.slice(0, 12);

  let titleLogoPath = null;
  try {
    const heroImages = await fetchTMDB(`movie/${heroMovie.id}/images?include_image_language=en,null`);
    const titleLogo = heroImages.logos?.find(
      (logo) => logo.iso_639_1 === 'en' || logo.iso_639_1 === null
    );
    titleLogoPath = titleLogo ? titleLogo.file_path : null;
  } catch (error) {
    console.error("Failed to fetch hero movie logo:", error);
  }

  // Define new server-side rows mapping to requested categories
  const serverRows = [
    { title: "Trending", iconName: "Flame", color: "#2d9b4e", data: trendingMovies, type: "movie" },
    { title: "Highest Rated", iconName: "Trophy", color: "#e8808a", data: topRatedMovies, type: "movie" },
    { title: "Personal Best", iconName: "Popcorn", color: "#7bc9a8", data: popularMovies, type: "movie" },
  ];

  const backdrop = heroMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
    : null;

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#e8ddd0] flex flex-col relative isolate">

      {backdrop && (
        <div className="absolute top-0 left-0 right-0 h-[80vh] min-h-[550px] -z-20 overflow-hidden pointer-events-none">
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            className="object-cover object-[center_20%] brightness-[0.45] saturate-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f0a]/40 to-[#0a0f0a] to-[98%]" />
        </div>
      )}

      {backdrop && (
        <div
          className="absolute top-0 left-0 right-0 h-[90vh] bg-[length:100%_auto] bg-[center_-10%] blur-[140px] opacity-12 saturate-150 pointer-events-none -z-10"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
      )}

      <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-gradient-to-r from-[#0a0f0a]/60 via-transparent to-transparent pointer-events-none -z-10" />

      <Header />

      <main className="flex-1 relative">
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.015] bg-repeat z-[5]"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')",
            backgroundSize: "256px 256px"
          }}
        />

        <HeroBanner movie={heroMovie} logoPath={titleLogoPath} />

        <div className="max-w-[1400px] mx-auto px-4 pb-16 relative z-20">

          {/* 1. CONTINUE WATCHING SHELF (Client Side Loader) */}
          <ContinueWatchingRow />

          {/* 2. SERVER FETCHED CONTENT ROWS */}
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
  const logoUrl = logoPath ? `https://image.tmdb.org/t/p/w500${logoPath}` : null;

  return (
    <div className="relative w-full h-[clamp(440px,62vh,700px)] flex flex-col justify-end">
      <div className="w-full max-w-[1400px] mx-auto px-4 pb-18 flex flex-col justify-end">
        <div className="flex-1 max-w-[650px] flex flex-col justify-end">
          {logoUrl ? (
            <div className="relative h-[clamp(65px,12vh,110px)] max-w-[85%] mb-5">
              <Image
                src={logoUrl}
                alt={title}
                fill
                className="object-contain object-left-bottom"
              />
            </div>
          ) : (
            <h1 className="font-sans text-[clamp(1.8rem,4vw,3.2rem)] tracking-tight leading-[1.1] mb-3 font-extrabold text-[#e8ddd0]">
              {title}
            </h1>
          )}

          <p className="text-[clamp(0.85rem,1.1vw,0.95rem)] leading-1.8 text-[#e8ddd0]/70 mb-6 max-w-full">
            {overview}
          </p>

          <div>
            <Link
              href={`/watch/movie/${movie.id}`}
              className="hero-btn inline-flex items-center gap-2 px-[1.2rem] py-[0.6rem] rounded-md bg-[#2d9b4e] text-[#0a0f0a] font-semibold text-[0.85rem] no-underline transition-colors hover:bg-[#258141]"
            >
              <Play size={16} fill="currentColor" /> Watch Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-4 text-center bg-gradient-to-b from-transparent to-[#0a0f0a]/90 relative">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-2">
        <Link href="/" className="inline-flex items-baseline gap-[0.1rem] no-underline mb-1">
          <span className="font-sans text-[1.6rem] text-[#2d9b4e] tracking-[0.08em] font-bold">ILOVE</span>
          <span className="font-sans text-[1.6rem] text-[#e8ddd0] tracking-[0.08em] font-normal">BIRYANI</span>
        </Link>
        <p className="text-[0.7rem] text-[#e8ddd0]/20 mt-1 tracking-wide">
          Data from{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-[#2d9b4e] no-underline hover:underline">
            TMDB
          </a>.
          <span className="inline-block mx-2 opacity-30">·</span>
          All content is provided by third parties.
        </p>
      </div>
    </footer>
  );
}