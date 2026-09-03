"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  Trash2,
  CheckSquare,
  Square,
  Film,
  Tv,
  Play,
  Star,
  Search,
  X,
  Check,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/Footer";
import {
  getBookmarks,
  removeBookmark,
  removeBookmarks,
  BOOKMARKS_EVENT,
} from "../../lib/bookmarks";

export default function BookmarksPage() {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  useEffect(() => {
    const loadData = () => {
      setItems(getBookmarks());
      setIsLoaded(true);
    };

    loadData();
    window.addEventListener(BOOKMARKS_EVENT, loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemType = item.type || item.media_type || "movie";
      if (typeFilter !== "all" && itemType !== typeFilter) return false;

      if (searchQuery.trim()) {
        const title = (item.title || item.name || "").toLowerCase();
        if (!title.includes(searchQuery.toLowerCase().trim())) return false;
      }

      return true;
    });
  }, [items, typeFilter, searchQuery]);

  const movieCount = useMemo(
    () =>
      items.filter((i) => (i.type || i.media_type || "movie") === "movie")
        .length,
    [items]
  );

  const tvCount = useMemo(
    () =>
      items.filter((i) => (i.type || i.media_type || "tv") === "tv").length,
    [items]
  );

  const toggleSelectKey = (key) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedKeys.size === filteredItems.length) {
      setSelectedKeys(new Set());
    } else {
      const allKeys = new Set(
        filteredItems.map(
          (item) => `${item.type || item.media_type || "movie"}_${item.id}`
        )
      );
      setSelectedKeys(allKeys);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedKeys.size === 0) return;

    const keysArray = Array.from(selectedKeys).map((k) => {
      const [type, id] = k.split("_");
      return { type, id };
    });

    removeBookmarks(keysArray);
    setSelectedKeys(new Set());
    if (items.length - keysArray.length === 0) {
      setIsSelectMode(false);
    }
  };

  const handleQuickDelete = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    removeBookmark(item.id, item.type || item.media_type || "movie");
  };

  return (
    <div className="relative min-h-screen bg-[#070907] text-[#f3ede2] flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/biryani.jpg"
          alt="Biryani bg"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[#070907]/50 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070907] via-[#070907]/30 to-[#070907]/90" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-12 pb-24">
          <div className="mb-6 sm:mb-8 border-b border-white/[0.12] pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-[#f3ede2] uppercase">
                    Watch Later
                  </h1>
                </div>

              </div>


            </div>

            {items.length > 0 && (
              <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {[
                    { id: "all", label: `All (${items.length})` },
                    { id: "movie", label: `Films (${movieCount})`, icon: Film },
                    { id: "tv", label: `Series (${tvCount})`, icon: Tv },
                  ].map((t) => {
                    const isActive = typeFilter === t.id;
                    const Icon = t.icon;

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTypeFilter(t.id)}
                        className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border flex items-center gap-1.5 shrink-0 ${
                          isActive
                            ? "bg-primary text-black border-primary"
                            : "bg-surface text-text-sub border-border hover:bg-surface-hover hover:text-white"
                        }`}
                      >
                        {Icon && <Icon size={13} strokeWidth={2.2} />}
                        {t.label}
                      </button>
                    );
                  })}
                </div>

              </div>
            )}
          </div>


          {!isLoaded ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton-shimmer rounded-lg aspect-[2/3] w-full"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 px-6 bg-surface/95 backdrop-blur-xl rounded-2xl border border-border max-w-xl mx-auto text-center justify-center items-center">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-text-main uppercase mb-2">
                Your Watch Later is Empty
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {filteredItems.map((item) => {
                const itemType = item.type || item.media_type || "movie";
                const itemKey = `${itemType}_${item.id}`;
                const isSelected = selectedKeys.has(itemKey);
                const poster = item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : null;
                const title = item.title || item.name || "Untitled";
                const year = (
                  item.release_date ||
                  item.first_air_date ||
                  ""
                ).split("-")[0];
                const rating = item.vote_average
                  ? Number(item.vote_average).toFixed(1)
                  : "0.0";

                if (isSelectMode) {
                  return (
                    <div
                      key={itemKey}
                      onClick={() => toggleSelectKey(itemKey)}
                      className={`group block text-left select-none cursor-pointer transition-colors rounded-lg overflow-hidden border ${
                        isSelected
                          ? "border-primary bg-surface-elevated"
                          : "border-border bg-surface hover:border-white/25"
                      }`}
                    >
                      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-hover">
                        {poster ? (
                          <img
                            src={poster}
                            alt={title}
                            loading="lazy"
                            className={`w-full h-full object-cover ${
                              isSelected ? "opacity-75" : "opacity-90"
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-surface">
                            <span className="font-display text-lg text-text-muted mb-1">
                              NO POSTER
                            </span>
                          </div>
                        )}

                        <div className="absolute top-2.5 left-2.5 z-10">
                          <div
                            className={`h-6 w-6 rounded-md flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-primary text-black"
                                : "bg-black/70 text-white border border-white/40"
                            }`}
                          >
                            {isSelected ? (
                              <Check size={16} strokeWidth={3} />
                            ) : null}
                          </div>
                        </div>

                        <div className="absolute top-2.5 right-2.5 card-badge-pill uppercase text-[10px]">
                          {itemType === "tv" ? "TV" : "Movie"}
                        </div>
                      </div>

                      <div className="p-3 bg-surface">
                        <h3
                          className={`text-sm font-bold line-clamp-1 ${
                            isSelected ? "text-primary" : "text-text-main"
                          }`}
                        >
                          {title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-text-muted mt-1">
                          <span>{year || "—"}</span>
                          {rating !== "0.0" && (
                            <span className="text-amber-400 font-semibold">
                              ★ {rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={itemKey}
                    className="relative group block text-left select-none"
                  >
                    <Link
                      href={`/watch/${itemType}/${item.id}`}
                      className="block no-underline"
                    >
                      <div className="streaming-card bg-surface rounded-lg overflow-hidden border border-border flex flex-col h-full">
                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-hover">
                          {poster ? (
                            <img
                              src={poster}
                              alt={title}
                              loading="lazy"
                              className="card-poster-img w-full h-full object-cover block"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-surface">
                              <span className="font-display text-xl text-text-muted mb-1">
                                NO POSTER
                              </span>
                              <span className="text-xs text-text-muted line-clamp-2">
                                {title}
                              </span>
                            </div>
                          )}

                          {rating !== "0.0" && (
                            <div className="absolute top-2.5 left-2.5 card-badge-pill">
                              <Star
                                size={11}
                                className="fill-amber-400 text-amber-400"
                              />
                              <span>{rating}</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                            <div className="w-11 h-11 rounded-full bg-primary text-black flex items-center justify-center">
                              <Play
                                size={20}
                                fill="currentColor"
                                className="ml-0.5"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-3 flex flex-col flex-1 justify-between gap-1.5 bg-surface">
                          <h3 className="text-sm font-bold text-text-main line-clamp-1 group-hover:text-primary transition-colors">
                            {title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-text-sub">
                            <span className="text-text-muted font-medium">
                              {year || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <button
                      type="button"
                      title="Remove from Watch Later"
                      aria-label={`Remove ${title} from Watch Later`}
                      onClick={(e) => handleQuickDelete(e, item)}
                      className="absolute top-2 right-2 z-20 h-7 w-7 rounded-full bg-black/75 backdrop-blur-sm border border-white/20 text-text-sub hover:text-red-400 hover:border-red-400/50 hover:bg-black/90 flex items-center justify-center transition-colors cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {isSelectMode && selectedKeys.size > 0 && (
          <div className="sm:hidden fixed bottom-4 inset-x-4 z-40 p-3 bg-surface/95 backdrop-blur-xl border border-border rounded-xl flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-text-main">
              {selectedKeys.size} item{selectedKeys.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedKeys(new Set())}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-text-sub bg-white/[0.08]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
