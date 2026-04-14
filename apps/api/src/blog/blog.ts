import { prisma } from "@repo/db";
import { BlogSchema, UpdateSchema } from "@repo/zodSchema";
import express, { Request, Response } from "express";
import { authMiddleware } from "../auth/middleware/auth.middleware.js";
import cloudinary from "./utils/cloudinary.utils.js";
import { upload } from "./utils/multer.utils.js";
const route = express.Router();
const app = express();

const uploadImage = async(req:Request, res:Response)=>{
  try {
    const file = req.file

    if(!file){
      return res.status(400).json({
        error:"No file uploaded"
      })
    }

    const result = await cloudinary.uploader.upload(file.path)

     res.status(200).json({
      imageUrl: result.secure_url 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Upload failed",
    });
  }
}

const createBlog = async (req: Request, res: Response) => {`  `
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
        creatorId:user?.id
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
      id:deleteId,
      creatorId:req.userId
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

const getBlog = async (req:Request, res:Response) => {
  try {
    const blogId = req.params["id"]
 
  if (!blogId || typeof blogId !== "string") {
    return res.status(403).json({
      error:"Blog not found"
    })
  }

  const blog = await prisma.blog.findFirst({
    where:{
      id:blogId
    }
  })


  res.status(401).json({
    blog:blog
  })

  
  } catch (error) {
    console.error(error)
    res.status(403).json({
      error:"Server error"
    })
  } 
}

const updateBlog = async (req:Request, res:Response) => {
  try {
    const parseData = UpdateSchema.safeParse(req.body)

    if (!parseData.success) {
      return res.status(200).json({
        error:"Invalid inputs"
      })
    }

    const {title, content, imageUrl} = parseData.data

    const updateId = req.params["id"]
 
  if (!updateId || typeof updateId !== "string") {
    return res.status(403).json({
      error:"Blog not found"
    })
  }

  const updatedBlog = await prisma.blog.update({
    where:{
      id:updateId,
      creatorId:req.userId
    },
    data:{
      title:title,
      content:content,
      image:imageUrl ?? null
    }
  })


  res.status(401).json({
    blog:updateBlog,
    error:"Blog updated succesfully"
  })

  
  } catch (error) {
    console.error(error)
    res.status(403).json({
      error:"Server error"
    })
  } 
}

route.use(authMiddleware)
route.post("/upload",upload.single("image"), uploadImage)
route.post("/blog",  createBlog);
route.get("/blogs",getUsersAllBlogs)
route.get("/blog/:id",getBlog)
route.delete("/blog/:id",deleteBlog)
route.put("/blog/:id",updateBlog)
route.get("/allBlogs",getAllBlogs)

export default route;
