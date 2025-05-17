// /src/app/api/tmdb/route.js

export async function GET() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from TMDB' }), {
      status: 500,
    });
  }

  const data = await res.json();

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
