import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from "../../../components/header";
import PlayerSection from "./PlayerSection";
import SeasonSelector from "../../../components/SeasonSelector";
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
  const director = data.credits?.crew?.find((c) => c.job === "Director");
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

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0a", color: "#e8ddd0", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{
        position: "relative",
        width: "100%",
        height: "clamp(320px, 45vh, 520px)",
        overflow: "hidden",
        isolation: "isolate"
      }}>
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              filter: "brightness(0.35) saturate(0.8)"
            }}
          />
        )}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(10,15,10,0.3) 0%, rgba(10,15,10,0.95) 100%)"
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(10,15,10,0.6) 0%, transparent 70%)"
        }} />
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "20%",
          width: "60%",
          height: "30%",
          background: "radial-gradient(ellipse at center, rgba(45,155,78,0.04) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
      </div>

      <main style={{
        flex: 1,
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
        padding: "0 1rem 4rem",
        marginTop: "clamp(-150px, -20vh, -200px)",
        position: "relative",
        zIndex: 2
      }}>

        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(140px, 200px) 1fr",
          gap: "clamp(1rem, 3vw, 2.5rem)",
          alignItems: "flex-start"
        }}>

          <div style={{
            flexShrink: 0,
            maxWidth: "clamp(140px, 25vw, 200px)",
            margin: "0 auto",
            width: "100%"
          }}>
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                style={{
                  width: "100%",
                  aspectRatio: "2/3",
                  objectFit: "cover",
                  borderRadius: 8,
                  boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(45,155,78,0.06)",
                  border: "1px solid rgba(45,155,78,0.05)"
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                aspectRatio: "2/3",
                borderRadius: 8,
                background: "#111811",
                border: "1px solid rgba(45,155,78,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(232,221,208,0.2)",
                fontSize: "0.8rem",
                fontStyle: "italic"
              }}>
                No image
              </div>
            )}
          </div>

          <div style={{
            paddingTop: "clamp(0.5rem, 2vw, 1.5rem)",
            width: "100%",
            minWidth: 0
          }}>

            <h1 style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(1.6rem, 4vw, 3.6rem)",
              letterSpacing: "0.02em",
              lineHeight: 1.05,
              marginBottom: "0.75rem",
              fontWeight: 700,
              color: "#e8ddd0",
              wordBreak: "break-word"
            }}>
              {title}
            </h1>

            <div style={{
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

            <p style={{
              fontSize: "clamp(0.85rem, 1.2vw, 0.9rem)",
              lineHeight: 1.8,
              color: "rgba(232,221,208,0.6)",
              marginBottom: "1.25rem",
              maxWidth: "100%",
              fontStyle: "italic"
            }}>
              {overview}
            </p>

            {director && (
              <p style={{
                fontSize: "clamp(0.7rem, 1vw, 0.75rem)",
                color: "rgba(232,221,208,0.35)",
                marginBottom: "1.5rem",
                letterSpacing: "0.04em"
              }}>
                <span style={{ fontWeight: 600, color: "rgba(232,221,208,0.5)" }}>Directed by</span> {director.name}
              </p>
            )}

            <WatchPageClient
              type={type}
              id={id}
              validSeasons={validSeasons}
              isReleased={isReleased}
            />
          </div>
        </div>

        {cast.length > 0 && (
          <Section title="The Cast">
            <div className="scroll-row" style={{
              gap: "clamp(1rem, 2vw, 1.5rem)",
              padding: "0.5rem 0.25rem 1.25rem"
            }}>
              {cast.map((actor) => (
                <div key={actor.id} style={{
                  flexShrink: 0,
                  width: "clamp(80px, 12vw, 100px)",
                  textAlign: "center"
                }}>
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      style={{
                        width: "clamp(56px, 8vw, 68px)",
                        height: "clamp(56px, 8vw, 68px)",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid rgba(45,155,78,0.06)",
                        margin: "0 auto 0.4rem",
                        display: "block",
                        filter: "brightness(0.92)"
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "clamp(56px, 8vw, 68px)",
                      height: "clamp(56px, 8vw, 68px)",
                      borderRadius: "50%",
                      background: "#111811",
                      border: "2px solid rgba(45,155,78,0.06)",
                      margin: "0 auto 0.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(1rem, 2vw, 1.4rem)",
                      opacity: 0.3
                    }}>
                      <User size={24} />
                    </div>
                  )}
                  <p style={{
                    fontSize: "clamp(0.6rem, 0.8vw, 0.7rem)",
                    fontWeight: 600,
                    color: "#e8ddd0",
                    lineHeight: 1.3,
                    letterSpacing: "0.02em"
                  }} className="line-clamp-2">{actor.name}</p>
                  <p style={{
                    fontSize: "clamp(0.5rem, 0.7vw, 0.6rem)",
                    color: "rgba(232,221,208,0.3)",
                    marginTop: 2,
                    fontStyle: "italic"
                  }} className="line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {backdrops.length > 0 && (
          <Section title="Stills">
            <div className="scroll-row" style={{
              gap: "clamp(0.5rem, 1vw, 0.75rem)",
              padding: "0.5rem 0.25rem 1.25rem"
            }}>
              {backdrops.map((img, i) => (
                <div key={i} style={{
                  flexShrink: 0,
                  width: "clamp(180px, 30vw, 260px)",
                  aspectRatio: "16/9",
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid rgba(45,155,78,0.04)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                    alt="Scene"
                    loading="lazy"
                    className="gallery-img"
                    style={{ filter: "brightness(0.92)" }}
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {recommendations.length > 0 && (
          <Section title="You might also enjoy">
            <div className="scroll-row" style={{
              gap: "clamp(0.75rem, 1.5vw, 1rem)",
              padding: "0.5rem 0.25rem 1.25rem"
            }}>
              {recommendations.map((item) => {
                const rPoster = item.poster_path
                  ? `https://image.tmdb.org/t/p/w400${item.poster_path}`
                  : `https://placehold.co/400x600/1a221a/8a7a6a?text=No+Image`;
                const rTitle = item.title || item.name;
                const rYear = (item.release_date || item.first_air_date || "").split("-")[0];
                const rRating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";
                return (
                  <Link key={item.id} href={`/watch/${type}/${item.id}`} style={{
                    display: "block",
                    width: "clamp(120px, 18vw, 150px)",
                    textDecoration: "none",
                    flexShrink: 0
                  }}>
                    <div className="card-hover" style={{
                      background: "#111811",
                      borderRadius: 6,
                      overflow: "hidden",
                      border: "1px solid rgba(45,155,78,0.04)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                    }}>
                      <div style={{ position: "relative", aspectRatio: "2/3" }}>
                        <img
                          src={rPoster}
                          alt={rTitle}
                          loading="lazy"
                          className="poster-img"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            filter: "brightness(0.92)"
                          }}
                        />
                        <div style={{
                          position: "absolute",
                          bottom: 6,
                          left: 6,
                          background: "rgba(0,0,0,0.7)",
                          backdropFilter: "blur(4px)",
                          borderRadius: 4,
                          padding: "0.1rem 0.4rem",
                          fontSize: "clamp(0.5rem, 0.7vw, 0.6rem)",
                          fontWeight: 600,
                          color: getRatingColor(rRating),
                          border: "1px solid rgba(255,255,255,0.04)"
                        }}>
                          ★ {rRating}
                        </div>
                      </div>
                      <div style={{ padding: "0.4rem 0.6rem 0.6rem" }}>
                        <p style={{
                          fontWeight: 500,
                          fontSize: "clamp(0.65rem, 0.9vw, 0.75rem)",
                          color: "#e8ddd0",
                          lineHeight: 1.3,
                          letterSpacing: "0.02em"
                        }} className="line-clamp-2">{rTitle}</p>
                        <p style={{
                          fontSize: "clamp(0.5rem, 0.7vw, 0.6rem)",
                          color: "rgba(232,221,208,0.25)",
                          marginTop: 2,
                          letterSpacing: "0.06em"
                        }}>{rYear}</p>
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
      padding: "0.15rem 0.6rem",
      borderRadius: 4,
      fontSize: "clamp(0.55rem, 0.8vw, 0.65rem)",
      fontWeight: 500,
      background: "rgba(45,155,78,0.05)",
      border: "1px solid rgba(45,155,78,0.06)",
      color: color || "rgba(232,221,208,0.5)",
      letterSpacing: "0.04em"
    }}>
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginTop: "clamp(2rem, 4vw, 3rem)" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1rem"
      }}>
        <h2 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#e8ddd0",
          fontWeight: 600
        }}>
          {title}
        </h2>
        <div style={{
          flex: 1,
          height: 1,
          background: "linear-gradient(90deg, rgba(45,155,78,0.08), transparent)"
        }} />
      </div>
      {children}
    </section>
  );
}