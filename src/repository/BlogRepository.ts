import { PrismaClient, Blog } from "@prisma/client";
import { IBlogRepository } from "../interfaces/IBlogRepository";

export class BlogRepository implements IBlogRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async createBlog(data: { title: string; content: string; image?: string; imagePublicId?: string; readingTime?: string; authorId: string }): Promise<Blog> {
        return await this.prisma.blog.create({
            data
        });
    }

    async findAll(search?: string): Promise<Blog[]> {
        return await this.prisma.blog.findMany({
            where: {
                isDeleted: false,
                ...(search ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } }
                    ]
                } : {})
            },
            orderBy: { createdAt: 'desc' },
            include: { author: true, likes: true }
        });
    }

    async findByAuthorId(authorId: string): Promise<Blog[]> {
        return await this.prisma.blog.findMany({
            where: { authorId, isDeleted: false },
            orderBy: { createdAt: 'desc' },
            include: { author: true, likes: true }
        });
    }

    async findById(id: string): Promise<Blog | null> {
        return await this.prisma.blog.findFirst({
            where: { id, isDeleted: false },
            include: { author: true, likes: true }
        });
    }

    async updateBlog(id: string, data: { title: string; content: string; readingTime?: string }): Promise<Blog> {
        return await this.prisma.blog.update({
            where: { id },
            data
        });
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.blog.update({
            where: { id },
            data: { isDeleted: true }
        });
    }

    async toggleLike(blogId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
        const existingLike = await this.prisma.like.findUnique({
            where: {
                userId_blogId: { userId, blogId }
            }
        });

        if (existingLike) {
            await this.prisma.$transaction([
                this.prisma.like.delete({ where: { id: existingLike.id } }),
                this.prisma.blog.update({
                    where: { id: blogId },
                    data: { likeCount: { decrement: 1 } }
                })
            ]);
            const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
            return { liked: false, likeCount: blog?.likeCount || 0 };
        } else {
            await this.prisma.$transaction([
                this.prisma.like.create({ data: { userId, blogId } }),
                this.prisma.blog.update({
                    where: { id: blogId },
                    data: { likeCount: { increment: 1 } }
                })
            ]);
            const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
            return { liked: true, likeCount: blog?.likeCount || 0 };
        }
    }
}
