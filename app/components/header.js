"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Menu, Home, Film, Tv } from "lucide-react";

export default function Header() {
    const [query, setQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);
    const router = useRouter();

    // Handle form submission / Enter key press
    const handleSearchSubmit = useCallback((e) => {
        if (e.key === "Enter" && query.trim()) {
            setIsMobileMenuOpen(false); // Close mobile tray if open
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    }, [query, router]);

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

    // Freeze body scrolling only when mobile menu is active
    useEffect(() => {
        const isMobileScreen = window.innerWidth <= 768;
        if (isMobileMenuOpen && isMobileScreen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    const clearSearch = useCallback(() => {
        setQuery("");
    }, []);

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                background: "transparent",
                backdropFilter: "none",
                borderBottom: "1px solid transparent",
                boxShadow: "none"
            }}
        >
            <div style={{
                maxWidth: 1400,
                margin: "0 auto",
                padding: "0.7rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                position: "relative",
                flexWrap: "nowrap"
            }}>

                <Link href="/" style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.1rem",
                    flexShrink: 0
                }}>
                    <span style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                        color: "#2d9b4e",
                        fontWeight: 700,
                        letterSpacing: "0.06em"
                    }}>
                        ILOVE
                    </span>
                    <span style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                        color: "#e8ddd0",
                        fontWeight: 400,
                        letterSpacing: "0.06em"
                    }}>
                        BIRYANI
                    </span>
                </Link>

                {/* Input Area */}
                <div style={{
                    position: "relative",
                    flex: 1,
                    maxWidth: 420,
                    minWidth: 140
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
                            onKeyDown={handleSearchSubmit}
                            placeholder="Search films and press Enter..."
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
                                fontFamily: "var(--font-sans)"
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
                        {query && (
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
                </div>

                <nav style={{
                    display: "flex",
                    gap: "clamp(0.4rem, 1vw, 0.75rem)",
                    alignItems: "center",
                    flexShrink: 0,
                    marginLeft: "auto"
                }}>
                    <div className="desktop-links" style={{ display: "flex", alignItems: "center", gap: "clamp(0.4rem, 1vw, 0.75rem)" }}>
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
                        <span style={{ color: "rgba(45,155,78,0.06)", fontSize: "clamp(0.6rem, 0.8vw, 0.8rem)" }}>|</span>
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
                        <span style={{ color: "rgba(45,155,78,0.06)", fontSize: "clamp(0.6rem, 0.8vw, 0.8rem)" }}>|</span>
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
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="mobile-toggle-btn"
                        style={{
                            display: "none",
                            background: "none",
                            border: "none",
                            color: "#e8ddd0",
                            cursor: "pointer",
                            padding: "0.3rem",
                            borderRadius: 4,
                            transition: "background 0.2s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.06)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                        aria-label="Toggle menu"
                    >
                        <Menu size={20} />
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
                        display: "flex",
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
                            fontSize: "0.9rem",
                            padding: "0.6rem 0.8rem",
                            borderRadius: 4,
                            transition: "background 0.2s ease",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.06)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                        <Home size={16} style={{ color: "rgba(232,221,208,0.7)" }} /> Home
                    </Link>
                    <Link
                        href="/movies"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            color: "#e8ddd0",
                            textDecoration: "none",
                            fontSize: "0.9rem",
                            padding: "0.6rem 0.8rem",
                            borderRadius: 4,
                            transition: "background 0.2s ease",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.06)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                        <Film size={16} style={{ color: "rgba(232,221,208,0.7)" }} /> Films
                    </Link>
                    <Link
                        href="/tv"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            color: "#e8ddd0",
                            textDecoration: "none",
                            fontSize: "0.9rem",
                            padding: "0.6rem 0.8rem",
                            borderRadius: 4,
                            transition: "background 0.2s ease",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(45,155,78,0.06)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                        <Tv size={16} style={{ color: "rgba(232,221,208,0.7)" }} /> Series
                    </Link>
                </div>
            )}

            <style jsx>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 680px) {
                    .desktop-links {
                        display: none !important;
                    }
                    .mobile-toggle-btn {
                        display: flex !important;
                    }
                }
            `}</style>
        </header>
    );
}