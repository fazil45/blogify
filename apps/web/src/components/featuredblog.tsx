import { Clock, ArrowRight, User } from 'lucide-react';

const blogs = [
  {
    id: 1,
    title: 'The Future of Artificial Intelligence in Creative Writing',
    excerpt: 'Explore how AI tools are transforming the way writers create, edit, and publish content in the modern digital age.',
    author: 'Sarah Mitchell',
    date: 'Apr 10, 2026',
    readTime: '6 min read',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryColor: 'bg-(--bg-light) dark:bg-(--bg-dark) text-(--text-light) dark:text-(--text-dark)',
  },
  {
    id: 2,
    title: 'Minimalism: Living More with Less in a Cluttered World',
    excerpt: 'Discover the profound benefits of simplifying your life and how embracing minimalism can lead to greater clarity and joy.',
    author: 'James Okafor',
    date: 'Apr 9, 2026',
    readTime: '4 min read',
    category: 'Lifestyle',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryColor: 'bg-(--bg-light) dark:bg-(--bg-dark) text-(--text-light) dark:text-(--text-dark)',
  },
  {
    id: 3,
    title: 'Building Resilience: Mental Health Strategies for 2026',
    excerpt: 'Practical, science-backed techniques to strengthen your mental well-being and navigate modern life with confidence.',
    author: 'Priya Sharma',
    date: 'Apr 8, 2026',
    readTime: '7 min read',
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryColor: 'bg-(--bg-light) dark:bg-(--bg-dark) text-(--text-light) dark:text-(--text-dark)',
  },
  {
    id: 4,
    title: 'Mastering the Art of Deep Work in a Distracted Era',
    excerpt: 'Learn how to carve out focused, high-value work sessions that produce exceptional results in your professional life.',
    author: 'Ethan Clarke',
    date: 'Apr 7, 2026',
    readTime: '5 min read',
    category: 'Productivity',
    image: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryColor: 'bg-(--bg-light) dark:bg-(--bg-dark) text-(--text-light) dark:text-(--text-dark)',
  },
  {
    id: 5,
    title: 'Sustainable Travel: Exploring the World Responsibly',
    excerpt: 'A guide to making conscious travel choices that protect our planet while still creating unforgettable experiences.',
    author: 'Lena Torres',
    date: 'Apr 6, 2026',
    readTime: '8 min read',
    category: 'Travel',
    image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryColor: 'bg-(--bg-light) dark:bg-(--bg-dark) text-(--text-light) dark:text-(--text-dark)',
  },
  {
    id: 6,
    title: 'The Science Behind Habit Formation and Breaking Bad Cycles',
    excerpt: 'Understanding the neurological basis of habits can help you build the routines you want and eliminate those you don\'t.',
    author: 'Dr. Noah Banks',
    date: 'Apr 5, 2026',
    readTime: '6 min read',
    category: 'Science',
    image: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryColor: 'bg-(--bg-light) dark:bg-(--bg-dark) text-(--text-light) dark:text-(--text-dark)',
  },
];

export default function FeaturedBlogs() {
  return (
    <section id="blogs" className="py-24 bg-(--bg-light) dark:bg-(--bg-dark)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-(--text-light) dark:text-(--text-dark) uppercase tracking-widest mb-2">Explore</p>
            <h2 className="text-4xl font-bold text-(--text-light) dark:text-(--text-dark) tracking-tight">Featured Stories</h2>
            <p className="text-(--text-light) dark:text-(--text-dark) mt-3 max-w-md">Hand-picked articles from our community of passionate writers.</p>
          </div>
          <a
            href="/blogs"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-(--text-light) dark:text-(--text-dark) hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors group"
          >
            View all blogs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group bg-(--bg-light) dark:bg-(--bg-dark) text-(--text-light) dark:text-(--text-dark) border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${blog.categoryColor}`}>
                  {blog.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-(--text-light) dark:text-(--text-dark) text-base leading-snug mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-(--text-light) dark:text-(--text-dark) leading-relaxed mb-4 line-clamp-2">{blog.excerpt}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-sky-100 rounded-full flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <span className="text-xs font-medium text-(--text-light) dark:text-(--text-dark)">{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-(--text-light) dark:text-(--text-dark)">
                    <Clock className="w-3 h-3" />
                    {blog.readTime}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <a
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
          >
            View all blogs <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
