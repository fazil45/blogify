import { prisma } from "@repo/db";
import { BlogSchema } from "@repo/zodSchema";
import express, { Request, Response } from "express";
import { authMiddleware } from "../auth/middleware/auth.middleware.js";
const route = express.Router();
const app = express();

const createBlog = async (req: Request, res: Response) => {
  try {
    
    const userId = req.userId

    if (!userId) {
      return res.status(403).json({
        error :"Authorization error"
      })
    }
    

    const parseData = BlogSchema.safeParse(req.body);

    if (!parseData.success) {
      return res.status(403).json({
        error: "Invalid inputs",
      });
    }

    const { title, content, imageUrl } = parseData.data;

    await prisma.blog.create({
      data: {
        title,
        content,
        image: imageUrl,
        creater: {
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
    res.status(400).json({
      error: "Server Error",
    });
  }
};

const getUsersAllBlogs = async(req:Request, res:Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(403).json({
        error:"Authorization error"
      })
    }

    const user = await prisma.user.findUnique({
      where:{
        id:userId
      }
    })

    if (!user) {
      return res.status(404).json({
        error:"Unauthorized"
      })
    }

    const blogs = await prisma.blog.findMany({
      where:{
        createrId:user?.id
      }
    })

    if (!blogs) {
      return res.status(404).json({
        error:"blogs not created yet"
      })
    }

    res.status(202).json({
      blogs:blogs
    })


  } catch (error) {
    console.error(error)
    res.status(403).json({
      error:"Server error"
    })
  }
}

const getAllBlogs = async (req:Request,res:Response) => {
  try {
    const allBlog = await prisma.blog.findMany()

    if (!allBlog) {
      res.status(402).json({
        error:"Something went wrong.."
      })
    }

    res.status(202).json({
      blogs:allBlog
    })
  } catch (error) {
    console.error(error)
    res.status(404).json({
      error:"Server Error"
    })
  }
}

const deleteBlog = async (req:Request, res:Response) => {
  try {
    const deleteId = req.params["id"]
 
  if (!deleteId || typeof deleteId !== "string") {
    return res.status(403).json({
      error:"Blog not found"
    })
  }

  await prisma.blog.delete({
    where:{
      id:deleteId
    }
  })


  res.status(401).json({
    error:"Blog deleted succesfully"
  })

  
  } catch (error) {
    console.error(error)
    res.status(403).json({
      error:"Server error"
    })
  } 
}
route.use(authMiddleware)
route.post("/blog",  createBlog);
route.get("/blogs",getUsersAllBlogs)
route.delete("/blog/:id",deleteBlog)
route.get("/allBlogs",getAllBlogs)
export default route;
