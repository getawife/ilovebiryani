'use client';

import { Calendar } from 'lucide-react';

export default function SeasonSelector({ seasons, selectedSeason, onSeasonChange }) {
    return (
        <div>
            <h3 style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "rgba(232,221,208,0.4)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.75rem"
            }}>
                Seasons
            </h3>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "0.75rem"
            }}>
                {seasons.map((season) => {
                    const posterUrl = season.poster_path
                        ? `https://image.tmdb.org/t/p/w300${season.poster_path}`
                        : null;
                    const isActive = selectedSeason === season.season_number;

                    return (
                        <div
                            key={season.season_number}
                            onClick={() => onSeasonChange(season.season_number)}
                            style={{
                                position: "relative",
                                borderRadius: 8,
                                overflow: "hidden",
                                aspectRatio: "16/9",
                                background: "#111811",
                                border: `2px solid ${isActive ? 'rgba(45,155,78,0.4)' : 'rgba(45,155,78,0.06)'}`,
                                display: "block",
                                transition: "all 0.3s ease",
                                cursor: "pointer"
                            }}
                            className="season-card"
                        >
                            {posterUrl ? (
                                <img
                                    src={posterUrl}
                                    alt={`Season ${season.season_number}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                        filter: `brightness(${isActive ? 0.5 : 0.7})`
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: isActive ? "rgba(45,155,78,0.1)" : "#111811",
                                    flexDirection: "column",
                                    gap: "0.5rem"
                                }}>
                                    <Calendar size={28} color={isActive ? "rgba(45,155,78,0.5)" : "rgba(232,221,208,0.1)"} />
                                    <span style={{
                                        fontSize: "1.5rem",
                                        fontWeight: 700,
                                        color: isActive ? "rgba(45,155,78,0.5)" : "rgba(232,221,208,0.1)"
                                    }}>
                                        S{season.season_number}
                                    </span>
                                </div>
                            )}

                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: "0.5rem 0.75rem",
                                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>
                                <span style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    color: isActive ? "#2d9b4e" : "#e8ddd0",
                                    letterSpacing: "0.04em"
                                }}>
                                    S{season.season_number}
                                </span>
                                {season.episode_count > 0 && (
                                    <span style={{
                                        fontFamily: "var(--font-sans)",
                                        fontSize: "0.65rem",
                                        color: isActive ? "rgba(45,155,78,0.6)" : "rgba(232,221,208,0.4)",
                                        letterSpacing: "0.04em"
                                    }}>
                                        {season.episode_count} eps
                                    </span>
                                )}
                            </div>

                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: isActive ? "rgba(45,155,78,0.3)" : "rgba(45,155,78,0)",
                                transition: "background 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none"
                            }}
                                className="season-overlay"
                            >
                                <span style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "0.9rem",
                                    fontWeight: 700,
                                    color: "#fff",
                                    opacity: 0,
                                    transform: "scale(0.9)",
                                    transition: "all 0.3s ease",
                                    textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                                    letterSpacing: "0.04em"
                                }}
                                    className="season-hover-label"
                                >
                                    {isActive ? 'Currently Selected' : `Select Season ${season.season_number}`}
                                </span>
                            </div>

                            {isActive && (
                                <div style={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    background: "#2d9b4e",
                                    borderRadius: 4,
                                    padding: "0.15rem 0.5rem",
                                    fontSize: "0.55rem",
                                    fontWeight: 700,
                                    color: "#fff",
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase"
                                }}>
                                    Active
                                </div>
                            )}

                            <style jsx>{`
                .season-card:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 12px 32px rgba(0,0,0,0.6);
                  border-color: rgba(45,155,78,0.3);
                }
                .season-card:hover .season-overlay {
                  background: rgba(45, 155, 78, 0.7);
                }
                .season-card:hover .season-hover-label {
                  opacity: 1;
                  transform: scale(1);
                }
              `}</style>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}