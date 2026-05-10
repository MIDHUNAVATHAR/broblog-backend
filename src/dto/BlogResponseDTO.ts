import { UserResponseDTO } from "./UserResponseDTO";

export interface BlogResponseDTO {
    id: string;
    title: string;
    content: string;
    image: string | null;
    imagePublicId: string | null;
    authorId: string;
    author?: UserResponseDTO;
    createdAt: Date;
    updatedAt: Date;
    readingTime: string | null;
    likeCount: number;
}
