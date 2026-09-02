'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from './components/header';
import Footer from './components/Footer';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#070907] text-[#f3ede2] flex flex-col overflow-hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image 
          src="/biryani.jpg" 
          alt="Biryani background"
          fill 
          className="object-cover opacity-20" 
          priority
        />
        <div className="absolute inset-0 bg-[#070907]/60 backdrop-blur-[4px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070907] via-[#070907]/40 to-[#070907]/90" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Header />

        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-[560px] w-full flex flex-col items-center bg-[#0e120e]/90 backdrop-blur-xl border border-white/[0.16] p-8 sm:p-12 rounded-2xl shadow-2xl">
            <h1 className="font-display text-6xl sm:text-8xl font-bold tracking-wider text-[#F4B942] mb-2 uppercase drop-shadow-lg">
              404
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-[#f3ede2] mb-3">
              Page Not Found
            </p>

            <p className="text-sm sm:text-base text-[#E0E0E0] mb-8 leading-relaxed max-w-[420px]">
              The film, episode, or page you were looking for could not be found or may have been moved.
            </p>

            <Link
              href="/"
              className="btn-cinema-primary"
            >
              <Home size={18} /> Return to Home
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
