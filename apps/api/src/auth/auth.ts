import express, { Request, Response } from "express";
import { LoginSchema, UserSchema } from "@repo/zodSchema";
import bcrypt from "bcrypt";
import { prisma } from "@repo/db";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./utils/token.utils.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
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

route.post("/signup", register);
route.post("/login", login);
route.post("/logout", authMiddleware, logout);

export default route;
