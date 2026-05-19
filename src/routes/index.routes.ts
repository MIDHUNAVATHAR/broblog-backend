import { Router } from "express";
import authRouter from "./auth.routes";
import { blogRoutes } from "./blog.routes";
import { blogController, uploadController } from "../di";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { ROUTE_PATHS } from "../constants/routes";


const indexRouter = Router();

indexRouter.use(ROUTE_PATHS.AUTH.ROOT, authRouter);
indexRouter.use(ROUTE_PATHS.BLOGS.ROOT, authMiddleware, blogRoutes(blogController));
indexRouter.post(ROUTE_PATHS.UPLOAD, authMiddleware, upload.single('image'), (req, res, next) => uploadController.uploadImage(req, res, next));

export default indexRouter;