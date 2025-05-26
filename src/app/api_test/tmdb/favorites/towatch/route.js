import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import db from '@/lib/db';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; // ta clé API TMDB
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTmdbDetails(type, id) {
  // type: 'movie' ou 'tv'
  const url = `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur API TMDB');
  return res.json();
}

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Utilisateur non authentifié' }, { status: 401 });
    }

    // Récupérer les tmdb_id des films favoris
    const [films] = await db.query(
      `SELECT F.tmdb_id 
       FROM Liste_Favoris LF
       JOIN Film F ON LF.id_film = F.id_film
       WHERE LF.id_utilisateur = ?`,
      [userId]
    );

    // Récupérer les tmdb_id des séries favorites
    const [series] = await db.query(
      `SELECT S.tmdb_id 
       FROM Liste_Favoris LF
       JOIN Serie S ON LF.id_serie = S.id_serie
       WHERE LF.id_utilisateur = ?`,
      [userId]
    );

    // Pour chaque film, récupérer les détails via API TMDB
    const filmsDetails = await Promise.all(
      films.map(film => fetchTmdbDetails('movie', film.tmdb_id).then(data => ({ 
        id: data.id,
        title: data.title,
        release_date: data.release_date,
        overview: data.overview,
        poster_path: data.poster_path,
        type: 'movie'
      })))
    );

    // Pour chaque série, récupérer les détails via API TMDB
    const seriesDetails = await Promise.all(
      series.map(serie => fetchTmdbDetails('tv', serie.tmdb_id).then(data => ({
        id: data.id,
        name: data.name,
        first_air_date: data.first_air_date,
        overview: data.overview,
        poster_path: data.poster_path,
        type: 'tv'
      })))
    );

    const allFavorites = [...filmsDetails, ...seriesDetails];

    return NextResponse.json(allFavorites, { status: 200 });

  } catch (err) {
    console.error('❌ Erreur lors de la récupération des favoris :', err);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
