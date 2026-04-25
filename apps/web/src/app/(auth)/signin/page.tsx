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
  const [isSignin, setIsSignin] = useState(false)
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
        setIsSignin(true)
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
        setIsSignin(false)
        toast.success("signed in succesfully");
        route.push("/dashboard");
      } catch (error) {
        setIsSignin(false)
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
        <div className="flex items-center justify-center mt-8">
          <Button size="lg" children={isSignin ? "Signing.." :"Signin"} type="submit" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="font-medium">Create an account</span>{" "}
          <span>
            <Link className="text-blue-900" href={"/signup"}>
              Signup
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Signin;
