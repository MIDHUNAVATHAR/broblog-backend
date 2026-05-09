import { PrismaClient,Otp } from "@prisma/client";
import { IOtpRepository } from "../interfaces/IOtpRepository";

export class OtpRepository implements IOtpRepository{
    private prisma: PrismaClient;

    constructor(prisma:PrismaClient){
        this.prisma = prisma;
    }

    async createOtp(email: string, otp: string, passwordHash: string): Promise<Otp> {
        /**
         * delete existing otp for this email if any
         */
        await this.prisma.otp.deleteMany({
            where : {email} 
        })

        const expiresAt = new Date(Date.now()+5*60*1000) ;//5 minutes

        return await this.prisma.otp.create({
            data:{
                email,otp,password:passwordHash,expiresAt
            }
        })
    }

   
     async findOtpByEmail(email: string): Promise<Otp | null> {
        return await this.prisma.otp.findFirst({
            where: {
                email,
                expiresAt: {
                    gt: new Date()
                }
            }
        });
    }

    async deleteOtpByEmail(email:string):Promise<void>{
        await this.prisma.otp.deleteMany({
            where:{email} 
        })
    }
}