import Header from "../../"../components/header.jsx"";
import Footer from "../../../components/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070907] text-[#f3ede2] flex flex-col">
      <Header />

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 pt-6 sm:pt-14 pb-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          <div className="w-[180px] sm:w-[220px] md:w-[260px] shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] w-full rounded-md skeleton-shimmer" />
          </div>

          <div className="flex-1 w-full flex flex-col gap-4">
            <div className="skeleton-shimmer h-12 w-2/3 rounded-md" />
            <div className="flex gap-2">
              <div className="skeleton-shimmer h-6 w-14 rounded" />
              <div className="skeleton-shimmer h-6 w-14 rounded" />
              <div className="skeleton-shimmer h-6 w-20 rounded" />
            </div>
            <div className="skeleton-shimmer h-20 w-full max-w-[760px] rounded-md" />
            <div className="skeleton-shimmer h-11 w-40 rounded-md mt-2" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 pb-20">
        <div className="skeleton-shimmer h-6 w-36 rounded mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="skeleton-shimmer w-[100px] sm:w-[115px] h-32 rounded-md shrink-0"
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
