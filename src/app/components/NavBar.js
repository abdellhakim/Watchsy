"use client";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#1E1E1E] text-white p-6 sm:p-8 pr-10 flex flex-col sm:flex-row sm:justify-between sm:items-center relative">
      
      {/* Top Row: Logo + Hamburger + Auth */}
      <div className="flex justify-between items-center w-full sm:w-auto">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/watchsy-logo.png" 
              alt="Watchsy Logo"
              className="h-12 w-auto sm:h-14"
            />       
          </Link>
        </div>

        {/* Right side: Hamburger + Auth on mobile */}
        <div className="flex items-center space-x-4 sm:hidden">
          {/* Auth Buttons (mobile) */}
          <SignedOut>
            <Link
              href="/login"
              className="hover:text-gray-300 transition-colors text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
            >
              Sign Up
            </Link>
          </SignedOut>
          <SignedIn className= "w-7 h-7">
            <UserButton className="h-full"  afterSignOutUrl="/" />
          </SignedIn>

          {/* Hamburger button */}
          <button
            className="focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Nav Links */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0 ${
          menuOpen ? "block" : "hidden sm:flex"
        }`}
      >
        <Link href="/" className="hover:text-gray-300 transition-colors">
          Home
        </Link>
        <Link href="/movies" className="hover:text-gray-300 transition-colors">
          Movies & Shows
        </Link>
        <Link href="/support" className="hover:text-gray-300 transition-colors mr-4">
          Support
        </Link>
      </div>

      {/* Auth (desktop only) */}
      <div className="hidden sm:flex items-center space-x-4">
        <SignedOut>
          <Link
            href="/login"
            className="hover:text-gray-300 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Sign Up
          </Link>
        </SignedOut>
        <SignedIn>
        <UserButton 
            className="custom-avatar" // Add this custom class
            afterSignOutUrl="/" 
        />
        </SignedIn>
      </div>
    </nav>
  );
}
