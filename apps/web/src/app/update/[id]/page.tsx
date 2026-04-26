"use client";

import Button from "@/components/button";
import CardModal from "@/components/cardModal";
import Input from "@/components/input";
import api from "@/lib/axios";
import { useUpdateCard } from "@/store/updateStore";
import { ChangePassword } from "@repo/zodschema";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Update = () => {
  const { showBlog } = useUpdateCard();
  const [preview, setPreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [reseting, setReseting] = useState(false);
  const params = useParams();

  const blogForm = useForm({
    defaultValues: {
      title: "",
      content: "",
      imageUrl: null as File | null,
    },
    onSubmit: async ({ value }) => {
      const formdata = new FormData();
      formdata.append("title", value.title);
      formdata.append("content", value.content);

      if (value.imageUrl) {
        formdata.append("imageUrl", value.imageUrl);
      }
      setUpdating(true);
      const id = params.id;
      try {
        await api.patch(`/blog/${id}`, formdata, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        blogForm.reset();
        toast.success("Blog updated")
        setUpdating(false);
      } catch (error) {
        setUpdating(false);

        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error || "Blog not updated");
        } else {
          toast.error("Blog not created");
        }
      }
    },
  });

  const resetPasswordForm = useForm({
    defaultValues: {
      oldPassword:"",
      newPassword:""
    },
    validators: {
      onChange: ChangePassword,
    },
    onSubmit: async ({ value }) => {

      if (value.newPassword === "") {
        return toast.error("Enter Password");
      }

      if (value.oldPassword === "") {
        return toast.error("Enter Password");
      }

      const newPassword = value.newPassword;
      const oldPassword = value.oldPassword
      try {
          setReseting(true)
          const response = await api.post(
            `${process.env.NEXT_PUBLIC_HTTP_URL}/auth/change-password`,
            {
              oldPassword,
              newPassword
            },
          );
          setReseting(false)
          toast.success("Password changed successfully")
      } catch (error) {
        setReseting(false)
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error || "Something went wrong ");
        } else {
          toast.error("Something went wrong ");
        }
      }
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-(--bg-light) dark:bg-(--bg-dark)">
      {showBlog ? (
        <CardModal>
          <h1 className="text-2xl">Update Blog</h1>
          <form
            className="w-full flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              blogForm.handleSubmit();
            }}
          >
            <blogForm.Field
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
            <blogForm.Field
              name="content"
              children={(field) => {
                return (
                  <div className="w-full">
                    <label htmlFor="text">Content</label>
                    <textarea
                      placeholder="Content"
                      className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-neutral-400 transition h-24 resize-none"
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
            <blogForm.Field
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
            <Button
              type="submit"
              size="lg"
              children={updating ? "Updating..." : "Update"}
            />
          </form>
        </CardModal>
      ) : (
        <CardModal>
          <div>Update User Profile</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              resetPasswordForm.handleSubmit();
            }}
          >

            <resetPasswordForm.Field
              name="oldPassword"
              children={(field) => {
                return (
                  <div>
                    <Input
                      htmlFor="password"
                      placeholder="Old Password"
                      type="password"
                      label="Enter Old Password"
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                    />
                    {field.state.meta.errors?.[0] && (
                      <p className="text-red-500 text-sm">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                  </div>
                  
                );
              }}
            />
            <resetPasswordForm.Field
              name="newPassword"
              children={(field) => {
                return (
                  <div>
                    <Input
                      htmlFor="password"
                      placeholder="New Password"
                      type="password"
                      label="Enter New Password"
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                    />
                    {field.state.meta.errors?.[0] && (
                      <p className="text-red-500 text-sm">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                  </div>
                  
                );
              }}
            />
            <div className="flex items-center justify-center mt-8">
              <Button size="lg" type="submit">
                {reseting ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </CardModal>
      )}
    </div>
  );
};

export default Update;
