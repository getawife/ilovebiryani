'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Play, SlidersHorizontal, ChevronDown } from 'lucide-react';
import Header from '../components/header';

function getRatingColor(r) {
    const n = parseFloat(r);
    if (n >= 7.5) return "#2d9b4e";
    if (n >= 6) return "#c9a84c";
    return "#8b5a2b";
}

function CustomSelect({ label, value, options, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(o => o.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="filter-select-group" style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontFamily: "Inter, var(--font-sans), sans-serif" }}>
            <label style={{ fontSize: "0.7rem", color: "rgba(232,221,208,0.4)", fontWeight: 700, letterSpacing: "0.06em" }}>{label}</label>
            <div style={{ position: "relative" }}>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: "100%",
                        padding: "0.55rem 1rem",
                        background: "#0a0f0a",
                        border: isOpen ? "1px solid #2d9b4e" : "1px solid rgba(45,155,78,0.15)",
                        borderRadius: "8px",
                        color: "#e8ddd0",
                        fontSize: "0.825rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: isOpen ? "0 0 0 2px rgba(45,155,78,0.15)" : "none",
                        transition: "all 0.2s ease"
                    }}
                >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedOption.label}
                    </span>
                    <ChevronDown size={14} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", color: "rgba(232,221,208,0.3)", flexShrink: 0, marginLeft: "auto" }} />
                </div>

                {isOpen && (
                    <div style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "#111811",
                        border: "1px solid rgba(45,155,78,0.2)",
                        borderRadius: "8px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
                        zIndex: 100,
                        maxHeight: "220px",
                        overflowY: "auto",
                        padding: "4px"
                    }}>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: "0.5rem 0.75rem",
                                    borderRadius: "6px",
                                    color: option.value === value ? "#2d9b4e" : "#e8ddd0",
                                    background: option.value === value ? "rgba(45,155,78,0.08)" : "transparent",
                                    fontSize: "0.825rem",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                    fontWeight: option.value === value ? 600 : 400
                                }}
                                onMouseEnter={(e) => {
                                    if (option.value !== value) e.currentTarget.style.background = "rgba(232,221,208,0.03)";
                                }}
                                onMouseLeave={(e) => {
                                    if (option.value !== value) e.currentTarget.style.background = "transparent";
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function SearchContent() {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get('q') || '';

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        type: 'all',
        genre: 'all',
        year: 'all',
        country: 'all',
        language: 'all',
        rating: 'all'
    });

    const filterOptions = {
        genres: [
            { value: 'all', label: 'All Genres' },
            { value: 'action', label: 'Action' },
            { value: 'drama', label: 'Drama' },
            { value: 'comedy', label: 'Comedy' },
            { value: 'sci-fi', label: 'Sci-Fi' },
            { value: 'horror', label: 'Horror' }
        ],
        years: [
            { value: 'all', label: 'All Years' },
            { value: '2026', label: '2026' },
            { value: '2025', label: '2025' },
            { value: '2024', label: '2024' },
            { value: '2023', label: '2023' },
            { value: '2022', label: '2022' }
        ],
        countries: [
            { value: 'all', label: 'All Countries' },
            { value: 'US', label: 'United States' },
            { value: 'PK', label: 'Pakistan' },
            { value: 'GB', label: 'United Kingdom' },
            { value: 'CA', label: 'Canada' },
            { value: 'JP', label: 'Japan' },
            { value: 'KR', label: 'South Korea' },
            { value: 'IN', label: 'India' },
            { value: 'CN', label: 'China' },
            { value: 'FR', label: 'France' },
            { value: 'DE', label: 'Germany' }
        ],
        languages: [
            { value: 'all', label: 'All Languages' },
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'hi', label: 'Hindi' },
            { value: 'ja', label: 'Japanese' },
            { value: 'ko', label: 'Korean' },
            { value: 'ur', label: 'Urdu' }
        ],
        ratings: [
            { value: 'all', label: 'Any Rating' },
            { value: '7.5', label: '★ 7.5+ Premium' },
            { value: '6.0', label: '★ 6.0+ Casual' }
        ]
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (!queryParam.trim()) {
            setItems([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    q: queryParam,
                    type: filters.type,
                    genre: filters.genre,
                    year: filters.year,
                    country: filters.country,
                    language: filters.language,
                    rating: filters.rating
                });

                const res = await fetch(`/api/search?${params.toString()}`);
                const data = await res.json();

                if (data && data.results) {
                    setItems(data.results);
                } else {
                    setItems([]);
                }
            } catch (error) {
                console.error("Error fetching filtered results:", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchData, 300);
        return () => clearTimeout(timer);
    }, [queryParam, filters]);

    return (
        <div className="search-layout-container" style={{
            maxWidth: 1400,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            gap: "2.5rem",
            flex: 1,
            position: "relative",
            zIndex: 2
        }}>
            <aside className="search-sidebar-panel" style={{
                width: 260,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                alignSelf: "flex-start",
                position: "sticky",
                top: "110px"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#2d9b4e",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em"
                }}>
                    <SlidersHorizontal size={14} />
                    <span>FILTERS</span>
                </div>

                <div className="type-toggle-container" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.7rem", color: "rgba(232,221,208,0.4)", fontWeight: 700, letterSpacing: "0.06em" }}>TYPE</label>
                    <div className="type-toggle-row" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {[
                            { id: 'all', label: 'All Titles' },
                            { id: 'movie', label: 'Movies' },
                            { id: 'tv', label: 'TV Series' }
                        ].map((t) => {
                            const isSelected = filters.type === t.id;
                            return (
                                <div
                                    key={t.id}
                                    onClick={() => handleFilterChange('type', t.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        padding: "0.6rem 0.75rem",
                                        borderRadius: "8px",
                                        background: isSelected ? "rgba(45,155,78,0.08)" : "transparent",
                                        border: isSelected ? "1px solid rgba(45,155,78,0.3)" : "1px solid rgba(232,221,208,0.05)",
                                        color: isSelected ? "#2d9b4e" : "#e8ddd0",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        fontSize: "0.85rem",
                                        fontWeight: isSelected ? 600 : 400
                                    }}
                                >
                                    <div style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: "50%",
                                        border: isSelected ? "4px solid #2d9b4e" : "2px solid rgba(232,221,208,0.2)",
                                        background: isSelected ? "#0a0f0a" : "transparent",
                                        transition: "all 0.2s ease"
                                    }} />
                                    <span>{t.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="select-dropdowns-wrapper" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <CustomSelect label="GENRE" value={filters.genre} options={filterOptions.genres} onChange={(val) => handleFilterChange('genre', val)} />
                    <CustomSelect label="YEAR" value={filters.year} options={filterOptions.years} onChange={(val) => handleFilterChange('year', val)} />
                    <CustomSelect label="COUNTRY" value={filters.country} options={filterOptions.countries} onChange={(val) => handleFilterChange('country', val)} />
                    <CustomSelect label="LANGUAGE" value={filters.language} options={filterOptions.languages} onChange={(val) => handleFilterChange('language', val)} />
                    <CustomSelect label="MINIMUM RATING" value={filters.rating} options={filterOptions.ratings} onChange={(val) => handleFilterChange('rating', val)} />
                </div>
            </aside>

            <main style={{ flex: 1, minWidth: 0 }}>
                <h1 className="search-results-heading" style={{
                    fontSize: "1.1rem",
                    color: "#e8ddd0",
                    fontWeight: 500,
                    marginBottom: "1.75rem"
                }}>
                    Search Results for: <span style={{ color: "#2d9b4e", fontWeight: 700 }}>"{queryParam}"</span>
                </h1>

                {loading ? (
                    <div className="search-results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1.5rem" }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={`sk-${i}`} style={{ background: "#111811", borderRadius: 8, aspectRatio: "2/3", border: "1px solid rgba(150,200,150,0.05)", animation: "pulse 1.5s infinite" }} />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "5rem 2rem", background: "#111811", borderRadius: 10, border: "1px solid rgba(45,155,78,0.05)" }}>
                        <p style={{ color: "rgba(232,221,208,0.3)", fontSize: "0.85rem" }}>No records matched your criteria.</p>
                    </div>
                ) : (
                    <div className="search-results-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                        gap: "1.5rem"
                    }}>
                        {items.map((item) => (
                            <SearchCard key={item.id} item={item} defaultType={filters.type !== 'all' ? filters.type : 'movie'} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <div style={{ background: "#0a0f0a", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "Inter, var(--font-sans), sans-serif", position: "relative" }}>
            <div style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.015,
                backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')",
                zIndex: 1
            }} />

            <Header />

            <Suspense fallback={
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8rem 2rem" }}>
                    <div style={{ background: "#111811", width: "40px", height: "40px", borderRadius: "50%", border: "2px solid rgba(45,155,78,0.2)", borderTopColor: "#2d9b4e", animation: "pulse 1s infinite" }} />
                </div>
            }>
                <SearchContent />
            </Suspense>

            <footer style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                padding: "2.5rem 1rem 2rem",
                textAlign: "center",
                background: "linear-gradient(180deg, transparent, rgba(10,15,10,0.9))",
                marginTop: "auto",
                position: "relative",
                zIndex: 2
            }}>
                <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <Link href="/" style={{ display: "inline-flex", alignItems: "baseline", gap: "0.1rem", textDecoration: "none" }}>
                        <span style={{ fontSize: "1.5rem", color: "#2d9b4e", letterSpacing: "0.08em", fontWeight: 700 }}>ILOVE</span>
                        <span style={{ fontSize: "1.5rem", color: "#e8ddd0", letterSpacing: "0.08em", fontWeight: 400 }}>BIRYANI</span>
                    </Link>
                    <p style={{ fontSize: "0.7rem", color: "rgba(232,221,208,0.2)", letterSpacing: "0.04em", marginTop: "0.25rem" }}>
                        Data from <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" style={{ color: "#2d9b4e", textDecoration: "none" }}>TMDB</a>. All content provided by third parties.
                    </p>
                </div>
            </footer>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                :global(.card-container-item:hover .img-scaler) {
                    transform: scale(1.04);
                }
                :global(.card-container-item:hover .overlay-play-view) {
                    opacity: 1 !important;
                }
                
                :global(.search-layout-container) {
                    padding: 7.5rem 2rem 5rem 2rem;
                }

                @media (max-width: 900px) {
                    :global(.search-layout-container) {
                        flex-direction: column;
                        gap: 1.5rem !important;
                        padding: 6.5rem 1rem 4rem 1rem !important;
                    }
                    :global(.search-sidebar-panel) {
                        width: 100% !important;
                        position: relative !important;
                        top: 0 !important;
                        background: #111811;
                        padding: 1rem;
                        border-radius: 12px;
                        border: 1px solid rgba(45,155,78,0.08);
                    }
                    :global(.type-toggle-row) {
                        flex-direction: row !important;
                        flex-wrap: wrap;
                    }
                    :global(.type-toggle-row > div) {
                        flex: 1;
                        min-width: 100px;
                        justify-content: center;
                    }
                    :global(.select-dropdowns-wrapper) {
                        display: grid !important;
                        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
                        gap: 1rem !important;
                    }
                    :global(.search-results-heading) {
                        margin-top: 0.5rem;
                        margin-bottom: 1.25rem !important;
                    }
                }

                @media (max-width: 500px) {
                    :global(.select-dropdowns-wrapper) {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                    :global(.filter-select-group:last-child) {
                        grid-column: span 2;
                    }
                    :global(.search-results-grid) {
                        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
                        gap: 1rem !important;
                    }
                }
                
                @media (max-width: 360px) {
                    :global(.select-dropdowns-wrapper) {
                        grid-template-columns: 1fr !important;
                    }
                    :global(.filter-select-group:last-child) {
                        grid-column: auto;
                    }
                    :global(.search-results-grid) {
                        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
                    }
                }
            `}</style>
        </div>
    );
}

function SearchCard({ item, defaultType }) {
    const poster = item.poster_path
        ? `https://image.tmdb.org/t/p/w400${item.poster_path}`
        : `https://placehold.co/400x600/111811/8a7a6a?text=No+Poster`;

    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || "").split("-")[0];
    const rating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";

    const mediaType = item.media_type || (item.release_date ? 'movie' : item.first_air_date ? 'tv' : defaultType);

    return (
        <Link href={`/watch/${mediaType}/${item.id}`} className="card-container-item" style={{ display: "flex", flexDirection: "column", height: "100%", textDecoration: "none" }}>
            <div style={{
                background: "#111811",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(150,200,150,0.06)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                flex: 1
            }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden", background: "#0a0f0a" }}>
                    <img
                        src={poster}
                        alt={title}
                        loading="lazy"
                        className="img-scaler"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            filter: "brightness(0.92) saturate(0.95)",
                            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
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
                        border: "1px solid rgba(255,255,255,0.05)",
                        zIndex: 2
                    }}>
                        ★ {rating}
                    </div>

                    <div className="overlay-play-view" style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(10,15,10,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.25s ease",
                        zIndex: 1
                    }}>
                        <div style={{
                            background: "#2d9b4e",
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(45,155,78,0.4)"
                        }}>
                            <Play size={16} fill="white" stroke="none" style={{ marginLeft: 2 }} />
                        </div>
                    </div>
                </div>

                <div style={{ padding: "0.6rem 0.7rem 0.7rem", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
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