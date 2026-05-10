import { User } from "@prisma/client";
import { UserResponseDTO } from "../dto/UserResponseDTO";

export class UserMapper {
    static toResponseDTO(user: User): UserResponseDTO {
        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}
