import z, { email } from "zod";

export const UserSchema = z.object({
  username: z.string().nonempty("Required"),
  email: z.string().email("Must be an email"),
  firstname: z
    .string()
    .min(3, "Minimum 3 characters required")
    .max(30, "Not exceed 30 characters limit")
    .nonempty("Cannot be empty"),
  lastname: z.string().default(""),
  password: z
    .string()
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .min(8, "Minimum 8 character required"),
});

export const UserFormSchema = UserSchema.extend({
    lastname:z.string()
})

export const LoginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z
    .string()
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .min(8, "Minimum 8 character required"),
});

export const BlogSchema = z.object({
  title: z.string(),
  content: z.string(),
  imageUrl: z.string().optional(),
});

export const UpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
});
