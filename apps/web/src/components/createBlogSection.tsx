import { Field, useForm } from "@tanstack/react-form";
import Button from "./button";
import api from "@/lib/axios";
import axios from "axios";
import { useState } from "react";

const CreateBlogSection = () => {
  const [preview, setPreview] = useState<string | null>(null);
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

      try {
        await api.post("/blog", formdata, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        form.reset();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data.error || "Blog not create");
        } else {
          alert("Blog not created");
        }
      }
    },
  });
  return (
    <div>
      <h1 className="text-lg font-medium m-4">Create Blog</h1>
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
                  className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-neutral-400 transition "
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
                  className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-neutral-400 transition h-44 resize-none"
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
                  <div className="border border-dashed border-neutral-400 dark:border-neutral-700 rounded-lg p-4 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
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
        <Button type="submit" size="lg" children="Post" />
      </form>
    </div>
  );
};

export default CreateBlogSection;
