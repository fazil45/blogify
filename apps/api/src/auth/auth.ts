import "dotenv/config";
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

const route = express.Router();

const register = async (req: Request, res: Response) => {
  try {
    const parsedSignupData = UserSchema.safeParse(req.body);
    if (!parsedSignupData.success) {
      return res.status(404).json({ error: "Invalid inputs" });
    }

    const { username, firstname, lastname, email, password } =
      parsedSignupData.data;

    const checkUserExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (checkUserExists) {
      return res.status(403).json({
        error: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (!hashedPassword) {
      return res.status(402).json({
        error: "Invalid error",
      });
    }
    const refreshToken = generateRefreshToken(email);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    await sendEmail({
      email: email,
      subject: "Verify Your Email",
      html: emailVerificationTemplate(
        username,
        `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`,
      ),
    });

    const createUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: hashedPassword,
        refreshToken: refreshToken,
      },
    });

    await prisma.user.update({
      where: { id: createUser.id },
      data: { emailVerifyToken: verifyToken },
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

const login = async (req: Request, res: Response) => {
  try {
    const parsedLoginData = LoginSchema.safeParse(req.body);

    if (!parsedLoginData.success) {
      return res.status(402).json({
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
      return res.status(403).json({
        error: "User not exists",
      });
    }

    const hashedPassword = bcrypt.compare(password, userExists.password);

    if (!hashedPassword) {
      return res.status(400).json({
        error: "Invalid inputs",
      });
    } else {
      const accessToken = generateAccessToken(
        userExists.id,
        userExists.username,
        userExists.firstname,
        userExists.lastname!,
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      res.status(200).cookie("accessToken", accessToken, options).json({
        message: "User loggedin successfully",
        accessToken,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req: Request, res: Response) => {
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
        secure: true,
      })
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { verificationToken } = req.params;

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
      },
    });

    return res.status(200).json({ message: "Email verified successfully" });
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

    // Always return 200 to avoid exposing whether email exists
    if (!user) {
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link has been sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

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
        passwordResetExpiry: { gt: new Date() }, // not expired
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

route.post("/signup", register);
route.post("/login", login);
route.post("/logout", authMiddleware, logout);
route.get("/verify-email", verifyEmail);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password", resetPassword);

export default route;
