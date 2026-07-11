'use client';

import Link from 'next/link';
import { Play, ArrowRight, Flame, Tv, Trophy, Popcorn } from 'lucide-react';

const iconMap = {
    Flame: Flame,
    Tv: Tv,
    Trophy: Trophy,
    Popcorn: Popcorn,
};

function getRatingColor(r) {
    const n = parseFloat(r);
    if (n >= 7.5) return "#2d9b4e";
    if (n >= 6) return "#c9a84c";
    return "#8b5a2b";
}

export function ContentRow({ title, iconName, color, items, type }) {
    const Icon = iconMap[iconName];

    return (
        <section style={{ marginTop: "3rem" }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
                padding: "0 0.25rem"
            }}>
                {Icon && <Icon size={18} color={color} />}
                <h2 style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#e8ddd0",
                    fontWeight: 700
                }}>
                    {title}
                </h2>
                <Link
                    href={`/${type}s`}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.65rem",
                        color: "rgba(232,221,208,0.25)",
                        textDecoration: "none",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        transition: "color 0.2s ease",
                        flexShrink: 0,
                        padding: "0.2rem 0.4rem",
                        borderRadius: 4
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = color}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,221,208,0.25)"}
                >
                    View All
                    <ArrowRight size={12} />
                </Link>
            </div>
            <div className="scroll-row" style={{
                gap: "1rem",
                padding: "0.5rem 0.25rem 1.25rem"
            }}>
                {items.map((item) => (
                    <MovieCard key={item.id} item={item} type={type} accentColor={color} />
                ))}
            </div>
        </section>
    );
}

function MovieCard({ item, type, accentColor }) {
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
                border: `1px solid ${accentColor}15`,
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
                        <div className="play-btn" style={{ background: `${accentColor}E6` }}>
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