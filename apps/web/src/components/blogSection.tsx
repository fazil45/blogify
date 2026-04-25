"use client";
import React, { useEffect, useRef, useState } from "react";
import BlogCard from "./blogCard";
import api from "@/lib/axios";
import { Blog } from "@/types/blog";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const BlogsSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchBlog = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const { data } = await api.get("/allBlogs", {
        params: { limit: 10, cursor: nextCursor ?? undefined },
      });
      setBlogs((prev) => {
        const all = [...prev, ...data.blogs];

        const unique = Array.from(new Map(all.map((b) => [b.id, b])).values());

        return unique;
      });
      setNextCursor(data.nextCursor);
      setHasMore(data.nextCursor !== null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        toast.error("Something went wrong ");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchBlog();
        }
      },
      { threshold: 1 },
    );
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="col-span-6 bg-white dark:bg-neutral-900 p-4 rounded-xl shadow overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Explore Blogs</h2>

      {/* Blog cards */}
      <div className="space-y-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
      <div
        ref={loaderRef}
        className="flex items-center justify-center py-6 gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
        {!hasMore && <p className="text-xs text-zinc-400">No more posts</p>}
      </div>
    </div>
  );
};

export default BlogsSection;
