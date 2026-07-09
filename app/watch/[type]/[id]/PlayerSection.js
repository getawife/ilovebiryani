'use client';

import { useState, useEffect, useCallback } from "react";
import { Play, X, Clock, Film } from "lucide-react";

function buildServers(type, id, season, episode) {
  return {
    "Server 1": type === "tv"
      ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
      : `https://vidsrc.to/embed/movie/${id}`,
    "Server 2": type === "tv"
      ? `https://vidsuper.net/embed/tv/${id}/${season}/${episode}`
      : `https://vidsuper.net/embed/movie/${id}`,
    "Server 3": type === "tv"
      ? `https://vidrock.ru/tv/${id}/${season}/${episode}`
      : `https://vidrock.ru/movie/${id}`,
  };
}

export default function PlayerSection({ type, id, seasonsData = [], isReleased = true, selectedSeason = 1 }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);

  const validSeasons = seasonsData.filter((s) => s.season_number > 0);
  const [season, setSeason] = useState(selectedSeason || (validSeasons.length > 0 ? validSeasons[0].season_number : 1));
  const [episode, setEpisode] = useState(1);
  const [activeServer, setActiveServer] = useState("Watch Now");
  const [episodesList, setEpisodesList] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  const servers = buildServers(type, id, season, episode);

  // Update season when prop changes
  useEffect(() => {
    if (selectedSeason && selectedSeason !== season) {
      setSeason(selectedSeason);
      setEpisode(1);
      setEpisodesList([]);
    }
  }, [selectedSeason]);

  useEffect(() => {
    if (type !== "tv" || !showPlayer || !isReleased) return;
    setLoadingEpisodes(true);

    fetch(`/api/episodes?showId=${id}&season=${season}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setEpisodesList(Array.isArray(data) ? data : []))
      .catch(() => setEpisodesList([]))
      .finally(() => setLoadingEpisodes(false));
  }, [season, id, type, showPlayer, isReleased]);

  useEffect(() => {
    document.body.style.overflow = showPlayer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showPlayer]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setShowPlayer(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!isReleased) {
    return (
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        background: "rgba(45,155,78,0.04)",
        border: "1px solid rgba(45,155,78,0.06)",
        borderRadius: 6,
        padding: "0.7rem 1.25rem",
        fontSize: "0.8rem",
        fontWeight: 500,
        color: "rgba(232,221,208,0.4)",
        letterSpacing: "0.04em"
      }}>
        <Clock size={16} style={{ opacity: 0.5 }} />
        Coming soon to the silver screen
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
        <button
          id="watch-now-btn"
          onClick={() => setShowPlayer(true)}
          className="hero-btn"
          style={{
            minWidth: 140,
            fontSize: "0.8rem",
            padding: "0.7rem 1.8rem"
          }}
        >
          <Play size={18} />
          Start watching
        </button>
      </div>

      {showPlayer && (
        <div
          className="overlay-enter"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            onClick={() => setShowPlayer(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(6,12,6,0.92)",
              backdropFilter: "blur(14px)",
              cursor: "pointer"
            }}
          />

          <div
            className="panel-enter"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "min(1100px, calc(100vw - 1.5rem))",
              background: "linear-gradient(145deg, #0e180e, #0a120a)",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(45,155,78,0.06)",
              boxShadow: "0 48px 128px rgba(0,0,0,0.9), 0 0 0 1px rgba(45,155,78,0.04)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "calc(100vh - 1.5rem)",
              zIndex: 1,
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.5rem 0.75rem",
              borderBottom: "1px solid rgba(45,155,78,0.04)",
              flexShrink: 0,
              background: "rgba(10,15,10,0.5)"
            }}>
              <div style={{ display: "flex", gap: "0.2rem" }}>
                {Object.keys(servers).map((name) => (
                  <button
                    key={name}
                    id={`server-${name.toLowerCase().replace(/\s/g, "-")}`}
                    onClick={() => setActiveServer(name)}
                    style={{
                      padding: "0.25rem 0.7rem",
                      borderRadius: 4,
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1px solid",
                      transition: "all 0.2s ease",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      borderColor: activeServer === name ? "rgba(45,155,78,0.2)" : "rgba(45,155,78,0.04)",
                      background: activeServer === name ? "rgba(45,155,78,0.08)" : "rgba(45,155,78,0.02)",
                      color: activeServer === name ? "#2d9b4e" : "rgba(232,221,208,0.3)",
                      fontFamily: "var(--font-sans)"
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                {type === "tv" && (
                  <button
                    onClick={() => setShowEpisodes((v) => !v)}
                    id="toggle-episodes-btn"
                    style={{
                      padding: "0.25rem 0.7rem",
                      borderRadius: 4,
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1px solid rgba(45,155,78,0.04)",
                      background: showEpisodes ? "rgba(45,155,78,0.06)" : "rgba(45,155,78,0.02)",
                      color: showEpisodes ? "rgba(232,221,208,0.6)" : "rgba(232,221,208,0.25)",
                      transition: "all 0.2s ease",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-sans)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem"
                    }}
                  >
                    <Film size={12} />
                    Episodes
                  </button>
                )}
                <button
                  id="close-player-btn"
                  onClick={() => setShowPlayer(false)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 4,
                    background: "rgba(45,155,78,0.02)",
                    border: "1px solid rgba(45,155,78,0.04)",
                    color: "rgba(232,221,208,0.3)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(45,155,78,0.1)";
                    e.currentTarget.style.borderColor = "rgba(45,155,78,0.2)";
                    e.currentTarget.style.color = "rgba(45,155,78,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(45,155,78,0.02)";
                    e.currentTarget.style.borderColor = "rgba(45,155,78,0.04)";
                    e.currentTarget.style.color = "rgba(232,221,208,0.3)";
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{
              display: "flex",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              background: "#000"
            }}>
              <div style={{
                flex: 1,
                aspectRatio: "16/9",
                background: "#000",
                position: "relative",
                minWidth: 0
              }}>
                <iframe
                  key={`${activeServer}-${season}-${episode}`}
                  src={servers[activeServer]}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    background: "#000"
                  }}
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  scrolling="no"
                />
              </div>

              {type === "tv" && showEpisodes && (
                <div style={{
                  width: "clamp(200px, 30vw, 260px)",
                  flexShrink: 0,
                  borderLeft: "1px solid rgba(45,155,78,0.04)",
                  background: "rgba(6,12,6,0.95)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden"
                }}>
                  <div style={{
                    padding: "0.5rem 0.6rem",
                    borderBottom: "1px solid rgba(45,155,78,0.04)",
                    display: "flex",
                    gap: "0.2rem",
                    flexWrap: "wrap",
                    background: "rgba(10,15,10,0.5)"
                  }}>
                    {validSeasons.slice(0, 12).map((s) => (
                      <button
                        key={s.season_number}
                        onClick={() => {
                          setSeason(s.season_number);
                          setEpisode(1);
                          setEpisodesList([]);
                        }}
                        style={{
                          padding: "0.15rem 0.5rem",
                          borderRadius: 4,
                          fontSize: "0.6rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "1px solid",
                          transition: "all 0.15s ease",
                          borderColor: season === s.season_number ? "rgba(45,155,78,0.2)" : "rgba(45,155,78,0.04)",
                          background: season === s.season_number ? "rgba(45,155,78,0.08)" : "rgba(45,155,78,0.02)",
                          color: season === s.season_number ? "#2d9b4e" : "rgba(232,221,208,0.25)",
                          fontFamily: "var(--font-sans)"
                        }}
                      >
                        S{s.season_number}
                      </button>
                    ))}
                  </div>

                  <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "0.4rem",
                    scrollbarWidth: "thin"
                  }}>
                    {loadingEpisodes ? (
                      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="skeleton" style={{ height: 48, borderRadius: 4 }} />
                        ))}
                      </div>
                    ) : episodesList.length === 0 ? (
                      <p style={{
                        padding: "1.5rem",
                        fontSize: "0.7rem",
                        color: "rgba(232,221,208,0.2)",
                        textAlign: "center",
                        fontStyle: "italic"
                      }}>
                        No episodes listed.
                      </p>
                    ) : (
                      episodesList.map((ep) => {
                        const isActive = ep.episode_number === episode;
                        return (
                          <button
                            key={ep.episode_number}
                            id={`episode-${ep.episode_number}`}
                            onClick={() => setEpisode(ep.episode_number)}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "0.4rem",
                              padding: "0.4rem 0.5rem",
                              borderRadius: 4,
                              border: isActive ? "1px solid rgba(45,155,78,0.15)" : "1px solid transparent",
                              background: isActive ? "rgba(45,155,78,0.04)" : "transparent",
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "all 0.15s ease",
                              marginBottom: "0.15rem",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) e.currentTarget.style.background = "rgba(45,155,78,0.03";
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) e.currentTarget.style.background = "transparent";
                            }}
                          >
                            {ep.still_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w185${ep.still_path}`}
                                alt={ep.name}
                                style={{
                                  width: 60,
                                  height: 34,
                                  borderRadius: 4,
                                  objectFit: "cover",
                                  flexShrink: 0,
                                  border: "1px solid rgba(45,155,78,0.04)",
                                  filter: "brightness(0.9)"
                                }}
                              />
                            ) : (
                              <div style={{
                                width: 60,
                                height: 34,
                                borderRadius: 4,
                                background: "#111811",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.5rem",
                                color: "rgba(232,221,208,0.15)",
                                border: "1px solid rgba(45,155,78,0.04)"
                              }}>
                                E{ep.episode_number}
                              </div>
                            )}
                            <div style={{ overflow: "hidden", flex: 1 }}>
                              <p style={{
                                fontSize: "0.65rem",
                                fontWeight: 600,
                                color: isActive ? "#2d9b4e" : "rgba(232,221,208,0.6)",
                                lineHeight: 1.3,
                                letterSpacing: "0.02em"
                              }} className="line-clamp-1">
                                {ep.episode_number}. {ep.name}
                              </p>
                              {ep.runtime && (
                                <p style={{
                                  fontSize: "0.55rem",
                                  color: "rgba(232,221,208,0.2)",
                                  marginTop: 1,
                                  letterSpacing: "0.04em"
                                }}>{ep.runtime}m</p>
                              )}
                              {ep.overview && (
                                <p style={{
                                  fontSize: "0.55rem",
                                  color: "rgba(232,221,208,0.2)",
                                  marginTop: 2,
                                  lineHeight: 1.3,
                                  fontStyle: "italic"
                                }} className="line-clamp-2">
                                  {ep.overview}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {type === "tv" && (
              <div style={{
                padding: "0.4rem 0.75rem",
                borderTop: "1px solid rgba(45,155,78,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexShrink: 0,
                background: "rgba(10,15,10,0.5)"
              }}>
                <span style={{
                  fontSize: "0.65rem",
                  color: "rgba(232,221,208,0.2)",
                  fontWeight: 500,
                  letterSpacing: "0.08em"
                }}>
                  Now playing
                </span>
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: "#2d9b4e",
                  letterSpacing: "0.04em"
                }}>
                  S{season} · E{episode}
                </span>
                {episodesList.find((e) => e.episode_number === episode)?.name && (
                  <span style={{
                    fontSize: "0.65rem",
                    color: "rgba(232,221,208,0.3)",
                    fontStyle: "italic"
                  }}>
                    — {episodesList.find((e) => e.episode_number === episode).name}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}