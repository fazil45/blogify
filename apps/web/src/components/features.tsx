import { PenLine, Image, Lock, Search, RefreshCw, Globe } from "lucide-react";

const features = [
  {
    icon: PenLine,
    title: "Rich Writing Experience",
    description:
      "Compose beautiful articles with a clean, distraction-free editor designed to let your ideas flow effortlessly.",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: Image,
    title: "Image Uploads",
    description:
      "Enhance your stories with stunning visuals. Upload images directly to your posts with a single click.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: Lock,
    title: "Secure Authentication",
    description:
      "Sign up, sign in, verify your email, and reset your password — all with enterprise-grade security.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Search,
    title: "Powerful Search",
    description:
      "Find any story in seconds. Our smart search helps readers discover content that matters to them.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: RefreshCw,
    title: "Full Blog Management",
    description:
      "Create, read, update, and delete your posts with a streamlined dashboard built for productivity.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Publish your work and instantly reach readers from around the world who are eager for fresh perspectives.",
    color: "bg-blue-50 text-blue-600",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-(--bg-light) dark:bg-(--bg-dark)"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-(--text-light) dark:text-(--text-dark) uppercase tracking-widest mb-2">
            Why Blogify
          </p>
          <h2 className="text-4xl font-bold text-(--text-light) dark:text-(--text-dark) tracking-tight">
            Everything You Need to Write
          </h2>
          <p className="text-(--text-light) dark:text-(--text-dark) mt-4 max-w-xl mx-auto">
            A complete platform built for modern writers — from your first draft
            to a global audience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className=" bg-(--bg-light) dark:bg-(--bg-dark) rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-(--text-light) dark:text-(--text-dark) mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-(--text-light) dark:text-(--text-dark) leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
