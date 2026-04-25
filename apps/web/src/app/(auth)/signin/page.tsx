"use client";
import Input from "@/components/input";
import { AuthLayout } from "../authLayout";
import Button from "@/components/button";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { LoginSchema, UserSchema } from "@repo/zodschema";
import axios from "axios";
import { Route } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

const Signin = () => {
  const route = useRouter();
  const [isSignin, setIsSignin] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: LoginSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.email === "") {
        return toast.error("Enter Email");
      }

      if (value.password === "") {
        return toast.error("Enter Password");
      }

      const email = value.email;
      const password = value.password;

      try {
        setIsSignin(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_HTTP_URL}/auth/signin`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          },
        );
        setIsSignin(false);
        toast.success("signed in succesfully");
        route.push("/dashboard");
      } catch (error) {
        setIsSignin(false);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error || "Something went wrong");
        } else {
          toast.error("Something went wrong");
        }
      }
    },
  });

  return (
    <AuthLayout>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="email"
          validators={{
            onBlur: LoginSchema.shape.email,
          }}
          children={(field) => {
            return (
              <div className="mt-8">
                <Input
                  htmlFor="text"
                  placeholder="Email"
                  type="email"
                  label="Email"
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
        <form.Field
          name="password"
          validators={{
            onBlur: LoginSchema.shape.password,
          }}
          children={(field) => {
            return (
              <div>
                <Input
                  htmlFor="password"
                  placeholder="Password"
                  type="password"
                  label="Password"
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
        <div className="flex flex-col gap-2 items-center justify-center m-6">

          <button onClick={() => route.push("/forgot-password")} type="button" className="bg-neutral-100 cursor-pointer rounded-md px-8 py-2 text-(--text-light) dark:text-(--text-dark)">
            Forgot password
          </button>

          <Button
            size="lg"
            children={isSignin ? "Signing.." : "Signin"}
            type="submit"
          />
        </div>
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            className="px-8 py-2 text-lg relative overflow-hidden rounded-md 
        flex items-center justify-center
        cursor-pointer
        transition-all duration-200 font-semibold
        bg-slate-400 text-(--text-light)  border-(--text-dark) dark:bg-(--bg-light) dark:text-(--text-light) border-2 dark:border-(--text-light) hover:scale-105"
          >
            <Link href={"/signup"}>Create new account</Link>
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Signin;
