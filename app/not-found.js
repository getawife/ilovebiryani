'use client';

import Image from 'next/image';
import Header from './components/header';
import Footer from './components/Footer';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#070907] text-[#f3ede2] flex flex-col overflow-hidden">
      
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image 
          src="/biryani.jpg" 
          alt="Delicious Biryani background"
          fill 
          className="object-cover opacity-30" 
          priority
        />
        <div className="absolute inset-0 bg-[#070907]/40 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070907] via-transparent to-[#070907]/80" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Header />

        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-[480px] w-full flex flex-col items-center">
            
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-wider text-[#f3ede2] mb-2 uppercase">
              404
            </h1>

            <p className="text-sm font-semibold text-[#f3ede2] mb-2">
              Page Not Found
            </p>

            <p className="text-xs text-[#9e988f] mb-8 leading-relaxed">
              The film, episode, or page you were looking for could not be found or has moved.
            </p>

          </div>
        </main>

        <Footer />
      </div>

    </div>
  );
}
