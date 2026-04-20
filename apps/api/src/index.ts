import express from "express";
import authRouter from "./auth/auth.js";
import blogRouter from "./blog/blog.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const PORT = process.env.PORT || 4000;

app.use("/v1/auth", authRouter);
app.use("/v1", blogRouter);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
