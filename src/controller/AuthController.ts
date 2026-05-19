import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../interfaces/IServices/IAuthService";
import { signupSchema, loginSchema } from "../validators/auth.validator";
import { StatusCode } from "../constants/statusCodes";
import { ResponseMessage } from "../constants/messages";

export class AuthController {
    private _authService: IAuthService;

    constructor(authService: IAuthService) {
        this._authService = authService;
    }

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validation = signupSchema.safeParse(req.body);

            if (!validation.success) {
                const error: any = new Error(validation.error.issues[0].message);
                error.statusCode = StatusCode.BAD_REQUEST;
                error.errors = validation.error.issues;
                next(error);
                return;
            }

            const { email, password } = validation.data;

            const result = await this._authService.signup({ email, password });
            res.status(StatusCode.CREATED).json({
                message: ResponseMessage.USER_CREATED,
                user: result
            })
        } catch (error: any) {
            error.statusCode = StatusCode.BAD_REQUEST;
            next(error);
        }
    }



    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validation = loginSchema.safeParse(req.body);

            if (!validation.success) {
                const error: any = new Error(validation.error.issues[0].message);
                error.statusCode = StatusCode.BAD_REQUEST;
                error.errors = validation.error.issues;
                next(error);
                return;
            }

            const { email, password } = validation.data;

            const result = await this._authService.login({ email, password });

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

            })

            res.status(StatusCode.OK).json({
                message: ResponseMessage.LOGIN_SUCCESS,
                user: result.user,
                accessToken: result.accessToken
            })
        } catch (error: any) {
            error.statusCode = StatusCode.UNAUTHORIZED;
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                const error: any = new Error(ResponseMessage.REFRESH_TOKEN_NOT_FOUND);
                error.statusCode = StatusCode.UNAUTHORIZED;
                next(error);
                return;
            }

            const result = await this._authService.refreshToken(refreshToken);
            res.status(StatusCode.OK).json(result);
        } catch (error: any) {
            error.statusCode = StatusCode.UNAUTHORIZED;
            next(error);
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });
        res.status(StatusCode.OK).json({ message: ResponseMessage.LOGGED_OUT });
    }


}