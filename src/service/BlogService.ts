import { IBlogRepository } from "../interfaces/IBlogRepository";
import { IBlogService } from "../interfaces/IServices/IBlogService";
import cloudinary from "../config/cloudinary";
import { CreateBlogDTO } from "../dto/CreateBlogDTO";
import { UpdateBlogDTO } from "../dto/UpdateBlogDTO";
import { BlogResponseDTO } from "../dto/BlogResponseDTO";
import { BlogMapper } from "../mappers/BlogMapper";

export class BlogService implements IBlogService {
    private blogRepository: IBlogRepository;

    constructor(blogRepository: IBlogRepository) {
        this.blogRepository = blogRepository;
    }

    async createBlog(data: CreateBlogDTO): Promise<BlogResponseDTO> {
        const blog = await this.blogRepository.createBlog(data);
        return BlogMapper.toResponseDTO(blog);
    }

    async getAllBlogs(search?: string): Promise<BlogResponseDTO[]> {
        const blogs = await this.blogRepository.findAll(search);
        return BlogMapper.toResponseDTOList(blogs);
    }

    async getUserBlogs(authorId: string): Promise<BlogResponseDTO[]> {
        const blogs = await this.blogRepository.findByAuthorId(authorId);
        return BlogMapper.toResponseDTOList(blogs);
    }

    async getBlogById(id: string): Promise<BlogResponseDTO | null> {
        const blog = await this.blogRepository.findById(id);
        return blog ? BlogMapper.toResponseDTO(blog) : null;
    }

    async updateBlog(id: string, data: UpdateBlogDTO): Promise<BlogResponseDTO> {
        const blog = await this.blogRepository.updateBlog(id, data);
        return BlogMapper.toResponseDTO(blog);
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
