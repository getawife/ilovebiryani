const STORAGE_KEY = "cinemabiryani_bookmarks";
export const BOOKMARKS_EVENT = "cinemabiryani_bookmarks_updated";

export function getBookmarks() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function isBookmarked(id, type) {
  if (typeof window === "undefined" || !id) return false;
  const list = getBookmarks();
  const targetId = String(id);
  const targetType = type || "movie";
  return list.some(
    (item) =>
      String(item.id) === targetId &&
      (item.type || item.media_type || "movie") === targetType
  );
}

export function toggleBookmark(item) {
  if (typeof window === "undefined" || !item || !item.id) return false;
  const list = getBookmarks();
  const targetId = String(item.id);
  const targetType = item.type || item.media_type || "movie";
  const index = list.findIndex(
    (entry) =>
      String(entry.id) === targetId &&
      (entry.type || entry.media_type || "movie") === targetType
  );

  let updatedList;
  let added = false;

  if (index >= 0) {
    updatedList = list.filter((_, i) => i !== index);
    added = false;
  } else {
    const newEntry = {
      id: item.id,
      type: targetType,
      media_type: targetType,
      title: item.title || item.name || "Untitled",
      name: item.name || item.title || "Untitled",
      poster_path: item.poster_path || null,
      backdrop_path: item.backdrop_path || null,
      vote_average: item.vote_average || 0,
      release_date: item.release_date || item.first_air_date || "",
      first_air_date: item.first_air_date || item.release_date || "",
      overview: item.overview || "",
      savedAt: Date.now(),
    };
    updatedList = [newEntry, ...list];
    added = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (e) {}

  window.dispatchEvent(
    new CustomEvent(BOOKMARKS_EVENT, {
      detail: { list: updatedList, item, added },
    })
  );
  return added;
}

export function removeBookmark(id, type) {
  if (typeof window === "undefined" || !id) return;
  const list = getBookmarks();
  const targetId = String(id);
  const targetType = type || "movie";
  const updatedList = list.filter(
    (item) =>
      !(
        String(item.id) === targetId &&
        (item.type || item.media_type || "movie") === targetType
      )
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (e) {}

  window.dispatchEvent(
    new CustomEvent(BOOKMARKS_EVENT, { detail: { list: updatedList } })
  );
}

export function removeBookmarks(keys) {
  if (typeof window === "undefined" || !Array.isArray(keys)) return;
  const keySet = new Set(keys.map((k) => `${k.type || "movie"}_${k.id}`));
  const list = getBookmarks();
  const updatedList = list.filter(
    (item) =>
      !keySet.has(`${item.type || item.media_type || "movie"}_${item.id}`)
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (e) {}

  window.dispatchEvent(
    new CustomEvent(BOOKMARKS_EVENT, { detail: { list: updatedList } })
  );
}
