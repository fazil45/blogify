import { Field, useForm } from "@tanstack/react-form";
import Button from "./button";
import api from "@/lib/axios";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const CreateBlogSection = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false)

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      imageUrl: null as File | null,
    },
    onSubmit: async ({ value }) => {
      const formdata = new FormData();
      formdata.append("title", value.title);
      formdata.append("content", value.content);
      console.log(value.content);
      console.log(value.imageUrl);

      if (value.imageUrl) {
        formdata.append("imageUrl", value.imageUrl);
      }
      setPosting(true)
      try {
        await api.post("/blog", formdata, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        form.reset();
        toast.success("Blog created successfully")
        setPosting(false)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error || "Blog not create");
        } else {
          toast.error("Blog not created");
        }
      }
    },
  });
  
  return (
    <div>
      <h1 className=" text-xl lg:text-lg xl:text-lg font-medium m-4">Create Blog</h1>
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          children={(field) => {
            return (
              <div>
                <label htmlFor="text">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full lg:p-3 xl:p-3 sm:p-1 md:p-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-neutral-400 transition "
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-red-500 text-sm">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            );
          }}
        />
        <form.Field
          name="content"
          children={(field) => {
            return (
              <div className="w-full">
                <label htmlFor="text">Content</label>
                <textarea
                  placeholder="Content"
                  className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-neutral-400 transition lg:h-44 xl:h-44 sm:h-22 md:34 resize-none"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-red-500 text-sm">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            );
          }}
        />
        <form.Field
          name="imageUrl"
          children={(field) => {
            return (
              <div className="w-full">
                <label className="cursor-pointer block">
                  Upload Cover Image
                  <div className="border border-dashed border-neutral-400 dark:border-neutral-700 rounded-lg lg:p-4 xl:p-4
                  p-2 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {"Upload cover image"}
                    </span>
                    <span className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded-md">
                      Browse
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-neutral-400 transition "
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      field.handleChange(file);
                      setPreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </label>
                {field.state.meta.errors?.[0] && (
                  <p className="text-red-500 text-sm">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            );
          }}
        />
        <Button type="submit" size="lg" children={posting ? "Posting..." : "Post"} />
      </form>
    </div>
  );
};

export default CreateBlogSection;
