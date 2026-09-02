"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Menu, Film, Tv } from "lucide-react";

export default function Header() {
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchSubmit = useCallback(
    (e) => {
      if (e.key === "Enter" && query.trim()) {
        setIsMobileMenuOpen(false);
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router],
  );

  useEffect(() => {
    const handler = (e) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !mobileMenuButtonRef.current?.contains(e.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handler);
    }

    return () => document.removeEventListener("mousedown", handler);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        requestAnimationFrame(() => {
          mobileMenuButtonRef.current?.focus();
        });
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const isMobileScreen = window.innerWidth <= 768;

    if (isMobileMenuOpen && isMobileScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const clearSearch = useCallback(() => {
    setQuery("");
  }, []);

  const navItems = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/movies",
      label: "Films",
      icon: Film,
    },
    {
      href: "/tv",
      label: "Series",
      icon: Tv,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#070907] border-b border-white/[0.08] transition-colors duration-200">
      {" "}
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {" "}
        <div className="flex items-center gap-8">
          {" "}
          <Link
            href="/"
            aria-label="ILOVE BIRYANI home"
            className="flex items-center gap-1.5 shrink-0 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942] rounded"
          >
            {" "}
            <div className="flex items-baseline tracking-wider">
              {" "}
              <span className="font-display text-2xl sm:text-3xl text-[#F4B942] font-bold tracking-wider">
                ILOVE{" "}
              </span>{" "}
              <span className="font-display text-2xl sm:text-3xl text-[#f3ede2] font-bold tracking-wider ml-1">
                BIRYANI{" "}
              </span>{" "}
            </div>{" "}
          </Link>
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded transition-all duration-150 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942] ${
                    isActive
                      ? "bg-white/[0.08] text-[#F4B942] font-bold"
                      : "text-[#9e988f] hover:text-[#f3ede2] hover:bg-white/[0.04]"
                  }`}
                >
                  {Icon && (
                    <Icon size={14} strokeWidth={2} aria-hidden="true" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 flex-1 max-w-[380px] justify-end">
          <div className="relative w-full max-w-[320px]">
            <Search
              size={15}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e988f] pointer-events-none"
            />

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search title, cast... (Enter)"
              aria-label="Search titles and cast"
              className="w-full bg-[#111611] text-xs font-medium text-[#f3ede2] placeholder-[#5e5952] border border-white/[0.08] rounded-md pl-9 pr-8 py-2 outline-none focus:border-[#F4B942]/50 focus:bg-[#151c15] focus:ring-2 focus:ring-[#F4B942]/20 transition-all"
            />

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#9e988f] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942] rounded"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className="md:hidden flex items-center justify-center p-2 text-[#f3ede2] rounded bg-[#111611] border border-white/[0.08] hover:bg-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942]"
          >
            {isMobileMenuOpen ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-navigation"
          className="md:hidden bg-[#0a0d0a] border-b border-white/[0.08] px-4 py-3 flex flex-col gap-1 shadow-2xl"
        >
          <nav aria-label="Mobile navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm font-semibold tracking-wide px-3 py-2.5 rounded flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942] ${
                    isActive
                      ? "bg-white/[0.08] text-[#F4B942] font-bold"
                      : "text-[#9e988f] hover:text-[#f3ede2] hover:bg-white/[0.04]"
                  }`}
                >
                  {Icon && (
                    <Icon size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
