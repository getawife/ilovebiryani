"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Menu, Film, Tv, Bookmark } from "lucide-react";
import { getBookmarks, BOOKMARKS_EVENT } from "../../lib/bookmarks";

export default function Header() {
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const updateCount = () => {
      setBookmarkCount(getBookmarks().length);
    };
    updateCount();
    window.addEventListener(BOOKMARKS_EVENT, updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

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
    {
      href: "/bookmarks",
      label: "Watch Later",
      icon: Bookmark,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#070907]/95 backdrop-blur-md border-b border-white/[0.12] transition-colors duration-200">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label="ILOVE BIRYANI home"
            className="flex items-center gap-1.5 shrink-0 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942] rounded-md transition-transform active:scale-95"
          >
            <div className="flex items-baseline tracking-wider">
              <span className="font-display text-2xl sm:text-3xl text-[#F4B942] font-bold tracking-wider">
                ILOVE
              </span>
              <span className="font-display text-2xl sm:text-3xl text-[#f3ede2] font-bold tracking-wider ml-1">
                BIRYANI
              </span>
            </div>
          </Link>

          <nav
            className="hidden md:flex items-center gap-1.5"
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
                  className={`text-sm font-bold tracking-wider uppercase px-3.5 py-2 rounded-md transition-all duration-150 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942] ${
                    isActive
                      ? "bg-white/[0.12] text-[#F4B942] font-bold shadow-inner"
                      : "text-[#E0E0E0] hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {Icon && (
                    <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5 flex-1 max-w-[440px] justify-end">
          <div className="relative w-full max-w-[340px]">
            <Search
              size={16}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E0E0E0] pointer-events-none"
            />

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search title, cast... (Enter)"
              aria-label="Search titles and cast"
              className="w-full bg-[#111611] text-sm font-medium text-[#f3ede2] placeholder-[#A3A3A3] border border-white/[0.16] rounded-md pl-9 pr-9 py-2 outline-none focus:border-[#F4B942] focus:bg-[#162016] focus:ring-2 focus:ring-[#F4B942]/30 transition-all"
            />

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#E0E0E0] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942] rounded"
              >
                <X size={15} aria-hidden="true" />
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
            className="md:hidden flex items-center justify-center h-[38px] w-[38px] text-[#f3ede2] rounded-md bg-[#111611] border border-white/[0.14] hover:bg-white/[0.1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942]"
          >
            {isMobileMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-navigation"
          className="md:hidden bg-[#0a0d0a] border-b border-white/[0.12] px-4 py-3 flex flex-col gap-1.5 shadow-2xl"
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
                  className={`text-sm font-bold tracking-wide px-3.5 py-3 rounded-md flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942] ${
                    isActive
                      ? "bg-white/[0.12] text-[#F4B942]"
                      : "text-[#E0E0E0] hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {Icon && (
                    <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
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
