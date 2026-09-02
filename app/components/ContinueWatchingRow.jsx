'use client';

import { useState, useEffect, useRef } from 'react';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export function ContinueWatchingRow() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -480 : 480;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('watch-progress-')) {
        const id = key.replace('watch-progress-', '');
        try {
          const progress = JSON.parse(localStorage.getItem(key));
          if (progress) {
            items.push({ id, ...progress });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (items.length === 0) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    Promise.all(
      items.map(async (item) => {
        try {
          const res = await fetch(`/api/tv-details?id=${item.id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return {
            ...item,
            title: data.name || data.title,
            poster_path: data.poster_path,
          };
        } catch {
          return null;
        }
      })
    )
      .then((results) => {
        setHistoryItems(results.filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || historyItems.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-10">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <History size={18} className="text-amber-400" />
          <h2 className="font-display text-xl sm:text-2xl text-[#f3ede2] tracking-wider uppercase">
            Continue Watching
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-7 h-7 rounded bg-[#141a14] border border-white/[0.08] text-[#9e988f] hover:text-white hover:border-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-7 h-7 rounded bg-[#141a14] border border-white/[0.08] text-[#9e988f] hover:text-white hover:border-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="horizontal-catalog-row"
      >
        {historyItems.map((item) => (
          <MovieCard
            key={item.id}
            item={item}
            type="tv"
            accentColor="#f59e0b"
            fixedWidth={true}
          />
        ))}
      </div>
    </section>
  );
}