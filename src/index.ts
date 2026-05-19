import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import { env } from "process";
import prisma from "./config/prisma";
import indexRouter from "./routes/index.routes"
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming Request : ${req.url}`)
    next();
})

app.use("/api", indexRouter);
app.use(errorHandler);
app.get("/", (req, res) => {
    res.send("server running...");
})

async function startServer() {
    try {
        await prisma.$connect();
        console.log("Database connected");

        app.listen(env.PORT || 8000, () => {
            console.log(`Server running on port : ${env.PORT || 8000}`);
        })
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
    }
}

startServer();

