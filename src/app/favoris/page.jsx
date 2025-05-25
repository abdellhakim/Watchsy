'use client';

import { useEffect, useState } from 'react';
import { UserButton, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch('/api_test/tmdb/favorites/towatch');
        const data = await res.json();
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          setFavorites([]);
          console.warn('Données favorites non valides:', data);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  useEffect(() => {
    async function fetchHistory() {
      if (activeTab === 'history') {
        try {
          const res = await fetch('/api_test/tmdb/favorites/history');
          const data = await res.json();
          if (Array.isArray(data)) {
            setHistory(data);
          } else {
            console.warn('Données d\'historique non valides:', data);
            setHistory([]);
          }
        } catch (err) {
          console.error('Erreur chargement historique:', err);
          setHistory([]);
        }
      }
    }
    fetchHistory();
  }, [activeTab]);

  const markAsWatched = async (mediaId, isTvShow = false) => {
    try {
      const res = await fetch('/api_test/tmdb/favorites/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, isTvShow }),
      });
      if (res.ok) {
        setFavorites(prev => prev.filter(item => item.id !== mediaId));
      }
    } catch (error) {
      console.error('Error moving to history:', error);
    }
  };

  const markEpisodeAsWatched = async (tvId, seasonNumber, episodeNumber) => {
    try {
      const res = await fetch('/api_test/tmdb/favorites/history');
      if (!res.ok) {
        console.error('Erreur HTTP:', res.status);
        setHistory([]);
        return;
      }
      const text = await res.text();
      if (!text) {
        console.warn('Réponse vide');
        setHistory([]);
        return;
      }
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        console.warn('Données d\'historique non valides:', data);
        setHistory([]);
      }
      if (res.ok) {
        const updatedRes = await fetch('/api_test/tmdb/favorites/towatch');
        const updatedData = await updatedRes.json();
        if (Array.isArray(updatedData)) {
          setFavorites(updatedData);
        }
      }
    } catch (error) {
      console.error('Error marking episode:', error);
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return (
    <>
      <SignedOut><RedirectToSignIn /></SignedOut>
      <SignedIn>
        <main className="bg-black text-white min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Your Library</h1>
            <div className="flex border-b border-gray-700 mb-8">
              <button onClick={() => setActiveTab('favorites')} className={`px-4 py-2 font-medium ${activeTab === 'favorites' ? 'text-white border-b-2 border-red-600' : 'text-gray-400'}`}>Favorites</button>
              <button onClick={() => setActiveTab('history')} className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'text-white border-b-2 border-red-600' : 'text-gray-400'}`}>History</button>
            </div>
            {activeTab === 'favorites' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.length === 0 ? (
                  <p className="text-gray-400">No favorites yet. Add some from the explore page!</p>
                ) : (
                  favorites.map(item => (
                    <MediaItem key={item.id} item={item} onMarkAsWatched={markAsWatched} onMarkEpisode={markEpisodeAsWatched} />
                  ))
                )}
              </div>
            )}
            {activeTab === 'history' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.length === 0 ? (
                  <p className="text-gray-400">No history yet.</p>
                ) : (
                  history.map((item, index) => (
                    <MediaItem key={`${item.id}-${index}`} item={item} onMarkAsWatched={markAsWatched} onMarkEpisode={markEpisodeAsWatched} />
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </SignedIn>
    </>
  );
}

function MediaItem({ item, onMarkAsWatched, onMarkEpisode }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const isTvShow = item.type === 'tv';
  const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/default-poster.jpg';
  const handleMediaClick = () => router.push(`/details/${isTvShow ? 'tv' : 'movie'}/${item.id}`);

  useEffect(() => {
    if (isTvShow && expanded) {
      async function fetchSeasons() {
        try {
          const res = await fetch(`/api/tv-seasons?tvId=${item.id}`);
          const data = await res.json();
          if (data.seasons) {
            setSeasons(data.seasons);
            setSelectedSeason(data.seasons[0]?.season_number || null);
          }
        } catch (error) {
          console.error('Error fetching seasons:', error);
        }
      }
      fetchSeasons();
    }
  }, [isTvShow, expanded, item.id]);

  useEffect(() => {
    if (isTvShow && expanded && selectedSeason !== null) {
      async function fetchEpisodes() {
        try {
          const res = await fetch(`/api/tv-episodes?tvId=${item.id}&season=${selectedSeason}`);
          const data = await res.json();
          if (data.episodes) {
            setEpisodes(data.episodes);
          }
        } catch (error) {
          console.error('Error fetching episodes:', error);
        }
      }
      fetchEpisodes();
    }
  }, [isTvShow, expanded, selectedSeason, item.id]);

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg border border-zinc-800">
      <div className="flex">
        <div className="w-1/3 relative cursor-pointer" onClick={handleMediaClick} role="button" tabIndex={0} aria-label={`View details for ${item.title || item.name}`} onKeyDown={(e) => e.key === 'Enter' && handleMediaClick()}>
          <Image src={posterUrl} alt={item.title || item.name} width={200} height={300} className="w-full h-full object-cover" />
        </div>
        <div className="w-2/3 p-4">
          <h3 className="text-xl font-bold mb-2 cursor-pointer hover:underline" onClick={handleMediaClick}>{item.title || item.name}</h3>
          <p className="text-sm text-gray-400 mb-2">{item.release_date || item.first_air_date} • {isTvShow ? 'TV Show' : 'Movie'}</p>
          <div className="flex items-center justify-between mt-4">
            <button onClick={() => setExpanded(!expanded)} className="text-sm text-blue-400 hover:underline">{expanded ? 'Hide details' : 'Show details'}</button>
            <button onClick={() => onMarkAsWatched(item.id, isTvShow)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm">
              <Check size={16} />
              <span>Mark as watched</span>
            </button>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="p-4 border-t border-zinc-800">
          <p className="text-gray-300 mb-4">{item.overview}</p>
          {isTvShow && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold">Seasons</h4>
                <select value={selectedSeason || ''} onChange={(e) => setSelectedSeason(Number(e.target.value))} className="bg-zinc-800 text-white rounded px-2 py-1 text-sm">
                  {seasons.map(season => (
                    <option key={season.season_number} value={season.season_number}>Season {season.season_number}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {episodes.map(episode => (
                  <div key={episode.episode_number} className="flex justify-between items-center bg-zinc-800 px-3 py-2 rounded">
                    <div>
                      <span className="text-sm font-medium">Ep {episode.episode_number}:</span>
                      <span className="ml-2 text-sm">{episode.name}</span>
                    </div>
                    <button onClick={() => onMarkEpisode(item.id, selectedSeason, episode.episode_number)} className="text-green-400 hover:text-green-500 text-sm">Mark as watched</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
