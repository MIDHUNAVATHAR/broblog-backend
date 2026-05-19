import { Router } from "express";
import { BlogController } from "../controller/BlogController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ROUTE_PATHS } from "../constants/routes";

export const blogRoutes = (blogController: BlogController) => {
    const router = Router();

    router.post(ROUTE_PATHS.BLOGS.CREATE, authMiddleware, (req, res, next) => blogController.createBlog(req, res, next));
    router.get(ROUTE_PATHS.BLOGS.GET_ALL, (req, res, next) => blogController.getAllBlogs(req, res, next));
    router.get(ROUTE_PATHS.BLOGS.GET_MY, authMiddleware, (req, res, next) => blogController.getMyBlogs(req, res, next));
    router.get(ROUTE_PATHS.BLOGS.GET_BY_ID, (req, res, next) => blogController.getBlogById(req, res, next));
    router.put(ROUTE_PATHS.BLOGS.UPDATE, authMiddleware, (req, res, next) => blogController.updateBlog(req, res, next));
    router.delete(ROUTE_PATHS.BLOGS.DELETE, authMiddleware, (req, res, next) => blogController.deleteBlog(req, res, next));
    router.post(ROUTE_PATHS.BLOGS.LIKE, authMiddleware, (req, res, next) => blogController.toggleLike(req, res, next));

    return router;
};
