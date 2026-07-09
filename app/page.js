import Link from 'next/link';
import Header from './components/header';
import { Flame, Tv, Trophy, Popcorn, Play } from 'lucide-react';
import { ContentRow } from './components/ContentRow';

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

function getRatingColor(r) {
  const n = parseFloat(r);
  if (n >= 7.5) return "#2d9b4e";
  if (n >= 6) return "#c9a84c";
  return "#8b5a2b";
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

  const rows = [
    { title: "What's Hot", iconName: "Flame", color: "#2d9b4e", data: trendingMovies, type: "movie" },
    { title: "Binge Material", iconName: "Tv", color: "#c9a84c", data: trendingTV, type: "tv" },
    { title: "Critics' Choice", iconName: "Trophy", color: "#e8808a", data: topRatedMovies, type: "movie" },
    { title: "Crowd Favorites", iconName: "Popcorn", color: "#7bc9a8", data: popularMovies, type: "movie" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f0a",
      color: "#e8ddd0",
      display: "flex",
      flexDirection: "column"
    }}>
      <Header />
      <main style={{ flex: 1, position: "relative" }}>
        <div style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.015,
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          zIndex: 1
        }} />
        <HeroBanner movie={heroMovie} logoPath={titleLogoPath} />
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
          position: "relative",
          zIndex: 2
        }}>
          {rows.map((row) => (
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

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const title = movie.title || movie.name;
  const overview = movie.overview || "";
  const logoUrl = logoPath ? `https://image.tmdb.org/t/p/w500${logoPath}` : null;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "clamp(440px, 65vh, 720px)",
      overflow: "hidden",
      isolation: "isolate"
    }}>
      {backdrop && (
        <img
          src={backdrop}
          alt={title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            filter: "brightness(0.6) saturate(0.9)"
          }}
        />
      )}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(10,15,10,0.9) 0%, rgba(10,15,10,0.5) 50%, rgba(10,15,10,0.1) 100%)"
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(10,15,10,0.95) 0%, rgba(10,15,10,0) 50%)"
      }} />
      <div style={{
        position: "absolute",
        bottom: 0,
        left: "10%",
        width: "80%",
        height: "40%",
        background: "radial-gradient(ellipse at center, rgba(45,155,78,0.05) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{
        position: "relative",
        height: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingBottom: "4.5rem"
      }}>
        <div style={{ flex: 1, maxWidth: 640, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} className="fade-up">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={title}
              style={{
                maxHeight: "clamp(70px, 14vh, 130px)",
                maxWidth: "100%",
                objectFit: "contain",
                objectPosition: "left bottom",
                marginBottom: "1.5rem",
                display: "block"
              }}
            />
          ) : (
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              marginBottom: "1rem",
              color: "#e8ddd0",
              letterSpacing: "-0.02em"
            }}>
              {title}
            </h1>
          )}

          <p style={{
            fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
            lineHeight: 1.8,
            color: "rgba(232,221,208,0.75)",
            marginBottom: "1.75rem",
            maxWidth: "100%"
          }}>
            {overview}
          </p>

          <div>
            <Link href={`/watch/movie/${movie.id}`} className="hero-btn">
              <Play size={18} />
              Watch Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(150,200,150,0.05)",
      padding: "2.5rem 1.5rem 2rem",
      textAlign: "center",
      background: "linear-gradient(180deg, transparent, rgba(10,15,10,0.9))",
      position: "relative"
    }}>
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: "0.1rem",
          textDecoration: "none",
          marginBottom: "0.25rem"
        }}>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.6rem",
            color: "#2d9b4e",
            letterSpacing: "0.08em",
            fontWeight: 700
          }}>ILOVE</span>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.6rem",
            color: "#e8ddd0",
            letterSpacing: "0.08em",
            fontWeight: 400
          }}>BIRYANI</span>
        </Link>
        <p style={{
          fontSize: "0.7rem",
          color: "rgba(232,221,208,0.2)",
          marginTop: "0.25rem",
          letterSpacing: "0.04em"
        }}>
          Data from{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" style={{
            color: "#2d9b4e",
            textDecoration: "none",
            transition: "color 0.2s ease"
          }}>TMDB</a>.
          <span style={{ display: "inline-block", margin: "0 0.5rem", opacity: 0.3 }}>·</span>
          All content is provided by third parties.
        </p>
      </div>
    </footer>
  );
}