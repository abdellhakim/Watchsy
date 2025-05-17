'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from "../components/NavBar";

export default function MovieInfoPage() {
  const [activeTab, setActiveTab] = useState('apropos');

  return (
    <main className="bg-black text-white font-sans">
      {/* Banner */}
      <section className="relative h-[60vh] w-full border-b border-gray-700">
        <Image
          src="/Kantara.png"
          alt="Kantara Banner"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-5xl font-bold">Kantara</h1>
          <p className="mt-2 text-lg">A fiery tale of folklore and power.</p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-8 border-b border-gray-700 py-4 mt-4">
        <button
          onClick={() => setActiveTab('apropos')}
          className={`text-lg font-medium ${activeTab === 'apropos' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
        >
          A propos
        </button>
        <button
          onClick={() => setActiveTab('saison')}
          className={`text-lg font-medium ${activeTab === 'saison' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
        >
          Saison
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'apropos' && (
        <>
          {/* Où regarder */}
          <section className="px-8 py-6">
            <h2 className="text-2xl font-semibold">Où regarder</h2>
            <p className="text-gray-300 mt-2">Disponible sur Amazon Prime Video, Netflix...</p>
          </section>

          {/* Overview & Information */}
          <section className="flex flex-col lg:flex-row justify-around px-8 py-12 space-y-10 lg:space-y-0">
            {/* Description */}
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="text-gray-300">
                A fiery tale of folklore and power, Kantara explores the clash between tradition
                and modernity in a visually haunting manner.
              </p>
            </div>

            {/* Information */}
            <div className="lg:w-1/3 space-y-4">
              <h2 className="text-2xl font-semibold">Information</h2>
              <ul className="space-y-2 text-gray-300">
                <li><strong className="text-white">Genre:</strong> Action, Drama</li>
                <li><strong className="text-white">Duration:</strong> 2h 30m</li>
                <li><strong className="text-white">Rating:</strong> ★★★★★</li>
                <li><strong className="text-white">Release:</strong> 2022</li>
              </ul>
            </div>
          </section>

          {/* Commentaires */}
          <section className="px-8 py-10 border-t border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Commentaires</h2>

            {/* Formulaire */}
            <form className="space-y-4 mb-8">
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
              <textarea
                rows="4"
                placeholder="Votre commentaire"
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              ></textarea>
              <button
                type="submit"
                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
              >
                Envoyer
              </button>
            </form>

            {/* Liste de commentaires (statique) */}
            <div className="space-y-6">
              <div className="bg-gray-900 p-4 rounded shadow">
                <p className="text-sm text-gray-400">Alice</p>
                <p>Un chef-d'œuvre visuel et spirituel !</p>
              </div>
              <div className="bg-gray-900 p-4 rounded shadow">
                <p className="text-sm text-gray-400">Karim</p>
                <p>Une immersion dans la culture indienne rarement vue à l'écran.</p>
              </div>
            </div>
          </section>
        </>

      )}

      {activeTab === 'saison' && (
        <section className="text-center py-20 text-gray-400">
          <p>Pas de saisons disponibles pour le moment.</p>
        </section>
      )}
    </main>
  );
}