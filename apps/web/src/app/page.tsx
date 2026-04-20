"use client";

import About from "@/components/about";
import FeaturedBlogs from "@/components/featuredblog";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturedBlogs/>
        <Features />
        <About />
      </main>
      <Footer />
    </div>
  );
}

