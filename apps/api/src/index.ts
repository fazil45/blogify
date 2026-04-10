import express from "express";
import authRouter from "./auth/auth.js"
import cookieParser from "cookie-parser"
const app = express();
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 4000;

app.use("/v1",authRouter)

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
