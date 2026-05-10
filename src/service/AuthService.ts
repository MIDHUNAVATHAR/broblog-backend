import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { IUserRepository } from "../interfaces/IUserRepository";
import { SignupDTO } from "../dto/SignupDTO";
import { LoginDTO } from "../dto/LoginDTO";
import { UserResponseDTO } from "../dto/UserResponseDTO";
import { UserMapper } from "../mappers/UserMapper";


export class AuthService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async signup(data: SignupDTO): Promise<UserResponseDTO & { message: string }> {
        const existingUser = await this.userRepository.findUserByEmail(data.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await this.userRepository.createUser({
            email: data.email,
            password: hashedPassword
        });

        return {
            ...UserMapper.toResponseDTO(newUser),
            message: "User created successfully"
        };
    }



    async login(data: LoginDTO): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }> {
        const user = await this.userRepository.findUserByEmail(data.email);
        if (!user) {
            throw new Error("Invalid credentials")
        }

        const isPasswordMatch = await bcrypt.compare(data.password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Invalid credentials");
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: "15m" }
        )
        const refreshToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: "7d" }
        )
        return {
            user: UserMapper.toResponseDTO(user),
            accessToken,
            refreshToken
        }
    }

    async refreshToken(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;
            const user = await this.userRepository.findUserByEmail(decoded.email);

            if (!user) {
                throw new Error("User not found");
            }

            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_ACCESS_SECRET as string,
                { expiresIn: "15m" }
            );

            return { accessToken };
        } catch (error) {
            throw new Error("Invalid refresh token");
        }
    }


}