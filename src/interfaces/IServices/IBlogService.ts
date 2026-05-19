import { Blog } from "@prisma/client";
import { CreateBlogDTO } from "../../dto/CreateBlogDTO";
import { UpdateBlogDTO } from "../../dto/UpdateBlogDTO";
import { BlogResponseDTO } from "../../dto/BlogResponseDTO";

export interface IBlogService {
    createBlog(data: CreateBlogDTO): Promise<BlogResponseDTO>;
    getAllBlogs(search?: string): Promise<BlogResponseDTO[]>;
    getUserBlogs(authorId: string): Promise<BlogResponseDTO[]>;
    getBlogById(id: string): Promise<BlogResponseDTO | null>;
    updateBlog(id: string, data: UpdateBlogDTO): Promise<BlogResponseDTO>;
    deleteBlog(id: string): Promise<void>;
    toggleLike(blogId: string, userId: string): Promise<{ liked: boolean; likeCount: number }>;
}
