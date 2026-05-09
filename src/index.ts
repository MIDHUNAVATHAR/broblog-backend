import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { env } from "process";
import prisma from "./config/prisma";
import indexRouter from "./routes/index.routes"

const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json())

app.use((req, res, next) => {
    console.log(`Incoming Request : ${req.url}`)
    next();
})

app.use("/api",indexRouter);
app.get("/",(req,res)=>{
    res.send("server running...");
})

async function startServer(){
    try {
        await prisma.$connect();
        console.log("Database connected"); 

        app.listen(env.PORT || 8000,()=>{
            console.log(`Server running on port : ${env.PORT || 8000}`); 
        })
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
    }
}

startServer();


