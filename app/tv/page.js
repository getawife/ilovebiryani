import Header from '../components/header';
import Footer from '../components/Footer';
import { Tv } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { fetchTMDB } from '../../lib/tmdb';
import Image from 'next/image';

export const metadata = {
title: 'Series',
description: 'Stream popular TV shows and series on ILOVEBIRYANI.',
};

export default async function TVPage() {
let popularShows = [];

try {
const popularData = await fetchTMDB(
'tv/popular?language=en-US&page=1'
);
popularShows = popularData.results || [];
} catch (error) {
console.error('Failed to fetch TV series:', error);
}

return ( <div className="relative min-h-screen bg-[#070907] text-[#f3ede2] flex flex-col overflow-hidden"> <div className="fixed inset-0 z-0 pointer-events-none"> <Image
       src="/biryani.jpg"
       alt="Biryani bg"
       fill
       priority
       sizes="100vw"
       className="object-cover opacity-30"
     />


    <div className="absolute inset-0 bg-[#070907]/40 background-blur-[2px]" />

    <div className="absolute inset-0 bg-gradient-to-t from-[#070907] via-[#070907]/20 to-[#070907]/80" />
  </div>

  <div className="relative z-10 flex min-h-screen flex-col">
    <Header />

    <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
      <div className="mb-6 sm:mb-8 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Tv size={22} className="text-[#F4B942]" />

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-wider text-[#f3ede2] uppercase">
            Series
          </h1>
        </div>

        <p className="text-xs text-[#9e988f]">
          Binge-worthy shows, seasonal dramas, and episodic favorites.
        </p>
      </div>

      <MovieGrid items={popularShows} type="tv" />
    </main>

    <Footer />
  </div>
</div>


);
}
