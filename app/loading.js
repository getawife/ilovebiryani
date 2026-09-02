import Header from "./components/header.jsx";
import Footer from "./components/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070907] text-[#f3ede2] flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-10 pb-20">
        <div className="w-full max-w-[680px] mb-14 flex flex-col gap-4">
          <div className="skeleton-shimmer h-12 sm:h-16 w-3/4 rounded-md" />
          <div className="skeleton-shimmer h-4 w-1/3 rounded" />
          <div className="skeleton-shimmer h-16 w-full rounded-md" />
          <div className="skeleton-shimmer h-10 w-36 rounded-md mt-2" />
        </div>

        {[1, 2, 3].map((row) => (
          <div key={row} className="mt-10">
            <div className="skeleton-shimmer h-7 w-48 rounded mb-4" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6, 7].map((card) => (
                <div
                  key={card}
                  className="skeleton-shimmer w-[150px] sm:w-[170px] aspect-[2/3] rounded-md shrink-0"
                />
              ))}
            </div>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}
