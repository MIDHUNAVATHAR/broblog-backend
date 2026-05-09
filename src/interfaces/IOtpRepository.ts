import {Otp} from "@prisma/client"

export interface IOtpRepository {
    createOtp(email:string,otp:string,passwordHash:string):Promise<Otp>;
    findOtpByEmail(email:string):Promise<Otp|null>;
    deleteOtpByEmail(email:string):Promise<void>; 
}