
"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Maximize, Volume2, VolumeX, Film } from "lucide-react";

export default function VideoPlayer({
    id = "299534",
    type = "movie",
    season,
    episode,
    title = "Now Playing"
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(dark);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const playerColor = "2d9b4e";

    const baseUrl = type === "tv"
        ? `https://vidsuper.net/tv/${id}/${season || 1}/${episode || 1}`
        : `https://vidsuper.net/movie/${id}`;

    const playerSrc = `${baseUrl}?color=${playerColor}&autoplay=false&nextEpisode=true&episodeSelector=true&overlay=true&skip_intro=true`;

    return (
        <div style={{
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto"
        }}>
            <div style={{
                position: "relative",
                width: "100%",
                borderRadius: 8,
                overflow: "hidden",
                background: "#08080f",
                boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(45,155,78,0.04)",
                aspectRatio: "16/9"
            }}>
                {isLoading && (
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#08080f",
                        zIndex: 1,
                        gap: "1rem"
                    }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            border: "2px solid rgba(45,155,78,0.1)",
                            borderTopColor: "#2d9b4e",
                            animation: "spin 0.8s linear infinite"
                        }} />
                        <p style={{
                            fontSize: "0.75rem",
                            color: "rgba(232,221,208,0.25)",
                            letterSpacing: "0.08em",
                            fontStyle: "italic"
                        }}>
                            Loading the reel...
                        </p>
                    </div>
                )}

                <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background: "linear-gradient(to top, rgba(10,15,10,0.6) 0%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                    opacity: isLoading ? 0 : 1,
                    transition: "opacity 0.4s ease"
                }} />

                <div style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 3,
                    pointerEvents: "none",
                    opacity: isLoading ? 0 : 1,
                    transition: "opacity 0.4s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                }}>
                    <span style={{
                        fontSize: "0.55rem",
                        color: "rgba(45,155,78,0.15)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        background: "rgba(10,15,10,0.6)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: 3,
                        border: "1px solid rgba(45,155,78,0.05)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem"
                    }}>
                        <Film size={10} />
                        {type === "tv" ? `S${season || 1} · E${episode || 1}` : "Feature"}
                    </span>
                </div>

                <iframe
                    src={playerSrc}
                    className="w-full h-full"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                        background: "#08080f",
                        zIndex: 0
                    }}
                    frameBorder="0"
                    allowFullScreen
                    allow="encrypted-media"
                    onLoad={() => setIsLoading(false)}
                />

                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.25rem",
                marginTop: "0.5rem"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                }}>
                    <span style={{
                        fontSize: "0.65rem",
                        color: "rgba(232,221,208,0.3)",
                        letterSpacing: "0.04em"
                    }}>
                        {title}
                    </span>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                }}>
                    <span style={{
                        fontSize: "0.55rem",
                        color: "rgba(232,221,208,0.15)",
                        letterSpacing: "0.06em"
                    }}>
                        HD
                    </span>
                    <span style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "rgba(45,155,78,0.08)"
                    }} />
                    <span style={{
                        fontSize: "0.55rem",
                        color: "rgba(232,221,208,0.15)",
                        letterSpacing: "0.06em"
                    }}>
                        {type === "tv" ? "Series" : "Film"}
                    </span>
                </div>
            </div>
        </div>
    );
}