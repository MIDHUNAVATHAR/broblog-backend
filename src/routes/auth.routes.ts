import { Router } from "express";
import { authController } from "../di";
import { ROUTE_PATHS } from "../constants/routes";

const authRouter = Router();

authRouter.post(ROUTE_PATHS.AUTH.SIGNUP, (req, res, next) => authController.signup(req, res, next));
authRouter.post(ROUTE_PATHS.AUTH.LOGIN, (req, res, next) => authController.login(req, res, next));
authRouter.post(ROUTE_PATHS.AUTH.REFRESH_TOKEN, (req, res, next) => authController.refreshToken(req, res, next));
authRouter.post(ROUTE_PATHS.AUTH.LOGOUT, (req, res,nex) => authController.logout(req, res,nex));

export default authRouter;