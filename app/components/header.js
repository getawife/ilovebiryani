"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ThemeToggle from "./themeToggle";

export default function Header() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.trim().length < 3) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.results || []);
                    setIsOpen(true);
                }
            } catch (err) {
                console.error("Failed to fetch search results:", err);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-muted/10 px-6 md:px-12 py-4 flex items-center justify-between transition-colors duration-300">

            <Link href="/" className="flex items-center gap-1 cursor-pointer select-none">
                <span className="font-display text-3xl tracking-wider text-primary">ILOVE</span>
                <span className="font-display text-3xl tracking-wider text-foreground">BIRYANI</span>
            </Link>



            <div ref={dropdownRef} className="relative w-full max-w-xs sm:max-w-sm">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length >= 3 && setIsOpen(true)}
                    placeholder="Search movies or TV shows..."
                    className="w-full bg-panel text-foreground placeholder-muted/70 text-sm font-sans pl-10 pr-4 py-2 rounded-full border border-muted/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />

                {isOpen && results.length > 0 && (
                    <div className="absolute top-full right-0 mt-2 w-full min-w-[280px] sm:min-w-[360px] bg-panel border border-muted/20 rounded-2xl p-2 shadow-2xl max-h-[380px] overflow-y-auto space-y-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="text-[10px] font-bold tracking-widest text-muted uppercase px-3 py-1.5 border-b border-muted/10">
                            Search Results
                        </div>

                        {results.map((item) => (
                            <Link
                                key={`${item.type}-${item.id}`}
                                href={`/watch/${item.type}/${item.id}`}
                                onClick={() => setIsOpen(false)}
                                className="w-full flex items-center gap-3 p-2 hover:bg-background rounded-xl transition-colors text-left group"
                            >
                                <img
                                    src={item.poster}
                                    alt={item.title}
                                    className="w-9 h-12 rounded-lg object-cover bg-muted/10 shrink-0 border border-muted/5"
                                />
                                <div className="overflow-hidden">
                                    <h3 className="font-sans font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors truncate">
                                        {item.title}
                                    </h3>
                                    <p className="font-sans text-xs text-muted mt-0.5 capitalize">
                                        {item.type} • {item.year || "N/A"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

        </header>
    );
}