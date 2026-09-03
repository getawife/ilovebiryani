import { notFound } from "next/navigation";
import Header from "../../../components/header";
import Footer from "../../../components/Footer";
import WatchPageClient from "./WatchPageClient";
import { Star } from "lucide-react";

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
  const cast = data.credits?.cast?.slice(0, 12) || [];
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
    <div className="isolate flex min-h-screen flex-col bg-bg text-text-main">
      <Header />

      {backdropUrl && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[-2] h-[70vh] overflow-hidden">
          <img
            src={backdropUrl}
            alt=""
            className="h-full w-full object-cover object-[center_20%] brightness-[0.25] saturate-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/50 to-bg to-[96%]" />
        </div>
      )}

      {posterUrl && (
        <div
          className="pointer-events-none fixed inset-0 z-[-1] bg-[length:100%_auto] bg-[center_-10%] opacity-15 blur-[140px] saturate-[1.8]"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 pt-6 sm:pt-14 pb-20 flex-1">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mb-6">
          <div className="w-[200px] sm:w-[240px] md:w-[280px] shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface border border-border">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
                  No Image
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full min-w-0">
            {logoUrl ? (
              <div className="relative h-[80px] sm:h-[110px] max-w-[85%] mb-5">
                <img
                  src={logoUrl}
                  alt={title}
                  className="h-full object-contain object-left-bottom"
                />
              </div>
            ) : (
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-text-main leading-[1.0] mb-4">
                {title}
              </h1>
            )}

            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              {rating !== "0.0" && (
                <div className="card-badge-pill">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="text-amber-400 font-bold">{rating}</span>
                </div>
              )}
              {year && (
                <span className="bg-white/[0.08] border border-border text-text-sub px-3 py-1 rounded-full text-xs font-semibold">
                  {year}
                </span>
              )}
              {runtime && (
                <span className="bg-white/[0.08] border border-border text-text-sub px-3 py-1 rounded-full text-xs font-semibold">
                  {runtime}
                </span>
              )}
              {seasons && (
                <span className="bg-white/[0.08] border border-border text-text-sub px-3 py-1 rounded-full text-xs font-semibold">
                  {seasons} Season{seasons !== 1 ? "s" : ""}
                </span>
              )}
              {episodes && (
                <span className="bg-white/[0.08] border border-border text-text-sub px-3 py-1 rounded-full text-xs font-semibold">
                  {episodes} Episodes
                </span>
              )}
              {genres.map((g) => (
                <span
                  key={g.id}
                  className="bg-primary-dim border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-bold"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-sm sm:text-base leading-[1.7] text-text-sub max-w-[800px] mb-8 line-clamp-3">
              {overview}
            </p>

            <WatchPageClient
              type={type}
              id={id}
              validSeasons={validSeasons}
              isReleased={isReleased}
              overview={overview}
              cast={cast}
              backdrops={backdrops}
              recommendations={recommendations}
              itemData={{
                id,
                type,
                title,
                poster_path: data.poster_path,
                backdrop_path: data.backdrop_path,
                vote_average: data.vote_average,
                release_date: data.release_date,
                first_air_date: data.first_air_date,
                overview,
              }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
