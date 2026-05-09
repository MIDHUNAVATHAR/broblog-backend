import { AuthController } from "./controller/AuthController";
import { AuthService } from "./service/AuthService";
import { UserRepository } from "./repository/UserRepository";

import {OtpRepository} from "./repository/OtpRepository" 
import {MailService} from "./service/MailService"; 
import prisma from "./config/prisma"; 


const userRepository = new UserRepository(prisma);
const otpRepository = new OtpRepository(prisma);
const mailService = new MailService();
const authService = new AuthService(userRepository,otpRepository,mailService);
export const authController = new AuthController(authService);