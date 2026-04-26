"use client";
import { useState,  useEffect } from "react";
import {
  SquarePen as PenSquare,
  X,
  Menu,
  Loader2,
  User,
} from "lucide-react";

import ThemeToggle from "./themeToggle";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-300 dark:bg-(--bg-dark) shadow-md"
          : "bg-gray-300/90 dark:bg-(--bg-dark) backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:h-12 xl:h-16">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <PenSquare className="sm:w-5 sm:h-5  xl:w-7 xl:h-7 text-(--text-light) dark:text-(--text-dark)" />
            <span className="sm:text-lg xl:text-xl font-bold text-(--text-light) dark:text-(--text-dark) tracking-tight">
              Blogify
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            <a
              href="#"
              className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors"
            >
              Home
            </a>
            <a
              href="#blogs"
              className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors"
            >
              Blogs
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <ThemeToggle />
            </div>

            {loading ? (
              <div className="flex">
                <Loader2 className="animate-spin" />
              </div>
            ) : user ? (
              <div>
                {
                  <button>
                    <User />
                  </button>
                }
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <a
                  href="/signin"
                  className="text-sm font-medium text-neutral-600 bg-neutral-100 hover:text-neutral-800 dark:hover:text-neutral-400 px-4 py-1.5 rounded-md transition-colors shadow-sm"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="text-sm font-medium text-white bg-neutral-800 hover:text-neutral-300 dark:hover:text-neutral-400 px-4 py-1.5 rounded-md transition-colors shadow-sm"
                >
                  Get Started
                </a>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-md text-(--text-light) dark:text-(--text-dark) hover:bg-gray-100 transition-colors"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-3">
            <a
              href="#"
              className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 py-1"
            >
              Home
            </a>
            <a
              href="#blogs"
              className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 py-1"
            >
              Blogs
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 py-1"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-(--text-light) dark:text-(--text-dark) hover:text-neutral-800 dark:hover:text-neutral-400 py-1"
            >
              About
            </a>
            <hr className="border-gray-100" />
            <a
              href="/signin"
              className="text-sm font-medium text-white bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-400 px-4 py-2 rounded-md text-center transition-colors"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="text-sm font-medium text-white bg-neutral-800 hover:text-neutral-100 dark:hover:text-neutral-400 px-4 py-2 rounded-md text-center transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
