import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function EpisodeList({ tvId }) {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    async function fetchSeasons() {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}&language=en-US`);
      const data = await res.json();
      setSeasons(data.seasons || []);
    }
    fetchSeasons();
  }, [tvId]);

  useEffect(() => {
    if (selectedSeason !== null) {
      async function fetchEpisodes() {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${selectedSeason}?api_key=${apiKey}&language=en-US`);
        const data = await res.json();
        setEpisodes(data.episodes || []);
      }
      fetchEpisodes();
    }
  }, [selectedSeason]);

  return (
    <section className="px-8 py-12">
      <h2 className="text-2xl font-bold mb-4">Seasons</h2>
      <div className="flex flex-wrap gap-4">
        {seasons.map(season => (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season.season_number)}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {season.name}
          </button>
        ))}
      </div>

      {episodes.length > 0 && (
        <div className="mt-8 space-y-6">
          {episodes.map(ep => (
            <div key={ep.id} className="flex items-start gap-4 bg-gray-900 p-4 rounded">
              <Image
                src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                alt={ep.name}
                width={160}
                height={90}
                className="rounded"
              />
              <div>
                <h3 className="text-xl font-semibold">{ep.episode_number}. {ep.name}</h3>
                <p className="text-gray-400">{ep.overview}</p>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
