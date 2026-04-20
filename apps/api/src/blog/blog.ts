import { prisma } from "@repo/db";
import { BlogSchema, UpdateSchema } from "@repo/zodSchema";
import express, { Request, Response } from "express";
import { authMiddleware } from "../auth/middleware/auth.middleware.js";
import cloudinary from "./utils/cloudinary.utils.js";
import { upload } from "./utils/multer.utils.js";
const route = express.Router();

const createBlog = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authorization error" });
    }

    const { title, content } = req.body;
    const file = req.file;

    let imageUrl: string | null = null;

    if (file) {
      const uploadToCloudinary = (): Promise<string> => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "blogs" },
            (error, result) => {
              if (error) reject(error);
              else if (!result) reject(new Error("No result from cloudinary"));
              else resolve(result.secure_url);
            },
          );
          stream.end(file.buffer);
        });
      };

      imageUrl = await uploadToCloudinary();
    }

    const parseData = BlogSchema.safeParse({ title, content, imageUrl });
    if (!parseData.success) {
      return res.status(400).json({ error: parseData.error.message });
    }

    await prisma.blog.create({
      data: {
        title: parseData.data.title,
        content: parseData.data.content,
        image: imageUrl,
        posted: true,
        creator: { connect: { id: userId } },
      },
    });

    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getUsersAllBlogs = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Authorization error",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const blogs = await prisma.blog.findMany({
      where: {
        creatorId: user.id,
      },
      include: {
        creator: {
          select: {
            firstname: true,
            lastname: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      blogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const cursor = req.query.cursor as string | undefined;

    const allBlog = await prisma.blog.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            firstname: true,
            lastname: true,
            username: true,
          },
        },
      },
    });

    const hasMore = allBlog.length > limit;
    if (hasMore) allBlog.pop(); // remove the extra item

    const nextCursor = hasMore ? allBlog[allBlog.length - 1]?.id : null;

    if (!allBlog) {
      return res.status(500).json({
        error: "Something went wrong",
      });
    }

    res.status(200).json({
      blogs: allBlog,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const deleteId = req.params["id"];

    if (!deleteId || typeof deleteId !== "string") {
      return res.status(400).json({
        error: "Blog id is required",
      });
    }

    await prisma.blog.delete({
      where: {
        id: deleteId,
        creatorId: req.userId,
      },
    });

    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

const getBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params["id"];

    if (!blogId || typeof blogId !== "string") {
      return res.status(400).json({
        error: "Blog id is required",
      });
    }

    const blog = await prisma.blog.findFirst({
      where: {
        id: blogId,
      },
    });

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    res.status(200).json({
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    const parseData = UpdateSchema.safeParse(req.body);

    if (!parseData.success) {
      return res.status(400).json({
        error: "Invalid inputs",
      });
    }

    const { title, content, imageUrl } = parseData.data;

    const updateId = req.params["id"];

    if (!updateId || typeof updateId !== "string") {
      return res.status(400).json({
        error: "Blog id is required",
      });
    }

    const updatedBlog = await prisma.blog.update({
      where: {
        id: updateId,
        creatorId: req.userId,
      },
      data: {
        title,
        content,
        image: imageUrl ?? null,
      },
    });

    res.status(200).json({
      blog: updatedBlog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

route.use(authMiddleware);
route.post("/blog", upload.single("imageUrl"), createBlog);
route.get("/blogs", getUsersAllBlogs);
route.get("/blog/:id", getBlog);
route.delete("/blog/:id", deleteBlog);
route.put("/blog/:id", updateBlog);
route.get("/allBlogs", getAllBlogs);

export default route;
