import z, { email } from "zod";

export const UserSchema = z.object({
    username:z.string().nonempty("Required"),
    email: z.string().email("Must be an email"),
    firstname:z.string().min(3,"Minimum 3 characters required").max(30, "Not exceed 30 characters limit").nonempty("Cannot be empty"),
    lastname:z.string().optional(),
    password:z.string()
})

export const LoginSchema = z.object({
    email:z.string().email(),
    password:z.string()
})

export const BlogSchema = z.object({
    title:z.string(),
    content:z.string(),
    imageUrl:z.string().optional()
})