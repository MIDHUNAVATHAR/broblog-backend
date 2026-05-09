import { Request, Response } from "express";
import { IBlogService } from "../interfaces/IBlogService";
import { blogSchema } from "../validators/blog.validator";

export class BlogController {
    private blogService: IBlogService;

    constructor(blogService: IBlogService) {
        this.blogService = blogService;
    }

    async createBlog(req: Request, res: Response): Promise<void> {
        try {
            const validation = blogSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: validation.error.issues[0].message,
                    errors: validation.error.issues
                });
                return;
            }

            const { title, content, image, imagePublicId, readingTime } = validation.data;
            const authorId = (req as any).user?.id; // Assumes auth middleware sets req.user

            if (!authorId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const blog = await this.blogService.createBlog({ title, content, image, imagePublicId, readingTime, authorId });
            res.status(201).json({ message: "Blog created successfully", blog });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllBlogs(req: Request, res: Response): Promise<void> {
        try {
            const search = req.query.search as string;
            const blogs = await this.blogService.getAllBlogs(search);
            res.status(200).json(blogs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getMyBlogs(req: Request, res: Response): Promise<void> {
        try {
            const authorId = (req as any).user?.id;
            if (!authorId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const blogs = await this.blogService.getUserBlogs(authorId);
            res.status(200).json(blogs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getBlogById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const blog = await this.blogService.getBlogById(id);
            if (!blog) {
                res.status(404).json({ message: "Blog not found" });
                return;
            }
            res.status(200).json(blog);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateBlog(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const validation = blogSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: validation.error.issues[0].message,
                    errors: validation.error.issues
                });
                return;
            }

            const { title, content, readingTime } = validation.data;
            const authorId = (req as any).user?.id;

            const blog = await this.blogService.getBlogById(id);
            if (!blog) {
                res.status(404).json({ message: "Blog not found" });
                return;
            }

            if (blog.authorId !== authorId) {
                res.status(403).json({ message: "Unauthorized to update this blog" });
                return;
            }

            const updatedBlog = await this.blogService.updateBlog(id, { title, content, readingTime });
            res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteBlog(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const authorId = (req as any).user?.id;

            const blog = await this.blogService.getBlogById(id);
            if (!blog) {
                res.status(404).json({ message: "Blog not found" });
                return;
            }

            if (blog.authorId !== authorId) {
                res.status(403).json({ message: "Unauthorized to delete this blog" });
                return;
            }

            await this.blogService.deleteBlog(id);
            res.status(200).json({ message: "Blog deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async toggleLike(req: Request, res: Response): Promise<void> {
        try {
            const blogId = req.params.id as string;
            const userId = (req as any).user?.id;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const result = await this.blogService.toggleLike(blogId, userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
