import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal Server Error';
    if (exception instanceof HttpException) {
      this.logger.error(`exception is instead of HttpException`);
      statusCode = exception.getStatus();
      const resBody = exception.getResponse();
      errorMessage =
        typeof resBody === 'string' ? resBody : (resBody as any).message;
    } else {
      this.logger.error(
        `Exception is not insteadof HttpException. Exception: ${exception}}`,
      );
    }

    response.status(statusCode).json({
      statusCode,
      message: errorMessage,
      reqPath: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
