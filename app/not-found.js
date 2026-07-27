'use client'
import Link from 'next/link';
import { Film, Home } from 'lucide-react';
import Header from '../app/components/header';
import Footer from '../app/components/Footer';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-bg text-[#e8ddd0] flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                <div
                    className="fixed inset-0 pointer-events-none opacity-[0.015] bg-repeat z-[1]"
                    style={{
                        backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')",
                        backgroundSize: "256px 256px"
                    }}
                />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(45,155,78,0.04)_0%,transparent_70%)] pointer-events-none z-0" />

                <div className="max-w-[600px] w-full text-center relative z-10 fade-up">
                    <div className="flex justify-center mb-8 relative">
                        <div className="flex items-center gap-3 bg-[#2d9b4e]/5 px-6 py-2 rounded-lg border border-[#2d9b4e]/10">
                            <Film size={28} className="text-[#2d9b4e]" />
                            <span className="font-sans text-6xl font-bold text-[#2d9b4e] tracking-widest leading-none">
                                404
                            </span>
                        </div>
                    </div>

                    <h1 className="font-sans text-[clamp(1.8rem,4vw,3rem)] font-bold text-[#e8ddd0] tracking-wide mb-6">
                        This Page is Missing
                    </h1>

                    <Link
                        href="/"
                        className="hero-btn"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}