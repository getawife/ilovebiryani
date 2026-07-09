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

  const backdrop = heroMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
    : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f0a",
      color: "#e8ddd0",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      isolation: "isolate"
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
          zIndex: 5
        }} />

        {backdrop && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "65vh",
            zIndex: -2,
            overflow: "hidden",
            pointerEvents: "none"
          }}>
            <img
              src={backdrop}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
                filter: "brightness(0.22) saturate(0.75)"
              }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 20%, #0a0f0a 100%)"
            }} />
          </div>
        )}

        {backdrop && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backdrop})`,
            backgroundSize: "100% auto",
            backgroundPosition: "center -10%",
            filter: "blur(150px) opacity(0.14) saturate(2)",
            pointerEvents: "none",
            zIndex: -1
          }} />
        )}

        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to right, rgba(10,15,10,0.5) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: -1
        }} />

        <HeroBanner movie={heroMovie} logoPath={titleLogoPath} />

        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 1rem 4rem",
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

  const title = movie.title || movie.name;
  const overview = movie.overview || "";
  const logoUrl = logoPath ? `https://image.tmdb.org/t/p/w500${logoPath}` : null;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "clamp(440px, 62vh, 700px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 1rem 4.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end"
      }}>
        <div style={{ flex: 1, maxWidth: 650, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={title}
              style={{
                maxHeight: "clamp(65px, 12vh, 110px)",
                maxWidth: "85%",
                objectFit: "contain",
                objectPosition: "left bottom",
                marginBottom: "1.25rem",
                display: "block"
              }}
            />
          ) : (
            <h1 style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "0.85rem",
              fontWeight: 800,
              color: "#e8ddd0"
            }}>
              {title}
            </h1>
          )}

          <p style={{
            fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)",
            lineHeight: 1.8,
            color: "rgba(232,221,208,0.7)",
            marginBottom: "1.5rem",
            maxWidth: "100%"
          }}>
            {overview}
          </p>

          <div>
            <Link href={`/watch/movie/${movie.id}`} className="hero-btn" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "6px",
              background: "#2d9b4e",
              color: "#0a0f0a",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none"
            }}>
              <Play size={16} fill="#0a0f0a" />
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
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "2.5rem 1rem 2rem",
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
            textDecoration: "none"
          }}>TMDB</a>.
          <span style={{ display: "inline-block", margin: "0 0.5rem", opacity: 0.3 }}>·</span>
          All content is provided by third parties.
        </p>
      </div>
    </footer>
  );
}