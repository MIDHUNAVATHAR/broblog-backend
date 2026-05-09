import { Router } from "express";
import { authController } from "../di";

const authRouter = Router();

authRouter.post("/signup",(req,res) => authController.signup(req,res) ); 
authRouter.post("/login",(req,res)=>authController.login(req,res)); 
authRouter.post("/resend-otp",(req,res)=>authController.resendOtp(req,res)); 
authRouter.post("/verify-otp",(req,res)=>authController.verifyOtp(req,res)); 
authRouter.post("/refresh-token",(req,res)=>authController.refreshToken(req,res)); 
authRouter.post("/logout",(req,res)=>authController.logout(req,res)); 
authRouter.post("/forgot-password",(req,res)=>authController.forgotPassword(req,res)); 
authRouter.post("/verify-reset-otp",(req,res)=>authController.verifyForgotPasswordOtp(req,res)); 
authRouter.post("/reset-password",(req,res)=>authController.resetPassword(req,res)); 

export default authRouter;