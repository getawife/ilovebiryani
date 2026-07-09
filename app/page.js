
import Link from 'next/link';
import Header from './components/header';
import { Flame, Tv, Star, Film, Play } from 'lucide-react';

/* ─── TMDB data fetchers ─── */
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

/* ─── Helpers ─── */
function getRatingColor(r) {
  const n = parseFloat(r);
  if (n >= 7.5) return "#2d9b4e";
  if (n >= 6) return "#c9a84c";
  return "#8b5a2b";
}

/* ─── Page ─── */
export default async function Home() {
  const [trendingData, popularData, topRatedData, trendingTVData] = await Promise.all([
    fetchTMDB('trending/movie/day?language=en-US&page=1'),
    fetchTMDB('movie/popular?language=en-US&page=1'),
    fetchTMDB('movie/top_rated?language=en-US&page=1'),
    fetchTMDB('trending/tv/day?language=en-US&page=1'),
  ]);

  const heroMovie = trendingData.results[0];
  const trendingMovies = trendingData.results.slice(1, 13);
  const popularMovies = popularData.results.slice(0, 12);
  const topRatedMovies = topRatedData.results.slice(0, 12);
  const trendingTV = trendingTVData.results.slice(0, 12);

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

        <HeroBanner movie={heroMovie} />

        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
          position: "relative",
          zIndex: 2
        }}>
          <ContentRow title="Trending Today" items={trendingMovies} type="movie" icon={<Flame size={16} color="#2d9b4e" />} />
          <ContentRow title="Popular on TV" items={trendingTV} type="tv" icon={<Tv size={16} color="#2d9b4e" />} />
          <ContentRow title="Top Rated" items={topRatedMovies} type="movie" icon={<Star size={16} color="#c9a84c" />} />
          <ContentRow title="Popular Movies" items={popularMovies} type="movie" icon={<Film size={16} color="#2d9b4e" />} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ─── Hero Banner ─────────────────────────────────────────── */
function HeroBanner({ movie }) {
  if (!movie) return null;

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const title = movie.title || movie.name;
  const overview = movie.overview || "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "0.0";
  const year = (movie.release_date || movie.first_air_date || "").split("-")[0];

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
            filter: "brightness(0.75) saturate(0.9)"
          }}
        />
      )}

      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(10,15,10,0.92) 0%, rgba(10,15,10,0.6) 50%, rgba(10,15,10,0.2) 100%)"
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(10,15,10,0.95) 0%, rgba(10,15,10,0) 60%)"
      }} />

      <div style={{
        position: "absolute",
        bottom: 0,
        left: "10%",
        width: "80%",
        height: "40%",
        background: "radial-gradient(ellipse at center, rgba(45,155,78,0.06) 0%, transparent 70%)",
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
        paddingBottom: "3.5rem"
      }}>
        <div style={{ maxWidth: 560 }} className="fade-up">
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.75rem"
          }}>
            <span style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#2d9b4e",
              background: "rgba(45,155,78,0.1)",
              padding: "0.15rem 0.6rem",
              borderRadius: "2px",
              border: "1px solid rgba(45,155,78,0.15)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}>
              <Film size={12} />
              Featured
            </span>
            <span style={{ fontSize: "0.6rem", fontWeight: 400, color: "rgba(232,221,208,0.3)", letterSpacing: "0.1em" }}>
              {year}
            </span>
            <span style={{ fontSize: "0.6rem", fontWeight: 600, color: getRatingColor(rating), letterSpacing: "0.05em" }}>
              ★ {rating}
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
            letterSpacing: "0.02em",
            lineHeight: 1.05,
            marginBottom: "0.75rem",
            fontWeight: 700,
            color: "#e8ddd0"
          }}>
            {title}
          </h1>

          <p style={{
            fontSize: "0.9rem",
            lineHeight: 1.8,
            color: "rgba(232,221,208,0.65)",
            marginBottom: "1.5rem",
            maxWidth: "90%",
            fontStyle: "italic"
          }}>
            "{overview}"
          </p>

          <Link href={`/watch/movie/${movie.id}`} className="hero-btn">
            <Play size={18} />
            Watch Now
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Content Row ─────────────────────────────────────────── */
function ContentRow({ title, items, type, icon }) {
  return (
    <section style={{ marginTop: "3rem" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.75rem",
        padding: "0 0.25rem"
      }}>
        {icon}
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.2rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#e8ddd0",
          fontWeight: 700,
          position: "relative"
        }}>
          {title}
          <span style={{
            position: "absolute",
            bottom: "-2px",
            left: 0,
            width: "40%",
            height: "2px",
            background: "linear-gradient(90deg, rgba(45,155,78,0.3), transparent)"
          }} />
        </h2>
      </div>
      <div className="scroll-row">
        {items.map((item) => (
          <MovieCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </section>
  );
}

/* ─── Movie Card ──────────────────────────────────────────── */
function MovieCard({ item, type }) {
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w400${item.poster_path}`
    : `https://placehold.co/400x600/1a221a/8a7a6a?text=No+Image`;

  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").split("-")[0];
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";
  const href = `/watch/${type || item.media_type || "movie"}/${item.id}`;

  return (
    <Link href={href} style={{
      display: "block",
      width: 160,
      textDecoration: "none",
      flexShrink: 0,
      transition: "all 0.3s ease"
    }}>
      <div className="card-hover" style={{
        background: "#111811",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(150,200,150,0.06)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}>
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "2/3",
          overflow: "hidden",
          background: "#0a0f0a"
        }}>
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="poster-img"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              filter: "brightness(0.92) saturate(0.95)"
            }}
          />

          <div style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            borderRadius: 4,
            padding: "0.15rem 0.5rem",
            fontSize: "0.6rem",
            fontWeight: 600,
            color: getRatingColor(rating),
            display: "flex",
            alignItems: "center",
            gap: 3,
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            ★ {rating}
          </div>

          <div className="play-overlay">
            <div className="play-btn">
              <Play size={18} fill="white" style={{ marginLeft: 2 }} />
            </div>
          </div>
        </div>

        <div style={{ padding: "0.6rem 0.7rem 0.7rem" }}>
          <p style={{
            fontWeight: 500,
            fontSize: "0.8rem",
            color: "#e8ddd0",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            marginBottom: "0.2rem",
            letterSpacing: "0.02em"
          }}>
            {title}
          </p>
          <p style={{
            fontSize: "0.65rem",
            color: "rgba(232,221,208,0.3)",
            letterSpacing: "0.08em"
          }}>
            {year || "Coming Soon"}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
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
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            color: "#2d9b4e",
            letterSpacing: "0.08em",
            fontWeight: 700
          }}>ILOVE</span>
          <span style={{
            fontFamily: "var(--font-display)",
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
          ILoveBiryani hosts no content itself. All content is provided by third parties.
        </p>
      </div>
    </footer>
  );
}