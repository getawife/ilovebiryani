"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '../components/header';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);

    const [mediaType, setMediaType] = useState('all'); // 'all' | 'movie' | 'tv'
    const [selectedGenre, setSelectedGenre] = useState('');

    useEffect(() => {
        if (!query) return;

        async function fetchSearchResults() {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.results) setResults(data.results);
        }

        fetchSearchResults();
    }, [query]);

    const filteredResults = results.filter(item => {
        const matchesType = mediaType === 'all' || item.media_type === mediaType;
        return matchesType;
    });

    return (
        <div>
            <Header />
            <main style={{ display: 'flex', maxWidth: 1400, margin: '2rem auto', padding: '0 1rem', gap: '2rem' }}>

                <aside style={{ width: '280px', flexShrink: 0, background: 'rgba(45,155,78,0.02)', borderRadius: '8px', padding: '1rem' }}>
                    <h3>Filters</h3>
                    <div>
                        <h4>Type</h4>
                        <label><input type="radio" checked={mediaType === 'all'} onChange={() => setMediaType('all')} /> All</label><br />
                        <label><input type="radio" checked={mediaType === 'movie'} onChange={() => setMediaType('movie')} /> Movies</label><br />
                        <label><input type="radio" checked={mediaType === 'tv'} onChange={() => setMediaType('tv')} /> TV Series</label>
                    </div>
                </aside>

                <section style={{ flex: 1 }}>
                    <h2>Search Results for: "{query}"</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredResults.map(item => (
                            <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '6px' }}>
                                {item.title || item.name}
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}