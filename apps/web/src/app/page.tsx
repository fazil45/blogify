"use client";

import About from "@/components/about";
import FeaturedBlogs from "@/components/featuredblog";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function Home() {
  const { fetchUser } = useAuthStore();
  
    useEffect(() => {
      fetchUser()
    },[])
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

