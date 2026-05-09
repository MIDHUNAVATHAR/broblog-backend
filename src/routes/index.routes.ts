import { Router } from "express";
import authRouter from "./auth.routes";
import { blogRoutes } from "./blog.routes";
import { blogController, uploadController } from "../di";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";


const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/blogs", authMiddleware, blogRoutes(blogController));
indexRouter.post("/upload", authMiddleware, upload.single('image'), (req, res) => uploadController.uploadImage(req, res));

export default indexRouter;