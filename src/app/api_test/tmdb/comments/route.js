import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import db from '@/lib/db';

const mediaMapping = {
  movie: { table: 'Film', column: 'id_film', internalType: 'film' },
  tv: { table: 'Serie', column: 'id_serie', internalType: 'serie' },
};

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { mediaId, type, contenu } = await req.json();

    if (!userId || !mediaId || !type || !contenu) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    // ✅ Utiliser clerkClient.users.getUser correctement
    let fullName = 'Utilisateur';
    try {
      const user = await clerkClient.users.getUser(userId);
      fullName = user.fullName || user.firstName || 'Utilisateur';
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur Clerk:", err);
    }

    // Vérifier/insérer l'utilisateur
    const [userRows] = await db.query(
      'SELECT id_utilisateur FROM Utilisateur WHERE id_utilisateur = ?',
      [userId]
    );
    if (userRows.length === 0) {
      await db.query(
        'INSERT INTO Utilisateur (id_utilisateur, nom) VALUES (?, ?)',
        [userId, fullName]
      );
    }

    const mediaInfo = mediaMapping[type];
    if (!mediaInfo) {
      return NextResponse.json({ error: 'Type de média invalide' }, { status: 400 });
    }

    const { table, column } = mediaInfo;

    // Vérifier/insérer le média
    const [mediaRows] = await db.query(
      `SELECT ${column} FROM ${table} WHERE tmdb_id = ?`,
      [mediaId]
    );
    let internalId;
    if (mediaRows.length === 0) {
      const [insertResult] = await db.query(
        `INSERT INTO ${table} (tmdb_id) VALUES (?)`,
        [mediaId]
      );
      internalId = insertResult.insertId;
    } else {
      internalId = mediaRows[0][column];
    }

    // Insérer le commentaire
    const [result] = await db.query(
      `INSERT INTO Commentaire (id_utilisateur, ${column}, contenu) VALUES (?, ?, ?)`,
      [userId, internalId, contenu]
    );

    console.log('✅ Commentaire inséré avec ID :', result.insertId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur POST commentaire:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}



// GET: Récupérer les commentaires pour un film ou une série
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get('mediaId');
    const typeFront = searchParams.get('type');

    let internalType;
    if (typeFront === 'movie') internalType = 'film';
    else if (typeFront === 'tv') internalType = 'serie';
    else internalType = null;

    if (!mediaId || !internalType) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const mediaTable = internalType === 'film' ? 'Film' : 'Serie';
    const mediaColumn = internalType === 'film' ? 'id_film' : 'id_serie';

    const [mediaRows] = await db.query(
      `SELECT ${mediaColumn} FROM ${mediaTable} WHERE tmdb_id = ?`,
      [mediaId]
    );

    if (mediaRows.length === 0) {
      return NextResponse.json({ comments: [] });
    }

    const internalMediaId = mediaRows[0][mediaColumn];

    const [comments] = await db.query(
      `SELECT c.id_commentaire, c.id_utilisateur, c.contenu, c.date_commentaire
       FROM Commentaire c
       WHERE c.${mediaColumn} = ?
       ORDER BY c.date_commentaire DESC`,
      [internalMediaId]
    );

    // Pour chaque commentaire, récupérer le nom via Clerk
    const commentsWithNames = await Promise.all(
      comments.map(async (comment) => {
        try {
          const user = await clerkClient.users.getUser(comment.id_utilisateur);
          return {
            ...comment,
            userName: user.fullName || user.firstName || 'Utilisateur',
          };
        } catch {
          return {
            ...comment,
            userName: 'Utilisateur',
          };
        }
      })
    );

    return NextResponse.json({ comments: commentsWithNames });
  } catch (err) {
    console.error('❌ Erreur GET commentaires:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

