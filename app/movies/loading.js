import Header from '"../components/header"';
import Footer from "../components/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070907] text-[#f3ede2] flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
        <div className="mb-6 sm:mb-8 border-b border-white/[0.08] pb-4 flex flex-col gap-2">
          <div className="skeleton-shimmer h-10 w-40 rounded" />
          <div className="skeleton-shimmer h-4 w-64 rounded" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer aspect-[2/3] w-full rounded-md"
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
