"use client"
import React, { useEffect, useState } from "react";
import BlogCard from "./blogCard";
import api from "@/lib/axios";
import { Blog } from "@/types/blog";
import axios from "axios";
import { toast } from "sonner";

const BlogsSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchBlog = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const { data } = await api.get("/allBlogs", {
        params: { limit: 10, cursor: nextCursor ?? undefined },
      });
      setBlogs((prev) => [...prev, ...data.blogs]);
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
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchBlog();
    });
    // if (loaderRef.current) observer.observe(loader.current)

    return () => observer.disconnect();
  }, [nextCursor, loading]);

  return (
    <div className="col-span-6 bg-white dark:bg-neutral-900 p-4 rounded-xl shadow overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Explore Blogs</h2>

      {/* Blog cards */}
      <div className="space-y-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogsSection;
