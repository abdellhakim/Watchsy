// src/app/explore/api.js
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function fetchTMDB(endpoint) {
  const res = await fetch(`https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`);
  if (!res.ok) throw new Error('Failed to fetch from TMDB');
  return res.json();
}
