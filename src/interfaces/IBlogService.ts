import { Blog } from "@prisma/client";

export interface IBlogService {
    createBlog(data: { title: string; content: string; image?: string; imagePublicId?: string; readingTime?: string; authorId: string }): Promise<Blog>;
    getAllBlogs(search?: string): Promise<Blog[]>;
    getUserBlogs(authorId: string): Promise<Blog[]>;
    getBlogById(id: string): Promise<Blog | null>;
    updateBlog(id: string, data: { title: string; content: string; readingTime?: string }): Promise<Blog>;
    deleteBlog(id: string): Promise<void>;
    toggleLike(blogId: string, userId: string): Promise<{ liked: boolean; likeCount: number }>;
}
