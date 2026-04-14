import jwt from "jsonwebtoken"
import { Request, Response,NextFunction } from "express";

export const authMiddleware = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const token = req.cookies.accessToken

        if (!token) {
            return res.status(400).json({
                error:"Unauthorised request"
            })
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)

        if (!decodedToken) {
            return res.status(402).json({
                error:"Unauthorised"
            })
        }

        if (typeof decodedToken === "string") {
      return;
    }

    if (decodedToken) {
      req.userId = decodedToken.userId;;
      next();
    } else {
      res.status(403).json({
        error: "Unauthorized",
      });
    }
    } catch (error) {
         console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
    }
}