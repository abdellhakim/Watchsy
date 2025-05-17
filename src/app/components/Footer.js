export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-gray-300 py-8 px-4 sm:px-12 mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        
        {/* Left: Logo + © */}
        <div className="flex items-center space-x-3">
          <img src="/watchsy-logo.png" alt="Watchsy Logo" className="h-8 w-auto" />
          <span className="text-sm">&copy; {new Date().getFullYear()} Watchsy. All rights reserved.</span>
        </div>

        {/* Right: Nav Links */}
        <div className="flex space-x-6 text-sm uppercase tracking-wide">
          <a href="/" className="hover:text-red-500 transition-colors">Home</a>
          <a href="/explore" className="hover:text-red-500 transition-colors">Explore</a>
          <a href="/support" className="hover:text-red-500 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}
