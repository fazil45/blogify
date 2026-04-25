"use client";

import { useAuthStore } from "@/store/authStore";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import BlogCard from "./blogCard";
import { Blog } from "@/types/blog";
import api from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Edit2, Trash2 } from "lucide-react";
import { useUpdateCard } from "@/store/updateStore";
import { toast } from "sonner";

export default function ProfileSection() {
  const route = useRouter();
  const { user } = useAuthStore();
  const [blogCount, setBlogCount] = useState(0);
  const [logOut, setLogout] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const {setShowBlog} = useUpdateCard()

  const logout = async () => {
    try {
      setLogout(true)
      const response = await api.post("/auth/signout");
      setLogout(false)
      route.push("/");
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
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const response = await api.delete(`/blog/${id}`);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      toast.success("Blog deleted");
    } catch (error) {}
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

      {!user ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center text-neutral-500">
          <p className="text-sm">No user data found</p>
        </div>
      ) : (
        <>
          <div>
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
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  setShowBlog();
                  route.push(`/update/${user.id}`);
                }}
                className="flex-1 cursor-pointer border border-neutral-300 dark:border-neutral-700 py-2 rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                Change Password
              </button>

              <button
                onClick={logout}
                className="flex-1 bg-black cursor-pointer text-white py-2 rounded-lg text-sm hover:bg-neutral-800 transition"
              >
                {logOut ? "loggingOut.." :"Logout"}
              </button>
            </div>

            <div className="mt-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Your Blogs</h3>
                <span className="text-xs text-neutral-500">{blogCount}</span>
              </div>

              {blogCount === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center text-neutral-500 mt-6">
                  <p className="text-sm">No blogs yet</p>
                  <p className="text-xs mt-1">
                    Start writing your first blog...
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mt-3 overflow-y-auto">
                  {blogs.map((blog) => (
                    <div
                      className="flex flex-col gap-3 p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm"
                      key={`${blog.id}-${blog.creatorId}`}
                    >
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <button
                          onClick={() => route.push(`/update/${blog.id}`)}
                          className="p-1 cursor-pointer border rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition hover:text-green-700"
                        >
                          <Edit2 size={"16"} />
                        </button>
                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="p-1 cursor-pointer border rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition hover:text-red-800"
                        >
                          <Trash2 size={"16"} />
                        </button>
                      </div>

                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
