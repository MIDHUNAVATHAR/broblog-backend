import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { signupSchema, loginSchema } from "../validators/auth.validator";

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async signup(req: Request, res: Response): Promise<void> {
        try {
            const validation = signupSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: validation.error.issues[0].message,
                    errors: validation.error.issues
                });
                return;
            }

            const { email, password } = validation.data;

            const result = await this.authService.signup({ email, password });
            res.status(201).json({
                message: "User created successfully",
                user: result
            })
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }



    async login(req: Request, res: Response): Promise<void> {
        try {
            const validation = loginSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: validation.error.issues[0].message,
                    errors: validation.error.issues
                });
                return;
            }

            const { email, password } = validation.data;

            const result = await this.authService.login({ email, password });

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

            })

            res.status(200).json({
                message: "Login successful",
                user: result.user,
                accessToken: result.accessToken
            })
        } catch (error: any) {
            res.status(401).json({ message: error.message })
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ message: "Refresh token not found" });
                return;
            }

            const result = await this.authService.refreshToken(refreshToken);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });
        res.status(200).json({ message: "Logged out successfully" });
    }


}