import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import db from '@/lib/db';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTmdbDetails(type, id) {
  const url = `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur API TMDB');
  return res.json();
}

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mediaId, isTvShow } = await req.json();

    // 1. Supprimer des favoris (pour que ce soit retiré des favoris)
    if (isTvShow) {
      await db.query(
        `DELETE FROM liste_favoris
         WHERE id_utilisateur = ?
         AND id_serie = (SELECT id_serie FROM Serie WHERE tmdb_id = ?)`,
        [userId, mediaId]
      );
    } else {
      await db.query(
        `DELETE FROM liste_favoris
         WHERE id_utilisateur = ?
         AND id_film = (SELECT id_film FROM Film WHERE tmdb_id = ?)`,
        [userId, mediaId]
      );
    }

    // 2. Supprimer l'entrée existante dans l'historique pour éviter doublons
    if (isTvShow) {
      await db.query(
        `INSERT INTO Historique (id_utilisateur, id_serie)
        VALUES (?, (SELECT id_serie FROM Serie WHERE tmdb_id = ?))`,
        [userId, mediaId]
      );
    } else {
      await db.query(
        `INSERT INTO Historique (id_utilisateur, id_film)
        VALUES (?, (SELECT id_film FROM Film WHERE tmdb_id = ?))`,
        [userId, mediaId]
      );
    }




    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Utilisateur non authentifié' }, { status: 401 });
    }

    // Récupérer les films dans l'historique
    const [films] = await db.query(
      `SELECT F.tmdb_id FROM Historique H JOIN Film F ON H.id_film = F.id_film WHERE H.id_utilisateur = ?`,
      [userId]
    );

    // Récupérer les séries dans l'historique
    const [series] = await db.query(
      `SELECT S.tmdb_id FROM Historique H JOIN Serie S ON H.id_serie = S.id_serie WHERE H.id_utilisateur = ?`,
      [userId]
    );

    // Récupérer les détails TMDB des films
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

    // Récupérer les détails TMDB des séries
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
