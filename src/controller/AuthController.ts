import {Request,Response} from "express";
import { AuthService } from "../service/AuthService";

export class AuthController {
    private authService: AuthService;

    constructor(authService:AuthService){
        this.authService = authService;
    }

    async signup(req:Request,res:Response):Promise<void>{
        try {
            const {email,password} = req.body;

            if(!email || !password){
                res.status(400).json({message:"Email and password are required"});
                return ; 
            }

            const result = await this.authService.signup({email,password});
            res.status(201).json({
                message:"User created successfully",
                user:result
            })
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    }

    async verifyOtp(req:Request,res:Response): Promise<void> {
        try {
            const {email,otp} = req.body;

            if(!email || !otp){
                res.status(400).json({message:"Email and otp are required"})
                return ;
            }

            const result = await this.authService.verifyOtp(email,otp);
            res.status(201).json({
                message:"User verified and created successfully",
                user:result 
            })
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    async resendOtp(req:Request,res:Response):Promise<void>{
        try {
            const {email} = req.body;

            if(!email){
                res.status(400).json({message:"Email is required"}); 
                return; 
            }

            const result = await this.authService.resendOtp(email);
            res.status(200).json(result); 
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    async login(req:Request,res:Response):Promise<void>{
        try {
            const {email,password} = req.body;

            if(!email || !password){
                res.status(400).json({message:"Email and password are required"}); 
                return ;
            }

            const result = await this.authService.login({email,password});

            res.cookie("refreshToken",result.refreshToken,{
                httpOnly:true,
                secure:false,
                sameSite:"strict",
                maxAge:  7 * 24 * 60 * 60 * 1000, // 7 days
                
            })

            res.status(200).json({
                message:"Login successful",
                user: result.user,
                accessToken:result.accessToken
            })
        } catch (error:any) {
            res.status(401).json({message:error.message})
        }
    }
}