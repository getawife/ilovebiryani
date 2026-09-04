import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#070907] py-10 px-4">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <Link href="/" className="flex items-baseline tracking-wider">
            <span className="font-display text-xl text-[#F4B942] font-bold">
              ILOVE
            </span>
            <span className="font-display text-xl text-[#f3ede2] font-bold ml-1">
              BIRYANI
            </span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#9e988f]">
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9e988f] hover:text-[#F4B942] transition-colors"
          >
            All data from TMDB. <br /> Built by{" "}
            <span className="text-[#F4B942]">Getawife</span> with love.
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
