'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export function ContentRow({ title, color, items, type }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -520 : 520;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-10 sm:mt-14 group/row relative">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-2xl sm:text-3xl text-[#f3ede2] tracking-wider uppercase">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <button
              onClick={() => scroll('left')}
              aria-label={`Scroll ${title} left`}
              className="control-target-arrow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label={`Scroll ${title} right`}
              className="control-target-arrow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="horizontal-catalog-row"
      >
        {items.map((item) => (
          <MovieCard
            key={item.id}
            item={item}
            type={type}
            fixedWidth={true}
          />
        ))}
      </div>
    </section>
  );
}