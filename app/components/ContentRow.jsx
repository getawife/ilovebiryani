'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Flame, Trophy, Popcorn, Sparkles,  Tv } from 'lucide-react';
import MovieCard from './MovieCard';


export function ContentRow({ title, color, items, type }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -480 : 480;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-10 sm:mt-12 group/row relative">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl sm:text-2xl text-[#f3ede2] tracking-wider uppercase">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">

          <div className="hidden sm:flex items-center gap-1 ml-2">
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