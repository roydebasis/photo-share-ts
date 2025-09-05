import { NextFunction, Request, Response } from 'express';
import IErrorMessage from '../interfaces/Error.Interface';


export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error);
}

export function errorHandler(
    err: Error, 
    req: Request, 
    res: Response<IErrorMessage>, 
    next: NextFunction
) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        stack: err.stack
    });
}