"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, Search, Film, Tv } from "lucide-react";
import Header from "./header";
import Footer from "./Footer";
import MovieCard from "./MovieCard";
import Image from "next/image";

function CustomSelect({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5 w-full">
      {" "}
      <label className="text-[11px] font-bold text-[#9e988f] uppercase tracking-wider">
        {label}{" "}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 bg-[#0e120e] border rounded-md text-xs font-semibold text-left flex items-center justify-between cursor-pointer transition-all ${
            isOpen
              ? "border-[#F4B942] text-white"
              : "border-white/[0.08] text-[#f3ede2] hover:border-white/20"
          }`}
        >
          <span className="truncate">{selectedOption.label}</span>

          <ChevronDown
            size={14}
            className={`text-[#9e988f] transition-transform duration-200 shrink-0 ml-2 ${
              isOpen ? "rotate-180 text-[#F4B942]" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-[#121812] border border-white/[0.1] rounded-md shadow-2xl z-50 max-h-[220px] overflow-y-auto p-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                  option.value === value
                    ? "bg-[#F4B942] text-black font-bold"
                    : "text-[#f3ede2] hover:bg-white/[0.06]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    type: "all",
    genre: "all",
    year: "all",
    country: "all",
    language: "all",
    rating: "all",
  });

  const filterOptions = {
    genres: [
      { value: "all", label: "All Genres" },
      { value: "adventure", label: "Adventure" },
      { value: "animation", label: "Animation" },
      { value: "crime", label: "Crime" },
      { value: "documentary", label: "Documentary" },
      { value: "drama", label: "Drama" },
      { value: "family", label: "Family" },
      { value: "fantasy", label: "Fantasy" },
      { value: "horror", label: "Horror" },
      { value: "history", label: "History" },
      { value: "music", label: "Music" },
      { value: "mystery", label: "Mystery" },
      { value: "romance", label: "Romance" },
      { value: "thriller", label: "Thriller" },
      { value: "tv_movie", label: "TV Movie" },
      { value: "war", label: "War" },
      { value: "western", label: "Western" },
    ],

    years: [
      { value: "all", label: "All Years" },
      { value: "2026", label: "2026" },
      { value: "2025", label: "2025" },
      { value: "2024", label: "2024" },
      { value: "2023", label: "2023" },
      { value: "2022", label: "2022" },
    ],

    countries: [
      { value: "all", label: "All Countries" },
      { value: "US", label: "United States" },
      { value: "PK", label: "Pakistan" },
      { value: "GB", label: "United Kingdom" },
      { value: "CA", label: "Canada" },
      { value: "JP", label: "Japan" },
      { value: "KR", label: "South Korea" },
      { value: "IN", label: "India" },
      { value: "CN", label: "China" },
      { value: "FR", label: "France" },
      { value: "DE", label: "Germany" },
    ],

    languages: [
      { value: "all", label: "All Languages" },
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
      { value: "hi", label: "Hindi" },
      { value: "ja", label: "Japanese" },
      { value: "ko", label: "Korean" },
      { value: "ur", label: "Urdu" },
      { value: "ar", label: "Arabic" },
      { value: "zh", label: "Chinese (Mandarin)" },
      { value: "pt", label: "Portuguese" },
      { value: "ru", label: "Russian" },
      { value: "de", label: "German" },
      { value: "it", label: "Italian" },
      { value: "tr", label: "Turkish" },
      { value: "id", label: "Indonesian" },
      { value: "vi", label: "Vietnamese" },
      { value: "th", label: "Thai" },
      { value: "bn", label: "Bengali" },
      { value: "pa", label: "Punjabi" },
      { value: "ta", label: "Tamil" },
      { value: "te", label: "Telugu" },
      { value: "ml", label: "Malayalam" },
      { value: "nl", label: "Dutch" },
      { value: "pl", label: "Polish" },
      { value: "fa", label: "Persian" },
      { value: "sv", label: "Swedish" },
    ],

    ratings: [
      { value: "all", label: "Any Rating" },
      { value: "7.5", label: "★ 7.5+" },
      { value: "6.0", label: "★ 6.0+" },
    ],
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!queryParam.trim()) {
      queueMicrotask(() => setItems([]));
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          q: queryParam,
          type: filters.type,
          genre: filters.genre,
          year: filters.year,
          country: filters.country,
          language: filters.language,
          rating: filters.rating,
        });

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();

        if (data && data.results) {
          setItems(data.results);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching filtered results:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300);

    return () => clearTimeout(timer);
  }, [queryParam, filters]);

  return (
    <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
      {" "}
      <aside className="w-full md:w-[240px] shrink-0 bg-[#0e120e]/90 backdrop-blur-xl border border-white/[0.08] rounded-lg p-4 flex flex-col gap-4 md:sticky md:top-20">
        {" "}
        <div className="flex items-center gap-2 text-[#F4B942] font-bold text-xs uppercase tracking-wider pb-2 border-b border-white/[0.08]">
          {" "}
          <SlidersHorizontal size={14} /> <span>Filters</span>{" "}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#9e988f] uppercase tracking-wider">
            Format
          </label>

          <div className="grid grid-cols-3 gap-1">
            {[
              { id: "all", label: "All" },
              { id: "movie", label: "Films", icon: Film },
              { id: "tv", label: "Series", icon: Tv },
            ].map((t) => {
              const isSelected = filters.type === t.id;
              const Icon = t.icon;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleFilterChange("type", t.id)}
                  className={`py-1.5 px-2 rounded text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-[#F4B942] text-black font-bold"
                      : "bg-white/[0.04] text-[#9e988f] hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {Icon && <Icon size={13} strokeWidth={2} />}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
        <CustomSelect
          label="Genre"
          value={filters.genre}
          options={filterOptions.genres}
          onChange={(val) => handleFilterChange("genre", val)}
        />
        <CustomSelect
          label="Year"
          value={filters.year}
          options={filterOptions.years}
          onChange={(val) => handleFilterChange("year", val)}
        />
        <CustomSelect
          label="Country"
          value={filters.country}
          options={filterOptions.countries}
          onChange={(val) => handleFilterChange("country", val)}
        />
        <CustomSelect
          label="Language"
          value={filters.language}
          options={filterOptions.languages}
          onChange={(val) => handleFilterChange("language", val)}
        />
        <CustomSelect
          label="Rating"
          value={filters.rating}
          options={filterOptions.ratings}
          onChange={(val) => handleFilterChange("rating", val)}
        />
      </aside>
      <main className="flex-1 w-full min-w-0">
        <div className="mb-6 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Search size={22} className="text-[#F4B942]" />

            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-wider text-[#f3ede2] uppercase">
              Results for:{" "}
              <span className="text-[#F4B942]">&quot;{queryParam}&quot;</span>
            </h1>
          </div>

          <p className="text-xs text-[#9e988f]">
            {loading
              ? "Searching catalog..."
              : `${items.length} titles matched`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={`sk-${i}`}
                className="skeleton-shimmer rounded-md aspect-[2/3] w-full"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#0e120e]/90 backdrop-blur-xl rounded-lg border border-white/[0.08]">
            <p className="text-sm text-[#9e988f]">
              {queryParam.trim()
                ? "No matching movies or shows found for this search criteria."
                : "Type a title in the search bar above to begin searching."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {items.map((item) => (
              <MovieCard
                key={item.id}
                item={item}
                type={
                  filters.type !== "all"
                    ? filters.type
                    : item.media_type || "movie"
                }
                fixedWidth={false}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="relative min-h-screen bg-[#070907] text-[#f3ede2] flex flex-col overflow-hidden">
      {" "}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {" "}
        <Image
          src="/biryani.jpg"
          alt="Biryani bg"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#070907]/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070907] via-[#070907]/20 to-[#070907]/80" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center p-20">
              <div className="skeleton-shimmer w-10 h-10 rounded-full" />
            </div>
          }
        >
          <SearchContent />
        </Suspense>

        <Footer />
      </div>
    </div>
  );
}
