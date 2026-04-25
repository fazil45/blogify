"use client";
import Input from "@/components/input";
import { AuthLayout } from "../authLayout";
import Button from "@/components/button";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { UserFormSchema } from "@repo/zodschema";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Singup = () => {
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const route = useRouter();

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      firstname: "",
      lastname: "",
      password: "",
    },  
    validators: {
      onChange: UserFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.username === "") {
        return toast.error("Enter Username");
      }

      if (value.email === "") {
        return toast.error("Enter Email");
      }

      if (value.password === "") {
        return toast.error("Enter Password");
      }

      if (value.firstname === "") {
        return toast.error("Enter Firstname");
      }

      const username = value.username;
      const email = value.email;
      const password = value.password;
      const firstname = value.firstname;
      const lastname = value.lastname;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HTTP_URL}/auth/check/${username}`,
        );

        const available = response.data.available;
        if (!available) {
          return;
        }
        setUsernameAvailable(available);

        if (usernameAvailable === false) {
          const message = response.data.message;
          toast.error(message);
        } else {
          setIsSignedUp(true);
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_HTTP_URL}/auth/signup`,
            {
              email,
              firstname,
              lastname,
              username,
              password,
            },
          );
          setIsSignedUp(false);
          toast.success("Signed up successfully");
          route.push("/verify-email");
        }
      } catch (error) {
        setIsSignedUp(false);

        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error || "Something went wrong ");
        } else {
          toast.error("Something went wrong ");
        }
      }
    },
  });
  
  return (
    <div>
      <AuthLayout>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex gap-2">
            <form.Field
              name="firstname"
              children={(field) => {
                return (
                  <div>
                    <Input
                      htmlFor="firstname"
                      placeholder="Firstname"
                      type="text"
                      label="Firstname"
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
              name="lastname"
              children={(field) => {
                return (
                  <div>
                    <Input
                      htmlFor="lastname"
                      placeholder="Lastname"
                      type="text"
                      label="Lastname"
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
          </div>
          <form.Field
            name="username"
            children={(field) => {
              return (
                <div>
                  <Input
                    htmlFor="username"
                    placeholder="Username"
                    type="text"
                    label="Username"
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
            name="email"
            children={(field) => {
              return (
                <div>
                  <Input
                    htmlFor="email"
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
            <Button size="lg" type="submit">
              {isSignedUp ? "Creating..." : "Create an account"}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="font-medium">Already have account?</span>{" "}
            <span>
              <Link className="text-blue-900" href={"/signin"}>
                Signin
              </Link>
            </span>
          </div>
        </form>
      </AuthLayout>
    </div>
  );
};

export default Singup;
