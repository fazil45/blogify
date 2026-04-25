import jwt from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!

export const generateAccessToken = (userId:string, username:string, firstname:string, lastname:string)=>{
    return jwt.sign({userId, username, firstname, lastname},ACCESS_TOKEN_SECRET,{
        expiresIn:"15m"
    })
}

export const verifyAccessToken =(token: string) =>  {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId:string, username:string, firstname:string, lastname:string };
}

export const generateRefreshToken = (userId:string)=>{
    return jwt.sign({userId},REFRESH_TOKEN_SECRET)
}

export const verifyRefreshToken =(token: string) =>  {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId:string };
}