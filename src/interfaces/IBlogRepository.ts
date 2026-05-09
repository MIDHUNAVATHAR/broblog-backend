import { Blog } from "@prisma/client";

export interface IBlogRepository {
    createBlog(data: { title: string; content: string; image?: string; imagePublicId?: string; readingTime?: string; authorId: string }): Promise<Blog>;
    findAll(search?: string): Promise<Blog[]>;
    findByAuthorId(authorId: string): Promise<Blog[]>;
    findById(id: string): Promise<Blog | null>;
    updateBlog(id: string, data: { title: string; content: string; readingTime?: string }): Promise<Blog>;
    softDelete(id: string): Promise<void>;
    toggleLike(blogId: string, userId: string): Promise<{ liked: boolean; likeCount: number }>;
}
