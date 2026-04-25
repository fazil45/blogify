"use client"
import { Blog } from "@/types/blog";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

export default function BlogCard({ blog }: { blog: Blog }) {

  const [expanded, setExpanded] = useState(false)

  const initials =
    `${blog.creator?.firstname[0]}${blog.creator?.lastname?.[0] ?? ""}`.toUpperCase();
  const creatorName =
    `${blog.creator?.firstname} ${blog.creator?.lastname ?? ""}`.trim();
  const date = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      {blog.image ? (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div></div>
      )}

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="text-[15px] font-medium leading-snug line-clamp-2">
          {blog.title}
        </h3>
        <p onClick={() =>setExpanded(!expanded)} className={`text-sm text-zinc-500 min-h-fit dark:text-zinc-400 ${expanded ? "" :"line-clamp-3"} leading-relaxed`}>
          {blog.content}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[10px] font-medium text-blue-700 dark:text-blue-300">
              {initials}
            </div>
            <span className="text-xs text-zinc-400">
              {creatorName} · {date}
            </span>
          </div>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              blog.posted
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {blog.posted ? "Published" : "Draft"}
          </span>
        </div>
      </div>
    </div>
  );
}