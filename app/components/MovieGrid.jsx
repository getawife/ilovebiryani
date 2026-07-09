'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

function getRatingColor(r) {
    const n = parseFloat(r);
    if (n >= 7.5) return "#2d9b4e";
    if (n >= 6) return "#c9a84c";
    return "#8b5a2b";
}

export default function MovieGrid({ items, type }) {
    const [displayedItems, setDisplayedItems] = useState(items || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState((items || []).length >= 20);
    const [error, setError] = useState(false);
    const observerRef = useRef(null);
    const loadingRef = useRef(false);

    const loadMore = useCallback(async () => {
        if (loadingRef.current || !hasMore || error) return;

        loadingRef.current = true;
        setLoading(true);
        setError(false);

        try {
            const nextPage = page + 1;
            const res = await fetch(`/api/${type}?page=${nextPage}&language=en-US`);

            let data;
            const text = await res.text();

            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('Failed to parse JSON:', text.substring(0, 100));
                throw new Error('Invalid response from server');
            }

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            if (data.results && data.results.length > 0) {
                const existingIds = new Set(displayedItems.map(item => item.id));
                const newItems = data.results.filter(item => !existingIds.has(item.id));

                if (newItems.length > 0) {
                    setDisplayedItems(prev => [...prev, ...newItems]);
                    setPage(nextPage);
                    setHasMore(data.total_pages > nextPage);
                } else {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error loading more:', err);
            setError(true);
            setHasMore(false);
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [page, hasMore, error, type, displayedItems]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && !error) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        const currentObserver = observerRef.current;
        if (currentObserver) {
            observer.observe(currentObserver);
        }

        return () => {
            if (currentObserver) {
                observer.unobserve(currentObserver);
            }
        };
    }, [hasMore, loading, error, loadMore]);

    if (!displayedItems || displayedItems.length === 0) {
        return (
            <div style={{
                textAlign: "center",
                padding: "3rem",
                color: "rgba(232,221,208,0.3)"
            }}>
                <p>No titles found.</p>
            </div>
        );
    }

    return (
        <section>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "1.5rem",
                width: "100%"
            }}>
                {displayedItems.map((item) => (
                    <MovieCard key={`${type}-${item.id}`} item={item} type={type} />
                ))}
            </div>

            {loading && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: "1.5rem",
                    marginTop: "1.5rem",
                    width: "100%"
                }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={`skeleton-${i}`} style={{
                            background: "#111811",
                            borderRadius: 8,
                            aspectRatio: "2/3",
                            border: "1px solid rgba(150,200,150,0.06)",
                            animation: "pulse 1.5s ease-in-out infinite"
                        }} />
                    ))}
                </div>
            )}

            {error && (
                <div style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "rgba(232,221,208,0.4)",
                    fontSize: "0.85rem",
                    fontStyle: "italic"
                }}>
                    <p>Something went wrong loading more content.</p>
                    <button
                        onClick={() => {
                            setError(false);
                            setHasMore(true);
                            loadMore();
                        }}
                        style={{
                            marginTop: "0.75rem",
                            padding: "0.5rem 1.5rem",
                            borderRadius: 6,
                            background: "rgba(45,155,78,0.1)",
                            border: "1px solid rgba(45,155,78,0.2)",
                            color: "#e8ddd0",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.2)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.1)"}
                    >
                        Try Again
                    </button>
                </div>
            )}

            <div ref={observerRef} style={{ height: 1, marginTop: "1rem" }} />

            {!hasMore && !error && displayedItems.length > 0 && (
                <p style={{
                    textAlign: "center",
                    fontSize: "0.75rem",
                    color: "rgba(232,221,208,0.2)",
                    marginTop: "2rem",
                    letterSpacing: "0.04em"
                }}>
                    You've reached the end
                </p>
            )}

            <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </section>
    );
}

function MovieCard({ item, type }) {
    const poster = item.poster_path
        ? `https://image.tmdb.org/t/p/w400${item.poster_path}`
        : `https://placehold.co/400x600/1a221a/8a7a6a?text=No+Image`;

    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || "").split("-")[0];
    const rating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";
    const href = `/watch/${type}/${item.id}`;

    return (
        <Link href={href} style={{
            display: "block",
            textDecoration: "none",
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
                        <div className="play-btn" style={{ background: "#2d9b4eE6" }}>
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