// src/app/components/Navbar.js
'use client';

import { useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="
        bg-[#1E1E1E]/90 backdrop-blur-sm text-white
        px-4 sm:px-8 py-3 sm:py-4
        flex flex-col sm:flex-row sm:justify-between sm:items-center
        shadow-md transition-all duration-300
        relative
      "
    >
      {/* ─── Logo + mobile controls ───────────────────────────────── */}
      <div className="flex justify-between items-center w-full sm:w-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/watchsy-logo.png"
            alt="Watchsy Logo"
            className="h-9 sm:h-10 w-auto transition-transform hover:scale-105"
          />
        </Link>

        {/* Mobile: Auth + hamburger */}
        <div className="flex items-center space-x-4 sm:hidden">
          <SignedOut>
            <Link
              href="/login"
              className="text-xs uppercase tracking-wide hover:text-gray-300"
            >
              Sign&nbsp;In
            </Link>
            <Link
              href="/signup"
              className="bg-red-500 text-white px-3 py-1 rounded text-xs uppercase tracking-wide hover:bg-red-600"
            >
              Sign&nbsp;Up
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* Hamburger */}
          <button
            className="focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ─── Nav links ───────────────────────────────────────────── */}
      <div
        className={`
          flex flex-col sm:flex-row sm:items-center
          space-y-4 sm:space-y-0 sm:space-x-6
          mt-4 sm:mt-0 mr-30
          ${menuOpen ? 'block' : 'hidden sm:flex'}
        `}
      >
        {[
          { href: '/', label: 'Home' },
          { href: '/explore', label: 'Movies & Shows' },
          { href: '/support', label: 'Support' },
        ].map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="
              relative text-sm uppercase tracking-wide
              after:absolute after:left-0 after:-bottom-0.5 after:h-px
              after:w-0 after:bg-red-500 after:transition-all after:duration-300
              hover:after:w-full hover:text-red-400
            "
          >
            {label}
          </Link>
        ))}
      </div>

      {/* ─── Desktop auth buttons ────────────────────────────────── */}
      <div className="hidden sm:flex items-center space-x-4">
        <SignedOut>
          <Link
            href="/login"
            className="text-sm uppercase tracking-wide hover:text-gray-300"
          >
            Sign&nbsp;In
          </Link>
          <Link
            href="/signup"
            className="bg-red-500 text-white px-4 py-2 rounded text-sm uppercase tracking-wide hover:bg-red-600"
          >
            Sign&nbsp;Up
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
