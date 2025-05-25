// /src/app/api_test/tmdb/favorites/check/route.js

import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import db from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get('mediaId');
    const auth = getAuth(req);
    const userId = auth?.userId;

    if (!userId || !mediaId) {
      return NextResponse.json({ success: false, message: 'Données manquantes' }, { status: 400 });
    }

    // Vérifier si le mediaId est dans Film ou Serie
    const [[film]] = await db.query('SELECT id_film FROM Film WHERE tmdb_id = ?', [mediaId]);
    const [[serie]] = await db.query('SELECT id_serie FROM Serie WHERE tmdb_id = ?', [mediaId]);

    let isFavorite = false;

    if (film) {
      const [rows] = await db.query(
        'SELECT 1 FROM Liste_Favoris WHERE id_utilisateur = ? AND id_film = ? LIMIT 1',
        [userId, film.id_film]
      );
      isFavorite = rows.length > 0;
    } else if (serie) {
      const [rows] = await db.query(
        'SELECT 1 FROM Liste_Favoris WHERE id_utilisateur = ? AND id_serie = ? LIMIT 1',
        [userId, serie.id_serie]
      );
      isFavorite = rows.length > 0;
    }

    return NextResponse.json({ isFavorite });

  } catch (err) {
    console.error('❌ Erreur API GET /favorites/check:', err);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
