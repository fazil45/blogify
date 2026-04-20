"use client";
import BlogsSection from "@/components/blogSection";
import CreateBlogSection from "@/components/createBlogSection";
import ProfileSection from "@/components/profileSection";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const route = useRouter();
  const { user,fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser()
  },[])
  if (!user) {
    setTimeout(() => {
      route.push("/signin");
    }, 5000);
  }

  return (
    <div className="grid grid-cols-12 gap-4 mt-16 p-4 h-[calc(100vh-4rem)]">
      <ProfileSection />
      <BlogsSection />
      <div className="col-span-3">
        <CreateBlogSection />
      </div>
    </div>
  );
}
