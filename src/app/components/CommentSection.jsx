// components/CommentSection.jsx
'use client';

import { useState, useEffect } from 'react';

export default function CommentSection({ mediaId, type }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Charger les commentaires au montage
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api_test/tmdb/comments?mediaId=${mediaId}&type=${type}`);
        const data = await res.json();
        setComments(data.comments || []);
      } catch (err) {
        console.error('Erreur lors du chargement des commentaires:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [mediaId, type]);

  // Soumettre un nouveau commentaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api_test/tmdb/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, type, contenu: content }),
      });

      const result = await res.json();

      if (result.success) {
        setContent('');
        // Rafraîchir la liste des commentaires
        const updated = await fetch(`/api_test/tmdb/comments?mediaId=${mediaId}&type=${type}`);
        const data = await updated.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Erreur lors de l’envoi du commentaire:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-8 py-6 border-t border-gray-700">
      <h2 className="text-2xl font-semibold mb-4">Commentaires</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Votre commentaire..."
          rows="3"
          className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 disabled:bg-gray-400 transition"
        >
          {submitting ? 'Envoi...' : 'Envoyer'}
        </button>
      </form>

      {/* Liste des commentaires */}
      {loading ? (
        <p>Chargement des commentaires...</p>
      ) : comments.length === 0 ? (
        <p>Aucun commentaire pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded shadow">
              <p className="text-sm text-gray-300">{comment.userName}</p>
              <p className="mt-1">{comment.contenu}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(comment.date_commentaire).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}