import { AuthController } from "./controller/AuthController";
import { AuthService } from "./service/AuthService";
import { UserRepository } from "./repository/UserRepository";
import { OtpRepository } from "./repository/OtpRepository";
import { MailService } from "./service/MailService";
import { BlogRepository } from "./repository/BlogRepository";
import { BlogService } from "./service/BlogService";
import { BlogController } from "./controller/BlogController";
import { UploadController } from "./controller/UploadController";
import prisma from "./config/prisma";

const userRepository = new UserRepository(prisma);
const otpRepository = new OtpRepository(prisma);
const mailService = new MailService();
const authService = new AuthService(userRepository, otpRepository, mailService);
export const authController = new AuthController(authService);

const blogRepository = new BlogRepository(prisma);
const blogService = new BlogService(blogRepository);
export const blogController = new BlogController(blogService);

export const uploadController = new UploadController();