import { Request, Response, NextFunction } from "express";
import { IBlogService } from "../interfaces/IServices/IBlogService";
import { blogSchema } from "../validators/blog.validator";
import { StatusCode } from "../constants/statusCodes";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ResponseMessage } from "../constants/messages";

export class BlogController {
    private blogService: IBlogService;

    constructor(blogService: IBlogService) {
        this.blogService = blogService;
    }

    async createBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const validation = blogSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(StatusCode.BAD_REQUEST).json({ message: validation.error.issues[0].message });
                return;
            }

            const { title, content, image, imagePublicId, readingTime } = validation.data;
            const authorId = req.user?.id; // Assumes auth middleware sets req.user

            if (!authorId) {
                res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseMessage.UNAUTHORIZED })
                return;
            }

            const blog = await this.blogService.createBlog({ title, content, image, imagePublicId, readingTime, authorId });
            res.status(StatusCode.CREATED).json({ message: ResponseMessage.BLOG_CREATED, blog });
        } catch (error) {
            next(error);
        }
    }

    async getAllBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const search = req.query.search as string;
            const blogs = await this.blogService.getAllBlogs(search);
            res.status(StatusCode.OK).json(blogs);
        } catch (error) {
            next(error);
        }
    }

    async getMyBlogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const authorId = req.user?.id;
            if (!authorId) {
                res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseMessage.UNAUTHORIZED })
                return;
            }
            const blogs = await this.blogService.getUserBlogs(authorId);
            res.status(StatusCode.OK).json(blogs);
        } catch (error) {
            next(error);
        }
    }

    async getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const blog = await this.blogService.getBlogById(id);
            if (!blog) {
                res.status(StatusCode.NOT_FOUND).json({ message: ResponseMessage.BLOG_NOT_FOUND });
                return;
            }
            res.status(StatusCode.OK).json(blog);
        } catch (error) {
            next(error);
        }
    }

    async updateBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const validation = blogSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(StatusCode.BAD_REQUEST).json({ message: validation.error.issues[0].message });
                return;
            }

            const { title, content, readingTime } = validation.data;
            const authorId = req.user?.id;

            const blog = await this.blogService.getBlogById(id);
            if (!blog) {

                res.status(StatusCode.NOT_FOUND).json({
                    message: ResponseMessage.BLOG_NOT_FOUND
                })
                return
            }

            if (blog.authorId !== authorId) {
                res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseMessage.UNAUTHORIZED })
                return;
            }

            const updatedBlog = await this.blogService.updateBlog(id, { title, content, readingTime });
            res.status(StatusCode.OK).json({ message: "Blog updated successfully", blog: updatedBlog });
        } catch (error) {
            next(error);
        }
    }

    async deleteBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const authorId = req.user?.id;

            const blog = await this.blogService.getBlogById(id);
            if (!blog) {

                res.status(StatusCode.NOT_FOUND).json({ message: ResponseMessage.BLOG_NOT_FOUND });
                return;
            }

            if (blog.authorId !== authorId) {

                res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseMessage.UNAUTHORIZED })
                return;
            }

            await this.blogService.deleteBlog(id);
            res.status(StatusCode.OK).json({ message: ResponseMessage.BLOG_DELETED });
        } catch (error) {
            next(error);
        }
    }

    async toggleLike(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const blogId = req.params.id as string;
            const authorId = req.user?.id;

            if (!authorId) {
                res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseMessage.UNAUTHORIZED })
                return;
            }

            const result = await this.blogService.toggleLike(blogId, authorId);
            res.status(StatusCode.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
}
