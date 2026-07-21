'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Play } from 'lucide-react';

export function ContinueWatchingRow() {
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const items = [];
        // Collect progress items stored by the PlayerSection
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('watch-progress-')) {
                const id = key.replace('watch-progress-', '');
                try {
                    const progress = JSON.parse(localStorage.getItem(key));
                    if (progress) {
                        items.push({ id, ...progress });
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }

        if (items.length === 0) {
            setLoading(false);
            return;
        }

        // Dynamic metadata fetch from your API route fallback or direct TMDB proxy route if available
        Promise.all(
            items.map(async (item) => {
                try {
                    const res = await fetch(`/api/tv-details?id=${item.id}`);
                    if (!res.ok) return null;
                    const data = await res.json();
                    return {
                        ...item,
                        title: data.name || data.title,
                        poster_path: data.poster_path,
                    };
                } catch {
                    return null;
                }
            })
        )
            .then((results) => {
                setHistoryItems(results.filter(Boolean));
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading || historyItems.length === 0) return null;

    return (
        <section style={{ marginTop: "3rem" }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
                padding: "0 0.25rem"
            }}>
                <History size={18} color="#c9a84c" />
                <h2 style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#e8ddd0",
                    fontWeight: 700
                }}>
                    Continue Watching
                </h2>
            </div>

            <div className="scroll-row" style={{
                display: "flex",
                gap: "1rem",
                padding: "0.5rem 0.25rem 1.25rem",
                overflowX: "auto"
            }}>
                {historyItems.map((item) => {
                    const poster = item.poster_path
                        ? `https://image.tmdb.org/t/p/w400${item.poster_path}`
                        : `https://placehold.co/400x600/1a221a/8a7a6a?text=No+Image`;

                    return (
                        <Link key={item.id} href={`/watch/tv/${item.id}`} style={{
                            display: "block",
                            width: 160,
                            textDecoration: "none",
                            flexShrink: 0
                        }}>
                            <div className="card-hover" style={{
                                background: "#111811",
                                borderRadius: 8,
                                overflow: "hidden",
                                border: `1px solid #c9a84c15`,
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
                                        alt={item.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <div className="play-overlay">
                                        <div className="play-btn" style={{ background: `#c9a84cE6` }}>
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
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {item.title}
                                    </p>
                                    <p style={{
                                        fontSize: "0.65rem",
                                        color: "#c9a84c",
                                        fontWeight: "600",
                                        letterSpacing: "0.04em",
                                        marginTop: "2px"
                                    }}>
                                        Season {item.season} · Ep {item.episode}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}