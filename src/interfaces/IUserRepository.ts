import type { User } from "@prisma/client";
import { SignupDTO } from "../dto/SignupDTO";

export interface IUserRepository {
    createUser(data: SignupDTO): Promise<User>;
    findUserByEmail(email: string): Promise<User | null>;
    updateUserPassword(email: string, password: string): Promise<void>;
}