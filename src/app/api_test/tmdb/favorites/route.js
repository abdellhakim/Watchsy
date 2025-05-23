import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import db from '@/lib/db';

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { mediaId, type, title, description, releaseDate, genres } = await req.json();

    if (!userId || !mediaId || !type) {
      return NextResponse.json({ success: false, message: 'Missing data' }, { status: 400 });
    }

    console.log('📥 Données reçues:', { userId, mediaId });

    // 1. Vérifier ou insérer l'utilisateur
    const [userRows] = await db.query('SELECT id_utilisateur FROM Utilisateur WHERE id_utilisateur = ?', [userId]);
    if (userRows.length === 0) {
      await db.query('INSERT INTO Utilisateur (id_utilisateur) VALUES (?)', [userId]);
    }



    if (type === 'movie') {
      // 3A. Gérer les films
      const [filmRows] = await db.query('SELECT id_film FROM Film WHERE tmdb_id = ?', [mediaId]);
      let filmId;
      if (filmRows.length === 0) {
        const [result] = await db.query(
          'INSERT INTO Film (tmdb_id) VALUES (?)',
          [mediaId]
        );
        filmId = result.insertId;
      } else {
        filmId = filmRows[0].id_film;
      }

    

      // Ajouter aux favoris
      await db.query(
        'INSERT IGNORE INTO Liste_Favoris (id_utilisateur, id_film) VALUES (?, ?)',
        [userId, filmId]
      );

    } else if (type === 'tv') {
      // 3B. Gérer les séries
      const [serieRows] = await db.query('SELECT id_serie FROM Serie WHERE tmdb_id = ?', [mediaId]);
      let serieId;
      if (serieRows.length === 0) {
        const [result] = await db.query(
          'INSERT INTO Serie (tmdb_id) VALUES (?)',
          [mediaId]
        );
        serieId = result.insertId;
      } else {
        serieId = serieRows[0].id_serie;
      }


      // Ajouter aux favoris
      await db.query(
        'INSERT IGNORE INTO Liste_Favoris (id_utilisateur, id_serie) VALUES (?, ?)',
        [userId, serieId]
      );

    } else {
      return NextResponse.json({ success: false, message: 'Type invalide' }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('❌ Erreur insertion favoris:', err);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
