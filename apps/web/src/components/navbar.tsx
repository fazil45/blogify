"use client"
import { useState, useRef, useEffect } from 'react';
import { Search, SquarePen as PenSquare, X, Menu } from 'lucide-react';
import ThemeToggle from './themeToggle';

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-300 dark:bg-(--bg-dark) shadow-md' : 'bg-gray-300/90 dark:bg-(--bg-dark) backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <PenSquare className="w-7 h-7 text-(--text-light) dark:text-(--text-dark)" />
            <span className="text-xl font-bold text-(--text-light) dark:text-(--text-dark) tracking-tight">Inkwell</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors">Home</a>
            <a href="#blogs" className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors">Blogs</a>
            <a href="#features" className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors">Features</a>
            <a href="#about" className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <div
                className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
                  searchOpen ? 'w-52 sm:w-64' : 'w-0'
                }`}
              >
                <div className="flex items-center w-full border border-gray-200 rounded-md bg-gray-50 px-3 py-1.5 gap-2">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search blogs..."
                    className="bg-transparent text-sm text-neutral-800 placeholder-gray-500 outline-none w-full"
                  />
                  <button className="shrink-0 bg-neutral-800 text-white rounded-md p-1 hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="ml-1 p-2 rounded-full text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 hover:bg-gray-100 transition-all"
                aria-label="Toggle search"
              >
                {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </div>
            <div className='flex items-center justify-center'>
              <ThemeToggle/>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <a
                href="/signin"
                className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 px-3 py-1.5 rounded-md transition-colors"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="text-sm font-medium text-white bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-400 px-4 py-1.5 rounded-md transition-colors shadow-sm"
              >
                Get Started
              </a>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md text-(--text-light) dark:text-(--text-dark) hover:bg-gray-100 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-3">
            <a href="#" className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 py-1">Home</a>
            <a href="#blogs" className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 py-1">Blogs</a>
            <a href="#features" className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 py-1">Features</a>
            <a href="#about" className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 py-1">About</a>
            <hr className="border-gray-100" />
            <a href="/signin" className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 py-1">Sign In</a>
            <a href="/signup" className="text-sm font-medium text-white bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-400 px-4 py-2 rounded-md text-center transition-colors">
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
