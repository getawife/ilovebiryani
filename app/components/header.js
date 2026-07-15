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
        <header className="sticky top-0 z-50 w-full bg-black/[0.01] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
            <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-3 sm:px-6">

                <Link href="/" className="flex items-baseline gap-0.5 shrink-0 select-none">
                    <span className="font-sans text-[clamp(1.1rem,2.5vw,1.4rem)] font-bold tracking-wider text-[#2d9b4e]">
                        ILOVE
                    </span>
                    <span className="font-sans text-[clamp(1.1rem,2.5vw,1.4rem)] font-normal tracking-wider text-[#e8ddd0]">
                        BIRYANI
                    </span>
                </Link>

                <div className="relative flex-1 max-w-[420px] min-w-35">
                    <div className="relative flex items-center">
                        <Search
                            size={16}
                            className="absolute left-3 text-white/20 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            placeholder="Search films and press Enter..."
                            className="w-full font-sans text-[clamp(0.75rem,1vw,0.85rem)] text-[#e8ddd0] bg-white/[0.03] border border-white/[0.06] rounded-md pl-9 pr-8 py-1.5 outline-none placeholder:text-white/20 transition-all duration-200 focus:border-emerald-500/30 focus:bg-white/[0.06]"
                        />
                        {query && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-2.5 p-0.5 flex items-center justify-center text-white/20 hover:text-white/50 transition-colors duration-200"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <nav className="flex items-center ml-auto shrink-0 gap-3">
                    <div className="hidden md:flex items-center gap-2 lg:gap-3">
                        <Link
                            href="/"
                            className="font-medium text-[clamp(0.65rem,0.9vw,0.75rem)] tracking-wide text-white/50 rounded px-2 py-1 transition-colors duration-200 hover:text-[#e8ddd0]"
                        >
                            Home
                        </Link>
                        <span className="text-white/[0.06] text-[clamp(0.6rem,0.8vw,0.8rem)] select-none">|</span>
                        <Link
                            href="/movies"
                            className="font-medium text-[clamp(0.65rem,0.9vw,0.75rem)] tracking-wide text-white/50 rounded px-2 py-1 transition-colors duration-200 hover:text-[#e8ddd0]"
                        >
                            Films
                        </Link>
                        <span className="text-white/[0.06] text-[clamp(0.6rem,0.8vw,0.8rem)] select-none">|</span>
                        <Link
                            href="/tv"
                            className="font-medium text-[clamp(0.65rem,0.9vw,0.75rem)] tracking-wide text-white/50 rounded px-2 py-1 transition-colors duration-200 hover:text-[#e8ddd0]"
                        >
                            Series
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex items-center p-1.5 text-[#e8ddd0] rounded transition-colors duration-200 hover:bg-white/[0.06]"
                        aria-label="Toggle menu"
                    >
                        <Menu size={20} />
                    </button>
                </nav>
            </div>

            <div
                ref={mobileMenuRef}
                className={`absolute top-full left-0 right-0 w-full bg-black/[0.85] backdrop-blur-2xl border-b border-white/[0.06] p-4 flex flex-col gap-2 shadow-2xl z-[100] transition-all duration-300 md:hidden ${isMobileMenuOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
            >
                <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 font-medium text-sm text-[#e8ddd0] rounded-md px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.06]"
                >
                    <Home size={16} className="text-white/60" /> Home
                </Link>
                <Link
                    href="/movies"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 font-medium text-sm text-[#e8ddd0] rounded-md px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.06]"
                >
                    <Film size={16} className="text-white/60" /> Films
                </Link>
                <Link
                    href="/tv"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 font-medium text-sm text-[#e8ddd0] rounded-md px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.06]"
                >
                    <Tv size={16} className="text-white/60" /> Series
                </Link>
            </div>
        </header>
    );
}