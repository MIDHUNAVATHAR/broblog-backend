import { Blog } from "@prisma/client";
import { CreateBlogDTO } from "../dto/CreateBlogDTO";
import { UpdateBlogDTO } from "../dto/UpdateBlogDTO";

export interface IBlogRepository {
    createBlog(data: CreateBlogDTO): Promise<Blog>;
    findAll(search?: string): Promise<Blog[]>;
    findByAuthorId(authorId: string): Promise<Blog[]>;
    findById(id: string): Promise<Blog | null>;
    updateBlog(id: string, data: UpdateBlogDTO): Promise<Blog>;
    softDelete(id: string): Promise<void>;
    toggleLike(blogId: string, userId: string): Promise<{ liked: boolean; likeCount: number }>;
}
