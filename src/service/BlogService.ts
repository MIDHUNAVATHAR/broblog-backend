import { Blog } from "@prisma/client";
import { IBlogRepository } from "../interfaces/IBlogRepository";
import { IBlogService } from "../interfaces/IBlogService";
import cloudinary from "../config/cloudinary";

export class BlogService implements IBlogService {
    private blogRepository: IBlogRepository;

    constructor(blogRepository: IBlogRepository) {
        this.blogRepository = blogRepository;
    }

    async createBlog(data: { title: string; content: string; image?: string; imagePublicId?: string; readingTime?: string; authorId: string }): Promise<Blog> {
        return await this.blogRepository.createBlog(data);
    }

    async getAllBlogs(search?: string): Promise<Blog[]> {
        return await this.blogRepository.findAll(search);
    }

    async getUserBlogs(authorId: string): Promise<Blog[]> {
        return await this.blogRepository.findByAuthorId(authorId);
    }

    async getBlogById(id: string): Promise<Blog | null> {
        return await this.blogRepository.findById(id);
    }

    async updateBlog(id: string, data: { title: string; content: string; readingTime?: string }): Promise<Blog> {
        return await this.blogRepository.updateBlog(id, data);
    }

    async deleteBlog(id: string): Promise<void> {
        const blog = await this.blogRepository.findById(id);
        if (blog && blog.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(blog.imagePublicId);
            } catch (error) {
                console.error("Failed to delete image from Cloudinary", error);
                // We still proceed to soft delete the blog even if image deletion fails
            }
        }
        await this.blogRepository.softDelete(id);
    }

    async toggleLike(blogId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
        return await this.blogRepository.toggleLike(blogId, userId);
    }
}
