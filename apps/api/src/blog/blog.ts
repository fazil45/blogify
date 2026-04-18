import { prisma } from "@repo/db";
import { BlogSchema, UpdateSchema } from "@repo/zodSchema";
import express, { Request, Response } from "express";
import { authMiddleware } from "../auth/middleware/auth.middleware.js";
import cloudinary from "./utils/cloudinary.utils.js";
import { upload } from "./utils/multer.utils.js";
const route = express.Router();
const app = express();

const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(file.path);

    res.status(200).json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Upload failed",
    });
  }
};

const createBlog = async (req: Request, res: Response) => {
  `  `;
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Authorization error",
      });
    }

    const parseData = BlogSchema.safeParse(req.body);

    if (!parseData.success) {
      return res.status(400).json({
        error: "Invalid inputs",
      });
    }

    const { title, content, imageUrl } = parseData.data;

    await prisma.blog.create({
      data: {
        title,
        content,
        image: imageUrl ?? null,
        creator: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(201).json({
      message: "Blog created succesfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
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
    const allBlog = await prisma.blog.findMany();

    if (!allBlog) {
      return res.status(500).json({
        error: "Something went wrong",
      });
    }

    res.status(200).json({
      blogs: allBlog,
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
route.post("/upload", upload.single("image"), uploadImage);
route.post("/blog", createBlog);
route.get("/blogs", getUsersAllBlogs);
route.get("/blog/:id", getBlog);
route.delete("/blog/:id", deleteBlog);
route.put("/blog/:id", updateBlog);
route.get("/allBlogs", getAllBlogs);

export default route;
