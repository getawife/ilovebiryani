import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from "../../../components/header";
import PlayerSection from "./PlayerSection";
import WatchPageClient from "./WatchPageClient";
import { Film, User, Star, Clock, Play, Calendar } from 'lucide-react';

async function getMediaData(type, id) {
  const url = `https://api.themoviedb.org/3/${type}/${id}?append_to_response=credits,images,watch/providers,recommendations&language=en-US`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

function getRatingColor(r) {
  const n = parseFloat(r);
  if (n >= 7.5) return "#2d9b4e";
  if (n >= 6) return "#c9a84c";
  return "#8b5a2b";
}

function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default async function WatchPage({ params }) {
  const { type, id } = await params;
  const data = await getMediaData(type, id);

  if (!data) {
    notFound();
  }

  const isReleased = ["Released", "Returning Series", "Ended"].includes(data.status);
  const title = data.title || data.name;
  const overview = data.overview || "No synopsis available.";
  const rating = data.vote_average ? data.vote_average.toFixed(1) : "0.0";
  const year = (data.release_date || data.first_air_date || "").split("-")[0];
  const genres = data.genres || [];
  const cast = data.credits?.cast?.slice(0, 8) || [];
  const backdrops = data.images?.backdrops?.slice(0, 6) || [];
  const recommendations = data.recommendations?.results?.slice(0, 12) || [];
  const runtime = type === "movie" ? formatRuntime(data.runtime) : null;
  const seasons = type === "tv" ? data.number_of_seasons : null;
  const episodes = type === "tv" ? data.number_of_episodes : null;
  const validSeasons = (data.seasons || []).filter((s) => s.season_number > 0);

  const backdropUrl = data.backdrop_path
    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    : null;
  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : null;

  const logoAsset = data.images?.logos?.find(
    (logo) => logo.iso_639_1 === 'en' || logo.iso_639_1 === null
  );
  const logoUrl = logoAsset ? `https://image.tmdb.org/t/p/w500${logoAsset.file_path}` : null;

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
      {/* Dynamic Global CSS Overrides injected safely to cleanly rewrite layouts on mobile viewports */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .responsive-hero-grid {
          display: grid;
          grid-template-columns: minmax(140px, 220px) 1fr;
          gap: clamp(1.5rem, 4vw, 3rem);
          alignItems: flex-end;
        }
        @media (max-width: 680px) {
          .responsive-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            justify-items: center !important;
          }
          .responsive-hero-grid .poster-container {
            width: clamp(140px, 45vw, 180px) !important;
            margin: 0 auto !important;
          }
          .responsive-hero-grid .meta-pills-row {
            justify-content: center !important;
          }
          .responsive-hero-grid .logo-img {
            margin: 0 auto 1.25rem !important;
          }
          .responsive-hero-grid .synopsis-text {
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }
      `}} />

      <Header />

      {/* FIXED BACKGROUND CANVASES */}
      {backdropUrl && (
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
            src={backdropUrl}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              filter: "brightness(0.18) saturate(0.65)"
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 10%, #0a0f0a 95%)"
          }} />
        </div>
      )}

      {/* AMBIENT GLOW LAYER */}
      {posterUrl && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${posterUrl})`,
          backgroundSize: "100% auto",
          backgroundPosition: "center -10%",
          filter: "blur(140px) opacity(0.12) saturate(1.8)",
          pointerEvents: "none",
          zIndex: -1
        }} />
      )}

      {/* Layout Grid Container */}
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        width: "100%",
        padding: "clamp(80px, 12vh, 150px) 1rem 0rem"
      }}>
        <div className="responsive-hero-grid">
          {/* Movie Poster Wrapper */}
          <div className="poster-container" style={{ flexShrink: 0, width: "100%" }}>
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                style={{
                  width: "100%",
                  aspectRatio: "2/3",
                  objectFit: "cover",
                  borderRadius: 8,
                  boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                aspectRatio: "2/3",
                borderRadius: 8,
                background: "#111811",
                border: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(232,221,208,0.2)",
                fontSize: "0.8rem"
              }}>
                No image
              </div>
            )}
          </div>

          {/* Details Metadata Content Wrapper */}
          <div style={{ paddingBottom: "0.5rem", minWidth: 0 }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={title}
                className="logo-img"
                style={{
                  maxHeight: "clamp(55px, 10vh, 100px)",
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
                fontSize: "clamp(1.6rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: "0.85rem",
                fontWeight: 800,
                color: "#e8ddd0"
              }}>
                {title}
              </h1>
            )}

            <div className="meta-pills-row" style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "1.25rem"
            }}>
              <StatPill color={getRatingColor(rating)}>★ {rating}</StatPill>
              {year && <StatPill>{year}</StatPill>}
              {runtime && <StatPill>{runtime}</StatPill>}
              {seasons && <StatPill>{seasons} Season{seasons !== 1 ? "s" : ""}</StatPill>}
              {episodes && <StatPill>{episodes} Episodes</StatPill>}
              {genres.slice(0, 3).map((g) => <StatPill key={g.id}>{g.name}</StatPill>)}
            </div>

            <p className="synopsis-text" style={{
              fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)",
              lineHeight: 1.7,
              color: "rgba(232,221,208,0.65)",
              marginBottom: "1.5rem",
              maxWidth: "680px"
            }}>
              {overview}
            </p>

            <div style={{ marginBottom: "0.5rem" }}>
              <WatchPageClient
                type={type}
                id={id}
                validSeasons={validSeasons}
                isReleased={isReleased}
              />
            </div>
          </div>
        </div>
      </div>

      <main style={{
        maxWidth: 1400,
        margin: "0 auto",
        width: "100%",
        padding: "0 1rem 4rem",
        position: "relative",
        zIndex: 2
      }}>
        {cast.length > 0 && (
          <Section title="The Cast">
            <div className="scroll-row" style={{ gap: "clamp(1rem, 2vw, 1.5rem)", padding: "0.5rem 0.25rem 1.25rem" }}>
              {cast.map((actor) => (
                <div key={actor.id} style={{ flexShrink: 0, width: "clamp(80px, 12vw, 100px)", textAlign: "center" }}>
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      style={{
                        width: "clamp(56px, 8vw, 68px)",
                        height: "clamp(56px, 8vw, 68px)",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid rgba(255,255,255,0.05)",
                        margin: "0 auto 0.4rem",
                        display: "block"
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "clamp(56px, 8vw, 68px)",
                      height: "clamp(56px, 8vw, 68px)",
                      borderRadius: "50%",
                      background: "#111811",
                      border: "2px solid rgba(255,255,255,0.05)",
                      margin: "0 auto 0.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.3
                    }}>
                      <User size={24} />
                    </div>
                  )}
                  <p style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.7rem)", fontWeight: 600, color: "#e8ddd0", lineHeight: 1.3 }} className="line-clamp-2">{actor.name}</p>
                  <p style={{ fontSize: "clamp(0.5rem, 0.7vw, 0.6rem)", color: "rgba(232,221,208,0.3)", marginTop: 2, fontStyle: "italic" }} className="line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {backdrops.length > 0 && (
          <Section title="Stills">
            <div className="scroll-row" style={{ gap: "clamp(0.5rem, 1vw, 0.75rem)", padding: "0.5rem 0.25rem 1.25rem" }}>
              {backdrops.map((img, i) => (
                <div key={i} style={{
                  flexShrink: 0,
                  width: "clamp(180px, 30vw, 260px)",
                  aspectRatio: "16/9",
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                    alt=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {recommendations.length > 0 && (
          <Section title="You might also enjoy">
            <div className="scroll-row" style={{ gap: "clamp(0.75rem, 1.5vw, 1rem)", padding: "0.5rem 0.25rem 1.25rem" }}>
              {recommendations.map((item) => {
                const rPoster = item.poster_path
                  ? `https://image.tmdb.org/t/p/w400${item.poster_path}`
                  : `https://placehold.co/400x600/1a221a/8a7a6a?text=No+Image`;
                const rTitle = item.title || item.name;
                const rYear = (item.release_date || item.first_air_date || "").split("-")[0];
                const rRating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";
                return (
                  <Link key={item.id} href={`/watch/${type}/${item.id}`} style={{ display: "block", width: "clamp(120px, 18vw, 150px)", textDecoration: "none", flexShrink: 0 }}>
                    <div style={{ background: "#111811", borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ position: "relative", aspectRatio: "2/3" }}>
                        <img src={rPoster} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <div style={{
                          position: "absolute",
                          bottom: 6,
                          left: 6,
                          background: "rgba(0,0,0,0.7)",
                          backdropFilter: "blur(4px)",
                          borderRadius: 4,
                          padding: "0.1rem 0.4rem",
                          fontSize: "0.6rem",
                          fontWeight: 600,
                          color: getRatingColor(rRating)
                        }}>
                          ★ {rRating}
                        </div>
                      </div>
                      <div style={{ padding: "0.5rem" }}>
                        <p style={{ fontWeight: 500, fontSize: "0.75rem", color: "#e8ddd0", lineHeight: 1.3 }} className="line-clamp-2">{rTitle}</p>
                        <p style={{ fontSize: "0.6rem", color: "rgba(232,221,208,0.25)", marginTop: 2 }}>{rYear}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Section>
        )}
      </main>
    </div>
  );
}

function StatPill({ children, color }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "0.2rem 0.5rem",
      borderRadius: 4,
      fontSize: "0.65rem",
      fontWeight: 500,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.05)",
      color: color || "rgba(232,221,208,0.5)",
      letterSpacing: "0.04em"
    }}>
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginTop: "2.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#e8ddd0", fontWeight: 600 }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.05), transparent)" }} />
      </div>
      {children}
    </section>
  );
}