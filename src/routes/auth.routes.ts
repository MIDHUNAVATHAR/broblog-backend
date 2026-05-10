import { Router } from "express";
import { authController } from "../di";

const authRouter = Router();

authRouter.post("/signup",(req,res) => authController.signup(req,res) ); 
authRouter.post("/login",(req,res)=>authController.login(req,res)); 
authRouter.post("/refresh-token",(req,res)=>authController.refreshToken(req,res)); 
authRouter.post("/logout",(req,res)=>authController.logout(req,res)); 

export default authRouter;