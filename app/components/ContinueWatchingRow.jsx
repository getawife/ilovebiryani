'use client';

import { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import MovieCard from './MovieCard';

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
            queueMicrotask(() => setLoading(false));
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
                {historyItems.map((item) => (
                    <MovieCard
                        key={item.id}
                        item={item}
                        type="tv"
                        accentColor="#c9a84cE6"
                        fixedWidth={true}
                    />
                ))}
            </div>
        </section>
    );
}