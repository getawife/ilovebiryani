import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-white/5 py-10 px-4 text-center bg-gradient-to-b from-transparent to-bg/90 relative z-20">
            <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-2">
                <Link href="/" className="inline-flex items-baseline gap-[0.1rem] no-underline mb-1">
                    <span className="font-sans text-2xl text-primary tracking-[0.08em] font-bold">ILOVE</span>
                    <span className="font-sans text-2xl text-cream tracking-[0.08em] font-normal">BIRYANI</span>
                </Link>
                <p className="text-[0.7rem] text-text-muted transition-colors duration-200 hover:text-text-sub mt-1 tracking-wide">
                    Data provided by{' '}
                    <a
                        href="https://www.themoviedb.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary no-underline hover:underline"
                    >
                        TMDB
                    </a>
                    .<span className="inline-block mx-2 opacity-30">·</span>
                    All content is provided by third parties.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
