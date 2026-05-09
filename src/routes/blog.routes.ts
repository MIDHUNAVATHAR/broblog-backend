import { Router } from "express";
import { BlogController } from "../controller/BlogController";
import { authMiddleware } from "../middlewares/auth.middleware";

export const blogRoutes = (blogController: BlogController) => {
    const router = Router();

    router.post("/", authMiddleware, (req, res) => blogController.createBlog(req, res));
    router.get("/", (req, res) => blogController.getAllBlogs(req, res));
    router.get("/my-blogs", authMiddleware, (req, res) => blogController.getMyBlogs(req, res));
    router.get("/:id", (req, res) => blogController.getBlogById(req, res));
    router.put("/:id", authMiddleware, (req, res) => blogController.updateBlog(req, res));
    router.delete("/:id", authMiddleware, (req, res) => blogController.deleteBlog(req, res));
    router.post("/:id/like", authMiddleware, (req, res) => blogController.toggleLike(req, res));

    return router;
};
