import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { IUserRepository } from "../interfaces/IUserRepository";
import { SignupDTO } from "../dto/SignupDTO";
import { LoginDTO } from "../dto/LoginDTO";

import { IOtpRepository } from "../interfaces/IOtpRepository";
import { MailService } from "./MailService";

export class AuthService {
    private userRepository: IUserRepository;
    private otpRepository: IOtpRepository;
    private mailService: MailService;

    constructor(userRepository: IUserRepository, otpRepository: IOtpRepository, mailService: MailService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.mailService = mailService;
    }

    async signup(data: SignupDTO) {
        /**
         * check email already exists
         */
        const existingUser = await this.userRepository.findUserByEmail(data.email);
        if (existingUser) {
            //silently handle this case by sending otp to email without creating new user
            await this.mailService.sendExistingUserEmail(data.email);
            return {
                message: "Otp send to your email"
            }
        }

        /**
         * generate a 6 digit otp
         */
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(data.password, 10);

        await this.otpRepository.createOtp(data.email, otp, hashedPassword);
        await this.mailService.sendOtp(data.email, otp);

        return { message: "Otp send to your email" };
    }

    async resendOtp(email: string) {
        const existingUser = await this.userRepository.findUserByEmail(email);
        if (existingUser) {
            await this.mailService.sendExistingUserEmail(email);
            return {
                message: "Otp send to your email"
            }
        }

        const otpRecord = await this.otpRepository.findOtpByEmail(email);
        if (!otpRecord) {
            throw new Error("Session expired. Please signup again");
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        await this.otpRepository.createOtp(email, newOtp, otpRecord.password || undefined);
        await this.mailService.sendOtp(email, newOtp);

        return { message: "New Otp send to your email" };
    }

    async verifyOtp(email: string, otp: string) {
        const otpRecord = await this.otpRepository.findOtpByEmail(email);
        if (!otpRecord) {
            throw new Error("Invaid or expired otp");
        }

        if (otpRecord.otp !== otp) {
            throw new Error("Incorrect OTP");
        }

        if (!otpRecord.password) {
            throw new Error("Invalid OTP session");
        }

        /**
         * otp is valid, create user and delete otp record
         */
        const newUser = await this.userRepository.createUser({
            email: otpRecord.email,
            password: otpRecord.password
        })

        await this.otpRepository.deleteOtpByEmail(email);

        return {
            id: newUser.id,
            email: newUser.email
        }
    }

    async login(data: LoginDTO) {
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
            user: {
                id: user.id,
                email: user.email
            },
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

    async forgotPassword(email: string) {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            // Silently return success to prevent email enumeration
            return { message: "Password reset OTP sent to your email" };
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.otpRepository.createOtp(email, otp);
        await this.mailService.sendForgotPasswordOtp(email, otp);

        return { message: "Password reset OTP sent to your email" };
    }

    async verifyForgotPasswordOtp(email: string, otp: string) {
        const otpRecord = await this.otpRepository.findOtpByEmail(email);
        if (!otpRecord || otpRecord.otp !== otp) {
            throw new Error("Invalid or expired OTP");
        }

        return { message: "OTP verified successfully" };
    }

    async resetPassword(email: string, otp: string, password: string) {
        const otpRecord = await this.otpRepository.findOtpByEmail(email);
        if (!otpRecord || otpRecord.otp !== otp) {
            throw new Error("Invalid or expired OTP");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userRepository.updateUserPassword(email, hashedPassword);
        await this.otpRepository.deleteOtpByEmail(email);

        return { message: "Password reset successful" };
    }
}