import { Router } from "express";
import { authController } from "../di";

const authRouter = Router();

authRouter.post("/signup",(req,res) => authController.signup(req,res) ); 
authRouter.post("/login",(req,res)=>authController.login(req,res)); 
authRouter.post("/resend-otp",(req,res)=>authController.resendOtp(req,res)); 
authRouter.post("/verify-otp",(req,res)=>authController.verifyOtp(req,res)); 

export default authRouter;