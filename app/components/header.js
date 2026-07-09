
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, X, Film, Menu } from "lucide-react";

export default function Header() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const searchTimeout = useRef(null);
    const mobileMenuRef = useRef(null);

    // Detect scroll for header blur effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (data.results) {
                    setResults(data.results);
                    setIsOpen(data.results.length > 0);
                } else {
                    setResults([]);
                    setIsOpen(false);
                }
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
                setIsOpen(false);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(searchTimeout.current);
    }, [query]);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Click outside for mobile menu
    useEffect(() => {
        const handler = (e) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener("mousedown", handler);
        }
        return () => document.removeEventListener("mousedown", handler);
    }, [isMobileMenuOpen]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    const clearSearch = useCallback(() => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
        setIsLoading(false);
    }, []);

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                transition: "all 0.4s ease",
                background: scrolled
                    ? "rgba(10,15,10,0.92)"
                    : "rgba(10,15,10,0.4)",
                backdropFilter: scrolled ? "blur(20px) saturate(140%)" : "blur(8px)",
                borderBottom: scrolled
                    ? "1px solid rgba(45,155,78,0.06)"
                    : "1px solid transparent",
                boxShadow: scrolled
                    ? "0 4px 32px rgba(0,0,0,0.4)"
                    : "none"
            }}
        >
            <div style={{
                maxWidth: 1400,
                margin: "0 auto",
                padding: "0.7rem 1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                position: "relative",
                flexWrap: "wrap"
            }}>

                <Link href="/" style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.1rem",
                    flexShrink: 0
                }}>
                    <span style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                        color: "#2d9b4e",
                        fontWeight: 700,
                        letterSpacing: "0.06em"
                    }}>
                        ILOVE
                    </span>
                    <span style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                        color: "#e8ddd0",
                        fontWeight: 400,
                        letterSpacing: "0.06em"
                    }}>
                        BIRYANI
                    </span>
                </Link>

                <div ref={dropdownRef} style={{
                    position: "relative",
                    flex: 1,
                    maxWidth: "clamp(180px, 40vw, 420px)",
                    minWidth: "clamp(120px, 20vw, 160px)",
                    order: 2
                }}>
                    <div style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center"
                    }}>
                        <Search
                            size={16}
                            style={{
                                position: "absolute",
                                left: "0.8rem",
                                color: "rgba(232,221,208,0.25)",
                                pointerEvents: "none"
                            }}
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search films..."
                            style={{
                                width: "100%",
                                padding: "0.4rem 0.8rem 0.4rem 2.2rem",
                                borderRadius: 6,
                                background: "rgba(45,155,78,0.04)",
                                border: "1px solid rgba(45,155,78,0.06)",
                                color: "#e8ddd0",
                                fontSize: "clamp(0.75rem, 1vw, 0.85rem)",
                                outline: "none",
                                transition: "all 0.25s ease",
                                fontFamily: "var(--font-sans)",
                                minWidth: "clamp(80px, 15vw, 120px)"
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "rgba(45,155,78,0.2)";
                                e.currentTarget.style.background = "rgba(45,155,78,0.06)";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "rgba(45,155,78,0.06)";
                                e.currentTarget.style.background = "rgba(45,155,78,0.04)";
                            }}
                        />
                        {isLoading && (
                            <div style={{
                                position: "absolute",
                                right: "0.8rem",
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                border: "2px solid rgba(45,155,78,0.1)",
                                borderTopColor: "#2d9b4e",
                                animation: "spin 0.8s linear infinite"
                            }} />
                        )}
                        {query && !isLoading && (
                            <button
                                onClick={clearSearch}
                                style={{
                                    position: "absolute",
                                    right: "0.6rem",
                                    background: "none",
                                    border: "none",
                                    color: "rgba(232,221,208,0.2)",
                                    cursor: "pointer",
                                    padding: "0.2rem",
                                    display: "flex",
                                    alignItems: "center",
                                    transition: "color 0.2s ease"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(232,221,208,0.5)"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,221,208,0.2)"}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {isOpen && results.length > 0 && (
                        <div style={{
                            position: "absolute",
                            top: "calc(100% + 0.5rem)",
                            left: 0,
                            right: 0,
                            background: "rgba(14,22,14,0.95)",
                            backdropFilter: "blur(20px)",
                            borderRadius: 8,
                            border: "1px solid rgba(45,155,78,0.06)",
                            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                            maxHeight: 400,
                            overflowY: "auto",
                            padding: "0.4rem",
                            zIndex: 100
                        }}>
                            {results.slice(0, 8).map((item) => {
                                const title = item.title || item.name;
                                const year = (item.release_date || item.first_air_date || "").split("-")[0];
                                const poster = item.poster_path
                                    ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                                    : null;
                                const mediaType = item.media_type || "movie";
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/watch/${mediaType}/${item.id}`}
                                        onClick={clearSearch}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.75rem",
                                            padding: "0.4rem 0.6rem",
                                            borderRadius: 4,
                                            textDecoration: "none",
                                            transition: "background 0.15s ease",
                                            color: "#e8ddd0"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.06)"}
                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                        {poster ? (
                                            <img
                                                src={poster}
                                                alt={title}
                                                style={{
                                                    width: 36,
                                                    height: 54,
                                                    objectFit: "cover",
                                                    borderRadius: 3,
                                                    flexShrink: 0,
                                                    border: "1px solid rgba(45,155,78,0.04)"
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: 36,
                                                height: 54,
                                                background: "#1a221a",
                                                borderRadius: 3,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                border: "1px solid rgba(45,155,78,0.04)",
                                                color: "rgba(232,221,208,0.15)",
                                                fontSize: "0.6rem"
                                            }}>
                                                <Film size={16} />
                                            </div>
                                        )}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{
                                                fontSize: "clamp(0.7rem, 0.9vw, 0.8rem)",
                                                fontWeight: 500,
                                                margin: 0,
                                                lineHeight: 1.3,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {title}
                                            </p>
                                            <p style={{
                                                fontSize: "clamp(0.55rem, 0.7vw, 0.65rem)",
                                                color: "rgba(232,221,208,0.25)",
                                                margin: 0,
                                                letterSpacing: "0.04em"
                                            }}>
                                                {year || "—"} · {mediaType === "tv" ? "Series" : "Film"}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {isOpen && results.length === 0 && query && !isLoading && (
                        <div style={{
                            position: "absolute",
                            top: "calc(100% + 0.5rem)",
                            left: 0,
                            right: 0,
                            background: "rgba(14,22,14,0.95)",
                            backdropFilter: "blur(20px)",
                            borderRadius: 8,
                            border: "1px solid rgba(45,155,78,0.06)",
                            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                            padding: "1.5rem",
                            textAlign: "center"
                        }}>
                            <p style={{
                                fontSize: "clamp(0.7rem, 0.9vw, 0.8rem)",
                                color: "rgba(232,221,208,0.25)",
                                fontStyle: "italic"
                            }}>
                                No films found for "{query}"
                            </p>
                        </div>
                    )}
                </div>

                <nav style={{
                    display: "flex",
                    gap: "clamp(0.4rem, 1vw, 0.75rem)",
                    alignItems: "center",
                    flexShrink: 0,
                    marginLeft: "auto",
                    order: 3
                }}>
                    <Link href="/" style={{
                        color: "rgba(232,221,208,0.5)",
                        textDecoration: "none",
                        fontSize: "clamp(0.65rem, 0.9vw, 0.75rem)",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        transition: "color 0.2s ease",
                        padding: "0.3rem 0.5rem",
                        borderRadius: 4,
                        whiteSpace: "nowrap"
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#e8ddd0"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,221,208,0.5)"}
                    >
                        Home
                    </Link>
                    <span style={{
                        color: "rgba(45,155,78,0.06)",
                        fontSize: "clamp(0.6rem, 0.8vw, 0.8rem)"
                    }}>|</span>
                    <Link href="/movies" style={{
                        color: "rgba(232,221,208,0.5)",
                        textDecoration: "none",
                        fontSize: "clamp(0.65rem, 0.9vw, 0.75rem)",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        transition: "color 0.2s ease",
                        padding: "0.3rem 0.5rem",
                        borderRadius: 4,
                        whiteSpace: "nowrap"
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#e8ddd0"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,221,208,0.5)"}
                    >
                        Films
                    </Link>
                    <span style={{
                        color: "rgba(45,155,78,0.06)",
                        fontSize: "clamp(0.6rem, 0.8vw, 0.8rem)"
                    }}>|</span>
                    <Link href="/tv" style={{
                        color: "rgba(232,221,208,0.5)",
                        textDecoration: "none",
                        fontSize: "clamp(0.65rem, 0.9vw, 0.75rem)",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        transition: "color 0.2s ease",
                        padding: "0.3rem 0.5rem",
                        borderRadius: 4,
                        whiteSpace: "nowrap"
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#e8ddd0"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,221,208,0.5)"}
                    >
                        Series
                    </Link>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{
                            display: "none",
                            background: "none",
                            border: "none",
                            color: "#e8ddd0",
                            cursor: "pointer",
                            padding: "0.3rem",
                            borderRadius: 4,
                            transition: "background 0.2s ease",
                            marginLeft: "0.5rem"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.06)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                        aria-label="Toggle menu"
                    >
                        <Menu size={22} />
                    </button>
                </nav>
            </div>

            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "rgba(10,15,10,0.98)",
                        backdropFilter: "blur(20px)",
                        borderBottom: "1px solid rgba(45,155,78,0.06)",
                        padding: "1rem 1.5rem",
                        display: "none",
                        flexDirection: "column",
                        gap: "0.5rem",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                        animation: "slideDown 0.3s ease",
                        zIndex: 100
                    }}
                >
                    <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            color: "#e8ddd0",
                            textDecoration: "none",
                            fontSize: "1rem",
                            padding: "0.6rem 0.8rem",
                            borderRadius: 4,
                            transition: "background 0.2s ease",
                            fontWeight: 500
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.06)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                        🏠 Home
                    </Link>
                    <Link
                        href="/movies"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            color: "#e8ddd0",
                            textDecoration: "none",
                            fontSize: "1rem",
                            padding: "0.6rem 0.8rem",
                            borderRadius: 4,
                            transition: "background 0.2s ease",
                            fontWeight: 500
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.06)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                        🎬 Films
                    </Link>
                    <Link
                        href="/tv"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            color: "#e8ddd0",
                            textDecoration: "none",
                            fontSize: "1rem",
                            padding: "0.6rem 0.8rem",
                            borderRadius: 4,
                            transition: "background 0.2s ease",
                            fontWeight: 500
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.06)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                        📺 Series
                    </Link>
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    nav .mobile-menu-toggle {
                        display: flex !important;
                    }
                    
                    .mobile-menu-dropdown {
                        display: flex !important;
                    }
                }

                @media (min-width: 769px) {
                    button[aria-label="Toggle menu"] {
                        display: none !important;
                    }
                }

                
                @media (max-width: 768px) {
                    button[aria-label="Toggle menu"] {
                        display: flex !important;
                    }
                    
                    /* Hide desktop nav links on mobile */
                    nav a:not(:last-child),
                    nav span {
                        display: none !important;
                    }
                }

                @media (max-width: 480px) {
                    .header-content {
                        gap: 0.75rem !important;
                        padding: 0.5rem 1rem !important;
                    }
                    
                    .mobile-menu-dropdown {
                        padding: 0.75rem 1rem !important;
                    }
                    
                    .mobile-menu-dropdown a {
                        font-size: 0.9rem !important;
                        padding: 0.5rem 0.6rem !important;
                    }
                }
            `}</style>
        </header>
    );
}