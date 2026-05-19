import { AuthController } from "./controller/AuthController";
import { AuthService } from "./service/AuthService";
import { UserRepository } from "./repository/UserRepository";
import { BlogRepository } from "./repository/BlogRepository";
import { BlogService } from "./service/BlogService";
import { BlogController } from "./controller/BlogController";
import { UploadController } from "./controller/UploadController";
import { UploadService } from "./service/UploadService";
import prisma from "./config/prisma";

const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);
export const authController = new AuthController(authService);

const blogRepository = new BlogRepository(prisma);
const blogService = new BlogService(blogRepository);
export const blogController = new BlogController(blogService);

const uploadService = new UploadService();
export const uploadController = new UploadController(uploadService);