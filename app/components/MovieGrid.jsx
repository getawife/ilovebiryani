'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import MovieCard from './MovieCard';

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
                    <MovieCard key={`${type}-${item.id}`} item={item} type={type} fixedWidth={false} />
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
                        <div key={`skeleton-${i}`} className="skeleton" style={{
                            borderRadius: 8,
                            aspectRatio: "2/3"
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
                    You&apos;ve reached the end
                </p>
            )}
        </section>
    );
}