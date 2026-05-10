import { Blog, User } from "@prisma/client";
import { BlogResponseDTO } from "../dto/BlogResponseDTO";
import { UserMapper } from "./UserMapper";

export class BlogMapper {
    static toResponseDTO(blog: Blog & { author?: User }): BlogResponseDTO {
        return {
            id: blog.id,
            title: blog.title,
            content: blog.content,
            image: blog.image,
            imagePublicId: blog.imagePublicId,
            authorId: blog.authorId,
            author: blog.author ? UserMapper.toResponseDTO(blog.author) : undefined,
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
            readingTime: blog.readingTime,
            likeCount: blog.likeCount
        };
    }

    static toResponseDTOList(blogs: (Blog & { author?: User })[]): BlogResponseDTO[] {
        return blogs.map(blog => this.toResponseDTO(blog));
    }
}
