import {
    Catch,
    ExceptionFilter,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Custom exception filter to handle Multer validation errors
@Catch(Error)
export class MulterExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Check if the error is a Multer validation error
        if (exception.message.includes('MulterError')) {
            const errorMessage = exception.message;

            // Return custom error message
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: errorMessage,
                error: 'File upload error',
                path: request.url,
            });
        }

        // Fallback for other types of errors
        return response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: exception.message,
            error: 'Internal Server Error',
        });
    }
}
