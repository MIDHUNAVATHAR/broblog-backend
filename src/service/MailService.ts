import nodemailer from "nodemailer";

export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async sendOtp(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Your OTP for Signup",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Verification Code</h2>
                    <p style="font-size: 16px; color: #555;">Hello,</p>
                    <p style="font-size: 16px; color: #555;">Use the following OTP to complete your signup process. This code is valid for 5 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4A90E2; background: #f0f7ff; padding: 10px 20px; border-radius: 5px;">${otp}</span>
                    </div>
                    <p style="font-size: 14px; color: #888; text-align: center;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send OTP email");
        }
    }

    async sendExistingUserEmail(email: string): Promise<void> {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Account Already Exists",
            text: `You already have an account with this email. Please log in instead.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Welcome Back!</h2>
                    <p style="font-size: 16px; color: #555;">Hello,</p>
                    <p style="font-size: 16px; color: #555;">It looks like you already have an account with us. Instead of creating a new one, you can simply log in to your existing account.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.CLIENT_URL}/login" style="font-size: 18px; font-weight: bold; color: #fff; background: #4A90E2; padding: 12px 25px; border-radius: 5px; text-decoration: none;">Login to Account</a>
                    </div>
                    <p style="font-size: 14px; color: #888; text-align: center;">If you didn't try to sign up, you can safely ignore this email.</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }

    async sendForgotPasswordOtp(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Reset Your Password - BroBlog",
            text: `Your password reset OTP is ${otp}. It will expire in 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Password Reset Code</h2>
                    <p style="font-size: 16px; color: #555;">Hello,</p>
                    <p style="font-size: 16px; color: #555;">You requested to reset your password. Use the following OTP to proceed. This code is valid for 5 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #E02424; background: #FFF5F5; padding: 10px 20px; border-radius: 5px; border: 1px solid #FEE2E2;">${otp}</span>
                    </div>
                    <p style="font-size: 14px; color: #888; text-align: center;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send password reset email");
        }
    }
}
