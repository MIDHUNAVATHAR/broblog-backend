import { SignupDTO } from "../../dto/SignupDTO";
import { LoginDTO } from "../../dto/LoginDTO";
import { UserResponseDTO } from "../../dto/UserResponseDTO";

export interface IAuthService {
    signup(data: SignupDTO): Promise<UserResponseDTO & { message: string }>;
    login(data: LoginDTO): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }>;
    refreshToken(token: string): Promise<{ accessToken: string }>;
}
