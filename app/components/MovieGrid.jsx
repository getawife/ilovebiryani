'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import MovieCard from './MovieCard';
import { RotateCcw } from 'lucide-react';

export default function MovieGrid({ items, type }) {
  const [displayedItems, setDisplayedItems] = useState(items || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState((items || []).length >= 20);
  const [error, setError] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || error) return;

    loadingRef.current = true;
    setLoading(true);
    setError(false);

    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/${type}?page=${nextPage}&language=en-US`);

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid response from server');
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      if (data.results && data.results.length > 0) {
        const existingIds = new Set(displayedItems.map((item) => item.id));
        const newItems = data.results.filter((item) => !existingIds.has(item.id));

        if (newItems.length > 0) {
          setDisplayedItems((prev) => [...prev, ...newItems]);
          setPage(nextPage);
          setHasMore(data.total_pages > nextPage);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more:', err);
      setError(true);
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [page, hasMore, error, type, displayedItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !error) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasMore, loading, error, loadMore]);

  if (!displayedItems || displayedItems.length === 0) {
    return (
      <div className="text-center py-16 text-[#5e5952]">
        <p className="text-sm">No titles found in this catalog.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
        {displayedItems.map((item) => (
          <MovieCard
            key={`${type}-${item.id}`}
            item={item}
            type={type}
            fixedWidth={false}
          />
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mt-4 w-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={`sk-${i}`}
              className="skeleton-shimmer rounded-md aspect-[2/3] w-full"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-[#9e988f]">
          <p className="text-xs">Failed to load more content.</p>
          <button
            onClick={() => {
              setError(false);
              setHasMore(true);
              loadMore();
            }}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-[#f3ede2] transition-colors cursor-pointer"
          >
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      )}

      <div ref={observerRef} className="h-4 mt-4" />

      {!hasMore && !error && displayedItems.length > 0 && (
        <p className="text-center text-xs text-[#5e5952] mt-8">
          You have reached the end of the list.
        </p>
      )}
    </section>
  );
}