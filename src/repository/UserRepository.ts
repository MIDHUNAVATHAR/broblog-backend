import { PrismaClient,User } from "@prisma/client";
import { IUserRepository } from "../interfaces/IUserRepository";
import { SignupDTO } from "../dto/SignupDTO";

export class UserRepository implements IUserRepository{
    private prisma: PrismaClient; 

    constructor(prisma:PrismaClient){
        this.prisma = prisma;
    }

    async createUser(data: SignupDTO): Promise<User> {
        return await this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password
            }
        })
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {email}
        })
    }

    async updateUserPassword(email: string, password: string): Promise<void> {
        await this.prisma.user.update({
            where: { email },
            data: { password }
        });
    }
}