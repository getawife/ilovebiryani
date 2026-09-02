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
      const scrollAmount = direction === 'left' ? -520 : 520;
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
    <section className="mt-8 sm:mt-12">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <History size={20} className="text-amber-400" />
          <h2 className="font-display text-2xl sm:text-3xl text-[#f3ede2] tracking-wider uppercase">
            Continue Watching
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll continue watching left"
            className="control-target-arrow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942]"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll continue watching right"
            className="control-target-arrow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942]"
          >
            <ChevronRight size={20} />
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