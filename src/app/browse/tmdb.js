const API = 'https://api.themoviedb.org/3';
const KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/* fetch genres once */
export async function getGenres() {
  const [movies, tv] = await Promise.all([
    fetch(`${API}/genre/movie/list?api_key=${KEY}&language=en-US`).then(r => r.json()),
    fetch(`${API}/genre/tv/list?api_key=${KEY}&language=en-US`).then(r => r.json()),
  ]);
  /* Merge movie & tv genre arrays, dedupe by id */
  const map = new Map();
  [...movies.genres, ...tv.genres].forEach(g => map.set(g.id, g));
  return [...map.values()];
}

/* discover (or search) */
export async function discover({ type, page, genreId, query }) {
  // if there's a search term, hit /search instead of /discover
  if (query) {
    return fetch(
      `${API}/search/${type}?api_key=${KEY}&language=en-US&page=${page}&query=${encodeURIComponent(
        query
      )}`
    ).then(r => r.json());
  }

  const url = new URL(`${API}/discover/${type}`);
  url.searchParams.set('api_key', KEY);
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('page', page);
  url.searchParams.set('sort_by', 'popularity.desc');
  url.searchParams.set('include_adult', 'false');
  if (genreId) url.searchParams.set('with_genres', genreId);
  return fetch(url).then(r => r.json());
}
