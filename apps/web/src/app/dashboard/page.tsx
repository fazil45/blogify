"use client";

import BlogsSection from "@/components/blogSection";
import CreateBlogSection from "@/components/createBlogSection";
import ProfileSection from "@/components/profileSection";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, PanelLeftIcon } from "lucide-react";

export default function Dashboard() {
  const route = useRouter();
  const { user, fetchUser, loading } = useAuthStore();
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user === null) {
      route.push("/signin");
    }
  }, [user, route]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mt-16 h-[calc(100vh-4rem)]">
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <button onClick={() => setOpenSidebar(true)}>
          <PanelLeftIcon />
        </button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {openSidebar && (
        <div className="fixed inset-0 z-50 flex">

          <div className="w-64 bg-white h-full p-4 overflow-y-auto z-50">
            <ProfileSection />
          </div>

          <div
            className="flex-1 bg-black/50"
            onClick={() => setOpenSidebar(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        <div className="lg:hidden flex flex-col gap-4">
          <CreateBlogSection />
          <BlogsSection />
        </div>

        <div className="hidden lg:col-span-3 lg:block">
          <ProfileSection />
        </div>

        <div className="hidden lg:col-span-6 lg:block">
          <BlogsSection />
        </div>

        <div className="hidden lg:col-span-3 lg:block">
          <CreateBlogSection />
        </div>
      </div>
    </div>
  );
}
