import z from "zod";
export declare const UserSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    firstname: z.ZodString;
    lastname: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const UserFormSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    firstname: z.ZodString;
    password: z.ZodString;
    lastname: z.ZodString;
}, z.z.core.$strip>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const ChangePassword: z.ZodObject<{
    oldPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.z.core.$strip>;
export declare const BlogSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.z.core.$strip>;
export declare const BlogFormSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, z.z.core.$strip>;
export declare const UpdateSchema: z.ZodObject<{
    title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    content: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    imageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.z.core.$strip>;
//# sourceMappingURL=index.d.ts.map