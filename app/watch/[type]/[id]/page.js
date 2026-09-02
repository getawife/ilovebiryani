import { notFound } from "next/navigation";
import Header from "../../../components/header";
import Footer from "../../../components/Footer";
import MovieCard from "../../../components/MovieCard";
import WatchPageClient from "./WatchPageClient";
import { User, Star, Film } from "lucide-react";

async function getMediaDetails(id, type = "movie") {
  const res = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?language=en-US`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      },
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }) {
  const { type, id } = await params;
  const media = await getMediaDetails(id, type);

  if (!media) {
    return {
      title: "Not Found",
    };
  }
  const mediaTitle = media.title || media.name;

  return {
    title: `${mediaTitle}`,
    description: media.overview || `Watch ${mediaTitle} in HD on ILOVEBIRYANI.`,
  };
}

async function getMediaData(type, id) {
  const url = `https://api.themoviedb.org/3/${type}/${id}?append_to_response=credits,images,watch/providers,recommendations&language=en-US`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default async function WatchPage({ params }) {
  const { type, id } = await params;
  const data = await getMediaData(type, id);

  if (!data) {
    notFound();
  }

  const isReleased = ["Released", "Returning Series", "Ended"].includes(
    data.status,
  );
  const title = data.title || data.name;
  const overview = data.overview || "No synopsis available.";
  const rating = data.vote_average ? data.vote_average.toFixed(1) : "0.0";
  const year = (data.release_date || data.first_air_date || "").split("-")[0];
  const genres = data.genres || [];
  const cast = data.credits?.cast?.slice(0, 8) || [];
  const backdrops = data.images?.backdrops?.slice(0, 6) || [];
  const recommendations = data.recommendations?.results?.slice(0, 12) || [];
  const runtime = type === "movie" ? formatRuntime(data.runtime) : null;
  const seasons = type === "tv" ? data.number_of_seasons : null;
  const episodes = type === "tv" ? data.number_of_episodes : null;
  const validSeasons = (data.seasons || []).filter((s) => s.season_number > 0);

  const backdropUrl = data.backdrop_path
    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    : null;
  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : null;

  const logoAsset = data.images?.logos?.find(
    (logo) => logo.iso_639_1 === "en" || logo.iso_639_1 === null,
  );
  const logoUrl = logoAsset
    ? `https://image.tmdb.org/t/p/w500${logoAsset.file_path}`
    : null;

  return (
    <div className="isolate flex min-h-screen flex-col bg-[#070907] text-[#f3ede2]">
      <Header />

      {/* FIXED BACKDROP LAYER */}
      {backdropUrl && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[-2] h-[65vh] overflow-hidden">
          <img
            src={backdropUrl}
            alt=""
            className="h-full w-full object-cover object-[center_20%] brightness-[0.25] saturate-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070907]/40 to-[#070907] to-[95%]" />
        </div>
      )}

      {/* AMBIENT GLOW LAYER */}
      {posterUrl && (
        <div
          className="pointer-events-none fixed inset-0 z-[-1] bg-[length:100%_auto] bg-[center_-10%] opacity-12 blur-[140px] saturate-[1.8]"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 pt-6 sm:pt-14 pb-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          <div className="w-[180px] sm:w-[220px] md:w-[260px] shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] w-full rounded-md overflow-hidden bg-[#111611] border border-white/[0.1] shadow-2xl shadow-black/80">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#5e5952]">
                  No Image
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full min-w-0">
            {logoUrl ? (
              <div className="relative h-[65px] sm:h-[90px] max-w-[80%] mb-4">
                <img
                  src={logoUrl}
                  alt={title}
                  className="h-full object-contain object-left-bottom"
                />
              </div>
            ) : (
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f3ede2] leading-[1.0] mb-3">
                {title}
              </h1>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {rating !== "0.0" && (
                <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded text-xs font-bold">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{rating}</span>
                </div>
              )}
              {year && (
                <span className="bg-white/[0.06] border border-white/[0.08] text-[#9e988f] px-2 py-0.5 rounded text-xs font-medium">
                  {year}
                </span>
              )}
              {runtime && (
                <span className="bg-white/[0.06] border border-white/[0.08] text-[#9e988f] px-2 py-0.5 rounded text-xs font-medium">
                  {runtime}
                </span>
              )}
              {seasons && (
                <span className="bg-white/[0.06] border border-white/[0.08] text-[#9e988f] px-2 py-0.5 rounded text-xs font-medium">
                  {seasons} Season{seasons !== 1 ? "s" : ""}
                </span>
              )}
              {episodes && (
                <span className="bg-white/[0.06] border border-white/[0.08] text-[#9e988f] px-2 py-0.5 rounded text-xs font-medium">
                  {episodes} Episodes
                </span>
              )}
              {genres.map((g) => (
                <span
                  key={g.id}
                  className="bg-[#F4B942]/10 border border-[#F4B942]/20 text-[#F4B942] px-2 py-0.5 rounded text-xs font-medium"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-[#9e988f] max-w-[760px] mb-6">
              {overview}
            </p>

            <WatchPageClient
              type={type}
              id={id}
              validSeasons={validSeasons}
              isReleased={isReleased}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 pb-20 flex-1 relative z-10">
        {cast.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-[#F4B942]" />
              <h2 className="font-display text-xl sm:text-2xl tracking-wider uppercase text-[#f3ede2]">
                Cast & Characters
              </h2>
            </div>
            <div className="horizontal-catalog-row py-1">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="w-[100px] sm:w-[115px] shrink-0 text-center"
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-2 rounded-full overflow-hidden bg-[#141a14] border border-white/[0.08]">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#5e5952]">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#f3ede2] line-clamp-1">
                    {actor.name}
                  </p>
                  <p className="text-[11px] text-[#9e988f] line-clamp-1">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {backdrops.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Film size={16} className="text-[#F4B942]" />
              <h2 className="font-display text-xl sm:text-2xl tracking-wider uppercase text-[#f3ede2]">
                Gallery
              </h2>
            </div>
            <div className="horizontal-catalog-row py-1">
              {backdrops.map((img, i) => (
                <div
                  key={i}
                  className="aspect-video w-[220px] sm:w-[280px] shrink-0 rounded-md overflow-hidden bg-[#141a14] border border-white/[0.08]"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {recommendations.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Film size={16} className="text-[#F4B942]" />
              <h2 className="font-display text-xl sm:text-2xl tracking-wider uppercase text-[#f3ede2]">
                More Like This
              </h2>
            </div>
            <div className="horizontal-catalog-row py-1">
              {recommendations.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  type={type}
                  fixedWidth={true}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
