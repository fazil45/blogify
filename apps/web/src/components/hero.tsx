import { ArrowRight, BookOpen, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-(--bg-light) dark:bg-(--bg-dark) to pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-(--bg-light) dark:bg-(--bg-dark) rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-(--bg-light) dark:bg-(--bg-dark) rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-(--bg-light) dark:bg-(--bg-dark) rounded-full opacity-20 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-black text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              Thousands of stories published daily
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold text-(--text-light) dark:text-(--text-dark) leading-tight tracking-tight mb-6">
              Where Ideas
              <span className="block text-gray-500">Come Alive</span>
            </h1>

            <p className="text-lg text-(--text-light) dark:text-(--text-dark) leading-relaxed mb-10 max-w-lg">
              Blogify is a modern blogging platform for thinkers, writers, and
              storytellers. Share your voice, discover inspiring content, and
              connect with a global community.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 bg-neutral-800 text-white font-semibold px-6 py-3 rounded-lg hover:bg-neutral-900 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Start Writing
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#blogs"
                className="inline-flex items-center gap-2 text-black font-semibold px-6 py-3 rounded-lg border border-gray-200 hover:border-neutral-800 hover:text-neutral-900 transition-all bg-white hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                Explore Blogs
              </a>
            </div>

            <div className="mt-12 flex items-center gap-8 pt-8 border-t border-gray-100">
              <div>
                <p className="text-2xl font-bold text-(--text-light) dark:text-(--text-dark)">
                  12K+
                </p>
                <p className="text-sm text-gray-500">Writers</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-(--text-light) dark:text-(--text-dark)">
                  50K+
                </p>
                <p className="text-sm text-gray-500">Articles</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-(--text-light) dark:text-(--text-dark)">
                  2M+
                </p>
                <p className="text-sm text-gray-500">Readers</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="size-100 rounded-md bg-neutral-100 z-20 relative overflow-hidden translate-x-6 p-0.5">
              <div className="w-full h-full relative z-20 bg-white rounded-[3px] flex items-center justify-center">
                <img
                  src="https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Writer at desk"
                  className="relative rounded-md shadow-2xl object-cover w-full h-full"
                />
              </div>
              <div className="absolute h-full w-full inset-0 bg-[conic-gradient(at_center,transparent,var(--text-light)_20%,transparent_30%)] animate-spin scale-[1.2] transition-colors ease-in-out duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
