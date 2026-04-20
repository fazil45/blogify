import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import express, { Request, Response } from "express";
import { LoginSchema, UserSchema } from "@repo/zodSchema";
import bcrypt from "bcrypt";
import { prisma } from "@repo/db";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./utils/token.utils.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import crypto from "crypto";
import {
  emailVerificationTemplate,
  forgotPasswordTemplate,
  sendEmail,
} from "./utils/email.utils.js";

const isProduction = process.env.NODE_ENV === "production";
const route = express.Router();
const register = async (req: Request, res: Response) => {
  try {
    const parsedSignupData = UserSchema.safeParse(req.body);
    if (!parsedSignupData.success) {
      return res.status(400).json({ error: "Invalid inputs" });
    }

    const { username, firstname, lastname, email, password } =
      parsedSignupData.data;

    const checkUserExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (checkUserExists) {
      return res.status(409).json({
        error: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (!hashedPassword) {
      return res.status(500).json({
        error: "Unable to hash password",
      });
    }

    const createUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: hashedPassword,
      },
    });

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await prisma.user.update({
      where: { id: createUser.id },
      data: {
        emailVerifyToken: verifyToken,
        emailVerifyTokenExpiry: verifyTokenExpiry,
      },
    });

    await sendEmail({
      email: email,
      subject: "Verify Your Email",
      html: emailVerificationTemplate(
        username,
        `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`,
      ),
    });

    res.status(201).json({
      message: "Signedup created Successfully",
      userId: createUser.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const parsedLoginData = LoginSchema.safeParse(req.body);

    if (!parsedLoginData.success) {
      return res.status(400).json({
        error: "Invalid inputs",
      });
    }

    const { email, password } = parsedLoginData.data;

    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      return res.status(401).json({
        error: "Incorrect email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Incorrect email or password",
      });
    }

    // if (!userExists.isEmailVerified) {
    //   return res.status(403).json({ error: "Please verify your email first" });
    // }

    const accessToken = generateAccessToken(
      userExists.id,
      userExists.username,
      userExists.firstname,
      userExists.lastname!,
    );

    const refreshToken = generateRefreshToken(userExists.id);

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction, 
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction, 
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      })
      .json({
        message: "User loggedin successfully",
        accessToken,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const signout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: "",
      },
    });

    return res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction, 
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction, 
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      })
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(
      user.id,
      user.username,
      user.firstname,
      user.lastname!,
    );

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: isProduction, 
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      })
      .json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { verificationToken } = req.body;

    if (!verificationToken || typeof verificationToken !== "string") {
      return res.status(400).json({
        error: "Email verification token is missing",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: verificationToken,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
        emailVerifyTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.isEmailVerified) {
      return res.status(200).json({
        message: "If applicable, a verification email has been sent",
      });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken: verifyToken,
        emailVerifyTokenExpiry: verifyTokenExpiry,
      },
    });

    await sendEmail({
      email,
      subject: "Verify your email",
      html: emailVerificationTemplate(
        user.username,
        `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`,
      ),
    });

    return res.status(200).json({
      message: "If applicable, a verification email has been sent",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link has been sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: expiry,
      },
    });

    await sendEmail({
      email: email,
      subject: "Reset your password",
      html: forgotPasswordTemplate(
        user.username,
        `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`,
      ),
    });

    return res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const checkUsername = async (req: Request, res: Response) => {
  try {
    const username = req.params["username"];
    if (!username || typeof username !== "string") {
      return res.status(400).json({
        error: "Username is required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        available: false,
        error: "Username already taken",
      });
    }

    return res.status(200).json({
      available: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

const me = async (req:Request, res:Response) => {
  try {
    const token = req.cookies.accessToken

    if (!token) {
      return res.status(401).json({
        user:null
      })
    }

    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!) as JwtPayload

    const user = await prisma.user.findUnique({
      where:{
        id:decoded.userId
      },
      select:{
        id:true,
        firstname:true,
        lastname:true,
        username:true,
        email:true
      }
    })

    res.status(200).json({
      user
    })
  } catch (error) {
      console.error(error)
      res.status(500).json({
        error:"Server Error"
      })
  }
}

route.post("/signup", register);
route.post("/signin", signin);
route.post("/verify-email", verifyEmail);
route.get("/me",me)
route.post("/refresh-token", refreshAccessToken);
route.post("/resend-verification", resendVerificationEmail);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password", resetPassword);
route.get("/check/:username", checkUsername);
route.post("/signout", authMiddleware, signout);

export default route;
