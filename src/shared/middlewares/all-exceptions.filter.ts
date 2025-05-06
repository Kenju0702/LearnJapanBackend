import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import Logger from '../utils/Logger';  // Đảm bảo import đúng Logger

@Catch()  // Catch tất cả các loại lỗi
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception.status || 500;
    const message = exception.message || 'Internal Server Error';

    // Log lỗi vào file log
    Logger.error(`Request failed with status: ${status}, Message: ${message}, Stack: ${exception.stack}`);

    // Trả về lỗi chi tiết cho client (chỉ hiển thị stack trong môi trường dev)
    const errorResponse = {
      message,
      stack: process.env.NODE_ENV === 'development' ? exception.stack : undefined,
    };

    // Gửi phản hồi lỗi
    response.status(status).json({
      statusCode: status,
      message: message,
      path: request.url,
    });
  }
}
