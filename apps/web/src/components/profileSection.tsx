"use client";

import { useAuthStore } from "@/store/authStore";
import { has2DTranslate, motion } from "motion/react";
import { useEffect, useState } from "react";
import BlogCard from "./blogCard";
import { Blog } from "@/types/blog";
import api from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfileSection() {
  const route = useRouter()
  const { user } = useAuthStore();
  const [blogCount, setBlogCount] = useState(0);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const logout = async () => {
    try {
      const response = await api.post("/auth/signout");
      route.push("/")
    } catch (error) {}
  };

  const fetchBlog = async () => {
    try {
      const response = await api.get("/blogs");
      setBlogs(response.data.blogs);
      console.log(response.data.blogs);
      setBlogCount(response.data.blogs.length);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.error || "Something went wrong");
      } else {
        alert("Something went wrong");
      }
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="col-span-3 bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-y-auto flex flex-col"
    >
      <h2 className="text-lg font-semibold mb-5 tracking-tight">Profile</h2>

      {/* 👤 Empty user */}
      {!user ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center text-neutral-500">
          <p className="text-sm">No user data found</p>
        </div>
      ) : (
        <>
          {/* Avatar + Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center text-sm font-semibold">
              {user.firstname?.[0]}
              {user.lastname?.[0]}
            </div>

            <div>
              <p className="font-semibold leading-tight">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-sm text-neutral-500">@{user.username}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-2 mt-5">
            <button className="flex-1 cursor-pointer border border-neutral-300 dark:border-neutral-700 py-2 rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              Edit Profile
            </button>

            <button
              onClick={logout}
              className="flex-1 bg-black cursor-pointer text-white py-2 rounded-lg text-sm hover:bg-neutral-800 transition"
            >
              Logout
            </button>
          </div>

          {/* Blog section */}
          <div className="mt-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Your Blogs</h3>
              <span className="text-xs text-neutral-500">{blogCount}</span>
            </div>

            {/* Empty blogs */}
            {blogCount === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-neutral-500 mt-6">
                <p className="text-sm">No blogs yet</p>
                <p className="text-xs mt-1">Start writing your first blog ✍️</p>
              </div>
            ) : (
              <div className="space-y-3 mt-3 overflow-y-auto">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id + blog.creatorId} blog={blog} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
