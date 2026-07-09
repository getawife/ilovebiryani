import Link from 'next/link';
import Header from '../components/header';
import { Film } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';

async function fetchTMDB(endpoint) {
    const res = await fetch(
        `https://api.themoviedb.org/3/${endpoint}`,
        {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
            },
            next: { revalidate: 3600 },
        }
    );
    if (!res.ok) throw new Error(`TMDB error: ${endpoint}`);
    return res.json();
}

export default async function MoviesPage() {
    try {
        const popularData = await fetchTMDB('movie/popular?language=en-US&page=1');
        const popularMovies = popularData.results || [];

        return (
            <div style={{
                minHeight: "100vh",
                background: "#0a0f0a",
                color: "#e8ddd0",
                display: "flex",
                flexDirection: "column"
            }}>
                <Header />
                <main style={{ flex: 1, position: "relative", paddingTop: "1.5rem" }}>
                    <div style={{
                        position: "fixed",
                        inset: 0,
                        pointerEvents: "none",
                        opacity: 0.015,
                        backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')",
                        backgroundRepeat: "repeat",
                        backgroundSize: "256px 256px",
                        zIndex: 1
                    }} />

                    <div style={{
                        maxWidth: 1400,
                        margin: "0 auto",
                        padding: "0 1.5rem 4rem",
                        position: "relative",
                        zIndex: 2
                    }}>
                        <div style={{ marginBottom: "2rem" }}>
                            <h1 style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "clamp(2rem, 4vw, 3rem)",
                                fontWeight: 700,
                                color: "#e8ddd0",
                                letterSpacing: "0.02em",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem"
                            }}>
                                <Film size={32} color="#2d9b4e" />
                                Films
                            </h1>
                            <p style={{
                                fontSize: "0.9rem",
                                color: "rgba(232,221,208,0.4)",
                                fontStyle: "italic",
                                marginTop: "0.25rem"
                            }}>
                                Discover your next favorite film
                            </p>
                        </div>

                        <MovieGrid
                            initialItems={popularMovies}
                            type="movie"
                        />
                    </div>
                </main>
                <Footer />
            </div>
        );
    } catch (error) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#0a0f0a",
                color: "#e8ddd0",
                display: "flex",
                flexDirection: "column"
            }}>
                <Header />
                <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                    <div style={{ textAlign: "center" }}>
                        <Film size={48} color="#2d9b4e" style={{ opacity: 0.3, marginBottom: "1rem" }} />
                        <p style={{ color: "rgba(232,221,208,0.4)", fontSize: "0.95rem", fontStyle: "italic" }}>
                            Could not load films. Please try again later.
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}

function Footer() {
    return (
        <footer style={{
            borderTop: "1px solid rgba(150,200,150,0.05)",
            padding: "2.5rem 1.5rem 2rem",
            textAlign: "center",
            background: "linear-gradient(180deg, transparent, rgba(10,15,10,0.9))",
            position: "relative"
        }}>
            <div style={{
                maxWidth: 1400,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem"
            }}>
                <Link href="/" style={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: "0.1rem",
                    textDecoration: "none",
                    marginBottom: "0.25rem"
                }}>
                    <span style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "1.6rem",
                        color: "#2d9b4e",
                        letterSpacing: "0.08em",
                        fontWeight: 700
                    }}>ILOVE</span>
                    <span style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "1.6rem",
                        color: "#e8ddd0",
                        letterSpacing: "0.08em",
                        fontWeight: 400
                    }}>BIRYANI</span>
                </Link>
                <p style={{
                    fontSize: "0.7rem",
                    color: "rgba(232,221,208,0.2)",
                    marginTop: "0.25rem",
                    letterSpacing: "0.04em"
                }}>
                    Data from{" "}
                    <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" style={{
                        color: "#2d9b4e",
                        textDecoration: "none",
                        transition: "color 0.2s ease"
                    }}>TMDB</a>.
                    <span style={{ display: "inline-block", margin: "0 0.5rem", opacity: 0.3 }}>·</span>
                    For the love of cinema.
                </p>
            </div>
        </footer>
    );
}