'use client'
import Link from 'next/link';
import { Film, Home } from 'lucide-react';
import Header from '../app/components/header';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0f0a] text-[#e8ddd0] flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                <div
                    className="fixed inset-0 pointer-events-none opacity-[0.015] bg-repeat z-0"
                    style={{
                        backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"1\"/%3E%3C/svg%3E')",
                        backgroundSize: "256px 256px"
                    }}
                />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(45,155,78,0.04)_0%,transparent_70%)] pointer-events-none z-0" />

                <div className="max-w-[600px] w-full text-center relative z-10 animate-[fadeIn_0.6s_ease_both]">
                    <div className="flex justify-center mb-8 relative">
                        <div className="flex items-center gap-3 bg-[#2d9b4e]/5 px-6 py-2 rounded-lg border border-[#2d9b4e]/10">
                            <Film size={28} className="text-[#2d9b4e]" />
                            <span className="font-[family-name:var(--font-display)] text-6xl font-bold text-[#2d9b4e] tracking-widest leading-none">
                                404
                            </span>
                        </div>
                    </div>

                    <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,3rem)] font-bold text-[#e8ddd0] tracking-wide mb-6">
                        This Page is Missing
                    </h1>

                    <Link
                        href="/"
                        className="hero-btn inline-flex items-center gap-2 px-7 py-3 rounded-md font-semibold text-[0.85rem] tracking-wide uppercase bg-gradient-to-br from-[#2d9b4e] to-[#1a6b32] text-white no-underline shadow-[0_4px_28px_rgba(45,155,78,0.3)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-white/5 hover:scale-[1.02] hover:shadow-[0_6px_32px_rgba(45,155,78,0.4)]"
                    >
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