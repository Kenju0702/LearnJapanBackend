import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  // Kiểm tra môi trường để chỉ hiển thị chi tiết lỗi trong môi trường phát triển
  const isDev = process.env.NODE_ENV === 'development';

  // Ghi lỗi ra console
  console.error(err.stack);

  // Xác định mã lỗi, có thể thay đổi tùy thuộc vào loại lỗi
  const statusCode = err instanceof Error && err.name === 'NotFoundError' ? 404 : 500;
  
  // Trả về thông báo lỗi chi tiết trong môi trường phát triển
  const errorResponse = {
    message: err.message,
    stack: isDev ? err.stack : undefined, // Chỉ trả stack trace khi ở môi trường dev
  };

  // Gửi phản hồi với mã lỗi và thông tin chi tiết
  res.status(statusCode).json(errorResponse);
};
