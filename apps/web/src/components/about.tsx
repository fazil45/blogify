import { CheckCircle, ArrowRight } from 'lucide-react';

const benefits = [
  'Free to sign up, no credit card required',
  'Publish unlimited articles',
  'Verified email & secure account management',
  'Upload and manage your own images',
  'Edit or delete posts anytime',
  'Connect with a global reading community',
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-(--bg-light) dark:bg-(--bg-dark)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute top-8 left-8 w-full h-full bg-sky-50 rounded-3xl" />
            <img
              src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Team collaborating"
              className="relative rounded-3xl shadow-xl object-cover w-full h-[420px]"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-(--text-light) dark:text-(--text-dark) uppercase tracking-widest mb-2">About Us</p>
            <h2 className="text-4xl font-bold text-(--text-light) dark:text-(--text-dark) tracking-tight mb-5 leading-tight">
              Built for Writers,<br />Loved by Readers
            </h2>
            <p className="text-(--text-light) dark:text-(--text-dark) leading-relaxed mb-8">
              Inkwell was created to give every voice a platform. Whether you're a seasoned journalist, a weekend hobbyist, or a curious thinker — our platform gives you the tools to share your story with the world. No complexity, just pure writing.
            </p>

            <ul className="space-y-3 mb-10">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm text-(--text-light) dark:text-(--text-dark)">
                  <CheckCircle className="w-4 h-4 text-(--text-light) dark:text-(--text-dark) shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-(--bg-light) dark:bg-(--bg-dark) text-(--text-light) dark:text-(--text-dark) font-semibold px-6 py-3 rounded-lg border border-neutral-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
            >
              Join Inkwell Today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
