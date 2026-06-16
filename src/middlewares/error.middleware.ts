import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../constants/statusCodes";

export interface CustomError extends Error {
    statusCode?: number;
    errors?: unknown;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";

    console.error(`[Error] ${statusCode} - ${message}`);
    if (err.stack) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        message,
        ...(err.errors ? { errors: err.errors } : {})
    });
};
