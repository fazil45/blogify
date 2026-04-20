import jwt from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!

export const generateAccessToken = (userId:string, username:string, firstname:string, lastname:string)=>{
    return jwt.sign({userId, username, firstname, lastname},ACCESS_TOKEN_SECRET,{
        expiresIn:"15m"
    })
}

export const verifyAccessToken =(token: string) =>  {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId:string, username:string, firstname:string, lastname:string };
}

export const generateRefreshToken = (userId:string)=>{
    return jwt.sign({userId},ACCESS_TOKEN_SECRET,{
        expiresIn:"45m"
    })
}

export const verifyRefreshToken =(token: string) =>  {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId:string };
}