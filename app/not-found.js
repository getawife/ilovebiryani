'use client'
import Link from 'next/link';
import { Film, Home } from 'lucide-react';
import Header from '../app/components/header';

export default function NotFound() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "#0a0f0a",
            color: "#e8ddd0",
            display: "flex",
            flexDirection: "column"
        }}>
            <Header />

            <main style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                position: "relative"
            }}>
                <div style={{
                    position: "fixed",
                    inset: 0,
                    pointerEvents: "none",
                    opacity: 0.015,
                    backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')",
                    backgroundRepeat: "repeat",
                    backgroundSize: "256px 256px",
                    zIndex: 0
                }} />

                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60%",
                    height: "60%",
                    background: "radial-gradient(ellipse at center, rgba(45,155,78,0.04) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0
                }} />

                <div style={{
                    maxWidth: 600,
                    width: "100%",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                    animation: "fadeIn 0.6s ease both"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "2rem",
                        position: "relative"
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            background: "rgba(45,155,78,0.04)",
                            padding: "0.5rem 1.5rem",
                            borderRadius: 8,
                            border: "1px solid rgba(45,155,78,0.06)"
                        }}>
                            <Film size={28} color="#2d9b4e" />
                            <span style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "4rem",
                                fontWeight: 700,
                                color: "#2d9b4e",
                                letterSpacing: "0.08em",
                                lineHeight: 1
                            }}>
                                404
                            </span>
                        </div>
                    </div>

                    <h1 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.8rem, 4vw, 3rem)",
                        fontWeight: 700,
                        color: "#e8ddd0",
                        letterSpacing: "0.04em",
                        marginBottom: "1.5rem"
                    }}>
                        This Page is Missing
                    </h1>

                    <Link href="/" className="hero-btn" style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.7rem 1.8rem",
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        background: "linear-gradient(135deg, #2d9b4e, #1a6b32)",
                        color: "#fff",
                        textDecoration: "none",
                        boxShadow: "0 4px 28px rgba(45,155,78,0.3)",
                        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        border: "1px solid rgba(255,255,255,0.05)"
                    }}>
                        <Home size={18} />
                        Back to Home
                    </Link>
                </div>
            </main>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
}